import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Percent, 
  Clock, 
  Tv, 
  Building2, 
  Sparkles,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export default function AuditSummaryCards({ summary, periodStart, periodEnd }) {
  if (!summary) return null;

  const {
    totalRaw,
    totalValid,
    totalDiscarded,
    complianceRate,
    totalDurationFormatted,
    uniqueMedias,
    uniqueClients,
    uniqueTotems,
  } = summary;

  return (
    <div className="space-y-4">
      {/* Top Banner with Period & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-white">Período Analisado:</strong> {periodStart} até {periodEnd}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            Auditoria Concluída com Sucesso
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span>{totalRaw.toLocaleString('pt-BR')} registros processados na planilha</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Exibições Válidas (Auditadas) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 p-5 shadow-lg shadow-emerald-950/20 group hover:border-emerald-500/50 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Exibições Válidas
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/60 text-[10px] text-emerald-300 font-medium">
              Oficial
            </span>
          </div>

          <div className="text-3xl font-black text-white tracking-tight mb-1">
            {totalValid.toLocaleString('pt-BR')}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Tempo em tela: <strong className="text-slate-200">{totalDurationFormatted}</strong></span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-300/80 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/40">
            Dentro da janela contratada (Seg-Sáb 10h-22h | Dom 12h-22h)
          </div>
        </div>

        {/* 2. Exibições Descartadas (Fora do Horário) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/25 p-5 shadow-lg shadow-amber-950/20 group hover:border-amber-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              Expurgadas / Fora da Janela
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800/60 text-[10px] text-amber-300 font-medium">
              Filtro
            </span>
          </div>

          <div className="text-3xl font-black text-amber-400 tracking-tight mb-1">
            {totalDiscarded.toLocaleString('pt-BR')}
          </div>

          <div className="text-xs text-slate-400">
            Registros eliminados para não contaminar métricas
          </div>
          <div className="mt-3 text-[11px] text-amber-300/80 bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-800/40">
            Madrugadas, antes do horário ou após as 22:00h
          </div>
        </div>

        {/* 3. Taxa de Conformidade */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/25 p-5 shadow-lg shadow-cyan-950/20 group hover:border-cyan-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Percent className="w-4 h-4" />
              Taxa de Conformidade
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/60 text-[10px] text-cyan-300 font-medium">
              Aproveitamento
            </span>
          </div>

          <div className="text-3xl font-black text-white tracking-tight mb-1">
            {complianceRate}%
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2 mb-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, complianceRate))}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-400">
            das inserções da planilha ocorreram na janela contratada
          </div>
        </div>

        {/* 4. Mídias & Totens Ativos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/25 p-5 shadow-lg shadow-indigo-950/20 group hover:border-indigo-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Tv className="w-4 h-4" />
              Alcance & Telas
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-[10px] text-indigo-300 font-medium">
              Rede
            </span>
          </div>

          <div className="text-3xl font-black text-white tracking-tight mb-1">
            {uniqueMedias} <span className="text-base font-normal text-slate-400">mídias</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              {uniqueClients} {uniqueClients === 1 ? 'cliente' : 'clientes'}
            </span>
            <span className="flex items-center gap-1">
              <Tv className="w-3.5 h-3.5 text-slate-500" />
              {uniqueTotems} {uniqueTotems === 1 ? 'totem' : 'totens'}
            </span>
          </div>

          <div className="mt-3 text-[11px] text-indigo-300/80 bg-indigo-950/40 px-2.5 py-1 rounded-md border border-indigo-800/40">
            Média de {uniqueMedias > 0 ? Math.round(totalValid / uniqueMedias).toLocaleString('pt-BR') : 0} exibições por mídia
          </div>
        </div>

      </div>
    </div>
  );
}
