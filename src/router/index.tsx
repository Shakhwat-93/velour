import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

// Layouts
import StoreLayout   from '@/components/layout/StoreLayout'
import AdminLayout   from '@/components/layout/AdminLayout'
import PrivateRoute  from '@/components/layout/PrivateRoute'

// Store pages
import Home           from '@/pages/Home'
import Shop           from '@/pages/Shop'
import ProductDetail  from '@/pages/ProductDetail'
import Categories     from '@/pages/Categories'
import CategoryDetail from '@/pages/CategoryDetail'
import Checkout       from '@/pages/Checkout'
import OrderSuccess   from '@/pages/OrderSuccess'
import About          from '@/pages/About'
import NotFound       from '@/pages/NotFound'

// Admin pages
import AdminLogin       from '@/pages/admin/AdminLogin'
import AdminDashboard   from '@/pages/admin/AdminDashboard'
import AdminOrders      from '@/pages/admin/AdminOrders'
import AdminProducts    from '@/pages/admin/AdminProducts'
import AdminProductForm from '@/pages/admin/AdminProductForm'
import AdminCategories  from '@/pages/admin/AdminCategories'
import AdminSettings    from '@/pages/admin/AdminSettings'

const router = createBrowserRouter([
  // ── Public Storefront ────────────────────────────────────────────
  {
    element: <StoreLayout />,
    children: [
      { path: '/',                     element: <Home /> },
      { path: '/shop',                 element: <Shop /> },
      { path: '/shop/:slug',           element: <ProductDetail /> },
      { path: '/categories',           element: <Categories /> },
      { path: '/categories/:slug',     element: <CategoryDetail /> },
      { path: '/checkout',             element: <Checkout /> },
      { path: '/order-success',        element: <OrderSuccess /> },
      { path: '/about',                element: <About /> },
      { path: '*',                     element: <NotFound /> },
    ],
  },

  // ── Admin Login (no layout) ──────────────────────────────────────
  { path: '/admin/login', element: <AdminLogin /> },

  // ── Admin Panel (protected) ──────────────────────────────────────
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard',         element: <AdminDashboard /> },
      { path: 'orders',            element: <AdminOrders /> },
      { path: 'products',          element: <AdminProducts /> },
      { path: 'products/new',      element: <AdminProductForm /> },
      { path: 'products/:id/edit', element: <AdminProductForm /> },
      { path: 'categories',        element: <AdminCategories /> },
      { path: 'settings',          element: <AdminSettings /> },
    ]
  }
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
