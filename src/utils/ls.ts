export const details = {
  name: 'ludo-challenges',
  version: '1.0.0',
};
const ls = {
  get: (key: string) => {
    if (typeof window !== 'undefined') {
      // Only try to use localStorage if window is defined
      return localStorage.getItem(details.name + key);
    }
    // Return a default value or null if localStorage is not available
    return null;
  },
  set: (key: string, data: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(details.name + key, data);
    }
    // Optionally handle the case where localStorage is not available
  },
  clear: () => {
    for (const elem in localStorage) {
      if (elem.startsWith(details.name)) localStorage.removeItem(elem);
    }
  },
};

export { ls };
