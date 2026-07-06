# Developer Guide: Dummy Users & Implementing "Add to List" (Wishlist)

To keep your development process as simple as possible, we have pre-seeded dummy accounts and structured the backend database persistence so you can easily write your own "Add to List" (Wishlist) flow.

---

## 1. Seeded Dummy User Accounts

These profiles are saved in both the client-side session store (**[demoAuth.ts](file:///c:/Users/mahad/OneDrive/Desktop/new%20manikya_app/manikya-nest-next/src/lib/demoAuth.ts)**) and the backend database (**[db.json](file:///c:/Users/mahad/OneDrive/Desktop/new%20manikya_app/manikya-backend/data/db.json)**):

### Account A (Landlord / Seeker)
* **Name**: Ravi Sharma
* **Email**: `ravi@findway.demo`
* **Phone**: `9000000001`
* **Password**: `demo1234`
* **OTP**: `1234`
* **Roles**: Tenant, Owner
* **Default View**: Personal (Seeker)

### Account B (Agent / Builder)
* **Name**: Meera Kapoor
* **Email**: `meera@findway.demo`
* **Phone**: `9000000002`
* **Password**: `demo1234`
* **OTP**: `1234`
* **Roles**: Agent, Builder
* **Default View**: Business (Provider)

---

## 2. Database Structure for Wishlists

In your backend database (**[db.json](file:///c:/Users/mahad/OneDrive/Desktop/new%20manikya_app/manikya-backend/data/db.json)**), each listing has a unique ID (e.g. `"nest-101"`). You can model wishlists in `db.json` by adding a `wishlists` key that maps a user's ID to their wishlisted properties:

```json
{
  "wishlists": [
    {
      "id": "wish-1",
      "userId": "demo-9000000001",
      "listingId": "nest-101"
    }
  ]
}
```

---

## 3. How to Implement "Add to List" (Wishlist) Flow

Here is a simple template guide of the code you can write to implement the saving interaction:

### Step 3.1. Frontend Axios API Call (e.g., in `ListingCard.tsx`)
When a user clicks the heart icon on a property card:
```typescript
import { apiClient } from "@/lib/apiClient";
import { useSession } from "@/lib/useSession";

// Inside ListingCard component:
const session = useSession();

const handleToggleSave = async () => {
  if (!session) {
    alert("Please log in to save properties!");
    return;
  }

  try {
    const res = await apiClient.post("/wishlist", {
      userId: session.id,
      listingId: id // ListingCard prop id
    });
    
    if (res.data.success) {
      setSaved(true);
    }
  } catch (err) {
    console.error("Failed to add to list:", err);
  }
};
```

### Step 3.2. Backend Endpoint (e.g. in `manikya-backend/src/routes/api.ts`)
Create a route to handle the wishlist requests:
```typescript
// Register in routes/api.ts
router.post("/wishlist", (req, res) => {
  const { userId, listingId } = req.body;
  
  // Save to db.json via mockDb helper
  const success = db.saveToWishlist(userId, listingId);
  
  res.json({ success });
});
```

### Step 3.3. Database Helper (e.g., in `manikya-backend/src/services/mockDb.ts`)
Add a function inside your database service to append and persist the data:
```typescript
class MockDatabase {
  private wishlists: Array<{id: string; userId: string; listingId: string}> = [];

  saveToWishlist(userId: string, listingId: string): boolean {
    this.load(); // Refresh data from db.json
    
    const newWish = {
      id: `wish-${Date.now()}`,
      userId,
      listingId
    };
    
    this.wishlists.push(newWish);
    this.save(); // Write back to db.json
    return true;
  }
}
```
---

Using this simple, unified REST pattern, you can connect wishlists, applications, and logs between the frontend and database seamlessly!
