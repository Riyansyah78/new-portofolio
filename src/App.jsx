import React, { useState } from 'react';
import BackgroundAnimation from './components/BackgroundAnimation';
import HeroSection from './components/HeroSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';
import WorkExperienceSection from './components/WorkExperienceSection';

function App() {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <BackgroundAnimation />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Split Screen */}
        <div className="grid md:grid-cols-2 gap-8 mb-20 min-h-[80vh] items-center">
          {/* Left Panel - Photo & Description */}
          <HeroSection onContactClick={() => setShowContact(true)} />

          {/* Right Panel - Skills */}
          <SkillsSection />
        </div>

         {/* Work Experience Section */}
        <WorkExperienceSection />


        {/* Projects Section */}
        <ProjectsSection />

        {/* Footer */}
        <Footer />
      </div>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={showContact} 
        onClose={() => setShowContact(false)} 
      />
    </div>
  );
}

export default App;