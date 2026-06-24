# bug.md – Project‑Wide Issues

## 📦 Backend (Node/Express)

| # | File / Route | Issue / Symptom | Impact | Suggested Fix |
|---|--------------|----------------|--------|----------------|
| B1 | `backend/package.json` | Duplicate `"test"` script & malformed JSON caused `npm run seed` to fail. | Prevents any `npm` script execution (seed, dev). | Consolidate scripts block to a single `"test"` entry and ensure valid JSON (already fixed). |
| B2 | `backend/server.js` – `useMemoryStore` fallback | When MongoDB is offline the API silently switches to in‑memory data. No warning UI on frontend. | Users may think data is persisted when it isn’t. | Expose `dbMode` in health endpoint (already does) and display a banner in UI when `memory` mode. |
| B3 | `backend/server.js` – `/api/artworks/:id` error handling | Returns generic `500` on any error, losing original stack trace. | Hard to debug client‑side failures. | Log the error (`console.error(err)`) before sending response, and include a friendly message. |
| B4 | Auth helpers (`findUserByEmail`, `createUser`) | No validation of email format or password strength. | Insecure registrations. | Add server‑side validation (e.g., regex for email, minimum password length). |
| B5 | `createUser` – password hashing | Uses `bcrypt.genSalt(10)` which is fine, but the salt round is hard‑coded. | May be too low for production security. | Move salt rounds to env var (`BCRYPT_ROUNDS`). |
| B6 | Missing index on frequently queried fields (`email`, `artist` reference) | Could cause performance bottlenecks on large datasets. | Slower DB queries. |
| B7 | No rate‑limiting / brute‑force protection on `/api/auth/login`. | Vulnerable to credential stuffing. | Integrate a simple throttle (e.g., `express-rate-limit`). |
| B8 | No validation of request bodies (e.g., missing Joi/express‑validator). | Bad data could be stored, causing crashes downstream. | Use a validation middleware for all POST/PUT routes. |
| B9 | `seed.js` – no check for existing artists before creating duplicates (uses `findOne` but may create many if same name different case). | Duplicate artist entries. | Normalize artist names (lowercase) before lookup. |
| B10 | `seed.js` – hard‑coded price conversion (multiply by 2000) in `server.js` for USD. | Not accurate and may break if conversion changes. | Move conversion logic to a utility with a configurable rate. |

## 🎨 Frontend (React + Vite)

| # | Component / File | Issue / Symptom | Impact | Suggested Fix |
|---|------------------|----------------|--------|----------------|
| F1 | `Navbar.jsx` – Mobile menu button (`className="mobile-menu-btn"`) has `display: none` inline style, never becomes visible. | Mobile navigation is inaccessible. | Users on small screens cannot navigate. | Add responsive CSS (e.g., Tailwind or media query) to show button at breakpoints < 768 px. |
| F2 | `Navbar.jsx` – Dropdown `onClick` on avatar toggles `dropdownOpen` but does not close on navigation change. | Dropdown may stay open after route change. | Add `useEffect` listening to `location.pathname` to close dropdown. |
| F3 | `Navbar.jsx` – `handleLogout` removes token, but does not clear axios default auth header. | Subsequent API calls may still send stale token. | Clear `axios.defaults.headers.common['Authorization']` after logout. |
| F4 | `Navbar.jsx` – `initials` calculation assumes `user.name` exists; could error if `user` is object without `name`. | Runtime error on malformed user data. | Guard with `user?.name?.split(' ')?.[0]` or fallback. |
| F5 | `Navbar.jsx` – Inline `onMouseOver`/`onMouseOut` handlers mutate style directly, causing re‑render performance hit. | Minor performance cost, harder to maintain. | Replace with CSS `:hover` classes. |
| F6 | `App.jsx` (not shown) likely contains hard‑coded API URL (`http://localhost:5000`). | Breaks when backend runs on different host/port. | Use environment variable (`VITE_API_URL`). |
| F7 | No error boundaries around data‑fetching components. | Uncaught promise rejections crash the UI. | Wrap critical components in an `ErrorBoundary`. |
| F8 | Missing `alt` attributes on images (e.g., artwork cards). | Accessibility violation. | Add descriptive `alt` text. |
| F9 | Buttons (e.g., “Add to Cart”) lack `type="button"`; default to `type="submit"` inside forms causing unintended submissions. | Unexpected page reloads. | Explicitly set `type="button"`. |
| F10 | No loading states for async calls (e.g., fetching artworks). | UI appears blank during network latency. | Introduce spinner or skeleton placeholders. |
| F11 | `useEffect` in several components does not include all dependencies (`loadUser` function not memoized). | Lint warning (`react-hooks/exhaustive-deps`). | Add dependencies or memoize functions. |
| F12 | `src/pages` folder not listed – likely contains route components. If any `Link` components miss the `to` prop, navigation fails. | Broken navigation. | Verify all `Link` usages have valid `to`. |
| F13 | `src/components` only contains `Navbar.jsx`; other UI components may duplicate styles inline instead of using CSS modules or Tailwind, leading to inconsistent design. | Visual inconsistencies. | Refactor common styles into CSS variables / Tailwind utility classes. |
| F14 | No unit tests for critical components (auth flow, artwork card). | Regression risk. | Add Jest + React Testing Library tests. |

## ⚙️ Configuration & Miscellaneous

| # | File / Setting | Issue | Impact | Fix |
|---|----------------|-------|--------|-----|
| C1 | `backend/package.json` – missing `"engines"` field. | Node version mismatch may arise. | Runtime errors on older node versions. | Add `"engines": {"node": ">=20"}`. |
| C2 | No `.env.example` file for developers. | New developers must guess env var names. | Onboarding friction. | Add a sample file with `MONGO_URI`, `JWT_SECRET`, `PORT`. |
| C3 | `frontend/vite.config.js` uses default port (5173); no proxy config for API. | In production you may need a proxy. | Deployment configuration complexity. | Add Vite proxy: `{ '/api': { target: 'http://localhost:5000', changeOrigin: true } }`. |
| C4 | `README.md` does not mention the seed script or memory fallback mode. | Users may be confused about how to populate data. | Poor documentation. | Update README with seeding instructions (already partly done in `run.md`). |
| C5 | `run.md` duplicate sections (backend and frontend steps) but no explicit “seed” subsection. | Users may miss the seed step. | Add a clear “Seed the database” step (already present in `run.md`). |
| C6 | No lint script for backend (only frontend). | Code style inconsistencies. | Harder maintainability. | Add `"lint": "eslint . --ext .js"` to backend scripts. |

## 🐞 Runtime Logs (Observed While Servers Run)

- **Backend console** repeatedly shows `⚠️ MongoDB offline — using memory mode` after initial startup, indicating the MongoDB service is not reachable.
  - **Fix**: Start MongoDB, check `MONGO_URI`, or ensure the container/VM has network access.
- **Frontend console** shows occasional React warning: `Warning: Each child in a list should have a unique "key" prop.` (likely in a map over artworks).
  - **Fix**: Ensure `key={art.id}` (or `_id`) is supplied.
- **Frontend console** prints `Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'map')` when the API returns an empty array or fails.
  - **Fix**: Guard against undefined (`artworks?.map`) and display fallback UI.

---

*Feel free to prioritize any of the above items or ask for specific fixes to be applied.*
