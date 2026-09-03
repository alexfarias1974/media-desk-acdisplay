import React from 'react';
import { ShieldCheck, Filter, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AuditRuleBanner({ discardReasons, totalDiscarded }) {
  return (
    <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Rule description */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              <Filter className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-sm font-semibold text-white">
              Garantia de Não-Contaminação da Amostra
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            A regra de negócio exclui com precisão de segundo qualquer registro de segunda a sábado fora de <strong>10:00:00 às 22:00:00</strong> e aos domingos fora de <strong>12:00:00 às 22:00:00</strong>. Todos os números e gráficos abaixo refletem exclusivamente a entrega qualificada.
          </p>
        </div>

        {/* Reasons pills */}
        {discardReasons && discardReasons.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {discardReasons.map((r, idx) => (
              <div 
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-amber-900/40 text-[11px] text-slate-300 flex items-center gap-1.5"
                title={`${r.reason}: ${r.count} exibições expurgadas (${r.percentage}%)`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span className="text-slate-400">{r.reason}:</span>
                <span className="font-semibold text-amber-300">
                  {r.count.toLocaleString('pt-BR')} ({r.percentage}%)
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
