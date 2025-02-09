export default function Upvote({ }: {}) {
  const upvoted = false
  const count = 0

  return (
    <button
      title="+1"
      className={`${upvoted ? 'text-primary' : 'text-muted-foreground'} hover:text-primary z-30`}
      onClick={() => { }}
    >
      {count} upvotes
    </button >
  )
}