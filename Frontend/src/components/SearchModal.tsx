import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  const trendingTags = ['Clere Body Lotion', "Sofn'free Oil", 'Oriental Fragrance', 'Kenta Cream', 'Swiss Arabian'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#2D1424]/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl bg-[#3A1A2E] border border-[#C9A227]/30 rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Top Search Bar Input */}
          <div className="relative flex items-center mb-6">
            <Search className="w-5 h-5 absolute left-4 text-[#C9A227]" />
            <input
              type="text"
              autoFocus
              placeholder="Search skincare, haircare, fragrances, or brands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-[#2D1424] border border-[#E8D6D2]/20 rounded-2xl text-base text-[#E8D6D2] placeholder-[#E8D6D2]/50 focus:outline-none focus:border-[#C9A227]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 text-[#E8D6D2]/70 hover:text-[#E8D6D2] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Trending Tags */}
          {query.trim() === '' && (
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#E8D6D2]/70 uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Popular Trade Searches</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-4 py-2 bg-[#2D1424] hover:bg-[#C9A227]/20 border border-[#E8D6D2]/15 hover:border-[#C9A227] rounded-full text-xs text-[#E8D6D2] transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results List */}
          {query.trim() !== '' && (
            <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
              {results.length > 0 ? (
                results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-[#2D1424] border border-[#E8D6D2]/15 hover:border-[#C9A227] flex items-center gap-4 cursor-pointer transition-all group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-16 object-cover rounded-xl shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-bold">
                        {product.subtitle}
                      </span>
                      <h4 className="font-serif-editorial text-lg text-[#E8D6D2] group-hover:text-[#C9A227] transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#E8D6D2]/70 truncate">{product.description}</p>
                    </div>
                    <div className="text-right pr-2">
                      <span className="font-serif-editorial text-base text-[#E8D6D2] block">
                        EGP{product.price}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#E8D6D2]/60 group-hover:text-[#C9A227] group-hover:translate-x-1 transition-all ml-auto mt-1" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-xs text-[#E8D6D2]/70">
                  No products found matching "{query}". Try searching for Clere, Fragrance, or Haircare.
                </div>
              )}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-[#E8D6D2]/15 flex justify-between items-center text-xs text-[#E8D6D2]/70">
            <span>Press ESC to exit</span>
            <button
              onClick={onClose}
              className="text-[#E8D6D2] hover:text-[#C9A227] transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

