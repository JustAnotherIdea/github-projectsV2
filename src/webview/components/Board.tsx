import React, { useState, useEffect } from 'react';
import { Column } from './Column';

declare const acquireVsCodeApi: () => {
  postMessage: (message: any) => void;
  setState: (state: any) => void;
  getState: () => any;
};

const vscode = acquireVsCodeApi();

interface BoardColumn {
  id: string;
  name: string;
}

export const Board: React.FC = () => {
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = event.data;
      switch (message.type) {
        case 'columns':
          setColumns(message.columns);
          setLoading(false);
          break;
        case 'loadProject':
          setLoading(true);
          vscode.postMessage({ command: 'getColumns', projectId: message.projectId });
          break;
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div 
      className="flex h-full overflow-x-auto p-4 space-x-4"
      onWheel={(e) => e.currentTarget.scrollLeft += e.deltaY}
    >
      {columns.map(column => (
        <Column key={column.id} name={column.name} />
      ))}
    </div>
  );
};