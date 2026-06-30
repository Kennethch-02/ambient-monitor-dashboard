import { useEffect } from 'react';

// Per-route <title>. The static index.html carries the canonical landing title for crawlers;
// this updates the title on client-side navigation between the SPA views.
export function useDocumentTitle(title) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}
