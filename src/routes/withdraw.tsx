import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/withdraw')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/withdraw"!</div>
}
