import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  trend?: 'up' | 'down';
}

const StatCard = ({ title, value, change, icon, trend }: StatCardProps) => {
  return (
    <Card className="bg-[#0A0404] border-ancient-gold/20 p-6 hover:border-ancient-gold/40 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-ancient-gold/60 text-sm font-order uppercase tracking-wider mb-2">
            {title}
          </p>
          <p className="text-ancient-gold text-3xl font-ancient tracking-wide mb-2">
            {value}
          </p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${
              trend === 'up' ? 'text-laurel-green' : 'text-vita-flame'
            }`}>
              {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="font-order tracking-wide">
                {Math.abs(change)}% from last month
              </span>
            </div>
          )}
        </div>
        <div className="text-ancient-gold/40 p-3 bg-ancient-gold/5 rounded-lg">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
