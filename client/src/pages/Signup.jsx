import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography, TextField, Button, Alert, Box, ToggleButton,
  ToggleButtonGroup, CircularProgress,
} from '@mui/material';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'member',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const step = (i) => ({
    animation: 'fadeInUp .55s cubic-bezier(.2,.8,.2,1) both',
    animationDelay: `${0.07 * i}s`,
  });

  return (
    <AuthShell>
      <Typography variant="h4" sx={{ mb: 0.5, ...step(0) }}>
        Create your account
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, ...step(1) }}>
        Start managing your team's work in minutes.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, animation: 'scaleIn .3s ease' }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={submit}>
        <TextField
          fullWidth label="Full name" required sx={{ mb: 2.5, ...step(2) }}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          fullWidth label="Email" type="email" required sx={{ mb: 2.5, ...step(3) }}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          fullWidth label="Password" type="password" required
          helperText="At least 6 characters" sx={{ mb: 2.5, ...step(4) }}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Box sx={step(5)}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Account role
          </Typography>
          <ToggleButtonGroup
            exclusive fullWidth value={form.role}
            onChange={(e, v) => v && setForm({ ...form, role: v })}
            sx={{ mb: 3 }}
          >
            <ToggleButton value="member" sx={{ gap: 1, py: 1.2, textTransform: 'none' }}>
              <PersonRoundedIcon fontSize="small" /> Member
            </ToggleButton>
            <ToggleButton value="admin" sx={{ gap: 1, py: 1.2, textTransform: 'none' }}>
              <AdminPanelSettingsRoundedIcon fontSize="small" /> Admin
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Button
          fullWidth type="submit" variant="contained" size="large"
          disabled={loading} sx={{ py: 1.3, mb: 3, ...step(6) }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Create account'}
        </Button>
      </Box>

      <Typography
        variant="body2" color="text.secondary" align="center"
        sx={step(7)}
      >
        Already have an account?{' '}
        <Box
          component={Link}
          to="/login"
          sx={{
            color: 'primary.main', fontWeight: 700, textDecoration: 'none',
            position: 'relative',
            '&::after': {
              content: '""', position: 'absolute', left: 0, bottom: -2,
              width: '100%', height: '2px', bgcolor: 'primary.main',
              transform: 'scaleX(0)', transformOrigin: 'right',
              transition: 'transform .25s ease',
            },
            '&:hover::after': { transform: 'scaleX(1)', transformOrigin: 'left' },
          }}
        >
          Sign in
        </Box>
      </Typography>
    </AuthShell>
  );
}
