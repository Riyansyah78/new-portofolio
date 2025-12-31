import React from 'react';
import { personalInfo } from '../data/Portfolio';

const HeroSection = ({ onContactClick }) => {
  return (
    <div className="animate-slideIn">
      <div className="border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-4 md:p-8 rounded-2xl backdrop-blur-sm hover:border-gray-500 transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Photo - Left Side */}
          <div className="flex-shrink-0">
            <div className="relative w-28 h-28 md:w-40 md:h-40 group mt-0 md:mt-4">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-400 to-gray-600 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 border-gray-700 group-hover:border-gray-400 transition-all duration-300">
                <img 
                  src={personalInfo.profileImage} 
                  alt={personalInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Description - Right Side */}
          <div className="flex-1 space-y-3 md:space-y-4 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold animate-glow bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              {personalInfo.name}
            </h1>
            <p className="text-base md:text-xl text-gray-300">{personalInfo.title}</p>
            <p className="text-gray-400 leading-relaxed text-sm">
              {personalInfo.bio}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 pt-2 justify-center md:justify-start">
              <a 
                href={personalInfo.social.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 border border-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-800 hover:scale-110 transition-all duration-300"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>

              <a 
                href={personalInfo.social.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 border border-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-800 hover:scale-110 transition-all duration-300"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>

              <a 
                href={personalInfo.social.discord} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 border border-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-800 hover:scale-110 transition-all duration-300"
                aria-label="Discord"
              >
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2 justify-center md:justify-start">
              <button 
                onClick={onContactClick}
                className="px-5 py-2 bg-white text-black rounded-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 font-semibold text-sm"
              >
                Contact Me
              </button>
              <a
                href={personalInfo.resumeUrl}
                download
                className="px-5 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-gray-400 hover:scale-105 transition-all duration-300 text-sm inline-block"
              >
                View CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;