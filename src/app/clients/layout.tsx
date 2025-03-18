'use client';

import MainLayout from '../components/MainLayout';

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("ClientsLayout rendu");
  
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
} 