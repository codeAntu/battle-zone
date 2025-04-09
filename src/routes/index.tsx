import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTokenStore } from '@/store/store';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const store = useTokenStore.getState();
    
    if (!store.isLoggedIn()) {
      // Redirect to login router, which will display a login choice page
      throw redirect({
        to: '/login',
      });
    } else if (store.role === 'admin') {
      throw redirect({
        to: '/admin/tournaments',  // Direct to tournaments page which uses the admin layout
      });
    } else {
      throw redirect({
        to: '/user/tournaments',  // Direct to tournaments page which uses the user layout
      });
    }
  },
  component: () => null,
});
