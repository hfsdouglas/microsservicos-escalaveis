import z from "zod";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";

import { db } from "../lib/drizzle.ts";
import { schema } from "../db/schema/index.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get('/hello', () => {
    return "Hello World"
})

app.listen({ port: 3333 }).then(() => {
    console.log("Server is running on port 3333!")
})