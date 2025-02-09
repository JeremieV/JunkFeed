import { FeedData } from '@extractus/feed-extractor'
import { fetchAndParseOPML, type Folder } from './opml'
import { fetchRSS } from './fetchFeed';

export async function fetchFeed(url: string): Promise<{
  type: 'opml' | 'feed';
  feedUrl: string;
  folders?: Folder[];
  feedData: PromiseSettledResult<Awaited<ReturnType<typeof fetchRSS>>>[];
}> {
  if (url.endsWith('.opml')) {
    // fetch & parse opml
    const result = await fetchAndParseOPML(url)
    // get all the feeds along with their folders
    return {
      type: 'opml',
      feedUrl: url,
      folders: result.folders,
      feedData: await Promise.allSettled(
        result.feeds.map((feed) => fetchRSS(feed.url))
      )
    }
  }
  return {
    type: 'feed',
    feedUrl: url,
    feedData: await Promise.allSettled([url].map((feed) => fetchRSS(feed)))
  }
}