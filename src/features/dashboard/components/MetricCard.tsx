import React from 'react';
import { ShieldCheck, CreditCard, AlertCircle, Award } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { MetricItem } from '../types/dashboard.types';

const ICON_MAP = {
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Award,
};

interface MetricCardProps {
  item: MetricItem;
}

export const MetricCard: React.FC<MetricCardProps> = ({ item }) => {
  const Icon = ICON_MAP[item.iconName] || ShieldCheck;

  return (
    <Card
      variant="white"
      className="p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#22c55e]/30 transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-subtitle font-medium text-gray-500 uppercase tracking-wider">
          {item.title}
        </span>
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#006e2f] flex items-center justify-center group-hover:bg-[#006e2f] group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="font-title text-2xl sm:text-3xl font-black tracking-tight text-[#0b1c30]">
          {item.value}
        </span>
        <span
          className={`text-[11px] font-subtitle font-semibold px-2 py-0.5 rounded-full ${
            item.isPositive
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {item.changeText}
        </span>
      </div>
    </Card>
  );
};
