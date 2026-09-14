# Architecture

React 18 + TypeScript + Vite + Tailwind + shadcn/ui + React Router.
Frontend only; all data is mocked today.

Move this file to the repo root (next to `package.json`).

## Layers

```
pages/  ->  features/  ->  components/, hooks/, lib/, config/
```

- **pages/** - one file per route. Thin: read state from a feature hook, render.
  Nothing imports from `pages/`.
- **features/** - a business domain. Owns its components, context, hooks, data
  and types. A feature never imports another feature's internals; if two need
  the same thing, it moves down to `components/` or `lib/`.
- **components/** - cross-feature UI. `layout/` is ours; `ui/` is shadcn's.
- **hooks/**, **lib/**, **config/** - domain-free. Safe for anything to import.

## Folder map

```
src/
├── main.tsx                      entry - mounts <App/>
│
├── app/                          app shell
│   ├── App.tsx                   providers + router, nothing else
│   ├── AppProviders.tsx          every global provider, one place, ordered
│   ├── AppRouter.tsx             every <Route>
│   └── routes.ts                 ROUTES constants
│
├── assets/images/                hero-banner.jpg, thumb-1..6.jpg
│
├── components/
│   ├── layout/                   Navbar, PageFooter, PageShell
│   └── ui/                       shadcn-generated. DO NOT HAND-EDIT.
│
├── config/
│   ├── app.config.ts             brand, support email, demo user
│   └── storageKeys.ts            every localStorage key
│
├── features/
│   ├── catalog/                  videos: browse, search, rows, detail
│   │   ├── components/           CategoryRow, VideoCard, VideoDetail,
│   │   │                         HeroBanner, CatalogOverlays, TypeCatalogPage
│   │   ├── context/              VideoLibraryContext.ts + VideoLibraryProvider.tsx
│   │   ├── data/                 videos.mock.ts      <- swap for API later
│   │   ├── hooks/                useVideoLibrary.ts, useCatalogBrowser.ts
│   │   ├── utils/                catalog.ts          <- pure filter/group fns
│   │   └── types.ts
│   ├── my-list/
│   ├── notifications/
│   ├── player/                   VideoPlayer + time formatting
│   └── profile/                  ProfileDropdown
│
├── hooks/                        generic, domain-free
│   ├── useLocalStorage.ts
│   └── use-mobile.tsx            shadcn-generated, kebab-case on purpose
│
├── lib/                          queryClient.ts, utils.ts (cn)
├── pages/                        thin route entries only
├── styles/index.css
└── test/
```

## Conventions

| Rule | Why |
| --- | --- |
| Always import via `@/...`, even same-folder | moving a file never breaks its imports |
| kebab-case filename = shadcn-generated, don't hand-edit | `components/ui/*`, `hooks/use-mobile.tsx` |
| PascalCase = component, camelCase = hook/util/type module | |
| Context is 3 files: `XContext.ts` (createContext + type), `XProvider.tsx`, `hooks/useX.ts` | keeps Vite Fast Refresh working and gives the type a home |
| No path literals - use `ROUTES` from `app/routes.ts` | |
| No localStorage key literals - use `STORAGE_KEYS` | |
| Pure list logic lives in `features/*/utils/`, not inside components | unit-testable without React |

## Global state

All providers are in `app/AppProviders.tsx`, outermost first:

```
QueryClient -> Tooltip -> VideoLibrary -> MyList -> Notifications
```

- **VideoLibrary** - the single copy of the catalog + watch progress.
  Every screen reads it, so progress is consistent across routes.
- **MyList** - saved titles, persisted to localStorage.
- **Notifications** - the bell panel feed.

## Adding things

**A new screen:** add the path to `ROUTES` -> create `pages/Thing.tsx` ->
add a `<Route>` in `app/AppRouter.tsx`. Wrap the body in `<PageShell>`.

**A new browse screen:** call `useCatalogBrowser()` for search/modal state and
render `<CatalogOverlays browser={browser} />`. Don't re-implement it.

**A new global state slice:** create `features/x/context/XContext.ts`,
`XProvider.tsx`, `hooks/useX.ts`, then mount the provider in `AppProviders`.

## Swapping mocks for a real API

React Query is already installed and provided but unused. When the backend
lands:

1. Add `features/catalog/api/catalog.api.ts` - plain fetch functions.
2. Add `features/catalog/hooks/useCatalogQuery.ts` - `useQuery` wrappers.
3. Have `VideoLibraryProvider` read from the query instead of `MOCK_VIDEOS`.
4. Delete `features/catalog/data/videos.mock.ts`.

Nothing outside `features/catalog/` changes, because nothing outside it
imports the mock.
