import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminKpiCard } from "@/components/admin/admin-kpi-card";
import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { AdminShellBanner } from "@/components/admin/admin-shell-banner";
import { AdminSurface } from "@/components/admin/admin-surface";
import { PageHeader } from "@/components/shared/page-header";
import {
  faArrowUpRightFromSquare,
  faCameraRetro,
  faFilm,
  faFolderTree,
  faLayerGroup,
  faShieldHalved,
  faUserGroup,
} from "@/lib/icons/fa";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  faChartColumn,
  faClockRotateLeft,
  faRectangleList,
} from "@/lib/icons/fa";

const FOUNDATION_CARDS = [
  {
    title: "Layout system",
    body: "Sidebar, topbar, page rhythm, and mobile drawer are now visually cohesive and ready to host richer modules.",
    icon: faRectangleList,
  },
  {
    title: "Operational modules",
    body: "Users and roles areas now share a consistent layout language and interaction model, ready for daily admin usage.",
    icon: faLayerGroup,
  },
  {
    title: "Auth continuity",
    body: "Session continuity and guarded routes remain stable while the interface matures into a cleaner product shell.",
    icon: faShieldHalved,
  },
];

const KPI_CARDS = [
  {
    label: "Bookings This Week",
    value: "18",
    caption: "Mock planning volume for portrait, commercial, and travel sessions.",
    icon: faCameraRetro,
  },
  {
    label: "Delivery Pace",
    value: "92%",
    caption: "Projects currently landing inside the planned delivery window.",
    icon: faChartColumn,
  },
  {
    label: "Client Mix",
    value: "6 / 12",
    caption: "Mock split between returning clients and first-time enquiries.",
    icon: faUserGroup,
  },
];

const BOOKING_BARS = [
  { label: "Mon", value: 6 },
  { label: "Tue", value: 8 },
  { label: "Wed", value: 5 },
  { label: "Thu", value: 9 },
  { label: "Fri", value: 7 },
  { label: "Sat", value: 10 },
];

const PIPELINE_STEPS = [
  { label: "Leads", value: "26", note: "Fresh enquiries from editorial and portrait clients" },
  { label: "Quoted", value: "14", note: "Actively discussed proposals and treatment decks" },
  { label: "Booked", value: "9", note: "Confirmed with deposit and production notes" },
  { label: "Editing", value: "5", note: "Current post-production load this week" },
];

export function DashboardPlaceholder() {
  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Admin shell"
        title="Studio operations at a glance."
        description="A presentation-first overview that mirrors a premium photography studio workspace while staying aligned with current backend scope."
        meta={
          <>
            <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
              Protected layout
            </span>
            <span className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
              Auth-aware shell
            </span>
          </>
        }
        actions={
          <Link
            href="/login"
            className={cn(buttonVariants(), "rounded-full px-5")}
          >
            Public shell
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </Link>
        }
      />
      <AdminShellBanner />
      <section className="stagger-fade grid gap-4 lg:grid-cols-3">
        {KPI_CARDS.map((card) => (
          <AdminKpiCard key={card.label} {...card} />
        ))}
      </section>
      <section className="stagger-fade grid gap-4 lg:grid-cols-3">
        {FOUNDATION_CARDS.map((card) => (
          <article
            key={card.title}
            className="surface-float rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,237,0.82))] p-6 shadow-soft"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl border border-[--color-brand]/20 bg-[--color-brand-soft] text-[--color-brand]">
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <h2 className="mt-5 font-heading text-3xl tracking-[0.04em]">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.body}</p>
          </article>
        ))}
      </section>
      <AdminSurface className="p-6 md:p-8">
        <AdminSectionHeading
          eyebrow="Studio overview"
          title="Curated mock signals for planning and delivery."
          description="These panels are intentionally static and used to present a realistic visual hierarchy until analytics endpoints are introduced."
        />
        <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border border-border/80 bg-white/72 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                    Weekly bookings
                  </p>
                  <h3 className="mt-2 font-heading text-3xl tracking-[0.04em] text-foreground">
                    Shoot calendar momentum
                  </h3>
                </div>
                <div className="flex size-11 items-center justify-center rounded-2xl border border-[--color-brand]/20 bg-[--color-brand-soft] text-[--color-brand]">
                  <FontAwesomeIcon icon={faFilm} />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-6 gap-3">
                {BOOKING_BARS.map((bar) => (
                  <div key={bar.label} className="space-y-3">
                    <div className="flex h-36 items-end">
                      <div
                        className="w-full rounded-t-[1rem] bg-[linear-gradient(180deg,rgba(205,174,111,0.9),rgba(167,130,63,0.72))]"
                        style={{ height: `${bar.value * 10}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {bar.label}
                      </p>
                      <p className="mt-1 text-sm text-foreground">{bar.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-border/80 bg-white/72 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                    Client pipeline
                  </p>
                  <h3 className="mt-2 font-heading text-3xl tracking-[0.04em] text-foreground">
                    From enquiry to delivery
                  </h3>
                </div>
                <div className="flex size-11 items-center justify-center rounded-2xl border border-[--color-brand]/20 bg-[--color-brand-soft] text-[--color-brand]">
                  <FontAwesomeIcon icon={faFolderTree} />
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {PIPELINE_STEPS.map((step, index) => (
                  <div key={step.label} className="rounded-[1.25rem] border border-border/70 bg-[color:rgba(255,255,255,0.74)] p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
                      {step.label}
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <p className="font-heading text-4xl tracking-[0.04em] text-foreground">{step.value}</p>
                      <span className="text-xs text-muted-foreground">0{index + 1}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(20,27,39,0.97),rgba(14,20,31,0.95))] p-5 text-white">
              <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Studio note
              </p>
              <h3 className="mt-2 font-heading text-3xl tracking-[0.04em]">
                Editorial, not ornamental
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/72">
                This view communicates weekly momentum and production focus without implying live analytics integration.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-border/80 bg-white/72 p-5">
              <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                Team readiness
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-foreground">Admin workflows</span>
                    <span className="text-muted-foreground">94%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[--color-brand-soft]">
                    <div className="h-full w-[94%] rounded-full bg-[linear-gradient(90deg,var(--color-brand),#8d6a2f)]" />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-foreground">Client comms flow</span>
                    <span className="text-muted-foreground">81%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[--color-brand-soft]">
                    <div className="h-full w-[81%] rounded-full bg-[linear-gradient(90deg,var(--color-brand),#8d6a2f)]" />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-foreground">Delivery coordination</span>
                    <span className="text-muted-foreground">88%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[--color-brand-soft]">
                    <div className="h-full w-[88%] rounded-full bg-[linear-gradient(90deg,var(--color-brand),#8d6a2f)]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-border/80 bg-white/72 p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-[--color-brand]/20 bg-[--color-brand-soft] text-[--color-brand]">
                  <FontAwesomeIcon icon={faClockRotateLeft} />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                    Current focus
                  </p>
                  <h3 className="font-heading text-3xl tracking-[0.04em] text-foreground">
                    Fewer raw admin edges
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Auth continuity, account controls, and management workflows now read as a cohesive product experience.
              </p>
            </div>
          </div>
        </div>
      </AdminSurface>
    </AdminPageContainer>
  );
}
