import { useState } from 'react';
import { Play, Square, Settings, AlertTriangle, Lock, Unlock, TrendingUp, Zap, Wrench } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

type ParamRow = {
  name: string;
  current: string;
  unit: string;
  setValue?: string;
  status: 'normal' | 'low' | 'high' | 'offline';
  trendCode?: string;
};

type ControlRow = {
  id: string;
  name: string;
  icon: string;
  mode: '自动' | '手动';
  status: '运行' | '停止' | '故障';
  frequency?: string;
  runHours: number;
  protection: string;
};

const params: ParamRow[] = [
  { name: '调节池液位', current: '3.2', unit: 'm', setValue: '2.5~3.5', status: 'normal' },
  { name: '进水流量', current: '1240', unit: 'm³/h', status: 'normal' },
  { name: '粗格栅前后液位差', current: '0.05', unit: 'm', setValue: '≤0.20', status: 'normal' },
  { name: '细格栅前后液位差', current: '0.03', unit: 'm', setValue: '≤0.15', status: 'normal' },
  { name: '1#提升泵累计运行', current: '1860', unit: 'h', status: 'normal' },
  { name: '2#提升泵累计运行', current: '1842', unit: 'h', status: 'normal' },
  { name: '3#提升泵累计运行', current: '0', unit: 'h', status: 'normal' },
];

const devices: ControlRow[] = [
  { id: 'P1', name: '1#提升泵', icon: 'pump', mode: '自动', status: '运行', frequency: '42.5Hz', runHours: 1860, protection: '液位联锁OK' },
  { id: 'P2', name: '2#提升泵', icon: 'pump', mode: '自动', status: '运行', frequency: '41.8Hz', runHours: 1842, protection: '液位联锁OK' },
  { id: 'P3', name: '3#提升泵', icon: 'pump', mode: '自动', status: '停止', runHours: 0, protection: '备用' },
  { id: 'G1', name: '粗格栅', icon: 'grid', mode: '自动', status: '运行', runHours: 3520, protection: '液位差联锁' },
  { id: 'G2', name: '细格栅', icon: 'grid', mode: '自动', status: '运行', runHours: 3510, protection: '液位差联锁' },
];

const interlocks = [
  { name: '提升泵启动允许', condition: '调节池液位 ≥ 1.5m', satisfied: true },
  { name: '提升泵高液位联锁', condition: '液位 ≥ 3.8m 自动停泵', satisfied: true },
  { name: '粗格栅启动允许', condition: '1#提升泵运行', satisfied: true },
  { name: '设备就地/远程', condition: '远程控制权', satisfied: true },
];

const trendData = [
  { time: '14:00', value: 3.0 },
  { time: '14:30', value: 3.1 },
  { time: '15:00', value: 3.2 },
  { time: '15:30', value: 3.1 },
  { time: '16:00', value: 3.2 },
  { time: '16:30', value: 3.3 },
  { time: '17:00', value: 3.2 },
  { time: '17:30', value: 3.2 },
];

const statusColor = {
  normal: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: '正常' },
  low: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: '低限' },
  high: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: '高限' },
  offline: { bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400', label: '中断' },
};

