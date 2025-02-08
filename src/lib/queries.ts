import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "./fetchClient";

export function useFeeds(feeds: string[]) {
  return useQuery({
    queryKey: ['feed', feeds],
    queryFn: () => {
      return Promise.all(feeds.map(fetchFeed));
    },
  });
}
