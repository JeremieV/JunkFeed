import { FeedData } from '@extractus/feed-extractor'
import { fetchAndParseOPML, type Folder } from './opml'
import { fetchRSS } from './fetchFeed';

export async function fetchFeed(url: string): Promise<{
  type: 'opml' | 'feed';
  folders?: Folder[];
  feedData: PromiseSettledResult<FeedData>[];
}> {
  if (url.endsWith('.opml')) {
    // fetch & parse opml
    const result = await fetchAndParseOPML(url)
    // get all the feeds along with their folders
    return {
      type: 'opml',
      folders: result.folders,
      feedData: await Promise.allSettled(
        result.feeds.map((feed) => fetchRSS(feed.url))
      )
    }
  }
  return {
    type: 'feed',
    feedData: await Promise.allSettled([url].map((feed) => fetchRSS(feed)))
  }
}