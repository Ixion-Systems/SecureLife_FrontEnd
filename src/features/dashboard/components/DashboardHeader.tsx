import React from 'react';
import { Menu, Search, Bell, PhoneCall, Shield, PlusCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface DashboardHeaderProps {
  onOpenMobileSidebar: () => void;
  tabTitle: string;
  onEmergencyClick: () => void;
  onNewPolicyClick?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenMobileSidebar,
  tabTitle,
  onEmergencyClick,
  onNewPolicyClick,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full h-16 sm:h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-[#006e2f] hover:bg-emerald-50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-subtitle">
          <span className="text-gray-400 hidden sm:inline">Portal Cliente</span>
          <span className="text-gray-300 hidden sm:inline">/</span>
          <span className="font-bold text-[#0b1c30] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#006e2f]" />
            {tabTitle}
          </span>
        </div>
      </div>

      {/* Middle: Search bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar póliza, patente, número de siniestro..."
            className="w-full pl-9 pr-4 py-2 text-xs font-body bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-[#006e2f] focus:bg-white focus:ring-2 focus:ring-[#22c55e]/20 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right: Notifications & Quick Emergency Button */}
      <div className="flex items-center gap-3">
        <button className="relative p-2.5 rounded-xl text-gray-600 hover:text-[#006e2f] hover:bg-emerald-50 transition-colors cursor-pointer">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#22c55e] ring-2 ring-white animate-pulse" />
        </button>

        {onNewPolicyClick && (
          <Button
            variant="forest"
            size="sm"
            onClick={onNewPolicyClick}
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            className="!rounded-xl text-xs font-subtitle shadow-md shadow-[#004b1e]/15"
          >
            <span className="hidden md:inline">Contratar</span> Póliza
          </Button>
        )}

        <Button
          variant="primary"
          size="sm"
          onClick={onEmergencyClick}
          leftIcon={<PhoneCall className="w-3.5 h-3.5 animate-bounce" />}
          className="!rounded-xl text-xs font-subtitle shadow-md shadow-[#22c55e]/20"
        >
          <span className="hidden sm:inline">Asistencia</span> 24/7
        </Button>
      </div>
    </header>
  );
};
