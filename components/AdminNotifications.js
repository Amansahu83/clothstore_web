import { useState, useEffect } from 'react';
import { orders } from '../utils/api';
import { getUser, isAdmin } from '../utils/auth';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user || !isAdmin()) return;
    
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // Set lastCheck to current time on first load to avoid showing old orders
      const storedLastCheck = localStorage.getItem('lastNotificationCheck');
      const currentTime = Date.now();
      
      if (!storedLastCheck) {
        // First time - set to current time and don't show existing orders
        setLastCheck(currentTime);
        localStorage.setItem('lastNotificationCheck', currentTime.toString());
      } else {
        setLastCheck(parseInt(storedLastCheck));
      }
      
      setInitialized(true);
      
      // Start checking for new orders
      const interval = setInterval(checkForNewOrders, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const checkForNewOrders = async () => {
    try {
      const user = getUser();
      if (!user || !isAdmin() || !initialized || !lastCheck) return;
      
      const response = await orders.getAllAdmin();
      const recentOrders = response.data.filter(order => 
        new Date(order.created_at).getTime() > lastCheck
      );
      
      if (recentOrders.length > 0) {
        const newNotifications = recentOrders.map(order => ({
          id: order.id,
          message: `New order #${order.id} from ${order.user_name}`,
          amount: order.total_amount,
          timestamp: new Date(order.created_at)
        }));
        
        setNotifications(prev => [...newNotifications, ...prev].slice(0, 10));
        const newLastCheck = Date.now();
        setLastCheck(newLastCheck);
        localStorage.setItem('lastNotificationCheck', newLastCheck.toString());
      }
    } catch (error) {
      console.error('Error checking for new orders:', error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">🔔 Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="text-2xl mb-2">🔕</div>
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="p-4 border-b hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.message}
                  </p>
                  <p className="text-sm text-green-600 font-semibold">
                    💰 ${parseFloat(notification.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}