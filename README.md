<p align="center">
    <img src="https://raw.githubusercontent.com/5upro/clasiv-backend/main/src/public/favicon.svg" width="200" alt="Clasiv"/>
</p>

<h1 align="center">
    Clasiv Backend 
</h1>

Clasiv Backend is a scalable ERP-style backend designed with a modular architecture. 
A Backend build for:
* [Clasiv (Android App)](https://github.com/5upro/clasiv)
* [Clasiv (WebApp)](https://github.com/5upro/clasiv-web)

## ⚙️ Tech Stack

* **Runtime:** Nodejs (Bun)
* **Language:** TypeScript
* **Architecture:** Monolith, Service–Repository Pattern
* **Validation:** Zod
* **Auth:** JWT (Access + Refresh Tokens)

## 🧱 Architecture

The backend follows a **Service–Repository pattern**:

```
Router → Controller → Service → Repository
```

### Responsibilities

* **Router** → Handles Sub-Routes
* **Controller** → Handles HTTP requests
* **Service** → Business logic
* **Repository** → Database queries
* **Schemas** → Validation (Zod)

## 🚀 Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Setup environment variables

Create a `.env` file:

```env
DATABASE_URL=
JWT_SECRET=
REFRESH_TOKEN_SECRET=
```

### 3. Run the server

```bash
bun run dev
```

## 🤝 Contributing

Contributions are welcome.
Feel free to open issues or submit pull requests.
