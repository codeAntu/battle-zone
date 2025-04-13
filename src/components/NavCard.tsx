import { Link } from '@tanstack/react-router';
import { ReactNode } from 'react';

interface NavCardProps {
  name: string;
  path: string;
  color: string;
  icon?: ReactNode;
}

export default function NavCard({ name, path, color, icon }: NavCardProps) {
  return (
    <Link
      to={path}
      className={`${color} flex items-center rounded-lg p-5 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl`}
    >
      {icon && <div className="mr-4">{icon}</div>}
      <div className="font-semibold">{name}</div>
    </Link>
  );
}
