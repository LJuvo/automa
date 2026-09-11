import { useState, type ReactNode } from 'react';
import { ArrowLeft, Edit2, Save, AlertTriangle, Clock, FileText } from 'lucide-react';

type InfoItem = { label: string; value: ReactNode };
type TabContent = {
  key: string;
  name: string;
  icon?: React.ComponentType<{ size?: number }>;
};

export type DetailConfig = {
  code: string;
  title: string;
  subtitle?: string;
  status?: ReactNode;
  sections: { title: string; items: InfoItem[] }[];
  tabs?: TabContent[];
  related?: { label: string; items: { name: string; status?: string }[] };
};

export function BusinessDetailPage({ config, onBack }: { config: DetailConfig; onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState(config.tabs?.[0]?.key || '');

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-500 hover:text-pri">
          <ArrowLeft size={12} /> 返回
        </button>
        <div className="h-4 w-px bg-gray-200"></div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-800">{config.title}</h2>
            <span className="text-[11px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">{config.code.toUpperCase()}</span>
            {config.status}
          </div>
          {config.subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{config.subtitle}</p>}
        </div>
        <div className="ml-auto flex gap-2">
          <button className="px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1">
            <Edit2 size={11} /> 编辑
          </button>
          <button className="px-3 py-1.5 text-xs rounded bg-pri text-white hover:bg-pri-d flex items-center gap-1">
            <Save size={11} /> 保存
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {config.sections.map((sec, i) => (
          <div key={i} className={i > 0 ? 'mt-4 pt-4 border-t border-gray-100' : ''}>
            <h4 className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-1.5">
              <span className="w-1 h-3 bg-pri rounded"></span>
              {sec.title}
            </h4>
            <div className="grid grid-cols-4 gap-x-6 gap-y-3 text-xs">
              {sec.items.map((it, j) => (
                <div key={j} className="flex">
                  <span className="w-24 text-gray-500 shrink-0">{it.label}</span>
                  <span className="text-gray-800 font-medium">{it.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {config.related && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-xs font-semibold text-gray-600 mb-3">{config.related.label}</h4>
          <div className="flex flex-wrap gap-2">
            {config.related.items.map((it, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-gray-200 bg-gray-50 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${it.status === '正常' ? 'bg-green-500' : it.status === '故障' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                {it.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {config.tabs && config.tabs.length > 0 && (
        <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col min-h-0">
          <div className="px-4 pt-3 flex gap-4 border-b border-gray-200">
            {config.tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`pb-2.5 text-xs border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === t.key ? 'text-pri border-pri font-semibold' : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}>
                {t.icon && <t.icon size={12} />} {t.name}
              </button>
            ))}
          </div>
          <div className="flex-1 p-4 overflow-auto text-xs">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-gray-500">
                  <th className="text-left px-3 py-2 font-medium">时间</th>
                  <th className="text-left px-3 py-2 font-medium">类型</th>
                  <th className="text-left px-3 py-2 font-medium">详情</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono text-gray-500">2026-08-{18 - i} 10:{String(25 - i).padStart(2, '0')}:00</td>
                    <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px]">状态变更</span></td>
                    <td className="px-3 py-2 text-gray-700">记录示例 #{i + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
