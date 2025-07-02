import { ChangeEvent, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (file: File | undefined) => void;
  maxSizeInBytes?: number;
  className?: string;
}

export function ImageUpload({ onImageSelected, maxSizeInBytes = 5 * 1024 * 1024, className = '' }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clean up the object URL when component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);

    if (!e.target.files || e.target.files.length === 0) {
      setPreviewUrl(null);
      onImageSelected(undefined);
      return;
    }

    const file = e.target.files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Selected file must be an image');
      setPreviewUrl(null);
      onImageSelected(undefined);
      return;
    }

    // Validate file size
    if (file.size > maxSizeInBytes) {
      setError(`Image must be less than ${maxSizeInBytes / (1024 * 1024)}MB`);
      setPreviewUrl(null);
      onImageSelected(undefined);
      return;
    }

    // Use DataTransfer API to create a FileList
    try {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      // Create a blob URL for preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Pass the file from the original file input
      // This ensures a valid File object is passed
      onImageSelected(file);
    } catch (err) {
      console.warn('DataTransfer API error, using direct file reference', err);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelected(file);
    }

    // Reset the input value to ensure onChange fires even if same file is selected again
    e.target.value = '';
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageSelected(undefined);
  };

  return (
    <div className={`relative ${className}`}>
      {previewUrl ? (
        <div className='relative'>
          <img src={previewUrl} alt='Preview' className='h-48 w-full rounded-md object-cover' />
          <Button
            type='button'
            variant='destructive'
            size='icon'
            className='absolute top-2 right-2 h-8 w-8 rounded-full'
            onClick={clearImage}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center rounded-md border border-dashed border-gray-700 bg-gray-900/50 p-6'>
          <Upload className='mb-2 h-8 w-8 text-gray-400' />
          <p className='mb-1 text-sm font-medium'>Click to upload an image</p>
          <p className='text-xs text-gray-500'>PNG, JPG, or WEBP (max {maxSizeInBytes / (1024 * 1024)}MB)</p>
          {error && <p className='mt-2 text-xs text-red-500'>{error}</p>}
          <input
            type='file'
            className='absolute inset-0 cursor-pointer opacity-0'
            accept='image/*'
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
