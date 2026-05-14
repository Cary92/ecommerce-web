# AGENTS.md

## Stack

- Angular 19 (standalone components, functional interceptors/guards, `inject()`)
- NgRx Store (cart only)
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Cypress for E2E, Karma/Jasmine for unit tests
- FakeStore API (`https://fakestoreapi.com/`) as backend

## Dev Commands

| Action | Command |
|---|---|
| Dev server | `npm start` or `ng serve` (http://localhost:4200) |
| Build | `npm run build` or `ng build` (output: `dist/ecommerce-web`) |
| Unit tests | `npm test` or `ng test` (Karma) |
| Cypress E2E | `npm run cypress:open` or `npx cypress open` |

No lint or format scripts are configured. TypeScript strict mode is on.

## Architecture

Single Angular app. Entry point: `src/main.ts`. Config: `src/app/app.config.ts`.

### Feature routing (`src/app/app.routes.ts`)

- `/` → redirects to `/products`
- `/products` → lazy `LayoutComponent`, child routes: `list` (product list), `details/:id`
- `/login` → lazy `LoginComponent`
- `/checkout` → lazy `CheckoutComponent`, guarded by `checkoutGuard` (requires auth)

### Core layer (`src/app/core/`)

- **Services**: `BaseService` (generic HTTP CRUD), `AuthService` (login via FakeStore `/auth/login`, token/user in `localStorage`)
- **Interceptors**: `tokenInterceptor` (adds `Bearer` token), `errorInterceptor` (shows toast on HTTP errors)
- **Guards**: `checkoutGuard` (redirects to `/login?returnUrl=/checkout` if not authenticated)
- **Store**: NgRx cart reducer (`core/store/cart/`) — actions: addToCart, removeFromCart, updateQuantity, clearCart, toggle/open/close cart
- **Interfaces**: Product, CartItem, CartState, User, Toast

### Shared layer (`src/app/shared/`)

Components: `product-card`, `toast`, `rating-star`
Directives: `add-to-cart`
Pipes: `short-description`

## Backend

All data comes from FakeStore API. Both `environment.ts` and `environment.development.ts` point to `https://fakestoreapi.com/`. No separate local API or mock server.

Test credentials (from README):
- `johnd` / `m38rmF$`
- `kevinryan` / `kev02937@`

## E2E Tests

Cypress specs in `cypress/e2e/`:
- `Emmcomerce.spec.cy.ts` — intercepts product API, validates response schema
- `login.spec.cy.ts` — malformed (nested `it` blocks, dangling code after `});`). Will fail or skip silently in Cypress runner. Do not trust this file as reference for working tests.

Cypress runs against `http://localhost:4200` — dev server must be running first. No `baseUrl` configured in `cypress.config.ts`.

## Styling

Tailwind CSS v4 imported via `@use 'tailwindcss'` in `src/styles.scss`. Config file `tailwind.config.js` exists but Tailwind v4 uses CSS-first configuration; the JS config may be legacy. Component styles use SCSS (`angular.json` schematics set `style: "scss"`).

## Build Config

- Default `ng serve` uses `development` config (no optimization, source maps, swaps in `environment.development.ts`).
- Default `ng build` uses `production` config (budgets: 500kB warn / 1MB error initial, 4kB/8kB per-component style).
- Analytics disabled in `angular.json` (`cli.analytics: false`).

## Notes

- No CI workflows, pre-commit hooks, or task runner configured.
- No ESLint, Prettier, or Husky present.
- `.angular/cache` is git-ignored; safe to delete if build issues occur.
