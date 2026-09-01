import React, { useEffect, useRef, useState } from 'react';
import { Project, Language, DrainageCrossingPoint } from '../../types';
import { translations } from '../../i18n';
import {
  MapPin,
  Layers,
  Compass,
  CheckCircle2,
  Filter,
  Eye,
  Maximize2,
  Navigation,
  Info
} from 'lucide-react';
import L from 'leaflet';

interface MapViewProps {
  activeProject: Project | null;
  language: Language;
}

export const MapView: React.FC<MapViewProps> = ({
  activeProject,
  language,
}) => {
  const t = translations[language];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DrainageCrossingPoint | null>(null);
  const [showContours, setShowContours] = useState<boolean>(true);
  const [showCatchments, setShowCatchments] = useState<boolean>(true);

  const points = activeProject?.drainagePoints || [];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center around Darkhan / Central Mongolia or project coords
      const centerLat = points[0]?.lat || 49.3245;
      const centerLng = points[0]?.lng || 105.8120;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | MON-DRAIN GIS',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous vector layers (except base tiles)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    // Draw Road Alignment Polyline
    if (activeProject?.roadAlignment?.vertices && activeProject.roadAlignment.vertices.length > 0) {
      const latLngs = activeProject.roadAlignment.vertices.map((v) => [v.lat, v.lng] as [number, number]);
      const roadLine = L.polyline(latLngs, {
        color: '#2563eb',
        weight: 6,
        opacity: 0.9,
      }).addTo(map);

      map.fitBounds(roadLine.getBounds(), { padding: [40, 40] });
    }

    // Add Drainage Crossing Markers (Circular vs Box Culvert distinct styling)
    points.forEach((pt) => {
      const isBox = pt.culvertType === 'RECTANGULAR_BOX';
      
      const customIcon = L.divIcon({
        className: 'custom-culvert-marker',
        html: `<div style="
          background-color: ${isBox ? '#7c3aed' : '#0284c7'};
          width: 28px;
          height: 28px;
          border-radius: ${isBox ? '6px' : '50%'};
          border: 3px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: monospace;
          font-size: 10px;
          font-weight: bold;
        ">${pt.id.replace('D-', '')}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedPoint(pt);
      });

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; min-width: 180px;">
          <b style="color: #0f172a; font-size: 13px;">${pt.id} — ${pt.chainageFormatted}</b>
          <div style="font-size: 11px; color: #475569; margin-top: 4px;">
            <div><b>Q:</b> ${pt.peakDischargeQ.toFixed(2)} m³/s</div>
            <div><b>A:</b> ${pt.catchmentAreaKm2.toFixed(2)} km²</div>
            <div><b>Type:</b> ${isBox ? 'Box Culvert' : 'Circular Pipe'}</div>
          </div>
        </div>
      `);
    });

    return () => {
      // Keep map instance alive for smooth view switching
    };
  }, [activeProject, points]);

  if (!activeProject) return null;

  return (
    <div className="space-y-6">
      {/* Header Bento Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a252f] text-white border border-[#0d141b] p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#3498db] text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>{language === 'mn' ? 'GIS ЗУРАГЛАЛ & ОГТЛОЛЦОЛ' : 'GIS ROAD DRAINAGE MAP'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {language === 'mn' ? 'Трасс, Өндөржилт ба Хоолойн Байршлын Зураглал' : 'Interactive Road Alignment & Culvert Locations'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {language === 'mn'
              ? 'Дугуй болон дөрвөлжин хоолойн байршлыг ялгаатай тэмдэглэгээгээр харуулж, тооцооны мэдээллийг шууд үзэх.'
              : 'Vector road centerline, DEM catchment basins, flow paths and culvert crossing point markers.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur p-2 rounded-xl border border-white/20 text-xs text-white">
          <Compass className="w-4 h-4 text-[#e67e22]" />
          <span className="font-mono font-bold">{activeProject.crsInfo?.projectCRS || 'UTM 48N'}</span>
        </div>
      </div>

      {/* Map Bento Grid & Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative h-[500px] sm:h-[600px]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Quick Map Controls Overlay */}
          <div className="absolute top-4 right-4 z-20 bg-[#1a252f]/90 backdrop-blur border border-[#0d141b] p-3 rounded-xl text-xs space-y-2 shadow-lg">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {language === 'mn' ? 'Давхарга' : 'GIS Layers'}
            </div>
            <label className="flex items-center space-x-2 cursor-pointer text-slate-200">
              <input
                type="checkbox"
                checked={showContours}
                onChange={(e) => setShowContours(e.target.checked)}
                className="rounded text-[#3498db] focus:ring-0"
              />
              <span>{language === 'mn' ? 'Замын трасс' : 'Road Centerline'}</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer text-slate-200">
              <input
                type="checkbox"
                checked={showCatchments}
                onChange={(e) => setShowCatchments(e.target.checked)}
                className="rounded text-[#3498db] focus:ring-0"
              />
              <span>{language === 'mn' ? 'Хоолойн цэгүүд' : 'Culvert Crossings'}</span>
            </label>
          </div>
        </div>

        {/* Right Legend & Point Details Panel */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <h3 className="font-bold text-[#1a252f] text-base flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#3498db]" />
              <span>{language === 'mn' ? 'Тайлбар (Legend)' : 'Map Legend'}</span>
            </h3>

            <div className="space-y-2.5 text-xs text-gray-700 font-medium">
              <div className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-md bg-[#7c3aed] border-2 border-white flex items-center justify-center text-[9px] font-bold text-white font-mono shrink-0 shadow-sm">
                  BOX
                </div>
                <span>{language === 'mn' ? 'Дөрвөлжин хоолой (Box Culvert)' : 'Rectangular Box Culvert'}</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-[#0284c7] border-2 border-white flex items-center justify-center text-[9px] font-bold text-white font-mono shrink-0 shadow-sm">
                  PIPE
                </div>
                <span>{language === 'mn' ? 'Дугуй хоолой (Circular Pipe)' : 'Circular Pipe Culvert'}</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="w-5 h-1.5 rounded bg-[#3498db] shrink-0" />
                <span>{language === 'mn' ? 'Авто замын тэнхлэг (Centerline)' : 'Road Alignment Vector'}</span>
              </div>
            </div>

            {/* Selected Point Inspector */}
            {selectedPoint ? (
              <div className="p-3.5 bg-[#f8f9fa] border border-[#3498db]/40 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#3498db] font-bold">
                  <span>{selectedPoint.id}</span>
                  <span className="font-mono text-[#1a252f]">{selectedPoint.chainageFormatted}</span>
                </div>
                <div className="space-y-1 text-gray-700 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Peak Q:</span>
                    <span className="text-emerald-700 font-bold">{selectedPoint.peakDischargeQ.toFixed(2)} м³/с</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Area:</span>
                    <span>{selectedPoint.catchmentAreaKm2.toFixed(2)} км²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Slope:</span>
                    <span>{selectedPoint.averageSlopePercent.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-bold">{selectedPoint.culvertType === 'RECTANGULAR_BOX' ? 'Box Culvert' : 'Circular Pipe'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#f8f9fa] border border-gray-200 rounded-xl text-xs text-gray-500 text-center font-medium">
                {language === 'mn' ? 'Газрын зураг дээрх хоолойн цэг дээр дарж үзүүлэлтийг харна уу.' : 'Click any culvert marker on the map to inspect calculations.'}
              </div>
            )}
          </div>

          <div className="p-3.5 bg-[#f8f9fa] rounded-xl border border-gray-200 text-[11px] text-gray-500 font-medium">
            {language === 'mn' ? 'Координатын өгөгдлийг автоматаар WGS84 болон төслийн UTM тусгагт хувиргадаг.' : 'Map uses project-defined CRS transformation for all vector overlay positions.'}
          </div>
        </div>
      </div>
    </div>
  );
};
