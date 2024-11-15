import React, { useState, useEffect } from 'react';
import { Column } from './Column';

interface BoardColumn {
  id: string;
  name: string;
}

export const Board: React.FC = () => {
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch columns from GitHub API
    setColumns([
      { id: '1', name: 'To Do' },
      { id: '2', name: 'In Progress' },
      { id: '3', name: 'Done' }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="flex h-full overflow-x-auto p-4 space-x-4">
      {columns.map(column => (
        <Column key={column.id} name={column.name} />
      ))}
    </div>
  );
};