import { ls } from '@/utils/ls';
import { create } from 'zustand';

type UserRole = 'admin' | 'user' | null;

interface Store {
  token: string | null;
  role: UserRole;
  setToken(token: string): void;
  setRole(role: UserRole): void;
  logout(): void;
}

export const useTokenStore = create<Store>((set) => ({
  token: JSON.parse(ls.get('token') || 'null'),
  role: JSON.parse(ls.get('userRole') || 'null'),
  setToken: (token) => {
    ls.set('token', JSON.stringify(token));
    set({ token });
  },
  setRole: (role) => {
    ls.set('userRole', JSON.stringify(role));
    set({ role });
  },
  logout: () => {
    ls.clear();
    set({ token: null, role: null });
  },
}));
