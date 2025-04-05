import { Link } from '@tanstack/react-router';
import { Gamepad, MoveRight } from 'lucide-react';

interface NavCardProps {
  name: string;
  path: string;
  color: string;
  icon?: React.ReactNode;
}

export default function NavCard({ name, path, color, icon = <Gamepad className='h-10 w-10' /> }: NavCardProps) {
  return (
    <Link
      to={path}
      key={name}
      className={`rounded-xl border ${color} cursor-pointer px-5 py-3 transition duration-300 hover:scale-102`}
    >
      {icon}
      <div className='flex items-center justify-between font-semibold'>
        <div>{name}</div>
        <MoveRight className='aspect-square w-8' />
      </div>
    </Link>
  );
}
