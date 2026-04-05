# B2B Status & Access Model — Single Source of Truth (v2)

> **MANDATORY REFERENCE.** This document is the single source of truth for all B2B-related logic.
> It must be respected in: backend logic, WooCommerce integration, admin plugin, API behavior, UI behavior.
> Do not invent alternative models. Do not simplify or merge states.

---

## Core Model

Two **independent** dimensions. They must never be merged or inferred from each other.

### 1. `b2b_status` — Business Relationship

| Value | Meaning |
|---|---|
| `none` | No relationship established |
| `prospect` | Contact form submitted; initial stage |
| `qualified` | Qualified lead |
| `customer` | Active paying customer |

### 2. `b2b_access_status` — Portal Access

| Value | Meaning |
|---|---|
| `none` | No access request made |
| `requested` | User has requested portal access |
| `approved` | Access approved (pending activation) |
| `rejected` | Access denied |
| `active` | Full portal access granted |

---

## Strict Rules

- **NEVER** merge `b2b_status` and `b2b_access_status` into a single field.
- **NEVER** infer one from the other.
- **NEVER** use `b2b_status` for access control.
- Access is granted **ONLY** if: `b2b_access_status = active`.

---

## Flow Rules

| Trigger | Effect |
|---|---|
| Contact form submitted | `b2b_status = prospect` — does **not** touch `b2b_access_status` |
| Access request submitted | `b2b_access_status = requested` |
| Manual approval | `requested → approved → active` |

---

## UX Rule — Exact Success Message

The following message must be shown **exactly** after contact form submission. No variations allowed:

> "Vielen Dank – Ihre Anfrage ist bei uns eingegangen.
> Wir prüfen diese und melden uns zeitnah persönlich bei Ihnen."

---

## Data Rules

- UID stored in **both**: `billing.vat_id` AND `meta_data.vat_id`
- All B2B fields stored as WooCommerce user meta
- Optional timestamps: `b2b_access_requested_at`, `b2b_access_approved_at`

---

## Working Rule for Future Tasks

For every B2B-related task:

1. Check compliance with this spec.
2. Explicitly confirm compliance.
3. Do not invent alternative logic.

This spec is mandatory.
