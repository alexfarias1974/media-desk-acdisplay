import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CalendarDays, 
  Tv, 
  FilterX, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

// Modern neon-inspired color palette for charts
const COLORS = [
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#6366f1', // indigo-500
  '#14b8a6', // teal-500
];

const DISCARD_COLORS = ['#f59e0b', '#ef4444', '#f97316', '#e11d48'];

// Custom Tooltip for Recharts
function CustomTooltip({ active, payload, label, unit = 'exibições' }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-slate-900/95 border border-slate-700 p-3 shadow-2xl shadow-black/80 text-xs backdrop-blur-md">
        <p className="font-semibold text-white mb-1.5 border-b border-slate-800 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.name}:
            </span>
            <span className="font-bold text-white font-mono">
              {entry.value?.toLocaleString('pt-BR')} {unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function ChartsView({
  mediaStats = [],
  clientStats = [],
  timelineStats = [],
  hourStats = [],
  dayOfWeekStats = [],
  totemStats = [],
  discardReasons = [],
  goalsMap = {},
}) {
  const [activeTab, setActiveTab] = useState('ranking');

  // Top 10 Medias for bar chart
  const topMedias = mediaStats.slice(0, 10).map(m => ({
    name: m.media.length > 22 ? m.media.substring(0, 20) + '...' : m.media,
    fullName: m.media,
    plays: m.plays,
    client: m.client,
    goal: goalsMap[m.media] || null,
  }));

  // Top 8 Totens
  const topTotens = totemStats.slice(0, 8);

  return (
    <div className="space-y-6">
      
      {/* Visual Navigation Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ranking'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Mídias & Metas
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'timeline'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Evolução Diária
          </button>

          <button
            onClick={() => setActiveTab('hours')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'hours'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Horários 24h & Filtro
          </button>

          <button
            onClick={() => setActiveTab('days')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'days'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Dias da Semana
          </button>

          <button
            onClick={() => setActiveTab('totems')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'totems'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            Totens & Telas
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Dados auditados e livres de contaminação fora de horário
        </span>
      </div>

      {/* TAB 1: Ranking de Mídias & Campanhas */}
      {activeTab === 'ranking' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Top Mídias com Mais Exibições Válidas
                </h3>
                <p className="text-xs text-slate-400">
                  Volume de inserções computadas dentro da janela comercial permitida
                </p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topMedias} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="plays" name="Exibições Válidas" radius={[0, 6, 6, 0]}>
                    {topMedias.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Share of voice / Distribution per client */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                Participação por Cliente
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Share de exibições entre as marcas anunciantes
              </p>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clientStats}
                      dataKey="plays"
                      nameKey="client"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {clientStats.map((_, index) => (
                        <Cell key={`client-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Client quick list */}
            <div className="space-y-2 mt-2 max-h-36 overflow-y-auto pr-1">
              {clientStats.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                  <span className="flex items-center gap-1.5 text-slate-300 truncate max-w-[150px]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {c.client}
                  </span>
                  <span className="font-semibold text-white font-mono">
                    {c.plays.toLocaleString('pt-BR')} exibições
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Evolução Diária (Timeline) */}
      {activeTab === 'timeline' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Evolução Diária das Exibições no Período
              </h3>
              <p className="text-xs text-slate-400">
                Constância e distribuição das veiculações ao longo do mês contratado
              </p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineStats} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="displayDate" 
                  stroke="#64748b" 
                  tick={{ fontSize: 11 }} 
                  angle={-25} 
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="plays" 
                  name="Exibições Válidas" 
                  stroke="#06b6d4" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorPlays)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 3: Horários 24h & Filtro (Mostra o contraste das regras) */}
      {activeTab === 'hours' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Distribuição de Exibições por Hora do Dia (00:00h às 23:00h)
                </h3>
                <p className="text-xs text-slate-400">
                  Comparação direta: Barras verdes/azuis indicam o horário válido; barras âmbar indicam as mídias expurgadas pelo filtro.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-3 h-3 rounded bg-cyan-500 inline-block" />
                  Horário Permitido (10h-22h / 12h-22h)
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                  Expurgado pelo Filtro
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourStats} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="validPlays" name="Válidas (Janela Comercial)" fill="#06b6d4" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="discardedPlays" name="Expurgadas (Fora do Horário)" fill="#f59e0b" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Motivos de Descarte Detalhados */}
          {discardReasons && discardReasons.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <FilterX className="w-4 h-4 text-amber-400" />
                  Proporção de Descarte por Motivo
                </h4>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={discardReasons}
                        dataKey="count"
                        nameKey="reason"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        innerRadius={35}
                        paddingAngle={4}
                      >
                        {discardReasons.map((_, index) => (
                          <Cell key={`discard-${index}`} fill={DISCARD_COLORS[index % DISCARD_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip unit="registros" />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-center">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Por que essa auditoria é essencial?
                </h4>
                <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Madrugadas & Fechamento:</strong> Totens podem continuar em looping quando o shopping ou estabelecimento está fechado. Esses números não geram impacto para o anunciante.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Domingos:</strong> Padrão de abertura tardia (12:00h). Inserções matinais de domingo são rigorosamente excluídas do relatório.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span><strong>Transparência com o Cliente:</strong> Seu relatório comercial tem credibilidade blindada com os anunciantes.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Dias da Semana */}
      {activeTab === 'days' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-cyan-400" />
                Exibições Válidas por Dia da Semana
              </h3>
              <p className="text-xs text-slate-400">
                Comparativo de volume entre dias úteis e finais de semana
              </p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekStats} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="plays" name="Exibições Válidas" fill="#38bdf8" radius={[6, 6, 0, 0]}>
                  {dayOfWeekStats.map((entry, index) => (
                    <Cell 
                      key={`day-${index}`} 
                      fill={entry.index === 0 ? '#818cf8' : entry.index === 6 ? '#38bdf8' : '#0284c7'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 5: Totens & Telas */}
      {activeTab === 'totems' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tv className="w-4 h-4 text-cyan-400" />
                Volume de Exibições por Totem / Ponto
              </h3>
              <p className="text-xs text-slate-400">
                Distribuição das veiculações entre as diferentes telas instaladas
              </p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTotens} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis 
                  type="category" 
                  dataKey="totem" 
                  stroke="#94a3b8" 
                  tick={{ fontSize: 11 }} 
                  width={160}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="plays" name="Exibições Válidas" fill="#6366f1" radius={[0, 6, 6, 0]}>
                  {topTotens.map((_, index) => (
                    <Cell key={`totem-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}
