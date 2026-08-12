import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

export { PageShell };

function PageShell({ children }) {
  return (
    <React.StrictMode>
      <HelmetProvider>
        {children}
      </HelmetProvider>
    </React.StrictMode>
  );
}
