import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyles } from '@mui/material';

import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/plus-jakarta-sans';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ColorModeProvider } from './context/ColorModeContext';

// Global keyframes available app-wide for entrance/interaction animations
const globalAnimations = (
  <GlobalStyles
    styles={{
      '@keyframes fadeInUp': {
        from: { opacity: 0, transform: 'translateY(16px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
      },
      '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      '@keyframes scaleIn': {
        from: { opacity: 0, transform: 'scale(.96)' },
        to: { opacity: 1, transform: 'scale(1)' },
      },
      '@keyframes floaty': {
        '0%,100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-6px)' },
      },
      '*': { scrollbarWidth: 'thin' },
    }}
  />
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeProvider>
      {globalAnimations}
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ColorModeProvider>
  </React.StrictMode>
);
