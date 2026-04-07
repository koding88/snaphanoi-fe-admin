import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { faArrowUpRightFromSquare, faFilm, faLayerGroup, faShieldHalved } from "@/lib/icons/fa";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FOUNDATION_CARDS = [
  {
    title: "UI direction",
    body: "Editorial premium shell with restrained motion and warm contrast, tuned for a photographer-facing business context.",
    icon: faFilm,
  },
  {
    title: "Integration layer",
    body: "Central request foundation, endpoint map, API envelope typing and env helpers are in place for Stage 2 onward.",
    icon: faLayerGroup,
  },
  {
    title: "State baseline",
    body: "Zustand stores are initialized for auth session shape and admin shell behavior without over-expanding scope.",
    icon: faShieldHalved,
  },
];

export function DashboardPlaceholder() {
  return (
    <AdminPageContainer className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Admin foundation"
        title="Shell and system layer are ready."
        description="This dashboard intentionally stays practical for Stage 1. It demonstrates the admin layout, page rhythm, card language, and shared primitives without starting user or role features."
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
      <section className="grid gap-4 lg:grid-cols-3">
        {FOUNDATION_CARDS.map((card) => (
          <article
            key={card.title}
            className="rounded-[2rem] border border-border/80 bg-card/92 p-6 shadow-soft"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl border border-[--color-brand]/20 bg-[--color-brand-soft] text-[--color-brand]">
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <h2 className="mt-5 font-heading text-3xl tracking-[0.04em]">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.body}</p>
          </article>
        ))}
      </section>
      <EmptyState
        title="Feature routes remain intentionally dormant."
        description="Users, roles, auth submission flows, and protected behavior are reserved for later stages. The foundation is structured so those features can land cleanly without refactoring the shell."
      />
    </AdminPageContainer>
  );
}
