import type React from "react";
import { Link, useParams } from 'react-router-dom';
import { Info, AlertTriangle, ZoomIn, ZoomOut, Maximize2, Home } from 'lucide-react';
import { sites, alarms } from '@/data/mockData';

// 设备图标 SVG 组件
function PumpIcon({ size = 48, status = '运行' }: { size?: number; status?: string }) {
  const color = status === '运行' ? '#22c55e' : status === '故障' ? '#ef4444' : '#94a3b8';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="18" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="24" cy="24" r="10" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
      <rect x="20" y="6" width="8" height="6" fill={color} opacity="0.6" />
      <text x="24" y="29" textAnchor="middle" fontSize="12" fill={color} fontWeight="600">P</text>
      {status === '运行' && (
        <circle cx="24" cy="24" r="18" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3">
          <animate attributeName="r" from="14" to="22" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}

function TankIcon({ size = 56, status = '正常' }: { size?: number; status?: string }) {
  const borderColor = status === '正常' ? '#0e7490' : '#ef4444';
  const fillColor = status === '正常' ? '#cffafe' : '#fee2e2';
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 56 40">
      <rect x="4" y="2" width="48" height="34" rx="3" fill={fillColor} stroke={borderColor} strokeWidth="1.5" />
      <rect x="6" y="18" width="44" height="16" fill={borderColor} opacity="0.4" />
      <text x="28" y="24" textAnchor="middle" fontSize="10" fill="#155e75" fontWeight="600">生化池</text>
    </svg>
  );
}

function BasinIcon({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 56 28">
      <ellipse cx="28" cy="14" rx="26" ry="12" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
      <ellipse cx="28" cy="12" rx="22" ry="8" fill="#fbbf24" opacity="0.3" />
      <text x="28" y="16" textAnchor="middle" fontSize="9" fill="#92400e" fontWeight="600">沉砂池</text>
    </svg>
  );
}

function BlowerIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect x="6" y="14" width="36" height="22" rx="2" fill="#ecfeff" stroke="#0891b2" strokeWidth="1.5" />
      <circle cx="24" cy="25" r="7" fill="#0891b2" opacity="0.2" stroke="#0891b2" />
      <path d="M24 18 L24 12 M18 25 L12 25 M30 25 L36 25 M24 32 L24 36" stroke="#0891b2" strokeWidth="1.5" />
      <text x="24" y="42" textAnchor="middle" fontSize="8" fill="#0e7490" fontWeight="600">鼓风机</text>
    </svg>
  );
}

function DosingIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect x="10" y="14" width="20" height="22" rx="2" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" />
      <rect x="14" y="8" width="12" height="6" fill="#ca8a04" />
      <rect x="12" y="20" width="16" height="14" fill="#facc15" opacity="0.4" />
      <text x="20" y="16" textAnchor="middle" fontSize="7" fill="#854d0e" fontWeight="600">药</text>
    </svg>
  );
}

