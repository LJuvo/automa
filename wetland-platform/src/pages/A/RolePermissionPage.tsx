import type React from "react";
import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';

type PermissionNode = {
  id: string;
  name: string;
  children?: PermissionNode[];
};

const roles = [
  { code: 'L4', name: '管理员', level: 4, count: 2, color: 'from-purple-500 to-purple-600', desc: '全部权限含系统配置、PLC参数、控制策略' },
  { code: 'L3', name: '工程师', level: 3, count: 12, color: 'from-blue-500 to-blue-600', desc: '工艺参数/PID/报警限值/模式切换/启停/报表/导出' },
  { code: 'L2', name: '操作员', level: 2, count: 24, color: 'from-amber-500 to-amber-600', desc: '启停/报警确认/报表趋势查看/画面浏览' },
  { code: 'L1', name: '浏览者', level: 1, count: 8, color: 'from-gray-400 to-gray-500', desc: '仅浏览查看，不可操作设备与改参数' },
];

const permTree: PermissionNode[] = [
  { id: 'view', name: '查看浏览', children: [
    { id: 'view-overview', name: '全厂总览画面' },
    { id: 'view-process', name: '工艺流程画面' },
    { id: 'view-trend', name: '趋势分析查看' },
    { id: 'view-report', name: '报表查看' },
    { id: 'view-device', name: '设备台账查看' },
  ]},
  { id: 'control', name: '设备控制', children: [
    { id: 'control-start-stop', name: '设备启停', children: [
      { id: 'control-pump', name: '泵类启停' },
      { id: 'control-blower', name: '鼓风机启停' },
      { id: 'control-others', name: '其他设备启停' },
    ]},
    { id: 'control-mode', name: '手/自动切换' },
    { id: 'control-frequency', name: '频率设定（≤10Hz步长）' },
  ]},
  { id: 'param', name: '参数修改', children: [
    { id: 'param-do', name: 'DO设定值' },
    { id: 'param-mlss', name: 'MLSS目标' },
    { id: 'param-pid', name: 'PID参数（Kp/Ki/Kd）' },
    { id: 'param-pac', name: 'PAC加药比例' },
    { id: 'param-reflux', name: '回流比' },
  ]},
  { id: 'alarm', name: '报警管理', children: [
    { id: 'alarm-confirm', name: '报警确认' },
    { id: 'alarm-shield', name: '报警屏蔽' },
    { id: 'alarm-limit', name: '修改报警限值' },
  ]},
  { id: 'system', name: '系统配置', children: [
    { id: 'sys-user', name: '用户管理' },
    { id: 'sys-role', name: '角色权限管理' },
    { id: 'sys-config', name: '全局参数配置' },
    { id: 'sys-plc', name: 'PLC通信配置' },
    { id: 'sys-strategy', name: '自动控制策略编辑' },
  ]},
];

// 预设各角色已勾选的权限ID
const rolePermissions: Record<string, string[]> = {
  L4: ['view', 'view-overview', 'view-process', 'view-trend', 'view-report', 'view-device',
       'control', 'control-start-stop', 'control-pump', 'control-blower', 'control-others',
       'control-mode', 'control-frequency', 'param', 'param-do', 'param-mlss', 'param-pid',
       'param-pac', 'param-reflux', 'alarm', 'alarm-confirm', 'alarm-shield', 'alarm-limit',
       'system', 'sys-user', 'sys-role', 'sys-config', 'sys-plc', 'sys-strategy'],
  L3: ['view', 'view-overview', 'view-process', 'view-trend', 'view-report', 'view-device',
       'control', 'control-start-stop', 'control-pump', 'control-blower', 'control-others',
       'control-mode', 'param', 'param-do', 'param-mlss', 'param-pac', 'param-reflux',
       'alarm', 'alarm-confirm', 'alarm-limit'],
  L2: ['view', 'view-overview', 'view-process', 'view-trend', 'view-report', 'view-device',
       'control', 'control-start-stop', 'control-pump', 'control-blower', 'control-others',
       'alarm', 'alarm-confirm'],
  L1: ['view', 'view-overview', 'view-process', 'view-trend', 'view-report', 'view-device'],
};

