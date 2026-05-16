import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Card, CardContent, Typography, Box, LinearProgress,
  Skeleton, Avatar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { StatusChip, PriorityChip } from '../components/StatusChip';
import dayjs from 'dayjs';

const StatCard = ({ icon, label, value, color, onClick, index }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: onClick ? 'pointer' : 'default',
      animation: 'fadeInUp .5s cubic-bezier(.2,.8,.2,1) both',
      animationDelay: `${0.08 * index}s`,
      '&:hover': onClick
        ? { transform: 'translateY(-4px)', borderColor: 'primary.main' }
        : {},
    }}
  >
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 52, height: 52, borderRadius: 3, display: 'grid',
          placeItems: 'center', bgcolor: `${color}1f`, color,
          transition: 'transform .3s ease',
          '.MuiCard-root:hover &': { transform: 'scale(1.1) rotate(-6deg)' },
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontFamily: '"Bricolage Grotesque Variable"', fontWeight: 800, fontSize: 28, lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, t] = await Promise.all([
          api.get('/tasks/stats/overview'),
          api.get('/tasks'),
        ]);
        setStats(s.data);
        setRecent(t.data.slice(0, 6));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pct =
    stats && stats.totalTasks
      ? Math.round((stats.done / stats.totalTasks) * 100)
      : 0;

  const progressTrack =
    theme.palette.mode === 'dark' ? 'rgba(129,140,248,0.18)' : 'rgba(79,70,229,0.12)';

  return (
    <Box>
      <Box sx={{ mb: 4, animation: 'fadeInUp .5s ease both' }}>
        <Typography variant="h4">
          Hello, {user?.name?.split(' ')[0]} 👋
        </Typography>
        <Typography color="text.secondary">
          Here's what's happening across your workspace.
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {loading ? (
          [...Array(4)].map((_, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Skeleton variant="rounded" height={92} />
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={6} md={3}>
              <StatCard
                index={0} icon={<FolderRoundedIcon />} color="#6366f1"
                label="Projects" value={stats.totalProjects}
                onClick={() => navigate('/projects')}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                index={1} icon={<ChecklistRoundedIcon />} color="#14b8a6"
                label="Total tasks" value={stats.totalTasks}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                index={2} icon={<PendingActionsRoundedIcon />} color="#f59e0b"
                label="In progress" value={stats.inProgress}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                index={3} icon={<EventBusyRoundedIcon />} color="#f43f5e"
                label="Overdue" value={stats.overdue}
              />
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', animation: 'fadeInUp .55s ease both', animationDelay: '.15s' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                Completion
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Across all your tasks
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: '"Bricolage Grotesque Variable"',
                    fontWeight: 800, fontSize: 56, color: 'primary.main', lineHeight: 1,
                  }}
                >
                  {pct}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate" value={pct}
                sx={{ height: 10, borderRadius: 5, mb: 3, bgcolor: progressTrack }}
              />
              {stats && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800 }}>{stats.todo}</Typography>
                    <Typography variant="caption" color="text.secondary">To Do</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800 }}>{stats.inProgress}</Typography>
                    <Typography variant="caption" color="text.secondary">Active</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800 }}>{stats.done}</Typography>
                    <Typography variant="caption" color="text.secondary">Done</Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', animation: 'fadeInUp .55s ease both', animationDelay: '.2s' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent tasks
              </Typography>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <Skeleton key={i} height={48} sx={{ mb: 1 }} />
                ))
              ) : recent.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  No tasks yet.
                </Typography>
              ) : (
                recent.map((t, i) => (
                  <Box
                    key={t._id}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
                      py: 1.5, borderBottom: `1px solid ${theme.palette.divider}`,
                      '&:last-child': { borderBottom: 'none' },
                      animation: 'fadeInUp .4s ease both',
                      animationDelay: `${0.05 * i}s`,
                      transition: 'padding-left .2s ease',
                      '&:hover': { pl: 1 },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32, height: 32, fontSize: 13,
                        bgcolor: t.assignee?.avatarColor || '#94a3b8',
                      }}
                    >
                      {t.assignee?.name?.[0]?.toUpperCase() || '?'}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography noWrap sx={{ fontWeight: 600 }}>
                        {t.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t.project?.name}
                        {t.dueDate && ` · due ${dayjs(t.dueDate).format('MMM D')}`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.75 }}>
                      <PriorityChip priority={t.priority} />
                      <StatusChip status={t.status} />
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
