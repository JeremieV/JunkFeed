'use client';

import Stories from '@/app/Stories';
import LoadingIndicator from '@/components/LoadingIndicator';
import SubscribeButton from '@/components/subscribe-button';
import { fetchFeed } from '@/lib/fetchClient';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function ItemPage() {
  const params = useParams();
  const { url: encodedURL } = params;
  const url = decodeURIComponent(encodedURL as string);

  const { isPending, error, data } = useQuery({
    queryKey: ['feed', url],
    queryFn: async () => {
      const res = await fetchFeed(url)
      const feed = res.feedData[0]
      const first = feed.status === 'fulfilled' ? feed.value : null
      if (!first) {
        throw new Error('Failed to fetch feed')
      }
      return first
    }
  })

  if (isPending) {
    return <LoadingIndicator />
  }

  if (error) {
    return <div>Error: {error.name} {error.message}</div>
  }

  return (
    <div>
      <div className="flex mb-10">
        <img
          src={`https://icons.duckduckgo.com/ip3/${encodeURIComponent(new URL(url).hostname)}.ico`}
          alt=""
          className="aspect-square w-20 h-20 object-cover rounded-md mr-4" />
        <div>
          <h1 className="font-semibold text-2xl flex items-center gap-2">
            <a href={data.link ?? ''} target="_blank" className="hover:underline">{data?.title}</a>
            {/* <SquareArrowOutUpRight className="w-5 h-5" /> */}
          </h1>
          <p className="text-muted-foreground">{url}</p>
          <p className="mb-4">{data.description}</p>
          <SubscribeButton url={url} title={data.title ?? ''} />
        </div>
      </div>
      <Stories feeds={[url]} />
    </div>
  );
}
