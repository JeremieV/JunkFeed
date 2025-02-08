import SubscribeButton from "./subscribe-button";

export function FeedsList({ feeds }: { feeds: { title: string, url: string }[] }) {
  return (
    <div className="flex flex-col max-w-2xl gap-10">
      {feeds.map(feed => <FeedDisplay key={feed.url} feed={feed} />)}
    </div>
  )
}

export function FeedDisplay({ feed }: { feed: { title: string, url: string } }) {
  return (
    <div className="flex gap-4 w-full">
      <img
        src={`https://icons.duckduckgo.com/ip3/${encodeURIComponent(new URL(feed.url ?? '').hostname)}.ico`}
        alt=""
        className="aspect-square rounded-md w-20 h-20 object-cover" />
      <div>
        <h2>{feed.title}</h2>
        <p className="text-muted-foreground text-sm">{feed.url}</p>
      </div>
      <div className="grow"></div>
      <SubscribeButton url={feed.url} title={feed.title} />
    </div>
  )
}