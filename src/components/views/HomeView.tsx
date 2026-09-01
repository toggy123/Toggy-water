import React from 'react';
import { Project, Language, NavigationTab } from '../../types';
import { translations } from '../../i18n';
import {
  FolderKanban,
  UploadCloud,
  Mountain,
  Route,
  CloudRain,
  Pipette,
  MapPin,
  LineChart,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface HomeViewProps {
  activeProject: Project | null;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenNewProjectModal: () => void;
  language: Language;
}

export const HomeView: React.FC<HomeViewProps> = ({
  activeProject,
  onNavigateTab,
  onOpenNewProjectModal,
  language,
}) => {
  const t = translations[language];

  const drainagePoints = activeProject?.drainagePoints || [];
  const crossingCount = drainagePoints.length;
  const circularCount = drainagePoints.filter((p) => p.culvertType === 'CIRCULAR_PIPE').length;
  const boxCount = drainagePoints.filter((p) => p.culvertType === 'RECTANGULAR_BOX').length;
  const maxQ = drainagePoints.reduce((max, pt) => Math.max(max, pt.peakDischargeQ || 0), 0);
  const totalCatchmentKm2 = drainagePoints.reduce((sum, pt) => sum + (pt.catchmentAreaKm2 || 0), 0);

  const workflowSteps: {
    step: number;
    titleMn: string;
    titleEn: string;
    descMn: string;
    descEn: string;
    tab: NavigationTab;
    isDone: boolean;
  }[] = [
    {
      step: 1,
      titleMn: 'Төсөл үүсгэх / Сонгох',
      titleEn: 'Create / Select Project',
      descMn: 'Төслийн нэр, дугаар, захиалагч, аймаг, сум, хариуцсан инженер, CRS тохируулах',
      descEn: 'Configure project metadata, road section, province, engineer & CRS',
      tab: 'projects',
      isDone: !!activeProject,
    },
    {
      step: 2,
      titleMn: 'Замын трасс оруулах (KML/KMZ)',
      titleEn: 'Import Road Alignment (KML/KMZ)',
      descMn: 'KML / KMZ файлын LineString геометр, эргэлтийн цэгүүд, пикет урт задлах',
      descEn: 'Extract 3D/2D road centerline, vertices & calculate chainage',
      tab: 'import',
      isDone: !!activeProject?.roadAlignment || drainagePoints.length > 0,
    },
    {
      step: 3,
      titleMn: 'Гадаргуугийн DEM оруулах',
      titleEn: 'Import Terrain DEM (GeoTIFF)',
      descMn: 'Өндөржилтийн растер, NoData шалгалт, хэмжээс ба CRS тохиргоо',
      descEn: 'Load GeoTIFF DEM raster, bounds, resolution & coordinate matching',
      tab: 'import',
      isDone: !!activeProject?.demData || drainagePoints.length > 0,
    },
    {
      step: 4,
      titleMn: 'Гадаргуу боловсруулалт & D8',
      titleEn: 'DEM Preprocessing & D8 Flow Direction',
      descMn: 'Хонхор хотгор дүүргэх (Fill Sinks), D8 урсгалын чиглэл ба хуримтлал',
      descEn: 'Depression filling, D8 flow direction matrix & flow accumulation',
      tab: 'terrain',
      isDone: true,
    },
    {
      step: 5,
      titleMn: 'Зам-Усны сүлжээний огтлолцол',
      titleEn: 'Drainage Crossing Identification',
      descMn: 'Төвлөрсөн урсгалын сайрууд авто замыг огтлох цэгүүдийг автоматаар илрүүлэх',
      descEn: 'Identify natural watercourse intersections along road alignment',
      tab: 'road-analysis',
      isDone: drainagePoints.length > 0,
    },
    {
      step: 6,
      titleMn: 'Ус цугларах талбай (Watershed)',
      titleEn: 'Automatic Watershed Delineation',
      descMn: 'Огтлолцол бүрийн дээд урсгалыг мөшгиж, ус цугларах сав газрын талбайг тодорхойлох',
      descEn: 'Trace upstream flow directions to delineate catchment polygons',
      tab: 'road-analysis',
      isDone: drainagePoints.length > 0,
    },
    {
      step: 7,
      titleMn: 'Урсгалын урт & Дундаж налуу',
      titleEn: 'Longest Flow Path & Slope',
      descMn: 'Усны голдиролын урт L, өндрийн зөрүү ΔH, дундаж налуу S=ΔH/L тооцоолох',
      descEn: 'Calculate longest hydraulic flow path, elevation drop & average slope',
      tab: 'road-analysis',
      isDone: drainagePoints.length > 0,
    },
    {
      step: 8,
      titleMn: 'Гидрологи & Рациональ арга Q',
      titleEn: 'Hydrology & Rational Method Q',
      descMn: 'Кирпичийн Tc, 1:25/50/100 жилийн борооны эрчим i, С коэфф, Q = 0.278 × C × i × A',
      descEn: 'Calculate Kirpich Tc, rainfall intensity i, C coefficient & peak discharge Q',
      tab: 'hydrology',
      isDone: drainagePoints.length > 0,
    },
    {
      step: 9,
      titleMn: 'Хоолойн бүтээцийн төрөл сонгох',
      titleEn: 'Culvert Type Selection',
      descMn: 'Дугуй төмөр бетон хоолой эсвэл Тэгш өнцөгт дөрвөлжин хоолойн геометрийн сонголт',
      descEn: 'Select between circular reinforced concrete pipe & rectangular box culvert',
      tab: 'culvert',
      isDone: drainagePoints.length > 0,
    },
    {
      step: 10,
      titleMn: 'Маннингийн гидравлик чадавхи',
      titleEn: 'Manning Hydraulic Capacity',
      descMn: 'A, P, R, Q = (1/n) × A × R^(2/3) × S^(1/2) тооцож урсгалын хурд V олох',
      descEn: 'Calculate hydraulic radius, flow velocity & total barrel/cell capacity',
      tab: 'culvert',
      isDone: drainagePoints.length > 0,
    },
    {
      step: 11,
      titleMn: 'Хэмжээсийн урьдчилсан сонголт',
      titleEn: 'Preliminary Size Screening',
      descMn: '300-2000мм дугуй хоолой болон 1.0х1.0 - 3.0х3.0м дөрвөлжин хоолойн шалгалт',
      descEn: 'Screen standard diameters and single/multi-cell box culvert configurations',
      tab: 'culvert',
      isDone: drainagePoints.length > 0,
    },
    {
      step: 12,
      titleMn: 'Хоолой хоорондын зай шалгах',
      titleEn: 'Culvert Spacing Analysis',
      descMn: 'Трассын дагуух зай, урт хэтэрсэн болон ус төвлөрөх эрсдэлтэй хэсгүүдийг хянах',
      descEn: 'Verify spacing between crossings to prevent embankment overtopping',
      tab: 'culvert',
      isDone: drainagePoints.length > 0,
    },
    {
      step: 13,
      titleMn: 'Инженерийн PDF тооцооны тайлан',
      titleEn: 'Engineering Calculation PDF Report',
      descMn: 'Монгол Улсын авто замын норм стандартын шаардлага хангасан цогц тайлан үүсгэх',
      descEn: 'Generate comprehensive calculation sheets with formulas, tables & disclaimer',
      tab: 'report',
      isDone: drainagePoints.length > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Bento Hero Card */}
      <div className="relative overflow-hidden bg-[#1a252f] text-white border border-[#0d141b] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#3498db] text-white text-xs font-mono font-bold tracking-wide uppercase shadow-sm">
                {activeProject?.projectNumber || 'MDR-2026-ENG'}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#2c3e50] text-slate-200 text-xs font-mono flex items-center space-x-1 border border-[#34495e]">
                <Compass className="w-3.5 h-3.5 text-[#e67e22]" />
                <span>{activeProject?.crsInfo?.projectCRS || 'UTM 48N'}</span>
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 text-xs flex items-center space-x-1 border border-emerald-700/60 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'mn' ? 'БНбД 2.05.02-84 Стандарт' : 'BNbD 2.05.02-84 Standard'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeProject?.name || 'MON-DRAIN Авто замын ус зайлуулах систем'}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeProject?.notes ||
                (language === 'mn'
                  ? 'Авто замын трассын дагуух ус цугларах талбай, үерийн тооцоот урсац, дугуй ба дөрвөлжин хоолойн гидравлик хэмжээс сонголт.'
                  : 'Automated watershed hydrology, Rational method runoff Q, circular & box culvert hydraulic sizing.')}
            </p>

            {/* Engineer & Location details */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-5 text-xs text-slate-300 pt-1">
              <div>
                <span className="text-slate-400 font-medium">{t.project.fields.roadName}: </span>
                <span className="text-white font-semibold">{activeProject?.roadName || 'А0101 улсын чанартай зам'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">{t.project.fields.province}: </span>
                <span className="text-white font-semibold">{activeProject?.province || 'Дархан-Уул'}{activeProject?.soum ? `, ${activeProject.soum}` : ''}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">{t.project.fields.engineer}: </span>
                <span className="text-white font-semibold">{activeProject?.engineer || 'Тэргүүлэх инженер'}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('culvert')}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold text-sm shadow-md transition"
            >
              <Pipette className="w-4 h-4" />
              <span>{language === 'mn' ? 'Хоолойн тооцоо харах' : 'View Culverts'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('map')}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#2c3e50] hover:bg-[#34495e] text-white font-semibold text-sm border border-[#34495e] transition"
            >
              <MapPin className="w-4 h-4 text-[#3498db]" />
              <span>{language === 'mn' ? 'GIS Зураглал нээх' : 'Open GIS Map'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigateTab('road-analysis')}
          className="bg-white border border-gray-200 p-5 rounded-xl cursor-pointer hover:border-[#3498db] hover:shadow-md transition shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              {language === 'mn' ? 'Ус өнгөрүүлэх цэгүүд' : 'Drainage Crossings'}
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#3498db]">
              <Route className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-[#1a252f]">
            {crossingCount} <span className="text-sm font-normal text-gray-500">цэг</span>
          </div>
          <div className="text-xs text-gray-500 mt-1.5">
            {circularCount} дугуй + {boxCount} дөрвөлжин
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('hydrology')}
          className="bg-white border border-gray-200 p-5 rounded-xl cursor-pointer hover:border-[#3498db] hover:shadow-md transition shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              {language === 'mn' ? 'Нийт ус цугларах талбай' : 'Total Catchment'}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Mountain className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-[#1a252f]">
            {totalCatchmentKm2.toFixed(2)} <span className="text-sm font-normal text-gray-500">км²</span>
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1.5">
            {(totalCatchmentKm2 * 100).toFixed(1)} га (Hectares)
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('hydrology')}
          className="bg-white border border-gray-200 p-5 rounded-xl cursor-pointer hover:border-[#3498db] hover:shadow-md transition shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              {language === 'mn' ? 'Дээд урсац (Qmax)' : 'Max Peak Q'}
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#3498db]">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-[#1a252f]">
            {maxQ.toFixed(2)} <span className="text-sm font-normal text-gray-500">м³/с</span>
          </div>
          <div className="text-xs font-mono text-gray-500 mt-1.5">
            Q = 0.278 × C × i × A
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('report')}
          className="bg-white border border-gray-200 p-5 rounded-xl cursor-pointer hover:border-[#3498db] hover:shadow-md transition shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              {language === 'mn' ? 'Гидравлик төлөв' : 'Hydraulic Status'}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-600">
            100% <span className="text-sm font-normal text-gray-500">хангасан</span>
          </div>
          <div className="text-xs text-gray-500 mt-1.5">
            Бүх хоолойн Qcap ≥ Qreq
          </div>
        </div>
      </div>

      {/* Engineering Workflow Stepper 1-13 in Bento Box */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <div className="text-xs text-[#3498db] font-bold uppercase tracking-wider">
              {language === 'mn' ? 'Үндсэн ажлын дараалал' : 'Engineering Core Workflow'}
            </div>
            <h2 className="text-xl font-bold text-[#1a252f] mt-0.5">
              {language === 'mn' ? '13 Үе Шатт Инженерийн Төлөвлөгөө' : '13-Step Road Drainage System'}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#1a252f] px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
            STEPS 1 - 13
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {workflowSteps.map((step) => {
            return (
              <div
                key={step.step}
                onClick={() => onNavigateTab(step.tab)}
                className="group flex items-start space-x-3.5 p-4 rounded-xl bg-[#f8f9fa] border border-gray-200 hover:border-[#3498db] hover:bg-white hover:shadow-sm transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-300 group-hover:bg-[#3498db] group-hover:border-[#3498db] flex items-center justify-center text-xs font-mono font-bold text-[#1a252f] group-hover:text-white shrink-0 transition">
                  {step.step}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1a252f] group-hover:text-[#3498db] truncate transition">
                      {language === 'mn' ? step.titleMn : step.titleEn}
                    </h4>
                    {step.isDone && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {language === 'mn' ? step.descMn : step.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engineering Standards Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
        <Info className="w-5 h-5 text-[#e67e22] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-amber-950 uppercase">
            {language === 'mn' ? 'Инженерийн санамж:' : 'Engineering Notice:'}
          </span>{' '}
          {t.common.disclaimer}
        </div>
      </div>
    </div>
  );
};
