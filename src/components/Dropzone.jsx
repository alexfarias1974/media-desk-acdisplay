import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileCheck2,
  Lock
} from 'lucide-react';

export default function Dropzone({ onFileSelected, onLoadSample, onDownloadSample, isLoading }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setErrorMsg(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcess(files[0]);
    }
  };

  const handleFileChange = (e) => {
    setErrorMsg(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcess(files[0]);
    }
  };

  const validateAndProcess = (file) => {
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setErrorMsg('Por favor, selecione um arquivo válido no formato .CSV.');
      return;
    }
    onFileSelected(file);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Hero Presentation */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 text-xs font-medium mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          Auditoria Automatizada para Clientes de Totens
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Comprove as Exibições de Mídia com{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">
            Precisão Total
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Importe a planilha CSV do seu software de gerenciamento de totens. Nosso motor inteligente expurga automaticamente qualquer inserção fora do horário comercial contratado e entrega relatórios e gráficos auditados.
        </p>
      </div>

      {/* Strict Rule Card */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/20 shadow-lg shadow-cyan-950/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-700/50 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                Filtro de Horário Rigorosamente Ativo
              </h4>
              <p className="text-xs text-slate-300">
                Apenas são consideradas para o relatório as exibições no intervalo comercial:
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Segunda a Sábado: 10:00h às 22:00h
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Domingo: 12:00h às 22:00h
            </span>
          </div>
        </div>
      </div>

      {/* Main Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01] shadow-2xl shadow-cyan-500/20'
            : 'border-slate-800 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-900/70'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,text/csv"
          className="hidden"
        />

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <UploadCloud className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300" />
        </div>

        <h3 className="text-lg font-semibold text-white mb-1">
          {isLoading ? 'Processando e auditando arquivo...' : 'Arraste e solte sua planilha CSV aqui'}
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          ou <span className="text-cyan-400 underline decoration-cyan-500/50 underline-offset-4 group-hover:text-cyan-300 font-medium">clique para selecionar do seu computador</span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">Formato CSV</span>
          <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">Separador vírgula ou ponto e vírgula</span>
          <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">Detecção automática de colunas</span>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center justify-center gap-2 max-w-md mx-auto">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Alternative actions */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400">
        <span>Não tem o arquivo em mãos agora?</span>
        <div className="flex items-center gap-3">
          <button
            onClick={onLoadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-800/60 font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Carregar dados de demonstração
          </button>
          <button
            onClick={onDownloadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
            Baixar modelo CSV
          </button>
        </div>
      </div>

      {/* Security & Privacy note */}
      <div className="mt-10 pt-6 border-t border-slate-900 flex items-center justify-center gap-2 text-xs text-slate-400">
        <Lock className="w-3.5 h-3.5 text-slate-400" />
        <span>Auditoria 100% privada e local: nenhum dado de clientes ou exibições sai do seu navegador.</span>
      </div>
    </div>
  );
}
