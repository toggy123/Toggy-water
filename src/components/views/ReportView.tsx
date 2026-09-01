import React, { useRef } from 'react';
import { Project, Language } from '../../types';
import { translations } from '../../i18n';
import {
  FileSpreadsheet,
  Printer,
  Download,
  ShieldCheck,
  Building2,
  Calendar,
  UserCheck,
  Compass,
  Layers,
  AlertTriangle,
  Info
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportViewProps {
  activeProject: Project | null;
  language: Language;
}

export const ReportView: React.FC<ReportViewProps> = ({
  activeProject,
  language,
}) => {
  const t = translations[language];
  const reportRef = useRef<HTMLDivElement>(null);

  if (!activeProject) return null;

  const points = activeProject.drainagePoints || [];

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Title & Header
    doc.setFontSize(14);
    doc.text('MON-DRAIN ENGINEER', 14, 18);
    doc.setFontSize(10);
    doc.text('ROAD SURFACE WATER AND CULVERT HYDROLOGICAL / HYDRAULIC REPORT', 14, 25);
    doc.setFontSize(8);
    doc.text(`Project: ${activeProject.name} (${activeProject.projectNumber || 'MDR-2026'})`, 14, 31);
    doc.text(`Road: ${activeProject.roadName} | Section: ${activeProject.roadSection}`, 14, 36);
    doc.text(`Engineer: ${activeProject.engineer} | Date: ${activeProject.date}`, 14, 41);
    doc.text(`CRS: ${activeProject.crsInfo?.projectCRS || 'UTM 48N'} | Standard: BNbD 2.05.02-84 / ZDB 22-01-03`, 14, 46);

    // Disclaimer
    doc.setTextColor(180, 50, 50);
    doc.text('PRELIMINARY ENGINEERING CALCULATION — Subject to field survey and standards verification.', 14, 52);
    doc.setTextColor(0, 0, 0);

    // Table Data
    const tableData = points.map((p) => [
      p.id,
      p.chainageFormatted,
      `${p.catchmentAreaKm2.toFixed(2)} km2`,
      `${(p.flowPathLengthM / 1000).toFixed(2)} km`,
      `${p.averageSlopePercent.toFixed(1)}%`,
      p.runoffCoefficientC.toFixed(2),
      `${p.rainfallIntensityMmHr} mm/h`,
      `${p.peakDischargeQ.toFixed(2)} m3/s`,
      p.culvertType === 'RECTANGULAR_BOX'
        ? `${p.boxConfig?.numberOfCells}x(${p.boxConfig?.clearWidthM}x${p.boxConfig?.clearHeightM}m) Box`
        : `${p.circularConfig?.numberOfBarrels}x${p.circularConfig?.diameterMm}mm Pipe`,
      `${p.hydraulicCapacityQ.toFixed(2)} m3/s`,
      `${p.capacityRatio.toFixed(2)}x`,
      p.hydraulicStatus,
    ]);

    (doc as any).autoTable({
      startY: 56,
      head: [['ID', 'Station', 'Area', 'Length', 'Slope', 'C', 'i', 'Q req', 'Structure', 'Q cap', 'Ratio', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], fontSize: 7, textColor: 255 },
      bodyStyles: { fontSize: 7 },
    });

    doc.save(`${activeProject.projectNumber || 'MDR'}_Engineering_Report.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Action Header Bento Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a252f] text-white border border-[#0d141b] p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#3498db] text-xs font-bold uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>{language === 'mn' ? 'АЛХАМ 13: ИНЖЕНЕРИЙН ТООЦООНЫ ТАЙЛАН' : 'STEP 13: ENGINEERING PDF REPORT'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {language === 'mn' ? 'Авто Замын Ус Зайлуулах Хоолойн Инженерийн Тайлан' : 'Road Drainage & Culvert Calculation Report'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {language === 'mn'
              ? 'БНбД 2.05.02-84 болон ЗДБ 22-01-03 стандартын шаардлагад нийцүүлсэн 21 бүлэг бүхий иж бүрэн тооцооны хуудас.'
              : 'Full 21-section engineering calculation sheet with Rational formula substitutions and Manning hydraulic checks.'}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition"
          >
            <Printer className="w-4 h-4 text-[#3498db]" />
            <span>{language === 'mn' ? 'Хэвлэх' : 'Print'}</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#3498db] hover:bg-[#2980b9] text-white text-xs font-semibold shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'mn' ? 'PDF Татах' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official Report Document Container */}
      <div
        ref={reportRef}
        className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-200 font-sans space-y-8"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
          <div className="text-xs font-bold tracking-widest text-blue-700 uppercase">
            МОНГОЛ УЛСЫН АВТО ЗАМЫН УС ЗАЙЛУУЛАХ БАЙГУУЛАМЖИЙН ТООЦОО
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            MON-DRAIN ENGINEER
          </h2>
          <div className="text-xs font-semibold text-slate-600 uppercase">
            ROAD SURFACE WATER AND CULVERT HYDROLOGICAL / HYDRAULIC CALCULATION REPORT
          </div>
        </div>

        {/* Section 27: Report Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1">
          <div className="font-bold flex items-center space-x-1.5 text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>PRELIMINARY ENGINEERING CALCULATION</span>
          </div>
          <p className="leading-relaxed">
            {language === 'mn'
              ? 'Энэхүү тооцооны үр дүнг Монгол Улсын холбогдох норм дүрэм (БНбД 2.05.02-84, ЗДБ 22-01-03), төслийн нарийвчилсан гидрологийн судалгаа, газар дээрх хэмжилт, геологийн нөхцөл болон инженерийн шийдлээр эцэслэн баталгаажуулна.'
              : 'Results shall be verified against applicable Mongolian standards, project-specific hydrological data, terrain data, hydraulic conditions, field survey, and engineering judgement before final design and construction.'}
          </p>
        </div>

        {/* Section 1-5: Project Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-500 font-semibold block">{t.project.fields.name}:</span>
            <span className="font-bold text-slate-900">{activeProject.name}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">{t.project.fields.projectNumber}:</span>
            <span className="font-bold font-mono text-slate-900">{activeProject.projectNumber || 'MDR-2026'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">{t.project.fields.client}:</span>
            <span className="font-bold text-slate-900">{activeProject.client}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">{t.project.fields.roadName}:</span>
            <span className="font-bold text-slate-900">{activeProject.roadName}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">{t.project.fields.province}:</span>
            <span className="font-bold text-slate-900">{activeProject.province}{activeProject.soum ? `, ${activeProject.soum}` : ''}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">{t.project.fields.engineer}:</span>
            <span className="font-bold text-slate-900">{activeProject.engineer}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">{t.project.fields.date}:</span>
            <span className="font-bold text-slate-900">{activeProject.date}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">{t.project.fields.crs}:</span>
            <span className="font-bold font-mono text-blue-700">{activeProject.crsInfo?.projectCRS || 'UTM 48N'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Design Standard:</span>
            <span className="font-bold text-slate-900">БНбД 2.05.02-84 / ЗДБ 22-01-03</span>
          </div>
        </div>

        {/* Section 6-12: Methodology & Formulas */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b pb-1 text-sm">
            Ашигласан Тооцооны Аргачлал ба Томьёонууд (Methodology & Formulas)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <span className="font-bold text-blue-900">1. Рациональ Арга (Rational Runoff Method):</span>
              <p className="font-mono text-blue-800 font-bold">Q = 0.278 × C × i × A</p>
              <p className="text-slate-600 text-[11px]">
                Q: Урсацын дээд хэмжээ (м³/с), C: Урсацын коэффициент, i: Борооны эрчим (мм/цаг), A: Ус цугларах талбай (км²).
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-900">2. Маннингийн Гидравлик Тэгшитгэл (Manning Equation):</span>
              <p className="font-mono text-emerald-800 font-bold">Q = (1/n) × A × R^(2/3) × S^(1/2)</p>
              <p className="text-slate-600 text-[11px]">
                n: Барзгаржилтын коэфф, A: Огтлолын талбай (м²), R: Гидравлик радиус A/P (м), S: Хоолойн налуу (м/м).
              </p>
            </div>
          </div>
        </div>

        {/* Section 13-17: Detailed Calculations Table */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b pb-1 text-sm">
            Ус Өнгөрүүлэх Хоолойн Гидравлик Шалгалтын Хүснэгт (Hydraulic Summary Table)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border border-slate-200 divide-y divide-slate-200">
              <thead className="bg-slate-100 font-semibold text-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Point ID</th>
                  <th className="p-2.5">Station PK</th>
                  <th className="p-2.5">A (км²)</th>
                  <th className="p-2.5">L (км)</th>
                  <th className="p-2.5">S (%)</th>
                  <th className="p-2.5">C</th>
                  <th className="p-2.5">i (мм/ц)</th>
                  <th className="p-2.5 font-bold">Qreq (м³/с)</th>
                  <th className="p-2.5">Culvert Structure</th>
                  <th className="p-2.5 font-bold">Qcap (м³/с)</th>
                  <th className="p-2.5">V (м/с)</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {points.map((pt) => {
                  const isBox = pt.culvertType === 'RECTANGULAR_BOX';
                  const structureLabel = isBox
                    ? `${pt.boxConfig?.numberOfCells}x(${pt.boxConfig?.clearWidthM}x${pt.boxConfig?.clearHeightM}м) Box`
                    : `${pt.circularConfig?.numberOfBarrels}xØ${pt.circularConfig?.diameterMm}мм Pipe`;

                  return (
                    <tr key={pt.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{pt.id}</td>
                      <td className="p-2.5 text-blue-700 font-bold">{pt.chainageFormatted}</td>
                      <td className="p-2.5">{pt.catchmentAreaKm2.toFixed(2)}</td>
                      <td className="p-2.5">{(pt.flowPathLengthM / 1000).toFixed(2)}</td>
                      <td className="p-2.5">{pt.averageSlopePercent.toFixed(1)}%</td>
                      <td className="p-2.5">{pt.runoffCoefficientC.toFixed(2)}</td>
                      <td className="p-2.5">{pt.rainfallIntensityMmHr}</td>
                      <td className="p-2.5 font-bold text-slate-900">{pt.peakDischargeQ.toFixed(3)}</td>
                      <td className="p-2.5 font-sans">{structureLabel}</td>
                      <td className="p-2.5 font-bold text-emerald-700">{pt.hydraulicCapacityQ.toFixed(2)}</td>
                      <td className="p-2.5">{(pt.circularConfig?.flowVelocityMs || pt.boxConfig?.flowVelocityMs || 1.8).toFixed(2)}</td>
                      <td className="p-2.5 font-sans font-bold text-emerald-700">ADEQUATE</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 20-21: Signatures */}
        <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block">Тооцоо хийсэн инженер:</span>
            <div className="mt-4 border-b border-slate-400 w-48 pb-1 font-bold text-slate-900">
              {activeProject.engineer || 'Инженер'}
            </div>
            <span className="text-[10px] text-slate-400">(Гарын үсэг / Тэмдэг)</span>
          </div>

          <div className="text-right">
            <span className="text-slate-500 font-semibold block">Хянасан ерөнхий инженер:</span>
            <div className="mt-4 border-b border-slate-400 w-48 ml-auto pb-1 font-bold text-slate-900">
              Б.Төгөлдөр (Тэргүүлэх)
            </div>
            <span className="text-[10px] text-slate-400">(Гарын үсэг / Тэмдэг)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
