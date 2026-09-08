import React from 'react';
import {
  Shield,
  CheckCircle2,
  Plus,
  Trash2,
  Users,
  Flame,
  Warehouse,
  Gauge,
  Info,
} from 'lucide-react';
import type { CoberturaFormState, PlanCobertura, KilometrajeOption, ConductorAdicional } from './types';
import { PLAN_OPTIONS } from './constants';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';

export interface Paso2CoberturaExtrasProps {
  cobertura: CoberturaFormState;
  setCobertura: React.Dispatch<React.SetStateAction<CoberturaFormState>>;
  handleAddConductor: () => void;
  handleUpdateConductor: <K extends keyof ConductorAdicional>(
    id: string,
    field: K,
    value: ConductorAdicional[K]
  ) => void;
  handleRemoveConductor: (id: string) => void;
  errors: Record<string, string>;
}

export const Paso2CoberturaExtras: React.FC<Paso2CoberturaExtrasProps> = ({
  cobertura,
  setCobertura,
  handleAddConductor,
  handleUpdateConductor,
  handleRemoveConductor,
  errors,
}) => {
  const handleSelectPlan = (plan: PlanCobertura) => {
    setCobertura((prev) => ({ ...prev, plan }));
  };

  const handleToggleGnc = () => {
    setCobertura((prev) => ({ ...prev, tieneGnc: !prev.tieneGnc }));
  };

  const handleToggleGaraje = () => {
    setCobertura((prev) => ({ ...prev, garajeCubierto: !prev.garajeCubierto }));
  };

  const handleSelectKm = (km: KilometrajeOption) => {
    setCobertura((prev) => ({ ...prev, kilometrajeAnual: km }));
  };

  return (
    <div className="space-y-6">
      {/* 1. SELECTOR DE PLANES DE COBERTURA */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-title text-sm font-bold text-[#0b1c30] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#006e2f]" /> Plan de Cobertura Deseado
          </label>
          <span className="text-xs text-gray-500 font-body">
            Selecciona el nivel de protección para tu vehículo
          </span>
        </div>

        {errors.plan && (
          <p className="text-xs text-red-500 font-medium">{errors.plan}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLAN_OPTIONS.map((plan) => {
            const isSelected = cobertura.plan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => handleSelectPlan(plan.id)}
                className={`group relative p-5 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between text-left border ${
                  isSelected
                    ? 'bg-emerald-50/70 border-[#006e2f] shadow-md ring-2 ring-[#006e2f]/20'
                    : 'bg-white border-gray-200/90 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#006e2f] border-[#006e2f] text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <h4 className="font-title text-sm font-bold text-[#0b1c30]">
                        {plan.title}
                      </h4>
                    </div>

                    <Badge
                      variant={isSelected ? 'primary' : 'glass'}
                      className="text-[10px] py-0.5 px-2 shrink-0 font-medium"
                    >
                      {plan.badge}
                    </Badge>
                  </div>

                  <p className="font-body text-xs text-gray-600 leading-relaxed">
                    {plan.description}
                  </p>

                  <ul className="space-y-1.5 pt-2 border-t border-gray-100">
                    {plan.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="text-xs font-body text-gray-600 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006e2f] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100/80 text-[11px] font-semibold text-emerald-800">
                  <span>{plan.franquiciaInfo}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. EXTRAS Y CONDICIONES DE USO */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-5">
        <h4 className="font-title text-sm font-bold text-[#0b1c30] flex items-center gap-2">
          <span>Factores de Riesgo y Extras Opcionales</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Switch GNC */}
          <div
            onClick={handleToggleGnc}
            className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-between cursor-pointer bg-gray-50/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="font-subtitle text-xs font-bold text-[#0b1c30] block">
                  ¿Posee equipo de GNC homologado?
                </span>
                <span className="text-[11px] font-body text-gray-500">
                  Con oblea habilitante ENARGAS vigente
                </span>
              </div>
            </div>

            {/* Switch UI */}
            <div
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                cobertura.tieneGnc ? 'bg-[#006e2f]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-1 transition-transform ${
                  cobertura.tieneGnc ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
          </div>

          {/* Switch Garaje Cubierto */}
          <div
            onClick={handleToggleGaraje}
            className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-between cursor-pointer bg-gray-50/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                <Warehouse className="w-5 h-5" />
              </div>
              <div>
                <span className="font-subtitle text-xs font-bold text-[#0b1c30] block">
                  ¿Duerme en garaje cubierto?
                </span>
                <span className="text-[11px] font-body text-gray-500">
                  Bonificación de riesgo nocturno
                </span>
              </div>
            </div>

            {/* Switch UI */}
            <div
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                cobertura.garajeCubierto ? 'bg-[#006e2f]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-1 transition-transform ${
                  cobertura.garajeCubierto ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Kilometraje Estimado Anual */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="font-subtitle text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-[#006e2f]" /> Kilometraje Estimado Anual
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { km: 8000, label: '< 10.000 km/año', desc: 'Uso recreativo / bonificado' },
              { km: 15000, label: '15.000 km/año', desc: 'Uso particular promedio' },
              { km: 25000, label: '> 20.000 km/año', desc: 'Uso intensivo o comercial' },
            ].map((opt) => {
              const isKmSelected = cobertura.kilometrajeAnual === opt.km;
              return (
                <button
                  key={opt.km}
                  type="button"
                  onClick={() => handleSelectKm(opt.km as KilometrajeOption)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isKmSelected
                      ? 'bg-emerald-50 border-[#006e2f] text-[#006e2f] shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="font-subtitle text-xs font-bold block">{opt.label}</span>
                  <span className="text-[11px] font-body text-gray-500 block">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. CONDUCTORES ADICIONALES */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-title text-sm font-bold text-[#0b1c30] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#006e2f]" /> Conductores Adicionales Habituales
            </h4>
            <p className="font-body text-xs text-gray-500">
              Declara quién más conduce el rodado para garantizar cobertura ante siniestros
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddConductor}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="!rounded-xl self-start sm:self-auto"
          >
            Agregar Conductor
          </Button>
        </div>

        {cobertura.conductoresAdicionales.length === 0 ? (
          <div className="p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <Info className="w-4 h-4 text-gray-400" />
            <span>
              Solo el titular declarado conducirá la unidad. Puedes agregar familiares o terceros en cualquier momento.
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {cobertura.conductoresAdicionales.map((cond, idx) => (
              <div
                key={cond.id}
                className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-3"
              >
                {/* Nombre */}
                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    value={cond.nombreCompleto}
                    onChange={(e) =>
                      handleUpdateConductor(cond.id, 'nombreCompleto', e.target.value)
                    }
                    placeholder="Nombre y Apellido del conductor"
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-body outline-none focus:border-[#006e2f]"
                  />
                  {errors[`conductor_${idx}_nombre`] && (
                    <p className="text-[11px] text-red-500 mt-0.5">
                      {errors[`conductor_${idx}_nombre`]}
                    </p>
                  )}
                </div>

                {/* Parentesco */}
                <div className="w-full sm:w-36">
                  <select
                    value={cond.parentesco}
                    onChange={(e) =>
                      handleUpdateConductor(cond.id, 'parentesco', e.target.value)
                    }
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-body outline-none focus:border-[#006e2f] cursor-pointer"
                  >
                    <option value="Cónyuge">Cónyuge</option>
                    <option value="Hijo/a">Hijo/a</option>
                    <option value="Progenitor">Progenitor</option>
                    <option value="Hermano/a">Hermano/a</option>
                    <option value="Empleado/Chofer">Empleado/Chofer</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                {/* Edad */}
                <div className="w-full sm:w-24">
                  <input
                    type="number"
                    min="17"
                    max="99"
                    value={cond.edad || ''}
                    onChange={(e) =>
                      handleUpdateConductor(cond.id, 'edad', Number(e.target.value))
                    }
                    placeholder="Edad"
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-body outline-none focus:border-[#006e2f]"
                  />
                  {errors[`conductor_${idx}_edad`] && (
                    <p className="text-[11px] text-red-500 mt-0.5">
                      {errors[`conductor_${idx}_edad`]}
                    </p>
                  )}
                </div>

                {/* Borrar */}
                <button
                  type="button"
                  onClick={() => handleRemoveConductor(cond.id)}
                  aria-label="Eliminar conductor"
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors self-end sm:self-auto cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
