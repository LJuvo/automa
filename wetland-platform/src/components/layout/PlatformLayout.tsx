import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Bell, Cpu, Home, BarChart3, Settings, Map, AlertTriangle, TrendingUp, FileSpreadsheet, CalendarDays,
  ChevronDown, Wifi, User, LogOut, Wrench, Database, Wind, ChevronRight, ChevronLeft, ClipboardList,
  FileText, Cog, ShieldCheck, HardDrive, Timer, GitBranch
} from 'lucide-react';
import { alarms } from '@/data/mockData';

/* ═══════════════════════════════════════════════════════════════════
 *  工业 SCADA 标准信息架构 — 6 大业务域
 *
 *  1. 📊 总览
 *  2. 🏭 生产工艺（6 个子项 × 8 个单元 HMI）
 *  3. 🔔 报警事件
 *  4. 📈 数据分析
 *  5. 📋 调度运行（排班 / 操作票 / SOP）  ← 新增
 *  6. ⚙️ 设备运维（台账 / 维护 / 工单 / 巡检） ← 新增
 *  7. 👥 系统管理
 * ═══════════════════════════════════════════════════════════════════ */

/* 6 个子项 — 赣州中心城区真实布局 */
const SITES = [
  { id: 'B02', name: '建春污水处理厂一期', zone: '章贡区', capacity: '2.0万 m³/d' },
  { id: 'B03', name: '金风梅园污水处理厂', zone: '蓉江新区', capacity: '3.0万 m³/d' },
  { id: 'B04', name: '沙石污水处理厂',   zone: '章贡区', capacity: '2.0万 m³/d' },
  { id: 'B05', name: '蓉江新区污水处理厂二期', zone: '蓉江新区', capacity: '4.0万 m³/d' },
  { id: 'B06', name: '水东再生水厂',       zone: '赣县区', capacity: '2.5万 m³/d' },
  { id: 'B07', name: '白塔污泥处理处置中心', zone: '章贡区', capacity: '100 吨/d' },
];

/* 8 个工艺单元（每个子项通用）*/
const UNITS = [
  { id: 'C01', name: '进水泵站及格栅' },
  { id: 'C02', name: '沉砂池' },
  { id: 'C03', name: '生化池 (A²/O)' },
  { id: 'C04', name: '鼓风曝气群控' },
  { id: 'C05', name: '二沉池及回流' },
  { id: 'C06', name: '加药系统' },
  { id: 'C07', name: '消毒系统' },
  { id: 'C08', name: '污泥脱水' },
];

/* 顶栏一级 nav（7 个工业域） */
const topNav = [
  { key: 'overview',  name: '总览',   icon: Map,           href: '/overview' },
  { key: 'process',   name: '工艺',   icon: Cpu,           href: '/page/b02' },
  { key: 'alarm',     name: '报警',   icon: AlertTriangle, href: '/alarm' },
  { key: 'analysis',  name: '分析',   icon: BarChart3,     href: '/page/d05' },
  { key: 'schedule',  name: '调度',   icon: CalendarDays,  href: '/schedule' },
  { key: 'maintenance', name: '运维', icon: Wrench,        href: '/assets' },
  { key: 'config',    name: '配置',   icon: Settings,      href: '/config' },
];

/* 侧边栏完整菜单 — 按业务域分组 */
type MenuItem = { id: string; name: string; path?: string; code?: string };
type MenuGroup = { key: string; title: string; icon: React.ComponentType<{ size?: number }>; items: MenuItem[]; children?: { parent: string; grand: { id: string; name: string }[] } };

