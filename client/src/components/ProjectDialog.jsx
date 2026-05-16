import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Button, Box, MenuItem, OutlinedInput, Select, Chip, InputLabel,
  FormControl,
} from '@mui/material';

const empty = { name: '', description: '', status: 'active', members: [] };

export default function ProjectDialog({
  open, onClose, onSave, project, users = [], saving,
}) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'active',
        members: (project.members || []).map((m) => m._id || m),
      });
    } else {
      setForm(empty);
    }
  }, [project, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontFamily: '"Bricolage Grotesque Variable"', fontWeight: 700 }}>
        {project ? 'Edit project' : 'New project'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            fullWidth label="Project name" required sx={{ mb: 2.5 }}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            fullWidth label="Description" multiline rows={3} sx={{ mb: 2.5 }}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            select fullWidth label="Status" sx={{ mb: 2.5 }}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="on-hold">On Hold</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </TextField>

          <FormControl fullWidth size="small">
            <InputLabel>Team members</InputLabel>
            <Select
              multiple
              value={form.members}
              onChange={(e) => setForm({ ...form, members: e.target.value })}
              input={<OutlinedInput label="Team members" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const u = users.find((x) => x._id === id);
                    return <Chip key={id} size="small" label={u?.name || 'User'} />;
                  })}
                </Box>
              )}
            >
              {users.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  {u.name} · {u.role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSave(form)}
          disabled={!form.name.trim() || saving}
        >
          {project ? 'Save changes' : 'Create project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
