import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tournaments/history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/tournaments/history"!</div>
}
