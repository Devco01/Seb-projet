'use client';

import React from 'react';
import { ResponsiveContainer } from './ResponsiveContainer';
import { cn } from '../../../lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Composant de mise en page principal qui utilise le conteneur responsive
 * pour garantir une expérience utilisateur cohérente sur tous les appareils
 */
export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <main className={cn('py-6 px-4 md:py-8 min-h-screen', className)}>
      <ResponsiveContainer>
        {children}
      </ResponsiveContainer>
    </main>
  );
} 