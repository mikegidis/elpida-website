import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { submitOrder } from '../api/orders';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  // Customer Form States
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  
  // Submit Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.product.price + item.selectedSize.priceModifier;
    return sum + itemPrice * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
  const grandTotal = subtotal - discountAmount + shippingFee;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ELPIDA15' || promoCode.trim().toUpperCase() === 'ELPIDA2026') {
      setDiscountPercent(15);
      setPromoSuccess('15% Wholesale Discount Applied!');
    } else {
      setPromoSuccess('Invalid Code (Try: ELPIDA2026)');
    }
  };

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      setSubmitError('Customer Name is required.');
      return;
    }
    if (!phone.trim()) {
      setSubmitError('Phone number is required.');
      return;
    }
    if (items.length === 0) {
      setSubmitError('Your cart is empty.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');

      // Map dynamic items and resolve PostgreSQL variant IDs
      const orderItems = items.map((item) => {
        const variantId = item.selectedSize.variantId || parseInt(item.product.id, 10);
        return {
          variant_id: variantId,
          quantity: item.quantity,
        };
      });

      const response = await submitOrder({
        customer_name: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        notes: notes.trim() || undefined,
        items: orderItems,
      });

      if (response.success) {
        setCreatedOrderId(response.data.order_id);
        setIsCheckoutSuccess(true);
        // Clear form values
        setCustomerName('');
        setPhone('');
        setEmail('');
        setNotes('');
      } else {
        setSubmitError(response.message || 'Unable to submit order.');
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Network error or server unavailable.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishCheckout = () => {
    setIsCheckoutSuccess(false);
    setCreatedOrderId(null);
    onClearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-[#2D1424]/80 backdrop-blur-md">
        {/* Backdrop click */}
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
              <ShoppingBag className="w-5 h-5 text-[#C9A227]" />
              <h3 className="font-serif-editorial text-2xl text-[#E8D6D2]">Order Bag</h3>
              <span className="text-xs text-[#E8D6D2]/70">({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#E8D6D2]/70 hover:text-[#E8D6D2] transition-colors rounded-full hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3 bg-[#2D1424] border-b border-[#E8D6D2]/15">
            <div className="flex justify-between text-xs text-[#E8D6D2]/80 mb-1.5 font-light">
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#E8D6D2]">EGP{remainingForFreeShipping.toFixed(0)}</strong> more for <strong className="text-[#C9A227]">Free Delivery across Cairo</strong>
                </span>
              ) : (
                <span className="text-[#C9A227] font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Unlocked Free Delivery across Cairo!
                </span>
              )}
            </div>
            <div className="w-full bg-[#3A1A2E] h-1.5 rounded-full overflow-hidden border border-[#C9A227]/20">
              <div
                className="bg-[#C9A227] h-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List & Customer Information */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-[#E8D6D2]/40 mb-3" />
                <h4 className="font-serif-editorial text-2xl text-[#E8D6D2]">Your Wholesale Bag is Empty</h4>
                <p className="text-xs text-[#E8D6D2]/70 mt-2 max-w-xs font-light">
                  Explore our personal care, haircare, and fine fragrance portfolio for your retail store.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#C9A227] text-[#3A1A2E] text-xs uppercase tracking-wider font-bold hover:bg-[#E5B82E] transition-colors"
                >
                  Explore Shop
                </button>
              </div>
            ) : (
              <>
                {/* List items */}
                {items.map((item) => {
                  const itemPrice = item.product.price + item.selectedSize.priceModifier;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-4 rounded-2xl bg-[#2D1424] border border-[#C9A227]/20 flex gap-4 items-center"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover rounded-xl bg-black shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif-editorial text-lg text-[#E8D6D2] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-[#E8D6D2]/70">
                          {item.selectedSize.label}
                          {item.selectedShade && ` • ${item.selectedShade.name}`}
                        </p>
                        <div className="text-xs font-serif-editorial text-[#E8D6D2] mt-1">
                          EGP{itemPrice} x {item.quantity} = EGP{itemPrice * item.quantity}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center bg-[#3A1A2E] border border-[#E8D6D2]/20 rounded-lg px-2 py-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="text-[#E8D6D2]/70 hover:text-[#E8D6D2] px-1 text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs text-[#E8D6D2] px-2 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="text-[#E8D6D2]/70 hover:text-[#E8D6D2] px-1 text-xs"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-[#E8D6D2]/60 hover:text-red-400 transition-colors ml-auto"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Customer Details Form */}
                <div className="mt-8 pt-6 border-t border-[#E8D6D2]/15 space-y-4">
                  <h4 className="font-serif-editorial text-lg text-[#E8D6D2]">Delivery & Contact Details</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#E8D6D2]/70 mb-1">
                        Customer Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. John Smith"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-2 bg-[#2D1424] border border-[#E8D6D2]/20 rounded-xl text-xs text-[#E8D6D2] placeholder-[#E8D6D2]/40 focus:outline-none focus:border-[#C9A227]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#E8D6D2]/70 mb-1">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 01234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 bg-[#2D1424] border border-[#E8D6D2]/20 rounded-xl text-xs text-[#E8D6D2] placeholder-[#E8D6D2]/40 focus:outline-none focus:border-[#C9A227]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#E8D6D2]/70 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. john@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-[#2D1424] border border-[#E8D6D2]/20 rounded-xl text-xs text-[#E8D6D2] placeholder-[#E8D6D2]/40 focus:outline-none focus:border-[#C9A227]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#E8D6D2]/70 mb-1">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        placeholder="e.g. Please call before delivery."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 bg-[#2D1424] border border-[#E8D6D2]/20 rounded-xl text-xs text-[#E8D6D2] placeholder-[#E8D6D2]/40 focus:outline-none focus:border-[#C9A227] resize-none"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E8D6D2]/15 bg-[#2D1424]/90 space-y-4">
              {/* Promo code */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#E8D6D2]/60" />
                  <input
                    type="text"
                    placeholder="Promo Code (ELPIDA2026)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#3A1A2E] border border-[#E8D6D2]/20 rounded-xl text-xs text-[#E8D6D2] placeholder-[#E8D6D2]/50 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-[#3A1A2E] border border-[#C9A227]/40 hover:bg-[#C9A227] text-[#E8D6D2] hover:text-[#3A1A2E] rounded-xl text-xs font-bold transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && (
                <p className={`text-[11px] ${discountPercent > 0 ? 'text-[#C9A227]' : 'text-amber-300'}`}>
                  {promoSuccess}
                </p>
              )}

              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs text-[#E8D6D2]/80 pt-2 border-t border-[#E8D6D2]/15">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#E8D6D2]">EGP{subtotal.toFixed(2)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-[#C9A227]">
                    <span>Trade Discount (15%)</span>
                    <span>-EGP{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Cairo Courier Fee</span>
                  <span className="text-[#E8D6D2]">
                    {shippingFee === 0 ? 'Complimentary' : `EGP${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif-editorial text-[#E8D6D2] pt-2 border-t border-[#E8D6D2]/15">
                  <span>Total Investment</span>
                  <span className="text-[#C9A227] font-bold">EGP{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Feedback messages */}
              {submitError && (
                <p className="text-xs text-red-400 font-medium text-center bg-red-950/20 p-2.5 rounded-xl border border-red-500/20">
                  {submitError}
                </p>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className={`w-full bg-[#C9A227] hover:bg-[#E5B82E] text-[#3A1A2E] py-4 rounded-2xl text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-xl flex items-center justify-center gap-2 group ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#3A1A2E] border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Order...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Wholesale Order</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Simulated Checkout Success Modal */}
      {isCheckoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-[#3A1A2E] border border-[#C9A227]/40 rounded-3xl p-8 text-center shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="font-serif-editorial text-3xl text-[#E8D6D2]">
              Order Transmitted to Elpida
            </h3>
            <p className="text-xs text-[#E8D6D2]/80 mt-2 font-light leading-relaxed">
              Your wholesale order is logged with Elpida Cairo. Wholesale reference <strong className="text-[#E8D6D2]">#ELP-{createdOrderId}</strong> has been generated. Our dispatch manager will contact you for delivery logistics.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-[#2D1424] text-left text-xs text-[#E8D6D2]/80 space-y-1 border border-[#C9A227]/20">
              <div className="flex justify-between text-[#E8D6D2] font-medium">
                <span>Total Wholesale Order:</span>
                <span className="text-[#C9A227] font-bold">EGP{grandTotal.toFixed(2)}</span>
              </div>
              <div>Dispatch Hub: Cairo, Egypt Distribution Facility</div>
              <div>Fulfilled by: Elpida Dedicated Trade Logistics</div>
            </div>

            <button
              onClick={handleFinishCheckout}
              className="mt-6 w-full py-3.5 bg-[#C9A227] text-[#3A1A2E] rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-[#E5B82E] transition-colors"
            >
              Return to Catalog
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
