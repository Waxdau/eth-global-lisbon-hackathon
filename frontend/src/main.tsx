import './bufferPolyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './app/Home';
import SideBar from './app/components/Sidebar';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="layout">
      <SideBar />
      <Home />
    </div>
  </React.StrictMode>,
);
