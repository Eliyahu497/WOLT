# Customer Experience — Browsing, Ordering & Orders

This page documents all customer-facing features — browsing the marketplace, searching, sorting, viewing menus, adding items to cart, placing orders, managing order history, rating restaurants, and using dark mode. Documentation covers both the **Web Client** and the **Mobile App**.

---

## Table of Contents
- [Web Client — Marketplace & Filters](#web-client--marketplace--filters)
- [Web Client — Search](#web-client--search)
- [Web Client — Restaurant Menu](#web-client--restaurant-menu)
- [Web Client — Dish Details](#web-client--dish-details)
- [Web Client — Shopping Cart & Checkout](#web-client--shopping-cart--checkout)
- [Web Client — Order History](#web-client--order-history)
- [Web Client — Dark Mode](#web-client--dark-mode)
- [Web Client — User Profile](#web-client--user-profile)
- [Web Client — 404 Not Found](#web-client--404-not-found)
- [Mobile App — Home Feed](#mobile-app--home-feed)
- [Mobile App — Sorting](#mobile-app--sorting)
- [Mobile App — Search](#mobile-app--search)
- [Mobile App — Restaurant Menu & Dish Details](#mobile-app--restaurant-menu--dish-details)
- [Mobile App — Cart & Checkout](#mobile-app--cart--checkout)
- [Mobile App — Order History & Management](#mobile-app--order-history--management)
- [Mobile App — Rating](#mobile-app--rating)
- [Mobile App — Dark Mode](#mobile-app--dark-mode)

---

## Web Client — Marketplace & Filters

After logging in as a **Customer**, you are taken to the marketplace homepage. This is the main browsing experience:

- **Category Marquee**: A horizontally scrolling categories bar at the top that pauses on hover
- **Search Bar**: Type keywords to find restaurants or dishes
- **Sort Dropdown**: Sort restaurants by:
  - 🔥 **Popularity** — based on dynamic order counts
  - ⭐ **Rating** — average star score
  - 📍 **Distance** — calculated using the Haversine formula from your registered location
  - 🔤 **Alphabetical (A-Z)** — supports English and Hebrew
- **Restaurant Cards**: Each card shows the restaurant image, name, category tag, rating, description, delivery fee, and distance

![Marketplace Dashboard](../images_for_README/u1.png)

---

## Web Client — Search

The global search functionality finds matching **restaurant names**, **category tags**, and **product names** instantly as you type.

![Search Results](../images_for_README/u2.png)

---

## Web Client — Restaurant Menu

Clicking on a restaurant card opens its menu page. Here you can:
- View all available dishes with images, descriptions, and prices
- Click on individual items to see their details
- Add items to your shopping cart
- Rate the restaurant using the interactive star system

![Customer Menu Page](../images_for_README/u3.png)

---

## Web Client — Dish Details

Clicking on a product card opens a **details modal** showing:
- Full-size product image
- Name, description, and price
- Quantity selector
- **Add to Cart** button

> [!NOTE]
> **Recommendation Engine Integration**: Viewing a product detail triggers a report to the C++ recommendation server, recording that this customer viewed this product.

![Dish Details Modal](../images_for_README/u7.png)

---

## Web Client — Shopping Cart & Checkout

Click the **cart icon** to open the slide-out **Cart Drawer**:
- View all selected items with quantities
- Adjust item quantities or remove items
- See the subtotal, delivery fee, and total
- Click **Checkout** to place the order

> [!NOTE]
> Placing an order sends a purchase report to the C++ recommendation engine, updating the customer's purchase history for future recommendations.

![Cart Drawer](../images_for_README/u8.png)

---

## Web Client — Order History

Navigate to the **"My Orders"** tab to view all past orders. From here you can:
- View order details (items, quantities, total price)
- **Update an order**: Modify quantities of items in a previously placed order (syncs changes with the C++ server)
- **Cancel an order**: Delete the order entirely (removes the purchase history from the recommendation engine)

![Order History](../images_for_README/u4.png)

---

## Web Client — Dark Mode

Logged-in users can toggle between **Light Mode** and **Dark Mode** using the theme switch button in the top navigation bar. The entire UI adapts to the selected theme.

![Dark Mode Marketplace](../images_for_README/u5.png)

---

## Web Client — User Profile

Click on your profile card to view your personal details:
- Full name, email, phone number
- Account type (Customer/Manager)
- Location coordinates

![User Profile Details](../images_for_README/u6.png)

---

## Web Client — 404 Not Found

Navigating to an invalid URL displays a custom 404 error page with a redirect option.

![404 Error Screen](../images_for_README/not_found.png)

---

## Mobile App — Home Feed

The mobile home screen displays all restaurants in a scrollable feed with rich cards showing:
- Restaurant cover image with delivery time badge
- Restaurant name, rating, description
- Category tag, delivery fee, and distance from the user

**Guest users** see a **"Log In"** button in the header, while logged-in customers see a personalized greeting.

| Guest Home Feed | Logged-in Home Feed |
|:---:|:---:|
| ![Guest Home](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.47.jpeg) | ![Logged-in Home](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.44.jpeg) |

---

## Mobile App — Sorting

Tap the **"Sort"** button in the top-right corner to open the sort bottom sheet. Available sort options:

- 🔥 **Popularity** — sorted by order count
- ⭐ **Rating** — sorted by average star rating
- 📍 **Distance** — sorted by proximity to your location

| Sort Panel | Sorted by Rating |
|:---:|:---:|
| ![Sort Panel](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.38.jpeg) | ![Sorted by Rating](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.37.jpeg) |

---

## Mobile App — Search

The **Search** tab provides a dedicated search experience. Type keywords to find restaurants and dishes matching your query.

![Mobile Search](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.46%20(2).jpeg)

---

## Mobile App — Restaurant Menu & Dish Details

Tapping on a restaurant card opens its full menu page with:
- Hero cover image with delivery time badge
- Restaurant name, star rating, description
- Category tags and delivery price
- Full menu item list

### Restaurant Menu

![Mobile Restaurant Menu](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.41%20(1).jpeg)

### Dish Details & Add to Cart

Tapping on a dish opens a **bottom sheet** showing:
- Full product image
- Name, description, and price
- **Quantity selector** (–/+)
- **"Add to Cart"** button with the calculated total

![Mobile Dish Details](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.40%20(2).jpeg)

### Rating a Restaurant

On the restaurant menu page, customers can tap the star rating row to submit or update their rating (1–5 stars). The rating dynamically updates the restaurant's average score.

| Before Rating (Empty Stars) | After Rating (Filled Stars) |
|:---:|:---:|
| ![Before Rating](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.41.jpeg) | ![After Rating](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.41%20(1).jpeg) |

---

## Mobile App — Cart & Checkout

After adding items, a **"View Cart"** banner appears at the bottom of the menu screen showing the item count and total price. Tapping it opens the **cart bottom sheet** with:
- Item list with quantities and prices
- Quantity adjustment (–/+)
- Subtotal, delivery fee, and total
- **"Submit Order"** button

### Cart Banner on Menu

![Mobile Cart Banner](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.40%20(1).jpeg)

### Cart / Checkout Sheet

![Mobile Cart Sheet](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.40%20(1).jpeg)

### Order Placed Confirmation

After successfully submitting an order, a confirmation dialog appears:

> **Order Placed! 🎉** — "Your order has been submitted successfully."
> - **View Orders** — navigate to the orders tab
> - **OK** — dismiss and continue browsing

![Order Placed](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.40.jpeg)

---

## Mobile App — Order History & Management

The **Orders** tab displays all past orders. Each order card shows:
- Restaurant name, order ID, and total price
- Individual items with quantities and prices
- **Quantity adjustment** buttons (–/+) to update the order
- **"Cancel Order"** button to delete the order

### Empty Orders State

![No Past Orders](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.38%20(1).jpeg)

### Order History with Items

![Order History](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.39.jpeg)

### Updating Order Quantities

Use the **–** and **+** buttons to adjust item quantities in an existing order. The total price updates automatically.

| Before Update (3 items) | After Update (1 item) |
|:---:|:---:|
| ![3 Items](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.39.jpeg) | ![1 Item](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.39%20(1).jpeg) |

### Canceling an Order

Tap **"Cancel Order"** to show the confirmation dialog:

> **Cancel Order** — "Are you sure you want to cancel this order?"
> - **Yes, Cancel** — permanently deletes the order
> - **No** — dismisses the dialog

![Cancel Order Confirmation](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.38%20(2).jpeg)

---

## Mobile App — Dark Mode

Dark mode can be toggled from the **Profile** tab under **Settings**. The entire app UI adapts — including the home feed, restaurant pages, and profile screen.

| Light Mode Profile | Dark Mode Profile |
|:---:|:---:|
| ![Light Mode](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.43.jpeg) | ![Dark Mode](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.42.jpeg) |

---

## Navigation

| Previous | Next |
|:---|---:|
| ← [Management — Restaurants & Dishes](Management.md) | [Mobile App Setup](MobileApp.md) → |
