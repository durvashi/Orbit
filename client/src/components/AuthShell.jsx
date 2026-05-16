import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ThemeToggle from './ThemeToggle';

// A bold split-screen shell shared by Login + Signup
export default function AuthShell({ children }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Brand panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          color: '#fff',
          background: isDark
            ? 'radial-gradient(120% 120% at 0% 0%, #4338ca 0%, #312e81 45%, #0b0a14 100%)'
            : 'radial-gradient(120% 120% at 0% 0%, #6d28d9 0%, #4f46e5 45%, #1e1b4b 100%)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute', inset: 0,
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
            backgroundSize: '22px 22px', opacity: 0.5,
          }}
        />
        {/* Soft floating orbs for depth */}
        <Box
          sx={{
            position: 'absolute', width: 280, height: 280, borderRadius: '50%',
            top: '-60px', right: '-60px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)',
            animation: 'floaty 7s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute', width: 200, height: 200, borderRadius: '50%',
            bottom: '10%', left: '-40px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)',
            animation: 'floaty 9s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />

        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1.5, animation: 'fadeInUp .6s ease both' }}>
          <Box
            sx={{
              width: 42, height: 42, borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.15)',
              display: 'grid', placeItems: 'center',
              fontFamily: '"Bricolage Grotesque Variable"', fontWeight: 800, fontSize: 22,
            }}
          >
            O
          </Box>
          <Typography sx={{ fontFamily: '"Bricolage Grotesque Variable"', fontWeight: 800, fontSize: 22 }}>
            Orbit
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', maxWidth: 460 }}>
          <Typography
            sx={{
              fontFamily: '"Bricolage Grotesque Variable"',
              fontWeight: 800, fontSize: 44, lineHeight: 1.1, mb: 2,
              animation: 'fadeInUp .7s ease both', animationDelay: '.1s',
            }}
          >
            Where teams plan, assign, and ship.
          </Typography>
          <Typography
            sx={{
              opacity: 0.85, fontSize: 17, lineHeight: 1.6,
              animation: 'fadeInUp .7s ease both', animationDelay: '.2s',
            }}
          >
            Projects, role-based access, and a clear view of what's overdue —
            all in one calm workspace.
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative', display: 'flex', gap: 4, opacity: 0.85,
            animation: 'fadeInUp .7s ease both', animationDelay: '.3s',
          }}
        >
          {[
            ['Role-based', 'Admin & Member'],
            ['Real-time', 'Status tracking'],
            ['Overdue', 'Never miss a date'],
          ].map(([a, b]) => (
            <Box key={a}>
              <Typography sx={{ fontWeight: 800, fontFamily: '"Bricolage Grotesque Variable"' }}>
                {a}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {b}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 6 },
          bgcolor: 'background.default',
          position: 'relative',
        }}
      >
        {/* Theme toggle, top-right of the form side */}
        <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
          <ThemeToggle />
        </Box>
        <Box sx={{ width: '100%', maxWidth: 400 }}>{children}</Box>
      </Box>
    </Box>
  );
}
