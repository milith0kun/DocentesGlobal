'use client';

  import { useState, useEffect } from 'react';
  import Navbar from '@/components/Navbar';
  import Hero from '@/components/Hero';
  import Footer from '@/components/Footer';
  import OnboardingWizard from '@/components/OnboardingWizard';

  export default function Home() {
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    useEffect(() => {
      if (isWizardOpen) {
        window.scrollTo(0, 0);
      }
    }, [isWizardOpen]);

    return (
      <div className="home-shell">
        <div style={{ display: isWizardOpen ? 'none' : 'contents' }}>
          <Navbar />

          <main className="home-main">
            <header style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Hero onStartWizard={() => setIsWizardOpen(true)} />
            </header>
          </main>

          <div className="home-footer-wrap">
            <Footer />
          </div>
        </div>

        <OnboardingWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
      </div>
    );
  }
