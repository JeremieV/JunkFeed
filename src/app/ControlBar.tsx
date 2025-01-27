"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { displayUrl, urlToRSS } from "@/lib/helpers"
import { Info, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef, KeyboardEvent } from 'react'

export default function ControlBar({ feeds }: { feeds: string[] }) {
  const router = useRouter()

  function setFeeds(feeds: string[]) {
    // deduplicate
    feeds = Array.from(new Set(feeds))
    // this comma separator should work every time... but I'm a bit scared
    router.push(`?feeds=${feeds.map(encodeURIComponent).join(',')}`)
  }

  // RSS input
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // validate url
      addFeed()
    }
  }

  async function addFeed() {
    // validate url
    if (!inputValue
      || !inputValue.startsWith('http')
      || feeds.includes(inputValue)) {
      return
    }
    setFeeds([...feeds, await urlToRSS(inputValue)])
    setInputValue('')
    inputRef.current?.focus()
  }

  return (
    <div className="my-4 mb-6">
      <div className="flex w-full items-center space-x-2 my-2">
        <Input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter feed url"
        />
        <Button onClick={() => addFeed()}>Add</Button>
        <Info className="text-muted-foreground" />
      </div>
      {/* feeds list */}
      <div className="flex flex-wrap gap-2 mr-2 items-center">
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
      </div>
    </div>
  )
}