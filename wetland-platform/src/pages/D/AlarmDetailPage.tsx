import { useState } from 'react';
import { ArrowLeft, Check, Shield, Play, FileText, User, Calendar, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { alarms } from '@/data/mockData';

export function AlarmDetailPage() {
  const { id = 'ALM-20260818-001' } = useParams();
  const navigate = useNavigate();
  const alarm = alarms.find(a => a.id === id) || alarms[0];
  const [tab, setTab] = useState<'overview' | 'handle' | 'trend' | 'history'>('overview');
  const [handleResult, setHandleResult] = useState<string | null>(null);

  const trendData = Array.from({ length: 48 }, (_, i) => ({
    time: `${Math.floor(i / 2).toString().padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    value: +(1.2 + Math.sin(i / 4) * 0.5 + (Math.random() - 0.5) * 0.3).toFixed(2),
  }));

  return (
    <div className="h-full flex flex-col gap-3">
      {/* 面包屑头 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
        <button onClick={() => navigate('/alarm')} className="flex items-center gap-1 text-xs text-gray-500 hover:text-pri">
          <ArrowLeft size={12} /> 返回报警列表
        </button>
        <div className="h-4 w-px bg-gray-200"></div>
        <span className="text-xs text-gray-400 font-mono">{alarm.id}</span>
      </div>

      {/* 报警核心信息卡 */}
      <div className="bg-gradient-to-br from-red-50 to-amber-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              alarm.level === '紧急' ? 'bg-red-500 text-white pulse-red' :
              alarm.level === '重要' ? 'bg-amber-500 text-white' :
              alarm.level === '次要' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
            }`}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
                  alarm.level === '紧急' ? 'bg-red-500' :
                  alarm.level === '重要' ? 'bg-amber-500' :
                  alarm.level === '次要' ? 'bg-blue-500' : 'bg-gray-500'
                }`}>{alarm.level}</span>
                <h2 className="text-lg font-bold text-gray-800">{alarm.description}</h2>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                触发站点：<span className="font-medium text-gray-700">{alarm.site}</span>
                <span className="mx-2">|</span>
                位置：<span className="font-medium text-gray-700">{alarm.location}</span>
                <span className="mx-2">|</span>
                触发时间：<span className="font-mono">{alarm.time}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {alarm.status === '活跃' ? (
              <>
                <button onClick={() => setHandleResult('确认')} className="px-3 py-1.5 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1">
                  <Check size={12} /> 确认处理
                </button>
                <button onClick={() => setHandleResult('屏蔽')} className="px-3 py-1.5 text-xs rounded bg-gray-500 text-white hover:bg-gray-600 flex items-center gap-1">
                  <Shield size={12} /> 临时屏蔽
                </button>
              </>
            ) : (
              <span className="px-3 py-1.5 text-xs rounded bg-green-50 text-green-700 border border-green-200">
                已由 {alarm.operator} 处理
              </span>
            )}
          </div>
        </div>

        {/* 实时数值 */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="bg-white rounded border border-red-200 p-3">
            <div className="text-[10px] text-gray-500">当前值</div>
            <div className="text-xl font-bold font-mono text-red-600 mt-0.5">{alarm.currentValue || '—'}</div>
          </div>
          <div className="bg-white rounded border border-amber-200 p-3">
            <div className="text-[10px] text-gray-500">设定值</div>
            <div className="text-xl font-bold font-mono text-amber-600 mt-0.5">{alarm.setValue || '—'}</div>
          </div>
          <div className="bg-white rounded border border-gray-200 p-3">
            <div className="text-[10px] text-gray-500">报警级别</div>
            <div className="text-xl font-bold mt-0.5">{alarm.level}</div>
          </div>
          <div className="bg-white rounded border border-gray-200 p-3">
            <div className="text-[10px] text-gray-500">当前状态</div>
            <div className={`text-xl font-bold mt-0.5 ${
              alarm.status === '活跃' ? 'text-red-600' :
              alarm.status === '已确认' ? 'text-green-600' : 'text-gray-500'
            }`}>{alarm.status}</div>
          </div>
        </div>
      </div>

      {/* Tab 内容 */}
      <div className="bg-white rounded-lg border border-gray-200 flex-1 min-h-0 flex flex-col">
        <div className="px-4 pt-3 flex gap-4 border-b border-gray-200">
          {[
            { key: 'overview', name: '报警概览' },
            { key: 'handle', name: '处置记录' },
            { key: 'trend', name: '参数趋势' },
            { key: 'history', name: '同类历史' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`pb-2.5 text-xs border-b-2 transition ${
                tab === t.key ? 'text-pri border-pri font-semibold' : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >{t.name}</button>
          ))}
        </div>
        <div className="flex-1 p-4 overflow-auto">
          {tab === 'overview' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-gray-700">报警规则</h4>
                <div className="bg-gray-50 rounded p-3 border border-gray-200 space-y-1.5 text-[11px] text-gray-600">
                  <div>规则编号：<span className="font-mono">ALM-DO-B04</span></div>
                  <div>参数：DO (mg/L)</div>
                  <div>低报警限：<span className="font-mono">1.5</span></div>
                  <div>低低报警限：<span className="font-mono">1.0</span></div>
                  <div>触发延迟：<span className="font-mono">300s</span></div>
                  <div>报警级别：<span className="text-red-600 font-semibold">重要</span></div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-gray-700">影响设备</h4>
                <div className="bg-gray-50 rounded p-3 border border-gray-200 space-y-1 text-[11px]">
                  <div>📊 监测点：DO_1_AO2（生化池2区 DO探头）</div>
                  <div>🔌 PLC 地址：DB30.DBD256</div>
                  <div>📡 通讯协议：OPC UA / ns=2;s=DO_1_AO2</div>
                  <div>⚙️ 影响自动回路：DO-PID → 鼓风曝气群控</div>
                  <div>⚠️ 建议操作：加大鼓风量 / 检查鼓风机状态</div>
                </div>
              </div>
              {handleResult && (
                <div className="col-span-2 bg-green-50 border border-green-200 rounded p-3">
                  <div className="text-xs font-semibold text-green-700">✓ 处置结果已记录</div>
                  <div className="text-[11px] text-green-600 mt-0.5">
                    操作：{handleResult} · 操作人：张工 · 时间：{new Date().toLocaleString('zh-CN')}
                  </div>
                </div>
              )}
            </div>
          )}
          {tab === 'handle' && (
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr className="text-gray-500">
                  <th className="text-left px-3 py-2 font-medium">时间</th>
                  <th className="text-left px-3 py-2 font-medium">操作人</th>
                  <th className="text-left px-3 py-2 font-medium">动作</th>
                  <th className="text-left px-3 py-2 font-medium">备注</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="px-3 py-2 font-mono">{alarm.time}</td><td className="px-3 py-2">系统</td><td className="px-3 py-2 text-red-600">触发报警</td><td className="px-3 py-2 text-gray-500">DO 采样值 &lt; 低限 1.5</td></tr>
                {handleResult && (
                  <tr><td className="px-3 py-2 font-mono">{new Date().toLocaleString('zh-CN')}</td><td className="px-3 py-2">张工</td><td className="px-3 py-2 text-blue-600">{handleResult === '确认' ? '确认处理' : '临时屏蔽'}</td><td className="px-3 py-2 text-gray-500">现场已派人查看 / 屏蔽 24h</td></tr>
                )}
              </tbody>
            </table>
          )}
          {tab === 'trend' && (
            <div className="h-[320px]">
              <TrendingUpDemo />
            </div>
          )}
          {tab === 'history' && (
            <div className="text-xs text-gray-500">
              <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3">
                <div>近 30 天同类报警：<span className="text-red-600 font-bold">4 次</span></div>
                <div>最近一次：2026-08-12 14:30:00</div>
                <div>处理人：李工 · 原因：进水负荷增加导致 DO 下降</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TrendingUpDemo() {
  const data = Array.from({ length: 48 }, (_, i) => ({
    time: `${i}`, value: +(1.2 + Math.sin(i / 4) * 0.5 + (Math.random() - 0.5) * 0.3).toFixed(2),
  }));
  return (
    <svg viewBox="0 0 800 300" className="w-full h-full">
      <line x1="40" y1="250" x2="780" y2="250" stroke="#e2e8f0" />
      <line x1="40" y1="40" x2="40" y2="250" stroke="#e2e8f0" />
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1="40" y1={250 - i * 45} x2="780" y2={250 - i * 45} stroke="#f1f5f9" />
      ))}
      <polyline
        fill="none"
        stroke="#dc2626"
        strokeWidth="2"
        points={data.map((d, i) => `${40 + i * 15},${250 - d.value * 50}`).join(' ')}
      />
      {/* 低限参考线 1.5 */}
      <line x1="40" y1="175" x2="780" y2="175" stroke="#3b82f6" strokeDasharray="4 4" />
      <text x="785" y="178" fontSize="10" fill="#3b82f6">低限 1.5</text>
      {/* 触发位置 */}
      <circle cx={40 + 8 * 15} cy={250 - data[8].value * 50} r="6" fill="#dc2626" stroke="white" strokeWidth="2" />
      <text x={40 + 8 * 15} y={250 - data[8].value * 50 - 12} fontSize="10" fill="#dc2626">触发点 {data[8].value}</text>
    </svg>
  );
}
