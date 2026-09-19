# Add a real "Admin" access tier

## Goal
Introduce a real middle **Admin** role between Business Owner and Super Admin, with a clear, enforced permission boundary — not just a display label. No theme or UI redesign; reused existing components and patterns.

## Permission model
Already documented on the `/admin/users` permissions card; we make it enforced:

| Capability | Admin | Super Admin |
|---|---|---|
| Dashboard overview, analytics, usage/costs | ✅ | ✅ |
| Manage & edit businesses, manage leads, preview, regenerate, publish | ✅ | ✅ |
| Generate website (create) | ❌ | ✅ |
| Templates | ❌ | ✅ |
| Users & roles | ❌ | ✅ |
| Subscriptions / billing | ❌ | ✅ |
| Global settings | ❌ | ✅ |
| Delete / suspend business | ❌ | ✅ |

Admins never see other businesses' private dashboards (`/owner` is owners + super-admin only). Super Admin continues to override everything.

## Changes (by file)

### Auth core
- `src/features/auth/auth.types.ts` — add `"admin"` to `UserRole`.
- `src/features/auth/useAuth.ts` — add `isAdmin`, `isStaff` (= admin || super-admin); replace `unlockSuperAdmin` with `unlockWithPasscode`.
- `src/features/auth/auth.service.ts`
  - Add `ADMIN_PASSCODE = "iamadmin"` (temporary, alongside `SUPER_ADMIN_PASSCODE`).
  - Replace `unlockSuperAdmin(code): boolean` with `unlockWithPasscode(code): UserRole | null` — returns `"super-admin"` for `iamsuperadmin`, `"admin"` for `iamadmin`, else `null`. Which passcode is entered decides the granted role.
  - Keep simulated Google sign-in → `business-owner` (owners aren't staff).
- `src/features/auth/permissions.ts` (new) — single source of truth:
  - `STAFF_ROLES: UserRole[] = ["admin", "super-admin"]`
  - `SUPER_ADMIN_ONLY = new Set([...])` actions
  - `adminNavForRole(role): NavItem[]` — returns the admin nav filtered to allowed items (Admin: Dashboard, Businesses, Analytics, Usage & costs).
  - `can(role, action): boolean` for actions: `generate`, `templates`, `users`, `billing`, `settings`, `delete`, `suspend`.
- `src/features/auth/index.ts` — export the new permissions helpers.

### Gate component
- `src/features/auth/components/RequireRole.tsx` — support an array: add `roles?: UserRole[]` (falls back to `[role]`). Access granted if current is in the list OR `current === "super-admin"`. Keep the passcode/Google fallback card unchanged.

### Admin layout & routes
- `src/routes/admin.tsx` — gate becomes `<RequireRole roles={["admin","super-admin"]}>`. Component reads `useAuth().role` and passes `adminNavForRole(role)` to `AppShell`. `roleLabel` reflects "Super Admin" or "Admin" from the session.
- `src/routes/admin.navigation` filtering is centralized via `permissions.ts` (the existing `adminNav` array stays the source list).
- Super-admin-only pages wrap their content in `<RequireRole role="super-admin">` (renders an inline restricted card if an Admin reaches the URL directly): `admin.generate`, `admin.templates`, `admin.users`, `admin.subscriptions`, `admin.settings`.
- `src/routes/admin.businesses.$id.tsx` — conditionally render the **Danger zone** (Delete + Suspend) only when `can(role, "delete")`. Publish / Regenerate / Preview stay for both staff roles.

### Unlock dialog
- Rename `SuperAdminPasscodeDialog` → `StaffPasscodeDialog` (update `BrandMark`, `RequireRole`, `index.ts` imports).
- Single passcode input (no toggle): on submit call `unlockWithPasscode(code)`; if it returns a role, toast `"${role === 'super-admin' ? 'Super Admin' : 'Admin'} unlocked"` and navigate to `/admin`. Title: "Enter Staff Passcode". Same styling.

### Landing page
- `src/routes/index.tsx` — show the dashboard affordance for `isStaff` (admins too), routing staff to `/admin`. Replace `isOwner || isSuperAdmin` checks with `isOwner || isStaff` where they gate the dashboard link/CTA.

## Out of scope (explicitly)
- No real backend/auth provider — the passcode is still a temporary client-side stand-in, clearly flagged as replaceable. Architecture remains Supabase-ready.
- No changes to owner dashboards beyond keeping admins out of them.
- No theme/visual changes; reused existing cards, dialogs, and nav.

## Validation
- Typecheck clean (the gated `UserRole` flows through `useAuth`, `RequireRole`, and nav).
- Playwright: enter `iamadmin` via the logo easter-egg dialog → lands on `/admin` with the reduced nav (no Generate/Templates/Users/Subscriptions/Settings); open a business → Danger zone hidden; confirm super-admin passcode still shows full nav + danger zone; confirm `/owner` is blocked for an admin.
