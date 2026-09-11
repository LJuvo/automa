import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, ArrowUpRight, Bell, Calendar, Clock, Droplets, Flame, Gauge, Leaf, Map, TrendingUp, Wind, Zap } from 'lucide-react';

const kpis = [
  { label: '今日处理水量', value: '12,450', unit: 'm³/h', trend: '+3.2%', up: true, icon: Droplets, color: 'var(--brand-500)' },
  { label: '出水达标率',   value: '99.8',  unit: '%',   trend: '+0.1%',  up: true, icon: Gauge,    color: 'var(--status-success)' },
  { label: '活跃报警',     value: '6',     unit: '条',  trend: '-2',     up: false, icon: Bell,     color: 'var(--status-warn)' },
  { label: '在线设备',     value: '318',   unit: '台',  trend: '100%',   up: true, icon: Zap,      color: 'var(--brand-400)' },
];

const sites = [
  { id: 'B02', name: '建春污水厂', status: 'normal', flow: '620', capacity: '2.0万' },
  { id: 'B03', name: '金风梅园污水厂', status: 'normal', flow: '860', capacity: '3.0万' },
  { id: 'B04', name: '沙石污水厂',   status: 'alarm',  flow: '580', capacity: '2.0万' },
  { id: 'B05', name: '蓉江新区二期', status: 'normal', flow: '1240', capacity: '4.0万' },
  { id: 'B06', name: '水东净化厂', status: 'normal', flow: '680', capacity: '2.5万' },
  { id: 'B07', name: '白塔污泥处置', status: 'normal', flow: '100', capacity: '100吨' },
];

const quickLinks = [
  { name: '进水泵站',   code: 'C01', icon: Droplets },
  { name: '生化池A²/O', code: 'C03', icon: Activity },
  { name: '鼓风曝气',   code: 'C04', icon: Wind },
  { name: '污泥脱水',   code: 'C08', icon: Flame },
];

