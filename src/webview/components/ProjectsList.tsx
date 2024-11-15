import React, { useState, useEffect } from 'react';

declare const acquireVsCodeApi: () => {
  postMessage: (message: any) => void;
  setState: (state: any) => void;
  getState: () => any;
};

const vscode = acquireVsCodeApi();

interface Project {
  id: string;
  title: string;
  number: number;
}

export const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.addEventListener('message', event => {
      const message = event.data;
      switch (message.type) {
        case 'projects':
          setProjects(message.projects);
          setLoading(false);
          break;
      }
    });

    vscode.postMessage({ command: 'getProjects' });
  }, []);

  const handleProjectClick = (projectId: string) => {
    vscode.postMessage({
      command: 'openProject',
      projectId
    });
  };

  if (loading) {
    return <div className="p-4">Loading projects...</div>;
  }

  return (
    <div className="flex flex-col">
      {projects.map(project => (
        <button
          key={project.id}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-left"
          onClick={() => handleProjectClick(project.id)}
        >
          {project.title}
        </button>
      ))}
    </div>
  );
};