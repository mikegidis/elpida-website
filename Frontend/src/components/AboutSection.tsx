import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronDown, Award, MapPin, Phone, Building2, PackageCheck, ShieldCheck, HeartHandshake, Store } from 'lucide-react';
import { atelierImg } from '../data/products';

export const AboutSection: React.FC = () => {
  const [openPillarId, setOpenPillarId] = useState<string>('pillar-1');

  const WHATEVER_SERVES = [
    { name: 'Wholesalers & Distributors', desc: 'Upstream trading partners seeking consistent bulk inventory.' },
    { name: 'Pharmacies', desc: 'Retail health & beauty counters stocked with trusted skincare & haircare.' },
    { name: 'Supermarkets', desc: 'High-turnover personal care products with reliable margin structure.' },
    { name: 'Independent Beauty Shops', desc: 'Curated fragrances and specialty beauty items across Egypt.' },
  ];

  const PARTNERSHIP_PILLARS = [
    {
      id: 'pillar-1',
      title: 'Reliable Supply Chain',
      description: 'Consistent stock availability and dependable replenishment schedules to keep your store shelves continuously full without inventory gaps.'
    },
    {
      id: 'pillar-2',
      title: 'Curated Quality Portfolio',
      description: 'Carefully selected skincare, haircare, and fragrance lines from world-renowned and trusted brands, including official distribution of Amka Products Ltd. SA.'
    },
    {
      id: 'pillar-3',
      title: 'Fair Wholesale Pricing',
      description: 'Competitive tier pricing explicitly engineered to protect retailer profitability and maximize healthy profit margins on repeat orders.'
    },
    {
      id: 'pillar-4',
      title: 'Trusted Local Partnership',
      description: 'Honest communication, dedicated wholesale support, and deep market understanding based directly out of Cairo, Egypt.'
    }
  ];

  const BRANDS_WE_DISTRIBUTE = [
    { category: 'Official Distribution', brand: 'Amka Products Ltd. SA', items: 'Clere, Sofn\'free' },
    { category: 'Skincare & Personal Care', brand: 'Leading Global Brands', items: 'Dove, Vaseline, Cantu, Nature\'s Answer, Kenta, Parley, Eqqualberry' },
    { category: 'Fine Fragrances', brand: 'Oriental & Luxury Lines', items: 'Emper Perfumes, Swiss Arabian, Lattafa, Hami, Hersh W Alezz, Rasasi' },
  ];

  return (
    <section id="about" className="py-24 bg-[#3A1A2E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Editorial Split Screen - About Elpida */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">

          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9A227]/30 bg-[#2D1424]/80 text-xs text-[#E8D6D2]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="uppercase tracking-[0.25em]">About Elpida</span>
            </div>

            <h2 className="font-serif-editorial text-4xl sm:text-6xl font-light text-[#E8D6D2] leading-[1.05]">
              Your Trusted Personal Care & Fragrance Wholesale Partner.
            </h2>

            <p className="text-[#E8D6D2]/80 text-sm sm:text-base font-light leading-relaxed">
              Elpida is a Cairo based distributor and wholesale trading company specializing in personal care products and fragrances. Established to serve the growing needs of retailers and distributors across Egypt, we bring together quality skincare, haircare, and fragrance lines under one reliable wholesale partner.
            </p>

            <p className="text-[#E8D6D2]/80 text-sm sm:text-base font-light leading-relaxed">
              We simplify wholesale sourcing by providing traders and retailers with a dependable supply of high-demand products, backed by competitive pricing, consistent availability, and responsive customer service.
            </p>

            {/* Vision & Mission Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-5 rounded-2xl bg-[#2D1424] border border-[#C9A227]/20">
                <span className="text-xs uppercase tracking-widest text-[#C9A227] font-bold block mb-2">
                  Our Vision
                </span>
                <p className="text-xs text-[#E8D6D2]/90 leading-relaxed font-light">
                  To become Egypt's most trusted distributor in personal care and fragrance, known for consistency, breadth of range, and genuine partnership.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#2D1424] border border-[#B98089]/30">
                <span className="text-xs uppercase tracking-widest text-[#B98089] font-bold block mb-2">
                  Our Mission
                </span>
                <p className="text-xs text-[#E8D6D2]/90 leading-relaxed font-light">
                  To supply wholesalers with a reliable, well-priced range of skincare, haircare, and fragrance products backed by steady stock availability.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Image Grid Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#C9A227]/25 shadow-2xl">
              <img
                src={atelierImg}
                alt="Elpida Wholesale Operations Cairo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1424]/90 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-[#2D1424]/90 backdrop-blur-md border border-[#C9A227]/20">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-[#C9A227]" />
                  <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-bold">
                    Cairo, Egypt Hub
                  </span>
                </div>
                <p className="text-xs text-[#E8D6D2] font-light leading-relaxed">
                  Serving wholesalers, pharmacies, supermarkets, and cosmetics retailers across Egypt with dependable stock and competitive margin structures.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Why Wholesalers Partner with Elpida Accordion */}
        <div className="mt-20 pt-16 border-t border-[#E8D6D2]/15">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C9A227] font-bold">
              At a Glance
            </span>
            <h3 className="font-serif-editorial text-3xl sm:text-5xl font-light text-[#E8D6D2] mt-2">
              Why Wholesalers Partner With Elpida
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {PARTNERSHIP_PILLARS.map((pillar) => {
              const isOpen = openPillarId === pillar.id;
              return (
                <div
                  key={pillar.id}
                  className="glass-card rounded-2xl overflow-hidden border border-[#E8D6D2]/12 transition-colors"
                >
                  <button
                    onClick={() => setOpenPillarId(isOpen ? '' : pillar.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-serif-editorial text-xl sm:text-2xl text-[#E8D6D2]">
                      {pillar.title}
                    </span>
                    <div className={`p-2 rounded-full transition-transform duration-300 EGP{isOpen ? 'rotate-180 bg-[#C9A227] text-[#3A1A2E]' : 'bg-[#2D1424] text-[#E8D6D2]/70'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-xs sm:text-sm text-[#E8D6D2]/80 font-light leading-relaxed border-t border-white/5 pt-4">
                          {pillar.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Who We Serve & Brand Partners */}
        <div className="mt-24 pt-16 border-t border-[#E8D6D2]/15">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left: Who We Serve */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-[#C9A227] font-bold">
                  Our Trade Network
                </span>
                <h3 className="font-serif-editorial text-3xl sm:text-4xl font-light text-[#E8D6D2] mt-1">
                  Who We Serve Across Egypt
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WHATEVER_SERVES.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#2D1424] border border-[#C9A227]/20 flex flex-col justify-between">
                    <div>
                      <Store className="w-5 h-5 text-[#C9A227] mb-2" />
                      <h4 className="text-sm font-semibold text-[#E8D6D2] mb-1">{item.name}</h4>
                      <p className="text-xs text-[#E8D6D2]/70 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Brand Partners */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-[#B98089] font-bold">
                  Authorized Portfolio
                </span>
                <h3 className="font-serif-editorial text-3xl sm:text-4xl font-light text-[#E8D6D2] mt-1">
                  Official & Traded Brands
                </h3>
              </div>

              <div className="space-y-4">
                {BRANDS_WE_DISTRIBUTE.map((group, idx) => (
                  <div key={idx} className="glass-card p-5 rounded-2xl border border-[#C9A227]/20">
                    <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-bold block mb-1">
                      {group.category}
                    </span>
                    <h4 className="text-base font-serif-editorial text-[#E8D6D2] font-medium">
                      {group.brand}
                    </h4>
                    <p className="text-xs text-[#E8D6D2]/80 mt-1 font-light">
                      {group.items}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

