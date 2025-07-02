import { createFileRoute } from '@tanstack/react-router';
import { ChangeEvent, FormEvent, useState } from 'react';

export const Route = createFileRoute('/admin/add-game')({
  component: RouteComponent,
});

function RouteComponent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameFile, setGameFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      const validTypes = ['.zip', '.exe', '.html', '.unity3d'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (!validTypes.includes(fileExtension)) {
        setError(`Invalid file type. Supported formats: ${validTypes.join(', ')}`);
        return;
      }

      setGameFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!gameFile) return;

    setIsUploading(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('gameFile', gameFile);

      const response = await fetch('/api/games/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Game uploaded successfully!');
        // Reset form
        setTitle('');
        setDescription('');
        setGameFile(null);
        // Reset file input by accessing the form and resetting it
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error(result.error || 'Failed to upload game');
      }
    } catch (err) {
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='mx-auto max-w-xl p-6'>
      <h1 className='mb-6 text-2xl font-bold'>Add New Game</h1>

      {message && (
        <div className='mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700'>{message}</div>
      )}
      {error && <div className='mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700'>{error}</div>}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='title' className='block text-sm font-medium'>
            Game Title
          </label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <label htmlFor='gameFile' className='block text-sm font-medium'>
            Game File
          </label>
          <input
            type='file'
            id='gameFile'
            onChange={handleFileChange}
            className='mt-1 block w-full rounded-md border border-gray-300 p-2'
            accept='.zip,.exe,.html,.unity3d'
            required
          />
          <p className='mt-1 text-xs text-gray-500'>Supported formats: .zip, .exe, .html, .unity3d</p>
          {gameFile && (
            <div className='mt-2 text-sm text-gray-700'>
              Selected: {gameFile.name} ({(gameFile.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          )}
        </div>{' '}
        <button
          type='submit'
          disabled={isUploading || !gameFile}
          className={`rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 ${
            isUploading || !gameFile ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isUploading ? (
            <div className='flex items-center gap-2'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent'></div>
              Uploading...
            </div>
          ) : (
            'Upload Game'
          )}
        </button>
      </form>
    </div>
  );
}
