import { Button } from '@/components/ui/button';
import { subscriptionsAtom } from '@/state';
import { useAtom } from 'jotai/react';

export default function SubscribeButton({ url, title }: { url: string, title: string }) {
  const [subscriptions, setSubscriptions] = useAtom(subscriptionsAtom)

  return subscriptions.find(s => s.url === url) ?
    <Button onClick={() => { setSubscriptions(subscriptions.filter(s => s.url !== url)) }} variant="outline">Unsubscribe</Button> :
    <Button onClick={() => { setSubscriptions([{ title, url }, ...subscriptions]) }}>Subscribe</Button>
}