import React, { useState } from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedCollections from '../components/FeaturedCollections';
import StoreGallery from '../components/StoreGallery';
import VisitStore from '../components/VisitStore';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="full-home">
      <main className="overflow-hidden">
        <Hero />
        <Categories onCategoryChange={setSelectedCategory} />
        <FeaturedCollections selectedCategory={selectedCategory} />
        <StoreGallery />
        <VisitStore />
      </main>
    </div>
  );
};

export default Home;
