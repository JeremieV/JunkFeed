import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai/vanilla'

export const gridviewAtom = atomWithStorage('gridview', true)
export const subscriptionsAtom = atomWithStorage<{
  title: string,
  url: string,
}[]>('subscriptions', [])

export const hideHomeFeedAtom = atomWithStorage('hide-home-feed', false)

/** stored as an array of `url:feedUrl`. the first ids are upvoted most recently */
export const upvotesAtom = atomWithStorage<string[]>('upvotes', [])