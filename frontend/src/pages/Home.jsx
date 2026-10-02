import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../services/product.api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      label: "New Season",
      title: "Style That\nFeels Like You",
      desc: "Premium clothing for every mood, every moment.",
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      bg: "bg-[#dfd6cb]",
      gradFrom: "from-[#dfd6cb]",
      gradVia: "via-[#dfd6cb]/80"
    },
    {
      label: "Summer Collection",
      title: "Bright &\nBreezy",
      desc: "Refresh your wardrobe with our latest arrivals.",
      img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
      bg: "bg-[#e2dfd2]",
      gradFrom: "from-[#e2dfd2]",
      gradVia: "via-[#e2dfd2]/80"
    },
    {
      label: "Exclusive Fits",
      title: "Tailored to\nPerfection",
      desc: "Discover the perfect fit for every occasion.",
      img: "https://images.unsplash.com/photo-1550614000-4b95d466f111?auto=format&fit=crop&w=800&q=80",
      bg: "bg-[#d4dfe2]",
      gradFrom: "from-[#d4dfe2]",
      gradVia: "via-[#d4dfe2]/80"
    },
    {
      label: "Streetwear",
      title: "Urban\nVibes",
      desc: "Street style that stands out from the crowd.",
      img: "https://images.unsplash.com/photo-1523398002811-999aa8dfd328?auto=format&fit=crop&w=800&q=80",
      bg: "bg-[#e2d4d4]",
      gradFrom: "from-[#e2d4d4]",
      gradVia: "via-[#e2d4d4]/80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Fetch some featured products for the home page
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getProducts({ limit: 10 }),
  });

  const [recentlyVisited, setRecentlyVisited] = React.useState([]);
  const [topCategoryId, setTopCategoryId] = React.useState(null);

  React.useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem('recently_visited') || '[]');
      setRecentlyVisited(recent);
      
      // Algorithm: Find most frequently visited category
      if (recent.length > 0) {
        const categoryCounts = {};
        let maxCount = 0;
        let topCat = null;
        
        recent.forEach(item => {
          const catId = item.category?._id || item.category;
          if (catId) {
            categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
            if (categoryCounts[catId] > maxCount) {
              maxCount = categoryCounts[catId];
              topCat = catId;
            }
          }
        });
        
        if (topCat) {
          setTopCategoryId(topCat);
        }
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  // Fetch suggested products based on top category
  const { data: suggestedData, isLoading: isSuggestedLoading } = useQuery({
    queryKey: ['suggested-products', topCategoryId],
    queryFn: () => productApi.getProducts({ category: topCategoryId, limit: 10 }),
    enabled: !!topCategoryId,
  });

  const featuredProducts = productsData?.data?.products || [];
  
  // Calculate final suggestions
  let suggestedForYou = featuredProducts.slice(0, 4);
  if (suggestedData?.data?.products?.length > 0) {
    const recentIds = recentlyVisited.map(item => item._id);
    const personalized = suggestedData.data.products.filter(p => !recentIds.includes(p._id));
    if (personalized.length > 0) {
      suggestedForYou = personalized.slice(0, 4);
    }
  }

  return (
    <div className="bg-white min-h-screen pb-16 md:pb-0">
      
      {/* ==================================================== */}
      {/* MOBILE UI (Hidden on desktop)                        */}
      {/* ==================================================== */}
      <div className="md:hidden block px-4 pt-2 bg-[#fafafa]">
        
        {/* Search */}
        <form onSubmit={(e) => {
          e.preventDefault();
          if (searchTerm.trim()) {
            navigate(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
          }
        }} className="relative mb-6">
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for outfits, brands and more..." 
            className="w-full pl-11 pr-4 py-3 bg-gray-100/80 border border-gray-200/50 rounded-2xl text-[13px] text-gray-700 placeholder-gray-500 focus:outline-none" 
          />
          <button type="submit" className="hidden">Search</button>
        </form>

        {/* Hero Banner (Looping) */}
        <div className={`relative rounded-[20px] overflow-hidden mb-6 h-[200px] transition-colors duration-500 ${slides[currentSlide].bg}`}>
          <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, idx) => (
              <div key={idx} className="min-w-full h-full relative">
                <img src={slide.img} alt={slide.title} className="absolute right-[-10%] top-0 h-full w-[80%] object-cover object-top mix-blend-multiply opacity-80" />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradFrom} ${slide.gradVia} to-transparent`}></div>
                <div className="relative z-10 p-5 h-full flex flex-col justify-center max-w-[70%]">
                  <span className="text-[9px] font-bold tracking-widest text-gray-700 mb-2 uppercase">{slide.label}</span>
                  <h2 className="text-[26px] font-serif text-gray-900 leading-tight mb-2 whitespace-pre-line">{slide.title}</h2>
                  <p className="text-[11px] text-gray-700 mb-4 leading-snug pr-4">{slide.desc}</p>
                  <Link to="/products" className="inline-flex items-center gap-1 bg-[#4a5c4e] text-white text-[11px] font-medium px-5 py-2 rounded-full self-start shadow-sm">
                    Shop Now <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {slides.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentSlide(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-gray-900 w-3' : 'bg-gray-400'}`}
              />
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-8 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          <div className="flex gap-3">
            {[
              { name: 'Men', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=150&q=80' },
              { name: 'Women', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=150&q=80' },
              { name: 'Outerwear', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=150&q=80' },
              { name: 'Jeans', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=150&q=80' },
              { name: 'Dresses', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=150&q=80' },
              { name: 'Footwear', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=150&q=80' },
            ].map((cat, i) => (
              <Link to={`/products?category=${cat.name.toLowerCase()}`} key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-[72px] h-[84px] rounded-[14px] bg-[#f5f5f5] flex items-center justify-center overflow-hidden border border-gray-100">
                   <img src={cat.img} alt={cat.name} className="w-full h-full object-cover mix-blend-multiply opacity-90 p-1" />
                </div>
                <span className="text-[12px] text-gray-800 font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recently Visited */}
        {recentlyVisited.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold text-gray-900">Recently Visited</h3>
            </div>
            
            <div className="flex overflow-x-auto gap-3.5 pb-2 -mx-4 px-4 no-scrollbar">
              {recentlyVisited.map((item) => (
                <Link to={`/products/${item._id}`} key={item._id} className="w-[140px] shrink-0 group">
                  <div className="h-[170px] bg-[#f5f5f5] rounded-[16px] mb-2.5 relative overflow-hidden">
                    {item.images?.[0] ? (
                      <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover mix-blend-multiply opacity-95" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="px-1">
                    <h4 className="text-[12px] font-medium text-gray-700 truncate">{item.name}</h4>
                    <p className="text-[13px] font-bold text-gray-900 mt-0.5">₹{(item.price || 0).toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Suggested For You */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-bold text-gray-900">Suggested For You</h3>
            <Link to="/products" className="text-[12px] text-gray-600 font-medium flex items-center gap-1">
              View All <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
          
          <div className="flex overflow-x-auto gap-3.5 pb-2 -mx-4 px-4 no-scrollbar">
            {isLoading || isSuggestedLoading ? (
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-[140px] h-[170px] bg-gray-100 rounded-[16px] shrink-0 animate-pulse"></div>)}
              </div>
            ) : (
              suggestedForYou.map((item) => (
                <Link to={`/products/${item._id}`} key={item._id} className="w-[140px] shrink-0 group">
                  <div className="h-[170px] bg-[#f5f5f5] rounded-[16px] mb-2.5 relative overflow-hidden">
                    {item.images?.[0] ? (
                      <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover mix-blend-multiply opacity-95" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <button className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-red-500 transition-colors">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </button>
                    <button className="absolute bottom-2.5 right-2.5 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center shadow-md text-white hover:bg-gray-800 transition-colors">
                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </button>
                  </div>
                  <div className="px-1">
                    <h4 className="text-[12px] font-medium text-gray-700 truncate">{item.name}</h4>
                    <p className="text-[13px] font-bold text-gray-900 mt-0.5">₹{(item.price || 0).toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* DESKTOP UI (Hidden on mobile)                        */}
      {/* ==================================================== */}
      <div className="hidden md:block">
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
              {featuredProducts.slice(0, 4).map((product) => (
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
    </div>
  );
};

export default Home;
