import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tournaments/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/tournaments/"!</div>
}
