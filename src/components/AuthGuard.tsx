import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTokenStore } from '@/store/store';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAuth = false, requireAdmin = false }: AuthGuardProps) {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useTokenStore();

  useEffect(() => {
    if (requireAuth && !isLoggedIn()) {
      // Redirect to the appropriate login page
      navigate({ to: requireAdmin ? '/admin/login' : '/user/login' });
      return;
    }

    if (isLoggedIn()) {
      if (requireAdmin && role !== 'admin') {
        navigate({ to: '/user/tournaments' });
        return;
      }

      if (!requireAdmin && role === 'admin') {
        navigate({ to: '/admin/tournaments' });
        return;
      }
    }
  }, [navigate, requireAuth, requireAdmin, role]);

  return <>{children}</>;
}
