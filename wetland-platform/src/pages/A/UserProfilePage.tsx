import { useState } from 'react';
import { User, Bell, Key, Clock, Shield, Edit2, Save } from 'lucide-react';

export function UserProfilePage() {
  const [tab, setTab] = useState<'info' | 'security' | 'notify' | 'log'>('info');

  return (
    <div className="h-full flex gap-3">
      {/* 左侧资料卡 */}
      <div className="w-72 bg-white rounded-lg border border-gray-200 p-5 shrink-0">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-pri text-white flex items-center justify-center text-3xl font-bold">
            张
          </div>
          <h2 className="text-lg font-bold text-gray-800 mt-3">张工</h2>
          <span className="text-xs text-gray-500">zhanggong</span>
          <span className="mt-2 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">工程师 Level 3</span>
        </div>
        <div className="mt-5 border-t border-gray-100 pt-4 space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">所属组织</span><span>蓉江新区二期</span></div>
          <div className="flex justify-between"><span className="text-gray-500">注册时间</span><span>2025-03-15</span></div>
          <div className="flex justify-between"><span className="text-gray-500">最后登录</span><span className="font-mono">10:15:22</span></div>
          <div className="flex justify-between"><span className="text-gray-500">登录IP</span><span className="font-mono">10.30.177.52</span></div>
        </div>
        <button className="mt-4 w-full py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center justify-center gap-1">
          <Edit2 size={11} /> 编辑资料
        </button>
      </div>

      {/* 右侧 Tab 内容 */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col min-h-0">
        <div className="px-4 pt-3 flex gap-4 border-b border-gray-200">
          {[
            { key: 'info', name: '基本资料', icon: User },
            { key: 'security', name: '安全设置', icon: Key },
            { key: 'notify', name: '通知偏好', icon: Bell },
            { key: 'log', name: '操作记录', icon: Clock },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`pb-2.5 text-xs border-b-2 transition flex items-center gap-1.5 ${
                tab === t.key ? 'text-pri border-pri font-semibold' : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}>
              <t.icon size={12} /> {t.name}
            </button>
          ))}
        </div>
        <div className="flex-1 p-5 overflow-auto">
          {tab === 'info' && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs">
              {[
                ['姓名', '张工'], ['账号', 'zhanggong'], ['角色', '工程师 (L3)'],
                ['所属组织', '蓉江新区污水处理厂二期'], ['手机', '138****5678'], ['邮箱', 'zhang@gzwater.cn'],
                ['工号', 'EMP-2023-018'], ['值班组', '白班A组'], ['上级', '赵管理'],
              ].map(([k, v]) => (
                <div key={k} className="flex">
                  <div className="w-24 text-gray-500 shrink-0">{k}</div>
                  <div className="text-gray-800 font-medium">{v}</div>
                </div>
              ))}
              <button className="col-span-2 mt-4 px-4 py-2 text-xs rounded bg-pri text-white hover:bg-pri-d flex items-center gap-1 w-fit">
                <Save size={11} /> 保存修改
              </button>
            </div>
          )}
          {tab === 'security' && (
            <div className="space-y-4 max-w-lg">
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700">登录密码</span>
                  <button className="text-[11px] text-pri hover:underline">修改</button>
                </div>
                <div className="text-[11px] text-gray-500">上次修改：2026-07-15 · 强度：<span className="text-green-600">强</span></div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700">双因素认证</span>
                  <button className="text-[11px] text-pri hover:underline">启用</button>
                </div>
                <div className="text-[11px] text-gray-500">当前状态：<span className="text-gray-400">未启用</span></div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700">IP 白名单</span>
                  <button className="text-[11px] text-pri hover:underline">配置</button>
                </div>
                <div className="text-[11px] text-gray-500">当前：<span className="font-mono">10.30.0.0/16, 192.168.1.0/24</span></div>
              </div>
            </div>
          )}
          {tab === 'notify' && (
            <div className="space-y-3 text-xs">
              {[
                { t: '报警通知', d: '紧急/重要报警立即推送', sms: true, email: true, webhook: true },
                { t: '报表生成', d: '日报/月报生成完成通知', sms: false, email: true, webhook: false },
                { t: '设备故障', d: '设备停机/故障告警', sms: true, email: true, webhook: true },
                { t: '计划维护', d: '维护到期前 3 天提醒', sms: false, email: true, webhook: false },
              ].map((n, i) => (
                <div key={i} className="border border-gray-200 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{n.t}</div>
                      <div className="text-[11px] text-gray-500">{n.d}</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-[11px]"><input type="checkbox" defaultChecked={n.sms} /> 短信</label>
                    <label className="flex items-center gap-1.5 text-[11px]"><input type="checkbox" defaultChecked={n.email} /> 邮件</label>
                    <label className="flex items-center gap-1.5 text-[11px]"><input type="checkbox" defaultChecked={n.webhook} /> Webhook</label>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'log' && (
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr className="text-gray-500">
                  <th className="text-left px-3 py-2 font-medium">时间</th>
                  <th className="text-left px-3 py-2 font-medium">操作</th>
                  <th className="text-left px-3 py-2 font-medium">对象</th>
                  <th className="text-center px-3 py-2 font-medium">结果</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['2026-08-18 10:25:33', '参数修改', '沙石厂-生化池 DO 设定 2.0→2.2', '成功'],
                  ['2026-08-18 09:45:22', '报警确认', 'ALM-20260818-002 鼓风机振动', '成功'],
                  ['2026-08-18 08:30:00', '设备启停', '蓉江新区 4#提升泵 启动', '成功'],
                  ['2026-08-17 22:15:00', '报警屏蔽', 'ALM-20260817-006 回流泵跳停', '成功'],
                  ['2026-08-17 18:40:00', '参数修改', '白塔厂 压滤机 PID Kp 0.5→0.6', '成功'],
                  ['2026-08-17 14:20:00', '登录', '从 10.30.177.52 登录', '成功'],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {row.map((c, j) => (
                      <td key={j} className={`px-3 py-2 ${j === 0 ? 'font-mono text-gray-500' : j === 3 ? 'text-center text-green-600' : 'text-gray-700'}`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
