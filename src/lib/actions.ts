/**
 * Telemetry functions while I don't have user accounts
 */

import { db } from "@/db";
import { clicksTelemetry, feeds, followsTelemetry, items, searchesTelemetry, upvotesTelemetry } from "@/db/schema";
import { FeedData, FeedEntry } from "@extractus/feed-extractor";
import { fetchFeed } from "./fetchClient";

export function add_search(term: string) {
  db.insert(searchesTelemetry)
    .values({ searchTerm: term })
    .execute();
}

export async function add_follow(feedUrl: string) {
  db.insert(followsTelemetry)
    .values({ feedUrl })
    .execute();

  // add the feed to the database

  const result = await fetchFeed(feedUrl)
  if (result.feedData[0].status !== 'fulfilled') return;
  const feed = result.feedData[0].value

  db.insert(feeds)
    .values({
      url: feedUrl,
      title: feed.title,
      description: feed.description,
      language: feed.language,
      link: feed.link,
      published: feed.published
    })
    .execute();
}

export async function get_item_uuid(item: FeedEntry, feedUrl: string) {
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
    .onConflictDoNothing()
    .returning({ id: items.id })
    .execute();

  return r[0].id
}

export async function add_click(item: FeedEntry, feedUrl: string) {
  // if the item does not exist in the database, add it
  const itemId = await get_item_uuid(item, feedUrl)
  if (!itemId) return;

  db.insert(clicksTelemetry)
    .values({ itemId })
    .execute();
}

export async function add_upvote(item: FeedEntry, feedUrl: string) {
  // if the item does not exist in the database, add it
  const itemId = await get_item_uuid(item, feedUrl)
  if (!itemId) return;

  db.insert(upvotesTelemetry)
    .values({ itemId })
    .execute();
}
