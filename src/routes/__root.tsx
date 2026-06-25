import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VAR Algérie — Moniteurs VAR, PC VAR & Matériel Informatique" },
      { name: "description", content: "VAR Algérie : achat en ligne de moniteurs VAR, PC de bureau VAR, ordinateurs All-In-One et accessoires informatiques de la marque VAR. Prix DZD, livraison 69 wilayas, paiement à la livraison." },
      { name: "author", content: "AUDAX Technology — Distributeur officiel VAR Algérie" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "keywords", content: "VAR, marque VAR, VAR Algérie, moniteur VAR, écran VAR, PC VAR, ordinateur VAR, VAR N22, VAR T24M, VAR XPS22F, VAR XPS22M, VAR GS24, matériel informatique VAR, informatique Algérie, ordinateur de bureau Algérie, écran PC Algérie, AUDAX Technology, vente informatique Alger, livraison 69 wilayas" },
      { name: "geo.region", content: "DZ" },
      { name: "geo.placename", content: "Algérie" },
      { property: "og:locale", content: "fr_DZ" },
      { property: "og:site_name", content: "VAR Algérie" },
      { property: "og:title", content: "VAR Algérie — Moniteurs VAR, PC VAR & Matériel Informatique" },
      { property: "og:description", content: "Distributeur officiel de la marque VAR en Algérie : moniteurs, ordinateurs de bureau, All-In-One et accessoires informatiques VAR. Livraison 69 wilayas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@AudaxTechnology" },
      { name: "twitter:title", content: "VAR Algérie — Moniteurs VAR, PC VAR & Matériel Informatique" },
      { name: "twitter:description", content: "Achetez la marque VAR en Algérie : moniteurs, ordinateurs et accessoires informatiques. Livraison 69 wilayas, paiement à la livraison." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/36f8ff3a-ef44-4088-8024-162f566ac223/id-preview-db0c71d3--5e675ebe-eb94-4865-9c1c-42ac3d3fb33f.lovable.app-1781516326984.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/36f8ff3a-ef44-4088-8024-162f566ac223/id-preview-db0c71d3--5e675ebe-eb94-4865-9c1c-42ac3d3fb33f.lovable.app-1781516326984.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr-DZ">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
