import React from 'react';
import './BrandCarousel.css';

import dove from '../assets/brands/dove.png';
import vaseline from '../assets/brands/vaseline.png';
import nivea from '../assets/brands/nivea.png';
import loreal from '../assets/brands/loreal.png';
import garnier from '../assets/brands/garnier.png';
import pantene from '../assets/brands/pantene.png';
import tresemme from '../assets/brands/tresemme.png';
import headAndShoulders from '../assets/brands/head-and-shoulders.png';
import gillette from '../assets/brands/gillette.png';
import oldSpice from '../assets/brands/old-spice.png';

const brands = [
  { name: 'Dove', logo: dove },
  { name: 'Vaseline', logo: vaseline },
  { name: 'Nivea', logo: nivea },
  { name: "L'Oréal", logo: loreal },
  { name: 'Garnier', logo: garnier },
  { name: 'Pantene', logo: pantene },
  { name: 'TRESemmé', logo: tresemme },
  { name: 'Head & Shoulders', logo: headAndShoulders },
  { name: 'Gillette', logo: gillette },
  { name: 'Old Spice', logo: oldSpice },
];

export const BrandCarousel: React.FC = () => {
  return (
    <section className="brand-carousel-section">
      <div className="brand-carousel-header">
        <h2>Trusted Brands</h2>
        <p>We proudly offer products from some of the world's most trusted brands.</p>
      </div>
      
      <div className="brand-carousel-container">
        <div className="brand-carousel-track">
          {/* We duplicate the brand list to create a seamless infinite scrolling effect */}
          <div className="brand-list">
            {brands.map((brand, index) => (
              <div key={`brand-1-${index}`} className="brand-logo-wrapper">
                <img src={brand.logo} alt={`${brand.name} logo`} className="brand-logo" />
              </div>
            ))}
          </div>
          <div className="brand-list">
            {brands.map((brand, index) => (
              <div key={`brand-2-${index}`} className="brand-logo-wrapper">
                <img src={brand.logo} alt={`${brand.name} logo`} className="brand-logo" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
