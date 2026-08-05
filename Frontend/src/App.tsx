import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedSection } from './components/FeaturedSection';
import { ShopSection } from './components/ShopSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { ScentQuizModal } from './components/ScentQuizModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminUser, getCurrentAdmin } from './api/adminAuth';

import { useProducts } from './hooks/useProducts';
import { Product, CartItem, SizeOption, Shade } from './types';

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [adminAuthLoading, setAdminAuthLoading] = useState(true);
  const { products, loading, error } = useProducts();
  const [activeSection, setActiveSection] = useState('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Toast Helper
  const addToast = (title: string, description?: string, type: 'cart' | 'wishlist' | 'success' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, description, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Scroll/Navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: SizeOption, shade?: Shade, quantity: number = 1) => {
    const cartItemId = `${product.id}-${size.label}-${shade ? shade.id : 'default'}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedSize: size,
          selectedShade: shade,
          quantity,
        },
      ];
    });

    addToast(
      'Added to Wholesale Order',
      `${product.name} (${size.label}) placed in your Order Bag.`,
      'cart'
    );
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, product.sizes[0], product.shades ? product.shades[0] : undefined, 1);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      addToast(
        'Removed from Saved',
        `${product.name} removed from saved list.`
      );
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      addToast(
        'Saved to Favorites',
        `${product.name} saved to your favorites.`
      );
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setPathname(path);
  };

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!pathname.startsWith('/admin')) {
      setAdminAuthLoading(false);
      return;
    }

    const token = localStorage.getItem('elpida_admin_token');

    if (!token) {
      setAdmin(null);
      setAdminAuthLoading(false);

      if (pathname !== '/admin/login') {
        navigateTo('/admin/login');
      }

      return;
    }

    let isActive = true;
    setAdminAuthLoading(true);

    getCurrentAdmin(token)
      .then(({ admin: currentAdmin }) => {
        if (!isActive) {
          return;
        }

        setAdmin(currentAdmin);
        setAdminAuthLoading(false);

        if (pathname === '/admin/login') {
          navigateTo('/admin');
        }
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        localStorage.removeItem('elpida_admin_token');
        setAdmin(null);
        setAdminAuthLoading(false);
        navigateTo('/admin/login');
      });

    return () => {
      isActive = false;
    };
  }, [pathname]);

  const handleAdminLogin = () => {
    navigateTo('/admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('elpida_admin_token');
    setAdmin(null);
    navigateTo('/admin/login');
  };

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }

    if (adminAuthLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#F7F3EE] text-[#2D1424]">
          <p className="text-sm font-medium">Checking admin session...</p>
        </div>
      );
    }

    if (!admin) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }

    return <AdminDashboard admin={admin} onLogout={handleAdminLogout} />;
  }

  return (
    <div className="min-h-screen bg-[#2D1424] text-[#E8D6D2] selection:bg-[#C9A227] selection:text-[#3A1A2E]">
      {/* Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* Main Sections */}
      <main>
        {/* 1. Home / Hero */}
        <div id="home">
          <Hero
            onExploreClick={() => handleNavigate('shop')}
            onQuizClick={() => setIsQuizOpen(true)}
          />

          {/* 2. Featured Bestsellers */}
          <FeaturedSection
            products={products}
            onQuickAdd={handleQuickAdd}
            onSelect={(p) => setSelectedProduct(p)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onViewAll={() => handleNavigate('shop')}
          />
        </div>

        {/* 3. Shop Section */}
        <ShopSection
          products={products}
          loading={loading}
          error={error}
          onQuickAdd={handleQuickAdd}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
        />

        {/* 4. About Us Section */}
        <AboutSection />

        {/* 5. Contact Form Section */}
        <ContactSection
          onShowToast={(title, desc) => addToast(title, desc, 'success')}
        />
      </main>

      {/* 6. Footer */}
      <Footer
        onShowToast={(title, desc) => addToast(title, desc, 'success')}
        onNavigate={handleNavigate}
      />

      {/* Interactive Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={products}
        wishlistIds={wishlistIds}
        onRemoveFromWishlist={handleToggleWishlist}
        onQuickAdd={(p) => {
          handleQuickAdd(p);
          setIsWishlistOpen(false);
          setIsCartOpen(true);
        }}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <ScentQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        products={products}
        onQuickAdd={handleQuickAdd}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
