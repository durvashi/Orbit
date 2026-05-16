import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography, TextField, Button, Alert, Box, InputAdornment,
  IconButton, CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const step = (i) => ({
    animation: 'fadeInUp .55s cubic-bezier(.2,.8,.2,1) both',
    animationDelay: `${0.08 * i}s`,
  });

  return (
    <AuthShell>
      <Typography variant="h4" sx={{ mb: 0.5, ...step(0) }}>
        Welcome back
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, ...step(1) }}>
        Sign in to your workspace to continue.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, animation: 'scaleIn .3s ease' }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={submit}>
        <TextField
          fullWidth label="Email" type="email" required
          sx={{ mb: 2.5, ...step(2) }}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          fullWidth label="Password" required
          type={show ? 'text' : 'password'}
          sx={{ mb: 3, ...step(3) }}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow(!show)} edge="end" size="small">
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          fullWidth type="submit" variant="contained" size="large"
          disabled={loading}
          sx={{ py: 1.3, mb: 3, ...step(4) }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
        </Button>
      </Box>

      <Typography
        variant="body2" color="text.secondary" align="center"
        sx={step(5)}
      >
        New here?{' '}
        <Box
          component={Link}
          to="/signup"
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
          Create an account
        </Box>
      </Typography>
    </AuthShell>
  );
}
