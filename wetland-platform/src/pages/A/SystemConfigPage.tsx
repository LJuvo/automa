import { useState } from 'react';
import { Save, RotateCcw, History } from 'lucide-react';

const tabs = [
  { key: 'alarm', name: '报警规则' },
  { key: 'param', name: '工艺参数' },
  { key: 'report', name: '报表计划' },
  { key: 'collect', name: '数据采集' },
  { key: 'carbon', name: '碳减排参数' },
];

const alarmRules = [
  { param: 'DO (生化池)', ll: '—', l: '1.0 mg/L', h: '—', hh: '—', level: '重要', delay: '300s', enabled: true },
  { param: 'MLSS', ll: '2000', l: '2500', h: '3500', hh: '4000', level: '次要', delay: '60s', enabled: true },
  { param: '进水流量', ll: '—', l: '—', h: '1800 m³/h', hh: '2200 m³/h', level: '重要', delay: '0s', enabled: true },
  { param: '调节池液位', ll: '1.5', l: '2.0', h: '3.5', hh: '4.0', level: '紧急', delay: '0s', enabled: true },
  { param: 'pH', ll: '6.0', l: '6.5', h: '8.0', hh: '8.5', level: '重要', delay: '30s', enabled: true },
  { param: '余氯', ll: '—', l: '0.5', h: '1.5', hh: '2.0', level: '次要', delay: '60s', enabled: true },
];

const processParams = [
  { name: 'DO 设定值', value: '2.0', unit: 'mg/L', range: '1.0 ~ 3.0', current: '1.98' },
  { name: 'ORP 设定值', value: '-200', unit: 'mV', range: '-300 ~ -100', current: '-195' },
  { name: 'MLSS 目标值', value: '3000', unit: 'mg/L', range: '2500 ~ 3500', current: '3150' },
  { name: '回流比设定', value: '80', unit: '%', range: '50 ~ 150', current: '78' },
  { name: '剩余污泥排放量', value: '15', unit: 'm³/h', range: '5 ~ 30', current: '14.5' },
  { name: 'PAC 投加系数', value: '1.0', unit: '', range: '0.5 ~ 2.0', current: '1.02' },
  { name: '碳源投加系数', value: '1.0', unit: '', range: '0.5 ~ 2.0', current: '1.05' },
  { name: '鼓风机 PID Kp', value: '0.8', unit: '', range: '0.1 ~ 2.0', current: '0.8' },
  { name: '鼓风机 PID Ki', value: '0.05', unit: '', range: '0.01 ~ 0.5', current: '0.05' },
  { name: '鼓风机 PID Kd', value: '0.02', unit: '', range: '0 ~ 0.1', current: '0.02' },
];

const carbonParams = [
  { name: '电网排放因子', value: '0.581', unit: 'kgCO₂/kWh', source: '华东电网2024', updated: '2025-03-15' },
  { name: '自来水排放因子', value: '0.91', unit: 'kgCO₂/m³', source: '江西省水利厅', updated: '2025-03-15' },
  { name: '污泥填埋因子', value: '120', unit: 'kgCO₂/吨', source: 'IPCC默认值', updated: '2024-12-01' },
];

