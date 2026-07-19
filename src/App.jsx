import React from 'react';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import Navbar from './components/Navbar.jsx';
// import Hero from './components/Hero.jsx';
// import About from './pages/About.jsx';
// import Services from './pages/Services.jsx';
// import Portfolio from './pages/Portfolio.jsx';
// import Testimonials from './pages/Testimonials.jsx';
// import Contact from './pages/Contact.jsx';
import Footer from './components/Footer.jsx';

const App = () => {
  return (
    <div className="bg-background">
      <AnnouncementBar />
      <Navbar />
      <main>
        {/* 
          The new sections (Hero, Categories, Featured Products, etc.) 
          will be added here one by one.
          I have commented out the old structure for now.
        */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default App;