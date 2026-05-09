'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageviewTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    // Skip admin and studio pages
    if (pathname.startsWith('/admin') || pathname.startsWith('/studio')) return;
    // Avoid double-tracking the same path on re-renders
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
      }),
    }).catch(() => {}); // Silently fail — never block the user experience
  }, [pathname]);

  return null;
}
