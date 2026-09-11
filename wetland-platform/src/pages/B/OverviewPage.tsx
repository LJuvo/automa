import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import L, { Map as LMap, Marker, Popup, TileLayer } from 'leaflet';
import { Bell, Droplets, Gauge, Activity, Zap, AlertTriangle, MapPin, ExternalLink, ChevronRight, Radio } from 'lucide-react';
import { sites, alarms } from '@/data/mockData';

/* ── 6 座污水厂的真实近似坐标（赣州中心城区）──
 * 章贡区中心 ≈ 25.830, 114.935
 * 蓉江新区   ≈ 25.848, 114.872
 * 赣县区     ≈ 25.905, 115.110
 * 南康区     ≈ 25.660, 114.750
 */
type SitePoint = {
  id: string; name: string; zone: string; lat: number; lng: number;
  capacity: string; flow: string; status: '正常' | '报警' | '离线';
  alarms: number;
};

const POINTS: SitePoint[] = [
  { id: 'B02', name: '建春污水处理厂一期', zone: '章贡区',  lat: 25.825, lng: 114.940, capacity: '2.0 万 m³/d', flow: '620 m³/h',  status: '正常', alarms: 0 },
  { id: 'B03', name: '金风梅园污水处理厂', zone: '蓉江新区', lat: 25.852, lng: 114.868, capacity: '3.0 万 m³/d', flow: '860 m³/h',  status: '正常', alarms: 0 },
  { id: 'B04', name: '沙石污水处理厂',     zone: '章贡区',  lat: 25.802, lng: 114.948, capacity: '2.0 万 m³/d', flow: '580 m³/h',  status: '报警', alarms: 2 },
  { id: 'B05', name: '蓉江新区污水处理厂二期', zone: '蓉江新区', lat: 25.845, lng: 114.870, capacity: '4.0 万 m³/d', flow: '1240 m³/h', status: '正常', alarms: 0 },
  { id: 'B06', name: '水东再生水厂',       zone: '赣县区',  lat: 25.898, lng: 115.050, capacity: '2.5 万 m³/d', flow: '680 m³/h',  status: '正常', alarms: 0 },
  { id: 'B07', name: '白塔污泥处理处置中心', zone: '章贡区', lat: 25.862, lng: 114.895, capacity: '100 吨/d',    flow: '100 吨/d',  status: '正常', alarms: 0 },
];

const ZONE_POLYGONS = {
  '章贡区':  { name: '章贡区', color: '#0891b2', fill: 'rgba(8,145,178,0.10)', coords: [[25.78,114.88],[25.80,114.98],[25.86,115.00],[25.88,114.92],[25.85,114.86]] },
  '蓉江新区': { name: '蓉江新区', color: '#0284c7', fill: 'rgba(2,132,199,0.10)', coords: [[25.82,114.83],[25.88,114.83],[25.88,114.88],[25.84,114.92],[25.80,114.90]] },
  '赣县区':  { name: '赣县区', color: '#16a34a', fill: 'rgba(22,163,74,0.10)', coords: [[25.86,114.98],[25.92,115.00],[25.94,115.13],[25.90,115.16],[25.85,115.08]] },
  '南康区':  { name: '南康区', color: '#d97706', fill: 'rgba(217,119,6,0.08)', coords: [[25.58,114.68],[25.70,114.68],[25.70,114.82],[25.60,114.82]] },
};

const STATUS_COLOR = {
  '正常': { dot: '#22c55e', ring: '#22c55e', pulse: 'normal' },
  '报警': { dot: '#ef4444', ring: '#ef4444', pulse: 'alarm' },
  '离线': { dot: '#94a3b8', ring: '#94a3b8', pulse: 'off' },
};

