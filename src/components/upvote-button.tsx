'use client'

import { add_upvote, get_item_uuid, get_upvotes } from "@/lib/actions"
import { upvotesAtom } from "@/state"
import { FeedEntry } from "@extractus/feed-extractor"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai/react"

export default function Upvote({ item, feedUrl }: {
  item: FeedEntry,
  feedUrl: string
}) {
  const queryClient = useQueryClient()
  const [upvotes, setUpvotes] = useAtom(upvotesAtom)

  const upvotesQ = useQuery({
    queryKey: ['upvotes', item.link, feedUrl],
    queryFn: async () => {
      const item_uuid = await get_item_uuid(item, feedUrl)
      if (!item_uuid) return {
        item_uuid,
        hasUpvoted: false,
        upvotes: 0
      }
      return {
        item_uuid,
        hasUpvoted: upvotes.includes(item_uuid),
        upvotes: await get_upvotes(item_uuid)
      }
    },
    staleTime: 10
  })

  return (
    <button
      title="+1"
      className={`${upvotesQ.data?.hasUpvoted ? 'text-primary' : 'text-muted-foreground'} hover:text-primary z-30`}
      onClick={async (e) => {
        e.preventDefault()
        if (!upvotesQ.isSuccess) return;
        // cannot remove an upvote for now
        const uuid = upvotesQ.data?.item_uuid
        setUpvotes(upvotes => upvotesQ.data?.hasUpvoted
          ? upvotes
          : uuid ? [uuid, ...upvotes] : upvotes)
        // if this is the first time upvoting, add to telemetry
        if (!upvotesQ.data?.hasUpvoted) {
          await add_upvote(item, feedUrl)
        }
        queryClient.invalidateQueries({ queryKey: ['upvotes', item.link, feedUrl] })
      }}
      disabled={!upvotesQ.isSuccess}
    >
      {upvotesQ.isSuccess
        ? upvotesQ.data.upvotes + (upvotesQ.data?.hasUpvoted ? 1 : 0)
        : '_'} upvotes
    </button>
  )
}