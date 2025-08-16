import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { orders } from '../utils/api';
import { getUser } from '../utils/auth';

export default function Orders() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orders.getAll();
      setOrderList(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    setCancellingOrder(orderId);
    try {
      await orders.cancel(orderId);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCancellingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancelOrder = (status) => {
    return ['pending', 'processing'].includes(status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-600">Loading your orders...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">📦 My Orders</h1>
        <p className="text-gray-600">Track and manage your order history</p>
      </div>
      
      {orderList.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">📦</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h3>
          <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <Link href="/" className="btn-primary inline-block">
            🛍️ Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orderList.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Order #{order.id}</h3>
                  <p className="text-gray-600 mb-1">
                    📅 Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 mb-3">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </p>
                  {canCancelOrder(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingOrder === order.id}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-all duration-200"
                    >
                      {cancellingOrder === order.id ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Cancelling...
                        </>
                      ) : (
                        '❌ Cancel Order'
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4 mb-4">
                <h4 className="font-semibold mb-3">📋 Items:</h4>
                <div className="space-y-2">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600">Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {order.shipping_address && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">📍 Shipping Address:</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{order.shipping_address}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}