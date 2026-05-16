import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { buildTheme } from '../theme';

const ColorModeContext = createContext({ mode: 'light', toggle: () => {} });

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('color-mode');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('color-mode', next);
      return next;
    });
  }, []);

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);
