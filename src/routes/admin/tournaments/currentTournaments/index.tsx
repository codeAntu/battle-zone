import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tournaments/currentTournaments/')({
  component: RouteComponent,
})

function RouteComponent() {
  // Example data for demonstration
  const activeGames = [
    {
      id: 1,
      name: 'PUBG Mobile',
      image: 'https://www.financialexpress.com/wp-content/uploads/2025/03/PUBG-MOBILE1.jpg',
      activeDate: 'Oct 1, 2023',
      roomId: 'PUBG123',
      link: '/admin/tournaments/currentTournaments/PUBG123'
    },
    {
      id: 2,
      name: 'Call of Duty Mobile',
      image: 'https://www.financialexpress.com/wp-content/uploads/2025/03/PUBG-MOBILE1.jpg',
      activeDate: 'Oct 15, 2023',
      roomId: '',
      link: '/admin/tournaments/currentTournaments/COD456'
    }
  ];

  return (
    <div className='mx-auto max-w-2xl p-4'>
      <div className='space-y-2.5'>
        <p className='text-2xl font-bold'>Your Active Tournaments</p>
        {activeGames.map(game => (
          <Game key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

interface GameProps {
  game: {
    id: number;
    name: string;
    image: string;
    activeDate: string;
    roomId: string;
    link: string;
  };
}

function Game({ game }: GameProps) {
  return (
    <Link 
      to={game.link}
      params={{ gameName: game.name, tournamentsId: game.id.toString() }}
     className='flex flex-col gap-4'>
      <div className={`flex items-center justify-between rounded-lg border ${!game.roomId ? 'border-orange-500' : ''} p-3`}>
        <div className='flex items-center'>
          <img
            src={game.image}
            alt={game.name}
            className='h-16 w-16 rounded-lg object-cover'
          />
          <div className='ml-4'>
            <p className='text-lg font-semibold'>{game.name}</p>
            <p className='text-sm text-gray-500'>Active since: {game.activeDate}</p>
            <p className='text-sm text-gray-500'>
              Room ID: <span className="font-medium">{game.roomId || '...'}</span>
            </p>
          </div>
        </div>
        <button className={`${!game.roomId ? 'border-orange-500' : 'border-primary'} text-orange-500 hover:bg-primary flex rounded-lg border bg-transparent px-8 py-2 text-xs font-semibold hover:text-black`}>
          Game Details
        </button>
      </div>
    </Link>
  );
}
