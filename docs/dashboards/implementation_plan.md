# Implementation Plan — Admin Listings Approval Panel

We will implement an admin approval dashboard to allow authorized users (with `"admin"` role) to review pending property listings and either approve (make live) or reject them.

---

## 1. Context & Architecture
* **Persistence:** The `Listing` schema already has a `status` field that defaults to `"pending_review"` when `AUTO_APPROVE_LISTINGS` is false. We do not need any additional database tables.
* **Backend API:**
  * `PATCH /api/listings/:id/review` is already implemented and protected by the `ensureAdmin` middleware check. It accepts `{ "action": "approve" | "reject" }`.
* **Required Frontend Additions:**
  * **Admin Guard:** Validate that `session.roles` contains `"admin"`.
  * **Admin Listing Feed:** Add a route `/admin` that fetches and lists all properties with `status = "pending_review"` in order.
  * **Approval Buttons:** Add action buttons to approve or reject listings.

---

## 2. Proposed Changes

### Frontend (`manikya-nest-next`)

#### [NEW] [admin/page.tsx](file:///c:/Users/mahad/OneDrive/Desktop/new%20manikya_app/manikya-nest-next/src/app/admin/page.tsx)
Create a page for managing listing review tasks:
* Restrict access: Redirect to `/` if the user is not authenticated or does not have the `"admin"` role.
* Fetch listing reviews queue from `/listings` (filtering for those with `status === "pending_review"`).
* Render each listing's title, price, locality, and photos.
* Render "Approve" (calls review API with `action: "approve"`) and "Reject" (calls review API with `action: "reject"`) buttons for each item.
* Update UI state to remove processed items dynamically.

---

## 3. Verification Plan

### Manual Verification
1. Log in with a user whose role does not include `"admin"` and verify that accessing `/admin` redirects to the home page.
2. Log in with an admin user (e.g. seed data admin account) and access `/admin` to verify the list of pending properties.
3. Submit a new property listing from the wizard. Verify it defaults to `pending_review` status and appears in the admin panel.
4. Click "Approve" on the admin page, verify that the status changes to `live` in the database, and verify it now appears on the public explore feed.
