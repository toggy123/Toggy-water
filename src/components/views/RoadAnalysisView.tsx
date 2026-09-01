import React, { useState } from 'react';
import { Project, DrainageCrossingPoint, Language, NavigationTab } from '../../types';
import { translations } from '../../i18n';
import {
  Route,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  ArrowDownRight,
  TrendingDown,
  Mountain,
  Compass,
  Sliders,
  Eye
} from 'lucide-react';

interface RoadAnalysisViewProps {
  activeProject: Project | null;
  onUpdateProject: (project: Project) => void;
  language: Language;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const RoadAnalysisView: React.FC<RoadAnalysisViewProps> = ({
  activeProject,
  onUpdateProject,
  language,
  onNavigateTab,
}) => {
  const t = translations[language];
  const [samplingInterval, setSamplingInterval] = useState<25 | 50 | 100 | 200 | 500>(
    activeProject?.roadAlignment?.samplingSpacingM || 50
  );

  const [editingPoint, setEditingPoint] = useState<DrainageCrossingPoint | null>(null);

  if (!activeProject) return null;

  const points = activeProject.drainagePoints || [];

  const handleSpacingChange = (val: 25 | 50 | 100 | 200 | 500) => {
    setSamplingInterval(val);
    if (activeProject.roadAlignment) {
      const updated: Project = {
        ...activeProject,
        roadAlignment: {
          ...activeProject.roadAlignment,
          samplingSpacingM: val,
        },
      };
      onUpdateProject(updated);
    }
  };

  const handleDeletePoint = (id: string) => {
    const updatedPoints = points.filter((p) => p.id !== id);
    onUpdateProject({
      ...activeProject,
      drainagePoints: updatedPoints,
    });
  };

  const handleAddNewPoint = () => {
    const newId = `D-00${points.length + 1}`;
    const newPt: DrainageCrossingPoint = {
      id: newId,
      roadKm: 16.500,
      chainageFormatted: 'KM 16+500',
      lat: 49.3500,
      lng: 105.8500,
      elevationM: 810.0,
      catchmentAreaKm2: 0.25,
      catchmentAreaHa: 25.0,
      flowPathLengthM: 850,
      highestUpstreamElevM: 835.0,
      outletElevM: 810.0,
      elevationDiffM: 25.0,
      averageSlopePercent: 2.94,
      averageSlopeDec: 0.0294,
      timeOfConcentrationMin: 15.2,
      tcMethod: 'KIRPICH',
      returnPeriodYears: 50,
      rainfallIntensityMmHr: 80.0,
      rainfallDurationMin: 20,
      rainfallSourceRef: 'Монгол орны гадаргын усны горим',
      runoffCoefficientC: 0.50,
      runoffLandUseType: 'Уулын хээр',
      peakDischargeQ: 2.78, // Q = 0.278 * 0.50 * 80 * 0.25 = 2.78 m3/s
      culvertType: 'CIRCULAR_PIPE',
      circularConfig: {
        diameterMm: 1500,
        numberOfBarrels: 1,
        lengthM: 13.0,
        slopePercent: 2.0,
        manningN: 0.014,
        inletCondition: 'HEADWALL_WINGWALLS',
        outletCondition: 'FREE_OUTFALL',
        crossSectionAreaM2: 1.767,
        wettedPerimeterM: 4.712,
        hydraulicRadiusM: 0.375,
        fullCapacityQ: 4.65,
        actualCapacityQ: 4.65,
        flowVelocityMs: 2.63,
        capacityRatio: 1.67,
      },
      hydraulicCapacityQ: 4.65,
      capacityRatio: 1.67,
      hydraulicStatus: 'ADEQUATE',
      isAutoDetected: false,
      engineeringReviewStatus: 'APPROVED',
      remarks: 'Инженерийн гараар нэмсэн ус өнгөрүүлэх цэг.',
    };

    onUpdateProject({
      ...activeProject,
      drainagePoints: [...points, newPt],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bento Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a252f] text-white border border-[#0d141b] p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#3498db] text-xs font-bold uppercase tracking-wider mb-1">
            <Route className="w-4 h-4" />
            <span>{language === 'mn' ? 'АЛХАМ 5 - 7: ЗАМЫН ШИНЖИЛГЭЭ' : 'STEPS 5 - 7: ROAD ANALYSIS'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {language === 'mn' ? 'Трассын Дагуух Ус Өнгөрүүлэх Огтлолцлууд' : 'Road Alignment Crossings & Catchment Parameters'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {language === 'mn'
              ? 'Гадаргуугийн урсгал замыг огтлох цэгүүд, ус цугларах талбай A, уртын хэмжээ L, дундаж налуу S.'
              : 'Identify natural terrain crossings along road alignment, calculate catchment area A, flow path L, and slope S.'}
          </p>
        </div>

        <button
          onClick={handleAddNewPoint}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#3498db] hover:bg-[#2980b9] text-white text-xs sm:text-sm font-semibold shadow-md transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'mn' ? 'Цэг нэмэх' : 'Add Drainage Point'}</span>
        </button>
      </div>

      {/* Sampling Stationing Bar in Bento Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-gray-200 text-xs shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 font-bold">
            {language === 'mn' ? 'Трассын дагуух шинжилгээний алхам (Sampling spacing):' : 'Alignment Sampling Spacing:'}
          </span>
          <span className="text-gray-500 font-mono">
            {language === 'mn' ? '(25м, 50м, 100м, 200м, 500м)' : '(Section 4 standard)'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {([25, 50, 100, 200, 500] as const).map((dist) => (
            <button
              key={dist}
              onClick={() => handleSpacingChange(dist)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold transition ${
                samplingInterval === dist
                  ? 'bg-[#3498db] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {dist}м
            </button>
          ))}
        </div>
      </div>

      {/* Drainage Crossings Table (Section 15 Specification) in Bento Box */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <h3 className="font-bold text-[#1a252f] text-base">
            {language === 'mn' ? 'Ус зайлуулах цэгүүдийн хүснэгт (Drainage Point Table)' : 'Drainage Point Hydrological Summary Table'}
          </h3>
          <span className="text-xs font-mono font-bold text-gray-500">
            {points.length} {language === 'mn' ? 'бүртгэгдсэн цэг' : 'points'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#f8f9fa] text-gray-600 uppercase font-bold text-[10px] border-b border-gray-200">
              <tr>
                <th className="p-3.5">Point ID</th>
                <th className="p-3.5">Road KM</th>
                <th className="p-3.5">{language === 'mn' ? 'Талбай (A)' : 'Catchment (A)'}</th>
                <th className="p-3.5">{language === 'mn' ? 'Урт (L)' : 'Flow Path (L)'}</th>
                <th className="p-3.5">{language === 'mn' ? 'Налуу (S)' : 'Slope (S)'}</th>
                <th className="p-3.5">Tc (мин)</th>
                <th className="p-3.5">i (мм/ц)</th>
                <th className="p-3.5">C</th>
                <th className="p-3.5 font-bold text-emerald-700">Q (м³/с)</th>
                <th className="p-3.5">{language === 'mn' ? 'Хоолой' : 'Culvert'}</th>
                <th className="p-3.5">{language === 'mn' ? 'Чадавхи' : 'Capacity'}</th>
                <th className="p-3.5 text-right">{language === 'mn' ? 'Үйлдэл' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              {points.map((pt) => {
                const isBox = pt.culvertType === 'RECTANGULAR_BOX';
                const culvertLabel = isBox
                  ? `${pt.boxConfig?.numberOfCells || 1}x(${pt.boxConfig?.clearWidthM || 2.0}x${pt.boxConfig?.clearHeightM || 2.0}м) Box`
                  : `${pt.circularConfig?.numberOfBarrels || 1}xØ${pt.circularConfig?.diameterMm || 1200}мм Pipe`;

                return (
                  <tr key={pt.id} className="hover:bg-blue-50/50 transition">
                    <td className="p-3.5 font-bold text-[#1a252f]">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#3498db]" />
                        <span>{pt.id}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#3498db] font-bold">{pt.chainageFormatted}</td>
                    <td className="p-3.5 text-gray-800">{pt.catchmentAreaKm2.toFixed(2)} км²</td>
                    <td className="p-3.5 text-gray-600">{(pt.flowPathLengthM / 1000).toFixed(2)} км</td>
                    <td className="p-3.5 text-gray-600">{pt.averageSlopePercent.toFixed(1)}%</td>
                    <td className="p-3.5 text-gray-600">{pt.timeOfConcentrationMin.toFixed(1)}</td>
                    <td className="p-3.5 text-gray-600">{pt.rainfallIntensityMmHr}</td>
                    <td className="p-3.5 text-gray-600">{pt.runoffCoefficientC.toFixed(2)}</td>
                    <td className="p-3.5 font-bold text-emerald-700">{pt.peakDischargeQ.toFixed(3)}</td>
                    <td className="p-3.5 text-[#1a252f] font-sans text-[11px] font-medium">{culvertLabel}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {pt.capacityRatio.toFixed(2)}x (OK)
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-sans">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onNavigateTab('culvert')}
                          title={language === 'mn' ? 'Хоолойн тооцоо руу шилжих' : 'Go to Culvert Design'}
                          className="p-1 rounded text-gray-400 hover:text-[#3498db] hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePoint(pt.id)}
                          title={t.common.delete}
                          className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
