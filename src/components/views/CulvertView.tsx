import React, { useState } from 'react';
import { Project, Language, CulvertType } from '../../types';
import { translations } from '../../i18n';
import {
  Pipette,
  Layers,
  Calculator,
  ShieldCheck,
  AlertCircle,
  Sliders,
  CheckCircle2,
  BoxSelect,
  Circle,
  ArrowRight
} from 'lucide-react';

interface CulvertViewProps {
  activeProject: Project | null;
  onUpdateProject: (project: Project) => void;
  language: Language;
}

export const CulvertView: React.FC<CulvertViewProps> = ({
  activeProject,
  onUpdateProject,
  language,
}) => {
  const t = translations[language];

  // Sizing mode: Circular Pipe or Rectangular Box
  const [selectedType, setSelectedType] = useState<CulvertType>('CIRCULAR_PIPE');

  // Circular Pipe Test Inputs (Section 17 & 35)
  const [pipeDiameterMm, setPipeDiameterMm] = useState<number>(1200);
  const [pipeBarrels, setPipeBarrels] = useState<number>(1);
  const [pipeSlope, setPipeSlope] = useState<number>(2.0); // %
  const [pipeManning, setPipeManning] = useState<number>(0.014);
  const [pipeDesignQ, setPipeDesignQ] = useState<number>(1.50); // m3/s

  // Rectangular Box Culvert Test Inputs (Section 18 & 36)
  const [boxWidthM, setBoxWidthM] = useState<number>(2.0);
  const [boxHeightM, setBoxHeightM] = useState<number>(2.0);
  const [boxCells, setBoxCells] = useState<number>(2);
  const [boxSlope, setBoxSlope] = useState<number>(1.5); // %
  const [boxManning, setBoxManning] = useState<number>(0.014);
  const [boxDesignQ, setBoxDesignQ] = useState<number>(6.672); // m3/s

  // Circular Manning Calculations:
  // d in meters
  const dM = pipeDiameterMm / 1000;
  const pipeRadius = dM / 2;
  const pipeArea = Math.PI * Math.pow(pipeRadius, 2);
  const pipePerimeter = Math.PI * dM;
  const pipeHydRadius = pipeArea / pipePerimeter; // = d / 4
  const pipeSlopeDec = pipeSlope / 100;
  // Manning Q = (1/n) * A * R^(2/3) * S^(1/2)
  const pipeSingleCapacity = (1 / pipeManning) * pipeArea * Math.pow(pipeHydRadius, 2 / 3) * Math.sqrt(pipeSlopeDec);
  const pipeTotalCapacity = pipeSingleCapacity * pipeBarrels;
  const pipeVelocity = pipeTotalCapacity / (pipeArea * pipeBarrels);
  const pipeCapacityRatio = pipeDesignQ > 0 ? pipeTotalCapacity / pipeDesignQ : 1;

  // Box Manning Calculations:
  // A = B * H, P = B + 2H, R = A / P
  const boxSingleArea = boxWidthM * boxHeightM;
  const boxTotalArea = boxSingleArea * boxCells;
  const boxPerimeter = boxWidthM + 2 * boxHeightM; // open top wetted perimeter under free surface or 2B + 2H full flowing
  const boxHydRadius = boxSingleArea / boxPerimeter;
  const boxSlopeDec = boxSlope / 100;
  const boxSingleCapacity = (1 / boxManning) * boxSingleArea * Math.pow(boxHydRadius, 2 / 3) * Math.sqrt(boxSlopeDec);
  const boxTotalCapacity = boxSingleCapacity * boxCells;
  const boxVelocity = boxTotalCapacity / boxTotalArea;
  const boxCapacityRatio = boxDesignQ > 0 ? boxTotalCapacity / boxDesignQ : 1;

  if (!activeProject) return null;

  return (
    <div className="space-y-6">
      {/* Header Bento Card */}
      <div className="bg-[#1a252f] text-white border border-[#0d141b] p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2 text-[#3498db] text-xs font-bold uppercase tracking-wider mb-1">
          <Pipette className="w-4 h-4" />
          <span>{language === 'mn' ? 'АЛХАМ 9 - 12: ХООЛОЙН ГИДРАВЛИК ТООЦОО' : 'STEPS 9 - 12: CULVERT HYDRAULIC SIZING'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          {language === 'mn' ? 'Дугуй ба Дөрвөлжин Хоолойн Гидравлик Чадавхи' : 'Circular Pipe & Rectangular Box Culvert Hydraulic CAD'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {language === 'mn'
            ? 'Маннингийн тэгшитгэл, урсац нэвтрүүлэх чадвар (Qcap), хурд (V), болон шаардагдах нүхний хэмжээс сонголт.'
            : 'Separate rigorous geometric formulations for circular pipe and multi-cell rectangular box culverts.'}
        </p>
      </div>

      {/* Culvert Type Selector Switch (Bento Pills) */}
      <div className="flex p-1 bg-gray-200/80 rounded-xl max-w-md">
        <button
          onClick={() => setSelectedType('CIRCULAR_PIPE')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center space-x-2 rounded-lg transition ${
            selectedType === 'CIRCULAR_PIPE'
              ? 'bg-[#3498db] text-white shadow-sm'
              : 'text-gray-600 hover:text-[#1a1a1a]'
          }`}
        >
          <Circle className="w-4 h-4" />
          <span>{t.culvert.circular}</span>
        </button>

        <button
          onClick={() => setSelectedType('RECTANGULAR_BOX')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center space-x-2 rounded-lg transition ${
            selectedType === 'RECTANGULAR_BOX'
              ? 'bg-[#3498db] text-white shadow-sm'
              : 'text-gray-600 hover:text-[#1a1a1a]'
          }`}
        >
          <BoxSelect className="w-4 h-4" />
          <span>{t.culvert.box}</span>
        </button>
      </div>

      {/* Circular Pipe Module */}
      {selectedType === 'CIRCULAR_PIPE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-bold text-[#1a252f] text-base flex items-center space-x-2">
              <Circle className="w-4 h-4 text-[#3498db]" />
              <span>{language === 'mn' ? 'Дугуй хоолойн өгөгдөл' : 'Circular Pipe Design Parameters'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  {t.culvert.diameter}
                </label>
                <select
                  value={pipeDiameterMm}
                  onChange={(e) => setPipeDiameterMm(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a1a1a] font-mono focus:border-[#3498db] focus:outline-none"
                >
                  <option value={300}>300 мм (0.3м)</option>
                  <option value={400}>400 мм (0.4м)</option>
                  <option value={500}>500 мм (0.5м)</option>
                  <option value={600}>600 мм (0.6м)</option>
                  <option value={800}>800 мм (0.8м)</option>
                  <option value={1000}>1000 мм (1.0м)</option>
                  <option value={1200}>1200 мм (1.2м)</option>
                  <option value={1500}>1500 мм (1.5м)</option>
                  <option value={1800}>1800 мм (1.8м)</option>
                  <option value={2000}>2000 мм (2.0м)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  {t.culvert.barrels}
                </label>
                <select
                  value={pipeBarrels}
                  onChange={(e) => setPipeBarrels(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a1a1a] font-mono focus:border-[#3498db] focus:outline-none"
                >
                  <option value={1}>1 нүх (Single barrel)</option>
                  <option value={2}>2 нүх (Double barrel)</option>
                  <option value={3}>3 нүх (Triple barrel)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  {t.culvert.slope}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={pipeSlope}
                  onChange={(e) => setPipeSlope(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a1a1a] font-mono focus:border-[#3498db] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  {t.culvert.manning}
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={pipeManning}
                  onChange={(e) => setPipeManning(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a1a1a] font-mono focus:border-[#3498db] focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold mb-1">
                  {t.culvert.requiredQ}
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={pipeDesignQ}
                  onChange={(e) => setPipeDesignQ(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a1a1a] font-mono focus:border-[#3498db] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Circular Calculation Results in Dark Bento Panel */}
          <div className="bg-[#1a252f] text-white border border-[#0d141b] p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{language === 'mn' ? 'Гидравлик үр дүн' : 'Calculated Hydraulic Capacity'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#2c3e50] border border-[#34495e] rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{language === 'mn' ? 'Талбай (A)' : 'Flow Area (A)'}</span>
                <span className="text-sm font-bold text-white">{(pipeArea * pipeBarrels).toFixed(3)} м²</span>
              </div>
              <div className="p-3 bg-[#2c3e50] border border-[#34495e] rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{language === 'mn' ? 'Гидравлик радиус (R)' : 'Hydraulic Radius (R)'}</span>
                <span className="text-sm font-bold text-[#3498db]">{pipeHydRadius.toFixed(3)} м</span>
              </div>
              <div className="p-3 bg-[#2c3e50] border border-[#34495e] rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{t.culvert.velocity}</span>
                <span className="text-sm font-bold text-[#e67e22]">{pipeVelocity.toFixed(2)} м/с</span>
              </div>
              <div className="p-3 bg-[#2c3e50] border border-[#34495e] rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{t.culvert.capacity}</span>
                <span className="text-sm font-bold text-emerald-400">{pipeTotalCapacity.toFixed(2)} м³/с</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              pipeCapacityRatio >= 1.0
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                : 'bg-red-950/80 border-red-700 text-red-300'
            }`}>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider">
                  {pipeCapacityRatio >= 1.0 ? t.culvert.adequate : t.culvert.inadequate}
                </span>
                <p className="text-[11px] opacity-90 mt-0.5 font-mono">
                  Qcap / Qreq = {pipeCapacityRatio.toFixed(2)}x (Required {pipeDesignQ.toFixed(2)} м³/с)
                </p>
              </div>
              <span className="text-xl font-mono font-bold">
                {(pipeCapacityRatio * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Rectangular Box Culvert Module */}
      {selectedType === 'RECTANGULAR_BOX' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-bold text-[#1a252f] text-base flex items-center space-x-2">
              <BoxSelect className="w-4 h-4 text-[#3498db]" />
              <span>{language === 'mn' ? 'Дөрвөлжин хоолойн өгөгдөл (Box Culvert)' : 'Box Culvert Design Parameters'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  {t.culvert.width} (Clear Width)
                </label>
                <select
                  value={boxWidthM}
                  onChange={(e) => setBoxWidthM(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a1a1a] font-mono focus:border-[#3498db] focus:outline-none"
                >
                  <option value={1.0}>1.0 м</option>
                  <option value={1.5}>1.5 м</option>
                  <option value={2.0}>2.0 м</option>
                  <option value={2.5}>2.5 м</option>
                  <option value={3.0}>3.0 м</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  {t.culvert.height} (Clear Height)
                </label>
                <select
                  value={boxHeightM}
                  onChange={(e) => setBoxHeightM(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a1a1a] font-mono focus:border-[#3498db] focus:outline-none"
                >
                  <option value={1.0}>1.0 м</option>
                  <option value={1.5}>1.5 м</option>
                  <option value={2.0}>2.0 м</option>
                  <option value={2.5}>2.5 м</option>
                  <option value={3.0}>3.0 м</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  {t.culvert.barrels} (Cells)
                </label>
                <select
                  value={boxCells}
                  onChange={(e) => setBoxCells(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a1a1a] font-mono focus:border-[#3498db] focus:outline-none"
                >
                  <option value={1}>1 нүх (1-Cell Box)</option>
                  <option value={2}>2 нүх (2-Cell Box)</option>
                  <option value={3}>3 нүх (3-Cell Box)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  {t.culvert.slope}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={boxSlope}
                  onChange={(e) => setBoxSlope(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a1a1a] font-mono focus:border-[#3498db] focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold mb-1">
                  {t.culvert.requiredQ} (Design Peak Q)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={boxDesignQ}
                  onChange={(e) => setBoxDesignQ(Number(e.target.value))}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a1a1a] font-mono focus:border-[#3498db] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Box Calculation Results in Dark Bento Panel */}
          <div className="bg-[#1a252f] text-white border border-[#0d141b] p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{language === 'mn' ? 'Гидравлик үр дүн (Box Culvert)' : 'Box Culvert Hydraulic Output'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#2c3e50] border border-[#34495e] rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{language === 'mn' ? 'Нийт огтлолын талбай' : 'Total Flow Area (A)'}</span>
                <span className="text-sm font-bold text-white">{boxTotalArea.toFixed(2)} м²</span>
              </div>
              <div className="p-3 bg-[#2c3e50] border border-[#34495e] rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{language === 'mn' ? 'Гидравлик радиус (R)' : 'Hydraulic Radius (R)'}</span>
                <span className="text-sm font-bold text-[#3498db]">{boxHydRadius.toFixed(3)} м</span>
              </div>
              <div className="p-3 bg-[#2c3e50] border border-[#34495e] rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{t.culvert.velocity}</span>
                <span className="text-sm font-bold text-[#e67e22]">{boxVelocity.toFixed(2)} м/с</span>
              </div>
              <div className="p-3 bg-[#2c3e50] border border-[#34495e] rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{t.culvert.capacity}</span>
                <span className="text-sm font-bold text-emerald-400">{boxTotalCapacity.toFixed(2)} м³/с</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              boxCapacityRatio >= 1.0
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                : 'bg-red-950/80 border-red-700 text-red-300'
            }`}>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider">
                  {boxCapacityRatio >= 1.0 ? t.culvert.adequate : t.culvert.inadequate}
                </span>
                <p className="text-[11px] opacity-90 mt-0.5 font-mono">
                  Qcap / Qreq = {boxCapacityRatio.toFixed(2)}x (Required {boxDesignQ.toFixed(2)} м³/с)
                </p>
              </div>
              <span className="text-xl font-mono font-bold">
                {(boxCapacityRatio * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
