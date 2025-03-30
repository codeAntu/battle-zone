import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/games/joinedGames')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/games/joinedGames"!</div>
}
