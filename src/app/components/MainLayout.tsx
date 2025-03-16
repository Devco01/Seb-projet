'use client';

import Sidebar from './Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-5 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
        <footer className="mt-10 pt-4 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FacturePro - Peinture en bâtiment
          </p>
        </footer>
      </main>
    </div>
  );
} 