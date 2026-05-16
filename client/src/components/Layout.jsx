import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, Avatar, IconButton, Menu, MenuItem,
  Divider, Chip, useMediaQuery, useTheme,
} from '@mui/material';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const WIDTH = 264;

const nav = [
  { label: 'Dashboard', to: '/', icon: <SpaceDashboardRoundedIcon /> },
  { label: 'Projects', to: '/projects', icon: <FolderRoundedIcon /> },
  { label: 'My Tasks', to: '/my-tasks', icon: <AssignmentIndRoundedIcon /> },
];

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const hoverBg = isDark ? 'rgba(129,140,248,0.12)' : 'rgba(79,70,229,0.06)';
  const activeBg = isDark ? 'rgba(129,140,248,0.18)' : 'rgba(79,70,229,0.10)';

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 38, height: 38, borderRadius: 2.5,
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            display: 'grid', placeItems: 'center', color: '#fff',
            fontFamily: '"Bricolage Grotesque Variable"', fontWeight: 800,
            transition: 'transform .3s ease',
            '&:hover': { transform: 'rotate(-8deg) scale(1.05)' },
          }}
        >
          O
        </Box>
        <Box>
          <Typography sx={{ fontFamily: '"Bricolage Grotesque Variable"', fontWeight: 800, lineHeight: 1 }}>
            Orbit
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Task Manager
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {nav.map((item, i) => {
          const active = isActive(item.to);
          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                borderRadius: 2.5, mb: 0.5, py: 1.1,
                color: active ? 'primary.main' : 'text.secondary',
                bgcolor: active ? activeBg : 'transparent',
                animation: 'fadeInUp .4s ease both',
                animationDelay: `${0.06 * i}s`,
                transition: 'background-color .2s ease, transform .15s ease',
                '&:hover': { bgcolor: hoverBg, transform: 'translateX(3px)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: 15 }}
                primary={item.label}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2, borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            display: 'flex', alignItems: 'center', gap: 1.5,
          }}
        >
          <Avatar sx={{ bgcolor: user?.avatarColor, width: 36, height: 36, fontSize: 15 }}>
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography noWrap sx={{ fontWeight: 700, fontSize: 14 }}>
              {user?.name}
            </Typography>
            <Chip
              size="small"
              label={isAdmin ? 'Admin' : 'Member'}
              sx={{
                height: 18, fontSize: 11,
                bgcolor: isAdmin ? 'rgba(129,140,248,0.18)' : 'rgba(45,212,191,0.18)',
                color: isAdmin ? 'primary.main' : 'secondary.main',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${WIDTH}px)` }, ml: { md: `${WIDTH}px` } }}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Typography sx={{ flex: 1, fontFamily: '"Bricolage Grotesque Variable"', fontWeight: 700 }}>
            {nav.find((n) => isActive(n.to))?.label || 'Workspace'}
          </Typography>
          <ThemeToggle />
          <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
            <Avatar sx={{ bgcolor: user?.avatarColor, width: 34, height: 34, fontSize: 14 }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
            <MenuItem disabled sx={{ opacity: '1 !important' }}>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => { logout(); navigate('/login'); }}
              sx={{ color: 'error.main', gap: 1 }}
            >
              <LogoutRoundedIcon fontSize="small" /> Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: WIDTH, boxSizing: 'border-box', border: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: WIDTH, boxSizing: 'border-box',
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${WIDTH}px)` } }}>
        <Toolbar />
        <Box
          key={location.pathname}
          sx={{
            p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1280, mx: 'auto',
            animation: 'fadeIn .35s ease both',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
