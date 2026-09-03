import React, { useState } from 'react';
import { 
  X, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Plus, 
  Save,
  HelpCircle
} from 'lucide-react';

export default function ContractGoalsModal({ 
  isOpen, 
  onClose, 
  mediaStats = [], 
  goalsMap = {}, 
  onSaveGoal 
}) {
  if (!isOpen) return null;

  const [localGoals, setLocalGoals] = useState({ ...goalsMap });

  const handleChange = (media, value) => {
    const num = parseInt(value, 10);
    setLocalGoals(prev => ({
      ...prev,
      [media]: isNaN(num) ? 0 : num,
    }));
  };

  const handleApplyAll = (amount) => {
    const num = parseInt(amount, 10);
    if (isNaN(num)) return;
    const updated = {};
    mediaStats.forEach(m => {
      updated[m.media] = num;
    });
    setLocalGoals(updated);
  };

  const handleSave = () => {
    Object.entries(localGoals).forEach(([media, goal]) => {
      onSaveGoal(media, goal);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-700/60 text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Metas & Cotas Contratadas por Mídia
              </h3>
              <p className="text-xs text-slate-400">
                Insira a quantidade de inserções contratada para cada cliente e comprove a entrega
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Bulk Setting */}
        <div className="py-3 px-4 my-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-300">
            Definir meta padrão para todas as mídias:
          </span>
          <div className="flex items-center gap-2">
            {[500, 1000, 2000, 5000].map(val => (
              <button
                key={val}
                onClick={() => handleApplyAll(val)}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-mono text-xs transition-all"
              >
                {val.toLocaleString('pt-BR')}
              </button>
            ))}
          </div>
        </div>

        {/* List of Media Campaigns */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {mediaStats.map((item, idx) => {
            const goal = localGoals[item.media] || 0;
            const percentage = goal > 0 ? ((item.plays / goal) * 100).toFixed(1) : null;
            const diff = goal > 0 ? item.plays - goal : 0;
            const isCompleted = goal > 0 && item.plays >= goal;

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-sm">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white truncate" title={item.media}>
                      {item.media}
                    </h4>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="text-slate-300 font-medium">{item.client}</span>
                    <span>•</span>
                    <span>Realizado auditado: <strong className="text-cyan-400 font-mono">{item.plays.toLocaleString('pt-BR')}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Cota Contratada
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={goal || ''}
                      onChange={(e) => handleChange(item.media, e.target.value)}
                      placeholder="Ex: 1000"
                      className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs text-right focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {goal > 0 && (
                    <div className="w-28 text-right">
                      <div className={`text-xs font-bold font-mono ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {percentage}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {diff >= 0 ? `+${diff} excedente` : `${diff} restante`}
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${Math.min(100, Math.max(0, Number(percentage)))}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {mediaStats.length} mídias identificadas no arquivo
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Metas
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
