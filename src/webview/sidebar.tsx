import React from 'react';
import { createRoot } from 'react-dom/client';
import { SidebarApp } from './SidebarApp';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<SidebarApp />);