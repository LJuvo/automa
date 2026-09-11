import { useParams, Link } from 'react-router-dom';
import { Activity, ArrowRight, AlertTriangle, Bell, Gauge, Thermometer, Droplets, Zap, MapPin } from 'lucide-react';

const stations: Record<string, { name: string; sub: string; flow: string; status: 'normal' | 'alarm' | 'offline'; capacity: string }> = {
  b02: { name: '建春污水处理厂一期', sub: '2.0 万 m³/d', flow: '620', status: 'normal', capacity: '20000' },
  b03: { name: '金风梅园污水处理厂', sub: '3.0 万 m³/d', flow: '860', status: 'normal', capacity: '30000' },
  b04: { name: '沙石污水处理厂',   sub: '2.0 万 m³/d', flow: '580', status: 'alarm',  capacity: '20000' },
  b05: { name: '蓉江新区污水处理厂二期', sub: '4.0 万 m³/d', flow: '1240', status: 'normal', capacity: '40000' },
  b06: { name: '水东再生水厂',       sub: '2.5 万 m³/d', flow: '680', status: 'normal', capacity: '25000' },
  b07: { name: '白塔污泥处理处置中心', sub: '100 吨/d',    flow: '100',  status: 'normal', capacity: '100' },
};

/* 8 standard process segments — 每个站用同一模板 */
const segments = [
  { key: 'C01', name: '进水泵站及格栅', params: [['进水流量', '1240 m³/h'], ['液位差', '0.05 m'], ['泵组电流', '32 A']] },
  { key: 'C02', name: '沉砂池',           params: [['停留时间', '30 min'], ['出水浊度', '12 NTU'], ['搅拌频率', '42 Hz']] },
  { key: 'C03', name: '生化池 (A²/O)',    params: [['DO', '2.0 mg/L'], ['MLSS', '3150 mg/L'], ['ORP缺氧', '-235 mV']] },
  { key: 'C04', name: '鼓风曝气群控',     params: [ ['曝气压力', '0.05 MPa'], ['主风机电流', '48 A'], ['气水比', '24:1']] },
  { key: 'C05', name: '二沉池及回流',     params: [ ['回流比', '75%'], ['表面负荷', '0.9 m²/h'], ['泥位', '1.2 m']] },
  { key: 'C06', name: '加药系统',         params: [ ['PAC投加量', '120 L/h'], ['PAM投加量', '30 L/h'], ['计量泵频率', '25 Hz']] },
  { key: 'C07', name: '消毒系统',         params: [ ['余氯', '0.8 mg/L'], ['UV剂量', '40 mJ/cm²'], ['出水pH', '7.2']] },
  { key: 'C08', name: '污泥脱水',         params: [ ['进泥浓度', '3.2%'], ['出泥含水率', '62%'], ['压滤时间', '28 min']] },
];

