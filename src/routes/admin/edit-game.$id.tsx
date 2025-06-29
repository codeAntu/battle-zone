import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { GameType, getAdminGameById, updateGame } from '../../api/game';

export const Route = createFileRoute('/admin/edit-game/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameType | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [image, setImage] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    setIsLoading(true);
    try {
      const response = await getAdminGameById(id);
      if (response.data) {
        const gameData = response.data;
        setGame(gameData);
        setName(gameData.name);
        setDescription(gameData.description);
        setIconUrl(gameData.iconUrl);
        setImage(gameData.image);
      }
    } catch (err) {
      setError('Failed to load game details. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (!validTypes.includes(file.type)) {
        setError(`Invalid icon file type. Supported formats: JPEG, PNG, GIF`);
        return;
      }

      setIconFile(file);
      // Create a preview URL for the image
      setIconUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (!validTypes.includes(file.type)) {
        setError(`Invalid image file type. Supported formats: JPEG, PNG, GIF`);
        return;
      }

      setImageFile(file);
      // Create a preview URL for the image
      setImage(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      // In a real application, you would upload the image files first
      // and get their URLs from the server

      // For this example, we'll assume the server can handle updating
      // image URLs separately, so we'll just update the text fields
      const updatedGame = {
        name,
        description,
        ...(iconFile && { iconUrl: 'new-icon-url-from-server' }),
        ...(imageFile && { image: 'new-image-url-from-server' }),
      };

      await updateGame(id, updatedGame);
      setMessage('Game updated successfully!');

      // Navigate back to games list after a short delay
      setTimeout(() => {
        navigate({ to: '/admin/games' });
      }, 2000);
    } catch (err) {
      setError(`Update failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className='my-12 text-center'>Loading game details...</div>;
  }

  if (!game && !isLoading) {
    return (
      <div className='my-12 text-center'>
        <div className='mb-4 text-red-600'>Game not found</div>
        <button
          onClick={() => navigate({ to: '/admin/games' })}
          className='rounded-md bg-blue-600 px-4 py-2 text-white'
        >
          Back to Games
        </button>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-xl p-6'>
      <h1 className='mb-6 text-2xl font-bold'>Edit Game</h1>

      {message && (
        <div className='mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700'>{message}</div>
      )}
      {error && <div className='mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700'>{error}</div>}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium'>
            Game Name
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm'
            required
          />
        </div>

        <div>
          <label htmlFor='description' className='block text-sm font-medium'>
            Game Description
          </label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm'
            rows={3}
          />
        </div>

        <div>
          <label htmlFor='iconFile' className='block text-sm font-medium'>
            Game Icon
          </label>
          {iconUrl && (
            <div className='mt-2 mb-2'>
              <img
                src={iconUrl}
                alt='Game icon preview'
                className='h-20 w-20 rounded border border-gray-200 object-cover'
              />
            </div>
          )}
          <input
            type='file'
            id='iconFile'
            onChange={handleIconChange}
            className='mt-1 block w-full rounded-md border border-gray-300 p-2'
            accept='image/jpeg,image/png,image/gif'
          />
        </div>

        <div>
          <label htmlFor='imageFile' className='block text-sm font-medium'>
            Game Banner Image
          </label>
          {image && (
            <div className='mt-2 mb-2'>
              <img
                src={image}
                alt='Game banner preview'
                className='h-40 w-full rounded border border-gray-200 object-cover'
              />
            </div>
          )}
          <input
            type='file'
            id='imageFile'
            onChange={handleImageChange}
            className='mt-1 block w-full rounded-md border border-gray-300 p-2'
            accept='image/jpeg,image/png,image/gif'
          />
        </div>

        <div className='flex space-x-4'>
          <button
            type='submit'
            disabled={isSubmitting}
            className={`rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 ${
              isSubmitting ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Update Game'}
          </button>

          <button
            type='button'
            onClick={() => navigate({ to: '/admin/games' })}
            className='rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
