import { AdminProvider } from '../lib/context/AdminContext';
import { AuthProvider } from '../lib/context/AuthContext';
import { CartProvider } from '../lib/context/CartContext';
import { FavoritesProvider } from '../lib/context/FavoritesContext';
import { FilterProvider } from '../lib/context/FilterContext';
import { ProfileProvider } from '../lib/context/ProfileContext';
import { SettingsProvider } from '../lib/context/SettingsContext';

export const GlobalProviders = ({ children }: { children: React.ReactNode }) => {
  return (
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
  );
};
