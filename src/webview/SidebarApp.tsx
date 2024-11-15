import React from 'react';
import { ProjectsList } from './components/ProjectsList';

export const SidebarApp: React.FC = () => {
  return (
    <div className="h-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <ProjectsList />
    </div>
  );
};