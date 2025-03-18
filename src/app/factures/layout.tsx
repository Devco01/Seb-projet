'use client';

import MainLayout from '../components/MainLayout';

export default function FacturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("FacturesLayout rendu");
  
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
} 