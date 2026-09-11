import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type Item = { path: string; name: string; desc: string; count?: number; };
type Props = { title: string; subtitle: string; items: Item[]; accent: string };

export function DomainEntryPage({ title, subtitle, items, accent }: Props) {
  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto">
      <header className="card p-4 flex items-center justify-between">
        <div>
          <h1 className="t-subhead">{title}</h1>
          <p className="t-secondary mt-1">{subtitle}</p>
        </div>
        <div className="text-[11px] text-[var(--neutral-400)] font-mono">共 {items.length} 个功能入口</div>
      </header>

      <section className="grid grid-cols-3 gap-4">
        {items.map(it => (
          <Link key={it.path} to={it.path}
            className="card p-4 flex items-start gap-3 hover:border-[var(--brand-400)] hover:shadow-[var(--shadow-sm)] transition group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accent}18`, color: accent }}>
              <span className="text-[14px] font-bold">{it.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-semibold text-[var(--neutral-800)] group-hover:text-[var(--brand-700)]">{it.name}</span>
                {it.count !== undefined && (
                  <span className="font-mono text-[10.5px] bg-[var(--neutral-100)] text-[var(--neutral-500)] px-1.5 py-0.5 rounded">{it.count}</span>
                )}
              </div>
              <div className="text-[11.5px] text-[var(--neutral-500)] mt-1 line-clamp-2">{it.desc}</div>
            </div>
            <ArrowRight size={14} className="text-[var(--neutral-400)] group-hover:text-[var(--brand-500)] group-hover:translate-x-0.5 transition shrink-0 mt-1" />
          </Link>
        ))}
      </section>
    </div>
  );
}