export function SystemConfigPage() {
  const [activeTab, setActiveTab] = useState('alarm');

  return (
    <div className="h-full flex gap-3">
      {/* 左侧 Tab */}
      <div className="w-48 bg-white rounded-lg border border-gray-200 shrink-0 p-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`w-full text-left px-3 py-2.5 text-sm rounded mb-1 transition ${
              activeTab === t.key ? 'bg-pri text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t.name}
          </button>
        ))}
        <div className="h-px bg-gray-200 my-2"></div>
        <div className="px-2 py-2 text-[11px] text-amber-700 bg-amber-50 rounded">
          <strong>权限提示</strong><br/>
          仅管理员可修改全部配置。工程师仅可改"工艺参数"。
        </div>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col min-w-0">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">
            {tabs.find(t => t.key === activeTab)?.name}
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1">
              <RotateCcw size={11} /> 恢复默认
            </button>
            <button className="px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1">
              <History size={11} /> 变更历史
            </button>
            <button className="px-3 py-1.5 text-xs rounded bg-pri text-white hover:bg-pri-d flex items-center gap-1">
              <Save size={11} /> 保存
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'alarm' && (
            <div>
              <div className="mb-3 text-xs text-gray-500 flex items-center gap-2">
                <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">紧急</span>
                <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">重要</span>
                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">次要</span>
                <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-semibold">提示</span>
                <span className="ml-3">延迟时间 = 持续满足条件的时间；防止误报</span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr className="text-gray-500">
                    <th className="text-left px-3 py-2 font-medium">参数名</th>
                    <th className="text-center px-3 py-2 font-medium">低低限</th>
                    <th className="text-center px-3 py-2 font-medium">低限</th>
                    <th className="text-center px-3 py-2 font-medium">高限</th>
                    <th className="text-center px-3 py-2 font-medium">高高限</th>
                    <th className="text-center px-3 py-2 font-medium">级别</th>
                    <th className="text-center px-3 py-2 font-medium">延迟</th>
                    <th className="text-center px-3 py-2 font-medium">启用</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {alarmRules.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-800 font-medium">{r.param}</td>
                      <td className="px-3 py-2 text-center font-mono text-gray-600">{r.ll}</td>
                      <td className="px-3 py-2 text-center font-mono text-gray-600">{r.l}</td>
                      <td className="px-3 py-2 text-center font-mono text-gray-600">{r.h}</td>
                      <td className="px-3 py-2 text-center font-mono text-gray-600">{r.hh}</td>
                      <td className="px-3 py-2 text-center">
                        <select className="border border-gray-200 rounded px-2 py-1 text-[11px] outline-none">
                          <option>{r.level}</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-center font-mono">{r.delay}</td>
                      <td className="px-3 py-2 text-center">
                        <input type="checkbox" defaultChecked={r.enabled} className="accent-cyan-600" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'param' && (
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr className="text-gray-500">
                  <th className="text-left px-3 py-2 font-medium">参数名</th>
                  <th className="text-center px-3 py-2 font-medium">设定值</th>
                  <th className="text-center px-3 py-2 font-medium">单位</th>
                  <th className="text-center px-3 py-2 font-medium">允许范围</th>
                  <th className="text-center px-3 py-2 font-medium">当前值</th>
                  <th className="text-center px-3 py-2 font-medium">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processParams.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-800 font-medium">{p.name}</td>
                    <td className="px-3 py-2 text-center font-mono">
                      <input
                        type="number"
                        defaultValue={p.value}
                        className="w-24 text-center border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-pri font-mono"
                      />
                    </td>
                    <td className="px-3 py-2 text-center text-gray-500">{p.unit || '—'}</td>
                    <td className="px-3 py-2 text-center text-gray-500 font-mono">{p.range}</td>
                    <td className="px-3 py-2 text-center font-mono text-gray-700">{p.current}</td>
                    <td className="px-3 py-2 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700">正常</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'carbon' && (
            <div className="space-y-3">
              {carbonParams.map((p, i) => (
                <div key={i} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{p.name}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">数据来源：{p.source}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-700 font-mono">{p.value}</div>
                      <div className="text-[10px] text-gray-500">{p.unit}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-200 text-[11px]">
                    <span className="text-gray-500">最近更新：{p.updated}</span>
                    <button className="px-2 py-1 bg-white border border-purple-200 rounded text-purple-700 hover:bg-purple-100">修改</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'report' || activeTab === 'collect') && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="text-4xl mb-3">⚙️</div>
              <div className="text-sm">{tabs.find(t => t.key === activeTab)?.name} — 待完善</div>
              <div className="text-[11px] mt-1">原型示意：此页面将展示对应的配置表单</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
