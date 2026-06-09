import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { memoriesAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const heartIcon = L.divIcon({
  className: '',
  html: '<span style="font-size: 28px; filter: drop-shadow(0 2px 8px rgba(236,72,153,0.5));">❤️</span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function LoveMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [memories, setMemories] = useState([]);
  const [center] = useState([-1.9441, 30.0619]);

  useEffect(() => {
    memoriesAPI.getAll().then(r => {
      const withCoords = r.data.filter(m => m.latitude && m.longitude);
      setMemories(withCoords);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;
    const map = L.map(mapRef.current, {
      center,
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);
    mapInstance.current = map;
    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [center]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || memories.length === 0) return;
    const bounds = L.latLngBounds();
    memories.forEach(m => {
      const lat = parseFloat(m.latitude);
      const lng = parseFloat(m.longitude);
      if (isNaN(lat) || isNaN(lng)) return;
      const marker = L.marker([lat, lng], { icon: heartIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; min-width: 180px;">
          <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #1a1a2e;">${m.title}</h3>
          ${m.description ? `<p style="margin: 0 0 4px; font-size: 12px; color: #6b5b70;">${m.description.substring(0, 100)}${m.description.length > 100 ? '...' : ''}</p>` : ''}
          <p style="margin: 0; font-size: 11px; color: #999;">
            📅 ${new Date(m.memory_date).toLocaleDateString()}
            ${m.location ? `&nbsp;📍 ${m.location}` : ''}
          </p>
        </div>
      `);
      bounds.extend([lat, lng]);
    });
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50] });
  }, [memories]);

  return (
    <PageTransition>
      <div className="page-container">
        <div className="content-wrapper">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
            <h1 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Love Map</h1>
            <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ background: 'rgba(34,211,238,0.08)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.12)' }}
            >📍 Our Love Map</span>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Places We've Loved</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {memories.length > 0
                ? `${memories.length} memories mapped across the world`
                : 'Add locations to your memories to see them on the map'}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}
          >
            <div ref={mapRef} style={{ height: '65vh', width: '100%', borderRadius: '16px' }} />
          </motion.div>

          {memories.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state mt-6">
              <div className="empty-state-icon"><i className="bi-geo-alt" /></div>
              <p className="empty-state-title">No locations yet</p>
              <p className="empty-state-desc">When you create or edit a memory, add the location and we'll show it here on the map.</p>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