export function OperationPanelPage() {
  const [confirmOpen, setConfirmOpen] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col gap-3">
      {/* 顶部标题 */}
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-gray-800">进水泵站及格栅</h2>
          <span className="text-[11px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">C01</span>
          <span className="text-[11px] text-gray-500">| 所属子项：蓉江新区再生水厂一期</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>远程控制权</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500">刷新 10:25:33</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
        {/* 左上 - 实时参数表 */}
        <div className="col-span-12 xl:col-span-7 bg-white rounded-lg border border-gray-200 flex flex-col min-h-0">
          <div className="px-4 py-2.5 border-b border-gray-200 flex items-center gap-2">
            <Settings size={13} className="text-pri" />
            <h3 className="text-sm font-semibold text-gray-700">实时参数表</h3>
            <span className="text-[11px] text-gray-400 ml-auto">7 个测点 · 每 1s 刷新</span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="text-gray-500">
                  <th className="text-left px-3 py-2 font-medium">参数名</th>
                  <th className="text-center px-3 py-2 font-medium">当前值</th>
                  <th className="text-center px-3 py-2 font-medium">单位</th>
                  <th className="text-center px-3 py-2 font-medium">设定/范围</th>
                  <th className="text-center px-3 py-2 font-medium">报警状态</th>
                  <th className="text-center px-3 py-2 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {params.map((p, i) => {
                  const sc = statusColor[p.status];
                  return (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="px-3 py-2.5 text-gray-700 font-medium">{p.name}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`font-mono font-bold text-base ${sc.text}`}>{p.current}</span>
                      </td>
                      <td className="px-3 py-2.5 text-center text-gray-500">{p.unit}</td>
                      <td className="px-3 py-2.5 text-center text-gray-500">{p.setValue || '—'}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button className="text-pri hover:text-pri-d text-[11px] flex items-center gap-0.5 mx-auto">
                          <TrendingUp size={11} /> 趋势
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 右上 - 控制面板 */}
        <div className="col-span-12 xl:col-span-5 bg-white rounded-lg border border-gray-200 flex flex-col min-h-0">
          <div className="px-4 py-2.5 border-b border-gray-200 flex items-center gap-2">
            <Zap size={13} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-700">设备控制面板</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="divide-y divide-gray-100">
              {devices.map(d => (
                <div key={d.id} className="px-3 py-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        d.status === '运行' ? 'bg-green-500 animate-pulse' :
                        d.status === '故障' ? 'bg-red-500' : 'bg-gray-400'
                      }`}></span>
                      <span className="text-sm font-medium text-gray-800">{d.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1 rounded">{d.id}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        d.mode === '自动' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>{d.mode}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-2">
                    <span>状态: <span className={d.status === '运行' ? 'text-green-600 font-medium' : d.status === '故障' ? 'text-red-600 font-medium' : 'text-gray-600 font-medium'}>{d.status}</span></span>
                    {d.frequency && <span>频率: <span className="font-mono">{d.frequency}</span></span>}
                    <span>运行: <span className="font-mono">{d.runHours}h</span></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 模式切换 */}
                    <div className="flex rounded border border-gray-200 overflow-hidden">
                      <button className={`px-2 py-0.5 text-[10px] border-r border-gray-200 ${d.mode === '自动' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <AutoMode /> 自动
                      </button>
                      <button className={`px-2 py-0.5 text-[10px] ${d.mode === '手动' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Unlock size={9} className="inline" /> 手动
                      </button>
                    </div>

                    {/* 启停按钮 */}
                    <button
                      disabled={d.mode === '自动' || d.status === '运行'}
                      onClick={() => setConfirmOpen(d.id + '-start')}
                      className={`px-3 py-1 text-[11px] rounded flex items-center gap-1 ${
                        d.mode === '自动' || d.status === '运行'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      <Play size={11} /> 启动
                    </button>
                    <button
                      disabled={d.mode === '自动' || d.status === '停止'}
                      onClick={() => setConfirmOpen(d.id + '-stop')}
                      className={`px-3 py-1 text-[11px] rounded flex items-center gap-1 ${
                        d.mode === '自动' || d.status === '停止'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      <Square size={11} /> 停止
                    </button>

                    {/* 联锁状态 */}
                    <span className="text-[10px] text-gray-500 ml-auto flex items-center gap-1">
                      <Lock size={10} className="text-gray-400" />
                      {d.protection}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部 - 联锁状态 + 嵌入式趋势 */}
        <div className="col-span-12 grid grid-cols-12 gap-3">
          {/* 联锁 */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-lg border border-gray-200">
            <div className="px-3 py-2 border-b border-gray-200 flex items-center gap-2">
              <Lock size={12} className="text-amber-600" />
              <h3 className="text-xs font-semibold text-gray-700">联锁状态</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 text-[11px]">
              {interlocks.map((l, i) => (
                <div key={i} className={`px-2.5 py-2 rounded border ${
                  l.satisfied ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-1 font-medium text-gray-700">
                    <span className={`w-1.5 h-1.5 rounded-full ${l.satisfied ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {l.name}
                  </div>
                  <div className={`mt-0.5 ${l.satisfied ? 'text-green-700' : 'text-red-700'}`}>
                    {l.satisfied ? '✓ 满足' : '✗ 未满足'}
                  </div>
                  <div className="text-gray-400 text-[10px]">{l.condition}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 趋势 */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-lg border border-gray-200">
            <div className="px-3 py-2 border-b border-gray-200 flex items-center gap-2">
              <TrendingUp size={12} className="text-pri" />
              <h3 className="text-xs font-semibold text-gray-700">调节池液位 · 近4小时趋势</h3>
              <span className="text-[10px] text-gray-400 ml-auto">设定值 3.2m · 上下限 2.5~3.5m</span>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" fontSize={10} tick={{ fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis domain={['auto', 'auto']} fontSize={10} tick={{ fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <ReferenceLine y={3.2} stroke="#0891b2" strokeDasharray="4 4" label={{ value: '设定值 3.2', fontSize: 10, fill: '#0891b2' }} />
                  <ReferenceLine y={3.5} stroke="#ef4444" strokeDasharray="2 2" strokeOpacity={0.5} />
                  <ReferenceLine y={2.5} stroke="#3b82f6" strokeDasharray="2 2" strokeOpacity={0.5} />
                  <Line type="monotone" dataKey="value" stroke="#0e7490" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 确认弹窗 */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-5 w-[380px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">操作确认</h3>
                <p className="text-xs text-gray-500">请确认以下操作是否正确</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded p-3 text-xs text-gray-600 border border-gray-200">
              <div>设备：<span className="font-semibold text-gray-800">1#提升泵</span></div>
              <div>操作：<span className="font-semibold text-red-600">启动（手动模式）</span></div>
              <div>联锁：<span className="text-green-600">✓ 液位联锁条件满足</span></div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setConfirmOpen(null)}
                className="px-4 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 text-gray-600"
              >取消</button>
              <button
                onClick={() => setConfirmOpen(null)}
                className="px-4 py-1.5 text-xs rounded bg-green-500 text-white hover:bg-green-600"
              >确认执行</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AutoMode() {
  return <Wrench size={9} className="inline" />;
}
