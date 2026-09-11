import { useState } from 'react';
import { Search, Plus, Download, Upload, Trash2, Edit, Eye, CheckCircle, XCircle } from 'lucide-react';
import { users } from '@/data/mockData';

const roleColors: Record<string, string> = {
  '管理员': 'bg-purple-100 text-purple-700',
  '工程师': 'bg-blue-100 text-blue-700',
  '操作员': 'bg-amber-100 text-amber-700',
  '浏览者': 'bg-gray-100 text-gray-600',
};

export function UserManagementPage() {
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('全部');
  const [status, setStatus] = useState('全部');
  const [selected, setSelected] = useState<string[]>([]);

  const filteredUsers = users.filter(u => {
    if (keyword && !(u.name.includes(keyword) || u.username.includes(keyword))) return false;
    if (role !== '全部' && u.role !== role) return false;
    if (status !== '全部' && u.status !== status) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const toggleAll = () => {
    if (selected.length === filteredUsers.length) setSelected([]);
    else setSelected(filteredUsers.map(u => u.id));
  };

  return (
    <div className="h-full flex flex-col gap-3">
      {/* 搜索区 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-2 border border-gray-200 rounded-md w-64">
            <Search size={14} className="text-gray-400" />
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="搜索姓名 / 账号"
              className="outline-none text-sm flex-1 bg-transparent"
            />
          </div>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="text-sm border border-gray-200 rounded-md px-3 py-2 outline-none hover:border-pri"
          >
            <option>全部</option>
            <option>管理员</option>
            <option>工程师</option>
            <option>操作员</option>
            <option>浏览者</option>
          </select>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-md px-3 py-2 outline-none hover:border-pri"
          >
            <option>全部</option>
            <option>启用</option>
            <option>禁用</option>
          </select>
          <button className="px-4 py-2 text-sm rounded bg-pri text-white hover:bg-pri-d">查询</button>
          <button className="px-4 py-2 text-sm rounded border border-gray-200 hover:bg-gray-50 text-gray-600">重置</button>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-2.5 flex items-center gap-2">
        <button className="px-3 py-1.5 text-xs rounded bg-pri text-white hover:bg-pri-d flex items-center gap-1">
          <Plus size={12} /> 新增用户
        </button>
        <button className="px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1 disabled:opacity-50" disabled={selected.length === 0}>
          <CheckCircle size={12} /> 批量启用
        </button>
        <button className="px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1 disabled:opacity-50" disabled={selected.length === 0}>
          <XCircle size={12} /> 批量禁用
        </button>
        <div className="w-px h-5 bg-gray-200 mx-1"></div>
        <button className="px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1">
          <Upload size={12} /> 导入
        </button>
        <button className="px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1">
          <Download size={12} /> 导出
        </button>
        {selected.length > 0 && (
          <span className="ml-auto text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">已选择 {selected.length} 项</span>
        )}
      </div>

      {/* 表格 */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-gray-500">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="text-left px-4 py-3 font-medium">用户名</th>
                <th className="text-left px-4 py-3 font-medium">姓名</th>
                <th className="text-left px-4 py-3 font-medium">所属组织</th>
                <th className="text-center px-4 py-3 font-medium">角色</th>
                <th className="text-left px-4 py-3 font-medium">手机</th>
                <th className="text-center px-4 py-3 font-medium">状态</th>
                <th className="text-left px-4 py-3 font-medium">创建时间</th>
                <th className="text-center px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-cyan-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(u.id)}
                      onChange={() => toggleSelect(u.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-700">{u.username}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-pri text-white flex items-center justify-center text-xs font-semibold">
                        {u.name.slice(0, 1)}
                      </div>
                      <span className="text-gray-800 font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.organization}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${roleColors[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-500">{u.phone}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 w-16 h-6 rounded-full px-2 transition cursor-pointer ${
                      u.status === '启用' ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        u.status === '启用' ? 'translate-x-8' : ''
                      }`}></span>
                    </span>
                    <span className={`ml-1 text-[11px] ${u.status === '启用' ? 'text-green-600' : 'text-gray-400'}`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.createdAt}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-pri hover:underline text-xs flex items-center gap-0.5"><Edit size={12} /> 编辑</button>
                      <button className="text-gray-500 hover:text-pri text-xs">重置密码</button>
                      <button className="text-red-500 hover:underline text-xs flex items-center gap-0.5"><Trash2 size={12} /> 删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 bg-white px-4 py-2.5 flex items-center justify-between text-xs">
          <span className="text-gray-500">共 {filteredUsers.length} 条</span>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">每页</span>
            <select className="border border-gray-200 rounded px-2 py-1 outline-none">
              <option>20</option><option>50</option><option>100</option>
            </select>
            <span className="text-gray-500">条</span>
            <button className="px-2 py-1 border border-gray-200 rounded ml-3 hover:bg-gray-50">‹</button>
            <button className="px-3 py-1 rounded bg-pri text-white">1</button>
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
