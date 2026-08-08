import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Check, Instagram, Facebook, Globe, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onShowToast: (title: string, description: string) => void;
  onNavigate: (section: string) => void;
  settings?: any; // or import { Settings } from '../api/settings';
}

export const Footer: React.FC<FooterProps> = ({ onShowToast, onNavigate, settings }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribed(true);
    onShowToast(
      'Wholesale Trade Catalog Unlocked!',
      'Promo code ELPIDA2026 activated for initial trade inquiries.'
    );
  };

  return (
    <footer className="bg-[#2D1424] text-[#E8D6D2]/80 border-t border-[#C9A227]/20 pt-20 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Newsletter Banner */}
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-[#C9A227]/25 mb-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#3A1A2E]/80">
          <div className="lg:col-span-6 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C9A227] font-bold">
              <span>Elpida Trade Circle</span>
            </div>
            <h3 className="font-serif-editorial text-3xl sm:text-4xl text-[#E8D6D2]">
              Access Wholesale Price Catalogs
            </h3>
            <p className="text-xs text-[#E8D6D2]/80 font-light">
              Subscribe to receive updated stock inventory sheets, official Amka product arrivals, and seasonal volume discount tiers across Cairo & Egypt.
            </p>
          </div>

          <div className="lg:col-span-6">
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter business email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3.5 bg-[#2D1424] border border-[#E8D6D2]/20 rounded-full text-xs text-[#E8D6D2] placeholder-[#E8D6D2]/50 focus:outline-none focus:border-[#C9A227]"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#C9A227] hover:bg-[#E5B82E] text-[#3A1A2E] rounded-full text-xs uppercase tracking-widest font-bold transition-colors shrink-0 flex items-center justify-center gap-2"
                >
                  <span>Join Network</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-[#C9A227]/20 border border-[#C9A227] text-[#E8D6D2] flex items-center gap-3">
                <Check className="w-5 h-5 text-[#C9A227] shrink-0" />
                <div className="text-xs">
                  <strong className="block text-white">Trade Account Registered</strong>
                  <span>Your catalog request has been logged. Our Cairo team will send the full price list.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-16 border-b border-[#E8D6D2]/15">

          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-serif-editorial text-2xl tracking-[0.2em] text-[#E8D6D2]">
              {settings?.site_name ? settings.site_name.toUpperCase() : 'ELPIDA'}
            </h2>
            <p className="text-xs text-[#E8D6D2]/70 max-w-sm font-light leading-relaxed whitespace-pre-wrap">
              {settings?.site_description || 'Personal Care & Fragrance Distributor and Wholesaler in Cairo, Egypt. Providing high-demand skincare, haircare, and fine fragrance products to traders, pharmacies, and supermarkets nationwide.'}
            </p>

            <div className="space-y-1.5 text-xs text-[#E8D6D2]/90 pt-2">
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#C9A227]" /> {settings?.address || 'Cairo, Egypt'}</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#C9A227]" /> {settings?.phone || '+20 128 524 1627'}</p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#C9A227]" /> {settings?.contact_email || 'mikegidis@gmail.com'}</p>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="text-[#E8D6D2]/70 hover:text-[#C9A227] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="text-[#E8D6D2]/70 hover:text-[#C9A227] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E8D6D2] font-medium">Product Lines</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('shop')} className="hover:text-[#C9A227] transition-colors">Skincare Lines</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-[#C9A227] transition-colors">Haircare Products</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-[#C9A227] transition-colors">Fine Fragrances</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-[#C9A227] transition-colors">Amka Products (Clere)</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E8D6D2] font-medium">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('about')} className="hover:text-[#C9A227] transition-colors">About Elpida</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-[#C9A227] transition-colors">Vision & Mission</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-[#C9A227] transition-colors">Who We Serve</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-[#C9A227] transition-colors">Distribution Brands</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E8D6D2] font-medium">Wholesale Desk</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('contact')} className="hover:text-[#C9A227] transition-colors">Contact Cairo Office</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-[#C9A227] transition-colors">Bulk Order Inquiry</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-[#C9A227] transition-colors">Retailer Registration</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-[#C9A227] transition-colors">Distribution Partnerships</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#E8D6D2]/60 gap-4">
          <p>© {new Date().getFullYear()} {settings?.site_name || 'Elpida Personal Care & Fragrance Distributor'}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-[#C9A227]" /> (EGP)</span>
            <a href="/privacy-policy" className="hover:text-[#E8D6D2] transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#E8D6D2] transition-colors">Trade Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

