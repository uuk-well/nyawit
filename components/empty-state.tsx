import { Leaf } from "lucide-react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-white/60 px-6 py-12 text-center">
      <Leaf className="mb-3 h-8 w-8 text-emerald-400" />
      <p className="font-semibold text-emerald-800">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-emerald-600">{description}</p>
      )}
    </div>
  );
}
