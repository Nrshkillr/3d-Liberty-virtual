import { ArrowRight, Compass, Footprints, MousePointer2 } from "lucide-react";

export function ShowroomTourCard() {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-cream/15 bg-cream/[0.055] p-4 backdrop-blur-sm sm:p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-cream/60">
          <Compass className="h-3.5 w-3.5 text-ember-soft" />
          Showroom map
        </p>
        <span className="rounded-full border border-cream/15 px-2 py-0.5 text-[0.52rem] font-bold uppercase tracking-[0.14em] text-cream/45">
          3D
        </span>
      </div>

      <svg
        viewBox="0 0 280 210"
        className="mt-4 w-full"
        role="img"
        aria-label="Floor plan of the Liberty Enterprises virtual showroom"
      >
        <defs>
          <pattern id="tour-grid" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M14 0H0v14" fill="none" stroke="rgba(250,246,238,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="280" height="210" rx="12" fill="url(#tour-grid)" />
        <rect
          x="30"
          y="18"
          width="220"
          height="166"
          rx="6"
          fill="rgba(250,246,238,0.035)"
          stroke="rgba(250,246,238,0.22)"
          strokeWidth="1.2"
        />

        <rect x="36" y="24" width="54" height="70" rx="5" fill="#d9773f" fillOpacity="0.24" stroke="#d9773f" strokeOpacity="0.55" />
        <text x="63" y="60" textAnchor="middle" fill="#f6dcc9" fontSize="7" fontWeight="700" letterSpacing="0.8">
          WALKERS
        </text>
        <text x="63" y="71" textAnchor="middle" fill="#f6dcc9" fillOpacity="0.65" fontSize="5.5" letterSpacing="0.4">
          & ACCESSORIES
        </text>

        <rect x="190" y="24" width="54" height="70" rx="5" fill="#2c5578" fillOpacity="0.4" stroke="#6f9ab8" strokeOpacity="0.55" />
        <text x="217" y="60" textAnchor="middle" fill="#dbe7ef" fontSize="7" fontWeight="700" letterSpacing="0.8">
          RIDE-ONS
        </text>
        <text x="217" y="71" textAnchor="middle" fill="#dbe7ef" fillOpacity="0.65" fontSize="5.5" letterSpacing="0.4">
          BATTERY CARS
        </text>

        <rect x="96" y="84" width="88" height="50" rx="5" fill="#7c8b75" fillOpacity="0.24" stroke="#a8b5a0" strokeOpacity="0.55" />
        <text x="140" y="106" textAnchor="middle" fill="#e7e9dd" fontSize="7" fontWeight="700" letterSpacing="0.8">
          SWINGS
        </text>
        <text x="140" y="117" textAnchor="middle" fill="#e7e9dd" fillOpacity="0.65" fontSize="5.5" letterSpacing="0.4">
          CRADLES · JHULAS
        </text>

        <rect x="36" y="140" width="208" height="38" rx="5" fill="#c49a5a" fillOpacity="0.14" stroke="#c49a5a" strokeOpacity="0.45" />
        <text x="140" y="158" textAnchor="middle" fill="#eadcc4" fontSize="7" fontWeight="700" letterSpacing="0.8">
          SOFT TOYS · TENTS · GIFTS
        </text>
        <text x="140" y="168" textAnchor="middle" fill="#eadcc4" fillOpacity="0.55" fontSize="5.5" letterSpacing="0.4">
          BACK WALL COLLECTION
        </text>

        <path d="M140 36v52" stroke="rgba(250,246,238,0.25)" strokeWidth="1" strokeDasharray="3 4" />
        <path d="M140 134v14" stroke="rgba(250,246,238,0.2)" strokeWidth="1" strokeDasharray="3 4" />

        <g transform="translate(140 186)">
          <circle r="10" fill="#d9773f" fillOpacity="0.18" />
          <circle r="4.2" fill="#d9773f" stroke="#faf6ee" strokeWidth="1.4" />
          <path d="M0-11v-4" stroke="#f6dcc9" strokeWidth="1.4" strokeLinecap="round" />
          <text x="0" y="-17" textAnchor="middle" fill="#f6dcc9" fontSize="5.5" fontWeight="700" letterSpacing="0.6">
            YOU
          </text>
        </g>
        <text x="140" y="205" textAnchor="middle" fill="#faf6ee" fillOpacity="0.35" fontSize="5.5" letterSpacing="0.8">
          ENTRANCE
        </text>
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-cream/10 pt-3">
        {[
          { icon: Footprints, label: "WASD / joystick" },
          { icon: MousePointer2, label: "Drag to look" },
          { icon: ArrowRight, label: "Tap to explore" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-[0.55rem] font-semibold text-cream/50">
            <item.icon className="h-3 w-3 shrink-0 text-ember-soft/80" />
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
