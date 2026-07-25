import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Categories from './components/Categories.jsx';
import FeaturedCollections from './components/FeaturedCollections.jsx';
import StoreGallery from './components/StoreGallery.jsx';
import VisitStore from './components/VisitStore.jsx';
import Footer from './components/footer.jsx';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />
      <div className="full-home">
      <main className="overflow-hidden">
        <Hero />
        <Categories onCategoryChange={handleCategoryChange} />
        <FeaturedCollections selectedCategory={selectedCategory} />
        <StoreGallery />
        <VisitStore />
      </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;