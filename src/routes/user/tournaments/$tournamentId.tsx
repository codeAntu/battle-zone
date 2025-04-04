import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/tournaments/$tournamentId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/user/tournaments/$tournamentId"!</div>
}
