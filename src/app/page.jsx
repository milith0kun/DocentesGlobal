'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AcademicContacts from '@/components/AcademicContacts';
import Footer from '@/components/Footer';
import OnboardingWizard from '@/components/OnboardingWizard';
import styles from './page.module.css';

export default function Home() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    if (isWizardOpen) {
      window.scrollTo(0, 0);
    }
  }, [isWizardOpen]);

  return (
    <div className={styles.homeShell}>
      <div className={isWizardOpen ? styles.homeContentHidden : styles.homeContent}>
        <Navbar />
        <AcademicContacts className={styles.contactsSection} />

        <main className={styles.homeMain}>
          <header className={styles.heroHost}>
            <Hero onStartWizard={() => setIsWizardOpen(true)} />
          </header>
        </main>

        <div className={styles.homeFooterWrap}>
          <Footer />
        </div>
      </div>

      <OnboardingWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </div>
  );
}
