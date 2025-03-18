'use client';

import MainLayout from '../components/MainLayout';

export default function DevisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("DevisLayout rendu");
  
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
} 