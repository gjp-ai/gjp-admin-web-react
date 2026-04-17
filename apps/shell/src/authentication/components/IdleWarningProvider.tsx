import React from 'react';
import { useIdleTimeout } from '../hooks/useIdleTimeout';
import { IdleWarningDialog } from './IdleWarningDialog';

/**
 * Drop-in provider that adds idle-timeout security to the application.
 *
 * Place this once inside the authenticated layout (AppRoutes) and it will:
 * - Monitor user activity events
 * - Show IdleWarningDialog after VITE_IDLE_TIMEOUT_MINUTES of inactivity
 * - Auto-logout after VITE_IDLE_WARNING_MINUTES countdown if no response
 *
 * Configuration:
 *   VITE_IDLE_TIMEOUT_MINUTES  (default: 15)
 *   VITE_IDLE_WARNING_MINUTES  (default: 2)
 */
export const IdleWarningProvider: React.FC = () => {
  const {
    showWarning,
    secondsRemaining,
    totalWarningSeconds,
    idleTimeoutMinutes,
    onStayLoggedIn,
    onLogoutNow,
  } = useIdleTimeout();

  return (
    <IdleWarningDialog
      open={showWarning}
      secondsRemaining={secondsRemaining}
      totalSeconds={totalWarningSeconds}
      idleTimeoutMinutes={idleTimeoutMinutes}
      onStayLoggedIn={onStayLoggedIn}
      onLogoutNow={onLogoutNow}
    />
  );
};

export default IdleWarningProvider;
