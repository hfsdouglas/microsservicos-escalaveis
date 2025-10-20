import { text, decimal, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const invoices = pgTable('invoices', {
    id: uuid().primaryKey().defaultRandom(),
    client: text().notNull(), 
    amount: decimal({ scale: 2 }).notNull(),
    createdAt: timestamp().default(new Date())
})