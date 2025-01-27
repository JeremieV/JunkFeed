"use client"

import { useAtom } from "jotai/react";
import ControlBar from "./ControlBar"
import Stories from './Stories'
import { gridviewAtom } from "@/state";
import { Button } from "@/components/ui/button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { _export, _import } from "@/lib/helpers";
import { useRouter } from "next/navigation";

const queryClient = new QueryClient()

export default function Page({ searchParams }: { searchParams: { view: string, feeds: string } }) {
  const [gridview, setGridview] = useAtom(gridviewAtom)
  const feeds: string[] = searchParams.feeds?.split(',').filter(x => x).map(decodeURIComponent) || [];
  const router = useRouter()

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full max-w-6xl mx-auto p-4 min-h-svh flex flex-col" id='top'>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Stateless Feed</h1>
            <span className="text-sm"><a href="https://github.com/jeremiev/feed" className='underline'>
              Open source</a>, made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a></span>
          </div>
          <div className="flex gap-2">
            <Button variant={"outline"} onClick={() => document.getElementById("import")?.click()}>Import</Button>
            <input type="file" name="import" id="import" className="hidden" onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return
              // console.log('fired')
              // console.log(file?.name)
              const parser = new DOMParser();
              const text = await file.text()
              const xmlDoc = parser.parseFromString(text, "application/xml");
              const outlineElements = xmlDoc.getElementsByTagName("outline");

              const urls: string[] = [];
              for (const element of Array.from(outlineElements)) {
                const url = element.getAttribute("xmlUrl");
                if (url) {
                  urls.push(url);
                }
              }
              router.push(`/?feeds=${urls.map(encodeURIComponent).join(',')}`)
            }} />
            <Button variant={"outline"} onClick={() => _export(feeds)}>Export</Button>
            <Button onClick={() => setGridview(gridview ? false : true)} variant="outline">
              {gridview ? 'List view' : 'Grid view'}
            </Button>
          </div>
        </div>
        <ControlBar feeds={feeds} />
        <Stories feeds={feeds}></Stories>
      </div>
    </QueryClientProvider >
  )
}
