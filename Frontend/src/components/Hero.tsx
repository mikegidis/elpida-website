import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowDownRight, Building2, Award } from 'lucide-react';
import heroImg from '../assets/images/special_glow_hero_1785434567085.jpg';

interface HeroProps {
  onExploreClick: () => void;
  onQuizClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onQuizClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#3A1A2E]">
      {/* Background Image with Parallax Fade Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-35">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          src={heroImg}
          alt="Elpida Wholesale Fragrance & Personal Care"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
          referrerPolicy="no-referrer"
        />
        {/* Soft aubergine moody gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3A1A2E] via-[#3A1A2E]/70 to-[#2D1424]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3A1A2E]/90 via-transparent to-[#3A1A2E]/90" />
      </div>

      {/* Decorative ambient gold and aubergine glow motifs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A227]/15 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#B98089]/20 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center pt-8">

        {/* Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A227]/30 bg-[#2D1424]/80 backdrop-blur-md mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#E8D6D2]">
            Personal Care & Fragrance Wholesaler • Cairo, Egypt
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif-editorial text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-[#E8D6D2] leading-[0.95] max-w-4xl"
        >
          Elpida Wholesale <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#C9A227]">Every Drop</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-[#E8D6D2]/80 max-w-2xl font-light leading-relaxed px-4"
        >
          Elpida is Cairo’s trusted distributor and wholesale partner. Bringing together quality skincare, haircare, and fine fragrance lines for pharmacies, supermarkets, and beauty retailers across Egypt.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4"
        >
          {/* Main CTA */}
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto group relative px-8 py-4 bg-[#C9A227] text-[#3A1A2E] hover:bg-[#E5B82E] transition-all duration-500 rounded-full font-bold text-xs uppercase tracking-[0.25em] overflow-hidden flex items-center justify-center gap-3 shadow-xl hover:shadow-[#C9A227]/30"
          >
            <span>Explore Shop</span>
            <ArrowDownRight className="w-4 h-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
          </button>

          {/* Diagnostic Quiz CTA */}
          <button
            onClick={onQuizClick}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#E8D6D2]/30 text-[#E8D6D2] hover:border-[#C9A227] hover:text-[#C9A227] transition-all duration-300 rounded-full font-medium text-xs uppercase tracking-[0.2em] backdrop-blur-sm flex items-center justify-center gap-2"
          >
            <span>Fragrance & Care Diagnostic</span>
          </button>
        </motion.div>

        {/* Bottom Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-20 pt-10 border-t border-[#E8D6D2]/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-left w-full max-w-4xl"
        >
          <div className="flex flex-col">
            <span className="font-serif-editorial text-1.5xl text-[#C9A227]">Egypt</span>
            <span className="text-[11px] uppercase tracking-wider text-[#B98089] mt-1">Wholesale & Trade Hub</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif-editorial text-1.5xl text-[#E8D6D2]">Amka Products Ltd.</span>
            <span className="text-[11px] uppercase tracking-wider text-[#B98089] mt-1">Authorized Distributor</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif-editorial text-1.5xl text-[#E8D6D2]">3 Core Lines</span>
            <span className="text-[11px] uppercase tracking-wider text-[#B98089] mt-1">Skincare, Haircare, Perfume</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif-editorial text-1.5xl text-[#E8D6D2]">Bulk Pricing</span>
            <span className="text-[11px] uppercase tracking-wider text-[#B98089] mt-1">Retailer Margins Built-in</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


