# ZippyCoin Wallet – Version 1.0 (MVP) Release Plan

**Document Version:** 1.0 • **Status:** Final • **Owner:** Wallet Core Team

---

## 🎯  Goals for v1.0 (Launch-MVP)
1. **End-to-End Self-Custody** – Create, import, backup, and restore ZippyCoin wallets.
2. **Core Transfers** – Secure send / receive with QR & address book.
3. **Trust Score Visibility** – Display real-time trust score fetched from devnet Trust Engine.
4. **Cross-Platform Footprint** – Deliver Web (Bolt.new) + Mobile (React-Native) alpha apps.
5. **Security Baseline** – Post-quantum key-gen (Dilithium preview), biometric auth, encrypted storage.

> Anything DeFi, hardware-wallet support, and desktop Electron bundles are **out-of-scope** for v1.0 and scheduled for v1.1+.

---

## 📦  Deliverables
| # | Component | Description | Owner |
|---|-----------|-------------|-------|
| 1 | `wallet-web` | Bolt.new web PWA using React 18 + Zustand. Implements onboarding, dashboard, send/receive, trust widget. | Frontend Guild |
| 2 | `wallet-mobile` | React-Native (iOS & Android) app with same flows. | Mobile Guild |
| 3 | `@zippycoin/shared` | TypeScript crypto lib (HD wallet, Dilithium preview, utils). Published as npm workspace package. | Crypto Guild |
| 4 | `trust-engine-devnet` | Mock gRPC/REST service returning deterministic trust scores for demo. | Backend Guild |
| 5 | `smart-contracts` | `TrustEngine.sol` unit-tested & deployed to devnet (Hardhat). | Smart-Contract Guild |
| 6 | CI/CD | GitHub Actions matrix to build web, mobile, run tests, and publish preview URLs. | DevOps |

---

## 🗺️  Scope Breakdown & Tasks

### 1  Web Wallet (Bolt.new)
- [ ] Scaffold project per `docs/BOLT_NEW_IMPLEMENTATION_GUIDE.md`.
- [ ] Implement global design system.
- [ ] Finish Welcome → Onboarding → Dashboard journey.
- [ ] Wire Zustand stores to shared crypto lib.
- [ ] Fetch trust score via REST `GET /v1/trust/:address`.
- [ ] Responsive testing (320 → 1440 px).
- [ ] PWA manifest + service-worker (offline caching).

### 2  Mobile Wallet
- [ ] Reuse shared components from `@zippycoin/shared`.
- [ ] Secure storage (Expo SecureStore / Keychain).
- [ ] Face ID / Fingerprint gate on app open.
- [ ] Deep-link & QR scanner.

### 3  Shared Crypto Library
- [ ] BIP32/BIP39 HD key-gen for coin-type 2187.
- [ ] Ed25519 signing + SHA3 hashing.
- [ ] Dilithium-2 experimental signer behind feature flag.
- [ ] Utils: address validation, QR payload generation, fee calc.

### 4  Trust Engine Devnet
- [ ] Dockerfile + NestJS (or Actix) microservice.
- [ ] Seed SQLite with sample trust metrics.
- [ ] REST + WebSocket endpoints.
- [ ] CORS enabled for localhost.

### 5  Smart Contracts
- [ ] Finalise `TrustEngine.sol` storage layout.
- [ ] Hardhat tests ≥ 90 % coverage.
- [ ] Deploy to `1337` devnet; export ABI JSON for web & mobile.

### 6  CI/CD & Tooling
- [ ] Web build (Vite) → GitHub Pages preview.
- [ ] Mobile build via EAS CLI; generate OTA bundle.
- [ ] Lint, type-check, unit-test gates.
- [ ] Semver tagging & changelog automation (Release Please).

---

## 📆  Timeline & Milestones
| Week | Milestone | Key Outputs |
|------|-----------|-------------|
| W1  | **Project Kick-off** | Repos & branches created, task boards set. |
| W2  | Shared Crypto Lib α | Key-gen works, unit tests pass. |
| W3  | Web UI α | Onboarding flow clickable, mocked data. |
| W4  | Mobile UI α | Same flows in RN, trust score mocked. |
| W5  | Trust Devnet β | REST/WebSocket live, wallet fetching real data. |
| W6  | Feature Freeze | All P0 issues closed; regression run. |
| W7  | **Release 1.0** | Tag v1.0, publish web PWA, TestFlight & Google β, docs updated. |

---

## ✅  Acceptance Criteria (Definition of Done)
1. **Create Wallet** in <2 min; backup phrase verified.
2. **Send Tx** confirmed on devnet in ≤60 s; UI shows success.
3. **Receive Tx** shows notification & ledger entry.
4. **Trust Score** appears within 2 s of dashboard load.
5. **Security**: zero plaintext secrets in storage; biometric required on sensitive actions.
6. **Tests**: ⩾90 % unit, ⩾80 % E2E passing in CI.
7. **Performance**: Lighthouse PWA score ≥90, bundle <500 KB gz.

---

## 🚀  Bolt.new Prompt Snippet
Paste this into Bolt.new to bootstrap the web wallet:
```bash
npx create-bolt-app zippycoin-wallet-web \
  --template react \
  --typescript \
  --install "react-router-dom zustand framer-motion lucide-react recharts qrcode decimal.js"
```
Then copy `/src` from `docs/BOLT_NEW_IMPLEMENTATION_GUIDE.md` examples or import directly from this repository.

---

## 📜  Related Documents
- `docs/PRD_ZIPPYCOIN_WALLET.md` – full product requirements.
- `docs/BOLT_NEW_UI_PLAN.md` – detailed UI & component spec.
- `docs/BOLT_NEW_IMPLEMENTATION_GUIDE.md` – step-by-step Bolt.new guide.

---

*Prepared by the Wallet Core Team — December 2024.* 