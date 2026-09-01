import React from 'react';
import { NavigationTab, Language } from '../../types';
import { translations } from '../../i18n';
import {
  LayoutDashboard,
  FolderKanban,
  UploadCloud,
  Mountain,
  Route,
  CloudRain,
  Pipette,
  MapPin,
  LineChart,
  FileSpreadsheet,
  History,
  Settings,
  X,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  language,
  isOpen,
  onClose,
}) => {
  const t = translations[language];

  const menuItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; step?: string }[] = [
    { id: 'home', label: t.nav.home, icon: LayoutDashboard },
    { id: 'projects', label: t.nav.projects, icon: FolderKanban, step: 'STEP 1' },
    { id: 'import', label: t.nav.import, icon: UploadCloud, step: 'STEP 2-3' },
    { id: 'terrain', label: t.nav.terrain, icon: Mountain, step: 'STEP 4' },
    { id: 'road-analysis', label: t.nav.roadAnalysis, icon: Route, step: 'STEP 5-7' },
    { id: 'hydrology', label: t.nav.hydrology, icon: CloudRain, step: 'STEP 8' },
    { id: 'culvert', label: t.nav.culvert, icon: Pipette, step: 'STEP 9-12' },
    { id: 'map', label: t.nav.map, icon: MapPin },
    { id: 'profile', label: t.nav.profile, icon: LineChart },
    { id: 'report', label: t.nav.report, icon: FileSpreadsheet, step: 'STEP 13' },
    { id: 'history', label: t.nav.history, icon: History },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#2c3e50] border-r border-[#1a252f] text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-0 lg:h-[calc(100vh-4rem)]`}
      >
        {/* Mobile Sidebar Close */}
        <div className="flex items-center justify-between p-4 border-b border-[#1a252f] lg:hidden">
          <span className="font-bold text-white tracking-tight">MON-DRAIN MENU</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a252f]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
            {language === 'mn' ? 'Инженерийн ажлын дараалал' : 'Engineering Workflow'}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#3498db] text-white shadow-md shadow-blue-900/30 font-semibold'
                    : 'text-slate-200 hover:bg-[#34495e] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition ${
                      isActive ? 'text-white' : 'text-slate-300 group-hover:text-blue-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.step && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight ${
                      isActive
                        ? 'bg-[#2980b9] text-white'
                        : 'bg-[#1a252f] text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {item.step}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mongolian Road Standards Footer Badge */}
        <div className="p-3 border-t border-[#1a252f] bg-[#1a252f]/60">
          <div className="p-2.5 rounded-lg bg-[#2c3e50] border border-[#34495e] text-[11px] text-slate-300">
            <div className="text-white font-bold mb-0.5 flex items-center justify-between">
              <span>БНбД 2.05.02-84</span>
              <span className="text-[10px] text-[#e67e22] font-mono font-bold">ЗДБ 22-01-03</span>
            </div>
            <p className="line-clamp-2 text-slate-300 text-[10px]">
              {language === 'mn'
                ? 'Авто замын ус зайлуулах байгууламжийн төсөллөлт'
                : 'Mongolian Highway Cross-Drainage Norms'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
