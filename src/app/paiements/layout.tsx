'use client';

import MainLayout from '../components/MainLayout';

export default function PaiementsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("PaiementsLayout rendu");
  
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
} 