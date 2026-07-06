# Task List: Full-Stack Data & Database Integration

This checklist tracks our progress as we wire up the frontend, backend, and persistent database file storage.

- `[x]` **Step 1: Backend Database File Persistence**
  - [x] Implement `fs` read/write operations inside `manikya-backend/src/services/mockDb.ts`
  - [x] Initialize persistent `db.json` with pre-seeded data if it does not exist
  - [x] Verify backend server starts and parses the local JSON file database successfully

- `[x]` **Step 2: Create Backend Requirements API Endpoints**
  - [x] Create `manikya-backend/src/controllers/requirementsController.ts` to manage requirements CRUD
  - [x] Register new requirements endpoints inside `manikya-backend/src/routes/api.ts`
  - [x] Test the backend routes manually using curl

- `[x]` **Step 3: Build Frontend API Client**
  - [x] Install `axios` dependency in `manikya-nest-next`
  - [x] Create `manikya-nest-next/src/lib/apiClient.ts` to centralize `axios` calls to `http://localhost:4000/api`

- `[x]` **Step 4: Connect Frontend UI to Backend REST API**
  - [x] Integrate `apiClient` inside `src/lib/demoAuth.ts` to pull/push profile sessions from the backend
  - [x] Integrate `apiClient` inside `src/lib/requirements.ts` to fetch and submit seeker requirements
  - [x] Run next production build to check for compilation/type success

- `[x]` **Step 5: Design Premium SaaS Real Estate CRM Dashboard ("FindWay")**
  - [x] Create Left Sidebar Layout and navigation screens
  - [x] Implement Top Sticky Navigation (Search, Quick Add, Notifications, Profile)
  - [x] Create role-based dashboards (Admin, Builder, Agent, Owner, Customer)
  - [x] Integrate high-fidelity widgets: Kanban pipelines, SVG charts, and interactive task checklists
  - [x] Run final production build compilation check to confirm type correctness
