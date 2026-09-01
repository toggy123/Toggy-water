import React from 'react';
import { Project, Language, NavigationTab } from '../../types';
import { translations } from '../../i18n';
import { 
  FolderKanban, 
  Globe2, 
  Compass, 
  Layers, 
  CheckCircle2, 
  Menu,
  ChevronDown,
  Plus
} from 'lucide-react';

interface HeaderProps {
  currentProject: Project | null;
  projects: Project[];
  onSelectProject: (id: string) => void;
  onOpenNewProjectModal: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onOpenNewProjectModal,
  language,
  onLanguageChange,
  currentTab,
  onTabChange,
  onToggleSidebar,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-[#1a252f] border-b border-[#0d141b] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#2c3e50] transition"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div 
              onClick={() => onTabChange('home')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#3498db] flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:bg-[#2980b9] transition">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold tracking-tight text-white text-base sm:text-lg">
                    MON-DRAIN
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#e67e22] text-white font-mono font-bold tracking-wider uppercase">
                    PRO v1.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
                  {language === 'mn' ? 'Авто замын ус зайлуулах инженерийн систем' : 'Highway Drainage & Culvert CAD System'}
                </p>
              </div>
            </div>
          </div>

          {/* Center Project Selector */}
          <div className="hidden md:flex items-center space-x-2 max-w-md">
            <div className="relative flex items-center bg-[#2c3e50] border border-[#34495e] rounded-lg px-3 py-1.5 text-xs text-slate-200 hover:border-slate-400 transition">
              <FolderKanban className="w-4 h-4 text-[#3498db] mr-2 shrink-0" />
              <div className="flex flex-col text-left mr-2 truncate">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                  {t.app.currentProject}
                </span>
                <select
                  value={currentProject?.id || ''}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      onOpenNewProjectModal();
                    } else {
                      onSelectProject(e.target.value);
                    }
                  }}
                  className="bg-transparent font-medium text-white focus:outline-none cursor-pointer truncate max-w-[220px]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#1a252f] text-white">
                      {p.name} ({p.projectNumber || 'No Code'})
                    </option>
                  ))}
                  <option value="__NEW__" className="bg-[#1a252f] text-[#3498db] font-bold">
                    + {t.app.newProject}...
                  </option>
                </select>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>

            <button
              onClick={onOpenNewProjectModal}
              title={t.app.newProject}
              className="p-1.5 rounded-lg bg-[#3498db] hover:bg-[#2980b9] text-white transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Right Actions: CRS badge, Language switcher, Standard badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {currentProject?.crsInfo?.projectCRS && (
              <div className="hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#2c3e50] border border-[#34495e] text-slate-200 text-xs font-mono">
                <Compass className="w-3.5 h-3.5 text-[#e67e22]" />
                <span>{currentProject.crsInfo.projectCRS}</span>
              </div>
            )}

            <div className="flex items-center bg-[#2c3e50] p-0.5 rounded-lg border border-[#34495e] text-xs">
              <button
                onClick={() => onLanguageChange('mn')}
                className={`px-2 py-1 rounded font-semibold transition ${
                  language === 'mn'
                    ? 'bg-[#3498db] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                MN
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded font-semibold transition ${
                  language === 'en'
                    ? 'bg-[#3498db] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
