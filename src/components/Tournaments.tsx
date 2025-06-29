import { Tournament as TournamentType } from '@/api/types';
import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';
import { ArrowLeft, Calendar, Clock, Gamepad2, IndianRupee, Trophy, UserRound } from 'lucide-react';
import TournamentDrawer from './TournamentDrawer';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

export default function Tournaments({ tournaments }: { tournaments: TournamentType[] }) {
  console.log(tournaments);
  if (tournaments.length === 0) {
    return (
      <div className='flex h-[50dvh] flex-col items-center justify-center text-center text-gray-500'>
        <div className='mb-4 flex items-center gap-2 text-yellow-500/60'>
          <Trophy className='h-6 w-6' />
          <span className='text-lg font-semibold'>No tournaments available</span>
        </div>
        <Button
          onClick={() => window.history.back()}
          className='flex items-center gap-2 rounded-full px-6 py-2 text-gray-800'
        >
          <ArrowLeft className='h-4 w-4' />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
      {tournaments.map((tournament) => (
        <Tournament key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}

function Tournament({ tournament }: { tournament: TournamentType }) {
  const date = formatDateToUTC(tournament.scheduledAt);
  const time = formatTimeToUTC(tournament.scheduledAt);

  // Define image sources with fallbacks
  const defaultGameImage = `/games/${tournament.game.toUpperCase()}/image.png`;
  const imageUrl = tournament.image || defaultGameImage;

  const progress = (tournament.currentParticipants / tournament.maxParticipants) * 100;

  return (
    <div className='transform overflow-hidden rounded-xl border bg-white/10 text-white/80 shadow-lg transition-transform duration-300 hover:scale-102'>
      <div className='relative'>
        <img className='m aspect-[2/1] w-full object-cover' alt={tournament.game} src={imageUrl} />
      </div>
      <div className='space-y-3 px-4 py-2'>
        <div className='flex items-center justify-between'>
          <p className='line-clamp-1 text-lg font-bold'>{tournament.name}</p>
          <div className='flex items-center gap-2'>
            <div className='rounded-lg bg-blue-500 px-3.5 py-1.5 text-sm font-medium'>{tournament.game}</div>
            {tournament.isEnded && (
              <div className='rounded bg-red-500 px-2 py-1 text-xs font-bold text-white'>Ended</div>
            )}
          </div>
        </div>

        <div className=''>
          <div className='grid grid-cols-2 items-center justify-between gap-2 px-2'>
            <div className='flex flex-col gap-1 text-sm font-semibold text-rose-500/80'>
              <div className='flex items-center gap-2 text-green-500/90'>
                <IndianRupee className='size-5' />
                <p>Per Kill: ₹{tournament.perKillPrize}</p>
              </div>

              <div className='flex items-center gap-2'>
                <Calendar className='size-5' />
                <p className=''>{date}</p>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='size-5' />
                <p className=''>{time}</p>
              </div>
            </div>
            <div className='flex flex-col gap-1 text-sm font-semibold text-blue-500/80'>
              <div className='flex items-center gap-2 text-green-500/90'>
                <Trophy className='size-5' />
                <div className='text-sm'>₹{tournament.prize}</div>
              </div>
              <div className='flex items-center gap-2'>
                <Gamepad2 className='size-5' />
                <p>{tournament.game}</p>
              </div>
              <div className='flex items-center gap-2'>
                <UserRound className='size-5' />
                <p>{tournament.maxParticipants} Players</p>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>{tournament.currentParticipants} Players Joined</span>
            <span>{tournament.maxParticipants} Max Players</span>
          </div>
          <Progress value={progress} className='h-2' />
        </div>

        <TournamentDrawer data={tournament}>
          <Button className='w-full rounded-full font-semibold'>
            {tournament.isEnded ? 'View Details' : `Participate ( ₹${tournament.entryFee} )`}
          </Button>
        </TournamentDrawer>
      </div>
      <div></div>
    </div>
  );
}
