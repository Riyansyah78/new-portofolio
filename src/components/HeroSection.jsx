import React from 'react';
import { personalInfo } from '../data/Portfolio';

const HeroSection = ({ onContactClick }) => {
  return (
    <div className="animate-slideIn">
      <div className="border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl backdrop-blur-sm hover:border-gray-500 transition-all duration-300">
        <div className="flex gap-6 items-start">
          {/* Photo - Left Side */}
          <div className="flex-shrink-0">
            <div className="relative w-40 h-40 group mt-4">
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
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold animate-glow bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              {personalInfo.name}
            </h1>
            <p className="text-xl text-gray-300">{personalInfo.title}</p>
            <p className="text-gray-400 leading-relaxed text-sm">
              {personalInfo.bio}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
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
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
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