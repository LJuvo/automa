import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Bell, Cpu, Home, BarChart3, Settings, Map, AlertTriangle, TrendingUp, FileSpreadsheet,
  ChevronDown, Wifi, User, LogOut, Wrench, TreePine, Database, Wind, ChevronRight, ChevronLeft,
} from 'lucide-react';
import { sites, alarms } from '@/data/mockData';

/* ── Sidebar nav data ── */
const mainMenus = [
  { code: 'overview', name: '全厂总览', icon: Map, path: '/overview' },
  { code: 'process', name: '工艺流程', icon: TreePine, children: [
    { code: 'B02', name: '建春湿地站' },
    { code: 'B03', name: '金风梅园厂' },
    { code: 'B04', name: '沙石一期' },
    { code: 'B05', name: '蓉江新区厂' },
    { code: 'B06', name: '水东净化厂' },
    { code: 'B07', name: '白塔污泥厂' },
  ]},
  { code: 'operation', name: '工艺操作', icon: Cpu, children: [
    { code: 'C01', name: '进水泵站' },
    { code: 'C02', name: '沉砂池' },
    { code: 'C03', name: '生化池 A²/O' },
    { code: 'C04', name: '鼓风曝气' },
    { code: 'C05', name: '二沉回流' },
    { code: 'C06', name: '加药系统' },
    { code: 'C07', name: '消毒系统' },
    { code: 'C08', name: '污泥脱水' },
  ]},
  { code: 'alarm', name: '报警管理', icon: AlertTriangle, path: '/alarm' },
  { code: 'trend', name: '趋势分析', icon: TrendingUp, path: '/trend' },
  { code: 'analysis', name: '数据分析', icon: BarChart3, children: [
    { code: 'D05', name: '能耗分析' },
    { code: 'D06', name: '药耗分析' },
    { code: 'D07', name: '水质变化' },
    { code: 'D08', name: '碳减排分析' },
    { code: 'D09', name: '设备运行' },
  ]},
  { code: 'business', name: '业务管理', icon: Database, children: [
    { code: 'E01', name: '站点管理' },
    { code: 'E03', name: '告警管理' },
    { code: 'E05', name: '设备管理' },
    { code: 'E09', name: '视频监控' },
    { code: 'E11', name: '监测点' },
  ]},
  { code: 'config', name: '系统配置', icon: Settings, children: [
    { code: 'A05', name: '用户管理' },
    { code: 'A06', name: '角色权限' },
    { code: 'A07', name: '操作日志' },
    { code: 'A08', name: '系统参数' },
  ]},
];

/* Top-level nav (shown horizontally in header) */
const topLevel = [
  { key: 'overview', name: '总览', icon: Map, href: '/overview' },
  { key: 'process', name: '工艺', icon: TreePine, href: '/page/b02' },
  { key: 'operation', name: '操作', icon: Cpu, href: '/page/c03' },
  { key: 'alarm', name: '报警', icon: AlertTriangle, href: '/alarm' },
  { key: 'analysis', name: '分析', icon: BarChart3, href: '/page/d05' },
  { key: 'business', name: '业务', icon: Database, href: '/page/e01' },
  { key: 'config', name: '配置', icon: Settings, href: '/config' },
];

