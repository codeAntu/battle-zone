import { ls } from '@/utils/ls';
import { create } from 'zustand';

interface Store {
  token: string | null;
  setToken(token: string): void;
  logout(): void;
}

export const useTokenStore = create<Store>((set) => ({
  token: JSON.parse(ls.get('token') || '{}'),
  setToken: (token) => {
    ls.set('token', JSON.stringify(token));
    set({ token });
  },
  logout: () => {
    ls.clear();
    set({ token: '' });
  },
}));
