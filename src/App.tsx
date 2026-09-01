import React, { useState, useEffect } from 'react';
import { Project, Language, NavigationTab } from './types';
import { StorageService } from './services/storage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ProjectModal } from './components/projects/ProjectModal';

// Views
import { HomeView } from './components/views/HomeView';
import { ProjectsView } from './components/views/ProjectsView';
import { ImportView } from './components/views/ImportView';
import { TerrainView } from './components/views/TerrainView';
import { RoadAnalysisView } from './components/views/RoadAnalysisView';
import { HydrologyView } from './components/views/HydrologyView';
import { CulvertView } from './components/views/CulvertView';
import { MapView } from './components/views/MapView';
import { ProfileView } from './components/views/ProfileView';
import { ReportView } from './components/views/ReportView';
import { HistoryView } from './components/views/HistoryView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('mon_drain_lang') as Language) || 'mn';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Initialize projects on load
  useEffect(() => {
    const loadedProjects = StorageService.getProjects();
    setProjects(loadedProjects);
    const active = StorageService.getActiveProject();
    setActiveProject(active);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('mon_drain_lang', lang);
  };

  const handleSelectProject = (id: string) => {
    StorageService.setActiveProjectId(id);
    const active = projects.find((p) => p.id === id) || null;
    setActiveProject(active);
  };

  const handleRefreshProjects = () => {
    const loadedProjects = StorageService.getProjects();
    setProjects(loadedProjects);
    const active = StorageService.getActiveProject();
    setActiveProject(active);
  };

  const handleSaveProjectModal = (data: Partial<Project>) => {
    if (editingProject) {
      const updated: Project = {
        ...editingProject,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      StorageService.saveProject(updated);
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        name: data.name || 'Шинэ төсөл',
        projectNumber: data.projectNumber || 'MDR-2026',
        client: data.client || 'Зам тээврийн хөгжлийн яам',
        roadName: data.roadName || 'Авто зам',
        province: data.province || 'Төв аймаг',
        soum: data.soum || '',
        roadSection: data.roadSection || 'PK 0+000 - PK 20+000',
        engineer: data.engineer || 'Инженер',
        date: data.date || new Date().toISOString().split('T')[0],
        notes: data.notes || '',
        crsInfo: data.crsInfo || {
          sourceCRS: 'WGS84',
          projectCRS: 'UTM_ZONE_48N',
          demCRS: 'UTM_ZONE_48N',
          roadCRS: 'WGS84',
        },
        drainagePoints: [],
        calculationSettings: {
          defaultManningPipe: 0.014,
          defaultManningBox: 0.014,
          defaultRunoffC: 0.50,
          defaultReturnPeriod: 50,
          defaultRainfallIntensity: 80,
          flowAccumulationThreshold: 500,
          demResolutionM: 10,
          culvertSpacingWarnMaxM: 1500,
          culvertSpacingWarnMinM: 100,
        },
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: 'PROJECT_CREATED',
            author: data.engineer || 'Инженер',
            details: 'Төсөл шинээр үүсгэгдлээ.',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      StorageService.saveProject(newProj);
      StorageService.setActiveProjectId(newProj.id);
    }
    handleRefreshProjects();
    setEditingProject(null);
  };

  const handleUpdateActiveProject = (updated: Project) => {
    StorageService.saveProject(updated);
    handleRefreshProjects();
  };

  const handleDeleteProject = (id: string) => {
    StorageService.deleteProject(id);
    handleRefreshProjects();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] flex flex-col font-sans">
      {/* Header */}
      <Header
        currentProject={activeProject}
        projects={projects}
        onSelectProject={handleSelectProject}
        onOpenNewProjectModal={() => {
          setEditingProject(null);
          setIsProjectModalOpen(true);
        }}
        language={language}
        onLanguageChange={handleLanguageChange}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 lg:pb-6">
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          language={language}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {currentTab === 'home' && (
            <HomeView
              activeProject={activeProject}
              onNavigateTab={setCurrentTab}
              onOpenNewProjectModal={() => {
                setEditingProject(null);
                setIsProjectModalOpen(true);
              }}
              language={language}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              projects={projects}
              activeProject={activeProject}
              onSelectProject={handleSelectProject}
              onOpenNewModal={() => {
                setEditingProject(null);
                setIsProjectModalOpen(true);
              }}
              onOpenEditModal={(proj) => {
                setEditingProject(proj);
                setIsProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
              onProjectsUpdated={handleRefreshProjects}
              language={language}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'import' && (
            <ImportView
              activeProject={activeProject}
              onUpdateProject={handleUpdateActiveProject}
              language={language}
            />
          )}

          {currentTab === 'terrain' && (
            <TerrainView
              activeProject={activeProject}
              onUpdateProject={handleUpdateActiveProject}
              language={language}
            />
          )}

          {currentTab === 'road-analysis' && (
            <RoadAnalysisView
              activeProject={activeProject}
              onUpdateProject={handleUpdateActiveProject}
              language={language}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'hydrology' && (
            <HydrologyView
              activeProject={activeProject}
              onUpdateProject={handleUpdateActiveProject}
              language={language}
            />
          )}

          {currentTab === 'culvert' && (
            <CulvertView
              activeProject={activeProject}
              onUpdateProject={handleUpdateActiveProject}
              language={language}
            />
          )}

          {currentTab === 'map' && (
            <MapView
              activeProject={activeProject}
              language={language}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              activeProject={activeProject}
              language={language}
            />
          )}

          {currentTab === 'report' && (
            <ReportView
              activeProject={activeProject}
              language={language}
            />
          )}

          {currentTab === 'history' && (
            <HistoryView
              activeProject={activeProject}
              language={language}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              activeProject={activeProject}
              onUpdateProject={handleUpdateActiveProject}
              language={language}
              onLanguageChange={handleLanguageChange}
            />
          )}
        </main>
      </div>

      {/* Engineering Bento Status Footer */}
      <footer className="h-8 bg-[#2c3e50] border-t border-[#1a252f] text-slate-300 px-4 sm:px-6 hidden sm:flex items-center justify-between text-[11px] font-mono select-none">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>HYDRAULIC ENGINE READY</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">
            {activeProject ? `${activeProject.name} (${activeProject.projectNumber})` : 'NO PROJECT ACTIVE'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span>CRS: {activeProject?.crsInfo?.projectCRS || 'UTM 48N'}</span>
          <span className="text-slate-500">|</span>
          <span className="text-[#e67e22]">NORM: БНбД 2.05.02-84</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        language={language}
      />

      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProjectModal}
        initialProject={editingProject}
        language={language}
      />
    </div>
  );
}
