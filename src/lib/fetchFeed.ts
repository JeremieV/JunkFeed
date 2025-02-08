"use server"

import { extract, FeedData } from '@extractus/feed-extractor'
import { fetchAndParseOPML, type Folder } from './opml'

export async function fetchRSS(url: string) {
  const result = await extract(url, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getExtraEntryFields: (entry: any): { thumbnail: string } => {
      try {
        // console.log(entry)
        // parse the eventual enclosure
        if (entry['enclosure']?.['@_type']?.startsWith('image/') || !entry['enclosure']?.['@_type']) {
          if (entry['enclosure']?.['@_url']) return { thumbnail: entry['enclosure']['@_url'] }
        }
        // find media:thumbnail or media:content either at the root or in media:group
        for (const e of [entry, entry['media:group']]) {
          if (e === undefined) continue
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

        // Check for an iTunes image (commonly used in podcast feeds).
        const itunesImage = entry['itunes:image'];
        if (itunesImage) {
          if (Array.isArray(itunesImage)) {
            for (const img of itunesImage) {
              if (img?.['@_href']) {
                return { thumbnail: img['@_href'] };
              }
            }
          } else if (itunesImage?.['@_href']) {
            return { thumbnail: itunesImage['@_href'] };
          }
        }

        // // Check for an "image" tag
        // const imageField = entry['image'];
        // console.log(imageField)
        // if (imageField?.url) {
        //   return { thumbnail: imageField.url };
        // }

        // As a fallback, attempt to extract the first image from HTML content
        // found in either "content:encoded" or "description".
        const htmlContent = entry['content:encoded'] || entry['description'];
        if (htmlContent && typeof htmlContent === 'string') {
          const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (imgMatch && imgMatch[1]) {
            return { thumbnail: imgMatch[1] };
          }
        }
      } catch (e) {
        console.error('Failed to extract thumbnail')
        console.error(e)
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
