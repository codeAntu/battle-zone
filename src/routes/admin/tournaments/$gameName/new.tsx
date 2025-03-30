import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/admin/tournaments/$gameName/new')({
  component: RouteComponent,
});

function RouteComponent() {
  const [gameData, setGameData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    releaseDate: '',
    genre: '',
    price: '',
    pricePerKill: '',
    duration: '',
    startDate: '',
    startTime: '',
    playerCount: '',
    roomId: '', // Added the roomId field
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGameData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting game data:', gameData);
    // Here you would typically send this data to your API
    alert('Game created successfully!');
  };

  return (
    <div className='mx-auto max-w-lg p-4'>
      <div className='space-y-2.5'>
        <p className='text-2xl font-bold'>Create New Game</p>

        <form onSubmit={handleSubmit} className='max-w-2xl space-y-4'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name' className='text-sm font-medium'>
              Game Name
            </label>
            <Input type='text' id='name' name='name' value={gameData.name} onChange={handleChange} required />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='price' className='text-sm font-medium'>
              Price ($)
            </label>
            <Input
              type='number'
              id='price'
              name='price'
              min='0'
              step='0.01'
              value={gameData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='playerCount' className='text-sm font-medium'>
              Player Count
            </label>
            <Input
              type='number'
              id='playerCount'
              name='playerCount'
              min='2'
              step='1'
              value={gameData.playerCount}
              onChange={handleChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='pricePerKill' className='text-sm font-medium'>
              Price per Kill ($)
            </label>
            <Input
              type='number'
              id='pricePerKill'
              name='pricePerKill'
              min='0'
              step='0.01'
              value={gameData.pricePerKill}
              onChange={handleChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='roomId' className='text-sm font-medium'>
              Room ID
            </label>
            <Input 
              type='text' 
              id='roomId' 
              name='roomId' 
              placeholder='...'
              value={gameData.roomId} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='startDate' className='text-sm font-medium'>
              Start Date
            </label>
            <Input
              type='date'
              id='startDate'
              name='startDate'
              value={gameData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='startTime' className='text-sm font-medium'>
              Start Time
            </label>
            <Input
              type='time'
              id='startTime'
              name='startTime'
              value={gameData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='duration' className='text-sm font-medium'>
              Duration (hours)
            </label>
            <Input
              type='number'
              id='duration'
              name='duration'
              min='0'
              step='0.5'
              value={gameData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='genre' className='text-sm font-medium'>
              Genre
            </label>
            <Input type='text' id='genre' name='genre' value={gameData.genre} onChange={handleChange} required />
          </div>

          <div className='flex w-full items-center justify-end pt-2'>
            <Button
              type='submit'
              variant='outline'
              className='border-primary text-primary hover:bg-primary hover:text-black'
            >
              Create Game
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
