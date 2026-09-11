import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertTriangle, Clock, CheckCircle2, Filter, Download, ChevronDown, ArrowRight, ShieldCheck } from 'lucide-react';

type Alarm = {
  id: string;
  time: string;
  level: '紧急' | '重要' | '一般' | '提示';
  site: string;
  device: string;
  message: string;
  value: string;
  status: '活跃' | '已确认' | '已处理';
  handler?: string;
};

const alarms: Alarm[] = [
  { id: 'ALM-20260818-002', time: '2026-08-18 10:25:33', level: '紧急', site: '沙石一期',   device: '1#鼓风机',  message: '振动值超高触发联锁停车',       value: '9.2mm/s > 8.0', status: '活跃' },
  { id: 'ALM-20260818-003', time: '2026-08-18 09:48:22', level: '重要', site: '蓉江新区厂', device: '3#提升泵',  message: '电机电流持续超过额定 115%',    value: '58A > 52A',     status: '活跃' },
  { id: 'ALM-20260818-004', time: '2026-08-18 09:30:00', level: '一般', site: '金风梅园厂', device: '加药泵 B',  message: '出口流量低于设定值 30%',       value: '85L/h < 120',   status: '已确认', handler: '张工' },
  { id: 'ALM-20260818-005', time: '2026-08-18 08:32:15', level: '一般', site: '建春湿地站', device: '二沉池 DO', message: '缺氧区 ORP 持续下降 -420mV',   value: '-420mV',        status: '已确认', handler: '李工' },
  { id: 'ALM-20260818-006', time: '2026-08-18 07:15:00', level: '提示', site: '水东净化厂', device: '进水流量计', message: '通讯瞬时中断（已恢复）',       value: '通讯超时 5s',   status: '已处理', handler: '系统' },
  { id: 'ALM-20260817-011', time: '2026-08-17 22:10:00', level: '重要', site: '白塔污泥厂', device: '带式脱水机', message: '滤带张力传感器异常',           value: '0kN',           status: '已处理', handler: '张工' },
  { id: 'ALM-20260817-009', time: '2026-08-17 18:40:00', level: '一般', site: '蓉江新区厂', device: '主风机',    message: '轴承温度偏高 72℃',             value: '72℃ > 70',      status: '已处理', handler: '王操作' },
  { id: 'ALM-20260817-007', time: '2026-08-17 14:20:00', level: '紧急', site: '沙石一期',   device: '2#回流泵',  message: '变频器过压保护动作',           value: 'DC-BUS 780V',   status: '已处理', handler: '赵管理' },
];

const levelColor = (l: Alarm['level']) => ({
  '紧急':  { bg: 'var(--status-danger)', text: 'white' },
  '重要':  { bg: 'var(--status-warn)',   text: 'white' },
  '一般':  { bg: 'var(--status-info)',   text: 'white' },
  '提示':  { bg: 'var(--brand-400)',     text: 'white' },
})[l];

const statusColor = (s: Alarm['status']) => ({
  '活跃':   'bg-[var(--status-danger)]/15 text-[var(--status-danger)]',
  '已确认': 'bg-amber-50 text-[var(--status-warn)]',
  '已处理': 'bg-[var(--status-success)]/15 text-[var(--status-success)]',
})[s];

