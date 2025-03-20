'use client';

import React from 'react';
import { cn } from '../../../lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
}

/**
 * Composant conteneur responsive qui s'adapte à différentes tailles d'écran
 * Utilise des classes Tailwind pour gérer la largeur maximale et les paddings
 */
export function ResponsiveContainer({
  children,
  className,
  fullWidth = false,
  noPadding = false
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        !fullWidth && 'mx-auto max-w-7xl',
        !noPadding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
} 