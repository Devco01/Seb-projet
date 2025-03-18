'use client';

import MainLayout from '../components/MainLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("DashboardLayout rendu - vérifie conflit avec le MainLayout dans Dashboard");
  
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
} 