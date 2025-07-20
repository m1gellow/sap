import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { NavSection } from '../sections/NavSection';
import { FooterSection } from '../sections/FooterSection';
import { ProfileModal } from '../components/Profile/ProfileModal';
import { LoginModal } from '../components/Profile/LoginModal';
import { useProfile } from '../lib/context/ProfileContext';
import { DeliveryInfoPage } from '../pages/DeliveryInfoPage';
import { BlogPage } from '../pages/BlogPage';
import { ArticlePage } from '../pages/ArticlePage';

const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import('../pages/CatalogPage').then((m) => ({ default: m.CatalogPage })));
const ContactsPage = lazy(() => import('../pages/ContactsPage').then((m) => ({ default: m.ContactsPage })));
const CartPage = lazy(() => import('../pages/CartPage').then((m) => ({ default: m.CartPage })));
const FavoritesPage = lazy(() => import('../pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })));
const ProductPage = lazy(() => import('../pages/ProductPage').then((m) => ({ default: m.ProductPage })));
const DeliveryPage = lazy(() => import('../pages/DeliveryPage'))
const OrderSuccess = lazy(() => import('../pages/OrderSucess').then((m) => ({ default: m.OrderSuccess })));
const AdminLogin = lazy(() => import('../pages/Admin/Login/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('../pages/Admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() =>
  import('../pages/Admin/Dashboard/AdminDashboard').then((m) => ({ default: m.AdminDashboard })),
);
const AdminProducts = lazy(() =>
  import('../pages/Admin/Products/AdminProducts').then((m) => ({ default: m.AdminProducts })),
);
const AdminOrdersPage = lazy(() => import('../pages/Admin/Orders').then((m) => ({ default: m.AdminOrdersPage })));
const AdminUsers = lazy(() => import('../pages/Admin/Users/AdminUsers').then((m) => ({ default: m.AdminUsers })));
const AdminSettings = lazy(() =>
  import('../pages/Admin/Settings/AdminSettings').then((m) => ({ default: m.AdminSettings })),
);
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export const AppRouter = () => {
  const { isAuthenticated, showProfileModal, setShowProfileModal } = useProfile();
  return (
    <div className="w-full max-w-full overflow-hidden ">
      <div className="relative">
        <NavSection />

        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/delivery-info" element={<DeliveryInfoPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<ArticlePage  />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/order-sucess" element={<OrderSuccess />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>

        <FooterSection />

        <ProfileModal isOpen={showProfileModal && isAuthenticated} onClose={() => setShowProfileModal(false)} />
        <LoginModal isOpen={showProfileModal && !isAuthenticated} onClose={() => setShowProfileModal(false)} />
      </div>
    </div>
  );
};
