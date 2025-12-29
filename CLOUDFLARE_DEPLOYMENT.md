# Cloudflare Pages Configuration

This project is configured for **Next.js 15** static export deployment to Cloudflare Pages.

## Build Configuration

### Framework Preset

**Next.js**

### Build Settings

- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Node version**: `18.x` or higher
- **Install command**: `npm ci` (recommended) or `npm install`

### Environment Variables

No environment variables required for v1.0.0.

For future PostHog analytics integration:

```
NEXT_PUBLIC_POSTHOG_KEY=<your-key>
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Deployment Triggers

- **Production branch**: `main`
- **Preview branches**: All branches (automatic preview deployments)
- **PR previews**: Enabled

## Build Optimizations

### Next.js Configuration

The project uses these optimizations in `next.config.mjs`:

```javascript
{
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }
}
```

### Static Export

Next.js will generate static HTML/CSS/JS in `.next` directory.

## Post-Deployment Checklist

- [ ] Verify build logs show "✓ Compiled successfully"
- [ ] Test preview URL: `https://mvp-simulation-tool.pages.dev`
- [ ] Configure custom domain (optional): `simulate.formatdisc.com`
- [ ] Enable Cloudflare Analytics
- [ ] Update `FORMATDISC_DEPLOYMENT_LOG.md`

## DNS Configuration (Custom Domain)

If using `simulate.formatdisc.com`:

1. Add custom domain in Cloudflare Pages dashboard
2. Cloudflare will auto-create CNAME record:
   - **Type**: CNAME
   - **Name**: simulate
   - **Target**: mvp-simulation-tool.pages.dev
   - **Proxy**: Enabled (orange cloud)

## Rollback

To rollback to a previous deployment:

1. Navigate to Cloudflare Pages dashboard
2. Go to **Deployments** tab
3. Find previous successful deployment
4. Click **Rollback to this deployment**

---

**Last Updated**: 2025-12-29  
**Specification**: INSTITUTIONAL_SPECIFICATION_v1.0.md
