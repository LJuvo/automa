import { useState } from 'react';
import { Download, RefreshCw, Play, Pause, Plus, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from 'recharts';

const params = [
  { code: 'do', name: 'DO 溶解氧', unit: 'mg/L', setValue: 2.0, color: '#0e7490' },
  { code: 'mlss', name: 'MLSS 污泥浓度', unit: 'mg/L', setValue: 3000, color: '#16a34a' },
  { code: 'orp', name: 'ORP 氧化还原电位', unit: 'mV', setValue: -200, color: '#7c3aed' },
  { code: 'flow', name: '进水流量', unit: 'm³/h', color: '#ea580c' },
];

const trendData = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  return {
    time: `${String(hour).padStart(2, '0')}:00`,
    do: 1.8 + Math.sin(i / 3) * 0.4 + Math.random() * 0.2,
    mlss: 3000 + Math.sin(i / 4) * 200 + Math.random() * 100,
    orp: -200 + Math.sin(i / 5) * 30 + Math.random() * 20,
    flow: 1200 + Math.sin(i / 2) * 200 + Math.random() * 100,
  };
});

export function TrendAnalysisPage() {
  const [selected, setSelected] = useState<string[]>(['do']);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="h-full flex flex-col gap-3">
      {/* 参数选择 */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-gray-500">选择参数：</span>
          {params.map(p => (
            <label key={p.code} className={`flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer transition ${
              selected.includes(p.code) ? 'bg-pri-l border-pri text-pri-d' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="checkbox"
                checked={selected.includes(p.code)}
                onChange={() => setSelected(s => s.includes(p.code) ? s.filter(x => x !== p.code) : [...s, p.code])}
                className="sr-only"
              />
              <span className="w-3 h-3 rounded" style={{ background: p.color }}></span>
              <span className="text-xs">{p.name}</span>
              {selected.includes(p.code) && <Check size={12} className="text-pri" />}
            </label>
          ))}
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <span className="text-xs text-gray-500">时间范围：</span>
          <select className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none">
            <option>近24小时</option>
            <option>近7天</option>
            <option>近30天</option>
            <option>自定义</option>
          </select>
          <select className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none">
            <option>蓉江新区再生水厂</option>
          </select>
          <select className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none">
            <option>生化池 1#A²/O</option>
          </select>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setPlaying(!playing)}
              className={`px-2.5 py-1.5 text-xs rounded flex items-center gap-1 ${
                playing ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {playing ? <Pause size={11} /> : <Play size={11} />}
              {playing ? '暂停' : '实时'}
            </button>
            <button className="px-2.5 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 flex items-center gap-1 text-gray-600">
              <RefreshCw size={11} /> 刷新
            </button>
            <button className="px-2.5 py-1.5 text-xs rounded bg-pri text-white hover:bg-pri-d flex items-center gap-1">
              <Download size={11} /> 导出
            </button>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" fontSize={10} tick={{ fill: '#64748b' }} />
            <YAxis fontSize={10} tick={{ fill: '#64748b' }} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {selected.includes('do') && (
              <>
                <ReferenceLine y={2.0} stroke="#0e7490" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="do" name="DO (mg/L)" stroke="#0e7490" strokeWidth={2} dot={false} />
              </>
            )}
            {selected.includes('mlss') && (
              <>
                <ReferenceLine y={3000} stroke="#16a34a" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="mlss" name="MLSS (mg/L)" stroke="#16a34a" strokeWidth={2} dot={false} />
              </>
            )}
            {selected.includes('orp') && (
              <Line type="monotone" dataKey="orp" name="ORP (mV)" stroke="#7c3aed" strokeWidth={2} dot={false} />
            )}
            {selected.includes('flow') && (
              <Line type="monotone" dataKey="flow" name="进水流量 (m³/h)" stroke="#ea580c" strokeWidth={2} dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 数据统计 */}
      <div className="grid grid-cols-4 gap-3">
        {selected.includes('do') && (
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded bg-[#0e7490]"></span>
              <span className="text-xs font-semibold text-gray-700">DO 溶解氧</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><span className="text-gray-500">设定值</span> <span className="font-mono">2.0 mg/L</span></div>
              <div><span className="text-gray-500">平均值</span> <span className="font-mono text-pri">2.02 mg/L</span></div>
              <div><span className="text-gray-500">最大值</span> <span className="font-mono text-red-600">2.4 mg/L</span></div>
              <div><span className="text-gray-500">最小值</span> <span className="font-mono text-blue-600">1.6 mg/L</span></div>
              <div><span className="text-gray-500">达标率</span> <span className="font-mono text-green-600">96.5%</span></div>
              <div><span className="text-gray-500">波动</span> <span className="font-mono">±0.28</span></div>
            </div>
          </div>
        )}
        {selected.includes('mlss') && (
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded bg-[#16a34a]"></span>
              <span className="text-xs font-semibold text-gray-700">MLSS 污泥浓度</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><span className="text-gray-500">目标值</span> <span className="font-mono">3000 mg/L</span></div>
              <div><span className="text-gray-500">平均值</span> <span className="font-mono text-pri">3150 mg/L</span></div>
              <div><span className="text-gray-500">最大值</span> <span className="font-mono text-red-600">3420 mg/L</span></div>
              <div><span className="text-gray-500">最小值</span> <span className="font-mono text-blue-600">2890 mg/L</span></div>
            </div>
          </div>
        )}
        <div className="bg-gradient-to-br from-pri to-acc rounded-lg p-3 text-white">
          <div className="text-xs opacity-80 mb-1">运行平稳度</div>
          <div className="text-2xl font-bold">优</div>
          <div className="text-[10px] opacity-80 mt-1">综合评分 92/100</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col justify-center">
          <div className="text-xs text-gray-500 mb-1.5">多变量关联分析</div>
          <div className="text-[11px] text-gray-700 leading-relaxed">
            DO 与 <span className="text-pri font-medium">鼓风量</span> 强正相关 (r=0.85)<br/>
            MLSS 与 <span className="text-pri font-medium">回流比</span> 弱正相关 (r=0.32)
          </div>
        </div>
      </div>
    </div>
  );
}
