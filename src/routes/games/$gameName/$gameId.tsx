import { createFileRoute, useParams, Link } from '@tanstack/react-router';
import { useState, ChangeEvent } from 'react';

export const Route = createFileRoute('/games/$gameName/$gameId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { gameName, gameId } = useParams({ from: '/games/$gameName/$gameId' });
  const [formData, setFormData] = useState({
    gameLevel: '',
    gameId: gameId || '',
    gameName: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your submission logic here
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    // Add your cancel logic here
  };

  return (
    <div className='p-5'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-4 text-3xl font-bold'>{gameName}</h1>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <div className='md:col-span-2'>
            <div className='overflow-hidden rounded-lg shadow-lg'>
              {/* Replace with your actual image path after moving it to public folder */}
              <img src='/assets/games/game-image.jpg' alt={gameName} className='h-auto w-full object-cover' />
            </div>
          </div>
          <div className='rounded-lg border border-gray-200 bg-gray-100 p-6 shadow-lg dark:border-gray-900 dark:bg-gray-950'>
            <h2 className='mb-4 text-xl font-semibold'>Game Details</h2>
            <p className='mb-2'>
              <span className='font-medium'>Game ID:</span> {gameId}
            </p>
            <p className='mb-2'>
              <span className='font-medium'>Description:</span> Experience the ultimate battle royale game with intense
              action and strategic gameplay.
            </p>
            <div className='mt-6 flex gap-3'>
              <button className='bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 font-medium text-black transition-colors'>
                Play Now
              </button>

              <Link
                to='/games/$gameName'
                params={{ gameName }}
                className='border-primary text-primary hover:bg-primary rounded-lg border bg-transparent px-6 py-2 font-medium transition-colors hover:text-black'
              >
                Leaderboard
              </Link>
            </div>
          </div>

          {/* Game Form Section */}
          <div className='mt-8 md:col-span-3'>
            <div className='rounded-lg border border-gray-200 bg-gray-100 p-6 shadow-lg dark:border-gray-900 dark:bg-gray-950'>
              <h2 className='mb-4 text-xl font-semibold'>Game Setup</h2>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label htmlFor='gameId' className='mb-1 block text-sm font-medium'>
                    Game ID
                  </label>
                  <input
                    type='text'
                    id='gameId'
                    name='gameId'
                    value={formData.gameId}
                    onChange={handleChange}
                    className='focus:ring-primary focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none'
                  />
                </div>

                <div>
                  <label htmlFor='gameName' className='mb-1 block text-sm font-medium'>
                    Game User Name
                  </label>
                  <input
                    type='text'
                    id='gameName'
                    name='gameName'
                    value={formData.gameName}
                    onChange={handleChange}
                    className='focus:ring-primary focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none'
                  />
                </div>
                <div>
                  <label htmlFor='gameLevel' className='mb-1 block text-sm font-medium'>
                    Game Level
                  </label>
                  <input
                    type='text'
                    id='gameLevel'
                    name='gameLevel'
                    value={formData.gameLevel}
                    onChange={handleChange}
                    className='focus:ring-primary focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none'
                  />
                </div>

                <div className='mt-6 flex justify-end gap-3'>
                  <button
                    type='button'
                    onClick={handleCancel}
                    className='rounded-md border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='bg-primary hover:bg-primary/90 rounded-md px-5 py-2 text-black focus:outline-none'
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Additional navigation */}
        <div className='mt-8'>
          <Link
            to='/games/$gameName'
            params={{ gameName }}
            className='border-primary text-primary hover:bg-primary rounded-lg border bg-transparent px-6 py-2 font-medium transition-colors hover:text-black'
          >
            Browse Tournaments
          </Link>
        </div>
      </div>
    </div>
  );
}
