CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client" text NOT NULL,
	"amount" numeric NOT NULL,
	"createdAt" timestamp DEFAULT '2025-10-12 20:42:16.539'
);
