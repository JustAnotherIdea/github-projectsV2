import React from 'react';
import { Board } from './components/Board';

export const App: React.FC = () => {
  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <Board />
    </div>
  );
};