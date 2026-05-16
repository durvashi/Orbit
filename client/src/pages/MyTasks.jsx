import { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Skeleton, ToggleButton,
  ToggleButtonGroup, Snackbar, Alert,
} from '@mui/material';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskDialog from '../components/TaskDialog';
import EmptyState from '../components/EmptyState';

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dialog, setDialog] = useState({ open: false, task: null });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks?mine=true');
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (form) => {
    setSaving(true);
    try {
      await api.put(`/tasks/${dialog.task._id}`, form);
      setDialog({ open: false, task: null });
      setToast({ type: 'success', msg: 'Task updated' });
      load();
    } catch (e) {
      setToast({ type: 'error', msg: e.response?.data?.message || 'Failed' });
    } finally {
      setSaving(false);
    }
  };

  const filtered =
    filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">My Tasks</Typography>
        <Typography color="text.secondary">
          Everything assigned to you across all projects.
        </Typography>
      </Box>

      <ToggleButtonGroup
        exclusive value={filter} size="small"
        onChange={(e, v) => v && setFilter(v)}
        sx={{ mb: 3, flexWrap: 'wrap' }}
      >
        <ToggleButton value="all" sx={{ textTransform: 'none', px: 2 }}>All</ToggleButton>
        <ToggleButton value="todo" sx={{ textTransform: 'none', px: 2 }}>To Do</ToggleButton>
        <ToggleButton value="in-progress" sx={{ textTransform: 'none', px: 2 }}>In Progress</ToggleButton>
        <ToggleButton value="done" sx={{ textTransform: 'none', px: 2 }}>Done</ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        <Grid container spacing={2.5}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={170} />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<AssignmentIndRoundedIcon sx={{ fontSize: 30 }} />}
          title="Nothing here"
          subtitle="No tasks match this filter. Enjoy the calm."
        />
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map((t) => (
            <Grid item xs={12} sm={6} md={4} key={t._id}>
              <TaskCard
                task={t}
                onEdit={(task) => setDialog({ open: true, task })}
                onDelete={() => {}}
                canDelete={false}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <TaskDialog
        open={dialog.open}
        task={dialog.task}
        members={[]}
        saving={saving}
        onClose={() => setDialog({ open: false, task: null })}
        onSave={save}
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
