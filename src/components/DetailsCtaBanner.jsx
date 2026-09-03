import React from 'react';
import { TableProperties, ArrowRight, ShieldCheck, Search, Filter } from 'lucide-react';

export default function DetailsCtaBanner({ onOpenDetails, totalValid, totalDiscarded }) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/30 p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
      <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
              <TableProperties className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Detalhamento das Mídias & Registros Completos
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 text-[10px] font-mono border border-slate-700">
              {totalValid.toLocaleString('pt-BR')} registros
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Consulte a lista completa das exibições auditadas com data, horário exato, duração em segundos, totem e cliente. Você também pode examinar a aba de registros descartados com a justificativa de cada descarte ou exportar a planilha filtrada em CSV.
          </p>
        </div>

        <button
          onClick={onOpenDetails}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <span>Abrir Detalhamento das Mídias</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
