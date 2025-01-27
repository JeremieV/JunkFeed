"use client"

import { displayTimeAgo, displayUrl } from "@/lib/helpers"
import Thumbnail from "./Thumbnail"
// import { Skeleton } from "@/components/ui/skeleton"
import { FeedEntry } from "@extractus/feed-extractor"

export default function GridView({ currentStories }: { currentStories: FeedEntry[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {currentStories.map((story) => (
        <GridComponent key={story.id} story={story} />
      ))}
    </div>
  )
}

function GridComponent({ story }: { story: FeedEntry }) {

  return (
    <a
      key={story.id}
      href={story.link}
      title={story.title}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-md"
    >
      <div className='aspect-video w-full overflow-hidden' title={story.description}>
        {/* @ts-expect-error i enrich the entries with thumbnails manually in fetchFeed */}
        {story.thumbnail ?
          // eslint-disable-next-line @next/next/no-img-element
          <img
            // @ts-expect-error i enrich the entries with thumbnails manually in fetchFeed
            src={story.thumbnail}
            alt={story.title}
            className="w-full h-full object-cover rounded-md"
          />
          :
          <Thumbnail title={story.title ?? ''} />
        }
      </div>
      <div className="flex">
        <div className='pt-3 min-w-10'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://icons.duckduckgo.com/ip3/${encodeURIComponent(new URL(story.link ?? '').hostname)}.ico`}
            alt=""
            className="aspect-square rounded-md w-10 h-10 object-cover" />
        </div>
        <div className="p-3 flex flex-col gap-1">
          <h2 className="font-semibold text-foreground line-clamp-2">{story.title}</h2>
          <div className="text-sm text-muted-foreground flex flex-col gap-1">
            <div title={story.link} className="hover:text-primary transition-colors">{displayUrl(story.link ?? '')}</div>
            <span>{displayTimeAgo(story.published ?? 0)}</span>
          </div>
        </div>
      </div>
    </a>
  )
}

// function GridComponentSkeleton() {
//   return (
//     <div className="block rounded-md text-transparent">
//       <div className='aspect-video w-full overflow-hidden'>
//         <Skeleton className="w-full h-full object-cover rounded-md" />
//       </div>
//       <div className="flex">
//         <div className='pt-3 min-w-10'>
//           <Skeleton className='aspect-square rounded-md w-10 h-10 object-cover'></Skeleton>
//         </div>
//         <div className="p-3 flex flex-col gap-1">
//           <Skeleton className="font-semibold line-clamp-2 flex w-full">Pretending to be a title and to be a long title</Skeleton>
//           <div className="text-sm flex flex-col gap-1 max-w-[50%]">
//             <Skeleton>host</Skeleton>
//             <Skeleton>date skeleton</Skeleton>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }