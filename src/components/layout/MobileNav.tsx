import React from 'react';
import { NavigationTab, Language } from '../../types';
import { translations } from '../../i18n';
import {
  LayoutDashboard,
  FolderKanban,
  Route,
  Pipette,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';

interface MobileNavProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  language: Language;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onTabChange,
  language,
}) => {
  const t = translations[language];

  const quickTabs: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.nav.home, icon: LayoutDashboard },
    { id: 'projects', label: t.nav.projects, icon: FolderKanban },
    { id: 'road-analysis', label: t.nav.roadAnalysis, icon: Route },
    { id: 'culvert', label: t.nav.culvert, icon: Pipette },
    { id: 'map', label: t.nav.map, icon: MapPin },
    { id: 'report', label: t.nav.report, icon: FileSpreadsheet },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 text-slate-400">
      <div className="grid grid-cols-6 h-16">
        {quickTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition ${
                isActive ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="text-[10px] truncate max-w-[50px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
