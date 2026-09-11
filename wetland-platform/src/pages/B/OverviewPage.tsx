import { Link } from 'react-router-dom';
import { TrendingUp, AlertTriangle, Activity, Battery, Gauge, Droplets, MapPin, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { sites, kpiData, alarms } from '@/data/mockData';

export function OverviewPage() {
  return (
    <div className="h-full flex flex-col gap-3">
      {/* 顶部报警条 */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white h-9 rounded-md flex items-center overflow-hidden">
        <div className="px-3 text-xs font-semibold bg-white/20 h-full flex items-center shrink-0 border-r border-white/20">
          <AlertTriangle size={14} className="mr-1 inline" />
          报警滚动
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-xs">
            {alarms.filter(a => a.status === '活跃').map(a => (
              <span key={a.id} className="mx-6">
                [{a.level}] {a.time} | {a.site} | {a.location} | {a.description} {a.currentValue && `(${a.currentValue})`} {a.setValue && `| 设定${a.setValue}`}
              </span>
            ))}
            <span className="mx-6 opacity-80">[提示] 2026-08-18 06:00:00 | 白塔污泥处置 | 车间温度 | 26℃</span>
          </div>
        </div>
      </div>

      {/* 主体区域 */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
        {/* 中央地图区域 */}
        <div className="col-span-8 bg-white rounded-lg border border-gray-200 relative overflow-hidden">
          {/* 地图标题 */}
          <div className="absolute top-0 left-0 right-0 h-9 bg-gradient-to-r from-[#155e75]/10 to-transparent flex items-center px-4 border-b border-gray-200">
            <MapPin size={14} className="text-pri mr-1.5" />
            <span className="text-sm font-semibold text-pri-d">全厂总览 · 赣州市中心城区</span>
            <span className="text-[11px] text-gray-400 ml-2">共 6 个子项</span>
          </div>

          {/* SVG 地图 */}
          <svg viewBox="0 0 620 520" className="w-full h-full pt-9">
            {/* 背景区域块 */}
            <defs>
              <linearGradient id="zone1" x1="0" x2="1">
                <stop offset="0" stopColor="#cffafe" stopOpacity="0.8" />
                <stop offset="1" stopColor="#a5f3fc" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* 章贡区 */}
            <path d="M30 60 L 180 40 L 280 80 L 260 200 L 180 240 L 80 220 Z"
                  fill="url(#zone1)" stroke="#0e7490" strokeWidth="1.5" opacity="0.8" />
            <text x="155" y="140" fill="#155e75" fontSize="13" fontWeight="600" textAnchor="middle">章贡区</text>

            {/* 南康区 */}
            <path d="M30 260 L 180 240 L 260 200 L 280 320 L 180 380 L 60 360 Z"
                  fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" opacity="0.6" />
            <text x="150" y="300" fill="#92400e" fontSize="13" fontWeight="600" textAnchor="middle">南康区</text>

            {/* 赣县区 */}
            <path d="M300 40 L 480 60 L 560 140 L 540 280 L 460 320 L 340 280 L 280 160 Z"
                  fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" opacity="0.6" />
            <text x="420" y="170" fill="#166534" fontSize="13" fontWeight="600" textAnchor="middle">赣县区</text>

            {/* 连接线 */}
            <g stroke="#0e7490" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.5">
              <line x1="220" y1="180" x2="370" y2="200" />
              <line x1="180" y1="300" x2="280" y2="280" />
              <line x1="420" y1="220" x2="380" y2="260" />
            </g>

            {/* 子项标注点 */}
            {sites.map(site => {
              const isNormal = site.status === 'normal';
              const isAlarm = site.status === 'alarm';
              return (
                <g key={site.id} className="cursor-pointer" transform={`translate(${site.x - 30}, ${site.y - 40})`}>
                  {/* 脉冲圆 */}
                  {isNormal && (
                    <circle cx="30" cy="30" r="14" fill="#22c55e" opacity="0.3">
                      <animate attributeName="r" from="8" to="18" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {isAlarm && (
                    <circle cx="30" cy="30" r="16" fill="#ef4444" opacity="0.4">
                      <animate attributeName="r" from="10" to="22" dur="0.9s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="0.9s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* 主圆点 */}
                  <circle cx="30" cy="30" r="7"
                          fill={isNormal ? '#22c55e' : isAlarm ? '#ef4444' : '#9ca3af'}
                          stroke="white" strokeWidth="2" />
                  {/* 标签 */}
                  <Link to={`/page/${site.code.toLowerCase()}`}>
                    <g>
                      <rect x="0" y="45" width="60" height="32" rx="4"
                            fill="white" stroke={isAlarm ? '#ef4444' : '#cbd5e1'} strokeWidth="1" />
                      <text x="30" y="58" fontSize="10" fontWeight="600" fill="#1e293b" textAnchor="middle">
                        {site.name.slice(0, 6)}
                      </text>
                      <text x="30" y="72" fontSize="9" fill="#64748b" textAnchor="middle">
                        {site.status === 'normal' ? '✓ 正常' : site.status === 'alarm' ? '⚠ 报警' : '○ 离线'}
                      </text>
                    </g>
                  </Link>
                </g>
              );
            })}

            {/* 悬停 Tooltip 示意 */}
          </svg>

          {/* 缩放控件 */}
          <div className="absolute bottom-3 left-3 flex gap-1 bg-white/90 border border-gray-200 rounded-md shadow-sm">
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 border-r border-gray-200">
              <ZoomIn size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 border-r border-gray-200">
              <ZoomOut size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600">
              <Maximize2 size={14} />
            </button>
          </div>

          {/* 图例 */}
          <div className="absolute bottom-3 right-3 bg-white/90 border border-gray-200 rounded-md shadow-sm p-2 text-[11px] flex gap-3">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 pulse-green"></span>正常</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 pulse-red"></span>报警</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-400"></span>离线</span>
          </div>
        </div>

        {/* 右侧 KPI 区 */}
        <div className="col-span-4 space-y-3 min-h-0 overflow-y-auto">
          {/* KPI 卡片 */}
          <div className="space-y-2">
            <div className="bg-gradient-to-br from-[#155e75] to-[#0891b2] rounded-lg p-3 text-white relative overflow-hidden">
              <div className="text-[11px] opacity-80 mb-1">总处理水量</div>
              <div className="text-2xl font-bold">{kpiData.totalFlow}</div>
              <div className="text-[11px] opacity-80 mt-1 flex items-center gap-1">
                <TrendingUp size={11} /> {kpiData.totalFlowTrend}
              </div>
              {/* 迷你趋势线 */}
              <svg className="absolute right-2 bottom-2 w-16 h-10 opacity-50" viewBox="0 0 60 40">
                <polyline points="0,30 10,25 20,28 30,20 40,15 50,18 60,10" fill="none" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-3 text-white relative overflow-hidden">
              <div className="text-[11px] opacity-80 mb-1">出水达标率</div>
              <div className="text-2xl font-bold">{kpiData.waterQuality}%</div>
              <div className="text-[11px] opacity-80 mt-1">{kpiData.waterQualityTrend}</div>
              <Gauge size={28} className="absolute right-2 bottom-2 opacity-30" />
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-[11px] text-gray-500 mb-1 flex items-center gap-1"><Activity size={10} /> 设备运行率</div>
              <div className="text-2xl font-bold text-gray-800">{kpiData.equipmentRate}%</div>
              <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full" style={{ width: `${kpiData.equipmentRate}%` }}></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-[11px] text-gray-500 mb-1 flex items-center gap-1"><Battery size={10} /> 综合能耗</div>
              <div className="text-2xl font-bold text-gray-800">{kpiData.energyPerUnit}</div>
              <div className="text-[11px] text-green-600 mt-1">{kpiData.energyTrend} · 优于标杆值</div>
            </div>

            <Link to="/alarm" className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition block">
              <div className="text-[11px] text-gray-500 mb-1 flex items-center gap-1"><AlertTriangle size={10} /> 未确认报警</div>
              <div className="text-2xl font-bold text-red-600">{kpiData.alarmCount}</div>
              <div className="text-[11px] text-gray-500 mt-1">{kpiData.alarmTrend} · 点击处理 →</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
