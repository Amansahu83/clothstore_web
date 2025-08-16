import { useState, useEffect } from 'react';
import { products } from '../utils/api';

export default function Home() {
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [productList, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await products.getAll();
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = productList;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    window.location.reload();
  };

  const categories = ['all', ...new Set(productList.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-600">Loading amazing products...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">🎆 Welcome to ClothStore</h1>
        <p className="text-xl opacity-90">Discover trendy and comfortable clothing for every occasion</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? '🏷️ All Categories' : `👕 ${category}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="card group">
            <div className="relative overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-4xl">👕</span>
                </div>
              )}
              {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Only {product.stock_quantity} left!
                </div>
              )}
              {product.stock_quantity === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🚫 Out of Stock</span>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-green-600">${product.price}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {product.size}
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {product.color}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">🏷️ {product.category}</span>
                <span className="text-sm text-gray-500">📦 {product.stock_quantity} in stock</span>
              </div>
              
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock_quantity === 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {product.stock_quantity === 0 ? '🚫 Out of Stock' : '🛒 Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
          ✅ Product added to cart!
        </div>
      )}
    </div>
  );
}