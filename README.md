# Haylog — Blog Frontend

A bilingual blog frontend built with Next.js 16, React 19, and Tailwind CSS v4. Supports English and Armenian content, dark/light theme switching, syntax-highlighted Markdown posts, and tag-based filtering. Connects to a separate REST API backend.

## Tech Stack

| Area | Library / Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Lucide React |
| State management | Redux Toolkit + React Redux |
| Data fetching | TanStack React Query v5 + Axios |
| i18n | next-intl v4 (EN / HY) |
| Markdown rendering | react-markdown, rehype-highlight, remark-gfm |
| Fonts | Space Grotesk, JetBrains Mono, Noto Sans Armenian |
| Images | Next.js Image (Cloudinary remote patterns) |
| Sitemap | next-sitemap |
| Unit tests | Jest 30 + Testing Library |
| E2E tests | Playwright |
| Analytics | Umami (optional, self-hosted) |

## Pages

| Route | Description |
|---|---|
| `/` | Blog post grid (home) |
| `/blog/[slug]` | Individual blog post (Markdown, syntax highlighting) |
| `/about` | About page |
| `/login` | Authentication page |

All routes are prefixed with a locale segment — `/en/...` or `/hy/...`. The default locale is `en`.

## Getting Started

### Prerequisites

- Node.js 20+
- A running backend API (set via `NEXT_PUBLIC_API_URL`)

### Environment variables

Create a `.env.local` file in the project root:

```env
# Required — URL of the backend REST API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional — Umami analytics (self-hosted)
# NEXT_PUBLIC_UMAMI_URL=https://your-umami-instance.com
# NEXT_PUBLIC_UMAMI_ID=your-website-id
```

### Install and run

```bash
npm install
npm run dev
```

The app starts at [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build          # Production build
npm run start          # Start production server
npm run lint           # ESLint
npm run test           # Unit tests (Jest)
npm run test:watch     # Jest in watch mode
npm run test:coverage  # Jest with coverage report
npm run test:e2e       # Playwright end-to-end tests
npm run test:e2e:ui    # Playwright with interactive UI
```

## Project Structure

```
blog-frontend/
├── app/
│   ├── layout.tsx              # Root HTML layout (fonts, analytics)
│   └── [locale]/
│       ├── layout.tsx          # Locale layout (Header, Footer, Providers)
│       ├── page.tsx            # Home — blog grid
│       ├── blog/[slug]/        # Blog post page
│       ├── about/              # About page
│       └── login/              # Login page
├── components/
│   ├── blog/                   # BlogCard, BlogGrid, BlogPostClient
│   ├── layout/                 # Header, Footer, MainSection
│   └── ui/                     # Button, Card, Input, LanguageSwitch, ThemeToggle, Logo
├── hooks/
│   └── queries/                # useAuth, useLogin, usePosts, useTags
├── store/                      # Redux store + authSlice
├── providers/                  # Redux + React Query provider composition
├── i18n/                       # next-intl routing and request config
├── messages/
│   ├── en.json                 # English translations
│   └── hy.json                 # Armenian translations
├── e2e/                        # Playwright e2e specs
└── __tests__/                  # Jest unit tests
```

## Testing

### Unit tests

```bash
npm run test
```

Tests live in `__tests__/` and mirror the `components/`, `hooks/`, `lib/`, and `store/` directories.

### End-to-end tests

Playwright tests live in `e2e/`. They cover: home page, blog post, about, login, language switching, and theme toggling.

```bash
# Make sure the dev server is running, then:
npm run test:e2e
```

Or let Playwright start the server automatically — it is configured to do so via `webServer` in `playwright.config.ts`.

The base URL defaults to `http://localhost:3000` and can be overridden with the `BASE_URL` environment variable.

## Deployment

### Docker

```bash
# Build and run with Docker Compose
docker compose up --build
```

The container is exposed on port **3002** on the host and reads environment variables from `.env.production`.

### CI/CD

GitHub Actions (`.github/workflows/deploy.yml`) automatically deploys on every push to `main` by SSHing into the server and running a deploy script. Required repository secrets:

- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY`

## Localization

The app supports two locales:

| Code | Language |
|---|---|
| `en` | English (default) |
| `hy` | Armenian |

Translation files are in `messages/en.json` and `messages/hy.json`. Language can be switched at runtime via the `LanguageSwitch` component in the header.

## License

This project does not currently have a license. If you intend to use or distribute it, please check with the author first.
