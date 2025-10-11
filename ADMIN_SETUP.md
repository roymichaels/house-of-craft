# Apollo Admin Setup Guide

## Welcome to the House of Order

Your Apollo Admin Panel has been successfully implemented with luxury branding, role-based access control, and comprehensive management tools.

## Setting Up Your Superadmin Account

After signing up for an account through the authentication flow, run this SQL in your Supabase SQL Editor to promote yourself to superadmin:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE public.profiles
SET role = 'superadmin'
WHERE email = 'your-email@example.com';
```

## Admin Access

Navigate to `/admin` to access the House of Order command center.

## Features Implemented

### 1. Role-Based Access Control
- **Superadmin**: Full access to all features including system logs
- **Admin**: Manage products, orders, users, and content
- **Editor**: Manage products and content
- **Support**: View orders and customer information
- **User**: Standard customer access

### 2. Dashboard (Command Center)
- Revenue and order metrics with trend indicators
- Product and user statistics
- Recent orders overview
- Quick access to all admin functions

### 3. Products Management
- Create, edit, and delete products
- Image URL support (Supabase Storage integration ready)
- Category and subcategory organization
- Stock status management
- Luxury card-based product display

### 4. Orders Management
- View all customer orders
- Update order status (pending, processing, shipped, delivered, cancelled)
- Detailed order view with customer info, items, and shipping address
- Order search and filtering

### 5. Users & Roles
- View all House members
- Promote/demote users between roles
- Role-based badge system with visual hierarchy
- User activity tracking ready

### 6. Content Management
- Create and manage philosophy, mission, and journal posts
- Slug-based URL system
- Draft/published workflow
- Rich text content support
- Content type organization (page, journal, philosophy, mission)

### 7. System & Audit Logs (Superadmin Only)
- Comprehensive audit trail of all admin actions
- Filter by table, action type, or search
- Timestamped activity log with user attribution
- System settings panel (expandable)

## Design System

### Color Palette
- **Ancient Gold** (`#D4AF37`): Primary accent color
- **Obsidian Core** (`#0A0404`): Deep black background
- **Imperial Bronze**: Secondary accent
- **Laurel Green**: Success states
- **Vita Flame**: Destructive/warning states

### Typography
- **Ancient Font**: Brand headers and titles
- **Cinzel (Order Font)**: UI labels and navigation
- **Playfair Display**: Content headers

### Brand Elements
- Matte black backgrounds with gold geometric dividers
- Glassmorphic panels with gold outlines
- Gold sigil/crown indicator for superadmin users
- "Confirm Command" instead of generic "Save" buttons
- Uppercase tracking for luxury aesthetic

## Database Structure

### Core Tables
1. **profiles**: User information with role column
2. **products**: Product catalog
3. **orders**: Customer orders
4. **content_blocks**: Site content (philosophy, mission, journal)
5. **audit_logs**: System activity tracking

### Security
- Row Level Security (RLS) enabled on all tables
- Role-based policies for data access
- Audit logging for admin actions
- Helper functions: `is_superadmin()`, `is_admin_or_above()`

## Next Steps

### Recommended Enhancements
1. **Supabase Storage Integration**: Enable image uploads for products
2. **Command Palette**: Add Cmd+K quick navigation (architecture ready)
3. **Rich Text Editor**: Integrate TipTap or similar for content editing
4. **Order Notifications**: Real-time notifications for new orders
5. **Analytics Charts**: Add Recharts visualizations to dashboard
6. **Email Templates**: Manage transactional email templates
7. **Stripe Integration**: Connect payment settings management

### Optional Luxury Features
- Voice Command Mode using Whisper + GPT
- 2FA setup for admin accounts
- Session timeout warnings
- Admin activity timeline with gold entries
- Export functionality for orders and reports

## File Structure

```
src/
├── components/
│   └── admin/
│       ├── AdminLayout.tsx      # Main admin layout with sidebar
│       ├── AdminHeader.tsx      # Page headers with gold styling
│       └── StatCard.tsx         # Dashboard metric cards
├── contexts/
│   └── AuthContext.tsx          # Updated with role-based auth
├── pages/
│   └── admin/
│       ├── Admin.tsx            # Main admin router
│       ├── Dashboard.tsx        # Command center
│       ├── Products.tsx         # Product management
│       ├── AdminOrders.tsx      # Order management
│       ├── Users.tsx            # User & role management
│       ├── Content.tsx          # Content management
│       └── System.tsx           # Audit logs & settings
└── supabase/
    └── migrations/
        └── add_role_column_and_content_blocks.sql
```

## Support

The admin panel follows your existing design system and brand guidelines. All components use the ancient-gold color tokens and luxury typography defined in your Tailwind config.

For issues or enhancements, check the database policies in Supabase or update the migration files.

---

**May the House of Order serve you well.**
