import { createTheme } from '@mui/material/styles';

// Shared design tokens across both modes
const shared = {
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Plus Jakarta Sans Variable", system-ui, sans-serif',
    h1: { fontFamily: '"Bricolage Grotesque Variable", serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Bricolage Grotesque Variable", serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: '"Bricolage Grotesque Variable", serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontFamily: '"Bricolage Grotesque Variable", serif', fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontFamily: '"Bricolage Grotesque Variable", serif', fontWeight: 600 },
    h6: { fontFamily: '"Bricolage Grotesque Variable", serif', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
};

const palettes = {
  light: {
    mode: 'light',
    primary: { main: '#4f46e5', light: '#6366f1', dark: '#3730a3', contrastText: '#ffffff' },
    secondary: { main: '#0f766e' },
    background: { default: '#f7f6f3', paper: '#ffffff' },
    text: { primary: '#1c1b22', secondary: '#6b6a78' },
    success: { main: '#059669' },
    warning: { main: '#d97706' },
    error: { main: '#e11d48' },
    info: { main: '#4f46e5' },
    divider: 'rgba(28, 27, 34, 0.08)',
  },
  dark: {
    mode: 'dark',
    primary: { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1', contrastText: '#0b0a12' },
    secondary: { main: '#2dd4bf' },
    background: { default: '#0d0c14', paper: '#16151f' },
    text: { primary: '#ededf2', secondary: '#a1a0ad' },
    success: { main: '#34d399' },
    warning: { main: '#fbbf24' },
    error: { main: '#fb7185' },
    info: { main: '#818cf8' },
    divider: 'rgba(255, 255, 255, 0.10)',
  },
};

export const buildTheme = (mode = 'light') => {
  const isDark = mode === 'dark';
  const surface = isDark ? '#1c1b27' : '#fbfaf8';

  return createTheme({
    ...shared,
    palette: palettes[mode] || palettes.light,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10, paddingInline: 18, paddingBlock: 9, boxShadow: 'none',
            transition: 'transform .15s ease, box-shadow .2s ease, background-color .2s ease',
            '&:hover': { transform: 'translateY(-1px)' },
            '&:active': { transform: 'translateY(0)' },
          },
          containedPrimary: {
            '&:hover': {
              boxShadow: isDark
                ? '0 8px 24px -6px rgba(129,140,248,0.5)'
                : '0 6px 20px -6px rgba(79,70,229,0.5)',
            },
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(28,27,34,0.07)'}`,
            boxShadow: isDark ? '0 1px 2px rgba(0,0,0,0.4)' : '0 1px 2px rgba(28,27,34,0.04)',
            transition: 'transform .2s cubic-bezier(.2,.8,.2,1), box-shadow .2s ease, border-color .2s ease',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(13,12,20,0.85)' : 'rgba(247,246,243,0.85)',
            backdropFilter: 'blur(12px)',
            color: isDark ? '#ededf2' : '#1c1b22',
            boxShadow: 'none',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(28,27,34,0.08)'}`,
          },
        },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } } },
      MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10 } } },
      MuiDrawer: {
        styleOverrides: {
          paper: { backgroundColor: surface },
        },
      },
    },
  });
};

// Default export kept for backward compatibility
const theme = buildTheme('light');
export default theme;
