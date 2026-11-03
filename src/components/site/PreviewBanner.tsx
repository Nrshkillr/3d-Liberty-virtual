import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function PreviewBanner() {
  return (
    <div className="border-b border-navy/10 bg-navy text-cream">
      <div className="container-x flex flex-wrap items-center justify-between gap-2 py-2 text-[0.68rem] font-medium leading-relaxed tracking-wide">
        <p className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-ember-soft" />
          <span>
            Preview catalogue — sample products are shown until the Supabase
            database is connected.
          </span>
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 font-bold text-ember-soft hover:text-cream"
        >
          Setup
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
