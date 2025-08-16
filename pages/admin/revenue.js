import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { orders } from '../../utils/api';
import { getUser, isAdmin } from '../../utils/auth';

export default function AdminRevenue() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user || !isAdmin()) {
      router.push('/');
      return;
    }
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const response = await orders.getRevenue();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-600">Loading revenue data...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">💰 Revenue Dashboard</h1>
        <p className="text-gray-600">Track your store's financial performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">💵</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">This Month</h3>
          <p className="text-3xl font-bold text-blue-600">${stats.monthlyRevenue.toFixed(2)}</p>
        </div>

        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalOrders}</p>
        </div>

        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">⏳</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">📊 Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-semibold text-green-800">Average Order Value</span>
              <span className="text-xl font-bold text-green-600">
                ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-semibold text-blue-800">Completion Rate</span>
              <span className="text-xl font-bold text-blue-600">
                {stats.totalOrders > 0 ? (((stats.totalOrders - stats.pendingOrders) / stats.totalOrders) * 100).toFixed(1) : '0'}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-semibold text-purple-800">Monthly Growth</span>
              <span className="text-xl font-bold text-purple-600">
                {stats.totalRevenue > 0 ? ((stats.monthlyRevenue / stats.totalRevenue) * 100).toFixed(1) : '0'}%
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">🎯 Performance Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Revenue Goal Progress</span>
                <span className="text-sm text-gray-500">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Order Fulfillment</span>
                <span className="text-sm text-gray-500">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{width: '90%'}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Customer Satisfaction</span>
                <span className="text-sm text-gray-500">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full" style={{width: '95%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 card p-6">
        <h2 className="text-2xl font-bold mb-4">📈 Revenue Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-semibold text-green-800 mb-1">Growing Strong</h3>
            <p className="text-sm text-green-600">Revenue is trending upward</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-semibold text-blue-800 mb-1">Customer Base</h3>
            <p className="text-sm text-blue-600">Expanding customer reach</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-semibold text-purple-800 mb-1">High Quality</h3>
            <p className="text-sm text-purple-600">Excellent product ratings</p>
          </div>
        </div>
      </div>
    </div>
  );
}