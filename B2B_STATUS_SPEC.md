# B2B Status & Access Model — Single Source of Truth

> **MANDATORY REFERENCE.** This document defines the data model for all B2B-related logic.
> It must be respected in: backend logic, WooCommerce integration, admin plugin, API behavior, UI behavior.
> Do not invent alternative models. Do not simplify or merge states.

---

## Data Model

### 1. `b2b_status` — Business Relationship

| Value | Meaning |
|---|---|
| `none` | No relationship established |
| `prospect` | Contact form submitted; initial stage |
| `qualified` | Qualified lead |
| `customer` | Active paying customer |

**Rules:**
- Default: `prospect` when a new contact form is submitted.
- Must **NOT** be automatically changed by access requests.
- Managed independently of `b2b_access_status`.

---

### 2. `b2b_access_status` — Portal Access

| Value | Meaning |
|---|---|
| `none` | No access request made |
| `requested` | User has requested portal access |
| `approved` | Access approved (pending activation) |
| `rejected` | Access denied |
| `active` | Full portal access granted |

**Rules:**
- Independent from `b2b_status`.
- Must **not** override the business relationship.
- Controlled via request + manual approval only. Never auto-approved.

---

### Optional Timestamp Fields

| Field | Set when |
|---|---|
| `b2b_access_requested_at` | `b2b_access_status` → `requested` |
| `b2b_access_approved_at` | `b2b_access_status` → `approved` or `active` |

---

## Process Rules

| Trigger | Effect |
|---|---|
| Contact form submitted | `b2b_status = prospect` — does **not** touch `b2b_access_status` |
| Access request submitted | `b2b_access_status = requested` |
| Manual approval | `b2b_access_status = approved` or `active` |
| Active portal user | `b2b_access_status = active` |

---

## Strict Rules

- **NEVER** merge `b2b_status` and `b2b_access_status` into a single field.
- **NEVER** infer one from the other.
- **NEVER** auto-approve access.
- **ALWAYS** treat them as two separate, independent dimensions.

---

## Implementation Requirements

- Use consistent meta keys in WooCommerce user meta (`b2b_status`, `b2b_access_status`, `b2b_access_requested_at`, `b2b_access_approved_at`).
- Ensure both values are **visible** in the admin plugin.
- Ensure both values are **editable** where required (admin side).
- All future flows must follow this model.

---

## Working Rule for Future Tasks

For any task involving B2B logic, user status, or access handling:

1. Refer back to this specification.
2. Validate the approach against it.
3. Explicitly state whether the solution follows the spec.
