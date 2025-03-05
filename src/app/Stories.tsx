"use client"

import { Fragment, useState } from "react";
import GridView from "./GridView"
import ListView from "./ListView"
import BottomBar from "./BottomBar"
import LoadingIndicator from "@/components/LoadingIndicator";
import { gridviewAtom } from '@/state';
import { useAtom } from 'jotai/react';
import { useFeeds } from '@/lib/queries';

export default function Stories({ feeds }: { feeds: string[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [gridview] = useAtom(gridviewAtom)

  const { data: feedResults, isPending, isError } = useFeeds(feeds)

  const storiesPerPage = 60

  if (isPending) {
    return <LoadingIndicator />
  }

  if (isError) {
    return (
      <div className="w-full text-center py-4">
        <p className="text-red-500">Failed to fetch feeds</p>
      </div>
    )
  }

  const stories = feedResults
    .flatMap((r) => r.feedData)
    .flatMap((f) => f.status === 'fulfilled' ? f.value?.entries?.map(e => ({ entry: e, feed: f.value })) : [])
    .toSorted((a, b) => new Date(b?.entry?.published ?? 0).getTime() - new Date(a?.entry?.published ?? 0).getTime())
    .filter((entry) => entry !== undefined)

  const indexOfLastStory = currentPage * storiesPerPage
  const indexOfFirstStory = indexOfLastStory - storiesPerPage
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory)
  const totalPages = Math.ceil(stories.length / storiesPerPage)

  return (
    <Fragment>
      {stories.length > 0
        ? gridview
          ? <GridView currentStories={currentStories} />
          : <ListView currentStories={currentStories} currentPage={currentPage} />
        : <p className="text-muted-foreground text-center h-full flex flex-col justify-center">Your feed is empty.</p>
      }
      {stories.length > 0 && <BottomBar currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage} />}
    </Fragment>
  )
}
