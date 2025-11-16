# Apollo Deployment Guide

## Pre-Launch Checklist

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure your production values:

```bash
cp .env.example .env
```

Update the following values:
- `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key

### 2. Database Setup

Ensure all Supabase migrations are applied:

1. Navigate to your Supabase project dashboard
2. Go to SQL Editor
3. Run all migrations from `/supabase/migrations/` in chronological order
4. Verify all tables are created with proper RLS policies

**Important Tables:**
- `profiles` - User profiles with role-based access
- `products` - Product catalog
- `orders` - Customer orders
- `content_blocks` - Site content management
- `audit_logs` - Admin action tracking
- `hero_scenes` - Hero section configuration

### 3. Admin Setup

After deploying and creating your first account, promote yourself to superadmin:

```sql
UPDATE public.profiles
SET role = 'superadmin'
WHERE email = 'your-email@example.com';
```

### 4. Stripe Integration (If Using Payment)

1. Create a Stripe account at https://stripe.com
2. Get your Stripe API keys from the Stripe dashboard
3. Configure the Stripe checkout session endpoint
4. Set up webhook endpoints for order confirmations
5. Test payment flow in Stripe test mode before going live

### 5. Custom Domain Configuration

#### DNS Settings
Point your domain to your hosting provider:

For Lovable hosting:
1. Go to Project Settings > Domains
2. Click "Connect Domain"
3. Follow the DNS configuration instructions

For other hosts (Vercel, Netlify, etc.):
1. Add your domain in the hosting provider's dashboard
2. Configure DNS A/CNAME records as instructed
3. Enable SSL/HTTPS (usually automatic)

#### Update URLs in Code
After setting up your custom domain, update these files:

**index.html:**
- Update og:url meta tag
- Update og:image and twitter:image URLs

**robots.txt:**
- Update sitemap URL

**src/components/StructuredData.tsx:**
- Update all apollo.luxury URLs to your actual domain

### 6. SEO Configuration

#### Favicon Assets
Create and add these favicon files to `/public`:
- `favicon.ico` - 48x48 ICO format
- `favicon-16x16.png` - 16x16 PNG
- `favicon-32x32.png` - 32x32 PNG
- `apple-touch-icon.png` - 180x180 PNG for iOS
- `android-chrome-192x192.png` - 192x192 PNG for Android
- `android-chrome-512x512.png` - 512x512 PNG for Android

#### Open Graph Image
Create an Open Graph image at `/public/og-image.jpg`:
- Size: 1200x630 pixels
- Format: JPG or PNG
- Shows your brand/logo with ancient gold aesthetic

#### Sitemap
Create `/public/sitemap.xml` with your site structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Add more URLs as needed -->
</urlset>
```

### 7. Security Checklist

- [ ] All sensitive environment variables are properly configured
- [ ] RLS policies are enabled on all Supabase tables
- [ ] Admin routes are protected with role-based authentication
- [ ] CORS is properly configured for your domain
- [ ] HTTPS/SSL is enabled
- [ ] CSP headers are configured (if applicable)
- [ ] Rate limiting is set up for authentication endpoints

### 8. Performance Optimization

- [ ] Images are optimized and properly sized
- [ ] Fonts are preloaded
- [ ] Code splitting is configured (already done in vite.config.ts)
- [ ] Static assets have proper cache headers
- [ ] Lighthouse score is 90+ on all metrics

### 9. Testing

Test all critical user flows:
- [ ] User registration and login
- [ ] Password reset flow
- [ ] Product browsing and search
- [ ] Add to cart and checkout
- [ ] Payment processing (test mode)
- [ ] Order confirmation emails
- [ ] Admin panel access and functionality
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### 10. Monitoring Setup

Set up monitoring for:
- [ ] Error tracking (Sentry, Bugsnag, etc.)
- [ ] Analytics (Google Analytics, Plausible, etc.)
- [ ] Uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Performance monitoring (Web Vitals)
- [ ] Database query performance (Supabase dashboard)

## Deployment Commands

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Deployment Platforms

### Lovable (Recommended for Quick Deploy)
1. Open your Lovable project
2. Click Share > Publish
3. Follow the deployment wizard
4. Connect custom domain in settings

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Custom Server
1. Build the project: `npm run build`
2. Upload the `dist` folder to your server
3. Configure your web server (nginx, Apache) to serve the static files
4. Set up SSL certificate
5. Configure environment variables on the server

## Post-Deployment

### 1. Verify Deployment
- [ ] Site loads correctly at your domain
- [ ] All images and assets load
- [ ] Navigation works properly
- [ ] Forms submit correctly
- [ ] Payment flow works (if applicable)
- [ ] Admin panel is accessible

### 2. SEO Submission
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify Open Graph tags with Facebook Debugger
- [ ] Verify Twitter Cards with Twitter Card Validator

### 3. Performance Check
- [ ] Run Lighthouse audit
- [ ] Test load times from different locations
- [ ] Verify mobile performance

### 4. Marketing
- [ ] Announce launch on social media
- [ ] Send email to subscribers (if applicable)
- [ ] Update social media profiles with new URL

## Rollback Procedure

If issues are discovered after deployment:

1. Identify the issue through monitoring/error logs
2. Fix in development branch
3. Test thoroughly
4. Deploy fix or rollback to previous stable version
5. Document the issue and resolution

## Support

For technical issues:
- Check Supabase logs in your project dashboard
- Review browser console for client-side errors
- Check server logs for backend issues
- Contact hosting provider support if infrastructure issues

## Maintenance

Regular maintenance tasks:
- Monitor error logs weekly
- Review database performance monthly
- Update dependencies quarterly
- Backup database regularly (Supabase handles this automatically)
- Review and optimize slow queries
- Monitor storage usage

---

**May your launch illuminate the digital realm.**

APOLLO — Where Light Becomes Order
