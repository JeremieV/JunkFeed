'use client'

import { add_upvote, get_item, get_upvotes } from "@/lib/actions"
import { upvotesAtom } from "@/state"
import { FeedEntry } from "@extractus/feed-extractor"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
      const dbi = await get_item(item, feedUrl)
      if (!dbi) return {
        // hasUpvoted: false,
        dbi
      }
      return {
        // hasUpvoted: upvotes.includes(dbi.id),
        dbi
      }
    },
    staleTime: 10
  })

  const upvotesM = useMutation({
    mutationKey: ['upvotes'],
    mutationFn: async () => {
      if (!upvotesQ.isSuccess) return;
      // cannot remove an upvote for now
      const uuid = upvotesQ.data?.dbi?.id
      setUpvotes(upvotes => hasUpvoted()
        ? upvotes
        : uuid ? [uuid, ...upvotes] : upvotes)
      // if this is the first time upvoting, add to telemetry
      if (!hasUpvoted()) {
        await add_upvote(item, feedUrl)
      }
      queryClient.invalidateQueries({ queryKey: ['upvotes', item.link, feedUrl] })
    }
  })

  const hasUpvoted = () => upvotesQ.data?.dbi?.id && upvotes.includes(upvotesQ.data?.dbi?.id)

  return (
    <button
      title="+1"
      className={`${hasUpvoted() ? 'text-primary' : 'text-muted-foreground'} hover:text-primary z-30`}
      onClick={async (e) => {
        e.preventDefault()
        if (upvotesM.isPending || upvotesQ.isFetching) return;
        upvotesM.mutate()
      }}
      disabled={upvotesM.isPending || upvotesQ.isFetching}
    >
      {upvotesQ.isSuccess
        ? (upvotesQ.data.dbi?.upvoteCount ?? 0)
        : '_'} upvotes
    </button>
  )
}