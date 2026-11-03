import { cn } from "@/lib/utils";
import { STOCK_LABELS, type StockStatus } from "@/lib/types";

const STYLES: Record<StockStatus, string> = {
  in_stock: "bg-emerald-50 text-emerald-700 border-emerald-200",
  low_stock: "bg-amber-50 text-amber-700 border-amber-200",
  out_of_stock: "bg-stone-100 text-stone-600 border-stone-200",
  enquire: "bg-sand/70 text-wood border-line",
};

export function StockBadge({
  status,
  className,
}: {
  status: StockStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em]",
        STYLES[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STOCK_LABELS[status]}
    </span>
  );
}
