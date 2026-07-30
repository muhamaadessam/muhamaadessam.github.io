'use client';

import { useEffect } from 'react';
import { trackVisitor } from '@/lib/services';

export default function VisitorTracker() {
  useEffect(() => {
    trackVisitor();
  }, []);

  return null;
}
