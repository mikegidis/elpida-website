import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickAdd: (product: Product) => void;
  onSelect: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickAdd,
  onSelect,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeShadeIndex, setActiveShadeIndex] = useState(0);

  const displayImage = product.secondaryImage && isHovered ? product.secondaryImage : product.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#6B8E23]/10"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] bg-[#121415] overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestseller && (
            <span className="px-2.5 py-1 rounded-full bg-[#6B8E23] text-black text-[10px] uppercase font-bold tracking-widest">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-1 rounded-full bg-[#E8E3D9] text-black text-[10px] uppercase font-bold tracking-widest">
              New Atelier
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 EGP{
            isWishlisted
              ? 'bg-[#6B8E23] text-white shadow-lg'
              : 'bg-[#0A0B0B]/60 text-[#E8E3D9] hover:bg-[#6B8E23] hover:text-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 EGP{isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Action Overlay (Quick View & Quick Add) */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#0A0B0B]/90 via-[#0A0B0B]/40 to-transparent flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex-1 py-2.5 bg-[#0A0B0B]/80 hover:bg-[#1A1C1D] text-[#E8E3D9] border border-[#E8E3D9]/20 rounded-xl text-xs uppercase tracking-wider font-medium backdrop-blur-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="flex-1 py-2.5 bg-[#6B8E23] hover:bg-[#556B2F] text-white rounded-xl text-xs uppercase tracking-wider font-medium shadow-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#111213]/80">
        <div>
          <div className="flex items-center justify-between text-xs text-[#A39E93] mb-1">
            <span className="uppercase tracking-widest">{product.subtitle}</span>
            <div className="flex items-center gap-1 text-[#E8E3D9]">
              <Star className="w-3 h-3 fill-[#6B8E23] text-[#6B8E23]" />
              <span className="font-medium text-xs">{product.rating}</span>
            </div>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="font-serif-editorial text-xl font-light text-[#E8E3D9] group-hover:text-[#6B8E23] transition-colors cursor-pointer leading-tight"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#A39E93]/80 mt-1 line-clamp-2 font-light">
            {product.description}
          </p>
        </div>

        {/* Shade Selectors preview (if cosmetics) */}
        {product.shades && product.shades.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5">
            <span className="text-[10px] uppercase text-[#A39E93] mr-1">Shades:</span>
            {product.shades.map((shade, idx) => (
              <button
                key={shade.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveShadeIndex(idx);
                }}
                title={shade.name}
                className={`w-4 h-4 rounded-full border transition-transform EGP{
                  activeShadeIndex === idx ? 'scale-125 border-[#E8E3D9]' : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: shade.colorHex }}
              />
            ))}
          </div>
        )}

        {/* Bottom Price & Sizes Bar */}
        <div className="mt-4 pt-3 border-t border-[#E8E3D9]/10 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-serif-editorial font-normal text-[#E8E3D9]">
              EGP{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through text-[#A39E93]">
                EGP{product.originalPrice}
              </span>
            )}
          </div>

          <span className="text-[11px] text-[#A39E93] uppercase tracking-wider">
            {product.sizes[0]?.label.split('/')[0]}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
