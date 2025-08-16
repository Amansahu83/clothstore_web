import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUser, clearAuth, isAdmin } from '../utils/auth';
import dynamic from 'next/dynamic';

const AdminNotifications = dynamic(() => import('./AdminNotifications'), {
  ssr: false
});

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = getUser();
    setUser(userData);
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setCartCount(0);
    localStorage.removeItem('lastNotificationCheck');
    window.location.href = '/';
  };

  // Update user state when auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      const userData = getUser();
      setUser(userData);
    };
    
    // Custom event listener for auth changes
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  return (
    <div className="min-h-screen">
      <nav className="bg-white/90 backdrop-blur-md shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform">
                🛍️ ClothStore
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="nav-link">
                🏠 Home
              </Link>
              
              {user ? (
                <>
                  {mounted && isAdmin() && (
                    <>
                      <Link href="/admin" className="nav-link">
                        ⚙️ Admin
                      </Link>
                      <AdminNotifications />
                    </>
                  )}
                  <Link href="/cart" className="nav-link relative">
                    🛒 Cart
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/orders" className="nav-link">
                    📦 Orders
                  </Link>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-700 font-medium">👋 Hi, {user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav-link">
                    🔑 Login
                  </Link>
                  <Link href="/register" className="btn-primary">
                    ✨ Register
                  </Link>
                </>
              )}
            </div>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-3">
                <Link href="/" className="mobile-nav-link">
                  🏠 Home
                </Link>
                {user ? (
                  <>
                    {mounted && isAdmin() && (
                      <Link href="/admin" className="mobile-nav-link">
                        ⚙️ Admin
                      </Link>
                    )}
                    <Link href="/cart" className="mobile-nav-link">
                      🛒 Cart ({cartCount})
                    </Link>
                    <Link href="/orders" className="mobile-nav-link">
                      📦 Orders
                    </Link>
                    <div className="px-4 py-2 text-gray-700">👋 Hi, {user.name}</div>
                    <button
                      onClick={handleLogout}
                      className="mx-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      🚪 Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="mobile-nav-link">
                      🔑 Login
                    </Link>
                    <Link href="/register" className="mx-4 btn-primary text-center">
                      ✨ Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-8 px-4">
        {children}
      </main>
      
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">🛍️ ClothStore</h3>
              <p className="text-gray-400">Your one-stop destination for trendy and comfortable clothing.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-400 hover:text-white transition-colors">Home</Link>
                <Link href="/cart" className="block text-gray-400 hover:text-white transition-colors">Cart</Link>
                <Link href="/orders" className="block text-gray-400 hover:text-white transition-colors">Orders</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">📧 amangupta87@gmail.com</p>
              <p className="text-gray-400">📞 +91 8354983504</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ClothStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}