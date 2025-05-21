CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"original_URL" text NOT NULL,
	"short_URL" text NOT NULL,
	"accessCount" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
