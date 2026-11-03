import Link from "next/link";
import { cn } from "@/lib/utils";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("h-[1.05em] w-[1.05em]", className)}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.19-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.69 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.02 2.59.12.16 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

export function WhatsAppButton({
  href,
  label = "WhatsApp enquiry",
  className,
  iconOnly = false,
  fallbackHref = "/#contact",
}: {
  href: string | null;
  label?: string;
  className?: string;
  iconOnly?: boolean;
  fallbackHref?: string;
}) {
  if (!href) {
    return (
      <Link
        href={fallbackHref}
        className={cn(iconOnly ? "btn btn-outline px-3" : "btn btn-outline", className)}
        aria-label="Send an enquiry"
      >
        <WhatsAppIcon className="opacity-60" />
        {!iconOnly && <span>Send enquiry</span>}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(iconOnly ? "btn btn-ember px-3" : "btn btn-ember", className)}
      aria-label={label}
    >
      <WhatsAppIcon />
      {!iconOnly && <span>{label}</span>}
    </a>
  );
}
