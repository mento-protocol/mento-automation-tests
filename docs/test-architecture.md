# Test architecture

## Playwright fixtures

`src/fixtures/test.fixture.ts` extends Synpress’s MetaMask fixtures and registers:

- **`metamaskHelper`** — wraps Synpress `metamask` for flows and assertions
- **`contractHelper`** — on-chain / contract interactions (`ContractHelper`)
- **`web`** — full **web** stack: browser, pages, services for the current `APP_NAME`
- **`api`** — HTTP + GraphQL clients and app-specific API surface

The exported **`testFixture`** and **`expect`** are what specs and `test.helper` use instead of raw `@playwright/test` in wallet flows.

## Assembler (factory)

`src/helpers/assembler/assembler.helper.ts` builds either a **web** graph or an **api** graph depending on constructor dependencies:

- **Web path:** `ElementFinderHelper`, `BrowserHelper`, `MetamaskHelper`, `ContractHelper`
- **API path:** `HttpClient`, `GraphQLClient`

The active application is determined by **`envHelper.getApp()`** (`APP_NAME`). Each app exposes a different shape under `web.app` (e.g. `appMento`, `governance`, `squidRouter`) — TypeScript models these as a **union** (`WebApp`), so specs that touch `web.app.appMento` are only valid when `APP_NAME` is `app-mento`.

## Test suite helper

`src/helpers/test/test.helper.ts` wraps `testFixture.describe` / `test` / `skip`:

- **`runSuite`** — suite name, tags, optional `beforeAll` / `afterAll` (API-only context), `beforeEach` / `afterEach`, retry config, and a list of **`ITest`** cases
- **`runTest`** — single test with optional **disable** conditions (`IDisable`) keyed by env or chain
- **`skipInRuntime`** — dynamic skip with annotations

Types live in `src/helpers/test/test.types.ts` (`IExecution`, `ITest`, `ISuiteArgs`, …).

## Page objects, services, elements

Typical pattern:

- **`*Page`** — locators and simple interactions tied to a route or component
- **`*Service`** — user flows calling pages, MetaMask, and browser helpers
- **Elements** (`src/apps/shared/web/elements/`) — reusable controls (buttons, inputs, dropdowns) with shared base behavior

Shared cross-app pieces (e.g. connect wallet modal, Celoscan links) live under **`src/apps/shared/`**.

## Contracts

`src/apps/shared/contracts/` contains helpers such as **`base.contract.ts`** and **`governance.contract.ts`** for interacting with deployed contracts during tests (proposals, execution, etc.).

## Synpress cache

Wallet extension state is built with:

```bash
pnpm run build:synpress-cache
```

This must be re-run when **`IS_MAINNET`** or fork-related chain configuration changes materially, so MetaMask and dApp chain IDs stay aligned.
