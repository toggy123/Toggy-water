import { Project } from '../types';
import { initialSampleProjects } from '../data/sampleProjects';

const STORAGE_KEY = 'mon_drain_projects_v1';
const ACTIVE_PROJECT_KEY = 'mon_drain_active_project_id_v1';

export class StorageService {
  /**
   * Get all stored projects. Fallbacks to sample test projects if empty.
   */
  static getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveProjects(initialSampleProjects);
        return initialSampleProjects;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveProjects(initialSampleProjects);
        return initialSampleProjects;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to load projects from localStorage:', e);
      return initialSampleProjects;
    }
  }

  /**
   * Save all projects to localStorage
   */
  static saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  }

  /**
   * Get the active project ID
   */
  static getActiveProjectId(): string {
    const activeId = localStorage.getItem(ACTIVE_PROJECT_KEY);
    if (activeId) return activeId;
    const projects = this.getProjects();
    const defaultId = projects[0]?.id || '';
    if (defaultId) {
      this.setActiveProjectId(defaultId);
    }
    return defaultId;
  }

  /**
   * Set the active project ID
   */
  static setActiveProjectId(id: string): void {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  }

  /**
   * Get the currently active project
   */
  static getActiveProject(): Project | null {
    const projects = this.getProjects();
    const activeId = this.getActiveProjectId();
    return projects.find((p) => p.id === activeId) || projects[0] || null;
  }

  /**
   * Save or update a project
   */
  static saveProject(project: Project): void {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    const updated = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      projects[index] = updated;
    } else {
      projects.unshift(updated);
    }

    this.saveProjects(projects);
  }

  /**
   * Delete a project by ID
   */
  static deleteProject(id: string): void {
    let projects = this.getProjects();
    projects = projects.filter((p) => p.id !== id);
    this.saveProjects(projects);

    const activeId = this.getActiveProjectId();
    if (activeId === id && projects.length > 0) {
      this.setActiveProjectId(projects[0].id);
    }
  }

  /**
   * Export project to downloadable JSON
   */
  static exportProject(project: Project): void {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.projectNumber || 'PROJ'}_${project.name.replace(/\s+/g, '_')}.mondrain.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import project from JSON string
   */
  static importProject(jsonString: string): Project {
    const parsed = JSON.parse(jsonString) as Project;
    if (!parsed.id || !parsed.name) {
      throw new Error('Invalid MON-DRAIN project file schema.');
    }
    // Assign a fresh ID if duplicate
    const projects = this.getProjects();
    const existing = projects.find((p) => p.id === parsed.id);
    if (existing) {
      parsed.id = `proj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      parsed.name = `${parsed.name} (Импортолсон)`;
    }
    this.saveProject(parsed);
    this.setActiveProjectId(parsed.id);
    return parsed;
  }
}
