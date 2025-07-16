import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useFilters } from './lib/context/FilterContext';
import { useProfile } from './lib/context/ProfileContext';
import { GlobalProviders } from './providers/GlobalProviders';
import { getAllProducts } from './lib/api/products';

// Components
import { NavSection } from './sections/NavSection';
import { FooterSection } from './sections/FooterSection';
import { ProfileModal } from './components/Profile/ProfileModal';
import { LoginModal } from './components/Profile/LoginModal';

// Pages
import { CartPage } from './pages/CartPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ContactsPage } from './pages/ContactsPage';
import { CatalogPage } from './pages/CatalogPage';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { ComparePage } from './pages/ComparePage';
import DeliveryPage from './pages/DeliveryPage';

// Admin Pages
import { AdminLayout } from './pages/Admin/AdminLayout';

import { AdminDashboard } from './pages/Admin/Dashboard/AdminDashboard';
import { AdminProducts } from './pages/Admin/Products/AdminProducts';
import { AdminOrdersPage } from './pages/Admin/Orders';
// import { AdminContent } from './pages/Admin/AdminContent';

import { OrderSuccess } from './pages/OrderSucess';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminSettings } from './pages/Admin/Settings/AdminSettings';
import { AdminUsers } from './pages/Admin/Users/AdminUsers';
import { AdminLogin } from './pages/Admin/Login/AdminLogin';
import { Product } from './types/types';

const AppContent = (): JSX.Element => {
  const { filters } = useFilters();
  const { isAuthenticated, showProfileModal, setShowProfileModal } = useProfile();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...products];

      const categoryMatch = filters.activeCategory
        ? filtered.filter((product) => product.category === filters.activeCategory)
        : filtered;

      const brandMatch = categoryMatch.filter((product) => {
        const brandFilter = filters.brands.find((b: Product) => b.name === product.brand);
        return !brandFilter || brandFilter.checked;
      });

      const priceMatch = brandMatch.filter(
        (product) => product.priceValue >= filters.priceRange[0] && product.priceValue <= filters.priceRange[1],
      );

      const searchMatch = searchQuery.trim()
        ? priceMatch.filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.brand.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : priceMatch;

      if (sortOrder === 'asc') {
        searchMatch.sort((a, b) => a.priceValue - b.priceValue);
      } else if (sortOrder === 'desc') {
        searchMatch.sort((a, b) => b.priceValue - a.priceValue);
      }

      return searchMatch;
    };

    setFilteredProducts(applyFilters());
  }, [filters, searchQuery, sortOrder, products]);

  return (
    <div className="w-full max-w-full overflow-hidden ">
      <div className="relative">
        <NavSection />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/order-sucess" element={<OrderSuccess />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            {/* <Route path="content" element={<AdminContent />} /> */}
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <FooterSection />

        {/* Profile Modals */}
        <ProfileModal isOpen={showProfileModal && isAuthenticated} onClose={() => setShowProfileModal(false)} />
        <LoginModal isOpen={showProfileModal && !isAuthenticated} onClose={() => setShowProfileModal(false)} />
      </div>
    </div>
  );
};

export const App = (): JSX.Element => {
  return (
    <Router>
      <GlobalProviders>
        <AppContent />
      </GlobalProviders>
    </Router>
  );
};
