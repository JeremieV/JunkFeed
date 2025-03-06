'use server'

/**
 * Telemetry functions while I don't have user accounts
 */

import { db } from "@/db";
import { clicksTelemetry, feeds, followsTelemetry, items, searchesTelemetry, upvotesTelemetry } from "@/db/schema";
import { FeedEntry } from "@extractus/feed-extractor";
import { fetchFeed } from "./fetchClient";
import { count, eq, sql } from "drizzle-orm";

export async function add_search(term: string) {
  await db.insert(searchesTelemetry)
    .values({ searchTerm: term })
    .execute();
}

export async function add_follow(feedUrl: string) {
  await db.insert(followsTelemetry)
    .values({ feedUrl })
    .execute();

  // add the feed to the database

  const result = await fetchFeed(feedUrl)
  if (result.feedData[0].status !== 'fulfilled') return;
  const feed = result.feedData[0].value

  await db.insert(feeds)
    .values({
      url: feedUrl,
      title: feed.title,
      description: feed.description,
      language: feed.language,
      link: feed.link,
      published: feed.published || null
    })
    .execute();
}

export async function get_item(item: FeedEntry, feedUrl: string) {
  if (!item.link) return;

  // if the item does not exist in the database, add it, else return the uuid
  const r = await db.insert(items)
    .values({
      url: item.link,
      feedUrl: feedUrl,
      title: item.title,
      description: item.description,
      // @ts-ignore I enrich the entries with thumbnails manually in fetchFeed
      image: item.thumbnail,
    })
    .onConflictDoUpdate({
      target: [items.url, items.feedUrl],
      set: { feedUrl } // no-op update, to return the id
    })
    .returning()
    .execute();

  return r[0]
}

export async function add_click(item: FeedEntry, feedUrl: string) {
  // if the item does not exist in the database, add it
  const i = await get_item(item, feedUrl)
  if (!i) return;

  await db.insert(clicksTelemetry)
    .values({ itemId: i.id })
    .execute();
}

export async function add_upvote(item: FeedEntry, feedUrl: string) {
  // if the item does not exist in the database, add it
  const i = await get_item(item, feedUrl)
  if (!i) return;

  await db.update(items)
    .set({ upvoteCount: sql`${items.upvoteCount} + 1` })
    .where(eq(items.id, i.id))
    .execute();
  await db.insert(upvotesTelemetry)
    .values({ itemId: i.id })
    .execute();
}

export async function get_upvotes(item_id: string) {
  const r = await db.select({
    count: count()
  })
  .from(upvotesTelemetry)
  .where(eq(upvotesTelemetry.itemId, item_id))

  return r[0]?.count || 0
}
