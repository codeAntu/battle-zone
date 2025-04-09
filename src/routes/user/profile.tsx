import { createFileRoute } from '@tanstack/react-router';
import { useTokenStore } from '@/store/store'; // Assuming your store is defined here

export const Route = createFileRoute('/user/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  const logout = useTokenStore((state) => state.logout);

  const handleLogout = () => {
    logout(); // Call the store's logout function
  };

  return (
    <div>
      <h1>Hello "/user/profile"!</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
