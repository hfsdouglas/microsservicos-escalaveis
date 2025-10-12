import { decimal, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core"

import { clients } from "./clients.ts"

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'canceled'
])

export const orders = pgTable('orders', {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid().notNull().references(() => clients.id),
  amount: decimal({ scale: 2 }).notNull(),
  status: orderStatusEnum().notNull().default('pending'),
  createdAt: timestamp().defaultNow().notNull(),
})