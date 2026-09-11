import { useState } from 'react';
import { TrendingUp, AlertTriangle, Shield, Activity, Play, Pause, Power, RotateCcw, Settings, ChevronDown, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export type ControlDevice = {
  id: string;
  name: string;
  mode: '自动' | '手动';
  status: '运行' | '停止' | '故障' | '投运' | '就绪';
  frequency?: string;
  current?: string;
  runHours?: number;
  protection: string;
  [k: string]: any;
};

export type PanelData = {
  code: string;
  name?: string;
  title?: string;
  subtitle?: string;
  trendKey?: string;
  params: any[];
  devices: any[];
  interlocks?: any[];
  trend?: any;
  [k: string]: any;
};

/* Backwards-compatible alias */
export type OperationPanelData = PanelData;

export function OperationPanelTemplate({ data }: { data: PanelData }) {
  const [trendRange, setTrendRange] = useState<'1h' | '6h' | '24h'>('1h');
  const [manualDev, setManualDev] = useState<string | null>(null);

  // 生成一条合理的趋势
  const trend = Array.from({ length: 30 }, (_, i) => ({
    t: `${i}`,
    v: +(2 + Math.sin(i / 5) * 0.6 + Math.random() * 0.15).toFixed(2),
    v2: +(1.8 + Math.sin(i / 6 + 1) * 0.5 + Math.random() * 0.1).toFixed(2),
  }));

  return (
    <div className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      {/* ── Page title strip ── */}
      <header className="card p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] flex items-center justify-center">
            <Settings size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="t-subhead m-0">{data.name || data.title}</h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--neutral-100)] text-[var(--neutral-500)]">{data.code}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-[var(--status-success)]/15 text-[var(--status-success)]">
                <span className="w-1.5 h-1.5 rounded-full pulse-dot bg-current"></span> 全部联锁就绪
              </span>
            </div>
            <div className="t-secondary mt-1">{data.subtitle || `${data.code} 工艺单元 · 实时监控与手动干预`}</div>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="btn btn-ghost h-8">
              <RotateCcw size={13} /> 复位
            </button>
            <button className="btn btn-primary h-8">
              <Power size={13} /> 一键启/停
            </button>
          </div>
        </div>
      </header>

      {/* ── Two-column: params left, trend right ── */}
      <section className="grid grid-cols-12 gap-4">
        {/* Realtime params */}
        <div className="col-span-7 card p-4">
          <h3 className="text-[13px] font-semibold text-[var(--neutral-800)] mb-3 flex items-center gap-1.5">
            <Activity size={14} className="text-[var(--brand-600)]" /> 实时参数
            <span className="ml-auto text-[10.5px] font-normal text-[var(--neutral-500)] font-mono">
              最后刷新 10:25:33
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {data.params.map(p => {
              const isAlarm = p.status === 'alarm';
              return (
                <div key={p.name}
                  className={`rounded-lg border p-3 transition ${isAlarm
                    ? 'border-[var(--status-danger)] bg-[var(--status-danger)]/5'
                    : 'border-[var(--neutral-200)] hover:border-[var(--brand-300)]'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11.5px] text-[var(--neutral-500)]">{p.name}</span>
                    {p.setValue && <span className="font-mono text-[10px] text-[var(--neutral-400)]">目标 {p.setValue}</span>}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[22px] font-bold font-mono tabular-nums tracking-tight"
                      style={{ color: isAlarm ? 'var(--status-danger)' : 'var(--neutral-900)' }}>{p.current}</span>
                    <span className="text-[11.5px] text-[var(--neutral-500)]">{p.unit}</span>
                    {isAlarm && <AlertTriangle size={13} className="ml-auto text-[var(--status-danger)] pulse-dot" />}
                  </div>
                  {/* Mini bar */}
                  <div className="mt-2 h-1 bg-[var(--neutral-100)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (parseFloat(p.current.replace(/[^\d.]/g,'')) / (parseFloat((p.setValue || '100').replace(/[^\d.]/g,'')) || 100)) * 100)}%`,
                        background: isAlarm ? 'var(--status-danger)' : 'var(--brand-500)'
                      }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trend */}
        <div className="col-span-5 card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-[var(--neutral-800)] flex items-center gap-1.5">
              <TrendingUp size={14} className="text-[var(--brand-600)]" /> {data.trendKey || 'DO'} 趋势
            </h3>
            <div className="flex rounded-md border border-[var(--neutral-200)] overflow-hidden text-[11px]">
              {(['1h','6h','24h'] as const).map(r => (
                <button key={r} onClick={() => setTrendRange(r)}
                  className={`px-2.5 py-1 ${trendRange === r ? 'bg-[var(--brand-500)] text-white' : 'bg-white text-[var(--neutral-600)] hover:bg-[var(--neutral-50)]'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-100)" />
                <XAxis dataKey="t" fontSize={10} tick={{ fill: 'var(--neutral-400)' }} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} tick={{ fill: 'var(--neutral-400)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ fontSize: 11, border: '1px solid var(--neutral-200)', borderRadius: 8, boxShadow: 'var(--shadow-md)' }} />
                <Line type="monotone" dataKey="v" name="当前" stroke="var(--brand-500)" strokeWidth={1.8} dot={false} />
                <Line type="monotone" dataKey="v2" name="前一时段" stroke="var(--brand-300)" strokeWidth={1.2} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Setpoint control */}
          <div className="mt-3 pt-3 border-t border-[var(--neutral-100)]">
            <div className="flex items-center justify-between text-[12px] mb-2">
              <span className="text-[var(--neutral-600)]">DO 设定值</span>
              <span className="font-mono font-bold text-[var(--brand-700)]">2.0 mg/L</span>
            </div>
            <input type="range" min="0.5" max="4" step="0.1" defaultValue="2.0"
              className="w-full accent-[var(--brand-500)]" />
            <div className="flex justify-between text-[10px] text-[var(--neutral-400)] font-mono mt-0.5">
              <span>0.5</span><span>1.5</span><span>2.5</span><span>3.5</span><span>4.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Devices ── */}
      <section className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold text-[var(--neutral-800)] flex items-center gap-1.5">
            <Zap size={14} className="text-[var(--brand-600)]" /> 设备控制
            <span className="text-[10.5px] font-normal text-[var(--neutral-500)]">· 点击「手动」进入就地操作</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {data.devices.map(d => {
            const statusColor = d.status === '运行' || d.status === '投运' ? 'var(--status-success)' :
                                d.status === '故障' ? 'var(--status-danger)' : 'var(--neutral-400)';
            const manual = manualDev === d.id;
            return (
              <div key={d.id} className={`rounded-lg border p-3 transition
                ${manual ? 'border-[var(--brand-500)] bg-[var(--brand-50)]/40' : 'border-[var(--neutral-200)] hover:border-[var(--brand-300)]'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-[var(--neutral-400)]">{d.id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${d.mode === '自动' ? 'bg-[var(--brand-50)] text-[var(--brand-700)]' : 'bg-amber-50 text-[var(--status-warn)]'}`}>
                        {d.mode}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: statusColor }}>
                        <span className={`w-1.5 h-1.5 rounded-full ${d.status === '运行' ? 'pulse-dot' : ''}`} style={{ background: statusColor }}></span>
                        {d.status}
                      </span>
                    </div>
                    <div className="text-[13px] font-semibold text-[var(--neutral-800)] mb-1.5">{d.name}</div>
                    <div className="flex gap-3 text-[11px]">
                      {d.frequency && <span className="text-[var(--neutral-500)]">频率 <b className="font-mono text-[var(--neutral-800)]">{d.frequency}</b></span>}
                      {d.current && <span className="text-[var(--neutral-500)]">电流 <b className="font-mono text-[var(--neutral-800)]">{d.current}</b></span>}
                    </div>
                    <div className="mt-1 text-[10.5px] flex items-center gap-1" style={{ color: d.protection.includes('OK') || d.protection.includes('联锁') ? 'var(--status-success)' : 'var(--status-warn)' }}>
                      <Shield size={11} /> {d.protection}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => setManualDev(manual ? null : d.id)}
                      className="h-7 px-2 text-[11px] rounded border border-[var(--neutral-200)] hover:bg-[var(--neutral-50)] text-[var(--neutral-700)] flex items-center gap-1">
                      {manual ? <><ChevronDown size={10} /> 自动</> : <>手动 <Play size={10} /></>}
                    </button>
                    {manual && (
                      <>
                        <button className="h-7 px-2 text-[11px] rounded bg-[var(--status-success)] text-white flex items-center justify-center gap-1 hover:opacity-90">
                          <Play size={10} /> 启动
                        </button>
                        <button className="h-7 px-2 text-[11px] rounded bg-[var(--status-danger)] text-white flex items-center justify-center gap-1 hover:opacity-90">
                          <Pause size={10} /> 停止
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Interlocks ── */}
      {data.interlocks && data.interlocks.length > 0 && (
        <section className="card p-4">
          <h3 className="text-[13px] font-semibold text-[var(--neutral-800)] mb-3 flex items-center gap-1.5">
            <Shield size={14} className="text-[var(--brand-600)]" /> 联锁条件
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {data.interlocks.map((it, i) => (
              <div key={i} className={`rounded-lg border p-3 ${it.ok ? 'border-[var(--status-success)]/40 bg-[var(--status-success)]/5' : 'border-[var(--status-warn)]/40 bg-amber-50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12.5px] text-[var(--neutral-800)] font-medium">{it.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${it.ok ? 'bg-[var(--status-success)] text-white' : 'bg-[var(--status-warn)] text-white'}`}>
                    {it.ok ? '就绪' : '触发'}
                  </span>
                </div>
                <div className="text-[11.5px] text-[var(--neutral-500)] font-mono">{it.value}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
