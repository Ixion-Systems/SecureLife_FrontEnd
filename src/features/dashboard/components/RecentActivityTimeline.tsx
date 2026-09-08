import React from 'react';
import { CheckCircle2, Clock, FileCheck, ShieldAlert } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { RecentActivityItem } from '../types/dashboard.types';

const TYPE_ICONS = {
  payment: CheckCircle2,
  claim: ShieldAlert,
  policy: FileCheck,
  assistance: Clock,
};

interface RecentActivityTimelineProps {
  items: RecentActivityItem[];
}

export const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({ items }) => {
  return (
    <Card
      variant="white"
      className="p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-title text-base sm:text-lg font-bold text-[#0b1c30]">
            Actividad y Novedades Recientes
          </h3>
          <p className="font-body text-xs text-gray-500">
            Registro cronológico de gestiones, pagos y peritajes
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mb-2.5">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-title text-sm font-bold text-[#0b1c30] mb-0.5">
            Sin registro de actividad
          </h4>
          <p className="font-body text-xs text-gray-400">
            Las novedades sobre emisiones, pagos y trámites aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {items.map((activity) => {
            const Icon = TYPE_ICONS[activity.type] || CheckCircle2;

            return (
              <div key={activity.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5 group">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#006e2f] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-subtitle font-bold text-[#0b1c30] truncate">
                      {activity.title}
                    </h4>
                    <span className="text-[11px] font-body text-gray-400 shrink-0">
                      {activity.date}
                    </span>
                  </div>
                  <p className="text-xs font-body text-gray-600 mt-0.5 line-clamp-1">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
