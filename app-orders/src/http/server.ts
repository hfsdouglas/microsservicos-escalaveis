import '@opentelemetry/auto-instrumentations-node/register'

import z from "zod";
import fastify from "fastify";
import { eq } from "drizzle-orm";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { trace } from '@opentelemetry/api'

import { db } from "../lib/drizzle.ts";
import { schema } from "../db/schema/index.ts";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";
import { tracer } from '../tracer/tracer.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.post('/orders', {
    schema: {
        body: z.object({
            amount: z.coerce.number().transform((n) => n.toFixed(2)), // O PG aceita apenas string para tipos decimais. 
            clientId: z.uuid()
        })
    }
}, async (request, reply) => {
    const { amount, clientId } = request.body

    const client = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId))

    if (client.length === 0) {
        return reply.status(404).send({
            'message': 'Client not found!'
        })
    }

    const order = await db
        .insert(schema.orders)
        .values({
            clientId,
            amount
        })
        .returning()

    trace.getActiveSpan()?.setAttribute('order_id', order[0].id)

    dispatchOrderCreated({
        orderId: order[0].id, 
        amount: Number(order[0].amount), 
        client: {
            id: order[0].clientId
        }
    })

    return reply.status(201).send()
})

app.listen({ port: 3000 }).then(() => {
    console.log("[Orders] HTTP Server is running! 🚀")
})