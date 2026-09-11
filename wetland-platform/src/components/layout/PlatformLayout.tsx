import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Activity, Bell, Cpu, Home, BarChart3, Settings, Users, FileText,
  LayoutDashboard, Map, AlertTriangle, TrendingUp, FileSpreadsheet,
  ChevronLeft, ChevronRight, ChevronDown, Search, Wifi, WifiOff,
  User, LogOut, Wrench, TreePine, Database, Scale, Droplet, Wind,
} from 'lucide-react';
import { sites, alarms } from '@/data/mockData';

const mainMenus = [
  { code: 'B01', name: '全厂总览', icon: Map, path: '/overview' },
  { code: 'B02', name: '工艺流程', icon: TreePine, children: [
    { code: 'B02', name: '建春湿地公园再生水站' },
    { code: 'B03', name: '金风梅园再生水处理厂' },
    { code: 'B04', name: '沙石污水处理厂一期' },
    { code: 'B05', name: '蓉江新区再生水厂一期' },
    { code: 'B06', name: '水东水质净化厂' },
    { code: 'B07', name: '白塔污泥处理处置二期' },
  ]},
  { code: 'C01', name: '工艺操作', icon: Cpu, children: [
    { code: 'C01', name: '进水泵站及格栅' },
    { code: 'C02', name: '沉砂池' },
    { code: 'C03', name: '生化池(A²/O)' },
    { code: 'C04', name: '鼓风曝气群控' },
    { code: 'C05', name: '二沉池及回流' },
    { code: 'C06', name: '加药系统' },
    { code: 'C07', name: '消毒系统' },
    { code: 'C08', name: '污泥脱水' },
  ]},
  { code: 'D01', name: '报警管理', icon: AlertTriangle, path: '/alarm' },
  { code: 'D03', name: '趋势分析', icon: TrendingUp, path: '/trend' },
  { code: 'D04', name: '报表管理', icon: FileSpreadsheet, path: '/report' },
  { code: 'D05', name: '数据分析', icon: BarChart3, children: [
    { code: 'D05', name: '能耗分析' },
    { code: 'D06', name: '药耗分析' },
    { code: 'D07', name: '水质变化分析' },
    { code: 'D08', name: '碳减排分析' },
  ]},
  { code: 'D09', name: '设备运行', icon: Wrench, path: '/devices' },
  { code: 'E01', name: '业务管理', icon: Database, children: [
    { code: 'E01', name: '站点管理' },
    { code: 'E03', name: '告警管理' },
    { code: 'E05', name: '设备管理' },
    { code: 'E09', name: '视频监控' },
  ]},
  { code: 'A05', name: '系统配置', icon: Settings, children: [
    { code: 'A05', name: '用户管理' },
    { code: 'A06', name: '角色权限' },
    { code: 'A07', name: '操作日志' },
    { code: 'A08', name: '系统配置' },
  ]},
];

