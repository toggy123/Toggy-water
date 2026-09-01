import React, { useState } from 'react';
import { Project, Language } from '../../types';
import { translations } from '../../i18n';
import {
  Mountain,
  Layers,
  ArrowDownRight,
  TrendingDown,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Activity,
  Cpu
} from 'lucide-react';

interface TerrainViewProps {
  activeProject: Project | null;
  onUpdateProject: (project: Project) => void;
  language: Language;
}

export const TerrainView: React.FC<TerrainViewProps> = ({
  activeProject,
  onUpdateProject,
  language,
}) => {
  const t = translations[language];
  const [threshold, setThreshold] = useState<number>(
    activeProject?.calculationSettings?.flowAccumulationThreshold || 500
  );
  const [method, setMethod] = useState<'D8' | 'D_INFINITY'>('D8');
  const [sinkFilled, setSinkFilled] = useState<boolean>(true);

  if (!activeProject) return null;

  const handleUpdateSettings = () => {
    const updated: Project = {
      ...activeProject,
      calculationSettings: {
        ...activeProject.calculationSettings,
        flowAccumulationThreshold: threshold,
      },
      demData: activeProject.demData
        ? {
            ...activeProject.demData,
            accumulationThreshold: threshold,
            flowDirectionMethod: method,
            sinkFilled: sinkFilled,
          }
        : undefined,
    };
    onUpdateProject(updated);
  };

  return (
    <div className="space-y-6">
      {/* Title Header Bento Box */}
      <div className="bg-[#1a252f] text-white border border-[#0d141b] p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2 text-[#3498db] text-xs font-bold uppercase tracking-wider mb-1">
          <Mountain className="w-4 h-4" />
          <span>{language === 'mn' ? 'АЛХАМ 4: ГАДАРГУУ БОЛОВСРУУЛАЛТ' : 'STEP 4: TERRAIN PREPROCESSING'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          {language === 'mn' ? 'Гадаргуугийн DEM, D8 Урсгалын Чиглэл ба Хуримтлал' : 'DEM Preprocessing, D8 Flow Direction & Accumulation'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {language === 'mn'
            ? 'Хонхор хотгорыг тэгшитгэх (Fill sinks), D8 алгоритмоор эсийн урсгалын чиглэлийг тооцоолж, байгалийн усны сүлжээг ялгах.'
            : 'Depression filling, standard grid-based D8 flow routing, and drainage accumulation threshold screening.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Processing Controls */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-5 shadow-sm">
          <h3 className="font-bold text-[#1a252f] text-base flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#3498db]" />
            <span>{language === 'mn' ? 'Боловсруулалтын модуль' : 'Preprocessing Engine'}</span>
          </h3>

          {/* Fill Sinks */}
          <div className="p-3.5 bg-[#f8f9fa] border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1a252f]">
                {language === 'mn' ? '1. Хонхор дүүргэх (Fill Sinks)' : '1. Fill Sinks / Depressions'}
              </span>
              <input
                type="checkbox"
                checked={sinkFilled}
                onChange={(e) => setSinkFilled(e.target.checked)}
                className="rounded text-[#3498db] focus:ring-[#3498db] w-4 h-4 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">
              {language === 'mn'
                ? 'Байгалийн ус гадагшлах урсгал тасалдахгүй байх нөхцлийг хангана.'
                : 'Eliminates artificial pits to ensure continuous surface drainage routing.'}
            </p>
          </div>

          {/* Flow Direction Algorithm */}
          <div className="p-3.5 bg-[#f8f9fa] border border-gray-200 rounded-xl space-y-2">
            <label className="block text-xs font-bold text-[#1a252f]">
              {language === 'mn' ? '2. Урсгалын чиглэлийн арга' : '2. Flow Direction Algorithm'}
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as 'D8' | 'D_INFINITY')}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-[#1a1a1a] focus:border-[#3498db] focus:outline-none"
            >
              <option value="D8">D8 (Standard 8-Direction Grid)</option>
              <option value="D_INFINITY">D-Infinity (Multi-Directional / Experimental)</option>
            </select>
            <p className="text-[10px] text-[#3498db] font-mono font-bold">
              Selected Method: {method}
            </p>
          </div>

          {/* Flow Accumulation Threshold */}
          <div className="p-3.5 bg-[#f8f9fa] border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1a252f]">
                {language === 'mn' ? '3. Ус цуглах босго (Threshold)' : '3. Accumulation Threshold'}
              </label>
              <span className="text-xs font-mono font-bold text-[#3498db]">
                {threshold} cells
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="5000"
              step="50"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3498db]"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>100 (Нарийн жалга)</span>
              <span>1000 (Гол сайр)</span>
              <span>5000 (Том гол)</span>
            </div>
          </div>

          <button
            onClick={handleUpdateSettings}
            className="w-full py-2.5 rounded-xl bg-[#3498db] hover:bg-[#2980b9] text-white text-xs font-semibold shadow-md transition"
          >
            {language === 'mn' ? 'Тохиргоог шинэчилж тооцоолох' : 'Update Terrain Processing'}
          </button>
        </div>

        {/* Right 2 Columns: Elevation & D8 Simulation Matrix Display */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#1a252f] text-base flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>{language === 'mn' ? 'Өндөржилт ба Сайрын Сүлжээний Растер' : 'Terrain Grid & Stream Raster Matrix'}</span>
            </h3>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#f8f9fa] text-gray-700 border border-gray-200">
              10m Cell Res / D8 Ready
            </span>
          </div>

          {/* Interactive Visual Canvas / Matrix Representation in Dark Bento Screen */}
          <div className="h-64 rounded-xl bg-[#1a252f] border border-[#0d141b] p-4 relative overflow-hidden flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>Min: {activeProject.demData?.minElevation || 750}m</span>
              <span className="text-[#3498db] font-bold">Natural Drainage Channels (D8)</span>
              <span>Max: {activeProject.demData?.maxElevation || 920}m</span>
            </div>

            {/* Synthetic Elevation Heatmap graphic representation */}
            <div className="grid grid-cols-12 gap-1 my-auto opacity-90">
              {Array.from({ length: 48 }).map((_, i) => {
                const elev = 750 + Math.sin(i / 4) * 70 + (i % 6) * 15;
                const isStream = i % 7 === 0 || i % 11 === 0;
                return (
                  <div
                    key={i}
                    title={`Cell #${i}: Elev ${elev.toFixed(1)}m ${isStream ? '(Stream Cell)' : ''}`}
                    className={`h-4 rounded-sm transition-all hover:scale-110 cursor-pointer ${
                      isStream
                        ? 'bg-[#3498db] shadow-sm shadow-blue-400'
                        : elev > 850
                        ? 'bg-[#e67e22]'
                        : elev > 800
                        ? 'bg-emerald-600'
                        : 'bg-emerald-800'
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-slate-700">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded bg-[#3498db] inline-block" />
                <span>{language === 'mn' ? 'Ус хуримтлагдах сайр' : 'Accumulated Drainage Channel'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
                <span>{language === 'mn' ? 'Энгэр, бэл' : 'Hillside Slope'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded bg-[#e67e22] inline-block" />
                <span>{language === 'mn' ? 'Уулын нуруу' : 'Ridge Watershed Divide'}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-[#f8f9fa] rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1">
            <span className="font-bold text-[#3498db]">
              {language === 'mn' ? 'D8 Алгоритмын тайлбар:' : 'D8 Algorithmic Logic:'}
            </span>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              {language === 'mn'
                ? 'Нүд бүрээс хамгийн огцом уналттай зэргэлдээх 8 нүдний чиглэлийг 1-8 кодоор тодорхойлж, замын трасстай огтлолцох цэгүүдийг олдог.'
                : 'Determines the steepest downward slope among 8 surrounding neighbor cells to trace natural hydraulic flow paths across the terrain.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
