import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { auth } from '../utils/api';
import { setAuth } from '../utils/auth';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await auth.login(formData);
      setAuth(response.data.token, response.data.user);
      
      if (response.data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">🔑 Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account to continue shopping</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                🔒 Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Signing in...
                </>
              ) : (
                '🚀 Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                Create one here →
              </Link>
            </p>
            <p className="text-gray-600">
              Forgot your password?{' '}
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 font-semibold">
                Reset it here →
              </Link>
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">🎆 Demo Accounts</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Admin:</strong> admin@clothstore.com / password</p>
              <p><strong>User:</strong> user@clothstore.com / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}