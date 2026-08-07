import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { LoginModal } from './components/LoginModal';
import { ProfileView } from './components/ProfileView';
import { AssignmentPromptModal } from './components/AssignmentPromptModal';
import { MobileFrame } from './components/MobileFrame';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastsContainer } from './components/Toasts';
import { YodaWidget } from './components/YodaWidget';

function MainAppContent() {
  const { currentView, isMobileFrameMode } = useApp();

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col justify-between">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
          {currentView === 'home' && (
            <>
              <HomeHero />
              <ProductCatalog />
            </>
          )}

          {currentView === 'catalog' && <ProductCatalog />}

          {currentView === 'profile' && <ProfileView />}
        </main>

        {/* Show mobile tab bar inside mobile frame or on mobile screens */}
        <div className={isMobileFrameMode ? 'block' : 'block md:hidden'}>
          <MobileBottomNav />
        </div>
      </div>

      {/* Global Modals, Drawers & Yoda Peace Widget */}
      <YodaWidget />
      <ProductDetailModal />
      <CartDrawer />
      <LoginModal />
      <AssignmentPromptModal />
      <ToastsContainer />
    </MobileFrame>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
