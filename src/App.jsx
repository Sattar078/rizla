import React, { useState } from 'react';
import AnnouncementBar from './components/AnnouncementBar.jsx';
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
    <div className="bg-background">
      <AnnouncementBar />
      <Navbar />
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Categories Section */}
        <Categories onCategoryChange={handleCategoryChange} />

        {/* Featured Products Section */}
        <FeaturedCollections selectedCategory={selectedCategory} />

        {/* Collections Section */}
        <StoreGallery />

        {/* Promotional Banner Section */}
        <VisitStore />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;