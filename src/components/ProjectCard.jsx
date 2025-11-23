import React from 'react';

const ProjectCard = ({ project, index }) => {
  return (
    <div
      className="border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl hover:border-gray-400 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 animate-slideIn"
      style={{animationDelay: `${0.4 + index * 0.1}s`}}
    >
      {/* Project Image */}
      {project.image && (
        <div className="mb-4 rounded-lg overflow-hidden bg-gray-800 h-48">
          <img 
            src={project.image} 
            alt={project.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-600"><svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>';
            }}
          />
        </div>
      )}

      <h3 className="text-xl font-bold mb-3 text-gray-100">{project.name}</h3>
      <p className="text-gray-400 mb-4 text-sm leading-relaxed">
        {project.description}
      </p>
      
      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map(tech => (
          <span
            key={tech}
            className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-white text-black text-sm rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
          >
            Demo
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 border border-gray-600 text-sm rounded-lg hover:bg-gray-800 hover:border-gray-400 transition-colors text-center"
          >
            Code
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;