export function OverviewPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [selected, setSelected] = useState<SitePoint | null>(null);
  const navigate = useNavigate()
  const [tileReady, setTileReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // 初始化地图 — 赣州中心城区
    const map = L.map(mapContainer.current, {
      center: [25.84, 114.92],
      zoom: 12,
      minZoom: 10,
      maxZoom: 16,
      zoomControl: true,
      attributionControl: false,
    });

    // 瓦片：高德中文（国内最快）+ CARTO light 作为备选
    const gaode = L.tileLayer(
      'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      { subdomains: ['1','2','3','4'], maxZoom: 16 }
    );
    const carto = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', maxZoom: 16, attribution: '© OpenStreetMap © CARTO' }
    );

    let tileLoaded = false;
    gaode.on('load', () => { if (!tileLoaded) { tileLoaded = true; setTileReady(true); } });
    gaode.on('error', () => {
      if (!tileLoaded) { carto.addTo(map); setTileReady(true); }
    });
    gaode.addTo(map);

    mapRef.current = map;

    // 区县边界（用半透明多边形）
    Object.values(ZONE_POLYGONS).forEach(z => {
      L.polygon(z.coords as [number, number][], {
        color: z.color,
        weight: 1.5,
        fillColor: z.color,
        fillOpacity: 0.08,
        dashArray: '4 4',
      }).addTo(map).bindTooltip(z.name, { direction: 'center', className: 'zone-tooltip' });
    });

    // 6 个站点 Marker
    POINTS.forEach(p => {
      const c = STATUS_COLOR[p.status];
      const pulseClass = c.pulse === 'alarm' ? 'pulse-alarm' : '';

      const icon = L.divIcon({
        className: '',
        html: `
          <div class="site-marker ${pulseClass}" style="color: ${c.ring}">
            <div class="dot" style="background: ${c.dot}"></div>
            <div class="ring"></div>
            <div class="inner" style="background: ${c.dot}"></div>
          </div>
          <div class="site-label">
            <span><span style="color:${c.dot};display:inline-block;width:6px;height:6px;border-radius:50%;margin-right:4px;"></span>${p.name}</span>
            <span class="sub">${p.zone} · ${p.flow}</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      });

      const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
      m.on('click', () => {
        setSelected(p);
        try { map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 13), { duration: 0.6 }); } catch {}
        setTimeout(() => navigate(`/page/${p.id.toLowerCase()}`), 650);
      });
      markersRef.current.push(m);
    });

    // 点击地图关闭选中
    map.on('click', () => setSelected(null));

    // 防止组件卸载后的残留
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 自动缩放以显示所有点位
  useEffect(() => {
    if (!mapRef.current || !tileReady) return;
    const bounds = L.latLngBounds(POINTS.map(p => [p.lat, p.lng]));
    mapRef.current.fitBounds(bounds, { padding: [40, 40] });
  }, [tileReady]);

  const totalAlarms = POINTS.filter(p => p.status === '报警').length;
  const totalFlow = POINTS.reduce((s, p) => s + parseInt(p.flow) || 0, 0);
  const totalCapacity = POINTS.reduce((s, p) => {
    const n = parseFloat(p.capacity.replace(/[^\d.]/g,''));
    return s + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <div className="h-full flex flex-col gap-3">

      {/* 顶部报警滚动条 */}
      {totalAlarms > 0 && (
        <div className="h-9 rounded-md flex items-center bg-gradient-to-r from-[var(--status-danger)] to-[#dc2626] text-white overflow-hidden shadow-[0_1px_3px_rgb(220_38_38_/_0.3)]">
          <div className="px-3 h-full flex items-center gap-1.5 shrink-0 bg-white/15 border-r border-white/20 text-[12px] font-semibold">
            <AlertTriangle size={14} className="pulse-dot" /> 实时报警
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="whitespace-nowrap text-[11.5px] animate-[marquee_30s_linear_infinite]">
              {alarms.filter(a => a.status === '活跃').map(a => (
                <span key={a.id} className="mx-6 opacity-95">
                  [{a.level}] {a.time.split(' ')[1]} · {a.site} · {a.location} · {a.description}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 主体：左地图 + 右侧面板 */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">

        {/* ═══ 中央真实地图 ═══ */}
        <div className="col-span-8 rounded-lg border border-[var(--neutral-200)] bg-white relative overflow-hidden">

          {/* 地图标题栏（悬浮）*/}
          <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center h-9 px-3 bg-white/95 backdrop-blur border-b border-[var(--neutral-200)]">
            <MapPin size={14} className="text-[var(--brand-600)] mr-1.5" />
            <span className="text-[13px] font-semibold text-[var(--neutral-800)]">全厂总览 · 赣州中心城区</span>
            <span className="text-[11px] text-[var(--neutral-400)] ml-2">共 6 座污水厂 · 4 个市辖区</span>
            {!tileReady && (
              <span className="ml-3 flex items-center gap-1 text-[11px] text-[var(--neutral-500)]">
                <Radio size={11} className="animate-spin" /> 加载地图瓦片...
              </span>
            )}
            {tileReady && (
              <span className="ml-3 flex items-center gap-1 text-[11px] text-[var(--status-success)]">
                <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot"></span> 瓦片已就绪
              </span>
            )}

            {/* 图层说明 */}
            <div className="ml-auto flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[var(--status-success)]"></span> 正常</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[var(--status-danger)]"></span> 报警</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[var(--neutral-400)]"></span> 离线</span>
            </div>
          </div>

          {/* Leaflet 容器 */}
          <div ref={mapContainer} className="w-full h-full pt-9" />

          {/* 右下角浮层：选中站点详情 */}
          {selected && (
            <div className="absolute bottom-3 left-3 z-[1000] w-[320px] bg-white rounded-lg border border-[var(--neutral-200)] shadow-[var(--shadow-lg)] overflow-hidden">
              <div className="h-10 px-3 flex items-center justify-between bg-[var(--brand-50)] border-b border-[var(--neutral-200)]">
                <span className="text-[12.5px] font-semibold text-[var(--neutral-800)]">{selected.name}</span>
                <button onClick={() => setSelected(null)} className="text-[var(--neutral-400)] hover:text-[var(--neutral-600)] text-[16px] leading-none">×</button>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-2 text-[11.5px]">
                  <span className="text-[var(--neutral-500)] w-14">所属区域</span>
                  <span className="font-medium text-[var(--neutral-800)]">{selected.zone}</span>
                  <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium ${selected.status === '正常' ? 'bg-[var(--status-success)]/15 text-[var(--status-success)]' : selected.status === '报警' ? 'bg-[var(--status-danger)]/15 text-[var(--status-danger)]' : 'bg-[var(--neutral-200)] text-[var(--neutral-500)]'}`}>
                    {selected.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11.5px]">
                  <span className="text-[var(--neutral-500)] w-14">处理规模</span>
                  <span className="font-mono font-bold text-[var(--brand-700)]">{selected.capacity}</span>
                </div>
                <div className="flex items-center gap-2 text-[11.5px]">
                  <span className="text-[var(--neutral-500)] w-14">当前流量</span>
                  <span className="font-mono text-[var(--neutral-800)] font-bold">{selected.flow}</span>
                </div>
                <Link to={`/page/${selected.id.toLowerCase()}`}
                  className="mt-1 flex items-center justify-center gap-1 h-8 rounded-md bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white text-[12px] font-medium">
                  查看 PFD 工艺流程图 <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ═══ 右侧面板 ═══ */}
        <aside className="col-span-4 flex flex-col gap-3 min-h-0">

          {/* KPI 总览 */}
          <div className="card p-3">
            <h3 className="text-[11.5px] font-semibold text-[var(--neutral-500)] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Activity size={11} /> 今日全厂 KPI
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg p-2.5 border border-[var(--neutral-200)] bg-[var(--brand-50)]/40">
                <div className="flex items-center gap-1 text-[10.5px] text-[var(--neutral-500)]"><Droplets size={11} /> 总处理量</div>
                <div className="flex items-baseline gap-0.5 mt-0.5">
                  <span className="text-[20px] font-bold font-mono text-[var(--brand-700)]">12,450</span>
                  <span className="text-[10.5px] text-[var(--neutral-500)]">m³/h</span>
                </div>
              </div>
              <div className="rounded-lg p-2.5 border border-[var(--neutral-200)] bg-[var(--status-success)]/10">
                <div className="flex items-center gap-1 text-[10.5px] text-[var(--neutral-500)]"><Gauge size={11} /> 出水达标率</div>
                <div className="flex items-baseline gap-0.5 mt-0.5">
                  <span className="text-[20px] font-bold font-mono text-[var(--status-success)]">99.8</span>
                  <span className="text-[10.5px] text-[var(--neutral-500)]">%</span>
                </div>
              </div>
              <div className="rounded-lg p-2.5 border border-[var(--neutral-200)] bg-amber-50">
                <div className="flex items-center gap-1 text-[10.5px] text-[var(--neutral-500)]"><Zap size={11} /> 吨水耗电</div>
                <div className="flex items-baseline gap-0.5 mt-0.5">
                  <span className="text-[18px] font-bold font-mono text-[var(--neutral-800)]">0.32</span>
                  <span className="text-[10.5px] text-[var(--neutral-500)]">kWh/m³</span>
                </div>
              </div>
              <div className="rounded-lg p-2.5 border border-[var(--neutral-200)] bg-[var(--status-success)]/10">
                <div className="flex items-center gap-1 text-[10.5px] text-[var(--neutral-500)]"><Radio size={11} /> 在线设备</div>
                <div className="flex items-baseline gap-0.5 mt-0.5">
                  <span className="text-[18px] font-bold font-mono text-[var(--neutral-800)]">318</span>
                  <span className="text-[10.5px] text-[var(--neutral-500)]">/ 320</span>
                </div>
              </div>
            </div>
          </div>

          {/* 站点列表（带状态）*/}
          <div className="card p-3 flex-1 min-h-0 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11.5px] font-semibold text-[var(--neutral-500)] uppercase tracking-wider flex items-center gap-1">
                <MapPin size={11} /> 6 座子项实时状态
              </h3>
              <Link to="/page/b02" className="text-[10.5px] text-[var(--brand-600)] hover:underline">全部工艺 →</Link>
            </div>
            <div className="flex-1 overflow-auto space-y-1.5 pr-1">
              {POINTS.map(p => {
                const c = STATUS_COLOR[p.status];
                return (
                  <Link key={p.id} to={`/page/${p.id.toLowerCase()}`}
                    className={`flex items-center gap-2.5 rounded-lg border p-2 transition
                      ${selected?.id === p.id ? 'border-[var(--brand-400)] bg-[var(--brand-50)]' : 'border-[var(--neutral-200)] hover:border-[var(--brand-300)] hover:bg-[var(--neutral-50)]'}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${p.status === '报警' ? 'pulse-dot' : ''}`} style={{ background: c.dot }}></span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium text-[var(--neutral-800)] truncate flex items-center gap-1.5">
                        {p.name}
                        <span className="font-mono text-[10px] text-[var(--neutral-400)]">{p.id}</span>
                      </div>
                      <div className="text-[10.5px] text-[var(--neutral-500)]">{p.zone} · {p.flow}</div>
                    </div>
                    <ExternalLink size={12} className="text-[var(--neutral-300)] shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* 隐藏全局 CSS keyframes — marquee 动画定义 */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
