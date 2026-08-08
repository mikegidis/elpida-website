import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Heart, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenQuiz: () => void;
  settings?: any; // or import { Settings } from '../api/settings';
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenQuiz,
  settings,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 EGP{
          scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#E8E3D9] hover:text-[#6B8E23] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-xs uppercase tracking-[0.2em] transition-all relative py-1 EGP{
                  activeSection === link.id
                    ? 'text-[#E8D6D2] font-medium'
                    : 'text-[#B98089] hover:text-[#E8D6D2]'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A227]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Brand Logo */}
          <div className="text-center cursor-pointer" onClick={() => handleLinkClick('home')}>
            <h1 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl tracking-[0.25em] font-light text-[#E8D6D2]">
              {settings?.site_name ? settings.site_name.toUpperCase() : 'ELPIDA'}
            </h1>
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#C9A227] -mt-1 font-medium hidden sm:block">
              Personal Care & Fragrance Wholesaler
            </p>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Interactive Scent Quiz Trigger */}
            <button
              onClick={onOpenQuiz}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 text-xs text-[#E8D6D2] hover:border-[#C9A227] hover:bg-[#C9A227]/20 transition-all duration-300"
            >
              <span className="tracking-wider">Fragrance Diagnostic</span>
            </button>

            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#E8D6D2]/70 hover:text-[#E8D6D2] transition-colors rounded-full hover:bg-white/5"
              title="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="p-2 text-[#E8D6D2]/70 hover:text-[#E8D6D2] transition-colors relative rounded-full hover:bg-white/5"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C9A227] text-[#3A1A2E] text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag */}
            <button
              onClick={onOpenCart}
              className="p-2.5 bg-[#C9A227] text-[#3A1A2E] hover:bg-[#E5B82E] transition-all duration-300 rounded-full flex items-center justify-center relative group"
              title="Wholesale Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#3A1A2E] text-[#C9A227] text-[11px] font-bold flex items-center justify-center shadow-lg border border-[#C9A227]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[65px] left-0 right-0 z-30 bg-[#0E0F10]/95 backdrop-blur-2xl border-b border-[#E8E3D9]/10 md:hidden overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left text-lg font-serif-editorial tracking-widest EGP{
                    activeSection === link.id ? 'text-[#6B8E23] pl-2 font-medium' : 'text-[#E8E3D9]'
                  } transition-all`}
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuiz();
                  }}
                  className="w-full py-3 rounded-xl bg-[#6B8E23]/20 border border-[#6B8E23] text-[#E8E3D9] flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-medium"
                >
                  <Sparkles className="w-4 h-4 text-[#6B8E23]" />
                  Take Scent Diagnostic
                </button>

                <div className="text-xs text-[#A39E93] text-center pt-2">
                  Complimentary worldwide shipping on orders over EGP150
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
