import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { orders } from '../utils/api';
import { getUser } from '../utils/auth';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartData);
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(id);
      return;
    }
    
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    if (!shippingAddress.trim()) {
      alert('Please enter shipping address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_address: shippingAddress
      };

      await orders.create(orderData);
      localStorage.removeItem('cart');
      setShowSuccess(true);
      setTimeout(() => router.push('/orders'), 2000);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold gradient-text mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet!</p>
        <Link href="/" className="btn-primary inline-block">
          🛍️ Start Shopping
        </Link>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="text-center py-16">
        <div className="text-8xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">Thank you for your purchase. Redirecting to your orders...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">🛒 Shopping Cart</h1>
        <p className="text-gray-600">{getTotalItems()} items in your cart</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="card p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={`https://clothstore-98w2.onrender.com/api${item.image_url}`}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">👕</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">${item.price}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Size: {item.size}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Color: {item.color}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="card p-6 h-fit sticky top-24">
          <h2 className="text-2xl font-bold mb-6">📊 Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Items ({getTotalItems()}):</span>
              <span className="font-semibold">${getTotalPrice()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">${getTotalPrice()}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              📦 Shipping Address
            </label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="input-field"
              rows="4"
              placeholder="Enter your complete shipping address..."
              required
            />
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={loading || !shippingAddress.trim()}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing Order...
              </>
            ) : (
              '🚀 Place Order'
            )}
          </button>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            🔒 Secure checkout powered by ClothStore
          </div>
        </div>
      </div>
    </div>
  );
}