export function ProcessDiagramPage() {
  const { code = 'b02' } = useParams();
  const st = stations[code.toLowerCase()] || stations.b02;

  const statusColor = st.status === 'normal' ? 'var(--status-success)' :
                      st.status === 'alarm'  ? 'var(--status-warn)' : 'var(--neutral-400)';

  return (
    <div className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      {/* ── Header strip ── */}
      <header className="card p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${statusColor}18`, color: statusColor }}>
            <MapPin size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="t-subhead m-0">{st.name}</h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--neutral-100)] text-[var(--neutral-500)]">{code.toUpperCase()}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px]" style={{ background: `${statusColor}18`, color: statusColor }}>
                <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: statusColor }}></span>
                {st.status === 'normal' ? '正常运行' : st.status === 'alarm' ? '报警中' : '离线'}
              </span>
            </div>
            <div className="t-secondary mt-1">设计处理规模 {st.sub} · 当前流量 <b className="text-[var(--brand-700)] font-mono">{st.flow}</b> m³/h</div>
          </div>

          {/* Quick KPI strip */}
          <div className="flex gap-2">
            {[
              { icon: Droplets, k: 'COD',   v: '25', u: 'mg/L', c: 'var(--brand-500)' },
              { icon: Activity, k: '氨氮',   v: '0.8', u: 'mg/L', c: 'var(--status-success)' },
              { icon: Thermometer, k: '水温', v: '22',  u: '℃',    c: 'var(--status-info)' },
              { icon: Gauge,    k: 'pH',    v: '7.2', u: '',     c: 'var(--brand-400)' },
            ].map(m => (
              <div key={m.k} className="rounded-lg border border-[var(--neutral-200)] px-3 py-2 min-w-[96px]">
                <div className="flex items-center gap-1 text-[10.5px] text-[var(--neutral-500)] uppercase tracking-wide">
                  <m.icon size={11} style={{ color: m.c }} /> {m.k}
                </div>
                <div className="flex items-baseline gap-0.5 mt-0.5">
                  <span className="text-[16px] font-bold font-mono tabular-nums" style={{ color: 'var(--neutral-900)' }}>{m.v}</span>
                  {m.u && <span className="text-[10px] text-[var(--neutral-500)]">{m.u}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Process segments — horizontal flow with connector arrows ── */}
      <section className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-semibold text-[var(--neutral-800)] flex items-center gap-1.5">
            <Activity size={14} className="text-[var(--brand-600)]" /> 工艺流程图
          </h2>
          <div className="flex items-center gap-3 text-[11px] text-[var(--neutral-500)]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--status-success)]"></span> 正常</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--status-warn)]"></span> 报警</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--neutral-400)]"></span> 离线</span>
          </div>
        </div>

        <div className="flex items-stretch gap-0 overflow-x-auto pb-2 -mx-1 px-1">
          {segments.map((seg, i) => {
            const segStatus = i === 2 && st.status === 'alarm' ? 'alarm' : 'normal';
            const c = segStatus === 'normal' ? 'var(--status-success)' : 'var(--status-warn)';
            return (
              <div key={seg.key} className="flex items-stretch">
                <Link to={`/page/${seg.key.toLowerCase()}`}
                  className="w-[168px] shrink-0 rounded-lg border border-[var(--neutral-200)] hover:border-[var(--brand-500)] hover:shadow-[var(--shadow-sm)] bg-[var(--surface-0)] p-3 transition group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] text-[var(--neutral-400)]">{seg.key}</span>
                    <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: c }}></span>
                  </div>
                  <div className="text-[12.5px] font-semibold text-[var(--neutral-800)] leading-snug group-hover:text-[var(--brand-700)] transition mb-2">
                    {seg.name}
                  </div>
                  <div className="space-y-0.5">
                    {seg.params.map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[11px]">
                        <span className="text-[var(--neutral-500)]">{k}</span>
                        <span className="font-mono text-[var(--neutral-800)] font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </Link>

                {i < segments.length - 1 && (
                  <div className="w-8 shrink-0 flex items-center justify-center relative">
                    <div className="absolute inset-y-0 left-1/2 w-px bg-[var(--neutral-300)]"></div>
                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[var(--neutral-100)] border border-[var(--neutral-200)] flex items-center justify-center text-[var(--brand-600)]">
                      <ArrowRight size={12} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Bottom row: site selector + active alarm ── */}
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-7 card p-4">
          <h3 className="text-[13px] font-semibold text-[var(--neutral-800)] mb-3 flex items-center gap-1.5">
            <MapPin size={14} className="text-[var(--brand-600)]" /> 切换子项
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(stations).map(([k, v]) => (
              <Link key={k} to={`/page/${k}`}
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 transition text-[12px]
                  ${k === code.toLowerCase()
                    ? 'border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-800)]'
                    : 'border-[var(--neutral-200)] hover:border-[var(--brand-300)] text-[var(--neutral-700)]'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  v.status === 'normal' ? 'bg-[var(--status-success)]' :
                  v.status === 'alarm'  ? 'bg-[var(--status-warn)]' : 'bg-[var(--neutral-400)]'
                }`}></span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{v.name}</div>
                  <div className="font-mono text-[10px] text-[var(--neutral-400)]">{k.toUpperCase()}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="col-span-5 card p-4">
          <h3 className="text-[13px] font-semibold text-[var(--neutral-800)] mb-3 flex items-center gap-1.5">
            <Bell size={14} className="text-[var(--status-warn)]" /> 本站近期报警
          </h3>
          <div className="space-y-2">
            {[
              { t: '10:25', l: '重要',  m: '1#鼓风机振动 9.2mm/s', c: 'var(--status-danger)' },
              { t: '09:48', l: '一般',  m: '3#提升泵电流偏高',       c: 'var(--status-warn)' },
              { t: '08:32', l: '提示',  m: '加药泵 B 流量波动',       c: 'var(--status-info)' },
              { t: '07:15', l: '已处理', m: 'DO 瞬低于 1.5（持续 2min）', c: 'var(--status-success)' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[var(--neutral-100)] last:border-none">
                <span className="font-mono text-[11px] text-[var(--neutral-400)] w-12">{a.t}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white" style={{ background: a.c }}>{a.l}</span>
                <span className="text-[12px] text-[var(--neutral-700)]">{a.m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
