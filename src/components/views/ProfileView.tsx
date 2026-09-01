import React from 'react';
import { Project, Language } from '../../types';
import { translations } from '../../i18n';
import {
  LineChart,
  Mountain,
  Compass,
  Route,
  Pipette,
  CheckCircle2,
  Info
} from 'lucide-react';

interface ProfileViewProps {
  activeProject: Project | null;
  language: Language;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  activeProject,
  language,
}) => {
  const t = translations[language];

  if (!activeProject) return null;

  const points = activeProject.drainagePoints || [];

  // Generate elevation profile points along road
  const sampledPoints = activeProject.roadAlignment?.sampledPoints || [];

  return (
    <div className="space-y-6">
      {/* Header Bento Box */}
      <div className="bg-[#1a252f] text-white border border-[#0d141b] p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2 text-[#3498db] text-xs font-bold uppercase tracking-wider mb-1">
          <LineChart className="w-4 h-4" />
          <span>{language === 'mn' ? 'АВТО ЗАМЫН ДАГУУ ОГТЛОЛ' : 'ROAD LONGITUDINAL PROFILE'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          {language === 'mn' ? 'Трассын Өндөржилтийн Огтлол ба Хоолойн Байршил' : 'Elevation Profile & Culvert Invert Elevations'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {language === 'mn'
            ? 'Пикет дагуух газрын гадаргын өндөржилт, байгалийн хонхор хотгор, ус өнгөрүүлэх хоолойн байршил.'
            : 'Longitudinal elevation profile showing natural depressions, terrain undulations and culvert invert levels.'}
        </p>
      </div>

      {/* Profile Graphic Simulation Bento Card */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#1a252f] text-base">
            {language === 'mn' ? 'Өндөржилтийн муруй (PK vs Elevation H, м)' : 'Terrain Elevation Profile (PK vs Height H, m)'}
          </h3>
          <span className="text-xs font-mono font-bold text-gray-500 bg-[#f8f9fa] px-3 py-1 rounded-lg border border-gray-200">
            {activeProject.roadSection || 'PK 0+000 - PK 25+000'}
          </span>
        </div>

        {/* SVG Profile Chart within Dark Monitor */}
        <div className="h-64 sm:h-80 bg-[#1a252f] rounded-2xl border border-[#0d141b] p-4 relative overflow-hidden flex flex-col justify-between shadow-inner">
          <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="50" x2="800" y2="50" stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="150" x2="800" y2="150" stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />

            {/* Terrain Line */}
            <path
              d="M 0 140 Q 150 70, 300 130 T 600 80 T 800 110 L 800 200 L 0 200 Z"
              fill="url(#terrainGradient)"
              opacity="0.3"
            />
            <path
              d="M 0 140 Q 150 70, 300 130 T 600 80 T 800 110"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
            />

            {/* Culvert Marker Points on Profile */}
            {points.map((pt, idx) => {
              const xPos = 150 + idx * 220;
              const yPos = 120 + (idx % 2) * 15;
              const isBox = pt.culvertType === 'RECTANGULAR_BOX';

              return (
                <g key={pt.id} transform={`translate(${xPos}, ${yPos})`}>
                  <line x1="0" y1="0" x2="0" y2="70" stroke={isBox ? '#a855f7' : '#0284c7'} strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="0" cy="0" r="6" fill={isBox ? '#a855f7' : '#0284c7'} stroke="#ffffff" strokeWidth="2" />
                  <text x="10" y="-8" fill="#f8fafc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    {pt.id} ({pt.chainageFormatted})
                  </text>
                  <text x="10" y="6" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                    Q={pt.peakDischargeQ.toFixed(2)}m³/s
                  </text>
                </g>
              );
            })}

            <defs>
              <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-700">
            <span>PK 0+000 (Start)</span>
            <span>PK 12+450 (D-001)</span>
            <span>PK 13+800 (D-002)</span>
            <span>PK 15+120 (D-003)</span>
            <span>PK 25+000 (End)</span>
          </div>
        </div>

        {/* Profile Stats Bento Table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#f8f9fa] border border-gray-200 rounded-xl shadow-sm">
            <span className="text-xs text-gray-500 font-bold block">{language === 'mn' ? 'Мин өндөржилт' : 'Min Invert Elevation'}</span>
            <span className="text-xl font-bold font-mono text-[#1a252f]">770.0 м</span>
          </div>
          <div className="p-4 bg-[#f8f9fa] border border-gray-200 rounded-xl shadow-sm">
            <span className="text-xs text-gray-500 font-bold block">{language === 'mn' ? 'Макс өндөржилт' : 'Max Crest Elevation'}</span>
            <span className="text-xl font-bold font-mono text-[#3498db]">865.0 м</span>
          </div>
          <div className="p-4 bg-[#f8f9fa] border border-gray-200 rounded-xl shadow-sm">
            <span className="text-xs text-gray-500 font-bold block">{language === 'mn' ? 'Өндрийн зөрүү ΔH' : 'Elevation Difference ΔH'}</span>
            <span className="text-xl font-bold font-mono text-emerald-700">95.0 м</span>
          </div>
        </div>
      </div>
    </div>
  );
};
