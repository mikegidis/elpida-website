import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Search, Sparkles, RefreshCw } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

interface ShopSectionProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  loading = false,
  error = null,
  onQuickAdd,
  onSelectProduct,
  onToggleWishlist,
  wishlistIds,
}) => {
  const { categories: apiCategories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [priceMax, setPriceMax] = useState<number>(300);

  const categories = useMemo(() => {
    const baseCategories: { id: number | 'all'; label: string }[] = [
      { id: 'all', label: 'All Products' }
    ];

    const mapped = apiCategories.map(cat => ({
      id: cat.id,
      label: cat.name
    }));

    return [...baseCategories, ...mapped];
  }, [apiCategories]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = activeCategory === 'all' || p.categoryId === activeCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = p.price <= priceMax;
        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, activeCategory, searchQuery, sortBy, priceMax]);

  return (
    <section id="shop" className="py-24 bg-[#0A0B0B] relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Shop Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-[#6B8E23] font-medium">
            The Complete Atelier Collection
          </span>
          <h2 className="font-serif-editorial text-4xl sm:text-6xl font-light text-[#E8E3D9] mt-2">
            Formulations & Fragrance
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A39E93] font-light leading-relaxed">
            Every creation is crafted with cold-pressed olive botanicals and rare floral absolutes, bottled in sustainable heavy glassware.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-[#121415] p-4 rounded-3xl border border-[#E8E3D9]/10 mb-10">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-300 EGP{
                  activeCategory === cat.id
                    ? 'bg-[#6B8E23] text-white font-medium shadow-md'
                    : 'text-[#A39E93] hover:text-[#E8E3D9] hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort options */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A39E93]" />
              <input
                type="text"
                placeholder="Search scents or skin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1A1C1E] border border-[#E8E3D9]/15 rounded-full text-xs text-[#E8E3D9] placeholder-[#A39E93]/60 focus:outline-none focus:border-[#6B8E23]"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-[#1A1C1E] border border-[#E8E3D9]/15 text-[#E8E3D9] text-xs px-4 py-2 pr-8 rounded-full focus:outline-none focus:border-[#6B8E23] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#A39E93] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Count & Active Filter Indicator */}
        <div className="flex items-center justify-between mb-8 px-2 text-xs text-[#A39E93]">
          <span>Showing {filteredProducts.length} Atelier items</span>
          {(searchQuery || activeCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="inline-flex items-center gap-1 text-[#6B8E23] hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-[#6B8E23] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-[#A39E93] font-light">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-[#121415] rounded-3xl border border-red-500/20 p-8">
            <h3 className="font-serif-editorial text-2xl text-[#E8E3D9]">Error Loading Products</h3>
            <p className="text-xs text-[#A39E93] mt-2">{error}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickAdd={onQuickAdd}
                  onSelect={onSelectProduct}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistIds.includes(product.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121415] rounded-3xl border border-[#E8E3D9]/10 p-8">
            <Sparkles className="w-8 h-8 text-[#6B8E23] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif-editorial text-2xl text-[#E8E3D9]">No Products Found</h3>
            <p className="text-xs text-[#A39E93] mt-2">
              Try adjusting your search criteria or resetting filters to explore our full selection.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#6B8E23] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#556B2F] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
