import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../services/product.api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  // Fetch some featured products for the home page
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getProducts({ limit: 4 }),
  });

  const featuredProducts = productsData?.data?.products?.slice(0, 4) || [];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary-900">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Elevate Your <br /> Everyday Style
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium">
            Discover our curated collection of premium fashion, designed for the modern individual who appreciates quality and sophistication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="bg-white text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Shop Collection
            </Link>
            {user ? (
              <Link 
                to="/profile" 
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
              >
                My Profile
              </Link>
            ) : (
              <Link 
                to="/products" 
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
              >
                View Lookbook
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Shop by Category</h2>
          <div className="w-24 h-1 bg-primary-900 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/products?category=men" className="group relative h-96 rounded-3xl overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-700 ease-in-out">
               <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Men" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-3xl font-black text-white mb-2">Menswear</h3>
              <p className="text-gray-200 font-medium group-hover:text-white transition-colors">Explore Collection &rarr;</p>
            </div>
          </Link>
          
          <Link to="/products?category=women" className="group relative h-96 rounded-3xl overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-700 ease-in-out">
               <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Women" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-3xl font-black text-white mb-2">Womenswear</h3>
              <p className="text-gray-200 font-medium group-hover:text-white transition-colors">Explore Collection &rarr;</p>
            </div>
          </Link>

          <Link to="/products?category=accessories" className="group relative h-96 rounded-3xl overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-700 ease-in-out">
               <img src="https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Accessories" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-3xl font-black text-white mb-2">Accessories</h3>
              <p className="text-gray-200 font-medium group-hover:text-white transition-colors">Explore Collection &rarr;</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50 rounded-[3rem] mb-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Trending Now</h2>
            <div className="w-24 h-1 bg-primary-900 rounded-full"></div>
          </div>
          <Link to="/products" className="text-primary-900 font-bold hover:text-primary-700 hidden sm:block">
            View All Products &rarr;
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-80 rounded-3xl mb-4"></div>
                <div className="bg-gray-200 h-6 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-5 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`} className="group block">
                <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-[4/5] mb-4 relative">
                  {product.images?.[0] ? (
                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                <p className="text-gray-500 font-medium mt-1">₹{(product.price || 0).toLocaleString('en-IN')}</p>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-12 text-center sm:hidden">
          <Link to="/products" className="inline-block bg-primary-900 text-white px-8 py-4 rounded-full font-bold shadow-lg">
            View All Products
          </Link>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-primary-900 py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-white mb-6">Join the Rizla Club</h2>
          <p className="text-lg text-gray-300 mb-10">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-4 focus:ring-white/20 font-medium text-gray-900"
              required
            />
            <button 
              type="submit" 
              className="bg-white text-primary-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