export function PlatformLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['B02']);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const loc = useLocation();

  const toggleExpand = (code: string) => {
    setExpandedKeys(prev =>
      prev.includes(code) ? prev.filter(k => k !== code) : [...prev, code]
    );
  };

  const activeAlarms = alarms.filter(a => a.status === '活跃').length;

  const buildBreadcrumb = () => {
    // 根据路由匹配菜单名
    const matchPath = loc.pathname;
    const breadcrumb: string[] = ['首页'];
    mainMenus.forEach(m => {
      if (m.path === matchPath) {
        breadcrumb.push(m.name);
      }
      if (m.children) {
        m.children.forEach(c => {
          if (loc.pathname.includes(c.code.toLowerCase()) || loc.pathname.includes(c.code)) {
            breadcrumb.push(m.name, c.name);
          }
        });
      }
    });
    // 特殊路径处理
    const pathMap: Record<string, string> = {
      '/': '首页工作台',
      '/overview': '全厂总览',
      '/alarm': '报警管理',
      '/trend': '趋势分析',
      '/report': '报表管理',
      '/workbench': '首页工作台',
    };
    if (pathMap[matchPath]) {
      return ['首页', pathMap[matchPath]];
    }
    return breadcrumb;
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* 顶部导航 */}
      <header className="h-[60px] bg-gradient-to-r from-[#155e75] to-[#0891b2] text-white flex items-center px-4 sticky top-0 z-40 shadow-md">
        {/* Logo */}
        <Link to="/workbench" className="flex items-center gap-2 mr-6 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Wind size={20} />
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-bold leading-tight">智慧生态</div>
            <div className="text-xs opacity-80 leading-tight">湿地自然保护区管理平台</div>
          </div>
        </Link>

        {/* 主菜单 */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {mainMenus.slice(0, 7).map(menu => (
            <NavLink
              key={menu.code}
              to={menu.path || '#'}
              className={({ isActive }) =>
                `px-3 py-2 text-sm rounded relative transition-colors flex items-center gap-1.5 ${
                  isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
                }`
              }
            >
              {menu.icon && <menu.icon size={16} />}
              <span>{menu.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* 右侧状态区 */}
        <div className="flex items-center gap-4 ml-auto">
          {/* 报警计数 */}
          <Link
            to="/alarm"
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-white/10 transition-colors"
          >
            <Bell size={17} />
            <span className="text-sm">报警</span>
            {activeAlarms > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center pulse-red">
                {activeAlarms}
              </span>
            )}
          </Link>

          {/* 通信状态 */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <Wifi size={14} />
            <span className="text-xs">已连接</span>
          </div>

          {/* 用户信息 */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/10 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center">
                <User size={14} />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">张工</div>
                <div className="text-[11px] opacity-75">工程师</div>
              </div>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setUserMenuOpen(false)}>
                  <User size={14} /> 个人中心
                </Link>
                <Link to="/logs" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setUserMenuOpen(false)}>
                  <FileText size={14} /> 操作日志
                </Link>
                <div className="border-t my-1"></div>
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 text-sm" onClick={() => setUserMenuOpen(false)}>
                  <LogOut size={14} /> 退出登录
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 侧边菜单 */}
        <aside
          className={`${collapsed ? 'w-[56px]' : 'w-[220px]'} bg-white border-r border-gray-200 transition-all duration-200 flex flex-col shrink-0`}
        >
          <div className="flex-1 overflow-y-auto py-2">
            {!collapsed && (
              <Link to="/workbench" className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 mx-1 rounded">
                <Home size={15} />
                <span>首页工作台</span>
              </Link>
            )}
            {mainMenus.map(menu => {
              const Icon = menu.icon;
              const isExpanded = expandedKeys.includes(menu.code);
              const hasChildren = !!menu.children?.length;
              const isActive = menu.path === loc.pathname ||
                (menu.children?.some(c => loc.pathname.includes(c.code.toLowerCase())));

              return (
                <div key={menu.code}>
                  {hasChildren ? (
                    <button
                      onClick={() => toggleExpand(menu.code)}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm mx-1 rounded transition-colors ${
                        isActive ? 'bg-cyan-50 text-pri-d font-semibold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={15} />
                      {!collapsed && <span className="flex-1 text-left">{menu.name}</span>}
                      {!collapsed && <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                    </button>
                  ) : (
                    <Link
                      to={menu.path || '#'}
                      className={`flex items-center gap-2 px-3 py-2.5 text-sm mx-1 rounded transition-colors ${
                        loc.pathname === menu.path ? 'bg-cyan-50 text-pri-d font-semibold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={15} />
                      {!collapsed && <span>{menu.name}</span>}
                    </Link>
                  )}

                  {hasChildren && isExpanded && !collapsed && (
                    <div className="ml-4 border-l border-gray-200 pl-2">
                      {menu.children!.map(child => (
                        <Link
                          key={child.code}
                          to={`/page/${child.code.toLowerCase()}`}
                          className="block px-3 py-1.5 text-[12.5px] text-gray-600 hover:bg-cyan-50 hover:text-pri-d rounded"
                        >
                          <span className="inline-block w-12 font-mono text-xs text-gray-400">{child.code}</span>
                          <span>{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 折叠按钮 */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="h-10 border-t border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </aside>

        {/* 内容区 */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* 面包屑 */}
          <div className="h-9 bg-white border-b border-gray-200 flex items-center px-4 text-xs text-gray-500 gap-1.5 shrink-0">
            {buildBreadcrumb().map((item, i, arr) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300">/</span>}
                <span className={i === arr.length - 1 ? 'text-gray-800 font-medium' : ''}>{item}</span>
              </span>
            ))}
            <div className="ml-auto flex items-center gap-1 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span>OPC UA 已连接</span>
              <span className="mx-2 text-gray-300">|</span>
              <span>刷新 {new Date().toLocaleTimeString('zh-CN', { hour12: false })}</span>
            </div>
          </div>

          {/* 页面内容 */}
          <div className="flex-1 overflow-auto p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
