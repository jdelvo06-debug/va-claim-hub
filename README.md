# VA Claim Hub

A free, community-driven resource hub helping veterans navigate the VA disability claims process — from C&P exams and nexus letters to DBQs and condition-specific guidance.

🌐 **Live site:** [va-claim-hub.vercel.app](https://va-claim-hub.vercel.app)

---

## 🏗️ Tech Stack

| Layer       | Technology                                 |
| :---------- | :----------------------------------------- |
| Framework   | [Astro v6](https://astro.build) (SSR via Vercel adapter) |
| UI          | [React 19](https://react.dev) (island components) |
| Styling     | [Tailwind CSS v4](https://tailwindcss.com) |
| Database    | [LibSQL / Turso](https://turso.tech) + [Drizzle ORM](https://orm.drizzle.team) |
| Deployment  | [Vercel](https://vercel.com)               |
| Fonts       | Geist Sans / Geist Mono                    |
| Icons       | Phosphor Icons                             |

---

## 📁 Project Structure

```text
/
├── drizzle/                  # Drizzle migration files
│   └── meta/                 # Drizzle meta snapshot & journal
├── public/                   # Static assets
├── src/
│   ├── components/           # Astro & React components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── SEOHead.astro
│   │   ├── ContactForm.tsx
│   │   ├── NewsletterForm.tsx
│   │   ├── ResourceSubmitForm.tsx
│   │   ├── ConditionSearch.tsx
│   │   └── MobileNav.tsx
│   ├── content/              # Markdown content (conditions, blog)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── db.ts             # Drizzle client (LibSQL/Turso)
│   │   └── schema.ts         # Database schema
│   ├── pages/
│   │   ├── api/              # API endpoints
│   │   │   ├── contact.ts
│   │   │   ├── submit-resource.ts
│   │   │   └── subscribe.ts
│   │   ├── admin/            # Protected admin portal
│   │   ├── blog/[slug].astro
│   │   ├── conditions/[slug].astro
│   │   ├── contact.astro
│   │   ├── index.astro
│   │   └── ...
│   ├── middleware.ts          # Admin auth + security headers
│   └── styles/
├── drizzle.config.ts
├── astro.config.mjs
└── package.json
```

---

## ⚙️ Setup & Local Development

### Prerequisites

- Node.js ≥ 22.12.0
- A [Turso](https://turso.tech) database (or a local LibSQL file for development)

### 1. Install dependencies

```sh
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```sh
cp .env.example .env
```

See the [Environment Variables](#-environment-variables) section below for details on each variable.

### 3. Start the dev server

```sh
npm run dev
```

The site will be available at `http://localhost:4321`.

---

## 🔑 Environment Variables

All required environment variables are documented in `.env.example`. Copy it to `.env` and fill in your values:

| Variable              | Description                                               |
| :-------------------- | :-------------------------------------------------------- |
| `ADMIN_SECRET`        | Shared secret used to authenticate admin portal access    |
| `TURSO_DATABASE_URL`  | LibSQL/Turso database URL (`libsql://...`)                |
| `TURSO_AUTH_TOKEN`    | Turso auth token for database access                      |

---

## 🧞 Available Scripts

All commands are run from the project root:

| Command             | Action                                        |
| :------------------ | :-------------------------------------------- |
| `npm run dev`       | Start local dev server at `localhost:4321`    |
| `npm run build`     | Build the production site to `./dist/`        |
| `npm run preview`   | Preview the production build locally          |
| `npm run astro`     | Run Astro CLI commands                        |

---

## 📚 Content Overview

### Condition Guides (`src/content/conditions/`)

Detailed guides for 10 common VA disability conditions, including ratings criteria, key evidence requirements, and claim tips:

- PTSD, Sleep Apnea, Migraines, Tinnitus
- Lumbar Strain, Hearing Loss, Depression, GERD
- Hypertension, Knee Condition

### Blog Posts (`src/content/blog/`)

Practical articles on the claims process:

- C&P exam expectations
- How to write nexus letters
- Secondary conditions strategy

### Admin Portal (`/admin`)

A protected admin dashboard for moderating community resource submissions. Access requires the `ADMIN_SECRET` environment variable.

---

## 🤝 Contributing / Content Submission

### Submit a Resource

Veterans and advocates can submit helpful resources (guides, tools, nexus letter services, etc.) via the [Submit a Resource](/submit-resource) page. All submissions are reviewed by an admin before being published.

### Content Contributions

To suggest additions or corrections to condition guides or blog posts, please open an issue or pull request. All content must be accurate, veteran-focused, and free of affiliate promotions without clear disclosure.

---

## 🚀 Deployment

The project is deployed on [Vercel](https://vercel.com) using the `@astrojs/vercel` adapter for SSR. Set the required environment variables in your Vercel project settings before deploying.
