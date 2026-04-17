import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../core/hooks/useRedux';
import { selectIsAuthenticated, logoutUser } from '../store/authSlice';
import { APP_CONFIG } from '../../../../shared-lib/src/core/config';

// Derive constants from central config (env vars already parsed there)
const IDLE_TIMEOUT_MS = APP_CONFIG.AUTH.IDLE_TIMEOUT_MINUTES * 60 * 1000;
const WARNING_DURATION_MS = APP_CONFIG.AUTH.IDLE_WARNING_MINUTES * 60 * 1000;

// Activity events that reset the idle timer
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'click',
  'wheel',
];

/**
 * Hook that implements a 2-stage idle timeout for security.
 *
 * Stage 1: After IDLE_TIMEOUT_MS of inactivity, show a warning dialog
 *          with a countdown (WARNING_DURATION_MS).
 * Stage 2: If the user doesn't respond before the countdown ends,
 *          force logout.
 *
 * Any user activity during Stage 1 instantly dismisses the warning and
 * resets the idle timer back to IDLE_TIMEOUT_MS.
 *
 * Configuration via env vars:
 *   VITE_IDLE_TIMEOUT_MINUTES  (default: 15)
 *   VITE_IDLE_WARNING_MINUTES  (default: 2)
 */
export const useIdleTimeout = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(WARNING_DURATION_MS / 1000);

  // Refs for timers — avoids stale closures
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAuthenticatedRef = useRef(isAuthenticated);
  const dispatchRef = useRef(dispatch);

  useEffect(() => { isAuthenticatedRef.current = isAuthenticated; }, [isAuthenticated]);
  useEffect(() => { dispatchRef.current = dispatch; }, [dispatch]);

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== null) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const clearCountdown = useCallback(() => {
    if (countdownTimerRef.current !== null) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  // ─── Force logout ─────────────────────────────────────────────────────────

  const forceLogout = useCallback(() => {
    clearIdleTimer();
    clearCountdown();
    setShowWarning(false);
    console.info('[IdleTimeout] Auto-logging out due to inactivity.');
    dispatchRef.current(logoutUser());
  }, [clearIdleTimer, clearCountdown]);

  // ─── Start countdown (Stage 2) ────────────────────────────────────────────

  const startCountdown = useCallback(() => {
    clearCountdown();
    setSecondsRemaining(WARNING_DURATION_MS / 1000);

    let remaining = WARNING_DURATION_MS / 1000;
    countdownTimerRef.current = setInterval(() => {
      remaining -= 1;
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        forceLogout();
      }
    }, 1000);
  }, [clearCountdown, forceLogout]);

  // ─── Schedule idle warning (Stage 1) ─────────────────────────────────────

  const scheduleIdleWarning = useCallback(() => {
    clearIdleTimer();
    if (!isAuthenticatedRef.current) return;

    idleTimerRef.current = setTimeout(() => {
      console.info('[IdleTimeout] User idle, showing warning dialog.');
      setShowWarning(true);
      startCountdown();
    }, IDLE_TIMEOUT_MS);
  }, [clearIdleTimer, startCountdown]);

  // ─── Handle user activity ─────────────────────────────────────────────────

  const handleActivity = useCallback(() => {
    if (!isAuthenticatedRef.current) return;
    // If warning is visible, dismiss it silently — user just moved
    if (showWarning) {
      setShowWarning(false);
      clearCountdown();
    }
    scheduleIdleWarning();
  }, [showWarning, scheduleIdleWarning, clearCountdown]);

  // ─── Public action handlers for the dialog ────────────────────────────────

  /** User clicked "Stay Logged In" */
  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    clearCountdown();
    scheduleIdleWarning();
    console.info('[IdleTimeout] User chose to stay logged in — resetting idle timer.');
  }, [clearCountdown, scheduleIdleWarning]);

  /** User clicked "Logout Now" */
  const handleLogoutNow = useCallback(() => {
    forceLogout();
  }, [forceLogout]);

  // ─── Effect: attach / detach event listeners ──────────────────────────────

  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in — clean up everything
      clearIdleTimer();
      clearCountdown();
      setShowWarning(false);
      return;
    }

    // Start fresh idle timer
    scheduleIdleWarning();

    // Use a stable reference for the listener so we can remove it later
    const activityHandler = () => handleActivity();

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, activityHandler, { passive: true });
    });

    return () => {
      clearIdleTimer();
      clearCountdown();
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, activityHandler);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return {
    showWarning,
    secondsRemaining,
    totalWarningSeconds: WARNING_DURATION_MS / 1000,
    idleTimeoutMinutes: IDLE_TIMEOUT_MS / 60000,
    warningMinutes: WARNING_DURATION_MS / 60000,
    onStayLoggedIn: handleStayLoggedIn,
    onLogoutNow: handleLogoutNow,
  };
};

export default useIdleTimeout;
