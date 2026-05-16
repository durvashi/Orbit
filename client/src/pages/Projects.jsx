import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Grid, Card, CardContent, AvatarGroup,
  Avatar, Chip, LinearProgress, Skeleton, Snackbar, Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProjectDialog from '../components/ProjectDialog';
import EmptyState from '../components/EmptyState';

const STATUS_COLOR = {
  active: { bg: 'rgba(16,185,129,0.16)', fg: '#10b981' },
  'on-hold': { bg: 'rgba(245,158,11,0.18)', fg: '#f59e0b' },
  completed: { bg: 'rgba(99,102,241,0.16)', fg: '#6366f1' },
  archived: { bg: 'rgba(100,116,139,0.16)', fg: '#94a3b8' },
};

export default function Projects() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [p, u] = await Promise.all([
        api.get('/projects'),
        api.get('/users'),
      ]);
      setProjects(p.data);
      setUsers(u.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (form) => {
    setSaving(true);
    try {
      await api.post('/projects', form);
      setDialog(false);
      setToast({ type: 'success', msg: 'Project created' });
      load();
    } catch (e) {
      setToast({ type: 'error', msg: e.response?.data?.message || 'Failed' });
    } finally {
      setSaving(false);
    }
  };

  const progressTrack =
    theme.palette.mode === 'dark' ? 'rgba(129,140,248,0.18)' : 'rgba(79,70,229,0.12)';

  return (
    <Box>
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        mb: 4, flexWrap: 'wrap', gap: 2, animation: 'fadeInUp .5s ease both',
      }}>
        <Box>
          <Typography variant="h4">Projects</Typography>
          <Typography color="text.secondary">
            {isAdmin ? 'Manage every project in the workspace.' : 'Projects you belong to.'}
          </Typography>
        </Box>
        {isAdmin && (
          <Button
            variant="contained" startIcon={<AddRoundedIcon />}
            onClick={() => setDialog(true)}
          >
            New project
          </Button>
        )}
      </Box>

      {loading ? (
        <Grid container spacing={2.5}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={190} />
            </Grid>
          ))}
        </Grid>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderRoundedIcon sx={{ fontSize: 30 }} />}
          title="No projects yet"
          subtitle={isAdmin ? 'Create your first project to get started.' : 'You have not been added to any projects yet.'}
          action={isAdmin && (
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialog(true)}>
              New project
            </Button>
          )}
        />
      ) : (
        <Grid container spacing={2.5}>
          {projects.map((p, i) => {
            const pct = p.taskCount ? Math.round((p.completedCount / p.taskCount) * 100) : 0;
            const sc = STATUS_COLOR[p.status] || STATUS_COLOR.active;
            return (
              <Grid item xs={12} sm={6} md={4} key={p._id}>
                <Card
                  onClick={() => navigate(`/projects/${p._id}`)}
                  sx={{
                    cursor: 'pointer', height: '100%',
                    animation: 'fadeInUp .5s cubic-bezier(.2,.8,.2,1) both',
                    animationDelay: `${0.06 * i}s`,
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: 'primary.main',
                      boxShadow:
                        theme.palette.mode === 'dark'
                          ? '0 18px 36px -18px rgba(0,0,0,0.75)'
                          : '0 16px 32px -16px rgba(28,27,34,0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 44, height: 44, borderRadius: 2.5,
                          background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                          display: 'grid', placeItems: 'center', color: '#fff',
                          transition: 'transform .3s ease',
                          '.MuiCard-root:hover &': { transform: 'rotate(-8deg) scale(1.08)' },
                        }}
                      >
                        <FolderRoundedIcon />
                      </Box>
                      <Chip
                        size="small" label={p.status}
                        sx={{ bgcolor: sc.bg, color: sc.fg, fontWeight: 700, textTransform: 'capitalize' }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>{p.name}</Typography>
                    <Typography
                      variant="body2" color="text.secondary"
                      sx={{
                        mb: 2, minHeight: 40, display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}
                    >
                      {p.description || 'No description provided.'}
                    </Typography>

                    <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        {p.completedCount}/{p.taskCount} tasks
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {pct}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate" value={pct}
                      sx={{ height: 7, borderRadius: 4, mb: 2, bgcolor: progressTrack }}
                    />

                    <AvatarGroup
                      max={4}
                      sx={{ justifyContent: 'flex-end', '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}
                    >
                      {p.members?.map((m) => (
                        <Avatar key={m._id} sx={{ bgcolor: m.avatarColor }}>
                          {m.name?.[0]?.toUpperCase()}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <ProjectDialog
        open={dialog}
        onClose={() => setDialog(false)}
        onSave={create}
        users={users}
        saving={saving}
      />

      <Snackbar
        open={Boolean(toast)} autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast && (
          <Alert severity={toast.type} onClose={() => setToast(null)}>
            {toast.msg}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}
