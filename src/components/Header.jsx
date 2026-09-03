import React from 'react';
import logoAc from '../assets/logo-ac.png';
import { 
  Clock, 
  ShieldCheck, 
  Upload, 
  FileSpreadsheet, 
  Sparkles, 
  RotateCcw, 
  Printer, 
  Target,
  LayoutDashboard,
  TableProperties
} from 'lucide-react';

export default function Header({ 
  hasData, 
  onReset, 
  onLoadSample, 
  onDownloadSample, 
  onOpenGoals, 
  totalValid,
  goalsCount,
  currentView,
  onViewChange,
}) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Official AC Display Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img 
              src={logoAc} 
              alt="AC Display" 
              className="h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,0,128,0.35)]"
            />
            <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Media<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400">Desk</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-800/60">
                AC Display
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Auditoria & Inteligência de Exibição em Totens
            </p>
          </div>
        </div>

        {/* View Switcher Navigation (when data is loaded) */}
        {hasData && (
          <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs shadow-inner">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard Geral
            </button>

            <button
              onClick={() => onViewChange('details')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                currentView === 'details'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              Detalhamento das Mídias
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-cyan-300 text-[10px] font-mono border border-slate-700">
                {totalValid.toLocaleString('pt-BR')}
              </span>
            </button>
          </div>
        )}

        {/* Business Rule Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Clock className="w-3 h-3 text-cyan-400 ml-1" />
          <span>
            <strong className="text-white font-medium">Janela:</strong> Seg-Sáb 10h-22h • Dom 12h-22h
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {!hasData ? (
            <>
              <button
                onClick={onLoadSample}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-500 hover:opacity-90 text-white shadow-md shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Carregar Exemplo
              </button>
              <button
                onClick={onDownloadSample}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all"
                title="Baixar planilha CSV de modelo para testes"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                Baixar Modelo CSV
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onOpenGoals}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 transition-all"
              >
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Metas Contratadas
                {goalsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px]">
                    {goalsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all no-print"
                title="Imprimir ou Salvar em PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                Imprimir / PDF
              </button>

              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-900/60 transition-all no-print"
                title="Limpar e carregar outro arquivo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Novo Arquivo
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
