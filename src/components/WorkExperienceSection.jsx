import React from 'react';
import WorkExperienceCard from './WorkExperienceCard';
import { workExperience } from '../data/Portfolio';

const WorkExperienceSection = () => {
  return (
    <div className="mb-20">
      <h2 className="text-4xl font-bold mb-12 text-center animate-glow bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
        Work Experience
      </h2>
      
      {/* Timeline Container */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-700"></div>
        
        {/* Experience Cards */}
        <div className="space-y-8 ml-6">
          {workExperience.map((experience, index) => (
            <WorkExperienceCard 
              key={experience.id} 
              experience={experience}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceSection;