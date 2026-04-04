import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem('kaffeegraf-cookie-consent');
    if (!savedConsent) {
      setIsVisible(true);
    } else {
      // Apply saved consent
      const saved = JSON.parse(savedConsent);
      setConsent(saved);
      applyConsent(saved);
    }

    // Expose CookieConsent API globally
    (window as any).CookieConsent = {
      show: () => {
        setIsVisible(true);
        setShowSettings(true);
      },
      hide: () => setIsVisible(false),
    };
  }, []);

  const applyConsent = (consentSettings: CookieConsent) => {
    // Load Meta Pixel if marketing consent given
    if (consentSettings.marketing) {
      loadMetaPixel();
    }

    // Load Google Analytics if analytics consent given
    if (consentSettings.analytics) {
      loadGoogleAnalytics();
    }
  };

  const loadMetaPixel = () => {
    if ((window as any).fbq) return; // Already loaded

    (window as any).fbq = function () {
      (window as any).fbq.callMethod
        ? (window as any).fbq.callMethod.apply((window as any).fbq, arguments)
        : (window as any).fbq.queue.push(arguments);
    };

    (window as any).fbq.push = (window as any).fbq;
    (window as any).fbq.loaded = true;
    (window as any).fbq.version = '2.0';
    (window as any).fbq.queue = [];

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    // Initialize pixel
    const pixelId = import.meta.env.VITE_META_PIXEL_ID;
    if (pixelId) {
      (window as any).fbq('init', pixelId);
      (window as any).fbq('track', 'PageView');
    }
  };

  const loadGoogleAnalytics = () => {
    if ((window as any).gtag) return; // Already loaded

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID || ''}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    gtag('js', new Date());
    gtag('config', import.meta.env.VITE_GA_ID || '');
  };

  const handleAcceptAll = () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setConsent(newConsent);
    localStorage.setItem('kaffeegraf-cookie-consent', JSON.stringify(newConsent));
    applyConsent(newConsent);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setConsent(newConsent);
    localStorage.setItem('kaffeegraf-cookie-consent', JSON.stringify(newConsent));
    setIsVisible(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('kaffeegraf-cookie-consent', JSON.stringify(consent));
    applyConsent(consent);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setIsVisible(false)}
      />

      {/* Banner */}
      <div className="relative bg-background border border-border rounded-lg shadow-lg p-6 md:p-8 max-w-md md:max-w-lg mx-4 md:mx-0">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {!showSettings ? (
          <>
            {/* Main Banner */}
            <h3 className="text-lg font-semibold mb-3">Wir schätzen deine Privatsphäre</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Wir verwenden Cookies, um dein Surferlebnis zu verbessern, personalisierte Werbung oder Inhalte bereitzustellen und unseren Datenverkehr zu analysieren. Durch Klicken auf „Alle akzeptieren" stimmst du der Verwendung von Cookies zu.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Lese mehr in unserer{' '}
              <a
                href="https://kaffeegraf.coffee/datenschutzerklaerung/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Datenschutzerklärung
              </a>
            </p>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="flex-1"
              >
                Nur notwendige
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettings(true)}
                className="flex-1"
              >
                Einstellungen
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="flex-1"
              >
                Alle akzeptieren
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Settings Panel */}
            <h3 className="text-lg font-semibold mb-4">Cookie-Einstellungen</h3>

            <div className="space-y-4 mb-6">
              {/* Necessary */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Notwendig</p>
                  <p className="text-xs text-muted-foreground">Immer aktiv</p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-4 h-4"
                />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Analytik</p>
                  <p className="text-xs text-muted-foreground">Google Analytics</p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.analytics}
                  onChange={(e) =>
                    setConsent({ ...consent, analytics: e.target.checked })
                  }
                  className="w-4 h-4"
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Marketing</p>
                  <p className="text-xs text-muted-foreground">Meta Pixel</p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.marketing}
                  onChange={(e) =>
                    setConsent({ ...consent, marketing: e.target.checked })
                  }
                  className="w-4 h-4"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="flex-1"
              >
                Zurück
              </Button>
              <Button
                onClick={handleSaveSettings}
                className="flex-1"
              >
                Einstellungen speichern
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
