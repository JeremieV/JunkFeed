import Upvote from "@/components/upvote-button";
import type { fetchRSS } from "@/lib/fetchFeed";
import { displayTimeAgo, displayUrl } from "@/lib/helpers";
import type { FeedEntry } from "@extractus/feed-extractor";
import { usePathname } from "next/navigation";

export default function ListView({ currentStories }: { currentStories: { entry: FeedEntry, feed: Awaited<ReturnType<typeof fetchRSS>> }[], currentPage: number }) {
  const isFeedRoute = usePathname().startsWith('/feed/')

  return (
    <div className="overflow-hidden mb-4">
      {currentStories.map(({ entry: story, feed }) => (
        <div key={story.link} className='flex flex-col py-2 px-[1px] items-start'>
          <a href={story.link ?? ''} target="_blank" title={story.description ?? ''} rel="noopener noreferrer" className='hover:underline text-foreground line-clamp-3'>{story.title}</a>
          <div className='text-muted-foreground text-sm space-x-1 line-clamp-1 text-ellipsis'>
            {/* TODO replace story.link with feed url */}
            {displayUrl(story.link ?? '') !== displayUrl(feed.link ?? '') &&
              <>
                <span className="hover:text-primary transition-colors">{displayUrl(story.link ?? '')}</span>
                {!isFeedRoute && <span>/</span>}
              </>
            }
            {!isFeedRoute &&
              <>
                <a href={`/feed/${encodeURIComponent(feed.feedUrl)}`} className="hover:text-primary transition-colors">{feed.title}</a>
                <span className="mx-1">{`•`}</span>
              </>
            }
            <Upvote item={story} feedUrl={feed.feedUrl} />
            <span className="mx-1">{`•`}</span><span>{displayTimeAgo(story.published ?? '')}</span>
          </div>
        </div>
      ))}
    </div>
  )
}