export function RolePermissionPage() {
  const [activeRole, setActiveRole] = useState('L3');
  const [checked, setChecked] = useState<string[]>(rolePermissions['L3']);

  const currentRole = roles.find(r => r.code === activeRole)!;

  const selectRole = (code: string) => {
    setActiveRole(code);
    setChecked(rolePermissions[code] || []);
  };

  const togglePerm = (id: string, parentChildrenIds: string[] = []) => {
    setChecked(prev => {
      const has = prev.includes(id);
      let next = has ? prev.filter(x => x !== id) : [...prev, id];
      // 联动子节点
      if (!has) {
        parentChildrenIds.forEach(cid => {
          if (!next.includes(cid)) next.push(cid);
        });
      } else {
        // 取消子节点
        next = next.filter(x => !parentChildrenIds.includes(x));
      }
      return next;
    });
  };

  const renderNode = (node: PermissionNode, level = 0): React.ReactElement => {
    const allChildIds = node.children ? collectIds(node.children) : [];
    const hasAllChildren = allChildIds.length > 0 && allChildIds.every(id => checked.includes(id));
    const hasSomeChildren = allChildIds.some(id => checked.includes(id)) && !hasAllChildren;
    const isChecked = checked.includes(node.id) || hasAllChildren;
    const isIndeterminate = hasSomeChildren;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-50 cursor-pointer ${level === 0 ? 'bg-gray-50 font-semibold text-gray-800' : 'text-gray-700'}`}
          style={{ paddingLeft: 12 + level * 20 }}
          onClick={() => togglePerm(node.id, allChildIds)}
        >
          <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
            isChecked ? 'bg-pri border-pri' : isIndeterminate ? 'bg-pri border-pri' : 'border-gray-300'
          }`}>
            {isChecked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" /></svg>}
            {isIndeterminate && <span className="w-2 h-0.5 bg-white rounded"></span>}
          </span>
          <span className="text-sm">{node.name}</span>
        </div>
        {node.children?.map(c => renderNode(c, level + 1))}
      </div>
    );
  };

  function collectIds(nodes: PermissionNode[]): string[] {
    let ids: string[] = [];
    nodes.forEach(n => {
      ids.push(n.id);
      if (n.children) ids = ids.concat(collectIds(n.children));
    });
    return ids;
  }

  return (
    <div className="h-full flex gap-3">
      {/* 左列 - 角色卡片 */}
      <div className="w-64 bg-white rounded-lg border border-gray-200 p-3 shrink-0">
        <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">角色列表</h3>
        <div className="space-y-2">
          {roles.map(role => (
            <button
              key={role.code}
              onClick={() => selectRole(role.code)}
              className={`w-full text-left p-3 rounded-lg border transition ${
                activeRole === role.code
                  ? 'border-pri bg-cyan-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-800">{role.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r ${role.color} text-white`}>
                  Level {role.level}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">共 {role.count} 人</div>
              <div className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">{role.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 右列 - 权限树 */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col min-w-0">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              <span className="font-bold">{currentRole.name}</span>
              <span className="text-gray-400 font-mono ml-1">Level {currentRole.level}</span>
              <span className="text-xs text-gray-500 ml-2">权限矩阵配置</span>
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">{currentRole.desc}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1">
              <RotateCcw size={11} /> 重置
            </button>
            <button className="px-3 py-1.5 text-xs rounded bg-pri text-white hover:bg-pri-d flex items-center gap-1">
              <Save size={11} /> 保存修改
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-2">
          {permTree.map(node => renderNode(node))}
        </div>
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-2.5 text-[11px] text-gray-500 shrink-0">
          💡 提示：父子联动勾选。选择父节点会自动勾选所有子节点，半选态表示部分子节点已勾选。
        </div>
      </div>
    </div>
  );
}
