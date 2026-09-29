import { useState, useEffect } from 'react';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Build query params based on what's active
  const queryParams = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(selectedCategory && { category: selectedCategory }),
  };

  const { data: productsData, isLoading, isError, error } = useProducts(queryParams);
  const { data: categoriesData } = useCategories();

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategory('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
        
        {/* Search Input */}
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`block w-full text-left px-2 py-1 rounded ${selectedCategory === '' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                All Categories
              </button>
              {categoriesData?.categories?.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`block w-full text-left px-2 py-1 rounded ${selectedCategory === cat._id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          {(debouncedSearch || selectedCategory) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {isError && (
            <div className="bg-red-50 p-4 rounded-md text-red-700">
              Error loading products: {error.message}
            </div>
          )}

          {!isLoading && !isError && productsData?.products?.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}

          {!isLoading && !isError && productsData?.products?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsData.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
