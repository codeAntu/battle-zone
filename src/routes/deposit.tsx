import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/deposit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/deposit"!</div>
}
