'use client';

import { useState } from 'react';
import { StorefrontProvider } from './storefront-context';
import StorefrontHeader from './storefront-header';
import HeroSection from './hero-section';
import CategoryStrip from './category-strip';
import ProductCollection from './product-collection';
import EditorialSection from './editorial-section';
import AboutSection from './about-section';
import MembershipSection from './membership-section';
import ValuesSection from './values-section';
import NewsletterSection from './newsletter-section';
import StorefrontFooter from './storefront-footer';
import QuickViewModal from './quick-view-modal';
import CartDrawer from './cart-drawer';
import SearchModal from './search-modal';

export default function StorefrontView() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleSelectCategory = (filterKey: string) => {
    setSelectedFilter(filterKey);
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0d0e] text-neutral-900 dark:text-neutral-100 transition-colors duration-200 selection:bg-neutral-950 selection:text-white">
      {/* Sticky Header */}
      <StorefrontHeader />

      {/* Main Content Sections */}
      <main>
        <HeroSection />
        <CategoryStrip onSelectCategory={handleSelectCategory} />
        <ProductCollection initialFilter={selectedFilter} key={selectedFilter} />
        <EditorialSection />
        <AboutSection />
        <MembershipSection />
        <ValuesSection />
        <NewsletterSection />
      </main>

      {/* Footer */}
      <StorefrontFooter />

      {/* Global Storefront Modals & Drawers */}
      <QuickViewModal />
      <CartDrawer />
      <SearchModal />
    </div>
  );
}
