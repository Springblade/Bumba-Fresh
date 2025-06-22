import React, { useEffect, Suspense, lazy } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastProvider } from './context/ToastContext'
import { MyAccountPageLayout } from './components/layouts/MyAccountPageLayout'
import { AccountDashboard } from './components/account/AccountDashboard'
import { OrderHistory } from './components/account/OrderHistory'
import { SubscriptionManagement } from './components/account/SubscriptionManagement'
import { ProfileSettings } from './components/account/ProfileSettings'
import { ErrorProvider } from './context/ErrorContext'
import { ErrorBoundaryWrapper } from './components/ErrorBoundaryWrapper'
import { ErrorBoundaryContainer } from './components/ErrorBoundaryContainer'
import { ScrollToTop } from './components/ScrollToTop'
import ChatWidget from './components/chat/ChatWidget'
import AdminSetup from './components/account/AdminSetup' // Import AdminSetup component
// Lazy load non-critical pages
const MenuPage = lazy(() => import('./pages/MenuPage'))
const AuthPage = lazy(() =>
  import('./pages/AuthPage').then((m) => ({
    default: m.AuthPage,
  })),
)
const CartPage = lazy(() => import('./pages/CartPage'))
const PaymentPage = lazy(() => import('./pages/PaymentPage'))
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'))
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'))
const ConfigureSubscriptionPage = lazy(
  () => import('./pages/ConfigureSubscriptionPage'),
)
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminMeals = lazy(() => import('./pages/admin/AdminMeals'))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'))
const AdminSubscriptions = lazy(() => import('./pages/admin/AdminSubscriptions'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>
)

// New RootLayout component
const RootLayout = () => {
  const location = useLocation()
  const pagesWithCustomBackground = ['/auth']
  const showGradient = !pagesWithCustomBackground.includes(location.pathname)
  return (
    <div className="relative flex flex-col w-full min-h-screen bg-white">
      {showGradient && (
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-primary-50/30 to-transparent" />
      )}
      <div className="relative z-10 flex flex-col w-full">
        <Header />
        <main className="flex-grow w-full">
          <Suspense fallback={<LoadingFallback />}>
            <ScrollToTop />
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        <ChatWidget /> {}
      </div>
    </div>
  )
}
export function App() {
  return (
    <ErrorBoundaryContainer name="Application">
      <Router>
        <ErrorProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <Routes>
                  <Route element={<RootLayout />}>
                    {/* Public Routes */}
                    <Route index element={<HomePage />} />
                    <Route
                      path="menu"
                      element={
                        <ErrorBoundaryWrapper name="Menu">
                          <MenuPage />
                        </ErrorBoundaryWrapper>
                      }
                    />
                    <Route path="auth" element={<AuthPage />} />
                    <Route
                      path="cart"
                      element={
                        <ErrorBoundaryContainer name="Cart">
                          <CartPage />
                        </ErrorBoundaryContainer>
                      }
                    />
                    <Route path="subscribe" element={<SubscriptionPage />} />
                    {/* Protected Routes */}
                    <Route
                      path="configure-subscription"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundaryContainer name="Subscription Configuration">
                            <ConfigureSubscriptionPage />
                          </ErrorBoundaryContainer>
                        </ProtectedRoute>
                      }
                    />
                    {/* Protected Account Routes */}
                    <Route
                      path="account"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundaryContainer name="Account">
                            <MyAccountPageLayout />
                          </ErrorBoundaryContainer>
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<AccountDashboard />} />
                      <Route path="dashboard" element={<AccountDashboard />} />
                      <Route path="orders" element={<OrderHistory />} />
                      <Route
                        path="subscription"
                        element={<SubscriptionManagement />}
                      />
                      <Route path="settings" element={<ProfileSettings />} />
                      <Route path="admin-setup" element={<AdminSetup />} /> {/* New admin setup route */}
                    </Route>
                    {/* Protected Checkout Routes */}
                    <Route
                      path="checkout/payment"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundaryContainer name="Payment">
                            <PaymentPage />
                          </ErrorBoundaryContainer>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="checkout/confirmation"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundaryContainer name="Order Confirmation">
                            <ConfirmationPage />
                          </ErrorBoundaryContainer>
                        </ProtectedRoute>
                      }
                    />
                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute isAdminRoute>
                          <ErrorBoundaryContainer name="Admin">
                            <AdminLayout />
                          </ErrorBoundaryContainer>
                        </ProtectedRoute>
                      }
                    >
                      <Route
                        index
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <AdminDashboard />
                          </Suspense>
                        }
                      />
                      <Route
                        path="orders"
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <AdminOrders />
                          </Suspense>
                        }
                      />
                      <Route
                        path="meals"
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <AdminMeals />
                          </Suspense>
                        }
                      />
                      <Route
                        path="customers"
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <AdminCustomers />
                          </Suspense>
                        }
                      />
                      <Route
                        path="subscriptions"
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <AdminSubscriptions />
                          </Suspense>
                        }
                      />
                      <Route
                        path="settings"
                        element={
                          <Suspense fallback={<LoadingFallback />}>
                            <AdminSettings />
                          </Suspense>
                        }
                      />
                    </Route>
                  </Route>
                </Routes>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ErrorProvider>
      </Router>
    </ErrorBoundaryContainer>
  )
}