const iconMap: Record<string, (size?: number, status?: string) => React.ReactElement> = {
  pump: (s, st) => <PumpIcon size={s} status={st} />,
  grid: (s) => (
    <svg width={s || 48} height={s || 32} viewBox="0 0 48 32">
      <rect x="2" y="8" width="44" height="16" rx="2" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
      <line x1="8" y1="8" x2="8" y2="24" stroke="#d97706" strokeWidth="1.5" />
      <line x1="16" y1="8" x2="16" y2="24" stroke="#d97706" strokeWidth="1.5" />
      <line x1="24" y1="8" x2="24" y2="24" stroke="#d97706" strokeWidth="1.5" />
      <line x1="32" y1="8" x2="32" y2="24" stroke="#d97706" strokeWidth="1.5" />
      <line x1="40" y1="8" x2="40" y2="24" stroke="#d97706" strokeWidth="1.5" />
      <text x="24" y="30" textAnchor="middle" fontSize="8" fill="#92400e" fontWeight="600">格栅</text>
    </svg>
  ),
  basin: (s) => <BasinIcon size={s} />,
  tank: (s) => <TankIcon size={s} />,
  blower: (s) => <BlowerIcon size={s} />,
  dewater: (s) => (
    <svg width={s || 48} height={s || 36} viewBox="0 0 48 36">
      <rect x="4" y="6" width="40" height="24" rx="2" fill="#fce7f3" stroke="#db2777" strokeWidth="1.5" />
      <line x1="12" y1="12" x2="12" y2="24" stroke="#db2777" strokeWidth="1" />
      <line x1="20" y1="12" x2="20" y2="24" stroke="#db2777" strokeWidth="1" />
      <line x1="28" y1="12" x2="28" y2="24" stroke="#db2777" strokeWidth="1" />
      <line x1="36" y1="12" x2="36" y2="24" stroke="#db2777" strokeWidth="1" />
      <text x="24" y="34" textAnchor="middle" fontSize="8" fill="#9d174d" fontWeight="600">脱水机</text>
    </svg>
  ),
  dosing: (s) => <DosingIcon size={s} />,
  disinfect: (s) => (
    <svg width={s || 48} height={s || 40} viewBox="0 0 48 40">
      <rect x="6" y="10" width="36" height="24" rx="2" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
      <circle cx="24" cy="22" r="6" fill="#2563eb" opacity="0.3" />
      <text x="24" y="25" textAnchor="middle" fontSize="8" fill="#1e40af" fontWeight="600">Cl₂</text>
      <text x="24" y="38" textAnchor="middle" fontSize="8" fill="#1e40af" fontWeight="600">消毒</text>
    </svg>
  ),
  filter: (s) => (
    <svg width={s || 48} height={s || 36} viewBox="0 0 48 36">
      <rect x="4" y="6" width="40" height="24" rx="2" fill="#f3e8ff" stroke="#7c3aed" strokeWidth="1.5" />
      <circle cx="16" cy="18" r="3" fill="#7c3aed" opacity="0.4" />
      <circle cx="28" cy="18" r="3" fill="#7c3aed" opacity="0.4" />
      <circle cx="38" cy="18" r="3" fill="#7c3aed" opacity="0.4" />
      <text x="24" y="34" textAnchor="middle" fontSize="8" fill="#5b21b6" fontWeight="600">滤池</text>
    </svg>
  ),
  monitor: (s) => (
    <svg width={s || 48} height={s || 36} viewBox="0 0 48 36">
      <rect x="4" y="6" width="40" height="24" rx="2" fill="#d1fae5" stroke="#059669" strokeWidth="1.5" />
      <line x1="10" y1="14" x2="38" y2="14" stroke="#059669" strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="20" x2="38" y2="20" stroke="#059669" strokeWidth="1" opacity="0.4" />
      <text x="24" y="34" textAnchor="middle" fontSize="8" fill="#065f46" fontWeight="600">监测</text>
    </svg>
  ),
  inlet: (s) => (
    <svg width={s || 48} height={s || 32} viewBox="0 0 48 32">
      <path d="M6 26 L 6 12 Q 6 6 12 6 L 36 6 Q 42 6 42 12 L 42 26" fill="none" stroke="#78350f" strokeWidth="2" />
      <text x="24" y="22" textAnchor="middle" fontSize="9" fill="#78350f" fontWeight="600">进料</text>
    </svg>
  ),
  scale: (s) => (
    <svg width={s || 48} height={s || 40} viewBox="0 0 48 40">
      <rect x="6" y="22" width="36" height="12" rx="1" fill="#374151" />
      <rect x="10" y="14" width="28" height="10" rx="1" fill="#1f2937" />
      <text x="24" y="22" textAnchor="middle" fontSize="8" fill="#10b981" fontWeight="600">2.1t</text>
    </svg>
  ),
};

