import { useTokenStore } from '@/store/store';
import { useNavigate } from '@tanstack/react-router';

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className = '' }: LogoutButtonProps) {
  const logout = useTokenStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <button
      onClick={handleLogout}
      className={`rounded-lg border border-red-500 bg-transparent px-8 py-2 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white ${className}`}
    >
      Logout
    </button>
  );
}
