import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Grid, Card, CardContent, Avatar, Chip,
  IconButton, Skeleton, Snackbar, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, TextField, Tooltip,
  AvatarGroup, Divider,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import { useTheme } from '@mui/material/styles';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskDialog from '../components/TaskDialog';
import ProjectDialog from '../components/ProjectDialog';

const COLUMNS = [
  { key: 'todo', label: 'To Do', accent: '#64748b' },
  { key: 'in-progress', label: 'In Progress', accent: '#d97706' },
  { key: 'done', label: 'Done', accent: '#059669' },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const theme = useTheme();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskDialog, setTaskDialog] = useState({ open: false, task: null });
  const [projDialog, setProjDialog] = useState(false);
  const [memberDialog, setMemberDialog] = useState(false);
  const [newMember, setNewMember] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, t, u] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`),
        api.get('/users'),
      ]);
      setProject(p.data);
      setTasks(t.data);
      setUsers(u.data);
    } catch (e) {
      setToast({ type: 'error', msg: 'Could not load project' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const isOwner = project && (project.owner._id === user._id || project.owner === user._id);
  const canManage = isAdmin || isOwner;

  const saveTask = async (form) => {
    setSaving(true);
    try {
      if (taskDialog.task) {
        await api.put(`/tasks/${taskDialog.task._id}`, form);
        setToast({ type: 'success', msg: 'Task updated' });
      } else {
        await api.post('/tasks', { ...form, project: id });
        setToast({ type: 'success', msg: 'Task created' });
      }
      setTaskDialog({ open: false, task: null });
      load();
    } catch (e) {
      setToast({ type: 'error', msg: e.response?.data?.message || 'Failed' });
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async (task) => {
    try {
      await api.delete(`/tasks/${task._id}`);
      setToast({ type: 'success', msg: 'Task deleted' });
      setConfirm(null);
      load();
    } catch (e) {
      setToast({ type: 'error', msg: e.response?.data?.message || 'Failed' });
    }
  };

  const saveProject = async (form) => {
    setSaving(true);
    try {
      await api.put(`/projects/${id}`, form);
      setProjDialog(false);
      setToast({ type: 'success', msg: 'Project updated' });
      load();
    } catch (e) {
      setToast({ type: 'error', msg: e.response?.data?.message || 'Failed' });
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async () => {
    try {
      await api.delete(`/projects/${id}`);
      navigate('/projects');
    } catch (e) {
      setToast({ type: 'error', msg: e.response?.data?.message || 'Failed' });
    }
  };

  const addMember = async () => {
    if (!newMember) return;
    try {
      await api.post(`/projects/${id}/members`, { userId: newMember });
      setMemberDialog(false);
      setNewMember('');
      setToast({ type: 'success', msg: 'Member added' });
      load();
    } catch (e) {
      setToast({ type: 'error', msg: e.response?.data?.message || 'Failed' });
    }
  };

  const removeMember = async (userId) => {
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      setToast({ type: 'success', msg: 'Member removed' });
      load();
    } catch (e) {
      setToast({ type: 'error', msg: e.response?.data?.message || 'Failed' });
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={240} height={48} />
        <Skeleton variant="rounded" height={120} sx={{ my: 3 }} />
        <Grid container spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rounded" height={300} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!project) return null;

  const nonMembers = users.filter(
    (u) => !project.members.some((m) => (m._id || m) === u._id)
  );

  return (
    <Box>
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate('/projects')}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        All projects
      </Button>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 240 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Typography variant="h4">{project.name}</Typography>
                <Chip
                  size="small" label={project.status}
                  sx={{ textTransform: 'capitalize', fontWeight: 700,
                    bgcolor: 'rgba(79,70,229,0.12)', color: 'primary.main' }}
                />
              </Box>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {project.description || 'No description provided.'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AvatarGroup max={6} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 13 } }}>
                  {project.members.map((m) => (
                    <Tooltip key={m._id} title={`${m.name}${m._id === (project.owner._id || project.owner) ? ' (owner)' : ''}`}>
                      <Avatar sx={{ bgcolor: m.avatarColor }}>
                        {m.name?.[0]?.toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>
                {canManage && (
                  <IconButton size="small" onClick={() => setMemberDialog(true)} sx={{ ml: 1 }}>
                    <GroupAddRoundedIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Button
                variant="contained" startIcon={<AddRoundedIcon />}
                onClick={() => setTaskDialog({ open: true, task: null })}
              >
                Add task
              </Button>
              {canManage && (
                <IconButton onClick={() => setProjDialog(true)}>
                  <EditRoundedIcon />
                </IconButton>
              )}
              {isAdmin && (
                <IconButton sx={{ color: 'error.main' }}
                  onClick={() => setConfirm({ type: 'project' })}>
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              )}
            </Box>
          </Box>

          {canManage && project.members.length > 1 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {project.members
                  .filter((m) => m._id !== (project.owner._id || project.owner))
                  .map((m) => (
                    <Chip
                      key={m._id}
                      avatar={<Avatar sx={{ bgcolor: m.avatarColor }}>{m.name?.[0]}</Avatar>}
                      label={m.name}
                      onDelete={() => removeMember(m._id)}
                      deleteIcon={<PersonRemoveRoundedIcon />}
                      variant="outlined"
                    />
                  ))}
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <Grid item xs={12} md={4} key={col.key}>
              <Box
                sx={{
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.03)' : '#fbfaf8',
                  borderRadius: 4, p: 2,
                  border: '1px solid', borderColor: 'divider', minHeight: 200,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: 0.5 }}>
                  <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: col.accent }} />
                  <Typography sx={{ fontWeight: 700, fontFamily: '"Bricolage Grotesque Variable"' }}>
                    {col.label}
                  </Typography>
                  <Chip size="small" label={colTasks.length}
                    sx={{ height: 20, bgcolor: 'background.paper', fontWeight: 700 }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {colTasks.length === 0 ? (
                    <Typography variant="body2" color="text.secondary"
                      sx={{ textAlign: 'center', py: 4 }}>
                      No tasks here
                    </Typography>
                  ) : (
                    colTasks.map((t) => (
                      <TaskCard
                        key={t._id}
                        task={t}
                        onEdit={(task) => setTaskDialog({ open: true, task })}
                        onDelete={(task) => setConfirm({ type: 'task', task })}
                        canDelete={isAdmin || isOwner || t.createdBy?._id === user._id}
                      />
                    ))
                  )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <TaskDialog
        open={taskDialog.open}
        task={taskDialog.task}
        members={project.members}
        saving={saving}
        onClose={() => setTaskDialog({ open: false, task: null })}
        onSave={saveTask}
      />

      <ProjectDialog
        open={projDialog}
        project={project}
        users={users}
        saving={saving}
        onClose={() => setProjDialog(false)}
        onSave={saveProject}
      />

      <Dialog open={memberDialog} onClose={() => setMemberDialog(false)}
        maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontFamily: '"Bricolage Grotesque Variable"', fontWeight: 700 }}>
          Add a member
        </DialogTitle>
        <DialogContent>
          <TextField
            select fullWidth label="Select user" sx={{ mt: 1 }}
            value={newMember} onChange={(e) => setNewMember(e.target.value)}
          >
            {nonMembers.length === 0 && (
              <MenuItem disabled>Everyone is already a member</MenuItem>
            )}
            {nonMembers.map((u) => (
              <MenuItem key={u._id} value={u._id}>
                {u.name} · {u.role}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setMemberDialog(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={addMember} disabled={!newMember}>
            Add member
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(confirm)} onClose={() => setConfirm(null)}
        maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontFamily: '"Bricolage Grotesque Variable"', fontWeight: 700 }}>
          Confirm deletion
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            {confirm?.type === 'project'
              ? 'This will permanently delete the project and all of its tasks. This cannot be undone.'
              : 'This task will be permanently deleted.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setConfirm(null)} color="inherit">Cancel</Button>
          <Button
            variant="contained" color="error"
            onClick={() =>
              confirm.type === 'project' ? deleteProject() : deleteTask(confirm.task)
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
