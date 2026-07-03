# Mobile App Setup (Expo / React Native)

This page documents how to set up and run the **WANT** mobile application, built with [Expo](https://expo.dev/) (React Native). The mobile app connects to the same Node.js Express API as the web client, providing a native experience for **browsing restaurants, searching, placing orders, and managing your account** on iOS and Android devices.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Step 0 — Start the Backend Servers](#step-0--start-the-backend-servers)
- [Step 1 — Install Dependencies](#step-1--install-dependencies)
- [Step 2 — Start the Expo Development Server](#step-2--start-the-expo-development-server)
- [Step 3 — Open the App on Your Device](#step-3--open-the-app-on-your-device)
- [Step 4 — Configure the IP Address (Physical Device)](#step-4--configure-the-ip-address-physical-device)
- [App Features Overview](#app-features-overview)

---

## Prerequisites

- **Node.js** — installed on your computer.
- **Expo Go** app — installed on your mobile device:
  - [Android (Google Play)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)
- Alternatively, an **Android emulator** (Android Studio) or **iOS simulator** (Xcode) on your machine.

---

## Step 0 — Start the Backend Servers

> [!IMPORTANT]
> **The backend must be running first!**
> Before launching the mobile app, make sure the entire system is up. Navigate to the project root directory and run:
> ```bash
> docker-compose up --build
> ```
> Then free the TCP socket for the web/mobile connections:
> ```bash
> docker compose stop client
> ```
> Only proceed to the next steps after the backend is fully running.

---

## Step 1 — Install Dependencies

Open a terminal in the `mobile/` directory (located inside the project root) and install all dependencies:

```bash
cd mobile
npm install
```

---

## Step 2 — Start the Expo Development Server

In the same terminal, start the Expo development server:

```bash
npm start
```

The terminal will display a **QR code** and a list of options for running the app.

---

## Step 3 — Open the App on Your Device

### Option A — Physical Device (Recommended)

1. A **QR code** will appear in the terminal.
2. **iOS**: Open the Camera app and scan the QR code. Tap the notification to open in Expo Go.
3. **Android**: Open the **Expo Go** app and scan the QR code directly from within the app.

![Scanning the Expo QR Code](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.47%20(1).jpeg)

### Option B — Emulator / Simulator

- Press **`a`** in the terminal to open the app in an **Android emulator**.
- Press **`i`** in the terminal to open the app in an **iOS simulator** (macOS only).

---

## Step 4 — Configure the IP Address (Physical Device)

> [!CAUTION]
> **This step is critical for physical devices!**
> When the app runs on your phone via Expo Go, it needs to know the IP address of your computer (where the backend server is running). The word `localhost` from your phone refers to the phone itself — not your computer — so API requests will fail without this configuration.

### How to configure:

1. **Find your computer's local IP address:**
   - **Windows**: Open a terminal and run `ipconfig`. Look for the IPv4 address (usually starts with `192.168` or `10.0`).
   - **Mac/Linux**: Run `ifconfig` or `ip addr`.

2. **Update the API configuration file:**
   Open `mobile/services/api.js` in your code editor.

3. **Change the `BASE_URL` variable** to point to your computer's IP address:

   ```javascript
   let BASE_URL = 'http://192.168.1.15:1234'; // Replace with YOUR IP address
   ```

   If there are conditional blocks for Android/iOS, you can simplify them to a single line with your IP.

4. **Save the file.** The Expo dev server will automatically refresh the app on your device.

The mobile app should now be able to communicate with the backend server! 🎉

---

## App Features Overview

The mobile app provides the following features for customers:

| Feature | Description |
|---|---|
| **Login / Sign Up** | Authenticate as Customer or Manager ([details](Authentication.md)) |
| **Guest Browsing** | Browse restaurants without logging in |
| **Home Feed** | Scrollable restaurant cards with images, ratings, and delivery info |
| **Search** | Find restaurants and dishes by keyword |
| **Sort** | Sort restaurants by Popularity, Rating, or Distance |
| **Category Filter** | Filter by cuisine type (Sushi, Burgers, Pizza, etc.) |
| **Restaurant Menu** | View full menu with dish images and prices |
| **Dish Details** | View details and add to cart with quantity selector |
| **Cart & Checkout** | Review order, adjust quantities, and submit |
| **Order History** | View, update quantities, or cancel past orders |
| **Star Ratings** | Rate restaurants on a 1–5 star scale |
| **Dark Mode** | Toggle dark theme from the Profile tab |
| **Profile** | View personal details and settings |
| **Restaurant Management** | Managers can create/edit/delete restaurants and products ([details](Management.md)) |

For detailed screenshots of each feature, see:
- [Authentication — Registration & Login](Authentication.md)
- [Management — Restaurants & Dishes](Management.md)
- [Customer Experience — Browsing & Ordering](Customers.md)

---

## Navigation

| Previous | Next |
|:---|---:|
| ← [Customer Experience](Customers.md) | [Home](Home.md) ↩ |
