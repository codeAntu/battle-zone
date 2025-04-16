import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/tournaments/$tournamentId')({
  component: RouteComponent,
})

function RouteComponent({ tournament }: { tournament: { scheduledAt: string } }) {
  const formattedDate = formatDateToUTC(tournament.scheduledAt);
  const formattedTime = formatTimeToUTC(tournament.scheduledAt);

  return (
    <div>
      <p>Date: {formattedDate}</p>
      <p>Time: {formattedTime}</p>
    </div>
  );
}
