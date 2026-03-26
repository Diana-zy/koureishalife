# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev                    # Start development server
yarn build                  # Production build
yarn start                  # Start production server
yarn generate               # Generate static site (calls env.js + nuxt generate)
yarn go                     # Increment APP_VERSION and generate static site
yarn lint                   # Run ESLint + Prettier check
yarn lint:fix               # Auto-fix linting and formatting issues
```

## Environment Setup

1. Create `.env` file in project root with:
   - `SITE_ID` - Required for API calls
   - `PROD_API_URL` - Production API endpoint
   - `TEST_API_URL` - Development API endpoint
   - `APP_VERSION` - Auto-incremented by `yarn go`

2. Set `SITE_ID` environment variable before running commands that require API access.

## Architecture Overview

**Framework**: Nuxt.js 2.15 (Vue 2, SSR/SSG target: static)

**Project Structure**:
- `pages/` - Vue pages with Nuxt routing
  - `index.vue` - Homepage with category listings
  - `category/_category.vue` - Category listing pages (SEO slug-based)
  - `detail/_detail.vue` - Article detail pages with TOC, FAQ schema
  - `search/index.vue` - Search results
- `components/` - Reusable Vue components
  - `Item/` - Content card variants (ModeNew, SearchResult, SwiperRec, TextNew)
  - `NewsItem1-5` - Different article card layouts
  - `Header`, `Footer`, `FooterSeo` - Layout components
  - `RightSideBox`, `Sidebar` - Sidebar widgets
  - `Breadcrumb`, `Loading`, `AdLoading` - Utility components
- `plugins/` - Vue plugins (axios interceptors, global-data injection, nav-data)
- `utils/` - Helper functions (utils.js, env.js for version bumping, cheerio-toc.js for TOC generation)
- `assets/` - SCSS/CSS, images, fonts
- `static/` - Static assets served directly

**Key Patterns**:
- All API calls use `$axios` with interceptor handling `success === true` response format
- Global state injected via `plugins/global-data.js` - access via `this.$globalData` and `this.$globalMethod`
- Responsive design uses `vw()` mixin for mobile-first scaling (750px base)
- SEO-heavy: Schema.org JSON-LD injected in `head()` for Article, BreadcrumbList, FAQPage
- URL structure: `/category/{slug}/` and `/detail/{slug}/` with trailing slashes
- Article IDs extracted from slug's last dash segment

**SCSS Variables** (`assets/css/_mixins.scss`):
- `$color1: #FD9A25` (primary orange)
- `$font5: #1A1A1A` (main text)
- Responsive mixins: `vw()`, `icon()`, `ellipsis()`, `author-icon()`
