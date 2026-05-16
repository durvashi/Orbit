import { IconButton, Tooltip } from '@mui/material';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useColorMode } from '../context/ColorModeContext';

export default function ThemeToggle({ size = 'medium' }) {
  const { mode, toggle } = useColorMode();
  const isDark = mode === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={toggle}
        size={size}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform .35s cubic-bezier(.2,.8,.2,1)',
          '&:hover': { transform: 'rotate(20deg) scale(1.1)' },
          '& svg': {
            transition: 'opacity .25s ease, transform .35s cubic-bezier(.2,.8,.2,1)',
          },
        }}
        aria-label="toggle color mode"
      >
        {isDark ? (
          <LightModeRoundedIcon
            sx={{ animation: 'scaleIn .35s ease', color: '#fbbf24' }}
          />
        ) : (
          <DarkModeRoundedIcon
            sx={{ animation: 'scaleIn .35s ease' }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
}
