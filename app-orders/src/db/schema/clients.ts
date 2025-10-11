import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const clients = pgTable('clients', {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
})