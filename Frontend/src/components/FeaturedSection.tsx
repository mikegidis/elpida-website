import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Droplets } from 'lucide-react';
import atelierImg from '../assets/images/special_glow_atelier_1785434602713.jpg';

interface FeaturedSectionProps {
  products: Product[];
  loading?: boolean;
  onQuickAdd: (product: Product) => void;
  onSelect: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  onViewAll: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  products,
  loading = false,
  onQuickAdd,
  onSelect,
  onToggleWishlist,
  wishlistIds,
  onViewAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'bestsellers' | 'new'>('bestsellers');

  const filteredProducts = products.filter((p) => {
    if (filter === 'bestsellers') return p.isBestseller;
    if (filter === 'new') return p.isNew;
    return true;
  });

  return (
    <section className="py-24 bg-[#0E0F10] relative overflow-hidden">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E8E3D9]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#6B8E23] mb-2 font-medium">
              <span>Elpida's Shop</span>
            </div>
            <h2 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-light text-[#E8E3D9]">
              Products of Elpida
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-[#141617] p-1.5 rounded-full border border-[#E8E3D9]/10 self-start md:self-auto">
            {(['bestsellers', 'new', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider transition-all duration-300 EGP{
                  filter === tab
                    ? 'bg-[#6B8E23] text-white font-medium shadow-md'
                    : 'text-[#A39E93] hover:text-[#E8E3D9]'
                }`}
              >
                {tab === 'bestsellers' ? 'Bestsellers' : tab === 'new' ? 'New Arrivals' : 'All Curations'}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-[#6B8E23] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-[#A39E93] font-light">Curating collection...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAdd={onQuickAdd}
                onSelect={onSelect}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-[#E8E3D9]/25 hover:border-[#6B8E23] bg-transparent hover:bg-[#6B8E23]/10 text-[#E8E3D9] text-xs uppercase tracking-[0.2em] transition-all duration-300 group"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#6B8E23] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Editorial Highlight Banner */}
        <div className="mt-24 glass-card rounded-3xl p-8 sm:p-12 overflow-hidden relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#E8E3D9]/15">
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            <span className="text-xs uppercase tracking-[0.3em] text-[#6B8E23] font-medium mb-3">
              Botanical Heritage
            </span>
            <h3 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-light text-[#E8E3D9] leading-tight">
              Where Mediterranean Olives Meet French High Perfumery.
            </h3>
            <p className="mt-4 text-sm sm:text-base text-[#A39E93] font-light leading-relaxed">
              Every formula begins with cold-pressed olive squalane gathered from organic groves in Provence, harmonized with rare floral absolutes distilled in historic Grasse copper stills.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-6 w-full pt-6 border-t border-[#E8E3D9]/10">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#E8E3D9] font-medium">Pure Origin</h4>
                <p className="text-xs text-[#A39E93] mt-1">Single-estate olive groves</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#E8E3D9] font-medium">Formulated Without</h4>
                <p className="text-xs text-[#A39E93] mt-1">Parabens & Sulfates</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#E8E3D9] font-medium">Hand Bottled</h4>
                <p className="text-xs text-[#A39E93] mt-1">Signed batch numbers</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-72 lg:h-96 rounded-2xl overflow-hidden">
            <img
              src={atelierImg}
              alt="Atelier Lab"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0B] via-transparent to-transparent opacity-60" />
          </div>
        </div>
      </div>
    </section>
  );
};
