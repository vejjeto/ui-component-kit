# ForgeUI — `ui-component-kit`

100% static/edge React 19 + Next.js 15 design system with 12 WAI-ARIA accessible primitives, zero-FOUC CSS tokens, TanStack Table v8, interactive WCAG 2.1 contrast checker, and a Shadcn Registry (`/r/*.json`).

## 1. Arquitectura & Stack
- **Framework**: Next.js 15 (App Router, React Compiler `reactCompiler: true`) + React 19 + TypeScript (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- **UI & Estado**: Tailwind CSS v3 + `cva` + Radix Slot + TanStack Table v8 (`@tanstack/react-table`) + Zustand (`localStorage` persistence) + TanStack Query.
- **Calidad & Seguridad**: Biome (`npm run lint` / `npm run format`), Pino JSON logger con redacción de secretos, Zod env validation (`src/lib/env.ts`), RFC 7807 `application/problem+json` (`src/lib/problem-details.ts`), headers de seguridad en `next.config.mjs`.

## 2. Los 12 Primitivos + Rutas
- **Componentes (`src/components/forge/`)**: `Button`, `Input` (`TextField`), `Modal`, `DropdownMenu`, `Tabs`, `Toast`, `Tooltip`, `Accordion`, `Combobox`, `DatePicker`, `DataTable` (TanStack Table v8), `CommandPalette` (`⌘K`).
- **Rutas**:
  - `/` — Landing + Mini-Dashboard Showcase.
  - `/demo` — Consola interactiva dedicada (`MiniDashboardShowcase`).
  - `/docs` — Catálogo de 12 componentes + **WCAG 2.1 Contrast Checker** (`src/core/wcag.ts`).
  - `/docs/[slug]` — Props Playground en vivo, código TSX generado, contrato WAI-ARIA y comando `npx shadcn@latest add`.
  - `/r/index.json` & `/r/[slug].json` — Shadcn Registry estático.
  - `/api/health`, `/api/openapi.json`, `/api/docs` (Scalar OpenAPI 3.1.0).

## 3. Desarrollo Local (Zero DB, Zero Docker)
```bash
cp .env.example .env.local
npm run dev
```
La aplicación corre en `http://localhost:3002` sin base de datos ni contenedores; los presets personalizados y snapshots se persisten localmente en `localStorage`.

## 4. Verificación & Tests
```bash
npm run format
npm run lint
npm run typecheck
npm run test
SKIP_ENV_VALIDATION=true npm run build
```
- **Unit (`tests/unit/ui-kit.test.tsx`)**: Vitest + Testing Library + `jsdom` (navegación por teclado en `DropdownMenu` y `Tabs`, focus trap + `Escape` en `Modal`, sorting/filtering en `DataTable`, matemática WCAG 2.1, `fuzzy.ts`, `date-utils.ts`, `/api/health` y RFC 7807).
- **E2E (`tests/e2e/smoke.spec.ts`)**: Playwright (`npm run test:e2e`) validando `/`, `/demo`, `/docs/button`, `/r/button.json`, `/api/health` y `/api/docs`.

## 5. Shadcn Registry CLI
Cada componente puede instalarse directamente desde `/r/<slug>.json`:
```bash
npx shadcn@latest add http://localhost:3002/r/button.json
```
