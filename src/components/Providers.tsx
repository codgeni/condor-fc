"use client";

import React from 'react';
import { ConfirmPosterProvider } from '@/components/ui/ConfirmPosterModal';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfirmPosterProvider>
      {children}
    </ConfirmPosterProvider>
  );
}
