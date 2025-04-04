import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tournaments/current')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/tournaments/current"!</div>
}
