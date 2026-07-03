# WANT — Online Food Ordering System (Wolt Clone)

A full-stack food ordering platform combining a **Node.js/Express REST API**, a **C++ TCP Recommendation Engine**, a **React** web client, and an **Expo (React Native)** mobile app — all orchestrated with **Docker Compose**.

> [!TIP]
> ## 📖 [Full Documentation (Wiki)](wiki/Home.md)
> For complete step-by-step guides, screenshots, architecture details, and feature walkthroughs, visit the **[Project Wiki](wiki/Home.md)**.
>
> **Wiki Pages:**
> * [Home — System Overview & Environment Setup](wiki/Home.md)
> * [Authentication — Registration & Login](wiki/Authentication.md)
> * [Restaurant & Dish Management (Manager Role)](wiki/Management.md)
> * [Customer Experience — Browsing, Ordering & Orders](wiki/Customers.md)
> * [Mobile App Setup (Expo / React Native)](wiki/MobileApp.md)

---

## 🚀 Quick Start

### Prerequisites
* **Docker Desktop** — installed and running (green status indicator).

### Run the Entire System

```bash
# 1. Build all containers (C++ server, Node.js web, MongoDB, Python client)
docker compose build

# 2. Start all services
docker compose up

# 3. Free the TCP socket for the web app (the C++ server accepts only one connection)
docker compose stop client

# 4. Open the application in your browser
#    http://localhost:1234

# 5. When done — stop and clean up
docker compose down
```

> [!CAUTION]
> **Docker Desktop must be running** before executing any `docker compose` commands. If you see a connection error, open Docker Desktop and wait for it to initialize.

---

## 🔑 Default Test Accounts

All seed manager accounts use the password **`Password123`**:

| Username | Manages |
|---|---|
| `giraffe_owner` | Eran & Shira's Restaurant of LOVE |
| `burger_owner` | Burger Room |
| `pizza_owner` | Tony Vespa |
| `sushi_owner` | Sushi Bar |
| `desserts_owner` | Sweet Creations |
| `indian_owner` | Taj Mahal |
| `mexican_owner` | La Taqueria |
| `italian_owner` | Trattoria Bella |
