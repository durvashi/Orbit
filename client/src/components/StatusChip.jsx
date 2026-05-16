import { Chip } from '@mui/material';

const STATUS = {
  todo: { label: 'To Do', bg: 'rgba(100,116,139,0.14)', fg: '#475569' },
  'in-progress': { label: 'In Progress', bg: 'rgba(217,119,6,0.16)', fg: '#b45309' },
  done: { label: 'Done', bg: 'rgba(5,150,105,0.16)', fg: '#047857' },
};

const PRIORITY = {
  low: { label: 'Low', bg: 'rgba(100,116,139,0.14)', fg: '#475569' },
  medium: { label: 'Medium', bg: 'rgba(79,70,229,0.14)', fg: '#4338ca' },
  high: { label: 'High', bg: 'rgba(225,29,72,0.14)', fg: '#be123c' },
};

export function StatusChip({ status, size = 'small' }) {
  const s = STATUS[status] || STATUS.todo;
  return (
    <Chip
      size={size}
      label={s.label}
      sx={{ bgcolor: s.bg, color: s.fg, fontWeight: 700 }}
    />
  );
}

export function PriorityChip({ priority, size = 'small' }) {
  const p = PRIORITY[priority] || PRIORITY.medium;
  return (
    <Chip
      size={size}
      label={p.label}
      variant="outlined"
      sx={{ borderColor: p.fg, color: p.fg, fontWeight: 700, bgcolor: p.bg }}
    />
  );
}
