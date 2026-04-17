import { useEffect, useRef, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../core/hooks/useRedux';
import { selectIsAuthenticated, logoutUser } from '../store/authSlice';
import { shellAuthService } from '../services/shell-auth-service';
import { getCookie } from '../../../../shared-lib/src/core/cookie';
import { APP_CONFIG } from '../../../../shared-lib/src/core/config';

/**
 * Decodes a JWT and returns the expiry timestamp in milliseconds.
 * Returns null if the token cannot be decoded.
 */
function getJwtExpiryMs(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (typeof payload.exp !== 'number') return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

/**
 * Hook that proactively refreshes the JWT access token before it expires.
 *
 * Strategy:
 * - After each successful login / token refresh, decode the new JWT's `exp` claim.
 * - Schedule a timer to fire TOKEN_EXPIRY_BUFFER seconds before expiry.
 * - When the timer fires, call shellAuthService.refreshToken(), then reschedule.
 * - On any refresh failure, dispatch logoutUser() and redirect to login.
 *
 * The timer is cleared when the user is not authenticated.
 */
export const useProactiveTokenRefresh = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAuthenticatedRef = useRef(isAuthenticated);
  const dispatchRef = useRef(dispatch);

  // Keep refs in sync so timer callbacks always use latest values
  useEffect(() => { isAuthenticatedRef.current = isAuthenticated; }, [isAuthenticated]);
  useEffect(() => { dispatchRef.current = dispatch; }, [dispatch]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // scheduleRefresh is defined before performRefresh using a stable ref
  const scheduleRefreshRef = useRef<() => void>(() => {});
  const performRefreshRef = useRef<() => Promise<void>>(async () => {});

  scheduleRefreshRef.current = () => {
    clearTimer();
    if (!isAuthenticatedRef.current) return;

    const accessToken = getCookie(APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY);
    if (!accessToken) return;

    const expiryMs = getJwtExpiryMs(accessToken);
    if (expiryMs === null) {
      console.warn('[ProactiveTokenRefresh] Could not decode JWT expiry — skipping proactive refresh.');
      return;
    }

    const bufferMs = APP_CONFIG.AUTH.TOKEN_EXPIRY_BUFFER * 1000;
    const delayMs = expiryMs - Date.now() - bufferMs;

    if (delayMs <= 0) {
      console.info('[ProactiveTokenRefresh] Token already within buffer zone, refreshing now.');
      performRefreshRef.current();
      return;
    }

    const expiresInSec = Math.round((expiryMs - Date.now()) / 1000);
    const refreshInSec = Math.round(delayMs / 1000);
    console.info(
      `[ProactiveTokenRefresh] Token expires in ${expiresInSec}s. ` +
      `Scheduling refresh in ${refreshInSec}s (buffer: ${APP_CONFIG.AUTH.TOKEN_EXPIRY_BUFFER}s).`
    );

    timerRef.current = setTimeout(() => {
      performRefreshRef.current();
    }, delayMs);
  };

  performRefreshRef.current = async () => {
    if (!isAuthenticatedRef.current) return;

    try {
      console.info('[ProactiveTokenRefresh] Refreshing access token proactively…');
      await shellAuthService.refreshToken();
      console.info('[ProactiveTokenRefresh] Token refreshed successfully.');
      // Reschedule for the new token
      scheduleRefreshRef.current();
    } catch (error) {
      console.error('[ProactiveTokenRefresh] Token refresh failed, logging out:', error);
      clearTimer();
      dispatchRef.current(logoutUser());
    }
  };

  // Start / restart the timer whenever authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      scheduleRefreshRef.current();
    } else {
      clearTimer();
    }

    return () => {
      clearTimer();
    };
  }, [isAuthenticated, clearTimer]);
};

export default useProactiveTokenRefresh;
