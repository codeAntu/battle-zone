import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/games/$gameName/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/games/new"!</div>
}
