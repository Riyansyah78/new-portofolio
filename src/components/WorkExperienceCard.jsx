import React from 'react';

const WorkExperienceCard = ({ experience, index }) => {
  return (
    <div
      className="relative border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl hover:border-gray-400 transition-all duration-300 animate-slideIn"
      style={{animationDelay: `${0.2 + index * 0.1}s`}}
    >
      {/* Timeline Dot */}
      <div className="absolute -left-3 top-8 w-6 h-6 bg-white rounded-full border-4 border-black"></div>
      
      {/* Period Badge */}
      <div className="inline-block px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full mb-4 border border-gray-700">
        {experience.period}
      </div>

      {/* Position & Company */}
      <h3 className="text-xl font-bold text-gray-100 mb-1">
        {experience.position}
      </h3>
      <p className="text-gray-400 mb-1">
        {experience.company} • {experience.location}
      </p>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        {experience.description}
      </p>

      {/* Achievements */}
      {experience.achievements && experience.achievements.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-300 text-sm font-medium mb-2">Key Achievements:</p>
          <ul className="space-y-1">
            {experience.achievements.map((achievement, idx) => (
              <li key={idx} className="text-gray-400 text-sm flex items-start">
                <span className="text-white mr-2">•</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2">
        {experience.tech.map(tech => (
          <span
            key={tech}
            className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WorkExperienceCard;