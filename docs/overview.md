# Overview

## Purpose

This repository is the **test automation** codebase for executing automated checks against:

- **Mento web app** (`app-mento`) — swap, wallet, settings, amounts, network
- **Mento governance** (`governance`) — proposals, voting, locks, links
- **Squid Router** (`squid-router`) — wallet and swap flows

Tests target deployed environments (production, QA, or custom URLs) and optionally **local forks** of Celo (or related chains) via Anvil for deterministic, low-cost runs.

## Technology stack

| Layer           | Technology                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------- |
| Runtime         | Node.js ≥ 22.14 (see `package.json` `engines`)                                                |
| Package manager | pnpm 10.x (`packageManager` field)                                                            |
| Test runner     | Playwright (`@playwright/test`, pinned with CI Docker image)                                  |
| Wallet E2E      | Synpress (`@synthetixio/synpress`) + MetaMask fixtures                                        |
| Language        | TypeScript (ES modules, `moduleResolution: bundler`)                                          |
| Lint / format   | ESLint 8, Prettier, Husky + lint-staged + pretty-quick                                        |
| On-chain / APIs | ethers v5, viem, `@celo/contractkit`, Hardhat (tooling), optional Foundry **anvil** for forks |
| Reporting       | Playwright HTML reporter; optional Testomat (`@testomatio/reporter`)                          |

## How tests are organized

- **Specs** live under `specs/<app>/web/` or `specs/<app>/api/` and are selected by `APP_NAME`, `SPECS_TYPE`, and optional `SPECS_REGEX` / `SPECS_DIR` (see [Running tests](running-tests.md)).
- **Implementation** (pages, services, helpers, contracts) lives under `src/` and is composed at runtime by the **assembler** and Playwright **fixtures** (see [Test architecture](test-architecture.md)).

## External references

- High-level process and ownership may be described in internal docs (e.g. Notion — linked from the root README).
- Application URLs and chain defaults are centralized in `src/constants/magic-strings.constants.ts` (see [Environment variables](environment-variables.md)).