const sideGroups: MenuGroup[] = [
  {
    key: 'process', title: '🏭 生产工艺', icon: Cpu,
    items: [], /* 用 children 渲染 6 个子项 → 8 单元 */
    children: { parent: 'sites', grand: SITES.map(s => ({ id: s.id.toLowerCase(), name: s.name })) }
  },
  {
    key: 'alarm', title: '🔔 报警事件', icon: AlertTriangle,
    items: [
      { id: 'alarm-list',   name: '报警管理',   path: '/alarm' },
      { id: 'alarm-history', name: '历史事件追溯', path: '/page/d02' },
      { id: 'alarm-root',   name: '根因分析',   path: '/page/d02' },
    ],
  },
  {
    key: 'analysis', title: '📈 数据分析', icon: BarChart3,
    items: [
      { id: 'trend',  name: '趋势分析',   path: '/trend' },
      { id: 'd05',    name: '能耗分析',   code: 'd05' },
      { id: 'd06',    name: '药耗分析',   code: 'd06' },
      { id: 'd07',    name: '水质变化',   code: 'd07' },
      { id: 'd08',    name: '碳减排分析', code: 'd08' },
    ],
  },
  {
    key: 'schedule', title: '📋 调度运行', icon: CalendarDays,
    items: [
      { id: 'shift',  name: '值班排班',   path: '/schedule' },
      { id: 'ticket', name: '操作票管理', path: '/schedule' },
      { id: 'log',    name: '运行日志',   path: '/logs' },
      { id: 'sop',    name: 'SOP/作业指导', path: '/report' },
    ],
  },
  {
    key: 'maintenance', title: '⚙️ 设备运维', icon: Wrench,
    items: [
      { id: 'assets',   name: '设备台账',   path: '/assets' },
      { id: 'prevent',  name: '预防性维护', path: '/assets' },
      { id: 'workorder', name: '工单管理',  path: '/assets' },
      { id: 'spare',    name: '备件管理',   path: '/assets' },
      { id: 'inspect',  name: '巡检',       path: '/assets' },
    ],
  },
  {
    key: 'business', title: '📦 基础数据', icon: Database,
    items: [
      { id: 'e01', name: '站点管理',   code: 'e01' },
      { id: 'e05', name: '设备管理',   code: 'e05' },
      { id: 'e09', name: '视频监控',   code: 'e09' },
      { id: 'e11', name: '监测点台账', code: 'e11' },
    ],
  },
  {
    key: 'config', title: '👥 系统管理', icon: Settings,
    items: [
      { id: 'users',  name: '用户管理',   path: '/users' },
      { id: 'roles',  name: '角色权限',   path: '/roles' },
      { id: 'audit',  name: '操作审计',   path: '/logs' },
      { id: 'params', name: '系统参数',   path: '/config' },
    ],
  },
];

