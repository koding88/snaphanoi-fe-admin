import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminKpiCard } from "@/components/admin/admin-kpi-card";
import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { AdminShellBanner } from "@/components/admin/admin-shell-banner";
import { AdminSurface } from "@/components/admin/admin-surface";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { faArrowUpRightFromSquare, faFilm, faLayerGroup, faShieldHalved } from "@/lib/icons/fa";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  faChartColumn,
  faCircleNodes,
  faClockRotateLeft,
  faPalette,
  faRectangleList,
} from "@/lib/icons/fa";

const FOUNDATION_CARDS = [
  {
    title: "Layout system",
    body: "Sidebar, topbar, page rhythm, and mobile drawer are now visually cohesive and ready to host richer modules.",
    icon: faRectangleList,
  },
  {
    title: "Module staging",
    body: "Users and roles routes are product-like shell pages now, without prematurely inventing CRUD behavior or fake data.",
    icon: faLayerGroup,
  },
  {
    title: "Auth continuity",
    body: "The shell continues to respect Stage 2 session bootstrap and authenticated route guard behavior without structural churn.",
    icon: faShieldHalved,
  },
];

const KPI_CARDS = [
  {
    label: "Navigation",
    value: "3",
    caption: "Dashboard, Users, and Roles are now wired into a clear shell hierarchy.",
    icon: faCircleNodes,
  },
  {
    label: "Readiness",
    value: "Stage 4",
    caption: "Users module can receive list, detail, and forms without replacing the shell.",
    icon: faChartColumn,
  },
  {
    label: "Refinement",
    value: "Stage 5",
    caption: "Roles area already has enough structure to accept permission management next.",
    icon: faClockRotateLeft,
  },
];

export function DashboardPlaceholder() {
  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Admin shell"
        title="A polished control surface for the studio."
        description="This dashboard stays honest about the current backend scope while giving the admin area a strong, premium visual frame. It is practical, responsive, and ready for real module work in the next stages."
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
          eyebrow="Dashboard placeholder"
          title="No fabricated analytics, only stage-relevant hierarchy."
          description="The backend handoff does not define dashboard metrics, so this surface stays deliberately non-fictional while still looking like a real product page."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.75rem] border border-border/80 bg-white/70 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-[--color-brand]/20 bg-[--color-brand-soft] text-[--color-brand]">
                <FontAwesomeIcon icon={faFilm} />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
                  Creative operations
                </p>
                <h3 className="font-heading text-3xl tracking-[0.04em] text-foreground">
                  Placeholder with intent
                </h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              The dashboard is currently a staging surface for shell quality, not a fabricated
              reporting panel. That keeps the UI honest while still giving strong visual hierarchy.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(20,27,39,0.97),rgba(14,20,31,0.95))] p-5 text-white">
            <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
              Design note
            </p>
            <h3 className="mt-2 font-heading text-3xl tracking-[0.04em]">
              Editorial, not ornamental
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/72">
              The shell leans on typography, tonal contrast, and layered surfaces rather than noisy
              widgets or fake charts. That keeps it premium and usable.
            </p>
          </div>
        </div>
      </AdminSurface>
      <EmptyState
        eyebrow="Next stages"
        title="This dashboard stays intentionally honest."
        description="There is still no fabricated analytics layer here. The value of this page is the shell quality, hierarchy, and continuity across the rest of the admin product."
        action={
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/70 px-4 py-2 text-sm text-muted-foreground">
            <FontAwesomeIcon icon={faPalette} className="text-[--color-brand]" />
            Product shell refined without inventing backend data
          </div>
        }
      />
    </AdminPageContainer>
  );
}
