import React from 'react';
import { Car, Home, Heart, Laptop, Download, LifeBuoy, Check } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import type { ActivePolicy } from '../types/dashboard.types';

const BRANCH_ICONS = {
  automotor: Car,
  hogar: Home,
  vida: Heart,
  tecnologia: Laptop,
};

interface PolicyCardProps {
  policy: ActivePolicy;
  onDownloadCert: (policy: ActivePolicy) => void;
  onRequestAssistance: (policy: ActivePolicy) => void;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({
  policy,
  onDownloadCert,
  onRequestAssistance,
}) => {
  const BranchIcon = BRANCH_ICONS[policy.branch] || Car;

  return (
    <Card
      variant="white"
      className="p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header row: Branch tag & Status badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#006e2f] to-[#22c55e] text-white flex items-center justify-center shadow-sm">
              <BranchIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-title text-base sm:text-lg font-bold text-[#0b1c30]">
                {policy.title}
              </h3>
              <p className="font-body text-xs text-gray-500">
                Póliza N° {policy.policyNumber}
                {policy.vehiclePlate && (
                  <span className="ml-2 font-mono font-bold text-[#006e2f] bg-emerald-50 px-2 py-0.5 rounded">
                    {policy.vehiclePlate}
                  </span>
                )}
              </p>
            </div>
          </div>

          <Badge variant="primary" className="!bg-emerald-50 !text-[#006e2f] !border-emerald-200">
            {policy.status}
          </Badge>
        </div>

        {/* Feature bullets */}
        <div className="space-y-2 mb-6 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
          {policy.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-body text-gray-600">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#006e2f] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer row: Premium, validity, and action buttons */}
      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-subtitle text-gray-400 block">Cuota mensual</span>
          <span className="font-title text-lg font-black text-[#006e2f]">
            {policy.monthlyPremium}
          </span>
          <span className="text-[11px] text-gray-400 ml-1.5">hasta {policy.validUntil}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownloadCert(policy)}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="!rounded-xl text-xs flex-1 sm:flex-initial"
          >
            Carnet Digital
          </Button>

          {policy.branch === 'automotor' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onRequestAssistance(policy)}
              leftIcon={<LifeBuoy className="w-3.5 h-3.5" />}
              className="!rounded-xl text-xs flex-1 sm:flex-initial"
            >
              Pedir Grúa
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
