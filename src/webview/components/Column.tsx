import React from 'react';
import { Card } from './Card';

interface ColumnProps {
  name: string;
}

export const Column: React.FC<ColumnProps> = ({ name }) => {
  return (
    <div className="flex flex-col w-80 bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-4">{name}</h3>
      <div className="flex-1 overflow-y-auto space-y-2">
        <Card />
      </div>
    </div>
  );
};