import Link from 'next/link';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  linkTo?: string;
}

export default function DashboardCard({ title, value, icon, linkTo }: DashboardCardProps) {  
  const content = (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-700 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-gray-100">
          {icon}
        </div>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="block">
        {content}
      </Link>
    );
  }
  
  return content;
} 