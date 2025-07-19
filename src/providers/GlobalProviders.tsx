import { AdminProvider } from '../lib/context/AdminContext';
import { AuthProvider } from '../lib/context/AuthContext';
import { CartProvider } from '../lib/context/CartContext';
import { FavoritesProvider } from '../lib/context/FavoritesContext';
import { FilterProvider } from '../lib/context/FilterContext';
import { ProfileProvider } from '../lib/context/ProfileContext';
import { SettingsProvider } from '../lib/context/SettingsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const GlobalProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <FavoritesProvider>
              <ProfileProvider>
                <AdminProvider>
                  <FilterProvider>{children}</FilterProvider>
                </AdminProvider>
              </ProfileProvider>
            </FavoritesProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
