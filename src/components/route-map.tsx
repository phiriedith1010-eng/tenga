import { Bike, House, Store } from "lucide-react";

function pointOnRoute(progress: number) {
  const t = Math.min(1, Math.max(0, progress));
  const u = 1 - t;
  const x = u * u * 48 + 2 * u * t * 170 + t * t * 312;
  const y = u * u * 168 + 2 * u * t * 78 + t * t * 46;
  return { x, y };
}

export function RouteMap({
  progress,
  storeLabel,
  homeLabel,
  riderLabel,
  showRider,
}: {
  progress: number;
  storeLabel: string;
  homeLabel: string;
  riderLabel: string;
  showRider: boolean;
}) {
  const rider = pointOnRoute(Math.min(progress, 0.86));
  const moving = showRider && progress < 1;

  return (
    <div className="overflow-hidden rounded-2xl border bg-[#e7f2df]">
      <div className="relative h-56 sm:h-64">
        <svg viewBox="0 0 360 220" className="absolute inset-0 h-full w-full" aria-hidden>
          <rect x="18" y="24" width="46" height="28" rx="4" fill="#d5e6c8" />
          <rect x="78" y="118" width="54" height="34" rx="4" fill="#d5e6c8" />
          <rect x="196" y="96" width="40" height="26" rx="4" fill="#d7e4cc" />
          <rect x="250" y="130" width="62" height="30" rx="4" fill="#d5e6c8" />
          <path
            d="M48 168 Q170 78 312 46"
            fill="none"
            stroke="#b7cba8"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M48 168 Q170 78 312 46"
            fill="none"
            stroke="#fffaf2"
            strokeWidth="2"
            strokeDasharray="7 9"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute left-[13%] top-[76%] -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="mx-auto grid size-9 place-items-center rounded-full bg-primary text-primary-foreground shadow">
            <Store className="size-4" />
          </span>
          <span className="mt-1 block max-w-24 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium">
            {storeLabel}
          </span>
        </div>

        <div className="absolute left-[86%] top-[18%] -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="mx-auto grid size-9 place-items-center rounded-full bg-[#c4622d] text-white shadow">
            <House className="size-4" />
          </span>
          <span className="mt-1 block max-w-28 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium">
            {homeLabel}
          </span>
        </div>

        {moving ? (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
            style={{ left: `${(rider.x / 360) * 100}%`, top: `${(rider.y / 220) * 100}%` }}
          >
            <span className="grid size-10 place-items-center rounded-full border-2 border-white bg-[#143024] text-white shadow-lg">
              <Bike className="size-5" />
            </span>
            <span className="sr-only">{riderLabel}</span>
          </div>
        ) : null}
      </div>
      <p className="border-t border-[#d5e6c8] bg-[#f7fbf4] px-3 py-2 text-xs text-muted-foreground">
        A sketch of the run, not a live map. The rider marker moves as the demo status changes.
      </p>
    </div>
  );
}
