# Jules Shadcn Vue Worker Starter

This is a starter template for a Cloudflare Worker that serves a Vue.js Single-Page Application (SPA) with `shadcn-vue` and Tailwind CSS. The backend is a Hono API.

## Features

- Cloudflare Worker with Hono for the API.
- Vue 3 + Vite for the UI.
- `shadcn-vue` and Tailwind CSS pre-configured.
- Common Cloudflare bindings (D1, KV, R2, etc.) pre-declared in `wrangler.toml`.
- Serves the SPA as static assets from the same Worker.
- API and UI are in a single monorepo.

## Quick Start

1.  **Install dependencies:**

    ```bash
    # From the starter/ directory
    npm install
    ```

2.  **Initialize local D1 database:**

    This command will execute the `schema.sql` file against a local D1 database, creating the necessary tables.

    ```bash
    npm run migrate:local
    ```

3.  **Run the development server:**

    This will start the Wrangler development server, which serves both the API and the Vue SPA. The UI is available at `http://localhost:5173` by default, and the API is served from the same origin under the `/api` path.

    ```bash
    npm run dev
    ```

4.  **Build and publish:**

    This command builds both the UI and the Worker, and then publishes the Worker to Cloudflare.

    ```bash
    wrangler publish
    ```

## Secrets

You may need to set the following secrets using `wrangler secret put`:

- `GITHUB_TOKEN`: If you want to use the GitHub integration features.
- `OPENAI_API_KEY`: If you want to use OpenAI models.
