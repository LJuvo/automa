import { useState } from 'react';
import { Activity, Battery, Droplet, Leaf, Wrench, TrendingUp, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell, Legend, ReferenceLine } from 'recharts';

type AnalysisConfig = {
  code: string;
  title: string;
  subtitle: string;
  unit: string;
  color: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export const analysisConfigs: AnalysisConfig[] = [
  { code: 'd05', title: '能耗分析', subtitle: '分项能耗 · 对标分析', unit: 'kWh/m³', color: '#0e7490', icon: Battery },
  { code: 'd06', title: '药耗分析', subtitle: '药耗与水质关联', unit: 'L/1000m³', color: '#7c3aed', icon: Droplet },
  { code: 'd07', title: '水质变化分析', subtitle: '进出水指标 · 去除率', unit: 'mg/L', color: '#16a34a', icon: Activity },
  { code: 'd08', title: '碳减排分析', subtitle: '3维碳减排核算', unit: '吨CO₂/年', color: '#16a34a', icon: Leaf },
  { code: 'd09', title: '设备运行管理', subtitle: '设备台账 · 维护提醒', unit: '台', color: '#ea580c', icon: Wrench },
];

export function AnalysisPage({ code }: { code: string }) {
  const cfg = analysisConfigs.find(c => c.code === code.toLowerCase()) || analysisConfigs[0];
  const Icon = cfg.icon;

  // 生成差异化数据
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}月`,
    value: +(0.28 + Math.sin(i / 2) * 0.03 + Math.random() * 0.02).toFixed(3),
    target: code === 'd05' ? 0.32 : code === 'd06' ? 8.0 : code === 'd07' ? 25 : code === 'd08' ? 1200 : 100,
  }));

  const pieData = code === 'd05' ? [
    { name: '鼓风机', value: 45 }, { name: '提升泵', value: 20 }, { name: '回流泵', value: 12 },
    { name: '加药泵', value: 8 }, { name: '照明/其他', value: 15 },
  ] : code === 'd08' ? [
    { name: '电力减排', value: 52 }, { name: '污泥资源化', value: 28 }, { name: '药剂节约', value: 20 },
  ] : [
    { name: '蓉江新区', value: 38 }, { name: '沙石厂', value: 22 }, { name: '建春站', value: 12 },
    { name: '金风梅园', value: 18 }, { name: '白塔厂', value: 10 },
  ];

  const COLORS = ['#0e7490', '#0891b2', '#155e75', '#06b6d4', '#0e7490'];

  return (
    <div className="h-full flex flex-col gap-3">
      {/* 标题条 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-pri text-white flex items-center justify-center">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-800">{cfg.title}</h2>
          <p className="text-[11px] text-gray-500">{cfg.subtitle} · <span className="font-mono bg-gray-100 px-1 rounded">{cfg.code.toUpperCase()}</span></p>
        </div>
        <div className="ml-auto flex gap-2">
          <select className="text-xs border border-gray-200 rounded px-2 py-1.5 outline-none">
            <option>2026 年</option><option>2025 年</option>
          </select>
          <select className="text-xs border border-gray-200 rounded px-2 py-1.5 outline-none">
            <option>全部子项</option><option>蓉江新区</option><option>沙石厂</option>
          </select>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">2026年累计</div>
          <div className="text-2xl font-bold" style={{ color: cfg.color }}>
            {code === 'd05' ? '0.319' : code === 'd06' ? '7.8' : code === 'd07' ? '26.5' : code === 'd08' ? '12,450' : '186'}
            <span className="text-sm ml-1 text-gray-500">{cfg.unit}</span>
          </div>
          <div className="text-[11px] text-green-600 mt-1">✓ 优于标杆值 {code === 'd08' ? '15%' : '8%'}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">当月</div>
          <div className="text-2xl font-bold text-gray-800">
            {code === 'd05' ? '0.312' : code === 'd06' ? '7.5' : code === 'd07' ? '25.8' : code === 'd08' ? '1,120' : '182'}
            <span className="text-sm ml-1 text-gray-500">{cfg.unit}</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">同比去年 ↓ 4.2%</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">对标基准</div>
          <div className="text-2xl font-bold text-gray-800">
            {code === 'd05' ? '0.35' : code === 'd06' ? '9.0' : code === 'd07' ? '30' : code === 'd08' ? '—' : '—'}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">GB/T 29434 一级A</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">最优子项</div>
          <div className="text-base font-bold text-green-600 flex items-center gap-1">
            <Award size={14} /> 蓉江新区
          </div>
          <div className="text-[11px] text-gray-500 mt-1">优于标杆 11.2%</div>
        </div>
      </div>

      {/* 图表 */}
      <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
        <div className="col-span-8 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-pri" />
              近12月 {cfg.title} 趋势
            </h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={10} tick={{ fill: '#64748b' }} />
                <YAxis fontSize={10} tick={{ fill: '#64748b' }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <ReferenceLine y={monthlyData[0].target} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '标杆', fontSize: 9, fill: '#ef4444' }} />
                <Line type="monotone" dataKey="value" name="实际值" stroke={cfg.color} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-4 bg-white rounded-lg border border-gray-200 p-4 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            {code === 'd05' ? '分项占比' : code === 'd08' ? '减排构成' : '子项对比'}
          </h3>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={11}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 下方子项对比 */}
        <div className="col-span-12 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">子项对标</h3>
          <div className="grid grid-cols-6 gap-3">
            {['蓉江新区', '沙石厂', '建春站', '金风梅园', '白塔厂', '水东厂'].map((name, i) => {
              const val = +(0.28 + Math.random() * 0.08).toFixed(3);
              const pct = Math.round((0.35 - val) / 0.35 * 100);
              return (
                <div key={name} className="border border-gray-200 rounded-lg p-3">
                  <div className="text-[11px] text-gray-500 mb-1">{name}</div>
                  <div className="text-lg font-bold" style={{ color: val < 0.32 ? '#16a34a' : val < 0.35 ? '#d97706' : '#dc2626' }}>{val}</div>
                  <div className="text-[10px] text-gray-400">优于标杆 {pct}%</div>
                  <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(pct * 2, 100)}%`, background: val < 0.32 ? '#16a34a' : val < 0.35 ? '#d97706' : '#dc2626' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
