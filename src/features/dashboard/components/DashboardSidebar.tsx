import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  FileText,
  AlertTriangle,
  LifeBuoy,
  Award,
  LogOut,
  ChevronRight,
  User,
} from 'lucide-react';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import type { DashboardTab, UserSummary } from '../types/dashboard.types';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  user: UserSummary;
  activePoliciesCount?: number;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onSelectTab,
  user,
  activePoliciesCount = 0,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: NavItem[] = [
    { id: 'inicio', label: 'Inicio / Dashboard', icon: LayoutDashboard },
    {
      id: 'polizas',
      label: 'Mis Pólizas',
      icon: ShieldCheck,
      badge: activePoliciesCount > 0 ? String(activePoliciesCount) : undefined,
      badgeColor: 'bg-[#22c55e] text-[#003817]',
    },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: FileText },
    { id: 'siniestros', label: 'Radicar Siniestro', icon: AlertTriangle },
    {
      id: 'asistencia',
      label: 'Auxilio & Asistencia 24/7',
      icon: LifeBuoy,
      badge: activePoliciesCount > 0 ? 'SOS' : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'certificados', label: 'Certificados Digitales', icon: Award },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } bg-gradient-to-b from-[#003817] via-[#004b1e] to-[#00240d] text-white border-r border-[#22c55e]/20 shadow-2xl`}
      >
        {/* Top Section: Brand Logo */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo variant="white" className="h-9 w-auto" alt="SecureLife" />
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              ✕
            </button>
          )}
        </div>

        {/* Middle Navigation Menu */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-subtitle font-bold tracking-wider uppercase text-emerald-300/60">
            Navegación Principal
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-subtitle font-medium transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#22c55e]/25 to-[#22c55e]/10 border border-[#22c55e]/40 text-white shadow-[0_0_18px_rgba(34,197,94,0.25)]'
                    : 'text-emerald-100/70 hover:text-white hover:bg-white/10 hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-[#22c55e]' : 'text-emerald-300/70'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#22c55e]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Section: User Profile & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#22c55e] to-[#4ade80] text-[#003817] flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('') || <User className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-subtitle font-bold text-white truncate">
                  {user.name}
                </p>
                <p className="text-[11px] font-body text-emerald-300/80 truncate">
                  {user.planLevel}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Cerrar Sesión"
              className="p-2 text-emerald-300/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
