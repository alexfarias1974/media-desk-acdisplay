import React from 'react';
import { Target, CheckCircle2, AlertTriangle, Plus, Sparkles } from 'lucide-react';

export default function ContractGoalsSummary({ mediaStats = [], goalsMap = {}, onOpenGoalsModal }) {
  const mediaWithGoals = mediaStats.filter(m => goalsMap[m.media] && goalsMap[m.media] > 0);

  if (mediaWithGoals.length === 0) {
    return (
      <div className="rounded-2xl bg-indigo-950/20 border border-indigo-900/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-900/60 border border-indigo-700/50 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              Controle de Cotas & Metas Contratadas
            </h4>
            <p className="text-xs text-slate-300">
              Seus clientes contrataram uma quantidade específica de inserções? Defina as metas para acompanhar a entrega percentual.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenGoalsModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Configurar Cotas Contratadas
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">
            Auditoria de Cumprimento de Metas Contratadas ({mediaWithGoals.length})
          </h3>
        </div>
        <button
          onClick={onOpenGoalsModal}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Ajustar Metas
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {mediaWithGoals.map((m, idx) => {
          const goal = goalsMap[m.media];
          const delivered = m.plays;
          const percentage = ((delivered / goal) * 100).toFixed(1);
          const isDone = delivered >= goal;
          const diff = delivered - goal;

          return (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="truncate">
                  <h5 className="text-xs font-semibold text-white truncate" title={m.media}>
                    {m.media}
                  </h5>
                  <p className="text-[11px] text-slate-400 truncate">{m.client}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono flex items-center gap-1 ${
                  isDone 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {isDone ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                  {percentage}%
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  <strong className="text-cyan-400">{delivered.toLocaleString('pt-BR')}</strong> / {goal.toLocaleString('pt-BR')}
                </span>
                <span className={`text-[11px] font-medium ${isDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isDone ? `+${diff} acima` : `${Math.abs(diff)} pendente`}
                </span>
              </div>

              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, Math.max(0, Number(percentage)))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
