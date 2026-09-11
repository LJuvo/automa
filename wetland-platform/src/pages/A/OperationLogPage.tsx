import { useState } from 'react';
import { Search, Download, ChevronDown } from 'lucide-react';

const logs = Array.from({ length: 30 }, (_, i) => ({
  time: `2026-08-${18 - Math.floor(i / 3)} ${String(10 - i % 10).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00`,
  user: ['张工', '李工', '赵管理', '王操作', '系统'][i % 5],
  role: ['工程师', '工程师', '管理员', '操作员', '系统'][i % 5],
  action: ['参数修改', '设备启停', '报警确认', '登录', '报表生成', '角色变更'][i % 6],
  target: ['沙石厂-生化池 DO', '蓉江新区 4#泵', 'ALM-2026-002', '系统登录', '日报-8月18日', '工程师-王操作'][i % 6],
  before: ['2.0', '停止', '活跃', '—', '—', '操作员'][i % 6],
  after: ['2.2', '运行', '已确认', '成功', '已生成', '工程师'][i % 6],
  ip: `10.30.177.${50 + i}`,
  result: i % 11 === 0 ? '失败' : '成功',
}));

export function OperationLogPage() {
  const [action, setAction] = useState('全部');
  return (
    <div className="h-full flex flex-col gap-3">
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-md w-64">
            <Search size={13} className="text-gray-400" />
            <input placeholder="搜索操作内容 / 对象" className="outline-none text-xs flex-1 bg-transparent" />
          </div>
          <select className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none">
            <option>近7天</option><option>近30天</option><option>自定义</option>
          </select>
          <select value={action} onChange={e => setAction(e.target.value)} className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none">
            <option>全部</option><option>参数修改</option><option>设备启停</option><option>报警确认</option><option>登录</option><option>角色变更</option>
          </select>
          <select className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none">
            <option>全部用户</option>
          </select>
          <div className="ml-auto flex gap-2">
            <button className="px-3 py-1.5 text-xs rounded bg-pri text-white hover:bg-pri-d">查询</button>
            <button className="px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1">
              <Download size={11} /> 导出
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-gray-500">
                <th className="text-left px-3 py-2 font-medium">时间</th>
                <th className="text-left px-3 py-2 font-medium">操作人</th>
                <th className="text-left px-3 py-2 font-medium">角色</th>
                <th className="text-left px-3 py-2 font-medium">操作类型</th>
                <th className="text-left px-3 py-2 font-medium">操作对象</th>
                <th className="text-center px-3 py-2 font-medium">操作前</th>
                <th className="text-center px-3 py-2 font-medium">操作后</th>
                <th className="text-center px-3 py-2 font-medium">IP</th>
                <th className="text-center px-3 py-2 font-medium">结果</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((l, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-mono text-gray-500">{l.time}</td>
                  <td className="px-3 py-2 text-gray-800 font-medium">{l.user}</td>
                  <td className="px-3 py-2 text-gray-500">{l.role}</td>
                  <td className="px-3 py-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600">{l.action}</span>
                  </td>
                  <td className="px-3 py-2 text-gray-700">{l.target}</td>
                  <td className="px-3 py-2 text-center font-mono text-gray-500">{l.before}</td>
                  <td className="px-3 py-2 text-center font-mono text-pri font-semibold">{l.after}</td>
                  <td className="px-3 py-2 text-center font-mono text-gray-400">{l.ip}</td>
                  <td className={`px-3 py-2 text-center ${l.result === '成功' ? 'text-green-600' : 'text-red-600'}`}>{l.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 bg-white px-4 py-2 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
          <span>全量审计留痕 · 保留 ≥ 1 年 · 共 {logs.length} 条</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">‹</button>
            <button className="px-3 py-1 rounded bg-pri text-white">1</button>
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
          </div>
        </div>
      </div>
    </div>
  );
}
