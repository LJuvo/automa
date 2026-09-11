import { useState } from 'react';
import { Download, Send, Plus, Play, FileSpreadsheet, Calendar, Clock, Eye } from 'lucide-react';

type ReportTask = {
  id: string;
  name: string;
  type: '日报' | '周报' | '月报' | '年报' | '自定义';
  site: string;
  schedule: string;
  recipients: number;
  status: '运行中' | '已停止' | '待生成';
  lastRun: string;
  nextRun: string;
  format: 'Excel' | 'PDF' | 'Word';
};

const reports: ReportTask[] = [
  { id: 'R001', name: '蓉江新区日运行报表', type: '日报', site: '蓉江新区再生水厂', schedule: '每日 06:00', recipients: 3, status: '运行中', lastRun: '2026-08-18 06:00:02', nextRun: '2026-08-19 06:00', format: 'Excel' },
  { id: 'R002', name: '蓉江新区月综合报表', type: '月报', site: '蓉江新区再生水厂', schedule: '每月1日 09:00', recipients: 8, status: '运行中', lastRun: '2026-08-01 09:00:15', nextRun: '2026-09-01 09:00', format: 'PDF' },
  { id: 'R003', name: '沙石厂运行日报', type: '日报', site: '沙石污水处理厂', schedule: '每日 05:30', recipients: 2, status: '运行中', lastRun: '2026-08-18 05:30:08', nextRun: '2026-08-19 05:30', format: 'Excel' },
  { id: 'R004', name: '全厂周报（水质+能耗）', type: '周报', site: '全部子项', schedule: '每周一 08:00', recipients: 12, status: '运行中', lastRun: '2026-08-17 08:00:30', nextRun: '2026-08-24 08:00', format: 'PDF' },
  { id: 'R005', name: '白塔污泥处置月报', type: '月报', site: '白塔污泥处理厂', schedule: '每月1日 10:00', recipients: 5, status: '已停止', lastRun: '2026-07-01 10:00:00', nextRun: '—', format: 'PDF' },
  { id: 'R006', name: '年度碳减排核算报告', type: '年报', site: '全部子项', schedule: '每年1月10日', recipients: 15, status: '运行中', lastRun: '2026-01-10 14:00:00', nextRun: '2027-01-10', format: 'PDF' },
  { id: 'R007', name: '临时：7月能耗分析', type: '自定义', site: '全部子项', schedule: '手动触发', recipients: 1, status: '待生成', lastRun: '—', nextRun: '手动生成', format: 'Excel' },
];

export function ReportManagementPage() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'history' | 'templates'>('tasks');

  return (
    <div className="h-full flex flex-col gap-3">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-xs text-gray-500"><FileSpreadsheet size={14} className="text-pri" /> 报表任务总数</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{reports.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-xs text-gray-500"><Play size={14} className="text-green-500" /> 运行中</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{reports.filter(r => r.status === '运行中').length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-xs text-gray-500"><Clock size={14} className="text-amber-500" /> 今日待生成</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">1</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-xs text-gray-500"><Send size={14} className="text-blue-500" /> 本月已推送</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">23 次</div>
        </div>
      </div>

      {/* Tab */}
      <div className="bg-white rounded-lg border border-gray-200 px-3 py-2 flex items-center gap-1">
        {[
          { key: 'tasks', name: '报表任务', count: reports.length },
          { key: 'history', name: '生成历史', count: 156 },
          { key: 'templates', name: '模板管理', count: 12 },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3 py-1.5 text-xs rounded flex items-center gap-1.5 ${
              activeTab === t.key ? 'bg-pri text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.name}
            <span className={`text-[10px] px-1.5 rounded ${activeTab === t.key ? 'bg-white/20' : 'bg-gray-200'}`}>{t.count}</span>
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button className="px-3 py-1.5 text-xs rounded bg-pri text-white hover:bg-pri-d flex items-center gap-1">
            <Plus size={12} /> 新建报表任务
          </button>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-gray-500">
                <th className="text-left px-3 py-2.5 font-medium">编号</th>
                <th className="text-left px-3 py-2.5 font-medium">报表名称</th>
                <th className="text-center px-3 py-2.5 font-medium">类型</th>
                <th className="text-left px-3 py-2.5 font-medium">所属子项</th>
                <th className="text-left px-3 py-2.5 font-medium">调度计划</th>
                <th className="text-center px-3 py-2.5 font-medium">格式</th>
                <th className="text-center px-3 py-2.5 font-medium">收件人</th>
                <th className="text-center px-3 py-2.5 font-medium">状态</th>
                <th className="text-left px-3 py-2.5 font-medium">上次生成</th>
                <th className="text-center px-3 py-2.5 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 font-mono text-gray-500">{r.id}</td>
                  <td className="px-3 py-2.5 font-medium text-gray-800">{r.name}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      r.type === '日报' ? 'bg-blue-100 text-blue-700' :
                      r.type === '周报' ? 'bg-purple-100 text-purple-700' :
                      r.type === '月报' ? 'bg-amber-100 text-amber-700' :
                      r.type === '年报' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{r.type}</span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{r.site}</td>
                  <td className="px-3 py-2.5 text-gray-600">{r.schedule}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{r.format}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono">{r.recipients}人</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      r.status === '运行中' ? 'bg-green-50 text-green-700 flex items-center gap-1 mx-auto w-fit' :
                      r.status === '已停止' ? 'bg-gray-50 text-gray-600' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {r.status === '运行中' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">{r.lastRun}</td>
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-pri hover:underline flex items-center gap-0.5"><Play size={11} /> 生成</button>
                      <button className="text-gray-500 hover:text-pri flex items-center gap-0.5"><Eye size={11} /> 预览</button>
                      <button className="text-gray-500 hover:text-pri flex items-center gap-0.5"><Download size={11} /> 下载</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
          <span>报表数据保留周期 ≥ 1年 · 点击下载可导出完整 Excel</span>
          <span>共 {reports.length} 条</span>
        </div>
      </div>
    </div>
  );
}
