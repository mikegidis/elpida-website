import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Star, Check, Sparkles, Shield, Droplet, Layers } from 'lucide-react';
import { Product, SizeOption, Shade } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: SizeOption, shade?: Shade, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedShade, setSelectedShade] = useState<Shade | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'ingredients' | 'howTo'>('details');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || null);
      setSelectedShade(product.shades ? product.shades[0] : undefined);
      setQuantity(1);
      setActiveTab(product.fragranceNotes ? 'notes' : 'details');
    }
  }, [product]);

  if (!product || !selectedSize) return null;

  const currentPrice = product.price + selectedSize.priceModifier;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2D1424]/90 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#3A1A2E] border border-[#C9A227]/30 rounded-3xl overflow-hidden shadow-2xl my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 bg-[#2D1424]/80 hover:bg-[#C9A227] text-[#E8D6D2] hover:text-[#3A1A2E] rounded-full transition-all backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Image Showcase */}
            <div className="relative aspect-[4/5] bg-[#2D1424] overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Wishlist Floating Button */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-4 left-4 p-3 rounded-full backdrop-blur-md transition-all EGP{
                  isWishlisted ? 'bg-[#C9A227] text-[#3A1A2E]' : 'bg-[#2D1424]/70 text-[#E8D6D2] hover:bg-[#C9A227] hover:text-[#3A1A2E]'
                }`}
              >
                <Heart className={`w-5 h-5 EGP{isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Right Product Details & Actions */}
            <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div>
                <div className="flex items-center justify-between text-xs text-[#E8D6D2]/70 mb-2">
                  <span className="uppercase tracking-[0.2em]">{product.subtitle}</span>
                  <div className="flex items-center gap-1.5 text-[#E8D6D2]">
                    <Star className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
                    <span className="font-medium text-xs">{product.rating}</span>
                    <span className="text-[#E8D6D2]/60">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#E8D6D2]">
                  {product.name}
                </h2>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-serif-editorial text-[#E8D6D2]">
                    EGP{currentPrice}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm line-through text-[#E8D6D2]/50">
                      EGP{product.originalPrice + selectedSize.priceModifier}
                    </span>
                  )}
                  <span className="text-[11px] text-[#C9A227] uppercase tracking-widest font-bold ml-auto">
                    In Stock • Cairo Hub
                  </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-[#E8D6D2]/80 font-light leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selector */}
                {product.sizes.length > 0 && (
                  <div className="mt-6">
                    <label className="text-xs uppercase tracking-wider text-[#E8D6D2] font-medium block mb-2">
                      Select Size:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz.label}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-4 py-2 rounded-xl text-xs transition-all EGP{
                            selectedSize.label === sz.label
                              ? 'bg-[#C9A227] text-[#3A1A2E] font-bold shadow-md'
                              : 'bg-[#2D1424] border border-[#E8D6D2]/20 text-[#E8D6D2]/80 hover:text-[#E8D6D2]'
                          }`}
                        >
                          {sz.label} {sz.priceModifier > 0 && `(+EGPEGP{sz.priceModifier})`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shade Selector (if cosmetics) */}
                {product.shades && product.shades.length > 0 && (
                  <div className="mt-6">
                    <label className="text-xs uppercase tracking-wider text-[#E8D6D2] font-medium block mb-2">
                      Select Shade: <span className="text-[#C9A227]">{selectedShade?.name}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {product.shades.map((shade) => (
                        <button
                          key={shade.id}
                          onClick={() => setSelectedShade(shade)}
                          title={shade.name}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all EGP{
                            selectedShade?.id === shade.id
                              ? 'border-[#C9A227] bg-[#C9A227]/20 text-[#E8D6D2]'
                              : 'border-[#E8D6D2]/20 bg-[#2D1424] text-[#E8D6D2]/70'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/30"
                            style={{ backgroundColor: shade.colorHex }}
                          />
                          <span className="text-xs">{shade.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tabs: Notes / Benefits / Ingredients */}
                <div className="mt-8 border-t border-[#E8D6D2]/15 pt-4">
                  <div className="flex gap-4 border-b border-[#E8D6D2]/15 pb-2 overflow-x-auto">
                    {product.fragranceNotes && (
                      <button
                        onClick={() => setActiveTab('notes')}
                        className={`text-xs uppercase tracking-wider pb-2 border-b-2 transition-all EGP{
                          activeTab === 'notes' ? 'border-[#C9A227] text-[#E8D6D2]' : 'border-transparent text-[#E8D6D2]/60'
                        }`}
                      >
                        Scent Notes
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`text-xs uppercase tracking-wider pb-2 border-b-2 transition-all EGP{
                        activeTab === 'details' ? 'border-[#C9A227] text-[#E8D6D2]' : 'border-transparent text-[#E8D6D2]/60'
                      }`}
                    >
                      Formula & Care
                    </button>
                    {product.ingredients && (
                      <button
                        onClick={() => setActiveTab('ingredients')}
                        className={`text-xs uppercase tracking-wider pb-2 border-b-2 transition-all EGP{
                          activeTab === 'ingredients' ? 'border-[#C9A227] text-[#E8D6D2]' : 'border-transparent text-[#E8D6D2]/60'
                        }`}
                      >
                        Full Ingredients
                      </button>
                    )}
                  </div>

                  <div className="py-4 text-xs text-[#E8D6D2]/80">
                    {activeTab === 'notes' && product.fragranceNotes && (
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 bg-[#2D1424] rounded-xl border border-[#C9A227]/20">
                          <span className="text-[10px] uppercase tracking-wider text-[#C9A227] block font-bold mb-1">Top Notes</span>
                          <p className="text-xs text-[#E8D6D2]">{product.fragranceNotes.top.join(', ')}</p>
                        </div>
                        <div className="p-3 bg-[#2D1424] rounded-xl border border-[#C9A227]/20">
                          <span className="text-[10px] uppercase tracking-wider text-[#C9A227] block font-bold mb-1">Heart Notes</span>
                          <p className="text-xs text-[#E8D6D2]">{product.fragranceNotes.heart.join(', ')}</p>
                        </div>
                        <div className="p-3 bg-[#2D1424] rounded-xl border border-[#C9A227]/20">
                          <span className="text-[10px] uppercase tracking-wider text-[#C9A227] block font-bold mb-1">Base Notes</span>
                          <p className="text-xs text-[#E8D6D2]">{product.fragranceNotes.base.join(', ')}</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'details' && (
                      <div className="space-y-2">
                        {product.skincareBenefits ? (
                          <ul className="space-y-1.5">
                            {product.skincareBenefits.map((b, i) => (
                              <li key={i} className="flex items-center gap-2 text-[#E8D6D2]">
                                <Check className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="leading-relaxed">
                            Formulated with dermatologically tested ingredients for maximum efficacy and shelf performance. Distributed by Elpida Cairo.
                          </p>
                        )}
                        {product.howToUse && (
                          <div className="mt-3 p-3 bg-[#2D1424] rounded-xl border border-[#C9A227]/20">
                            <span className="text-[10px] uppercase tracking-wider text-[#C9A227] font-bold block mb-1">Recommended Usage</span>
                            <p className="text-xs text-[#E8D6D2] font-light">{product.howToUse}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'ingredients' && (
                      <p className="leading-relaxed text-[#E8D6D2]/80">
                        {product.ingredients?.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Adjuster & Add to Cart */}
              <div className="mt-6 pt-4 border-t border-[#E8D6D2]/15">
                <div className="flex gap-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center bg-[#2D1424] border border-[#E8D6D2]/20 rounded-2xl px-3 py-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-[#E8D6D2]/70 hover:text-[#E8D6D2] px-2 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="text-xs text-[#E8D6D2] px-3 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-[#E8D6D2]/70 hover:text-[#E8D6D2] px-2 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => {
                      onAddToCart(product, selectedSize, selectedShade, quantity);
                      onClose();
                    }}
                    className="flex-1 bg-[#C9A227] hover:bg-[#E5B82E] text-[#3A1A2E] py-3.5 px-6 rounded-2xl text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Wholesale Order • EGP{currentPrice * quantity}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

