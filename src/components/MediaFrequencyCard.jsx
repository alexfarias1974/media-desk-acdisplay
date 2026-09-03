import React, { useState } from 'react';
import { 
  Calculator, 
  Calendar, 
  Tv, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  TrendingUp, 
  SlidersHorizontal,
  Building2,
  FileSpreadsheet,
  Download,
  CalendarRange
} from 'lucide-react';
import { downloadCSV } from '../utils/sampleDataGenerator';

export default function MediaFrequencyCard({ 
  mediaFrequencyStats = [], 
  totemFrequencyStats = [],
  summary 
}) {
  const [viewMode, setViewMode] = useState('byMedia'); // 'byMedia' or 'byTotem'
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMedia, setExpandedMedia] = useState(null);
  const [selectedTotemFilter, setSelectedTotemFilter] = useState('all');

  // Filtered Media List
  const filteredMedias = mediaFrequencyStats.filter(m => {
    const matchSearch = searchTerm === '' || 
      m.media.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchTotem = selectedTotemFilter === 'all' || 
      m.totemBreakdown.some(t => t.totem === selectedTotemFilter);

    return matchSearch && matchTotem;
  });

  // Filtered Totems List
  const filteredTotems = totemFrequencyStats.filter(t => {
    return searchTerm === '' || t.totem.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleExpand = (mediaName) => {
    setExpandedMedia(expandedMedia === mediaName ? null : mediaName);
  };

  // Export Frequency Table to CSV with Start and End Dates
  const handleExportFrequencyCSV = () => {
    const headers = [
      'Midia', 
      'Cliente', 
      'Totem', 
      'Data_Inicio',
      'Data_Fim',
      'Dias_Campanha_Span',
      'Dias_Ativos_Com_Exibicao',
      'Exibicoes_Validas_Periodo', 
      'Media_Por_Dia', 
      'Media_Por_Semana', 
      'Total_Estimado_Mes_30d'
    ];

    const rows = [];
    mediaFrequencyStats.forEach(m => {
      // Total media row
      rows.push([
        `"${m.media.replace(/"/g, '""')}"`,
        `"${m.client.replace(/"/g, '""')}"`,
        '"TODOS OS TOTENS (CONSOLIDADO)"',
        `"${m.startDate}"`,
        `"${m.endDate}"`,
        m.spanDays,
        m.activeDays,
        m.totalPlays,
        m.avgPerDay,
        m.avgPerWeek,
        m.monthTotal,
      ]);

      // Each totem breakdown
      m.totemBreakdown.forEach(tb => {
        rows.push([
          `"${m.media.replace(/"/g, '""')}"`,
          `"${m.client.replace(/"/g, '""')}"`,
          `"${tb.totem.replace(/"/g, '""')}"`,
          `"${tb.startDate}"`,
          `"${tb.endDate}"`,
          tb.spanDays,
          tb.activeDays,
          tb.plays,
          tb.avgPerDay,
          tb.avgPerWeek,
          tb.monthTotal,
        ]);
      });
    });

    const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    downloadCSV('mediadesk_frequencia_medias_por_totem.csv', csvContent);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-500/30 p-5 shadow-2xl shadow-cyan-950/20 space-y-5">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Frequência de Exibição & Médias Auditadas
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80 text-[10px] font-semibold uppercase">
                Mídia por Mídia & Totem a Totem
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Taxa de repetição calculada por <strong>dia</strong>, por <strong>semana</strong> e <strong>no mês todo</strong> considerando o período exato de veiculação.
            </p>
          </div>
        </div>

        {/* View switcher & Export */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('byMedia')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'byMedia'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Por Mídia & Totem
            </button>
            <button
              onClick={() => setViewMode('byTotem')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'byTotem'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              Por Totem (Telas)
            </button>
          </div>

          <button
            onClick={handleExportFrequencyCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
            title="Exportar tabela de médias em CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Exportar Médias
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={viewMode === 'byMedia' ? 'Filtrar por mídia ou cliente...' : 'Filtrar por totem...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        {viewMode === 'byMedia' && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Filtrar Totem:</span>
            <select
              value={selectedTotemFilter}
              onChange={(e) => setSelectedTotemFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 max-w-[200px]"
            >
              <option value="all">Todos os totens ({totemFrequencyStats.length})</option>
              {totemFrequencyStats.map((t, idx) => (
                <option key={idx} value={t.totem}>{t.totem}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* VIEW 1: BY MEDIA WITH EXPANDABLE TOTEM BREAKDOWN */}
      {viewMode === 'byMedia' && (
        <div className="space-y-3">
          {filteredMedias.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
              Nenhuma mídia encontrada com os filtros atuais.
            </div>
          ) : (
            filteredMedias.map((m, idx) => {
              const isExpanded = expandedMedia === m.media;

              return (
                <div 
                  key={idx}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExpanded 
                      ? 'bg-slate-950/90 border-cyan-500/50 shadow-lg shadow-cyan-950/30' 
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Media Card Main Row */}
                  <div 
                    onClick={() => toggleExpand(m.media)}
                    className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                  >
                    {/* Media Identification & Date Range Badge */}
                    <div className="space-y-1.5 max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                        <h4 className="text-sm font-bold text-white truncate" title={m.media}>
                          {m.media}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-300 font-medium">{m.client}</span>
                        <span>•</span>
                        <span>{m.totemCount} {m.totemCount === 1 ? 'totem ativo' : 'totens ativos'}</span>
                      </div>

                      {/* Prominent Period Dates (Data Início e Fim) */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 border border-cyan-800/50 text-cyan-300 font-mono">
                          <CalendarRange className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span><strong>{m.startDate}</strong> a <strong>{m.endDate}</strong></span>
                          <span className="text-slate-400 font-sans">({m.spanDays} {m.spanDays === 1 ? 'dia' : 'dias'})</span>
                        </span>
                        {m.spanDays < 28 ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/60 text-amber-300 text-[10px] font-semibold">
                            Campanha Parcial
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[10px] font-semibold">
                            Mês Completo
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metrics Pillars */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 text-center sm:text-right">
                      
                      {/* Média por Dia */}
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                        <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                          Média / Dia
                        </div>
                        <div className="text-base sm:text-lg font-black font-mono text-cyan-400">
                          {m.avgPerDay.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          vezes ao dia
                        </div>
                      </div>

                      {/* Média por Semana */}
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                        <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                          Média / Semana
                        </div>
                        <div className="text-base sm:text-lg font-black font-mono text-blue-400">
                          {m.avgPerWeek.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          vezes por semana
                        </div>
                      </div>

                      {/* Mês Todo */}
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                        <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                          Mês Todo
                        </div>
                        <div className="text-base sm:text-lg font-black font-mono text-emerald-400">
                          {m.monthTotal.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          projeção mensal
                        </div>
                      </div>

                      {/* Total no Período & Accordion Indicator */}
                      <div className="hidden sm:flex flex-col items-end justify-center">
                        <div className="text-xs font-mono text-white font-bold">
                          {m.totalPlays.toLocaleString('pt-BR')} <span className="text-slate-400 text-[10px] font-normal">total</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-medium mt-1">
                          <span>{isExpanded ? 'Recolher totens' : 'Ver por totem'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Expandable Totem Breakdown */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/80 bg-slate-900/50 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                          <Tv className="w-3.5 h-3.5 text-cyan-400" />
                          Desdobramento da Mídia por Totem ({m.totemBreakdown.length} telas):
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Período e médias individuais calculadas para cada tela
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                              <th className="py-2 px-3">Totem / Ponto</th>
                              <th className="py-2 px-3">Período de Veiculação</th>
                              <th className="py-2 px-3 text-center">Total Válido</th>
                              <th className="py-2 px-3 text-center">Share</th>
                              <th className="py-2 px-3 text-right">Média / Dia</th>
                              <th className="py-2 px-3 text-right">Média / Semana</th>
                              <th className="py-2 px-3 text-right">Mês Todo (30d)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/40 text-slate-300">
                            {m.totemBreakdown.map((tb, tIdx) => (
                              <tr key={tIdx} className="hover:bg-slate-800/30">
                                <td className="py-2.5 px-3 font-medium text-white flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                  {tb.totem}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                                  <div className="text-cyan-300 font-medium">
                                    {tb.startDate} a {tb.endDate}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {tb.spanDays} {tb.spanDays === 1 ? 'dia' : 'dias'} ({tb.activeDays} com inserção)
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono text-white">
                                  {tb.plays.toLocaleString('pt-BR')}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <div className="inline-flex items-center gap-1.5">
                                    <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                      <div 
                                        className="bg-cyan-400 h-full rounded-full" 
                                        style={{ width: `${tb.share}%` }} 
                                      />
                                    </div>
                                    <span className="font-mono text-[10px] text-slate-400">{tb.share}%</span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-400">
                                  {tb.avgPerDay.toLocaleString('pt-BR')} /dia
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-400">
                                  {tb.avgPerWeek.toLocaleString('pt-BR')} /sem
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                                  {tb.monthTotal.toLocaleString('pt-BR')} /mês
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: BY TOTEM WITH ALL MEDIAS LISTED */}
      {viewMode === 'byTotem' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTotems.map((t, idx) => (
            <div 
              key={idx}
              className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-3 hover:border-slate-700 transition-all"
            >
              {/* Totem Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-800/60 text-cyan-400">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.totem}</h4>
                    <p className="text-[11px] text-slate-400">
                      {t.mediaCount} mídias • {t.startDate} a {t.endDate} ({t.spanDays} dias)
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 font-mono text-[10px] text-cyan-300 font-semibold">
                  {t.totalPlays.toLocaleString('pt-BR')} exibições
                </span>
              </div>

              {/* Totem Averages Header */}
              <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Média / Dia</div>
                  <div className="text-sm font-bold font-mono text-cyan-400">{t.avgPerDay.toLocaleString('pt-BR')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Média / Sem.</div>
                  <div className="text-sm font-bold font-mono text-blue-400">{t.avgPerWeek.toLocaleString('pt-BR')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Mês Todo</div>
                  <div className="text-sm font-bold font-mono text-emerald-400">{t.monthTotal.toLocaleString('pt-BR')}</div>
                </div>
              </div>

              {/* Medias on this totem */}
              <div className="space-y-1.5 pt-1 max-h-48 overflow-y-auto pr-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Mídias neste totem:
                </div>
                {t.mediaBreakdown.map((med, mIdx) => (
                  <div 
                    key={mIdx}
                    className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/60 flex items-center justify-between text-xs"
                  >
                    <div className="truncate max-w-[170px]">
                      <div className="font-medium text-white truncate" title={med.media}>{med.media}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {med.startDate} a {med.endDate} ({med.spanDays}d)
                      </div>
                    </div>
                    <div className="text-right font-mono text-[11px]">
                      <span className="text-cyan-400 font-bold">{med.avgPerDay}</span>
                      <span className="text-slate-500">/dia • </span>
                      <span className="text-emerald-400 font-bold">{med.monthTotal}</span>
                      <span className="text-slate-500">/mês</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
