import React from 'react';
import { AlertTriangle, Navigation, PlusCircle, ArrowUpRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: 'claim' | 'tow' | 'quote';
  action: () => void;
}

interface QuickActionCardProps {
  item: ActionItem;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ item }) => {
  const getIcon = () => {
    switch (item.icon) {
      case 'claim':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'tow':
        return <Navigation className="w-5 h-5 text-[#006e2f]" />;
      case 'quote':
        return <PlusCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgClass = () => {
    switch (item.icon) {
      case 'claim':
        return 'bg-amber-50 group-hover:bg-amber-100/70 border-amber-200/50';
      case 'tow':
        return 'bg-emerald-50 group-hover:bg-emerald-100/70 border-emerald-200/50';
      case 'quote':
        return 'bg-blue-50 group-hover:bg-blue-100/70 border-blue-200/50';
    }
  };

  return (
    <Card
      variant="white"
      onClick={item.action}
      className="p-5 rounded-2xl border border-gray-200/70 hover:border-[#22c55e]/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getBgClass()} transition-colors`}>
            {getIcon()}
          </div>
          <span className="text-[10px] font-subtitle font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 group-hover:bg-[#006e2f] group-hover:text-white transition-colors">
            {item.badge}
          </span>
        </div>

        <h4 className="font-title text-sm sm:text-base font-bold text-[#0b1c30] mb-1 group-hover:text-[#006e2f] transition-colors flex items-center justify-between">
          <span>{item.title}</span>
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#006e2f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </h4>

        <p className="font-body text-xs text-gray-500 line-clamp-2">
          {item.description}
        </p>
      </div>
    </Card>
  );
};
