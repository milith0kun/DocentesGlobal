import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import OnboardingWizard from './components/OnboardingWizard';
import './App.css';

function App() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <>
      {/* Header & Navegación */}
      <Navbar />
      
      {/* Sección Hero Principal */}
      <header style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Hero onStartWizard={() => setIsWizardOpen(true)} />
      </header>
      
      {/* Footer Minimalista */}
      <Footer />

      {/* Onboarding Wizard interactivo superpuesto a pantalla completa */}
      <OnboardingWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </>
  );
}

export default App;
