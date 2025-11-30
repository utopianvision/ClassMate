import React from 'react';
import { Card } from './Card';
import { BoxIcon } from 'lucide-react';
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: BoxIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  color: string;
}
export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color
}: StatsCardProps) {
  return <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && <p className={`text-sm mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>;
}