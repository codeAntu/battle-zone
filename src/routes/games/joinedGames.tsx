import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/games/joinedGames')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/games/joinedGames"!</div>
}
