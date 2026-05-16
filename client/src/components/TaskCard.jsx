import {
  Card, CardContent, Typography, Box, Avatar, Tooltip, IconButton, Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import dayjs from 'dayjs';
import { StatusChip, PriorityChip } from './StatusChip';

export default function TaskCard({ task, onEdit, onDelete, canDelete, index = 0 }) {
  const theme = useTheme();
  const overdue =
    task.dueDate && task.status !== 'done' && dayjs(task.dueDate).isBefore(dayjs());

  return (
    <Card
      sx={{
        height: '100%',
        animation: 'fadeInUp .45s cubic-bezier(.2,.8,.2,1) both',
        animationDelay: `${0.05 * index}s`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 16px 32px -16px rgba(0,0,0,0.7)'
              : '0 14px 30px -14px rgba(28,27,34,0.3)',
          borderColor: 'primary.main',
        },
        borderLeft: overdue ? '3px solid' : '3px solid transparent',
        borderLeftColor: overdue ? 'error.main' : 'transparent',
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            <StatusChip status={task.status} />
            <PriorityChip priority={task.priority} />
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Tooltip title="Edit">
              <IconButton
                size="small" onClick={() => onEdit(task)}
                sx={{ transition: 'transform .15s ease', '&:hover': { transform: 'scale(1.15)' } }}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {canDelete && (
              <Tooltip title="Delete">
                <IconButton
                  size="small" onClick={() => onDelete(task)}
                  sx={{ color: 'error.main', transition: 'transform .15s ease', '&:hover': { transform: 'scale(1.15)' } }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 0.5 }}>
          {task.title}
        </Typography>
        {task.description && (
          <Typography
            variant="body2" color="text.secondary"
            sx={{
              mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {task.description}
          </Typography>
        )}

        {task.project?.name && (
          <Chip
            size="small"
            label={task.project.name}
            sx={{
              mb: 1.5,
              bgcolor: 'rgba(99,102,241,0.12)',
              color: 'primary.main', fontWeight: 600,
            }}
          />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          {task.assignee ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 26, height: 26, fontSize: 12, bgcolor: task.assignee.avatarColor }}>
                {task.assignee.name?.[0]?.toUpperCase()}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {task.assignee.name}
              </Typography>
            </Box>
          ) : (
            <Typography variant="caption" color="text.secondary">
              Unassigned
            </Typography>
          )}

          {task.dueDate && (
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.5,
                color: overdue ? 'error.main' : 'text.secondary',
              }}
            >
              {overdue && <EventBusyRoundedIcon sx={{ fontSize: 15 }} />}
              <Typography variant="caption" sx={{ fontWeight: overdue ? 700 : 500 }}>
                {dayjs(task.dueDate).format('MMM D')}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
