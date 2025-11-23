import React from 'react';
import { personalInfo } from '../data/Portfolio';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center py-8 border-t border-gray-800">
      <p className="text-gray-400">© {currentYear} {personalInfo.name}. All rights reserved.</p>
      <div className="flex justify-center gap-6 mt-4">
        <a 
          href={personalInfo.social.github} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
        >
          GitHub
        </a>
        <a 
          href={personalInfo.social.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
        >
          LinkedIn
        </a>
        <a 
          href={personalInfo.social.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Twitter
        </a>
      </div>
    </footer>
  );
};

export default Footer;