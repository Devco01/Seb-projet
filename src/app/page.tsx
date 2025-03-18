"use client";

import { redirect } from 'next/navigation';
import MainLayout from './components/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <div className="hidden">
        {/* Redirection automatique vers le dashboard */}
        {typeof window !== "undefined" && redirect('/dashboard/')}
      </div>
    </MainLayout>
  );
} 