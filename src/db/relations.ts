import { relations } from "drizzle-orm/relations";
import { items, clicksTelemetry, upvotesTelemetry } from "./schema";

export const clicksTelemetryRelations = relations(clicksTelemetry, ({one}) => ({
	item: one(items, {
		fields: [clicksTelemetry.itemId],
		references: [items.id]
	}),
}));

export const itemsRelations = relations(items, ({many}) => ({
	clicksTelemetries: many(clicksTelemetry),
	upvotesTelemetries: many(upvotesTelemetry),
}));

export const upvotesTelemetryRelations = relations(upvotesTelemetry, ({one}) => ({
	item: one(items, {
		fields: [upvotesTelemetry.itemId],
		references: [items.id]
	}),
}));