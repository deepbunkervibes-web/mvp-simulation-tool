# PostHog Analytics Setup Guide

## Production Configuration

### 1. Create PostHog Account

1. Go to: <https://posthog.com>
2. Sign up for free account
3. Create new project: "MVP Simulation Tool"

### 2. Get API Key

1. Navigate to: Project Settings → API Keys
2. Copy your **Project API Key**

### 3. Add Environment Variables to Vercel

Go to: <https://vercel.com/formatdiscapp/mvp-simulation-tool/settings/environment-variables>

Add:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 4. Redeploy

Vercel will automatically redeploy with new environment variables.

---

## Events Being Tracked

### `simulation_started`

Fired when user begins a simulation.

**Properties:**

- `timestamp`: ISO timestamp
- `sessionId`: Unique session identifier

### `simulation_completed`

Fired when simulation finishes.

**Properties:**

- `verdict`: GO | MAYBE | NO_GO
- `creditRating`: AAA-CCC
- `score`: Confidence score (0-100)
- `revenue`: Projected revenue
- `timestamp`: ISO timestamp
- `sessionId`: Session ID
- `simulationId`: Unique simulation ID

### `simulation_verdict_viewed`

Fired when user views verdict card.

**Properties:**

- Same as `simulation_completed`

### `pdf_export_requested`

Fired when user downloads PDF report.

**Properties:**

- `verdict`: GO | MAYBE | NO_GO
- `creditRating`: AAA-CCC
- `timestamp`: ISO timestamp
- `sessionId`: Session ID

---

## Verification

After deployment, check PostHog dashboard:

1. Go to: <https://app.posthog.com>
2. Navigate to: Events → Live Events
3. Trigger a simulation on live site
4. Verify events appear in real-time

---

**Status:** Ready for production activation
**Integration:** Already implemented in `lib/analytics.ts` and `components/verdict-card.tsx`
