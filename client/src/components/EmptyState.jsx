import { Box, Typography } from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';

export default function EmptyState({ title, subtitle, icon, action }) {
  return (
    <Box
      sx={{
        textAlign: 'center', py: 8, px: 3,
        border: '2px dashed', borderColor: 'divider', borderRadius: 4,
        bgcolor: 'background.paper',
        animation: 'scaleIn .4s ease both',
      }}
    >
      <Box
        sx={{
          width: 64, height: 64, borderRadius: '50%', mx: 'auto', mb: 2,
          display: 'grid', placeItems: 'center',
          bgcolor: 'rgba(79,70,229,0.10)', color: 'primary.main',
        }}
      >
        {icon || <InboxRoundedIcon sx={{ fontSize: 30 }} />}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 0.5, mb: action ? 3 : 0 }}>
          {subtitle}
        </Typography>
      )}
      {action}
    </Box>
  );
}
