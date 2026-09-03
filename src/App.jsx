import React, { useState } from 'react';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import AuditSummaryCards from './components/AuditSummaryCards';
import AuditRuleBanner from './components/AuditRuleBanner';
import MediaFrequencyCard from './components/MediaFrequencyCard';
import ChartsView from './components/ChartsView';
import DetailsCtaBanner from './components/DetailsCtaBanner';
import DetailsView from './components/DetailsView';
import ContractGoalsModal from './components/ContractGoalsModal';
import ContractGoalsSummary from './components/ContractGoalsSummary';
import { processCSVContent } from './utils/csvParser';
import { generateSampleCSV, downloadCSV } from './utils/sampleDataGenerator';
import { Sparkles, FileSpreadsheet, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [goalsMap, setGoalsMap] = useState({});
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'details'

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFileSelected = (file) => {
    setIsLoading(true);
    setErrorMsg(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const result = await processCSVContent(text);
        setData(result);
        setCurrentView('dashboard');
        showToast(`Arquivo "${file.name}" auditado! ${result.summary.totalValid.toLocaleString('pt-BR')} exibições válidas processadas.`);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message || 'Falha ao processar arquivo CSV.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Erro na leitura do arquivo local.');
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setFileName('amostra_exibicoes_totem_maio_2025.csv');

    try {
      const sampleText = generateSampleCSV();
      const result = await processCSVContent(sampleText);
      
      // Auto populate sample targets for the demo
      const initialGoals = {};
      if (result.mediaStats.length > 0) {
        initialGoals[result.mediaStats[0].media] = Math.round(result.mediaStats[0].plays * 0.95);
      }
      if (result.mediaStats.length > 1) {
        initialGoals[result.mediaStats[1].media] = Math.round(result.mediaStats[1].plays * 1.05);
      }
      if (result.mediaStats.length > 2) {
        initialGoals[result.mediaStats[2].media] = Math.round(result.mediaStats[2].plays * 0.9);
      }

      setGoalsMap(initialGoals);
      setData(result);
      setCurrentView('dashboard');
      showToast('Dados de demonstração carregados com sucesso! Veja a auditoria em ação.');
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro ao gerar dados de demonstração.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const csvContent = generateSampleCSV();
    downloadCSV('modelo_exibicoes_totem.csv', csvContent);
    showToast('Download do modelo CSV iniciado!');
  };

  const handleReset = () => {
    setData(null);
    setFileName('');
    setErrorMsg(null);
    setGoalsMap({});
    setCurrentView('dashboard');
  };

  const handleSaveGoal = (media, goal) => {
    setGoalsMap(prev => ({
      ...prev,
      [media]: goal,
    }));
  };

  const activeGoalsCount = Object.values(goalsMap).filter(v => v > 0).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 text-xs text-white animate-fade-in backdrop-blur-md">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main App Header with AC Display Logo and View Tabs */}
      <Header
        hasData={!!data}
        onReset={handleReset}
        onLoadSample={handleLoadSample}
        onDownloadSample={handleDownloadSample}
        onOpenGoals={() => setIsGoalsModalOpen(true)}
        totalValid={data?.summary?.totalValid || 0}
        goalsCount={activeGoalsCount}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!data ? (
          /* Upload State */
          <Dropzone
            onFileSelected={handleFileSelected}
            onLoadSample={handleLoadSample}
            onDownloadSample={handleDownloadSample}
            isLoading={isLoading}
          />
        ) : currentView === 'details' ? (
          /* VIEW 2: DEDICATED DETAILED MEDIA AUDIT PAGE */
          <DetailsView
            onBack={() => setCurrentView('dashboard')}
            validPlays={data.validPlays}
            discardedPlays={data.discardedPlays}
            summary={data.summary}
          />
        ) : (
          /* VIEW 1: EXECUTIVE DASHBOARD */
          <div className="space-y-6 animate-fade-in">
            
            {/* KPI Cards */}
            <AuditSummaryCards
              summary={data.summary}
              periodStart={data.summary.periodStart}
              periodEnd={data.summary.periodEnd}
            />

            {/* Strict Business Rule Banner */}
            <AuditRuleBanner
              discardReasons={data.discardReasons}
              totalDiscarded={data.summary.totalDiscarded}
            />

            {/* NEW: Media Frequency & Averages Card (Media by Media & Separated by Totem) */}
            <MediaFrequencyCard
              mediaFrequencyStats={data.mediaFrequencyStats}
              totemFrequencyStats={data.totemFrequencyStats}
              summary={data.summary}
            />

            {/* Contract Goals Summary / Widget */}
            <ContractGoalsSummary
              mediaStats={data.mediaStats}
              goalsMap={goalsMap}
              onOpenGoalsModal={() => setIsGoalsModalOpen(true)}
            />

            {/* Analytics Charts */}
            <ChartsView
              mediaStats={data.mediaStats}
              clientStats={data.clientStats}
              timelineStats={data.timelineStats}
              hourStats={data.hourStats}
              dayOfWeekStats={data.dayOfWeekStats}
              totemStats={data.totemStats}
              discardReasons={data.discardReasons}
              goalsMap={goalsMap}
            />

            {/* CTA Banner to Open Full Detailed List on a Separate Page */}
            <DetailsCtaBanner
              onOpenDetails={() => {
                setCurrentView('details');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              totalValid={data.summary.totalValid}
              totalDiscarded={data.summary.totalDiscarded}
            />

          </div>
        )}

      </main>

      {/* Contract Goals Configuration Modal */}
      {data && (
        <ContractGoalsModal
          isOpen={isGoalsModalOpen}
          onClose={() => setIsGoalsModalOpen(false)}
          mediaStats={data.mediaStats}
          goalsMap={goalsMap}
          onSaveGoal={handleSaveGoal}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 mt-12 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/logo-ac.png" alt="AC Display" className="h-4 w-auto opacity-70" />
            <span className="font-semibold text-slate-400">MediaDesk • AC Display</span>
            <span>•</span>
            <span>Auditoria OOH para Totens Publicitários</span>
          </div>
          <div>
            Filtro ativo: Seg-Sáb 10h-22h | Dom 12h-22h • Processamento 100% local
          </div>
        </div>
      </footer>

    </div>
  );
}
