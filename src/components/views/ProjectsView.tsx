import React, { useState, useRef } from 'react';
import { Project, Language, NavigationTab } from '../../types';
import { translations } from '../../i18n';
import { StorageService } from '../../services/storage';
import {
  FolderKanban,
  Plus,
  Download,
  Upload,
  Trash2,
  Edit,
  CheckCircle2,
  Calendar,
  MapPin,
  Route,
  Activity,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (id: string) => void;
  onOpenNewModal: () => void;
  onOpenEditModal: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onProjectsUpdated: () => void;
  language: Language;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onOpenNewModal,
  onOpenEditModal,
  onDeleteProject,
  onProjectsUpdated,
  language,
  onNavigateTab,
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.roadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    StorageService.exportProject(project);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        StorageService.importProject(content);
        setImportError(null);
        onProjectsUpdated();
      } catch (err: any) {
        setImportError(err.message || 'Файл уншихад алдаа гарлаа');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a252f] text-white border border-[#0d141b] p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#3498db] text-xs font-bold uppercase tracking-wider mb-1">
            <FolderKanban className="w-4 h-4" />
            <span>{t.project.title}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {language === 'mn' ? 'Авто замын ус зайлуулах төслүүд' : 'Highway Drainage Engineering Projects'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {language === 'mn'
              ? 'Бүх тооцоо, трасс, гидрологи, хоолойн өгөгдөл локал санд найдвартай хадгалагдана'
              : 'All roadway alignments, DEM hydrologic models and culverts persist securely in local storage'}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,.mondrain"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-[#2c3e50] hover:bg-[#34495e] text-white border border-[#34495e] text-xs font-semibold transition shadow-sm"
          >
            <Upload className="w-4 h-4 text-[#3498db]" />
            <span className="hidden sm:inline">{t.project.importBtn}</span>
            <span className="sm:hidden">{t.common.import}</span>
          </button>

          <button
            onClick={onOpenNewModal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#3498db] hover:bg-[#2980b9] text-white text-xs sm:text-sm font-semibold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.app.newProject}</span>
          </button>
        </div>
      </div>

      {importError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center justify-between">
          <span>{importError}</span>
          <button onClick={() => setImportError(null)} className="text-red-800 font-bold">✕</button>
        </div>
      )}

      {/* Search & Counter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'mn' ? 'Төслийн нэр, дугаар, аймгаар хайх...' : 'Search by name, number, region...'}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#3498db] shadow-sm"
          />
        </div>
        <span className="text-xs text-gray-500 font-mono font-bold">
          {filteredProjects.length} / {projects.length} {language === 'mn' ? 'төсөл' : 'projects'}
        </span>
      </div>

      {/* Project Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const isActive = activeProject?.id === project.id;
          const crossingCount = project.drainagePoints?.length || 0;
          const maxQ = project.drainagePoints?.reduce((max, pt) => Math.max(max, pt.peakDischargeQ || 0), 0) || 0;
          const totalCatchment = project.drainagePoints?.reduce((sum, pt) => sum + (pt.catchmentAreaKm2 || 0), 0) || 0;

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`relative bg-white rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md ${
                isActive
                  ? 'border-[#3498db] ring-2 ring-blue-500/20'
                  : 'border-gray-200 hover:border-[#3498db]'
              }`}
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-[#1a252f] border border-gray-200">
                    {project.projectNumber || 'MDR-PROJ'}
                  </span>
                  {isActive ? (
                    <span className="flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.app.currentProject}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{project.date || '2026'}</span>
                    </span>
                  )}
                </div>

                {/* Project Name */}
                <h3 className="font-bold text-[#1a252f] text-base line-clamp-2 group-hover:text-[#3498db] transition">
                  {project.name}
                </h3>

                {/* Road and Province Info */}
                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  <div className="flex items-center space-x-1.5 truncate">
                    <Route className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{project.roadName || 'Тодорхойлоогүй зам'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{project.province || 'Монгол Улс'}{project.soum ? `, ${project.soum}` : ''}</span>
                  </div>
                </div>

                {/* Engineering Stats Row */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-xl bg-[#f8f9fa] border border-gray-200 text-center">
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-bold">
                      {language === 'mn' ? 'Хоолой' : 'Crossings'}
                    </span>
                    <span className="text-xs font-bold font-mono text-[#1a252f]">
                      {crossingCount} цэг
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-bold">
                      {language === 'mn' ? 'Талбай' : 'Area'}
                    </span>
                    <span className="text-xs font-bold font-mono text-[#3498db]">
                      {totalCatchment.toFixed(2)} км²
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-bold">
                      {language === 'mn' ? 'Qmax' : 'Qmax'}
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-600">
                      {maxQ.toFixed(2)} м³/с
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 text-xs">
                <span className="text-[11px] text-gray-500 font-medium truncate max-w-[120px]">
                  {project.engineer || 'Инженер'}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => handleExport(e, project)}
                    title={t.project.exportBtn}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#1a252f] hover:bg-gray-100 transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEditModal(project);
                    }}
                    title={t.common.edit}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#3498db] hover:bg-blue-50 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(t.project.deleteConfirm)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    title={t.common.delete}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