export function ProcessDiagramPage() {
  const { code = 'b02' } = useParams();
  const site = sites.find(s => s.code.toLowerCase() === code) || sites[0];
  const siteAlarms = alarms.filter(a => a.site === site.name);

  return (
    <div className="h-full flex flex-col gap-3">
      {/* 顶部信息卡 */}
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-800">{site.name}</h2>
            <span className="text-[11px] text-gray-400 font-mono">{site.code}</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            处理规模：{site.capacity} · 当前流量 <span className="text-pri font-semibold">{site.flow} {site.flowUnit}</span>
          </div>
        </div>
        <div className="h-8 border-l border-gray-200"></div>
        <div className="flex gap-4 text-xs">
          <div><span className="text-gray-500">出水达标率</span> <span className="text-green-600 font-semibold">{site.waterQuality}%</span></div>
          <div><span className="text-gray-500">设备运行率</span> <span className="text-green-600 font-semibold">{site.equipmentRate}%</span></div>
          <div><span className="text-gray-500">未确认报警</span> <span className="text-red-600 font-semibold">{site.alarms}</span></div>
        </div>
        <div className="ml-auto flex gap-1">
          <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"><ZoomIn size={14} /></button>
          <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"><ZoomOut size={14} /></button>
          <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"><Maximize2 size={14} /></button>
          <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"><Home size={14} /></button>
        </div>
      </div>

      {/* 主画面区域 */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
        {/* 流程画面 */}
        <div className="col-span-9 bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] rounded-lg border border-gray-200 relative overflow-auto">
          <svg viewBox="0 0 1200 520" className="w-full" style={{ minHeight: '520px' }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="#0891b2" />
              </marker>
            </defs>

            {/* 主管道连接 */}
            {site.processes.map((step, i) => {
              if (i === site.processes.length - 1) return null;
              const x1 = 90 + i * 130;
              const x2 = 90 + (i + 1) * 130;
              return (
                <g key={`pipe-${i}`}>
                  <line x1={x1} y1="260" x2={x2} y2="260" stroke="#0891b2" strokeWidth="4" markerEnd="url(#arrow)" opacity="0.6" />
                  <line x1={x1} y1="260" x2={x2} y2="260" stroke="#0e7490" strokeWidth="2" strokeDasharray="8 4" className="animate-flow" opacity="0.8" />
                </g>
              );
            })}

            {/* 工艺段方框 */}
            {site.processes.map((step, i) => {
              const x = 30 + i * 130;
              return (
                <Link key={step.id} to={step.pageCode ? `/page/${step.pageCode.toLowerCase()}` : '#'}>
                  <g className="cursor-pointer" transform={`translate(${x}, 100)`}>
                    {/* 工艺段外框 */}
                    <rect x="0" y="0" width="120" height="320" rx="8" fill="white" stroke="#cbd5e1" strokeWidth="1.5" className="hover:stroke-[#0e7490] hover:shadow-lg transition" />
                    <rect x="0" y="0" width="120" height="32" rx="8" fill="#0e7490" />
                    <rect x="0" y="24" width="120" height="8" fill="#0e7490" />

                    {/* 段标题 */}
                    <text x="60" y="22" textAnchor="middle" fontSize="12" fill="white" fontWeight="600">{step.name}</text>
                    <text x="60" y="60" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="monospace">{step.pageCode}</text>

                    {/* 设备图标 */}
                    <foreignObject x="20" y="70" width="80" height="70">
                      <div style={{ width: 80, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {iconMap[step.icon]?.() || iconMap.pump()}
                      </div>
                    </foreignObject>

                    {/* 分隔线 */}
                    <line x1="10" y1="150" x2="110" y2="150" stroke="#e2e8f0" strokeWidth="1" />

                    {/* 实时参数 */}
                    <g transform="translate(12, 160)">
                      {step.params.map((p, pi) => (
                        <g key={pi} transform={`translate(0, ${pi * 26})`}>
                          <circle cx="4" cy="6" r="3"
                                  fill={p.status === 'normal' ? '#22c55e' : p.status === 'low' ? '#3b82f6' : p.status === 'high' ? '#ef4444' : '#9ca3af'} />
                          <text x="14" y="10" fontSize="9" fill="#475569">{p.name}</text>
                          <text x="14" y="22" fontSize="10" fontWeight="700"
                                fill={p.status === 'normal' ? '#1e293b' : p.status === 'low' ? '#2563eb' : p.status === 'high' ? '#dc2626' : '#94a3b8'}>
                            {p.value} <tspan fontSize="8" fontWeight="400">{p.unit}</tspan>
                          </text>
                        </g>
                      ))}
                    </g>

                    {/* 流向箭头 */}
                    <g transform="translate(108, 260)">
                      <path d="M0 0 L 10 -5 L 10 5 Z" fill="#0891b2" opacity="0.7" />
                    </g>
                  </g>
                </Link>
              );
            })}
          </svg>
        </div>

        {/* 右侧报警面板 */}
        <div className="col-span-3 space-y-3 min-h-0 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-red-500" />
                本站报警
              </h3>
              <span className="text-[11px] text-gray-400">{siteAlarms.length} 条</span>
            </div>
            <div className="space-y-2">
              {siteAlarms.length > 0 ? siteAlarms.map(a => (
                <div key={a.id} className="text-[11px] p-2 rounded border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold text-white ${
                      a.level === '紧急' ? 'bg-red-500' :
                      a.level === '重要' ? 'bg-amber-500' :
                      a.level === '次要' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}>{a.level}</span>
                    <span className="text-gray-400">{a.time.slice(11)}</span>
                  </div>
                  <div className="text-gray-700 font-medium">{a.description}</div>
                  <div className="text-gray-500 text-[10px]">{a.currentValue} → 设定 {a.setValue}</div>
                </div>
              )) : (
                <div className="text-[11px] text-gray-400 text-center py-4">
                  <div className="text-2xl mb-1">✓</div>
                  当前无未确认报警
                </div>
              )}
            </div>
          </div>

          {/* 图例 */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">状态图例</h3>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span>正常</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>低于限值</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span>高于限值</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-400"></span>数据中断</span>
            </div>
          </div>

          {/* 快速说明 */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
            <div className="flex items-start gap-1.5 text-[11px] text-cyan-800">
              <Info size={12} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold mb-1">操作提示</div>
                <ul className="list-disc pl-4 space-y-0.5 text-cyan-700">
                  <li>点击工艺段 → 进入操作面板</li>
                  <li>悬停管道 → 显示流量信息</li>
                  <li>设备图标 → 状态实时更新</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
