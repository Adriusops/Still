<img src="/logo-white.png" alt="Still logo" width="100"/>

> "Every app on your phone is designed to steal your attention. I built one that gives it back."

Still is a minimalist intentional content medium using RSS feeds built on a single conviction: consuming content should be an intentional act, not an obligation. No unread counters. No notifications. No algorithmic recommendations. No anxiety by design.

---

## Architecture

| Layer | Tech | Why |
|---|---|---|
| Backend | Ruby on Rails 8.1 (API-only) | Convention over configuration, mature ecosystem |
| Frontend | React + Vite (PWA) | Full control over animations and transitions |
| Background jobs | Sidekiq + sidekiq-cron | Periodic RSS fetching |
| Database | PostgreSQL 17 | Simple, reliable |
| RSS parsing | Feedjira | Atom + RSS support |
| Auth | JWT | Stateless, API-friendly |

The backend and frontend are intentionally separated. Hotwire cannot provide the level of precision Still's transitions require.

---

## Backend — `still-api`

### Setup

```bash
bundle install
rails db:create db:migrate
```

Requires Redis for Sidekiq:

```bash
redis-server
bundle exec sidekiq
```

### Key concepts

**Shared sources** — One `Source` row per unique URL, regardless of how many users follow it. Fetching scales per distinct source, not per user. The `Subscription` model is the join between a `User` and a `Source`.

**STI for content types** — `Item` is the base model. `Article`, `Video`, and `Episode` are subclasses stored in the same `items` table via Single Table Inheritance.

**10-source limit** — Enforced as an ActiveRecord validation on `Subscription`, not in the controller. Cannot be bypassed regardless of entry point.

**Feed algorithm** — `FeedComposer` composes reading sessions by alternating sources. Two consecutive items from the same source never appear in the feed.

**Conditional HTTP caching** — `RssCrawler` sends `If-None-Match` and `If-Modified-Since` headers when available, handling `304 Not Modified` responses to avoid unnecessary parsing.

### Data model

```
User
  has_many :subscriptions
  has_many :sources, through: :subscriptions
  has_many :activities

Source
  has_many :subscriptions
  has_many :items
  columns: url, name, source_type, etag, last_modified, image_url

Subscription (join)
  belongs_to :user
  belongs_to :source
  columns: status (active/archived), paused_until

Item (STI base)
  belongs_to :source
  subclasses: Article, Video, Episode
  columns: type, title, url, content, image_url, duration, source_id

Activity
  belongs_to :user
  belongs_to :item
  columns: consumed_at
```

### API endpoints

```
POST   /api/v1/login           # JWT authentication
POST   /api/v1/users           # User registration
GET    /api/v1/me              # Current user
GET    /api/v1/sources         # List active sources
POST   /api/v1/sources         # Add a source
PATCH  /api/v1/sources/:id     # Update a source (archive, pause)
GET    /api/v1/items           # Composed feed (source-alternating)
POST   /api/v1/activities      # Mark an item as consumed
```

### Background jobs

`RssFetchJob` runs every hour via sidekiq-cron. It fetches all sources with at least one active subscription, deduplicated. Each source is fetched once regardless of how many users follow it.

Cron schedule is configured in `config/initializers/sidekiq-cron.rb` inside a `configure_server` block to avoid Redis connection attempts at Rails load time.

### Tests

```bash
bundle exec rspec
```

Tests cover `RssCrawler` (7 cases: HTTP 200, 304, conditional headers, no duplicates) and `RssFetchJob` (deduplication of sources across users). WebMock is configured globally — no real HTTP requests are made during the test suite.

---

## Design decisions

All significant architectural choices are documented in `still-api/DECISIONS.md` with context, options considered, choice made, and rationale. Read it before touching the architecture.

Key decisions:
- **D006** — STI for content types
- **D012** — Feed algorithm: source alternation only (density alternation deferred to v2)
- **D015** — Conditional HTTP caching (ETag / Last-Modified)
- **D018** — Manual `Net::HTTP` + `Feedjira.parse` instead of `fetch_and_parse`

---

## Product philosophy

Still never:
- Shows an unread counter
- Sends unsolicited notifications
- Suggests content you didn't choose
- Rewards streaks or reading habits
- Changes behavior based on inactivity

The 10-source limit is intentional friction. To add a source, you archive one. This forces a conscious choice about what deserves space in your reading life.

Flow is the only named user gesture in Still: a QR code-triggered handoff from reading to audio, for when you're moving and can't read. It is the only moment of color in the interface (`#24837B` teal, Flexoki). Nowhere else.

---

## Stack details

- Ruby 3.3.11, Rails 8.1.3
- PostgreSQL 17
- Sidekiq 8.x + sidekiq-cron 2.x
- Feedjira 4.x
- JWT via `jwt` gem
- CORS via `rack-cors`
- RSpec + WebMock for tests
