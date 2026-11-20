'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { measureOpenAIAdsPageView } from '@/lib/openaiAds';

// Self-hosted, cookie-free pageview analytics. Logs one row per page load to
// the Firestore `pageviews` collection, with a coarse (city/country) location
// resolved from the visitor's IP. Ported from the legacy public/analytics.js.

function clip(v: string | null | undefined, max = 100) {
  return (v ?? '').slice(0, max);
}

type Geo = { country?: string; countryCode?: string; region?: string; city?: string };

function getVisitorId(): string {
  try {
    let vid = localStorage.getItem('sk_vid');
    if (!vid) {
      vid = 'v_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('sk_vid', vid);
    }
    return vid;
  } catch {
    return 'v_anon';
  }
}

function fromIpapi(g: any): Geo | null {
  if (!g || g.error) return null;
  if (!g.country_code && !g.country) return null;
  return { country: g.country_name || g.country, countryCode: g.country_code, region: g.region, city: g.city };
}

function fromIpwho(g: any): Geo | null {
  if (!g || g.success === false) return null;
  return { country: g.country, countryCode: g.country_code, region: g.region, city: g.city };
}

function tryProvider(url: string, parse: (g: any) => Geo | null): Promise<Geo> {
  return fetch(url, { cache: 'no-store' })
    .then((r) => r.json())
    .then((g) => {
      const geo = parse(g);
      if (!geo) throw new Error('bad geo response');
      return geo;
    });
}

function getGeo(): Promise<Geo> {
  try {
    const cached = sessionStorage.getItem('sk_geo');
    if (cached) return Promise.resolve(JSON.parse(cached));
  } catch {
    // ignore
  }
  return tryProvider('https://ipapi.co/json/', fromIpapi)
    .catch(() => tryProvider('https://ipwho.is/', fromIpwho))
    .then((geo) => {
      try {
        sessionStorage.setItem('sk_geo', JSON.stringify(geo));
      } catch {
        // ignore
      }
      return geo;
    })
    .catch(() => ({}));
}

export default function Analytics() {
  const pathname = usePathname();
  const lastMeasuredPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastMeasuredPath.current) return;
    lastMeasuredPath.current = pathname;
    if (!pathname.startsWith('/admin')) {
      measureOpenAIAdsPageView();
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;
    getGeo().then((geo) => {
      const db = getDb();
      addDoc(collection(db, 'pageviews'), {
        page: clip(pathname, 500),
        referrer: clip(document.referrer, 500),
        visitorId: clip(getVisitorId(), 64),
        country: clip(geo.country, 100),
        countryCode: clip(geo.countryCode, 8),
        region: clip(geo.region, 100),
        city: clip(geo.city, 100),
        timestamp: serverTimestamp(),
        userAgent: clip(navigator.userAgent, 200),
      }).catch(() => {
        // stay silent — never disrupt the page
      });
    });
  }, [pathname]);

  return null;
}
