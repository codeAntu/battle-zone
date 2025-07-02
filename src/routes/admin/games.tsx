import { Button } from '@/components/ui/button';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { deleteGame, GameType, getAdminGames } from '../../api/game';

export const Route = createFileRoute('/admin/games')({
  component: RouteComponent,
});

function RouteComponent() {
  const [games, setGames] = useState<GameType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showModal]);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const response = await getAdminGames();
      if (response.data) {
        setGames(response.data.games);
      }
    } catch (err) {
      setError('Failed to load games. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (id: number) => {
    setSelectedGameId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedGameId(null);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await deleteGame(id.toString());
      setMessage('Game deleted successfully');
      setGames(games.filter((game) => game.id !== id));
      closeModal();
    } catch (err) {
      setError('Failed to delete game. Please try again.');
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className='mx-auto max-w-4xl p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Game Management</h1>
        <Button onClick={() => router.navigate({ to: '/admin/add-game' })}>Add New Game</Button>
      </div>
      {message && (
        <div className='mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700'>
          {message}
          <button className='float-right' onClick={() => setMessage('')} aria-label='Close message'>
            &times;
          </button>
        </div>
      )}
      {error && (
        <div className='mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700'>
          {error}
          <button className='float-right' onClick={() => setError('')} aria-label='Close error'>
            &times;
          </button>
        </div>
      )}{' '}
      {isLoading ? (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='bg-card rounded-lg border p-4'>
                <div className='space-y-3'>
                  <div className='bg-muted h-32 w-full animate-pulse rounded'></div>
                  <div className='space-y-2'>
                    <div className='bg-muted h-4 w-3/4 animate-pulse rounded'></div>
                    <div className='bg-muted h-3 w-1/2 animate-pulse rounded'></div>
                  </div>
                  <div className='flex gap-2'>
                    <div className='bg-muted h-8 w-16 animate-pulse rounded'></div>
                    <div className='bg-muted h-8 w-16 animate-pulse rounded'></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : games.length === 0 ? (
        <div className='my-8 text-center'>
          <p>No games found.</p>
          <Button
            onClick={() => router.navigate({ to: '/admin/add-game' })}
            variant='link'
            className='mt-2 inline-block'
          >
            Add your first game
          </Button>
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>Game</th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Description
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {games.map((game) => (
                <tr key={game.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='h-10 w-10 flex-shrink-0'>
                        <img
                          className='h-10 w-10 rounded-full object-cover'
                          src={game.iconUrl || '/placeholder-game.png'}
                          alt={game.name}
                        />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>{game.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='line-clamp-2 text-sm text-gray-900'>{game.description}</div>
                  </td>
                  <td className='px-6 py-4 text-sm font-medium whitespace-nowrap'>
                    <div className='flex space-x-2'>
                      <Button
                        onClick={() =>
                          router.navigate({
                            to: '/admin/edit-game/$id',
                            params: { id: game.id.toString() },
                          })
                        }
                        variant='link'
                        className='text-indigo-600 hover:text-indigo-900'
                      >
                        Edit
                      </Button>{' '}
                      <Button
                        onClick={() => openDeleteModal(game.id)}
                        disabled={isDeleting === game.id}
                        className='text-red-600 hover:text-red-900'
                      >
                        {isDeleting === game.id ? (
                          <div className='flex items-center gap-2'>
                            <div className='h-3 w-3 animate-spin rounded-full border border-red-600 border-b-transparent'></div>
                            Deleting...
                          </div>
                        ) : (
                          'Delete'
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Inline Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex min-h-screen items-center justify-center p-4'>
            {/* Modal backdrop */}
            <div className='fixed inset-0 bg-black opacity-50' onClick={closeModal}></div>

            {/* Modal content */}
            <div className='relative w-full max-w-lg rounded-lg bg-white shadow-xl'>
              <div className='flex items-start justify-between border-b p-4'>
                <h3 className='text-lg font-medium'>Confirm Delete</h3>
                <button className='text-gray-400 hover:text-gray-500' onClick={closeModal} aria-label='Close'>
                  &times;
                </button>
              </div>

              <div className='p-6'>
                <p>Are you sure you want to delete this game? This action cannot be undone.</p>
                <div className='mt-6 flex justify-end space-x-4'>
                  <Button onClick={closeModal} className='bg-gray-200 text-gray-800 hover:bg-gray-300'>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => selectedGameId && handleDelete(selectedGameId)}
                    disabled={isDeleting !== null}
                    className='bg-red-600 text-white hover:bg-red-700'
                  >
                    {isDeleting !== null ? 'Deleting...' : 'Delete Game'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
