import { useState } from 'react';
import { Search, Filter, Download, ChevronDown, Bell, AlertTriangle, Eye, Shield, Play } from 'lucide-react';
import { alarms } from '@/data/mockData';

const levelColors = {
  '紧急': 'bg-red-100 text-red-700 border-red-200',
  '重要': 'bg-amber-100 text-amber-700 border-amber-200',
  '次要': 'bg-blue-100 text-blue-700 border-blue-200',
  '提示': 'bg-gray-100 text-gray-600 border-gray-200',
};

const statusColors = {
  '活跃': 'text-red-600 bg-red-50',
  '已确认': 'text-green-600 bg-green-50',
  '已屏蔽': 'text-gray-500 bg-gray-50',
};

export function AlarmManagementPage() {
  const [filterLevel, setFilterLevel] = useState<string>('全部');
  const [filterStatus, setFilterStatus] = useState<string>('全部');
  const [selectedAlarm, setSelectedAlarm] = useState<string | null>(null);

  const filteredAlarms = alarms.filter(a => {
    if (filterLevel !== '全部' && a.level !== filterLevel) return false;
    if (filterStatus !== '全部' && a.status !== filterStatus) return false;
    return true;
  });

  const active = alarms.filter(a => a.status === '活跃').length;
  const level4 = alarms.filter(a => a.level === '紧急' && a.status === '活跃').length;

  return (
    <div className="h-full flex flex-col gap-3">
      {/* 顶部统计 */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="text-xs opacity-80">未确认报警</div>
          <div className="text-2xl font-bold mt-1">{active}</div>
          <div className="text-[10px] opacity-80 mt-1">需要立即处理</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-white">
          <div className="text-xs opacity-80">紧急报警</div>
          <div className="text-2xl font-bold mt-1">{level4}</div>
          <div className="text-[10px] opacity-80 mt-1">最高优先级</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-xs text-gray-500">今日新增</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">12</div>
          <div className="text-[10px] text-green-600 mt-1">较昨日 -3</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-xs text-gray-500">本月累计</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">286</div>
          <div className="text-[10px] text-gray-400 mt-1">含已确认/屏蔽</div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-md w-64">
            <Search size={13} className="text-gray-400" />
            <input placeholder="搜索报警描述 / 设备 / 位置" className="outline-none text-xs flex-1 bg-transparent" />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-gray-400" />
            <select
              value={filterLevel}
              onChange={e => setFilterLevel(e.target.value)}
              className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none hover:border-pri"
            >
              <option>全部</option>
              <option>紧急</option>
              <option>重要</option>
              <option>次要</option>
              <option>提示</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none hover:border-pri"
            >
              <option>全部</option>
              <option>活跃</option>
              <option>已确认</option>
              <option>已屏蔽</option>
            </select>
            <button className="text-xs text-pri hover:underline">时间范围：近7天 ▾</button>
          </div>

          <div className="ml-auto flex gap-2">
            <button className="px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1">
              <Download size={12} /> 导出
            </button>
          </div>
        </div>
      </div>

      {/* 报警列表 */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-gray-500">
                <th className="w-10 px-3 py-2.5"><input type="checkbox" /></th>
                <th className="text-left px-3 py-2.5 font-medium">编号</th>
                <th className="text-left px-3 py-2.5 font-medium">级别</th>
                <th className="text-left px-3 py-2.5 font-medium">时间</th>
                <th className="text-left px-3 py-2.5 font-medium">子项</th>
                <th className="text-left px-3 py-2.5 font-medium">位置</th>
                <th className="text-left px-3 py-2.5 font-medium">描述</th>
                <th className="text-center px-3 py-2.5 font-medium">当前值</th>
                <th className="text-center px-3 py-2.5 font-medium">设定值</th>
                <th className="text-center px-3 py-2.5 font-medium">状态</th>
                <th className="text-center px-3 py-2.5 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAlarms.map(a => (
                <tr key={a.id} className={`hover:bg-cyan-50 cursor-pointer ${selectedAlarm === a.id ? 'bg-cyan-50' : ''}`}
                    onClick={() => setSelectedAlarm(a.id === selectedAlarm ? null : a.id)}>
                  <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                  <td className="px-3 py-2.5 font-mono text-gray-600">{a.id}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${levelColors[a.level]}`}>
                      {a.level}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{a.time}</td>
                  <td className="px-3 py-2.5 text-gray-700 max-w-[160px] truncate">{a.site}</td>
                  <td className="px-3 py-2.5 text-gray-600 max-w-[120px] truncate">{a.location}</td>
                  <td className="px-3 py-2.5 text-gray-800 font-medium">{a.description}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-red-600">{a.currentValue || '—'}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-gray-500">{a.setValue || '—'}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${statusColors[a.status]}`}>{a.status}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center" onClick={e => e.stopPropagation()}>
                    <button className="text-pri hover:underline text-[11px] flex items-center gap-0.5 mx-auto">
                      <Eye size={11} /> 详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedAlarm && (
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <AlertTriangle size={13} className="text-amber-500" />
                    报警详情
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[11px]">
                    <div><span className="text-gray-500">报警ID：</span><span className="font-mono">{selectedAlarm}</span></div>
                    <div><span className="text-gray-500">触发时间：</span>{alarms.find(a => a.id === selectedAlarm)?.time}</div>
                    <div><span className="text-gray-500">设备位置：</span>{alarms.find(a => a.id === selectedAlarm)?.site} / {alarms.find(a => a.id === selectedAlarm)?.location}</div>
                    <div><span className="text-gray-500">当前值：</span><span className="font-mono text-red-600">{alarms.find(a => a.id === selectedAlarm)?.currentValue}</span></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {alarms.find(a => a.id === selectedAlarm)?.status === '活跃' && (
                    <>
                      <button className="px-3 py-1.5 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1">
                        <Shield size={11} /> 确认
                      </button>
                      <button className="px-3 py-1.5 text-xs rounded bg-gray-500 text-white hover:bg-gray-600">屏蔽</button>
                    </>
                  )}
                  <button className="px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-white">查看趋势</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 分页 */}
        <div className="border-t border-gray-200 bg-white px-4 py-2 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <span>共 {filteredAlarms.length} 条报警</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">上一页</button>
            <button className="px-2.5 py-1 rounded bg-pri text-white">1</button>
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">下一页</button>
            <span className="ml-3">每页 <select className="border border-gray-200 rounded px-1 py-0.5 ml-1"><option>20</option></select> 条</span>
          </div>
        </div>
      </div>
    </div>
  );
}
