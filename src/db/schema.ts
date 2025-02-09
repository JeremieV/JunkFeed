import { pgTable, text, timestamp, unique, uuid, integer, serial, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const feeds = pgTable("feeds", {
	url: text().primaryKey().notNull(),
	title: text(),
	description: text(),
	language: text(),
	link: text(),
	published: timestamp({ withTimezone: true, mode: 'string' }),
	added: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const items = pgTable("items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	url: text().notNull(),
	feedUrl: text("feed_url").notNull(),
	title: text(),
	description: text(),
	image: text(),
	added: timestamp({ withTimezone: true, mode: 'string' }),
	upvoteCount: integer("upvote_count").default(0),
}, (table) => [
	unique("items_url_feed_url_key").on(table.url, table.feedUrl),
]);

export const searchesTelemetry = pgTable("searches_telemetry", {
	id: serial().primaryKey().notNull(),
	searchTerm: text("search_term").notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const followsTelemetry = pgTable("follows_telemetry", {
	id: serial().primaryKey().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	feedUrl: text("feed_url").notNull(),
});

export const clicksTelemetry = pgTable("clicks_telemetry", {
	id: serial().primaryKey().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	itemId: uuid("item_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.itemId],
			foreignColumns: [items.id],
			name: "clicks_telemetry_item_id_fkey"
		}),
]);

export const upvotesTelemetry = pgTable("upvotes_telemetry", {
	id: serial().primaryKey().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	itemId: uuid("item_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.itemId],
			foreignColumns: [items.id],
			name: "upvotes_telemetry_item_id_fkey"
		}),
]);
