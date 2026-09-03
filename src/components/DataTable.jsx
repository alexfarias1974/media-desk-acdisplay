import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import { downloadCSV } from '../utils/sampleDataGenerator';

export default function DataTable({ validPlays = [], discardedPlays = [] }) {
  const [tab, setTab] = useState('valid'); // 'valid' or 'discarded'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState('all');
  const [selectedTotem, setSelectedTotem] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const currentDataset = tab === 'valid' ? validPlays : discardedPlays;

  // Extract unique media and totens for filter dropdowns
  const uniqueMedias = useMemo(() => {
    const set = new Set(currentDataset.map(item => item.media));
    return Array.from(set).sort();
  }, [currentDataset]);

  const uniqueTotens = useMemo(() => {
    const set = new Set(currentDataset.map(item => item.totem));
    return Array.from(set).sort();
  }, [currentDataset]);

  // Filter dataset
  const filteredData = useMemo(() => {
    return currentDataset.filter(item => {
      const matchSearch = searchTerm === '' || 
        item.media.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.totem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dateStr.includes(searchTerm) ||
        item.timeStr.includes(searchTerm);

      const matchMedia = selectedMedia === 'all' || item.media === selectedMedia;
      const matchTotem = selectedTotem === 'all' || item.totem === selectedTotem;

      return matchSearch && matchMedia && matchTotem;
    });
  }, [currentDataset, searchTerm, selectedMedia, selectedTotem]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Handle CSV export of the current view
  const handleExportCSV = () => {
    const isVal = tab === 'valid';
    const filename = isVal ? 'mediadesk_exibicoes_auditadas_validas.csv' : 'mediadesk_exibicoes_descartadas_fora_horario.csv';

    const headers = isVal 
      ? ['ID', 'Data', 'Hora', 'Cliente', 'Midia', 'Totem', 'Duracao_Segundos', 'Status_Auditoria']
      : ['ID', 'Data', 'Hora', 'Cliente', 'Midia', 'Totem', 'Duracao_Segundos', 'Motivo_Descarte', 'Detalhe_Regra'];

    const rows = filteredData.map(item => {
      if (isVal) {
        return [
          item.id,
          item.dateStr,
          item.timeStr,
          `"${item.client.replace(/"/g, '""')}"`,
          `"${item.media.replace(/"/g, '""')}"`,
          `"${item.totem.replace(/"/g, '""')}"`,
          item.duration,
          'Valido - Horario Comercial',
        ];
      } else {
        return [
          item.id,
          item.dateStr,
          item.timeStr,
          `"${item.client.replace(/"/g, '""')}"`,
          `"${item.media.replace(/"/g, '""')}"`,
          `"${item.totem.replace(/"/g, '""')}"`,
          item.duration,
          `"${item.reason.replace(/"/g, '""')}"`,
          `"${item.detail.replace(/"/g, '""')}"`,
        ];
      }
    });

    const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    downloadCSV(filename, csvContent);
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
      
      {/* Tabs Header */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setTab('valid'); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'valid'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Exibições Auditadas (Válidas)
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
              {validPlays.length.toLocaleString('pt-BR')}
            </span>
          </button>

          <button
            onClick={() => { setTab('discarded'); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'discarded'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <XCircle className="w-4 h-4 text-amber-400" />
            Registros Descartados (Filtro)
            <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono">
              {discardedPlays.length.toLocaleString('pt-BR')}
            </span>
          </button>
        </div>

        {/* Export button */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          Exportar CSV Filtrado
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-slate-950/40 border-b border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, mídia, totem, data..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Media Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Mídia:</span>
            <select
              value={selectedMedia}
              onChange={(e) => { setSelectedMedia(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 max-w-[180px]"
            >
              <option value="all">Todas as mídias ({uniqueMedias.length})</option>
              {uniqueMedias.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Totem Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Totem:</span>
            <select
              value={selectedTotem}
              onChange={(e) => { setSelectedTotem(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 max-w-[180px]"
            >
              <option value="all">Todos os totens ({uniqueTotens.length})</option>
              {uniqueTotens.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
              <th className="py-3 px-4 w-14">#</th>
              <th className="py-3 px-4">Data & Horário</th>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Mídia / Campanha</th>
              <th className="py-3 px-4">Totem / Tela</th>
              <th className="py-3 px-4">Duração</th>
              <th className="py-3 px-4">
                {tab === 'valid' ? 'Status' : 'Motivo do Expurgo'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Nenhum registro encontrado para os filtros selecionados.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr 
                  key={row.id || idx} 
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {startIndex + idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-white font-medium">
                      {row.timeStr}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {row.dateStr}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">
                    {row.client}
                  </td>
                  <td className="py-3 px-4 text-cyan-300 font-medium max-w-xs truncate" title={row.media}>
                    {row.media}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {row.totem}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {row.duration}s
                  </td>
                  <td className="py-3 px-4">
                    {tab === 'valid' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[11px] font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Horário Válido
                      </span>
                    ) : (
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800 text-amber-400 text-[11px] font-medium">
                          <XCircle className="w-3 h-3" />
                          {row.reason}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {row.detail}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Mostrando <strong className="text-white">{filteredData.length > 0 ? startIndex + 1 : 0}</strong> a{' '}
          <strong className="text-white">{Math.min(startIndex + pageSize, filteredData.length)}</strong> de{' '}
          <strong className="text-white">{filteredData.length.toLocaleString('pt-BR')}</strong> registros
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span>Linhas por página:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              {[15, 25, 50, 100].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 hover:enabled:bg-slate-800 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              Página <strong className="text-white">{currentPage}</strong> de <strong className="text-white">{totalPages}</strong>
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 hover:enabled:bg-slate-800 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
