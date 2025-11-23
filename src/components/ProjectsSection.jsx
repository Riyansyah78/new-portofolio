import React from 'react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/Portfolio';

const ProjectsSection = () => {
  return (
    <div className="mb-20">
      <h2 className="text-4xl font-bold mb-12 text-center animate-glow bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
        Projects
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;