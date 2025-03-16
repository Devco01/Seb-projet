import { IconType } from 'react-icons';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  color: string;
}

export default function DashboardCard({ title, value, icon: Icon, color }: DashboardCardProps) {
  // Extraire la couleur de base à partir de la classe border
  const baseColor = color.replace('border-', '');
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-5 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-700 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${baseColor}-100`}>
          <Icon className={`text-${baseColor}-500`} size={20} />
        </div>
      </div>
    </div>
  );
} 