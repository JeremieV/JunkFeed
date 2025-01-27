"use server"

import { extract } from '@extractus/feed-extractor'

export async function fetchFeed(url: string) {
  const result = await extract(url, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getExtraEntryFields: (entry: any): { thumbnail: string } => {
      try {
        // parse the eventual enclosure
        if (entry['enclosure']?.['@_type']?.startsWith('image/') || !entry['enclosure']?.['@_type']) {
          if (entry['enclosure']?.['@_url']) return { thumbnail: entry['enclosure']['@_url'] }
        }
        // find media:thumbnail or media:content either at the root or in media:group
        for (const e of [entry, entry['media:group']]) {
          // parse the eventual media:thumbnail
          const mediaThumbnail = e['media:thumbnail']
          if (mediaThumbnail?.['@_url']) {
            return { thumbnail: mediaThumbnail['@_url'] }
          }
          // parse the eventual media:content
          const mediaContent = e['media:content']
          if (mediaContent?.['@_type']?.startsWith('image/') && mediaContent?.['@_url']) {
            return { thumbnail: mediaContent['@_url'] }
          }
        }
      } catch (e) {
        console.error('Failed to extract thumbnail')
        // console.error(e)
        // console.error(entry)
      }
      return {
        thumbnail: ''
      }
    }
  }, {
    // TODO check that the caching is working
    // @ts-expect-error cache for one hour, option specific to nextjs
    next: { revalidate: 60 * 60 },
    signal: AbortSignal.timeout(5_000), // controls the timeout
  })
  return result
}
