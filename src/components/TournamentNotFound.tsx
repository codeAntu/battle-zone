import { ShieldAlert } from 'lucide-react';

export default function TournamentNotFound() {
  return (
    <div className='p-5 text-center h-[50dvh] flex flex-col items-center justify-center'>
      <ShieldAlert className='mx-auto mb-4 h-12 w-12 text-yellow-500' />
      <h2 className='text-xl font-bold'>Tournament(s) Not Found</h2>
      <p className='text-gray-400'>The requested tournament(s) could not be found</p>
    </div>
  );
}
