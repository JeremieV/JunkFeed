"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { urlToRSS } from "@/lib/helpers"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from 'react'
import Stories from "../Stories"
import { useQuery } from "@tanstack/react-query"
import LoadingIndicator from "@/components/LoadingIndicator"
import { feedSearch } from "@/lib/server"
import { FeedsList } from "@/components/feed-display"
import { add_search } from "@/lib/actions"

function isValidUrl(url: string) {
  try { new URL(url); return true } catch { return false }
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Page() {
  const router = useRouter()

  const [inputValue, setInputValue] = useState('')
  const debouncedInputValue = useDebounce(inputValue, 200)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onEnter()
    }
  }

  async function onEnter() {
    if (isValidUrl(inputValue)) {
      router.push(`/feed/${encodeURIComponent(await urlToRSS(inputValue))}`)
      return
    }
  }

  // will run once on component mount
  useEffect(() => {
    // Focus on text input 
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debouncedInputValue)
      add_search(debouncedInputValue)
  }, [debouncedInputValue])

  return (
    <div className="mb-6">
      <div className="flex w-full items-center space-x-2 my-2">
        <Input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter feed URL"
        />
        <Button variant={"secondary"} className="mx-0" onClick={() => onEnter()}>
          <Search size={20} strokeWidth={1.2} className="md:mx-1" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      <div>
        <p className="text-muted-foreground text-sm">
          We support URLs to RSS, Atom, JSON, Reddit, Medium, Substack and YouTube.
        </p>
      </div>
      {/* feeds list */}
      {/* <div className="flex flex-wrap gap-2 mr-2 items-center">
        {feeds.map(f => (
          <Badge
            key={f}
            title={f}
            variant={"outline"}
            className={`cursor-pointer transition-all bg-background text-foreground hover:bg-primary/10 gap-2`}
          >
            <span>{displayUrl(f)}</span>
            <button className="text-muted-foreground" onClick={() => setFeeds(feeds.filter(x => x !== f))}><X height={18} width={18} /></button>
            </Badge>
          ))}
        </div> */}
      {debouncedInputValue && (
        <>
          <h2 className="text-2xl font-bold pt-6">Feeds</h2>
          <p className="pb-8">Our feed search is powered by <a className="underline" href="https://feedsearch.dev">Feedsearch</a> (must enter a valid URL or domain name)</p>
          {/* TODO - behaviour: if url to a feed, go to page directly, else if url, use this api  */}
          <FeedResults term={debouncedInputValue} />
          <h2 className="text-2xl font-bold pt-6">Articles</h2>
          <p className="pb-8">Our article search is powered by <a className="underline" href="https://feedle.world">Feedle</a></p>
          <Stories feeds={[`https://feedle.world/rss/?query=${debouncedInputValue.toLocaleLowerCase()}`]}></Stories>
        </>
      )}
    </div>
  )
}

function FeedResults({ term }: { term: string }) {
  const searchResultsQ = useQuery({
    queryKey: ['feeds-search', term],
    queryFn: async () => {
      return feedSearch(term)
    }
  })

  if (searchResultsQ.isPending) {
    return <LoadingIndicator />
  }

  if (searchResultsQ.error) {
    return <div>Error: {searchResultsQ.error.name} {searchResultsQ.error.message}</div>
  }

  return (
    <div className="py-10">
      {searchResultsQ.data.error
        ? <p className="text-red-500">{searchResultsQ.data.error.message}</p>
        : <FeedsList feeds={searchResultsQ.data.data} />
      }
    </div>
  )
}