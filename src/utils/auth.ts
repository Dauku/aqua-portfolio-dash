
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock credentials - in a real app, this would be handled by a backend
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'password123'
};

// Define the auth store interface
interface AuthState {
  user: { email: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // In a real app, this would make an API call to a backend
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({ user: { email }, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Auth guard hook
export const useAuthGuard = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated;
};
