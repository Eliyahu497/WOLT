# Authentication — Registration & Login

This page documents the authentication flow for both the **Web Client** (React) and the **Mobile App** (Expo / React Native). The system supports two user roles: **Customer** and **Manager**. Managers can create and manage restaurants, while Customers can browse, order, and rate.

---

## Table of Contents
- [Web Client — Registration](#web-client--registration)
- [Web Client — Login](#web-client--login)
- [Mobile App — Login](#mobile-app--login)
- [Mobile App — Registration](#mobile-app--registration)
- [Mobile App — Guest Mode](#mobile-app--guest-mode)
- [Mobile App — User Profile](#mobile-app--user-profile)

---

## Web Client — Registration

To register a new account in the web application:

1. On the main page or navigation bar, click **Sign Up**.
2. Fill in all required fields:
   - **Full Name**
   - **Email** (validated for correct format)
   - **Password** and **Confirm Password**
   - **Phone Number** (must be exactly 10 digits)
   - **Profile Avatar** (required — upload an image)
   - **Location / Address** (used for distance calculations via the Haversine formula)
3. Select your account type: **Customer** or **Manager**.
   - A Manager will be able to create and manage restaurants after registration.
4. Click **Submit** to create your account.

![Web Registration Screen](../images_for_README/0.png)

---

## Web Client — Login

To log in to an existing account:

1. Click **Login** in the top navigation bar.
2. Enter your **email** and **password**.
3. If the credentials are valid, the system issues a **JWT authentication token** and redirects you:
   - **Manager** → Partner Dashboard (restaurant management)
   - **Customer** → Marketplace homepage (restaurant browsing)

![Web Login Screen](../images_for_README/1.png)

> [!TIP]
> **Default test accounts** — All pre-seeded manager accounts use the password `Password123`. See the [README](../README.md) for the full list of usernames.

---

## Mobile App — Login

The mobile app presents a clean login screen on launch:

1. Select your role: **Customer** or **Manager** using the toggle buttons.
2. Enter your **Username** and **Password**.
3. Tap **Log In** to authenticate.
4. Alternatively:
   - Tap **Sign Up** to create a new account.
   - Tap **Continue as Guest** to browse restaurants without logging in (limited functionality).

![Mobile Login Screen](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.44%20(1).jpeg)

---

## Mobile App — Registration

To create a new account in the mobile app:

1. From the login screen, tap **Sign Up**.
2. The registration form includes:
   - **Profile Photo** — tap the camera icon to upload an avatar
   - **Account Type** — toggle between Customer and Manager
   - **Full Name**
   - **Email Address**
   - **Phone** (10 digits)
   - **Username**
   - **Password** (8+ characters, letters & numbers)
   - **Confirm Password**
   - **Location** (latitude / longitude)
3. Tap **Create Account** to register.

![Mobile Registration Screen](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.45.jpeg)

---

## Mobile App — Guest Mode

Users who choose **Continue as Guest** can browse the restaurant marketplace and search for restaurants. However, certain features require authentication:

- The **Orders** tab shows a "Login Required" message with a **Log In** button.
- The **Profile** tab shows a "Login Required" message with a **Log In** button.

| Orders — Login Required | Profile — Login Required |
|:---:|:---:|
| ![Orders Login Required](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.46%20(1).jpeg) | ![Profile Login Required](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.46.jpeg) |

---

## Mobile App — User Profile

After logging in, the **Profile** tab displays the user's personal details and settings:

- **Avatar, Name, and Username**
- **Role badge** (Customer or Manager)
- **Personal Details**: Full Name, Email, Phone, Role
- **Settings**: Dark Mode toggle
- **Log Out** button

| Customer Profile (Light Mode) | Customer Profile (Dark Mode) | Manager Profile |
|:---:|:---:|:---:|
| ![Customer Profile Light](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.43.jpeg) | ![Customer Profile Dark](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.42.jpeg) | ![Manager Profile](../images_for_WIKI/WhatsApp%20Image%202026-07-03%20at%2016.07.04.jpeg) |

---

## Navigation

| Previous | Next |
|:---|---:|
| ← [Home — Setup](Home.md) | [Management — Restaurants & Dishes](Management.md) → |
