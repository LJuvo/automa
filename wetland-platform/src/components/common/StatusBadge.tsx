import { type ReactNode, type ComponentType } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'ok' | 'warn' | 'danger' | 'info' | 'offline' | 'purple';

const variantStyles: Record<BadgeVariant, string> = {
  ok: 'bg-green-100 text-green-700 border-green-200',
  warn: 'bg-amber-100 text-amber-700 border-amber-200',
  danger: 'bg-red-100 text-red-700 border-red-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  offline: 'bg-gray-100 text-gray-500 border-gray-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
};

const dotColors: Record<BadgeVariant, string> = {
  ok: 'bg-green-500',
  warn: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  offline: 'bg-gray-400',
  purple: 'bg-purple-500',
};

export function StatusBadge({
  children,
  variant = 'info',
  className,
  dot,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-medium border', variantStyles[variant], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])}></span>}
      {children}
    </span>
  );
}

export function AlarmLevelBadge({ level }: { level: '紧急' | '重要' | '次要' | '提示' }) {
  const map: Record<string, BadgeVariant> = {
    '紧急': 'danger',
    '重要': 'warn',
    '次要': 'info',
    '提示': 'offline',
  };
  return <StatusBadge variant={map[level]} dot>{level}</StatusBadge>;
}

export function KpiCard({
  title,
  value,
  unit,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  unit?: string;
  trend?: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
}) {
  const trendColor = trend?.startsWith('-') ? 'text-green-600' : trend?.startsWith('+') ? 'text-red-600' : 'text-gray-500';
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow transition-shadow cursor-pointer group">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-500">{title}</span>
        {Icon && <Icon size={16} className="text-gray-400 group-hover:text-pri transition-colors" />}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      {trend && (
        <div className={`text-xs mt-1 ${trendColor}`}>
          {trend} <span className="text-gray-400 ml-1">较昨日</span>
        </div>
      )}
    </div>
  );
}
