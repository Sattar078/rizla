/**
 * PWA Utility Functions for RIZLA BOUTIQUE
 * Detects installation status across all modern platforms and browsers.
 */

export const isPWAInstalled = () => {
  if (typeof window === 'undefined') return false;

  // 1. iOS Safari standalone mode
  if (window.navigator && window.navigator.standalone === true) {
    return true;
  }

  // 2. CSS display-mode media query checks
  const displayModes = [
    'standalone',
    'minimal-ui',
    'fullscreen',
    'window-controls-overlay',
  ];

  for (const mode of displayModes) {
    try {
      if (window.matchMedia && window.matchMedia(`(display-mode: ${mode})`).matches) {
        return true;
      }
    } catch {
      // Ignore media query evaluation errors on legacy environments
    }
  }

  // 3. Android Trusted Web Activity (TWA) or WebAPK referrer check
  if (
    typeof document !== 'undefined' &&
    document.referrer &&
    document.referrer.startsWith('android-app://')
  ) {
    return true;
  }

  return false;
};

/**
 * Asynchronously verifies if related application is installed
 * via navigator.getInstalledRelatedApps (supported in Chromium browsers).
 */
export const checkInstalledRelatedApps = async () => {
  if (typeof navigator !== 'undefined' && 'getInstalledRelatedApps' in navigator) {
    try {
      const relatedApps = await navigator.getInstalledRelatedApps();
      return Array.isArray(relatedApps) && relatedApps.length > 0;
    } catch {
      // getInstalledRelatedApps might fail if not in secure context or origin mismatch
    }
  }
  return false;
};

/**
 * Detects if the current user agent is iOS Safari / WebKit.
 */
export const isIOS = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isAppleDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isMacTouch =
    navigator.platform === 'MacIntel' &&
    typeof navigator.maxTouchPoints === 'number' &&
    navigator.maxTouchPoints > 1;

  return isAppleDevice || isMacTouch;
};
