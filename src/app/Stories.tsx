"use client"

import { useQuery } from '@tanstack/react-query';
import { Fragment, useState } from "react";
import GridView from "./GridView"
import ListView from "./ListView"
import { fetchFeed } from '@/lib/fetchFeed'
import BottomBar from "./BottomBar"
import LoadingIndicator from "@/components/LoadingIndicator";
import { gridviewAtom } from '@/state';
import { useAtom } from 'jotai/react';

export default function Stories({ feeds }: { feeds: string[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [gridview] = useAtom(gridviewAtom)

  const { data: feedResults, isPending, isError } = useQuery({
    queryKey: ['feeds', feeds],
    queryFn: () => Promise.allSettled(
      feeds.map((feed) => fetchFeed(feed))
    ),
  });

  const storiesPerPage = 60

  if (feeds.length === 0) {
    return (
      <div className="w-full text-center py-4 grow flex flex-col justify-center">
        <p className="text-muted-foreground">Welcome to the open feed reader!</p>
        <p className="text-muted-foreground">Here you can build any feed you like. To save it, simply bookmark the resulting URL.</p>
        <p className="text-muted-foreground">Add some feeds to get started. We also support Reddit, Medium, Substack and YouTube URLs.</p>
        <p>Some examples:</p>
        <div>
          <a href="">Bloomberg</a>
        </div>
      </div>
    )
  }

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
    .flatMap((f) => f.status === 'fulfilled' ? f.value.entries : [])
    .toSorted((a, b) => new Date(b?.published ?? 0).getTime() - new Date(a?.published ?? 0).getTime())
    .filter((entry) => entry !== undefined)

  const indexOfLastStory = currentPage * storiesPerPage
  const indexOfFirstStory = indexOfLastStory - storiesPerPage
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory)
  const totalPages = Math.ceil(stories.length / storiesPerPage)

  return (
    <Fragment>
      {gridview ? (
        <GridView currentStories={currentStories} />
      ) : (
        <ListView currentStories={currentStories} currentPage={currentPage} />
      )}
      <BottomBar currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage} />
    </Fragment>
  )
}
