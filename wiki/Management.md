# Restaurant & Dish Management (Manager Role)

This page documents all management operations available to **Manager** users — creating, editing, and deleting restaurants and their menu items (products/dishes). Documentation covers both the **Web Client** and the **Mobile App**.

---

## Table of Contents
- [Web Client — Partner Dashboard](#web-client--partner-dashboard)
- [Web Client — Create a Restaurant](#web-client--create-a-restaurant)
- [Web Client — Edit & Delete a Restaurant](#web-client--edit--delete-a-restaurant)
- [Web Client — Menu Management (Products)](#web-client--menu-management-products)
- [Mobile App — Manager Home](#mobile-app--manager-home)
- [Mobile App — Create a Restaurant](#mobile-app--create-a-restaurant)
- [Mobile App — Restaurant Details (Edit & Delete)](#mobile-app--restaurant-details-edit--delete)
- [Mobile App — Menu Management (Products)](#mobile-app--menu-management-products)

---

## Web Client — Partner Dashboard

After logging in as a **Manager**, you are redirected to the **Partner Dashboard**. This area displays all restaurants you own and provides management controls for each one.

![Partner Dashboard](../images_for_README/3.png)

From the dashboard, you can:
- View all your restaurants at a glance
- **Create** a new restaurant
- **Edit** an existing restaurant's details
- **Delete** a restaurant
- **Manage Menu** — add, edit, or delete products/dishes

---

## Web Client — Create a Restaurant

1. In the Partner Dashboard, click the **"+ Create Restaurant"** button.
2. In the modal form that opens, fill in the restaurant details:
   - **Restaurant Name**
   - **Description**
   - **Restaurant Image** (upload a photo)
   - **Category** (e.g., Sushi, Burgers, Pizza, Italian, etc.)
   - **Location** (latitude & longitude) — used for customer distance calculations
   - **Delivery Time** (e.g., "20-30 min")
   - **Delivery Price** (in ₪)
3. Click **Save** to create the restaurant.

![Create Restaurant Modal](../images_for_README/2.png)

> [!NOTE]
> Only **Manager** accounts can create restaurants. The authorization middleware enforces role-based access control on all restaurant management endpoints.

---

## Web Client — Edit & Delete a Restaurant

Each restaurant card in the Partner Dashboard provides **Edit** and **Delete** buttons:

- **Edit**: Opens a form pre-filled with the restaurant's current details. Modify any field and save.
- **Delete**: Removes the restaurant and all its associated products from the system.

> [!IMPORTANT]
> **Ownership check**: Only the manager who created the restaurant can edit or delete it. The system enforces strict ownership verification through middleware.

---

## Web Client — Menu Management (Products)

To manage a restaurant's menu, click **"Manage Menu"** on the restaurant card in the Partner Dashboard.

### Menu Manager View

The menu manager screen shows all products (dishes) for the selected restaurant. From here, you can add new items, edit existing ones, or delete products.

![Menu Manager](../images_for_README/3_1.png)

### Adding a New Product

1. Click **"Add Product"** to open the product creation form.
2. Fill in the product details:
   - **Product Name** (e.g., "Classic Cheeseburger")
   - **Price** (in ₪)
   - **Description** (ingredients, size, etc.)
   - **Product Image** (upload a photo)
   - **Category**
3. Click **Save** to add the product to the restaurant's menu.

![Add Product Modal](../images_for_README/4.png)

### Editing & Deleting Products

- **Edit**: Click the edit button next to any product to modify its name, price, description, or image.
- **Delete**: Click the delete button to permanently remove the product from the menu.

---

## Mobile App — Manager Home

When a **Manager** logs in to the mobile app, the home screen includes an **"+ Add New Restaurant"** button at the top. If no restaurants exist yet, a friendly empty state is displayed.

| Manager Home (Empty) | Manager Home (With Restaurants) |
|:---:|:---:|
| ![Manager Home Empty](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.24.jpeg) | ![Manager Home With Restaurants](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.36%20(1).jpeg) |

---

## Mobile App — Create a Restaurant

1. Tap **"+ Add New Restaurant"** on the home screen.
2. A full-screen form slides up with the following fields:
   - **Restaurant Name** (required)
   - **Category** — select from: 🍣 Sushi, 🍔 Burgers, 🍕 Pizza, 🌮 Mexican, 🍝 Italian, 🍽️ Other
   - **Description** — briefly describe the restaurant
   - **Delivery Time** (e.g., "20-30 min")
   - **Delivery Price** (in ₪)
   - **Latitude** and **Longitude** (required — for distance calculations)
3. Tap **"Save Restaurant"** to create it.

![Mobile New Restaurant Form](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.36%20(2).jpeg)

---

## Mobile App — Restaurant Details (Edit & Delete)

Tapping on a restaurant card takes you to its detail page, which shows the restaurant name, category tags, delivery price, and menu items. Managers see **edit** (✏️) and **delete** (🗑️) icons in the top-right corner.

### Edit Restaurant

Tapping the **edit icon** (✏️) opens the **Edit Restaurant** form — identical to the creation form but pre-filled with the current values. Modify any field and tap **"Save Restaurant"** to update.

![Mobile Edit Restaurant](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.35%20(1).jpeg)

### Delete Restaurant

Tapping the **delete icon** (🗑️) shows a confirmation dialog:

> **Delete Restaurant** — "Are you absolutely sure? This will delete the restaurant and all its products."
> - **Delete Everything** — permanently removes the restaurant
> - **Cancel** — dismisses the dialog

![Mobile Delete Restaurant Confirmation](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.29.jpeg)

---

## Mobile App — Menu Management (Products)

The restaurant detail page shows the **Menu Items** section with a product count and an **"+ Add Product"** button.

### Restaurant Detail with Menu

![Mobile Restaurant Detail with Menu](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.34.jpeg)

### Adding a New Product

1. Tap **"+ Add Product"** on the restaurant detail page.
2. A form slides up with the following fields:
   - **Product Image** (tap to upload)
   - **Product Name** (e.g., "Classic Cheeseburger")
   - **Price** (in ₪)
   - **Description** (ingredients, size, etc.)
3. Tap **"Save Product"** to add it to the menu.

![Mobile Add Product Form](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.35.jpeg)

### Deleting a Product

Each product card has a red delete button (🗑️). Tapping it shows a confirmation dialog:

> **Delete Product** — "Are you sure you want to delete this product?"
> - **Delete** — permanently removes the product
> - **Cancel** — dismisses the dialog

![Mobile Delete Product Confirmation](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.32.jpeg)

---

## Navigation

| Previous | Next |
|:---|---:|
| ← [Authentication](Authentication.md) | [Customer Experience](Customers.md) → |
