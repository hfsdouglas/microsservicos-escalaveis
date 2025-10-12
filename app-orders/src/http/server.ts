import z from "zod";
import fastify from "fastify";
import { eq } from "drizzle-orm";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";

import { db } from "../lib/drizzle.ts";
import { schema } from "../db/schema/index.ts";

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

    await db.insert(schema.orders).values({
        clientId,
        amount
    })

    return reply.status(201).send()
})

app.listen({ port: 3333 }).then(() => {
    console.log("HTTP Server is running! 🚀")
})