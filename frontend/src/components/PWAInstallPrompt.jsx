import React, { useState, useEffect, useCallback } from 'react';
import { isPWAInstalled, checkInstalledRelatedApps, isIOS } from '../utils/pwa';

const PWAInstallPrompt = () => {
  const [isInstalled, setIsInstalled] = useState(() => isPWAInstalled());
  const [isDismissed, setIsDismissed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Check and re-evaluate installation state
  const reevaluateInstalledState = useCallback(async () => {
    if (isPWAInstalled()) {
      setIsInstalled(true);
      return;
    }

    const hasRelatedApp = await checkInstalledRelatedApps();
    if (hasRelatedApp) {
      setIsInstalled(true);
    }
  }, []);

  useEffect(() => {
    // Initial check
    reevaluateInstalledState();
    setIsIOSDevice(isIOS());

    // 1. Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // 2. Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowIOSInstructions(false);
    };

    // 3. Listen for window visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        reevaluateInstalledState();
      }
    };

    // 4. Listen for window focus
    const handleFocus = () => {
      reevaluateInstalledState();
    };

    // 5. Listen for display-mode media query change
    let mediaQueryList;
    const handleMediaChange = (e) => {
      if (e.matches) {
        setIsInstalled(true);
      } else {
        reevaluateInstalledState();
      }
    };

    try {
      mediaQueryList = window.matchMedia('(display-mode: standalone)');
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', handleMediaChange);
      } else if (mediaQueryList.addListener) {
        mediaQueryList.addListener(handleMediaChange);
      }
    } catch {
      // Ignore fallback on environments without matchMedia
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDismissed(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
      if (mediaQueryList) {
        if (mediaQueryList.removeEventListener) {
          mediaQueryList.removeEventListener('change', handleMediaChange);
        } else if (mediaQueryList.removeListener) {
          mediaQueryList.removeListener(handleMediaChange);
        }
      }
    };
  }, [reevaluateInstalledState]);

  // NEVER show if already installed or dismissed for this session
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleClose = () => {
    setIsDismissed(true);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error('Error invoking native PWA install prompt:', err);
      } finally {
        setIsInstalling(false);
      }
    } else if (isIOSDevice) {
      setShowIOSInstructions(true);
    } else {
      // Fallback for browsers that support PWA installation through browser UI
      alert('To install RIZLA BOUTIQUE, open your browser menu and choose "Install RIZLA BOUTIQUE" or "Add to Home screen".');
    }
  };

  return (
    <aside
      role="dialog"
      aria-labelledby="pwa-prompt-title"
      aria-describedby="pwa-prompt-desc"
      className="fixed z-50 bottom-20 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:w-96 bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-2xl rounded-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="flex items-start gap-3">
        {/* Brand Hanger Emblem */}
        <div className="w-12 h-12 rounded-xl bg-primary-900 flex items-center justify-center shrink-0 shadow-md">
          <svg
            className="w-7 h-7 text-[#fbfaf7]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2v4M12 6c-3 0-5.5 2-6.5 4.5l-4 9.5h21l-4-9.5C17.5 8 15 6 12 6z" />
            <path d="M12 6a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between">
            <h3 id="pwa-prompt-title" className="font-semibold text-gray-900 text-sm leading-tight">
              Install RIZLA BOUTIQUE
            </h3>
            <button
              onClick={handleClose}
              className="p-1 -mr-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-700"
              aria-label="Close installation prompt"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <p id="pwa-prompt-desc" className="text-xs text-gray-600 mt-1 leading-snug">
            Install our app for a faster shopping experience.
          </p>

          {/* iOS Safari Step-by-Step Instructions */}
          {showIOSInstructions && (
            <div className="mt-2.5 p-2.5 bg-primary-50/80 rounded-xl border border-primary-100 text-[11px] text-primary-950 space-y-1">
              <p className="font-semibold">How to install on iOS Safari:</p>
              <p className="flex items-center gap-1.5">
                <span>1. Tap the</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white shadow-xs border border-gray-200 font-medium">
                  Share
                  <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </span>
                <span>button.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span>2. Scroll down &amp; tap</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white shadow-xs border border-gray-200 font-medium">
                  Add to Home Screen
                </span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="flex-1 px-3.5 py-1.5 bg-primary-900 hover:bg-primary-800 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-primary-700 flex items-center justify-center gap-1.5 disabled:opacity-60"
              aria-label="Install RIZLA BOUTIQUE application"
            >
              {isInstalling ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Installing...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Install</span>
                </>
              )}
            </button>

            <button
              onClick={handleClose}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PWAInstallPrompt;
