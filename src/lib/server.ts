'use server'

export async function feedSearch(url: string) {
  const u = `https://feedsearch.dev/api/v1/search?url=${encodeURIComponent(url)}`
  const res = await fetch(u)
  // if (!res.ok) {
  //   throw new Error('Failed to fetch feeds from search term')
  // }
  const data = await res.json() as {
    title: string;
    url: string;
    self_url: string;
    site_name: string;
    site_url: string;
    description: string;

    // bozo: number;
    // content_length: number;
    // content_type: string;
    // favicon: string;
    // hubs: any[];
    // is_podcast: boolean;
    // is_push: boolean;
    // item_count: number;
    // last_seen: string;
    // last_updated: string;
    // score: number;
    // velocity: number;
    // version: string;
  }[] | {
    error: string;
    message: string;
  }

  interface ReturnType {
    error?: {
      error: string;
      message: string;
    }
    data: {
      title: string;
      url: string;
      self_url: string;
      site_name: string;
      site_url: string;
      description: string;

      // bozo: number;
      // content_length: number;
      // content_type: string;
      // favicon: string;
      // hubs: any[];
      // is_podcast: boolean;
      // is_push: boolean;
      // item_count: number;
      // last_seen: string;
      // last_updated: string;
      // score: number;
      // velocity: number;
      // version: string;
    }[]
  }

  // @ts-ignore
  if (data.error) {
    return { error: data } as ReturnType
  }
  return { data } as ReturnType
}