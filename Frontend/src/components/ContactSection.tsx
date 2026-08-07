import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle, Sparkles, Building2 } from 'lucide-react';

import { submitContactMessage } from '../api/contactApi';

interface ContactSectionProps {
  onShowToast: (title: string, description: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'Wholesale & Retail',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await submitContactMessage(formData);
      setSubmitted(true);
      onShowToast(
        'Wholesale Inquiry Sent to Elpida',
        'Our Cairo distribution manager will reach out within 24 hours.'
      );
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to send inquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#2D1424] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Wholesale Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#C9A227] font-bold">
                Let's Work Together
              </span>
              <h2 className="font-serif-editorial text-4xl sm:text-6xl font-light text-[#E8D6D2] mt-2">
                Wholesale Partnerships
              </h2>
              <p className="mt-4 text-sm text-[#E8D6D2]/80 font-light leading-relaxed">
                Reach out to discuss wholesale partnership opportunities, product line availability, and bulk pricing structures with Elpida.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#E8D6D2]/15">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#3A1A2E] border border-[#C9A227]/20">
                <div className="p-3 rounded-xl bg-[#C9A227]/20 text-[#C9A227]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#B98089]">Headquarters Location</span>
                  <p className="text-sm font-medium text-[#E8D6D2]">Cairo, Egypt</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#3A1A2E] border border-[#C9A227]/20">
                <div className="p-3 rounded-xl bg-[#C9A227]/20 text-[#C9A227]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#B98089]">Direct Phone / WhatsApp</span>
                  <p className="text-sm font-medium text-[#E8D6D2]">+20 128 524 1627</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#3A1A2E] border border-[#C9A227]/20">
                <div className="p-3 rounded-xl bg-[#C9A227]/20 text-[#C9A227]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#B98089]">Official Email Inquiry</span>
                  <p className="text-sm font-medium text-[#E8D6D2]">mikegidis@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-12 rounded-3xl border border-[#C9A227]/25 shadow-2xl relative">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="font-serif-editorial text-3xl text-[#E8D6D2]">
                  Send a Wholesale Inquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#E8D6D2] font-medium block mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ahmed Hassan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#3A1A2E] border border-[#E8D6D2]/20 rounded-xl text-sm text-[#E8D6D2] placeholder-[#E8D6D2]/40 focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#E8D6D2] font-medium block mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contact@pharmacy.eg"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#3A1A2E] border border-[#E8D6D2]/20 rounded-xl text-sm text-[#E8D6D2] placeholder-[#E8D6D2]/40 focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#E8D6D2] font-medium block mb-2">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+20 1xx xxx xxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#3A1A2E] border border-[#E8D6D2]/20 rounded-xl text-sm text-[#E8D6D2] placeholder-[#E8D6D2]/40 focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#E8D6D2] font-medium block mb-2">
                      Business Category
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full px-4 py-3 bg-[#3A1A2E] border border-[#E8D6D2]/20 rounded-xl text-sm text-[#E8D6D2] focus:outline-none focus:border-[#C9A227]"
                    >
                      <option value="Wholesale & Retail">Wholesaler / Trader</option>
                      <option value="Pharmacy Network">Pharmacy Network</option>
                      <option value="Supermarket Chain">Supermarket / Hypermarket</option>
                      <option value="Beauty Shop">Cosmetics & Beauty Shop</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#E8D6D2] font-medium block mb-2">
                    Inquiry Details / Desired Brands *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Specify target products (e.g., Amka Products, Clere, Sofn'free, Fragrance lines) and order volumes..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#3A1A2E] border border-[#E8D6D2]/20 rounded-xl text-sm text-[#E8D6D2] placeholder-[#E8D6D2]/40 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/50 text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#C9A227] hover:bg-[#E5B82E] text-[#3A1A2E] font-bold rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Wholesale Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-serif-editorial text-3xl text-[#E8D6D2]">Inquiry Transmitted</h3>
                <p className="text-xs text-[#E8D6D2]/80 max-w-sm mx-auto">
                  Thank you, <strong className="text-[#E8D6D2]">{formData.name}</strong>. Elpida's Cairo team has received your wholesale request for <strong className="text-[#C9A227]">{formData.businessType}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', businessType: 'Wholesale & Retail', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#3A1A2E] border border-[#C9A227]/40 text-xs text-[#E8D6D2] uppercase tracking-wider hover:border-[#C9A227]"
                >
                  Send Another Inquiry
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

