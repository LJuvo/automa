import { useState, type ReactNode } from 'react';
import { Search, Plus, Download, Upload, Eye, Edit, ChevronRight } from 'lucide-react';

type Column<T> = {
  key: keyof T & string;
  label: string;
  render?: (row: T) => ReactNode;
  width?: string;
};

export type ListPageConfig<T> = {
  title: string;
  code: string;
  subtitle: string;
  newItemLabel: string;
  columns: Column<T>[];
  data: T[];
  searchFields: string[];
  filters?: { key: string; label: string; options: string[] }[];
};

export function BusinessListPage<T extends { id: string }>({ config, onRowClick }: {
  config: ListPageConfig<T>;
  onRowClick?: (row: T) => void;
}) {
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = config.data.filter(row => {
    if (keyword) {
      const hit = config.searchFields.some(f => String(row[f as keyof T] || '').includes(keyword));
      if (!hit) return false;
    }
    return true;
  });

  const toggleSelect = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(r => r.id));

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mr-2">
            {config.title}
            <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{config.code.toUpperCase()}</span>
          </h3>
          <div className="flex items-center gap-1.5 px-2.5 py-2 border border-gray-200 rounded-md w-64">
            <Search size={14} className="text-gray-400" />
            <input value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder={`搜索 ${config.searchFields.join(' / ')}`}
              className="outline-none text-sm flex-1 bg-transparent" />
          </div>
          {config.filters?.map(f => (
            <select key={f.key} className="text-sm border border-gray-200 rounded-md px-3 py-2 outline-none hover:border-pri">
              <option value="">{f.label}：全部</option>
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
          <div className="ml-auto flex gap-2">
            <button className="px-4 py-2 text-sm rounded bg-pri text-white hover:bg-pri-d flex items-center gap-1">
              <Plus size={13} /> {config.newItemLabel}
            </button>
            <button className="px-3 py-2 text-sm rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1">
              <Upload size={13} /> 导入
            </button>
            <button className="px-3 py-2 text-sm rounded border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1">
              <Download size={13} /> 导出
            </button>
          </div>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-xs text-amber-700 flex items-center justify-between">
          <span>已选择 <b>{selected.length}</b> 项</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-white border border-amber-300 hover:bg-amber-100 text-xs">批量操作</button>
            <button onClick={() => setSelected([])} className="px-3 py-1 rounded bg-white border border-gray-300 hover:bg-gray-50 text-xs">取消</button>
          </div>
        </div>
      )}

      <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-gray-500">
                <th className="w-10 px-3 py-2.5">
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
                </th>
                {config.columns.map(col => (
                  <th key={col.key} className="text-left px-3 py-2.5 font-medium">{col.label}</th>
                ))}
                <th className="w-24 text-center px-3 py-2.5 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(row => (
                <tr key={row.id} className="hover:bg-cyan-50 cursor-pointer" onClick={() => onRowClick?.(row)}>
                  <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} />
                  </td>
                  {config.columns.map(col => (
                    <td key={col.key} className="px-3 py-2.5 text-gray-700">
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-center" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2 text-[11px]">
                      <button onClick={() => onRowClick?.(row)} className="text-pri hover:underline flex items-center gap-0.5"><Eye size={11} /> 详情</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <div className="text-3xl mb-2">📭</div><div>暂无数据</div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 bg-white px-4 py-2.5 flex items-center justify-between text-[11px] shrink-0">
          <span className="text-gray-500">{config.subtitle} · 共 {filtered.length} 条</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">‹</button>
            <button className="px-3 py-1 rounded bg-pri text-white">1</button>
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
