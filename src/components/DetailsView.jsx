import React from 'react';
import { 
  ArrowLeft, 
  TableProperties, 
  CheckCircle2, 
  Clock, 
  Tv, 
  Building2, 
  Download,
  Filter
} from 'lucide-react';
import DataTable from './DataTable';

export default function DetailsView({ 
  onBack, 
  validPlays = [], 
  discardedPlays = [], 
  summary 
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:-translate-x-0.5"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            Voltar ao Dashboard Executivo
          </button>
          
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />
          
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <TableProperties className="w-4 h-4 text-cyan-400" />
              Detalhamento das Mídias & Auditoria Registro a Registro
            </h2>
            <p className="text-xs text-slate-400">
              Listagem analítica completa das inserções registradas na planilha
            </p>
          </div>
        </div>

        {/* Quick KPI pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 font-mono font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {validPlays.length.toLocaleString('pt-BR')} Válidas
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-800/80 text-amber-300 font-mono font-semibold">
            {discardedPlays.length.toLocaleString('pt-BR')} Expurgadas
          </span>
        </div>
      </div>

      {/* Embedded High-Performance Data Table */}
      <DataTable
        validPlays={validPlays}
        discardedPlays={discardedPlays}
      />

    </div>
  );
}
