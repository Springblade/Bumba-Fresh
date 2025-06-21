import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import { AuthPage } from './pages/AuthPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="relative flex flex-col w-full min-h-screen bg-white">
            {/* Simplified background decoration */}
            <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-primary-50/70 to-transparent" />
            <div className="fixed top-1/4 right-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-20 animate-float"></div>
            <div className="relative z-10 flex flex-col w-full">
              <Header />
              <main className="flex-grow w-full">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout/payment" element={<PaymentPage />} />
                  <Route path="/checkout/confirmation" element={<ConfirmationPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}