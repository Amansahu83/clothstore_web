import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { orders } from '../../utils/api';
import { getUser, isAdmin } from '../../utils/auth';

export default function AdminOrders() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user || !isAdmin()) {
      router.push('/');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orders.getAllAdmin();
      setOrderList(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orders.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update order status');
    }
  };

  const filteredOrders = orderList.filter(order => 
    filter === 'all' || order.status === filter
  );

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

  if (loading) return <div className="text-center py-8">Loading orders...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">📦 Order Management</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-48"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Order #{order.id}</h3>
                <p className="text-gray-600">👤 {order.user_name} ({order.user_email})</p>
                <p className="text-sm text-gray-500">📅 {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600 mb-2">${parseFloat(order.total_amount).toFixed(2)}</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <h4 className="font-semibold mb-2">Items:</h4>
              <div className="space-y-2">
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 bg-gray-50 px-3 rounded">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {order.shipping_address && (
              <div className="border-t pt-4 mb-4">
                <h4 className="font-semibold mb-2">📍 Shipping Address:</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">{order.shipping_address}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Update Status:</h4>
              <div className="flex space-x-2">
                {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(order.id, status)}
                    disabled={order.status === status}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      order.status === status
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">No orders match the selected filter</p>
        </div>
      )}
    </div>
  );
}