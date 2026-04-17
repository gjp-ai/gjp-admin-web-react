import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import { AccessTime, ExitToApp, Shield } from '@mui/icons-material';

interface IdleWarningDialogProps {
  open: boolean;
  secondsRemaining: number;
  totalSeconds: number;
  idleTimeoutMinutes: number;
  onStayLoggedIn: () => void;
  onLogoutNow: () => void;
}

/**
 * Premium idle-timeout warning dialog.
 *
 * Shown when the user has been inactive for IDLE_TIMEOUT_MINUTES.
 * Displays a live countdown progress bar.
 * The user can either stay logged in or logout immediately.
 */
export const IdleWarningDialog: React.FC<IdleWarningDialogProps> = ({
  open,
  secondsRemaining,
  totalSeconds,
  idleTimeoutMinutes,
  onStayLoggedIn,
  onLogoutNow,
}) => {
  const progress = Math.max(0, (secondsRemaining / totalSeconds) * 100);
  const isUrgent = secondsRemaining <= 30;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      aria-labelledby="idle-warning-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            border: (theme) =>
              `1px solid ${isUrgent ? theme.palette.error.main : theme.palette.warning.main}`,
            boxShadow: (theme) =>
              isUrgent
                ? `0 8px 40px ${theme.palette.error.main}33`
                : `0 8px 40px ${theme.palette.warning.main}33`,
            transition: 'border-color 0.5s, box-shadow 0.5s',
          },
        },
      }}
    >
      {/* Countdown progress bar at the very top */}
      <LinearProgress
        variant="determinate"
        value={progress}
        color={isUrgent ? 'error' : 'warning'}
        sx={{
          height: 5,
          borderRadius: 0,
          '& .MuiLinearProgress-bar': {
            transition: 'transform 0.9s linear, background-color 0.5s',
          },
        }}
      />

      <DialogTitle id="idle-warning-title" sx={{ pt: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: isUrgent ? 'error.main' : 'warning.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.5s',
            }}
          >
            <AccessTime sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" component="span" sx={{ fontWeight: 700, display: 'block' }}>
              Session Timeout Warning
            </Typography>
            <Typography variant="caption" color="text.secondary">
              You have been inactive for {idleTimeoutMinutes} minute{idleTimeoutMinutes !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Chip
              label={formatTime(secondsRemaining)}
              color={isUrgent ? 'error' : 'warning'}
              size="small"
              icon={<AccessTime />}
              sx={{
                fontWeight: 700,
                fontSize: '0.85rem',
                minWidth: 80,
                animation: isUrgent ? 'pulse 1s ease-in-out infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.6 },
                },
              }}
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2, pt: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Your session will automatically expire in{' '}
          <strong>{formatTime(secondsRemaining)}</strong> due to inactivity.
          Click <strong>"Stay Logged In"</strong> to continue your session.
        </Typography>

        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: isUrgent ? 'error.50' : 'warning.50',
            border: (theme) =>
              `1px solid ${isUrgent ? theme.palette.error.light : theme.palette.warning.light}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transition: 'background-color 0.5s, border-color 0.5s',
          }}
        >
          <Shield
            fontSize="small"
            color={isUrgent ? 'error' : 'warning'}
          />
          <Typography variant="body2" color={isUrgent ? 'error.dark' : 'warning.dark'}>
            For your security, inactive sessions are automatically terminated.
            Any unsaved changes will be lost.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onLogoutNow}
          variant="outlined"
          color={isUrgent ? 'error' : 'warning'}
          size="large"
          startIcon={<ExitToApp />}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Logout Now
        </Button>
        <Button
          onClick={onStayLoggedIn}
          variant="contained"
          color={isUrgent ? 'error' : 'primary'}
          size="large"
          startIcon={<Shield />}
          autoFocus
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            minWidth: 160,
            transition: 'background-color 0.5s',
          }}
        >
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IdleWarningDialog;
