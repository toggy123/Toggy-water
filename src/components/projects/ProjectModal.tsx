import React, { useState, useEffect } from 'react';
import { Project, CoordinateSystem, Language } from '../../types';
import { translations } from '../../i18n';
import { X, Save, Building2, MapPin, Calendar, FileText, UserCheck, Compass } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<Project>) => void;
  initialProject?: Project | null;
  language: Language;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProject,
  language,
}) => {
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: '',
    projectNumber: '',
    client: '',
    roadName: '',
    province: 'Төв аймаг',
    soum: 'Сүмбэр сум',
    roadSection: 'PK 0+000 - PK 20+000',
    engineer: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    projectCRS: 'UTM_ZONE_48N' as CoordinateSystem,
  });

  useEffect(() => {
    if (initialProject) {
      setFormData({
        name: initialProject.name || '',
        projectNumber: initialProject.projectNumber || '',
        client: initialProject.client || '',
        roadName: initialProject.roadName || '',
        province: initialProject.province || 'Төв аймаг',
        soum: initialProject.soum || '',
        roadSection: initialProject.roadSection || '',
        engineer: initialProject.engineer || '',
        date: initialProject.date || new Date().toISOString().split('T')[0],
        notes: initialProject.notes || '',
        projectCRS: initialProject.crsInfo?.projectCRS || 'UTM_ZONE_48N',
      });
    } else {
      setFormData({
        name: '',
        projectNumber: `MDR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        client: 'Зам, тээврийн хөгжлийн яам',
        roadName: '',
        province: 'Дархан-Уул',
        soum: 'Хонгор сум',
        roadSection: 'PK 0+000 - PK 30+000',
        engineer: 'Тэргүүлэх инженер',
        date: new Date().toISOString().split('T')[0],
        notes: 'Монгол Улсын замын БНбД 2.05.02-84 норм баримталсан.',
        projectCRS: 'UTM_ZONE_48N',
      });
    }
  }, [initialProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      name: formData.name.trim(),
      projectNumber: formData.projectNumber.trim(),
      client: formData.client.trim(),
      roadName: formData.roadName.trim(),
      province: formData.province.trim(),
      soum: formData.soum.trim(),
      roadSection: formData.roadSection.trim(),
      engineer: formData.engineer.trim(),
      date: formData.date,
      notes: formData.notes.trim(),
      crsInfo: {
        sourceCRS: 'WGS84',
        projectCRS: formData.projectCRS,
        demCRS: formData.projectCRS,
        roadCRS: 'WGS84',
        datumName: formData.projectCRS === 'UTM_ZONE_48N' ? 'WGS 84 / UTM Zone 48N' : 'WGS 84 / UTM Zone 49N',
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white">
              {initialProject ? t.project.title + ' (Засах)' : t.app.newProject}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'mn'
                ? 'Монгол орны авто замын төслийн ерөнхий үзүүлэлтүүд'
                : 'Enter project details, engineer data and coordinate system'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Project Name & Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.project.fields.name} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="жишээ: Улаанбаатар - Дархан чиглэлийн авто зам"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.project.fields.projectNumber}
              </label>
              <input
                type="text"
                value={formData.projectNumber}
                onChange={(e) => setFormData({ ...formData, projectNumber: e.target.value })}
                placeholder="MDR-2026-A01"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Client & Road Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
                <Building2 className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                {t.project.fields.client}
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="ЗТХЯ, Азийн хөгжлийн банк"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                {t.project.fields.roadName}
              </label>
              <input
                type="text"
                value={formData.roadName}
                onChange={(e) => setFormData({ ...formData, roadName: e.target.value })}
                placeholder="А0101 Улсын чанартай авто зам"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Province (Аймаг), Soum (Сум), Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.project.fields.province}
              </label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                placeholder="Дархан-Уул, Төв аймаг..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.project.fields.soum}
              </label>
              <input
                type="text"
                value={formData.soum}
                onChange={(e) => setFormData({ ...formData, soum: e.target.value })}
                placeholder="Хонгор сум, Баянчандмань..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.project.fields.roadSection}
              </label>
              <input
                type="text"
                value={formData.roadSection}
                onChange={(e) => setFormData({ ...formData, roadSection: e.target.value })}
                placeholder="PK 0+000 - PK 45+800"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Engineer, Date, Coordinate System (CRS) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
                <UserCheck className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                {t.project.fields.engineer}
              </label>
              <input
                type="text"
                value={formData.engineer}
                onChange={(e) => setFormData({ ...formData, engineer: e.target.value })}
                placeholder="Инженер Б.Төгөлдөр"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                {t.project.fields.date}
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
                <Compass className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                {t.project.fields.crs}
              </label>
              <select
                value={formData.projectCRS}
                onChange={(e) => setFormData({ ...formData, projectCRS: e.target.value as CoordinateSystem })}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="UTM_ZONE_48N">UTM 48N (Төв ба Баруун Монгол)</option>
                <option value="UTM_ZONE_49N">UTM 49N (Зүүн Монгол)</option>
                <option value="WGS84">WGS84 (Газарзүйн коорд.)</option>
                <option value="MSK_42">MSK-42 (Монголын орон нутгийн)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
              <FileText className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
              {t.project.fields.notes}
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Гидрологи, геологийн нөхцөл, онцлог шаардлага..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition"
            >
              <Save className="w-4 h-4" />
              <span>{t.common.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
