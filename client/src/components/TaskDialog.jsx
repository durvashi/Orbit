import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Button, MenuItem, Box, Grid,
} from '@mui/material';

const empty = {
  title: '', description: '', status: 'todo', priority: 'medium',
  assignee: '', dueDate: '',
};

export default function TaskDialog({
  open, onClose, onSave, task, members = [], saving,
}) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        assignee: task.assignee?._id || task.assignee || '',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(empty);
    }
  }, [task, open]);

  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = () => {
    onSave({
      ...form,
      assignee: form.assignee || null,
      dueDate: form.dueDate || null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontFamily: '"Bricolage Grotesque Variable"', fontWeight: 700 }}>
        {task ? 'Edit task' : 'New task'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            fullWidth label="Title" required sx={{ mb: 2.5 }}
            value={form.title} onChange={handle('title')}
          />
          <TextField
            fullWidth label="Description" multiline rows={3} sx={{ mb: 2.5 }}
            value={form.description} onChange={handle('description')}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                select fullWidth label="Status"
                value={form.status} onChange={handle('status')}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select fullWidth label="Priority"
                value={form.priority} onChange={handle('priority')}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select fullWidth label="Assignee"
                value={form.assignee} onChange={handle('assignee')}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {members.map((m) => (
                  <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth type="date" label="Due date"
                InputLabelProps={{ shrink: true }}
                value={form.dueDate} onChange={handle('dueDate')}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button
          variant="contained" onClick={submit}
          disabled={!form.title.trim() || saving}
        >
          {task ? 'Save changes' : 'Create task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
