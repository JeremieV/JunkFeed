import { add_upvote } from "@/lib/actions"
import { FeedEntry } from "@extractus/feed-extractor"

export default function Upvote({ item, feedUrl }: {
  item: FeedEntry,
  feedUrl: string
}) {
  const upvoted = false
  const count = 0
  const have_upvoted = false

  return (
    <button
      title="+1"
      className={`${upvoted ? 'text-primary' : 'text-muted-foreground'} hover:text-primary z-30`}
      onClick={(e) => {
        e.preventDefault()
        add_upvote(item, feedUrl)
      }}
    >
      {count} upvotes
    </button >
  )
}