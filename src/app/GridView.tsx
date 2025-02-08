"use client"

import { displayTimeAgo, displayUrl } from "@/lib/helpers"
import { Skeleton } from "@/components/ui/skeleton"
import { FeedEntry } from "@extractus/feed-extractor"
import { useQuery } from "@tanstack/react-query"

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
  const metadataQ = useQuery({
    queryKey: ['page-meta', story.link],
    queryFn: async () => {
      // @ts-expect-error i enrich the entries with thumbnails manually in fetchFeed
      if (story.thumbnail) return story.thumbnail
      const r = await fetch(`/api/metadata?url=${encodeURIComponent(story.link ?? '')}`)
      const json = await r.json()
      return json.image || '' as string
    }
  })

  return (
    <a
      key={story.id}
      href={story.link}
      title={story.title}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-md"
    >
      <div className='aspect-video w-full overflow-hidden rounded-xl' title={story.description}>
        {metadataQ.data
          ?
          <img src={metadataQ.data} alt={story.title} className="w-full h-full object-cover bg-muted/50" />
          : metadataQ.isLoading
            ? <Skeleton className="w-full h-full object-cover rounded-md" />
            : <div className="relative w-full h-full overflow-hidden bg-muted/50" />
        }
      </div>
      <div className="flex">
        <div className='pt-3 min-w-10'>
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