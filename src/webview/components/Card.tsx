import React from 'react';

export const Card: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-600 p-3 rounded shadow">
      <h4 className="font-medium">Issue Title</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">Description</p>
      <div className="mt-2 flex items-center space-x-2">
        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded">Label</span>
      </div>
    </div>
  );
};