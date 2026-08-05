import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  wishlistIds: string[];
  onRemoveFromWishlist: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products,
  wishlistIds,
  onRemoveFromWishlist,
  onQuickAdd,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-[#2D1424]/80 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-[#3A1A2E] border-l border-[#C9A227]/30 h-full flex flex-col justify-between z-10 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E8D6D2]/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#C9A227] fill-[#C9A227]" />
              <h3 className="font-serif-editorial text-2xl text-[#E8D6D2]">Saved Favorites</h3>
              <span className="text-xs text-[#E8D6D2]/70">({savedProducts.length})</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#E8D6D2]/70 hover:text-[#E8D6D2] transition-colors rounded-full hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Saved Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <Heart className="w-12 h-12 text-[#E8D6D2]/30 mb-3" />
                <h4 className="font-serif-editorial text-2xl text-[#E8D6D2]">Your Wishlist is Empty</h4>
                <p className="text-xs text-[#E8D6D2]/70 mt-2 max-w-xs font-light">
                  Save your favorite products and fine fragrances for future wholesale orders.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#C9A227] text-[#3A1A2E] text-xs uppercase tracking-wider font-bold hover:bg-[#E5B82E] transition-colors"
                >
                  Explore Shop
                </button>
              </div>
            ) : (
              savedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-2xl bg-[#2D1424] border border-[#C9A227]/20 flex gap-4 items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-20 object-cover rounded-xl bg-black shrink-0 cursor-pointer"
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="font-serif-editorial text-lg text-[#E8D6D2] hover:text-[#C9A227] cursor-pointer truncate"
                    >
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-[#E8D6D2]/70 uppercase tracking-wider">
                      {product.subtitle}
                    </p>
                    <div className="text-xs font-serif-editorial text-[#E8D6D2] mt-1">
                      EGP{product.price}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => {
                          onQuickAdd(product);
                        }}
                        className="px-3 py-1.5 bg-[#C9A227] hover:bg-[#E5B82E] text-[#3A1A2E] rounded-xl text-xs flex items-center gap-1 font-bold transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Order</span>
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="p-1.5 text-[#E8D6D2]/60 hover:text-red-400 transition-colors ml-auto"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-[#E8D6D2]/15 bg-[#2D1424]/90">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-[#C9A227] text-[#3A1A2E] text-xs uppercase tracking-widest font-bold hover:bg-[#E5B82E] transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

