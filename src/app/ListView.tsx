import { displayTimeAgo, displayUrl } from "@/lib/helpers";
import type { FeedEntry } from "@extractus/feed-extractor";

export default function ListView({ currentStories }: { currentStories: FeedEntry[], currentPage: number }) {
  return (
    <div className="overflow-hidden mb-4">
      {currentStories.map((story) => (
        <a
          key={story.id}
          href={story?.link}
          target="_blank"
          title={story.title}
          rel="noopener noreferrer"
          className="flex py-2"
        >
          <div className='flex flex-col'>
            <span className='hover:underline text-foreground line-clamp-3'>{story.title}</span>
            <div className='text-muted-foreground text-sm flex'>
              <div title={story.link} className="hover:text-primary transition-colors">{displayUrl(story.link ?? '')}</div>
              <span className="mx-1">{`•`}</span><span>{displayTimeAgo(story?.published ?? 0)}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}