export function PlatformLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(['sites']);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const loc = useLocation();
  const activeAlarms = alarms.filter(a => a.status === '活跃').length;

  const toggle = (k: string) => setExpanded(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);

  /* 顶栏一级域激活判定 */
  const activeTop = topNav.find(t => {
    if (t.href === loc.pathname) return true;
    if (t.href === '/page/b02' && loc.pathname.startsWith('/page/b0')) return true;
    if (t.href === '/page/d05' && loc.pathname.startsWith('/page/d0')) return true;
    if (t.key === 'alarm' && loc.pathname.startsWith('/alarm')) return true;
    if (t.key === 'schedule' && loc.pathname.startsWith('/schedule')) return true;
    if (t.key === 'maintenance' && loc.pathname.startsWith('/assets')) return true;
    if (t.key === 'config' && ['/users','/roles','/config'].includes(loc.pathname)) return true;
    return false;
  })?.key || 'overview';

  const buildBreadcrumb = () => {
    const pathMap: Record<string, string> = {
      '/workbench': '首页工作台', '/overview': '全厂总览',
      '/alarm': '报警管理', '/trend': '趋势分析', '/report': '报表',
      '/profile': '个人中心', '/logs': '操作日志',
      '/users': '用户管理', '/roles': '角色权限', '/config': '系统参数',
      '/assets': '设备台账', '/schedule': '调度运行',
    };
    const parts = ['首页'];
    if (pathMap[loc.pathname]) parts.push(pathMap[loc.pathname]);
    const m = loc.pathname.match(/\/page\/([a-z](\d+))/i);
    if (m) {
      const code = m[1].toUpperCase();
      // 子项 → 工艺单元
      const site = SITES.find(s => s.id === code);
      const unit = UNITS.find(u => u.id === code);
      if (site) { parts.push('生产工艺', site.name); }
      else if (unit) { parts.push('生产工艺', '工艺单元', unit.name); }
      else { parts.push('业务管理'); }
    }
    return parts;
  };

  return (
    <div className="h-full flex flex-col bg-[var(--neutral-50)]">

      {/* ════ TOP BAR — 48px, brand + 7 个工业域一级 nav + 状态区 ════ */}
      <header className="h-12 shrink-0 flex items-center px-4 gap-3 text-white"
        style={{ background: 'linear-gradient(90deg, var(--brand-900), var(--brand-700) 60%, var(--brand-600))' }}>

        {/* Logo */}
        <Link to="/workbench" className="flex items-center gap-2 mr-3 shrink-0">
          <div className="w-8 h-8 rounded-md bg-white/15 backdrop-blur flex items-center justify-center border border-white/15">
            <Wind size={16} />
          </div>
          <div className="leading-tight hidden md:block">
            <div className="text-[13px] font-semibold tracking-tight">赣州污水智慧运营</div>
            <div className="text-[10px] opacity-65 -mt-0.5">Wastewater · Smart O&amp;M v3.2</div>
          </div>
        </Link>

        {/* 一级 nav */}
        <nav className="flex items-center gap-0.5 flex-1 ml-2 overflow-x-auto">
          {topNav.map(t => (
            <Link key={t.key} to={t.href}
              className={`px-3 h-8 rounded-md flex items-center gap-1.5 text-[13px] transition shrink-0
                ${activeTop === t.key
                  ? 'bg-white/18 text-white font-semibold'
                  : 'text-white/75 hover:text-white hover:bg-white/10'}`}>
              <t.icon size={14} /> {t.name}
            </Link>
          ))}
        </nav>

        {/* 状态区 */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/alarm" className="relative flex items-center gap-1.5 px-2.5 h-8 rounded-md hover:bg-white/10 text-white/90">
            <Bell size={15} />
            {activeAlarms > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[var(--status-danger)] text-white text-[10px] font-bold flex items-center justify-center pulse-red">
                {activeAlarms}
              </span>
            )}
          </Link>
          <div className="flex items-center gap-1.5 px-2 h-7 rounded-md bg-white/10 text-[11px] text-white/85">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] pulse-dot"></span>
            <Wifi size={12} /> OPC UA
          </div>
          <div className="relative">
            <button onClick={() => setUserMenuOpen(o => !o)}
              className="flex items-center gap-2 pl-2 pr-1 h-8 rounded-md hover:bg-white/10">
              <div className="w-7 h-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-[12px] font-semibold">张</div>
              <div className="hidden md:block text-left">
                <div className="text-[12px] font-medium leading-tight">张工</div>
                <div className="text-[10px] text-white/60 leading-tight">工程师 · L3</div>
              </div>
              <ChevronDown size={13} className="opacity-60" />
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-44 bg-[var(--surface-2)] rounded-lg shadow-[var(--shadow-lg)] border border-[var(--neutral-200)] py-1 z-50 text-[13px] text-[var(--neutral-700)]">
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--neutral-50)]"><User size={14} /> 个人中心</Link>
                  <Link to="/logs" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--neutral-50)]"><ShieldCheck size={14} /> 操作审计</Link>
                  <div className="border-t border-[var(--neutral-100)] my-1" />
                  <Link to="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-[var(--status-danger)]"><LogOut size={14} /> 退出登录</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">

        {/* ════ SIDEBAR — 按业务域分组，sub-group 可展开 ════ */}
        <aside className={`${collapsed ? 'w-14' : 'w-[252px]'} shrink-0 bg-[var(--surface-2)] border-r border-[var(--neutral-200)] transition-[width] duration-200 flex flex-col`}>
          <nav className="flex-1 overflow-y-auto py-2">

            {/* 首页 */}
            <Link to="/workbench"
              className={`mx-2 flex items-center gap-2.5 px-2.5 h-9 rounded-md text-[13px] transition
                ${loc.pathname === '/workbench'
                  ? 'bg-[var(--brand-50)] text-[var(--brand-700)] font-medium'
                  : 'text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]'}`}>
              <Home size={15} /> {!collapsed && <span>首页工作台</span>}
            </Link>

            {/* 总览（独立域入口）*/}
            <Link to="/overview"
              className={`mx-2 flex items-center gap-2.5 px-2.5 h-9 rounded-md text-[13px] transition
                ${loc.pathname === '/overview'
                  ? 'bg-[var(--brand-50)] text-[var(--brand-700)] font-medium'
                  : 'text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]'}`}>
              <Map size={15} /> {!collapsed && <span>📊 全厂总览</span>}
            </Link>

            {sideGroups.map(group => {
              const Icon = group.icon;
              const isActive = group.items.some(i => (i.path && loc.pathname === i.path) || (i.code && loc.pathname.includes(i.code)));
              const parentExpanded = expanded.includes(group.children?.parent || '');

              return (
                <div key={group.key} className="mt-2">
                  {/* Group label */}
                  <button
                    onClick={() => group.children ? toggle(group.children.parent) : toggle(group.key)}
                    className={`mx-2 w-[calc(100%-16px)] flex items-center gap-2 px-2.5 h-7 text-[11px] font-semibold uppercase tracking-wider text-[var(--neutral-400)] hover:text-[var(--neutral-600)]`}>
                    <Icon size={12} />
                    {!collapsed && <span className="flex-1 text-left">{group.title.replace(/^[^\s]+\s/, '')}</span>}
                    {!collapsed && <ChevronDown size={11} className={`transition-transform ${parentExpanded ? 'rotate-180' : ''}`} />}
                  </button>

                  {/* Group items (flat) */}
                  {!group.children && (
                    <div className="space-y-0.5 mx-1">
                      {group.items.map(item => (
                        <Link key={item.id}
                          to={item.path || `/page/${item.code}`}
                          className={`mx-1 flex items-center gap-2 px-2.5 h-8 rounded-md text-[12.5px] transition
                            ${(item.path && loc.pathname === item.path) || (item.code && loc.pathname.includes(item.code))
                              ? 'bg-[var(--brand-50)] text-[var(--brand-700)] font-medium'
                              : 'text-[var(--neutral-600)] hover:text-[var(--neutral-800)] hover:bg-[var(--neutral-50)]'}`}>
                          {item.path && item.path.startsWith('/page/') && <span className="font-mono text-[10px] text-[var(--neutral-400)] w-8">{item.code}</span>}
                          {!item.path && <span className="font-mono text-[10px] text-[var(--neutral-400)] w-8">{item.code}</span>}
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Sub-group: 子项 → 单元 (process group) */}
                  {group.children && parentExpanded && !collapsed && (
                    <div className="mx-2 my-0.5">
                      {/* Parent: 子项列表 */}
                      {group.children.grand.map(site => {
                        const siteCode = site.id.toUpperCase();
                        const siteActive = loc.pathname.includes(site.id);
                        return (
                          <div key={site.id} className="mb-1">
                            <div className={`flex items-center gap-2 px-2 h-7 rounded-md text-[12px] font-medium cursor-pointer select-none
                              ${siteActive ? 'text-[var(--brand-700)]' : 'text-[var(--neutral-700)] hover:text-[var(--neutral-800)]'}`}
                              onClick={() => toggle('unit-' + site.id)}>
                              <ChevronDown size={11} className={`transition-transform ${expanded.includes('unit-' + site.id) ? 'rotate-180' : ''}`} />
                              <span className="font-mono text-[10px] text-[var(--neutral-400)] w-8">{siteCode}</span>
                              <Link to={`/page/${site.id}`} className="flex-1 truncate" onClick={e => e.stopPropagation()}>{site.name}</Link>
                              <Link to={`/page/${site.id}`} className="text-[10px] text-[var(--brand-500)]" onClick={e => e.stopPropagation()} title="PFD">PFD</Link>
                            </div>
                            {expanded.includes('unit-' + site.id) && (
                              <div className="ml-6 space-y-0.5 border-l border-[var(--neutral-200)] pl-2 mt-0.5">
                                {UNITS.map(u => (
                                  <Link key={u.id} to={`/page/${u.id.toLowerCase()}`}
                                    className={`flex items-center gap-2 px-2 h-6 rounded-md text-[11.5px] transition
                                      ${loc.pathname.includes(u.id.toLowerCase())
                                        ? 'bg-[var(--brand-50)] text-[var(--brand-700)] font-medium'
                                        : 'text-[var(--neutral-500)] hover:text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]'}`}>
                                    <span className="font-mono text-[10px] text-[var(--neutral-400)] w-8">{u.id}</span>
                                    <span>{u.name}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Collapse */}
          <button onClick={() => setCollapsed(c => !c)}
            className="h-9 border-t border-[var(--neutral-100)] flex items-center justify-center text-[var(--neutral-500)] hover:bg-[var(--neutral-50)]">
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </aside>

        {/* ════ MAIN ════ */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Breadcrumb + live status */}
          <div className="h-8 shrink-0 border-b border-[var(--neutral-200)] bg-[var(--surface-2)] flex items-center px-4 text-[11.5px] text-[var(--neutral-500)]">
            {buildBreadcrumb().map((item, i, arr) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-[var(--neutral-300)]">/</span>}
                <span className={i === arr.length - 1 ? 'text-[var(--neutral-800)] font-medium' : ''}>{item}</span>
              </span>
            ))}
            <div className="ml-auto flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] pulse-dot"></span> OPC UA 已连接</span>
              <span className="flex items-center gap-1"><GitBranch size={11} /> 主控制器 127.0.0.1:4840</span>
              <span className="font-mono text-[var(--neutral-400)]">{new Date().toLocaleTimeString('zh-CN', { hour12: false })}</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
