import '../broker/subscriber.ts'

import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
    origin: '*'
})

app.get('/health', () => {
    console.log('bateu')

    return 'OK'
})

app.listen({ port: 3001 }).then(() => {
    console.log(`[Invoices] HTTP server is running! 🚀`)
})