export function AlarmManagementPage() {
  const [keyword, setKeyword] = useState('');
  const [level, setLevel] = useState('');
  const [status, setStatus] = useState('');

  const filtered = alarms.filter(a => {
    if (keyword && !(a.device + a.message + a.site).includes(keyword)) return false;
    if (level && a.level !== level) return false;
    if (status && a.status !== status) return false;
    return true;
  });

  const summary = {
    urgent: alarms.filter(a => a.level === '紧急' && a.status !== '已处理').length,
    active: alarms.filter(a => a.status === '活跃').length,
    confirmed: alarms.filter(a => a.status === '已确认').length,
    today: alarms.length,
  };

  return (
    <div className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      {/* ── Stats row ── */}
      <section className="grid grid-cols-4 gap-4">
        {[
          { label: '紧急未处理', val: summary.urgent, color: 'var(--status-danger)', icon: AlertTriangle, bg: '#fff1f0' },
          { label: '活跃报警',   val: summary.active, color: 'var(--status-warn)',    icon: Clock,          bg: '#fff7ed' },
          { label: '已确认待处理', val: summary.confirmed, color: 'var(--brand-500)',    icon: ShieldCheck,    bg: 'var(--brand-50)' },
          { label: '今日总数',   val: summary.today,  color: 'var(--status-info)',    icon: CheckCircle2,   bg: 'var(--brand-50)' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: s.bg, color: s.color }}>
              <s.icon size={20} />
            </div>
            <div>
              <div className="text-[11.5px] text-[var(--neutral-500)]">{s.label}</div>
              <div className="text-[26px] font-bold font-mono tabular-nums leading-none mt-1" style={{ color: 'var(--neutral-900)' }}>{s.val}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Search bar ── */}
      <section className="card p-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-[var(--neutral-50)] border border-[var(--neutral-200)] focus-within:border-[var(--brand-500)] flex-1 max-w-md">
            <Search size={14} className="text-[var(--neutral-400)]" />
            <input value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder="搜索设备、点位、描述..."
              className="bg-transparent outline-none text-[12.5px] flex-1" />
          </div>

          <div className="flex items-center gap-1.5 h-9 px-2 rounded-lg border border-[var(--neutral-200)] text-[12px] text-[var(--neutral-600)]">
            <Filter size={13} /> 级别
            <select value={level} onChange={e => setLevel(e.target.value)} className="bg-transparent outline-none cursor-pointer">
              <option value="">全部</option><option>紧急</option><option>重要</option><option>一般</option><option>提示</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 h-9 px-2 rounded-lg border border-[var(--neutral-200)] text-[12px] text-[var(--neutral-600)]">
            状态
            <select value={status} onChange={e => setStatus(e.target.value)} className="bg-transparent outline-none cursor-pointer">
              <option value="">全部</option><option>活跃</option><option>已确认</option><option>已处理</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 h-9 px-2 rounded-lg border border-[var(--neutral-200)] text-[12px] text-[var(--neutral-600)] cursor-pointer hover:bg-[var(--neutral-50)]">
            近 7 天 <ChevronDown size={12} />
          </div>

          <div className="ml-auto flex gap-2">
            <button className="btn btn-ghost h-9"><Download size={13} /> 导出</button>
            <button className="btn btn-primary h-9">批量确认</button>
          </div>
        </div>
      </section>

      {/* ── Table ── */}
      <section className="card flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: '160px' }}>时间</th>
                <th style={{ width: '64px' }}>级别</th>
                <th style={{ width: '90px' }}>状态</th>
                <th>描述</th>
                <th style={{ width: '110px' }}>子项</th>
                <th style={{ width: '120px' }}>设备/点位</th>
                <th style={{ width: '130px' }}>触发值</th>
                <th style={{ width: '90px' }}>处理人</th>
                <th style={{ width: '80px', textAlign: 'right' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const lc = levelColor(a.level);
                return (
                  <tr key={a.id} className="group">
                    <td className="font-mono text-[12px] text-[var(--neutral-500)]">{a.time}</td>
                    <td>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold" style={{ background: lc.bg, color: lc.text }}>
                        <span className={`w-1 h-1 rounded-full ${a.status === '活跃' ? 'pulse-dot' : ''}`} style={{ background: 'currentColor' }}></span>
                        {a.level}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-medium" style={{ background: getComputedStatusBg(a.status), color: getComputedStatusFg(a.status) }}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <div className="text-[12.5px] font-medium text-[var(--neutral-800)]">{a.message}</div>
                      <div className="font-mono text-[10px] text-[var(--neutral-400)] mt-0.5">{a.id}</div>
                    </td>
                    <td className="text-[12px] text-[var(--neutral-700)]">{a.site}</td>
                    <td className="text-[12px] text-[var(--neutral-700)]">{a.device}</td>
                    <td className="font-mono text-[12px] text-[var(--neutral-800)]">{a.value}</td>
                    <td className="text-[12px] text-[var(--neutral-600)]">{a.handler || '—'}</td>
                    <td className="text-right">
                      <Link to={`/page/d01?id=${a.id}`} className="text-[var(--brand-600)] hover:underline text-[11.5px] inline-flex items-center gap-0.5">
                        处理 <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-[var(--neutral-400)]">
              <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
              <div>没有匹配的报警记录</div>
            </div>
          )}
        </div>
        {/* Pagination */}
        <div className="border-t border-[var(--neutral-200)] px-4 py-2.5 flex items-center justify-between text-[11.5px]">
          <span className="text-[var(--neutral-500)]">共 {filtered.length} 条 · 当前筛选条件下显示全部</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 h-7 rounded border border-[var(--neutral-200)] hover:bg-[var(--neutral-50)]">‹</button>
            <button className="px-3 h-7 rounded bg-[var(--brand-500)] text-white">1</button>
            <button className="px-2.5 h-7 rounded border border-[var(--neutral-200)] hover:bg-[var(--neutral-50)]">2</button>
            <button className="px-2.5 h-7 rounded border border-[var(--neutral-200)] hover:bg-[var(--neutral-50)]">›</button>
            <span className="ml-3 text-[var(--neutral-500)]">每页 20 条</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function getComputedStatusBg(s: Alarm['status']) {
  switch (s) {
    case '活跃':   return 'rgb(239 68 68 / 0.12)';
    case '已确认': return 'rgb(234 88 12 / 0.12)';
    default:       return 'rgb(22 163 74 / 0.12)';
  }
}
function getComputedStatusFg(s: Alarm['status']) {
  switch (s) {
    case '活跃':   return 'rgb(220 38 38)';
    case '已确认': return 'rgb(217 119 6)';
    default:       return 'rgb(22 163 74)';
  }
}
