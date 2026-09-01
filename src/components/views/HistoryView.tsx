import React from 'react';
import { Project, Language } from '../../types';
import { translations } from '../../i18n';
import {
  History,
  Clock,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Activity
} from 'lucide-react';

interface HistoryViewProps {
  activeProject: Project | null;
  language: Language;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  activeProject,
  language,
}) => {
  const t = translations[language];

  if (!activeProject) return null;

  const logs = activeProject.auditLogs || [];

  return (
    <div className="space-y-6">
      {/* Header Bento Box */}
      <div className="bg-[#1a252f] text-white border border-[#0d141b] p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2 text-[#3498db] text-xs font-bold uppercase tracking-wider mb-1">
          <History className="w-4 h-4" />
          <span>{language === 'mn' ? 'ТҮҮХ БА АУДИТЫН БҮРТГЭЛ' : 'HISTORY & AUDIT LOGS'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          {language === 'mn' ? 'Инженерийн Тооцоо, Засвар Өөрчлөлтийн Түүх' : 'Engineering Calculations & Revision History'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {language === 'mn'
            ? 'Өмнөх тооцоонуудыг өөрчлөхгүйгээр төслийн засвар, гидрологи, хоолойн шийдлийг цаг хугацааны дарааллаар хадгална.'
            : 'Immutable record of hydrological model runs, culvert sizing revisions and engineer approvals.'}
        </p>
      </div>

      {/* Audit Log Timeline Bento Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h3 className="font-bold text-[#1a252f] text-base flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#3498db]" />
            <span>{language === 'mn' ? 'Цаг хугацааны бүртгэл' : 'Project Activity Log'}</span>
          </h3>
          <span className="text-xs font-mono font-bold text-gray-500 bg-[#f8f9fa] px-3 py-1 rounded-lg border border-gray-200">
            {logs.length} {language === 'mn' ? 'бүртгэгдсэн үйлдэл' : 'entries'}
          </span>
        </div>

        <div className="space-y-4">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-[#f8f9fa] border border-gray-200 flex items-start justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-50 text-[#3498db] border border-blue-200">
                      {log.action}
                    </span>
                    <span className="text-xs font-bold text-[#1a252f]">{log.details}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-gray-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium text-gray-700">{log.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs">
              {language === 'mn' ? 'Түүхийн бүртгэл хоосон байна.' : 'No audit entries yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
