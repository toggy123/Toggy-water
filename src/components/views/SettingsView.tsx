import React, { useState } from 'react';
import { Project, Language } from '../../types';
import { translations } from '../../i18n';
import {
  Settings,
  Globe2,
  Sliders,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Save,
  Compass
} from 'lucide-react';

interface SettingsViewProps {
  activeProject: Project | null;
  onUpdateProject: (project: Project) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  activeProject,
  onUpdateProject,
  language,
  onLanguageChange,
}) => {
  const t = translations[language];

  const [pipeN, setPipeN] = useState<number>(
    activeProject?.calculationSettings?.defaultManningPipe || 0.014
  );
  const [boxN, setBoxN] = useState<number>(
    activeProject?.calculationSettings?.defaultManningBox || 0.014
  );
  const [returnPeriod, setReturnPeriod] = useState<number>(
    activeProject?.calculationSettings?.defaultReturnPeriod || 50
  );
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!activeProject) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Project = {
      ...activeProject,
      calculationSettings: {
        ...activeProject.calculationSettings,
        defaultManningPipe: pipeN,
        defaultManningBox: boxN,
        defaultReturnPeriod: returnPeriod,
      },
    };
    onUpdateProject(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bento Box */}
      <div className="bg-[#1a252f] text-white border border-[#0d141b] p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2 text-[#3498db] text-xs font-bold uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>{t.nav.settings}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          {language === 'mn' ? 'Системийн Тохиргоо ба Инженерийн Норм Дүрэм' : 'System Settings & Road Engineering Standards'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {language === 'mn'
            ? 'Хэлний сонголт, Маннингийн барзгаржилтын коэфф, давтагдах хугацаа ба Монгол Улсын замын норм дүрэм.'
            : 'Language localization, hydraulic roughness coefficients, design return periods and standard references.'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{t.common.success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Localization & Defaults Form */}
        <form onSubmit={handleSaveSettings} className="bg-white border border-gray-200 p-6 rounded-2xl space-y-5 shadow-sm">
          <h3 className="font-bold text-[#1a252f] text-base flex items-center space-x-2">
            <Globe2 className="w-4 h-4 text-[#3498db]" />
            <span>{language === 'mn' ? 'Хэл ба Инженерийн Тогтмолууд' : 'Language & Hydraulic Defaults'}</span>
          </h3>

          {/* Language Switch */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">
              {language === 'mn' ? 'Системийн үндсэн хэл (Language)' : 'Application Language'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onLanguageChange('mn')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition ${
                  language === 'mn'
                    ? 'bg-blue-50 border-[#3498db] text-[#3498db] ring-1 ring-[#3498db]'
                    : 'bg-[#f8f9fa] border-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>🇲🇳 Монгол хэл (Mongolian)</span>
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition ${
                  language === 'en'
                    ? 'bg-blue-50 border-[#3498db] text-[#3498db] ring-1 ring-[#3498db]'
                    : 'bg-[#f8f9fa] border-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>🇬🇧 English (International)</span>
              </button>
            </div>
          </div>

          {/* Default Roughness n */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Дугуй хоолойн Manning (n)
              </label>
              <input
                type="number"
                step="0.001"
                value={pipeN}
                onChange={(e) => setPipeN(Number(e.target.value))}
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a252f] font-mono focus:border-[#3498db] focus:outline-none"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">Бетон дугуй хоолой: 0.013-0.015</span>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Дөрвөлжин хоолойн Manning (n)
              </label>
              <input
                type="number"
                step="0.001"
                value={boxN}
                onChange={(e) => setBoxN(Number(e.target.value))}
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a252f] font-mono focus:border-[#3498db] focus:outline-none"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">Бетон дөрвөлжин хоолой: 0.014-0.016</span>
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-bold mb-1">
                Үерийн тооцоот давтагдах хугацаа (Return Period T, жил)
              </label>
              <select
                value={returnPeriod}
                onChange={(e) => setReturnPeriod(Number(e.target.value))}
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-[#1a252f] font-mono focus:border-[#3498db] focus:outline-none"
              >
                <option value={25}>1:25 жил (IV, V зэрэглэлийн авто зам)</option>
                <option value={50}>1:50 жил (II, III зэрэглэлийн авто зам - БНбД стандарт)</option>
                <option value={100}>1:100 жил (I зэрэглэлийн хурдны зам, онцгой сайр)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-[#3498db] hover:bg-[#2980b9] text-white text-xs font-bold transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{t.common.save}</span>
          </button>
        </form>

        {/* Mongolian Engineering Standards Reference Card */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-bold text-[#1a252f] text-base flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>{language === 'mn' ? 'Монгол Улсын Замын Норм Баримт Бичгүүд' : 'Applicable Mongolian Standards'}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-[#f8f9fa] border border-gray-200 rounded-xl space-y-1">
              <span className="font-bold text-[#1a252f]">БНбД 2.05.02-84</span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {language === 'mn'
                  ? 'Авто зам төсөллөх норм ба дүрэм (Ус зайлуулах байгууламж, хоолойн тооцоо).'
                  : 'Mongolian Highway Design Norms & Rules (Drainage & Culvert sizing).'}
              </p>
            </div>

            <div className="p-4 bg-[#f8f9fa] border border-gray-200 rounded-xl space-y-1">
              <span className="font-bold text-[#1a252f]">ЗДБ 22-01-03</span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {language === 'mn'
                  ? 'Авто замын ус өнгөрүүлэх хиймэл төхөөрөмж (хоолой, гүүр)-ийн гидрологийн тооцооны заавар.'
                  : 'Hydrological and hydraulic calculation guidelines for highway culverts & bridges.'}
              </p>
            </div>

            <div className="p-4 bg-[#f8f9fa] border border-gray-200 rounded-xl space-y-1">
              <span className="font-bold text-[#1a252f]">MNS 5831:2008</span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {language === 'mn'
                  ? 'Авто замын төмөр бетон дугуй болон тэгш өнцөгт дөрвөлжин хоолойн техникийн шаардлага.'
                  : 'Technical standards for reinforced concrete circular and box culverts in Mongolia.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
