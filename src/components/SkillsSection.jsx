import React, { useState, useEffect } from 'react';
import { skills } from '../data/Portfolio';

const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animate-slideIn" style={{animationDelay: '0.2s'}}>
      <div className="border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl backdrop-blur-sm hover:border-gray-500 transition-all duration-300">
        <h2 className="text-3xl font-bold mb-6 text-gray-100">Technical Skills</h2>
        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300 font-medium">{skill.name}</span>
                <span className="text-gray-400">{skill.level}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white via-gray-300 to-gray-400 rounded-full transition-all duration-1000 ease-out hover:h-3 hover:shadow-lg hover:shadow-white/20"
                  style={{
                    width: isVisible ? `${skill.level}%` : '0%',
                    transitionDelay: `${index * 0.1}s`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;