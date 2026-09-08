import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  Shield,
  LifeBuoy,
  FileText,
  AlertTriangle,
  Award,
  PhoneCall,
  MapPin,
  CheckCircle,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { WelcomeHero } from '../components/WelcomeHero';
import { MetricCard } from '../components/MetricCard';
import { PolicyCard } from '../components/PolicyCard';
import { QuickActionCard, type ActionItem } from '../components/QuickActionCard';
import { RecentActivityTimeline } from '../components/RecentActivityTimeline';
import { SelectAssetModal, type AssetType } from '../components/SelectAssetModal';
import { CotizacionAutoModal } from '../components/cotizacion-auto';
import { CotizacionInmuebleModal } from '../components/cotizacion-inmueble';
import { authStorage } from '@/features/auth/services/authStorage';
import { useDashboardData } from '../hooks/useDashboardData';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import type {
  DashboardTab,
  UserSummary,
  MetricItem,
  ActivePolicy,
  RecentActivityItem,
} from '../types/dashboard.types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('inicio');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSelectAssetOpen, setIsSelectAssetOpen] = useState(false);
  const [isCotizacionAutoOpen, setIsCotizacionAutoOpen] = useState(false);
  const [isCotizacionInmuebleOpen, setIsCotizacionInmuebleOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 1. Obtención de datos reales directamente de PostgreSQL mediante Stored Procedures
  const { summary, policies, activity, isLoading, error, refresh } = useDashboardData();

  // 2. Carga reactiva de perfil de usuario autenticado desde almacenamiento seguro (sessionStorage)
  const [user] = useState<UserSummary>(() => {
    try {
      const parsed = authStorage.getUser();
      if (parsed?.profile) {
        return {
          id: parsed.id,
          name: `${parsed.profile.firstName} ${parsed.profile.lastName}`,
          email: parsed.email,
          dni: parsed.profile.dni,
          role: parsed.role || 'CLIENTE',
          planLevel: 'Cliente Titular • Verificado',
        };
      }
    } catch {
      // Fallback
    }
    return {
      id: 'cliente-01',
      name: 'Usuario Seguro',
      email: 'cliente@securelife.com',
      dni: 'Sin DNI',
      role: 'CLIENTE',
      planLevel: 'Cliente Registrado',
    };
  });

  // 3. Verificación de tenencia de póliza automotor para auxilio de grúa
  const hasAutoPolicy = policies.some(
    (p) => p.branch === 'automotor' && p.status === 'ACTIVA'
  );

  // 4. Transformación de métricas reales desde sp_get_client_dashboard
  const realMetrics: MetricItem[] = [
    {
      id: 'm1',
      title: 'Pólizas Activas',
      value: String(summary?.activePoliciesCount ?? 0),
      changeText:
        (summary?.activePoliciesCount ?? 0) > 0
          ? `${summary?.activePoliciesCount} coberturas`
          : 'Sin pólizas',
      isPositive: (summary?.activePoliciesCount ?? 0) > 0,
      iconName: 'ShieldCheck',
    },
    {
      id: 'm2',
      title: 'Próximo Débito',
      value:
        summary?.nextDueAmount && summary.nextDueAmount > 0
          ? `$${summary.nextDueAmount.toLocaleString('es-AR')}`
          : '$0',
      changeText: summary?.nextDueDate
        ? `Vence ${new Date(summary.nextDueDate).toLocaleDateString('es-AR')}`
        : 'Al día',
      isPositive: true,
      iconName: 'CreditCard',
    },
    {
      id: 'm3',
      title: 'Siniestros en Curso',
      value: String(summary?.activeClaimsCount ?? 0),
      changeText:
        (summary?.activeClaimsCount ?? 0) > 0
          ? `${summary?.activeClaimsCount} en trámite`
          : 'Sin reclamos',
      isPositive: (summary?.activeClaimsCount ?? 0) === 0,
      iconName: 'AlertCircle',
    },
    {
      id: 'm4',
      title: 'Score de Seguridad',
      value: `${summary?.protectionScore ?? 0}/100`,
      changeText:
        (summary?.protectionScore ?? 0) > 0 ? 'Protegido' : 'Sin cobertura',
      isPositive: (summary?.protectionScore ?? 0) > 0,
      iconName: 'Award',
    },
  ];

  // 5. Mapeo seguro de tipos para pólizas y actividades sin 'as any'
  const mapBranch = (branch: string): ActivePolicy['branch'] => {
    const b = branch.toLowerCase();
    if (b.includes('auto')) return 'automotor';
    if (b.includes('hogar') || b.includes('inmueble')) return 'hogar';
    if (b.includes('vida')) return 'vida';
    return 'tecnologia';
  };

  const mapPolicyStatus = (status: string): ActivePolicy['status'] => {
    const s = status.toUpperCase();
    if (s === 'ACTIVA' || s === 'EMITIDA') return 'Activa';
    if (s.includes('REVISION') || s === 'PENDIENTE') return 'En Revisión';
    return 'Vencida';
  };

  const mapActivityType = (type: string): RecentActivityItem['type'] => {
    const t = type.toLowerCase();
    if (t.includes('siniestro') || t.includes('claim')) return 'claim';
    if (t.includes('poliza') || t.includes('policy')) return 'policy';
    if (t.includes('asistencia') || t.includes('auxilio')) return 'assistance';
    return 'payment';
  };

  const mapActivityStatus = (status: string): RecentActivityItem['status'] => {
    const s = status.toLowerCase();
    if (s.includes('comple') || s.includes('emitid')) return 'completado';
    if (s.includes('aprob')) return 'aprobado';
    return 'en_proceso';
  };

  const formattedPolicies: ActivePolicy[] = policies.map((p) => ({
    id: p.id,
    policyNumber: p.policyNumber,
    branch: mapBranch(p.branch),
    title: p.planName,
    subtitle: p.vehicle
      ? `${p.vehicle.brand} ${p.vehicle.model} (${p.vehicle.year})`
      : p.property
      ? `${p.property.street} ${p.property.number}, ${p.property.city}`
      : 'Póliza Directa SecureLife',
    status: mapPolicyStatus(p.status),
    validUntil: new Date(p.validUntil).toLocaleDateString('es-AR'),
    monthlyPremium: `$${p.monthlyPremium.toLocaleString('es-AR')}`,
    vehiclePlate: p.vehicle?.plate,
    features: [
      'Emisión oficial certificada ante la Superintendencia de Seguros de la Nación',
      'Atención de reclamos y siniestros 100% digital vía portal',
      p.branch === 'automotor'
        ? 'Auxilio mecánico satelital con geolocalización GPS'
        : 'Urgencias domiciliarias 24h cubiertas',
    ],
  }));

  // 6. Mapeo de timeline de actividad real
  const formattedActivities: RecentActivityItem[] = activity.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    date: new Date(a.date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
    type: mapActivityType(a.type),
    status: mapActivityStatus(a.status),
  }));

  // 7. GSAP Transición al cambiar de pestaña
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    }, contentRef);

    return () => ctx.revert();
  }, [activeTab]);

  const handleLogout = () => {
    authStorage.clear();
    navigate('/login');
  };

  const handleDownloadCert = (policy: ActivePolicy) => {
    alert(`Descargando certificado digital oficial para póliza ${policy.policyNumber} (${policy.title})`);
  };

  const handleRequestAssistance = (_policy?: ActivePolicy) => {
    if (!hasAutoPolicy) {
      alert('No puede llamar una grúa sin póliza, contrate una aquí.');
      setActiveTab('asistencia');
      return;
    }
    setActiveTab('asistencia');
  };

  const quickActions: ActionItem[] = [
    {
      id: 'a1',
      title: 'Denunciar Siniestro',
      description: formattedPolicies.length > 0
        ? 'Carga fecha, relato y evidencias fotográficas en 3 simples pasos.'
        : 'No posee pólizas activas sobre las cuales formular una denuncia.',
      badge: '3 Pasos',
      icon: 'claim',
      action: () => setActiveTab('siniestros'),
    },
    {
      id: 'a2',
      title: 'Solicitar Grúa Satelital',
      description: hasAutoPolicy
        ? 'Envío de auxilio mecánico con geolocalización GPS en menos de 15 minutos.'
        : 'No puede llamar una grúa sin póliza, contrate una aquí.',
      badge: hasAutoPolicy ? '< 15 min' : 'Requiere Póliza',
      icon: 'tow',
      action: () => {
        if (!hasAutoPolicy) {
          setActiveTab('asistencia');
        } else {
          setActiveTab('asistencia');
        }
      },
    },
    {
      id: 'a3',
      title: 'Nueva Cotización',
      description: 'Simula coberturas para autos, motos, hogar, vida o tecnología.',
      badge: 'Simulador',
      icon: 'quote',
      action: () => setActiveTab('cotizaciones'),
    },
  ];

  const getTabTitle = () => {
    switch (activeTab) {
      case 'inicio':
        return 'Dashboard General';
      case 'polizas':
        return 'Mis Pólizas y Coberturas';
      case 'cotizaciones':
        return 'Cotizaciones y Simulador';
      case 'siniestros':
        return 'Radicación de Siniestros';
      case 'asistencia':
        return 'Auxilio Mecánico y Emergencias 24/7';
      case 'certificados':
        return 'Certificados y Credenciales Digitales';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex select-none">
      {/* 1. SIDEBAR VERDE */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={user}
        activePoliciesCount={summary?.activePoliciesCount ?? 0}
        onLogout={handleLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Cabecera */}
        <DashboardHeader
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          tabTitle={getTabTitle()}
          onEmergencyClick={() => setActiveTab('asistencia')}
          onNewPolicyClick={() => setIsSelectAssetOpen(true)}
        />

        {/* Notificación de error de servidor si existe */}
        {error && (
          <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={refresh} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              Reintentar
            </Button>
          </div>
        )}

        {/* Notificación de Cotización Radicada Exitosamente */}
        {notification && (
          <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-xs animate-slide-down">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#006e2f] shrink-0" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-700 font-bold hover:underline cursor-pointer text-xs ml-2"
            >
              Descartar
            </button>
          </div>
        )}

        {/* Banner de Ramo Seleccionado para Cotizar */}
        {selectedAssetType && (
          <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-slide-down">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse shrink-0" />
              <span>
                Has seleccionado cotizar:{' '}
                <strong className="text-[#006e2f]">
                  {selectedAssetType === 'AUTOMOTOR' && 'Vehículo Automotor'}
                  {selectedAssetType === 'HOGAR_INMUEBLE' && 'Hogar e Inmuebles'}
                  {selectedAssetType === 'VIDA' && 'Vida y Salud'}
                  {selectedAssetType === 'OBJETO_PERSONAL' && 'Tecnología y Objetos Personales'}
                </strong>
                {selectedAssetType === 'AUTOMOTOR'
                  ? '. Puedes iniciar el asistente de cotización interactivo de inmediato.'
                  : selectedAssetType === 'HOGAR_INMUEBLE'
                  ? '. Puedes iniciar el asistente de cotización e inspección digital de tu inmueble.'
                  : '. Ramo en proceso de parametrización actuarial.'}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {selectedAssetType === 'AUTOMOTOR' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsCotizacionAutoOpen(true)}
                  className="!py-1.5 !px-3 !text-xs !rounded-xl"
                >
                  Abrir Cotizador Auto
                </Button>
              )}
              {selectedAssetType === 'HOGAR_INMUEBLE' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsCotizacionInmuebleOpen(true)}
                  className="!py-1.5 !px-3 !text-xs !rounded-xl"
                >
                  Abrir Cotizador Hogar
                </Button>
              )}
              <button
                onClick={() => {
                  setSelectedAssetType(null);
                  setIsSelectAssetOpen(true);
                }}
                className="text-emerald-700 font-bold hover:underline cursor-pointer text-xs ml-1"
              >
                Cambiar activo
              </button>
            </div>
          </div>
        )}

        {/* Viewport */}
        <main ref={contentRef} className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
          {activeTab === 'inicio' && (
            <>
              {/* Hero Banner */}
              <WelcomeHero
                userName={user.name}
                activePoliciesCount={summary?.activePoliciesCount ?? policies.length}
                onExplorePolicies={() => setActiveTab('polizas')}
              />

              {/* 4 Tarjetas de Métricas Reales desde PostgreSQL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {realMetrics.map((metric) => (
                  <MetricCard key={metric.id} item={metric} />
                ))}
              </div>

              {/* Sección de Pólizas Activas con Empty State */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-title text-lg sm:text-xl font-bold text-[#0b1c30]">
                      Mis Pólizas Activas
                    </h2>
                    <p className="font-body text-xs text-gray-500">
                      Coberturas vigentes en la base de datos de SecureLife
                    </p>
                  </div>

                  {formattedPolicies.length > 0 && (
                    <button
                      onClick={() => setActiveTab('polizas')}
                      className="text-xs font-subtitle font-bold text-[#006e2f] hover:underline cursor-pointer"
                    >
                      Ver todas ({formattedPolicies.length})
                    </button>
                  )}
                </div>

                {isLoading ? (
                  <div className="py-12 text-center text-xs font-subtitle text-gray-400">
                    Cargando información segura desde la base de datos...
                  </div>
                ) : formattedPolicies.length === 0 ? (
                  /* EMPTY STATE REQUERIDO: "No posee pólizas activas, contrate una aquí" */
                  <Card
                    variant="white"
                    className="p-8 sm:p-10 rounded-3xl border border-dashed border-gray-300 text-center flex flex-col items-center justify-center bg-white/70"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#006e2f] flex items-center justify-center mb-3.5 shadow-sm">
                      <Shield className="w-7 h-7" />
                    </div>
                    <h3 className="font-title text-lg font-bold text-[#0b1c30] mb-1">
                      No posee pólizas activas
                    </h3>
                    <p className="font-body text-xs text-gray-500 mb-5 max-w-md">
                      Aún no registras coberturas contratadas en SecureLife. Asegura tu vehículo, hogar, vida o tecnología con validación inmediata.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsSelectAssetOpen(true)}
                      leftIcon={<PlusCircle className="w-4 h-4" />}
                      className="!rounded-xl"
                    >
                      Contrate una aquí
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {formattedPolicies.map((policy) => (
                      <PolicyCard
                        key={policy.id}
                        policy={policy}
                        onDownloadCert={handleDownloadCert}
                        onRequestAssistance={handleRequestAssistance}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Acciones Rápidas */}
              <div className="space-y-4">
                <h2 className="font-title text-lg sm:text-xl font-bold text-[#0b1c30]">
                  Gestiones Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {quickActions.map((action) => (
                    <QuickActionCard key={action.id} item={action} />
                  ))}
                </div>
              </div>

              {/* Timeline de Actividad Real */}
              <RecentActivityTimeline items={formattedActivities} />
            </>
          )}

          {activeTab === 'polizas' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-title text-2xl font-bold text-[#0b1c30]">
                    Pólizas y Coberturas Activas
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-gray-500">
                    Consulta el detalle de tus pólizas registradas en la base de datos.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsSelectAssetOpen(true)}
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Contratar Cobertura
                </Button>
              </div>

              {formattedPolicies.length === 0 ? (
                <Card
                  variant="white"
                  className="p-10 rounded-3xl border border-dashed border-gray-300 text-center flex flex-col items-center justify-center bg-white/70"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#006e2f] flex items-center justify-center mb-3.5">
                    <Shield className="w-7 h-7" />
                  </div>
                  <h3 className="font-title text-lg font-bold text-[#0b1c30] mb-1">
                    No posee pólizas activas
                  </h3>
                  <p className="font-body text-xs text-gray-500 mb-5 max-w-md">
                    Tu cartera de pólizas está vacía. Selecciona un plan acorde a tus necesidades para proteger tus bienes.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsSelectAssetOpen(true)}
                    leftIcon={<PlusCircle className="w-4 h-4" />}
                  >
                    Contrate una aquí
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {formattedPolicies.map((policy) => (
                    <PolicyCard
                      key={policy.id}
                      policy={policy}
                      onDownloadCert={handleDownloadCert}
                      onRequestAssistance={handleRequestAssistance}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cotizaciones' && (
            <Card variant="white" className="p-8 rounded-3xl border border-gray-200 text-center max-w-2xl mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#006e2f] flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="font-title text-2xl font-black text-[#0b1c30] mb-2">
                Simulador de Cotizaciones
              </h2>
              <p className="font-body text-sm text-gray-600 mb-6">
                Calcula al instante el costo de tus nuevos seguros de Automotor, Inmuebles, Vida o Tecnología con cálculo actuarial directo.
              </p>
              <Button
                variant="primary"
                onClick={() => setIsSelectAssetOpen(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Cotizar y Contratar Póliza
              </Button>
            </Card>
          )}

          {activeTab === 'siniestros' && (
            <Card variant="white" className="p-8 rounded-3xl border border-gray-200 max-w-3xl mx-auto my-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-title text-xl font-bold text-[#0b1c30]">
                    Radicación de Siniestro en 3 Pasos
                  </h2>
                  <p className="font-body text-xs text-gray-500">
                    {formattedPolicies.length > 0
                      ? 'Denuncia tu incidente con fotografías y relato directo para peritaje técnico inmediato.'
                      : 'No posee pólizas activas sobre las cuales denunciar siniestros.'}
                  </p>
                </div>
              </div>

              {formattedPolicies.length === 0 ? (
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center">
                  <p className="font-body text-xs text-gray-600 mb-4">
                    Para radicar una denuncia formal ante un perito técnico debes contar con una póliza vigente.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsSelectAssetOpen(true)}
                    leftIcon={<PlusCircle className="w-4 h-4" />}
                  >
                    Contrate una aquí
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-xs font-bold text-[#006e2f] block mb-1">1. Datos del Suceso</span>
                      <p className="text-xs text-gray-500">Fecha, hora, lugar y personas involucradas.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-xs font-bold text-[#006e2f] block mb-1">2. Evidencias y Fotos</span>
                      <p className="text-xs text-gray-500">Carga de daños materiales y documentación.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-xs font-bold text-[#006e2f] block mb-1">3. Dictamen Pericial</span>
                      <p className="text-xs text-gray-500">Asignación automática a un inspector técnico.</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary">
                      Iniciar Denuncia de Siniestro
                    </Button>
                  </div>
                </>
              )}
            </Card>
          )}

          {activeTab === 'asistencia' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* EMPTY STATE ESPECÍFICO DE ASISTENCIA: "No puede llamar una grúa sin póliza, contrate una aquí" */}
              {!hasAutoPolicy ? (
                <Card
                  variant="white"
                  className="p-8 sm:p-10 rounded-3xl border border-rose-200 bg-rose-50/40 text-center flex flex-col items-center justify-center shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3.5">
                    <LifeBuoy className="w-7 h-7" />
                  </div>
                  <h3 className="font-title text-xl font-bold text-[#0b1c30] mb-1.5">
                    No puede llamar una grúa sin póliza, contrate una aquí
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-gray-600 mb-6 max-w-lg">
                    El servicio de auxilio mecánico satelital 24/7 y remolque está reservado para clientes con cobertura automotor activa. Asegura tu vehículo en minutos con grúa incluida en todo el país.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setIsSelectAssetOpen(true)}
                    leftIcon={<PlusCircle className="w-4 h-4" />}
                  >
                    Contrate una póliza automotor aquí
                  </Button>
                </Card>
              ) : (
                <>
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-[#004b1e] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#22c55e] flex items-center justify-center shrink-0">
                        <LifeBuoy className="w-7 h-7 animate-spin-slow" />
                      </div>
                      <div>
                        <h2 className="font-title text-xl font-bold">Auxilio Mecánico y Grúa Satelital 24/7</h2>
                        <p className="font-body text-xs text-emerald-200">
                          Localización GPS en tiempo real. Tiempo de llegada estimado: 12-15 minutos.
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="glass"
                      onClick={() => alert('Conectando con la central de auxilio satelital...')}
                      className="!text-white !border-white/30 whitespace-nowrap"
                      leftIcon={<PhoneCall className="w-4 h-4 text-[#22c55e]" />}
                    >
                      Llamar a Central de Emergencias
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Card variant="white" className="p-5 rounded-2xl border border-gray-200">
                      <h3 className="font-title text-base font-bold text-[#0b1c30] mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#006e2f]" /> Auxilio Mecánico Automotor
                      </h3>
                      <p className="font-body text-xs text-gray-500 mb-4">
                        Remolque, mecánica ligera, cambio de neumáticos, puente de batería y suministro de combustible.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Solicitar Móvil a mi Ubicación
                      </Button>
                    </Card>

                    <Card variant="white" className="p-5 rounded-2xl border border-gray-200">
                      <h3 className="font-title text-base font-bold text-[#0b1c30] mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#006e2f]" /> Urgencias de Hogar
                      </h3>
                      <p className="font-body text-xs text-gray-500 mb-4">
                        Plomería por rotura de caños, cortocircuitos eléctricos, apertura de cerraduras por extravío de llave.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Solicitar Técnico Domiciliario
                      </Button>
                    </Card>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'certificados' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <h2 className="font-title text-2xl font-bold text-[#0b1c30]">
                  Certificados y Documentación Oficial
                </h2>
                <p className="font-body text-xs sm:text-sm text-gray-500">
                  Descarga tus certificados de cobertura con firma digital y código QR verificable ante autoridades de tránsito.
                </p>
              </div>

              {formattedPolicies.length === 0 ? (
                <Card
                  variant="white"
                  className="p-8 rounded-2xl border border-dashed border-gray-300 text-center flex flex-col items-center justify-center"
                >
                  <p className="font-body text-xs text-gray-500 mb-3">
                    No posee pólizas activas sobre las cuales emitir certificados digitales.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsSelectAssetOpen(true)}
                    leftIcon={<PlusCircle className="w-4 h-4" />}
                  >
                    Contrate una aquí
                  </Button>
                </Card>
              ) : (
                <div className="space-y-3">
                  {formattedPolicies.map((p) => (
                    <Card key={p.id} variant="white" className="p-4 sm:p-5 rounded-2xl border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006e2f] flex items-center justify-center">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-title text-sm font-bold text-[#0b1c30]">{p.title}</h4>
                          <p className="font-body text-xs text-gray-500">Carnet Mercosur Digital • Póliza {p.policyNumber}</p>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" onClick={() => handleDownloadCert(p)}>
                        Descargar PDF
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL: SELECCIÓN DE ACTIVO A ASEGURAR (TIPOS DE PÓLIZAS) */}
      <SelectAssetModal
        isOpen={isSelectAssetOpen}
        onClose={() => setIsSelectAssetOpen(false)}
        onSelectAsset={(type) => {
          setSelectedAssetType(type);
          setIsSelectAssetOpen(false);
          if (type === 'AUTOMOTOR') {
            setIsCotizacionAutoOpen(true);
          } else if (type === 'HOGAR_INMUEBLE') {
            setIsCotizacionInmuebleOpen(true);
          }
        }}
      />

      {/* MODAL: COTIZADOR OFICIAL MULTIPASO AUTOMOTOR CON INSPECCIÓN Y REVISIÓN EXTENSA */}
      <CotizacionAutoModal
        isOpen={isCotizacionAutoOpen}
        onClose={() => setIsCotizacionAutoOpen(false)}
        onSuccess={() => {
          refresh();
          setNotification(
            '¡Cotización Automotor radicada con éxito! Tu expediente ha sido registrado e impactado en tu feed oficial.'
          );
        }}
      />

      {/* MODAL: COTIZADOR OFICIAL MULTIPASO HOGAR E INMUEBLE */}
      <CotizacionInmuebleModal
        isOpen={isCotizacionInmuebleOpen}
        onClose={() => {
          setIsCotizacionInmuebleOpen(false);
          refresh();
        }}
        onCotizacionRadicada={() => {
          refresh();
          setNotification(
            '¡Cotización de Hogar radicada con éxito! Tu expediente quedó en estado "Pendiente de Inspección Técnica (24-48 hs)".'
          );
        }}
      />
    </div>
  );
};