export function PlatformLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(['process']);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const loc = useLocation();

  const toggle = (k: string) => setExpanded(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  const activeAlarms = alarms.filter(a => a.status === '活跃').length;

  /* Which top-level tab is active? */
  const activeTop = topLevel.find(t =>
    loc.pathname.startsWith(t.href) ||
    mainMenus.find(m => m.code === t.key)?.children?.some(c => loc.pathname.includes(c.code.toLowerCase())) ||
    (t.href === '/overview' && loc.pathname === '/overview') ||
    (t.href === '/alarm' && loc.pathname === '/alarm')
  )?.key || 'overview';

  const buildBreadcrumb = () => {
    const pathMap: Record<string, string> = {
      '/workbench': '首页工作台', '/overview': '全厂总览', '/alarm': '报警管理',
      '/trend': '趋势分析', '/report': '报表管理', '/profile': '个人中心', '/logs': '操作日志',
      '/users': '用户管理', '/roles': '角色权限', '/config': '系统配置',
    };
    const parts = ['首页'];
    if (pathMap[loc.pathname]) parts.push(pathMap[loc.pathname]);
    const m = loc.pathname.match(/\/page\/([a-z]\d+)/i);
    if (m) {
      const code = m[1].toUpperCase();
      mainMenus.forEach(menu => {
        const hit = menu.children?.find(c => c.code === code);
        if (hit) { parts.push(menu.name, hit.name); }
      });
    }
    return parts;
  };

  return (
    <div className="h-full flex flex-col bg-[var(--neutral-50)]">
      {/* ─── Top Bar — 48px, calm, brand-aware ─── */}
      <header className="h-12 shrink-0 flex items-center px-4 gap-3 bg-[var(--brand-700)] text-white relative z-40">
        {/* Logo */}
        <Link to="/workbench" className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center backdrop-blur">
            <Wind size={16} />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-tight">湿地智慧生态</div>
            <div className="text-[10px] opacity-60 -mt-0.5">Wetland Reserve · Smart Ops</div>
          </div>
        </Link>

        {/* Main horizontal nav */}
        <nav className="flex items-center gap-1 flex-1 ml-4">
          {topLevel.map(t => (
            <Link key={t.key} to={t.href}
              className={`px-3 h-8 rounded-md flex items-center gap-1.5 text-[13px] font-medium transition
                ${activeTop === t.key
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              <t.icon size={14} /> {t.name}
            </Link>
          ))}
        </nav>

        {/* Status / Tools */}
        <div className="flex items-center gap-3">
          {/* Alarm */}
          <Link to="/alarm" className="relative flex items-center gap-1.5 px-2.5 h-8 rounded-md hover:bg-white/10 text-white/90">
            <Bell size={15} />
            {activeAlarms > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[var(--status-danger)] text-white text-[10px] font-bold flex items-center justify-center shadow-sm pulse-red">
                {activeAlarms}
              </span>
            )}
          </Link>

          {/* Connection */}
          <div className="flex items-center gap-1.5 px-2 h-7 rounded-md bg-white/10 text-[11px] text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] pulse-dot"></span>
            <Wifi size={12} /> OPC UA
          </div>

          {/* User */}
          <div className="relative">
            <button onClick={() => setUserMenuOpen(o => !o)}
              className="flex items-center gap-2 pl-2 pr-1 h-8 rounded-md hover:bg-white/10">
              <div className="w-7 h-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-[12px] font-semibold">
                张
              </div>
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
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--neutral-50)]">
                    <User size={14} /> 个人中心
                  </Link>
                  <Link to="/logs" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--neutral-50)]">
                    <ChevronRight size={14} /> 操作日志
                  </Link>
                  <div className="border-t border-[var(--neutral-100)] my-1" />
                  <Link to="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-[var(--status-danger)]">
                    <LogOut size={14} /> 退出登录
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* ─── Sidebar — calmer, less dense ─── */}
        <aside className={`${collapsed ? 'w-14' : 'w-56'} shrink-0 bg-[var(--surface-2)] border-r border-[var(--neutral-200)] transition-[width] duration-200 flex flex-col`}>
          <nav className="flex-1 overflow-y-auto py-2">
            <Link to="/workbench"
              className={`mx-2 flex items-center gap-2.5 px-2.5 h-9 rounded-md text-[13px] transition
                ${loc.pathname === '/workbench'
                  ? 'bg-[var(--brand-50)] text-[var(--brand-700)] font-medium'
                  : 'text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]'}`}>
              <Home size={15} />
              {!collapsed && <span>首页工作台</span>}
            </Link>

            {mainMenus.map(menu => {
              const Icon = menu.icon;
              const hasChildren = !!menu.children?.length;
              const isExp = expanded.includes(menu.code);
              const isActive = menu.path === loc.pathname ||
                menu.children?.some(c => loc.pathname.toLowerCase().includes(c.code.toLowerCase()));

              return (
                <div key={menu.code} className="mt-0.5">
                  {hasChildren ? (
                    <button onClick={() => toggle(menu.code)}
                      className={`mx-2 w-[calc(100%-16px)] flex items-center gap-2.5 px-2.5 h-9 rounded-md text-[13px] transition
                        ${isActive ? 'bg-[var(--brand-50)] text-[var(--brand-700)] font-medium' : 'text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]'}`}>
                      <Icon size={15} />
                      {!collapsed && <>
                        <span className="flex-1 text-left">{menu.name}</span>
                        <ChevronDown size={13} className={`transition-transform ${isExp ? 'rotate-180' : ''}`} />
                      </>}
                    </button>
                  ) : (
                    <Link to={menu.path || '#'}
                      className={`mx-2 flex items-center gap-2.5 px-2.5 h-9 rounded-md text-[13px] transition
                        ${loc.pathname === menu.path ? 'bg-[var(--brand-50)] text-[var(--brand-700)] font-medium' : 'text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]'}`}>
                      <Icon size={15} />
                      {!collapsed && <span>{menu.name}</span>}
                    </Link>
                  )}

                  {hasChildren && isExp && !collapsed && (
                    <div className="ml-3 border-l border-[var(--neutral-200)] pl-2 my-0.5">
                      {menu.children!.map(child => (
                        <Link key={child.code}
                          to={`/page/${child.code.toLowerCase()}`}
                          className={`group flex items-center gap-2 px-2.5 h-7 rounded-md text-[12.5px] transition
                            ${loc.pathname.toLowerCase().includes(child.code.toLowerCase())
                              ? 'text-[var(--brand-600)] font-medium bg-[var(--brand-50)]'
                              : 'text-[var(--neutral-600)] hover:text-[var(--neutral-800)] hover:bg-[var(--neutral-50)]'}`}>
                          <span className="font-mono text-[10px] text-[var(--neutral-400)] group-hover:text-[var(--neutral-500)] w-8">{child.code}</span>
                          <span>{child.name}</span>
                        </Link>
                      ))}
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

        {/* ─── Main content ─── */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Breadcrumb — thin, quiet, contextual */}
          <div className="h-8 shrink-0 border-b border-[var(--neutral-200)] bg-[var(--surface-2)] flex items-center px-4 text-[11.5px] text-[var(--neutral-500)]">
            {buildBreadcrumb().map((item, i, arr) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-[var(--neutral-300)]">/</span>}
                <span className={i === arr.length - 1 ? 'text-[var(--neutral-800)] font-medium' : ''}>{item}</span>
              </span>
            ))}
            <div className="ml-auto flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] pulse-dot"></span>
                OPC UA 已连接
              </span>
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