export function WorkbenchPage() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const hh = time.getHours();
  const greet = hh < 6 ? '凌晨好' : hh < 11 ? '早上好' : hh < 14 ? '中午好' : hh < 18 ? '下午好' : '晚上好';

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto">

      {/* ── Hero row — greeting + headline KPI ── */}
      <section className="card p-5">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-[11.5px] text-[var(--neutral-500)] mb-2">
              <span className="flex items-center gap-1"><Calendar size={12} /> {time.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
              <span className="flex items-center gap-1 font-mono"><Clock size={12} /> {time.toLocaleTimeString('zh-CN', { hour12: false })}</span>
            </div>
            <h1 className="t-heading mb-1.5">{greet}，张工 👋</h1>
            <p className="t-secondary">今天是 <b className="text-[var(--neutral-800)]">8月18日 · 星期一</b>，所有子项运行平稳。<Link to="/alarm" className="text-[var(--brand-600)] hover:underline ml-1.5">有 2 条活跃报警需关注 →</Link></p>
          </div>

          {/* Headline metric */}
          <div className="w-[320px] shrink-0 rounded-xl p-4 text-white"
            style={{ background: 'linear-gradient(135deg, var(--brand-600), var(--brand-800))' }}>
            <div className="text-[11px] opacity-80 tracking-wide uppercase">今日总处理量</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[34px] font-bold leading-none font-variant-numeric tabular-nums">12,450</span>
              <span className="text-[13px] opacity-80">m³/h</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] opacity-90">
              <span className="flex items-center gap-0.5 text-[var(--status-success)]"><ArrowUpRight size={12} /> +3.2%</span>
              <span>较昨日 · 达标率 99.8%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── KPI Row ── */}
      <section className="grid grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="card p-4 flex items-center gap-4 group hover:border-[var(--neutral-300)] transition">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${k.color}1a`, color: k.color }}>
              <k.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] text-[var(--neutral-500)]">{k.label}</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="t-kpi" style={{ color: 'var(--neutral-900)' }}>{k.value}</span>
                <span className="text-[12px] text-[var(--neutral-500)]">{k.unit}</span>
              </div>
              <div className={`text-[11px] mt-0.5 ${k.up ? 'text-[var(--status-success)]' : 'text-[var(--status-warn)]'}`}>
                {k.trend}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Three columns: Sites | Quick Links | Alarms ── */}
      <section className="grid grid-cols-12 gap-4">
        {/* Sites grid */}
        <div className="col-span-7 card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="t-subhead flex items-center gap-1.5">
              <Map size={16} className="text-[var(--brand-600)]" /> 子项运行总览
            </h3>
            <Link to="/overview" className="text-[11.5px] text-[var(--brand-600)] hover:underline flex items-center gap-0.5">查看全厂 →</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {sites.map(s => (
              <Link key={s.id} to={`/page/${s.id.toLowerCase()}`}
                className="rounded-lg border border-[var(--neutral-200)] hover:border-[var(--brand-400)] hover:bg-[var(--brand-50)]/30 p-3 transition group">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-[var(--neutral-400)]">{s.id}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    s.status === 'normal' ? 'bg-[var(--status-success)] pulse-dot' :
                    s.status === 'alarm'  ? 'bg-[var(--status-warn)] pulse-dot' : 'bg-[var(--neutral-400)]'
                  }`}></span>
                </div>
                <div className="text-[13px] font-semibold text-[var(--neutral-800)] group-hover:text-[var(--brand-700)] transition">{s.name}</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[18px] font-bold font-mono tabular-nums" style={{ color: 'var(--brand-700)' }}>{s.flow}</span>
                  <span className="text-[11px] text-[var(--neutral-500)]">m³/h</span>
                </div>
                <div className="text-[10.5px] text-[var(--neutral-500)] mt-0.5">处理规模 {s.capacity}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="col-span-5 flex flex-col gap-4">
          <div className="card p-4">
            <h3 className="t-subhead mb-3 flex items-center gap-1.5">
              <Zap size={16} className="text-[var(--brand-600)]" /> 快捷操作
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map(q => (
                <Link key={q.code} to={`/page/${q.code.toLowerCase()}`}
                  className="flex items-center gap-2.5 rounded-lg border border-[var(--neutral-200)] hover:border-[var(--brand-400)] hover:bg-[var(--brand-50)]/40 p-3 transition text-[12.5px]">
                  <div className="w-8 h-8 rounded-md bg-[var(--brand-50)] text-[var(--brand-600)] flex items-center justify-center">
                    <q.icon size={15} />
                  </div>
                  <div>
                    <div className="font-medium text-[var(--neutral-800)]">{q.name}</div>
                    <div className="font-mono text-[10px] text-[var(--neutral-400)]">{q.code}</div>
                  </div>
                </Link>
              ))}
              <Link to="/alarm" className="flex items-center gap-2.5 rounded-lg border border-[var(--neutral-200)] hover:border-[var(--status-warn)] hover:bg-amber-50 p-3 transition text-[12.5px]">
                <div className="w-8 h-8 rounded-md bg-amber-50 text-[var(--status-warn)] flex items-center justify-center">
                  <AlertTriangle size={15} />
                </div>
                <div>
                  <div className="font-medium text-[var(--neutral-800)]">处理报警</div>
                  <div className="font-mono text-[10px] text-[var(--neutral-400)]">ALARM</div>
                </div>
              </Link>
              <Link to="/page/d05" className="flex items-center gap-2.5 rounded-lg border border-[var(--neutral-200)] hover:border-[var(--brand-400)] hover:bg-[var(--brand-50)]/40 p-3 transition text-[12.5px]">
                <div className="w-8 h-8 rounded-md bg-[var(--brand-50)] text-[var(--brand-600)] flex items-center justify-center">
                  <TrendingUp size={15} />
                </div>
                <div>
                  <div className="font-medium text-[var(--neutral-800)]">数据分析</div>
                  <div className="font-mono text-[10px] text-[var(--neutral-400)]">D05</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Latest alarms */}
          <div className="card p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="t-subhead flex items-center gap-1.5">
                <Bell size={16} className="text-[var(--status-warn)]" /> 最新报警
              </h3>
              <Link to="/alarm" className="text-[11.5px] text-[var(--brand-600)] hover:underline">全部 →</Link>
            </div>
            <div className="space-y-2">
              {[
                { time: '10:25', level: '重要', msg: '沙石厂 1#鼓风机振动异常', color: 'var(--status-danger)' },
                { time: '09:48', level: '一般', msg: '蓉江新区 3#提升泵切换备用', color: 'var(--status-warn)' },
                { time: '08:32', level: '一般', msg: '金风梅园 加药泵流量偏低', color: 'var(--status-warn)' },
                { time: '昨日',   level: '已处理', msg: '建春站 DO 瞬时低于 1.5mg/L', color: 'var(--status-success)' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-1.5 border-b border-[var(--neutral-100)] last:border-none">
                  <span className="font-mono text-[11px] text-[var(--neutral-400)] w-12 shrink-0 pt-0.5">{a.time}</span>
                  <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium text-white" style={{ background: a.color }}>{a.level}</span>
                  <span className="text-[12.5px] text-[var(--neutral-700)] leading-relaxed">{a.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer / System notices ── */}
      <section className="card p-4">
        <h3 className="t-subhead mb-3 flex items-center gap-1.5"><Leaf size={16} className="text-[var(--brand-600)]" /> 系统公告</h3>
        <div className="grid grid-cols-3 gap-4 text-[12.5px]">
          <div className="flex items-start gap-2 border border-[var(--neutral-200)] rounded-lg p-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-500)] mt-1.5 shrink-0"></span>
            <div>
              <div className="font-medium text-[var(--neutral-800)]">计划停机维护通知</div>
              <div className="text-[11.5px] text-[var(--neutral-500)] mt-0.5">蓉江新区二期 8月20日 00:00-04:00 进行高压柜年检</div>
            </div>
          </div>
          <div className="flex items-start gap-2 border border-[var(--neutral-200)] rounded-lg p-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] mt-1.5 shrink-0"></span>
            <div>
              <div className="font-medium text-[var(--neutral-800)]">报表模板升级</div>
              <div className="text-[11.5px] text-[var(--neutral-500)] mt-0.5">新版日报增加碳减排维度，见 D08 页签</div>
            </div>
          </div>
          <div className="flex items-start gap-2 border border-[var(--neutral-200)] rounded-lg p-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-warn)] mt-1.5 shrink-0"></span>
            <div>
              <div className="font-medium text-[var(--neutral-800)]">设备巡检待办</div>
              <div className="text-[11.5px] text-[var(--neutral-500)] mt-0.5">8月19日 对所有鼓风机轴承温度进行现场复核</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
