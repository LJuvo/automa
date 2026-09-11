import { Link } from 'react-router-dom';
import { Bell, FileText, Wrench, Map, AlertTriangle, TrendingUp, Activity, Battery, Gauge, Droplets } from 'lucide-react';
import { kpiData, alarms, sites, quickLinks, announcements } from '@/data/mockData';
import { KpiCard, AlarmLevelBadge } from '@/components/common/StatusBadge';

export function WorkbenchPage() {
  const activeAlarms = alarms.filter(a => a.status === '活跃');
  const today = new Date();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const greeting = today.getHours() < 12 ? '早上好' : today.getHours() < 18 ? '下午好' : '晚上好';

  return (
    <div className="space-y-4">
      {/* 顶部欢迎 */}
      <div className="bg-gradient-to-r from-[#155e75] to-[#0891b2] text-white rounded-xl px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">张工，{greeting} 👋</div>
          <div className="text-xs opacity-80 mt-0.5">
            {today.toLocaleDateString('zh-CN')} 周{weekDays[today.getDay()]} | 当前值班：白班 | 今日已运行 8h 26min
          </div>
        </div>
        <div className="flex gap-3">
          <div className="text-center px-4">
            <div className="text-2xl font-bold">{sites.length}</div>
            <div className="text-[11px] opacity-75">监控子项</div>
          </div>
          <div className="text-center px-4 border-l border-white/20">
            <div className="text-2xl font-bold">{activeAlarms.length}</div>
            <div className="text-[11px] opacity-75">待处理报警</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* 左列 60% */}
        <div className="col-span-12 xl:col-span-8 space-y-4">
          {/* 待办卡片 */}
          <div className="grid grid-cols-4 gap-3">
            <Link to="/alarm" className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition group">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-100 transition">
                  <Bell size={18} />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500">待确认报警</div>
                  <div className="text-xl font-bold text-red-600">{activeAlarms.length}</div>
                </div>
              </div>
            </Link>
            <Link to="/logs" className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition group">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500">待处理工单</div>
                  <div className="text-xl font-bold text-amber-600">2</div>
                </div>
              </div>
            </Link>
            <Link to="/report" className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition group">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500">待审核报表</div>
                  <div className="text-xl font-bold text-blue-600">1</div>
                </div>
              </div>
            </Link>
            <Link to="/devices" className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition group">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition">
                  <Wrench size={18} />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500">设备维护提醒</div>
                  <div className="text-xl font-bold text-purple-600">4</div>
                </div>
              </div>
            </Link>
          </div>

          {/* 关键指标 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Activity size={14} className="text-pri" /> 关键指标
              </h3>
              <span className="text-[11px] text-gray-400">实时数据 · 每5秒刷新</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <KpiCard title="总处理水量" value={kpiData.totalFlow} trend={kpiData.totalFlowTrend} icon={Droplets} />
              <KpiCard title="出水达标率" value={`${kpiData.waterQuality}%`} trend={kpiData.waterQualityTrend} icon={Gauge} />
              <KpiCard title="设备运行率" value={`${kpiData.equipmentRate}%`} trend={kpiData.equipmentRateTrend} icon={Activity} />
              <KpiCard title="综合能耗" value={kpiData.energyPerUnit} trend={kpiData.energyTrend} icon={Battery} />
            </div>
          </div>

          {/* 最新报警列表 */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-red-500" /> 最新报警
              </h3>
              <Link to="/alarm" className="text-xs text-pri hover:underline">查看全部 →</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {alarms.slice(0, 5).map(alarm => (
                <div key={alarm.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
                  <AlarmLevelBadge level={alarm.level} />
                  <span className="text-[11px] text-gray-400 font-mono w-[70px]">{alarm.time.slice(11)}</span>
                  <span className="text-xs text-gray-600 w-[140px] truncate">{alarm.site}</span>
                  <span className="text-xs text-gray-800 flex-1 truncate">{alarm.description}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded ${
                    alarm.status === '活跃' ? 'bg-red-50 text-red-600' :
                    alarm.status === '已确认' ? 'bg-green-50 text-green-600' :
                    'bg-gray-50 text-gray-500'
                  }`}>{alarm.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右列 40% */}
        <div className="col-span-12 xl:col-span-4 space-y-4">
          {/* 子项状态 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">子项运行状态</h3>
            <div className="space-y-2">
              {sites.map(site => (
                <Link
                  key={site.id}
                  to={`/page/${site.code.toLowerCase()}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-cyan-50 transition group"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    site.status === 'normal' ? 'bg-green-500' :
                    site.status === 'alarm' ? 'bg-red-500 pulse-red' : 'bg-gray-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-700 truncate group-hover:text-pri">{site.name}</div>
                    <div className="text-[11px] text-gray-400">{site.capacity}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-700">{site.flow} {site.flowUnit}</div>
                    <div className="text-[10px] text-gray-400">当前水量</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 快捷入口 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">快捷入口</h3>
            <div className="grid grid-cols-3 gap-3">
              {quickLinks.map(link => (
                <Link
                  key={link.code}
                  to={`/${link.code === 'B01' ? 'overview' : link.code === 'D01' ? 'alarm' : link.code === 'D03' ? 'trend' : link.code === 'D04' ? 'report' : link.code === 'D09' ? 'devices' : 'config'}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-cyan-50 transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-pri">
                    {link.icon === 'Map' && <Map size={18} />}
                    {link.icon === 'TrendingUp' && <TrendingUp size={18} />}
                    {link.icon === 'FileText' && <FileText size={18} />}
                    {link.icon === 'Wrench' && <Wrench size={18} />}
                    {link.icon === 'Bell' && <Bell size={18} />}
                    {link.icon === 'Settings' && <Activity size={18} />}
                  </div>
                  <span className="text-xs text-gray-600">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 系统公告 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">系统公告</h3>
            <div className="space-y-2.5">
              {announcements.map(a => (
                <div key={a.id} className="pb-2.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-pri cursor-pointer">
                    <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                    <span className="truncate flex-1">{a.title}</span>
                    <span className="text-[11px] text-gray-400">{a.date}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
