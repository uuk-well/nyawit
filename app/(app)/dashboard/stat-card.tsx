import { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-emerald-600">{label}</p>
        {icon && <span className="text-emerald-400">{icon}</span>}
      </div>
      <p className="mt-1 text-xl font-bold text-emerald-900">{value}</p>
    </div>
  );
}
