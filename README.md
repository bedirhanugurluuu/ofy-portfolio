# 🎨 OFY Portfolio Website

Modern, responsive portfolio website built with Next.js, Supabase, and TypeScript. Features a comprehensive admin panel for content management and a beautiful frontend with smooth animations.

## 🚀 Live Demo

- **Frontend**: [farukyilmaz.com](https://farukyilmaz.com)
- **Admin Panel**: [ofy-admin.vercel.app](https://ofy-admin.vercel.app)

## ✨ Features

### Frontend (Next.js)
- **Modern Design**: Clean, responsive portfolio design with smooth animations
- **GSAP Animations**: Professional animations and transitions
- **SEO Optimized**: Static generation, meta tags, sitemap, robots.txt
- **Newsletter System**: Email subscription with Supabase integration
- **Dynamic Content**: CMS-like content management via admin panel
- **Performance**: 90+ PageSpeed Insights score

### Admin Panel (React + Vite)
- **Complete CMS**: Full content management system
- **Supabase Integration**: Real-time database operations
- **File Management**: Image uploads to Supabase Storage
- **Authentication**: Secure login system
- **TypeScript**: Full type safety throughout
- **Responsive Design**: Works on all devices

### Backend (Supabase)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Storage**: File uploads and management
- **Authentication**: User management and sessions
- **Real-time**: Live data updates
- **API**: RESTful API with automatic generation

## 🏗️ Architecture

```
portfolio-ofy/
├── pages/                    # Next.js pages (SSG/SSR)
│   ├── api/                  # API routes
│   │   ├── newsletter.ts     # Newsletter subscription
│   │   ├── projects/         # Project management
│   │   ├── news/            # News/blog management
│   │   └── ...              # Other endpoints
│   ├── about.tsx            # About page
│   ├── projects.tsx         # Projects listing
│   ├── blog.tsx             # News/blog listing
│   └── contact.tsx          # Contact page
├── components/               # React components
│   ├── Header.tsx           # Navigation
│   ├── Footer.tsx           # Footer with newsletter
│   ├── IntroBanner.tsx      # Hero section
│   └── ...                  # Other components
├── temp-admin-panel/         # Admin panel (React + Vite)
│   ├── src/
│   │   ├── pages/           # Admin pages
│   │   ├── components/      # Admin components
│   │   ├── utils/           # Utilities
│   │   └── types/           # TypeScript types
│   └── package.json
├── lib/
│   ├── supabase.ts          # Supabase client
│   └── api.ts               # API utilities
├── hooks/                    # Custom React hooks
├── styles/                   # Global styles
└── public/                   # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/portfolio-ofy.git
cd portfolio-ofy
```

### 2. Install Dependencies
```bash
# Main project
npm install

# Admin panel
cd temp-admin-panel
npm install
cd ..
```

### 3. Environment Setup
```bash
# Copy environment files
cp env.example .env.local
cp temp-admin-panel/env.example temp-admin-panel/.env
```

### 4. Configure Environment Variables

#### Main Project (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Admin Panel (temp-admin-panel/.env)
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Database Setup
Run the SQL scripts in your Supabase SQL editor:

1. **Database Schema**: `database_setup.sql`
2. **Newsletter Setup**: `newsletter_setup_safe.sql`
3. **RLS Policies**: `newsletter_policies.sql`

### 6. Development
```bash
# Frontend (Next.js)
npm run dev

# Admin Panel (in temp-admin-panel directory)
cd temp-admin-panel
npm run dev
```

## 🌐 Deployment

### Vercel Deployment

#### Frontend
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Admin Panel
1. Create separate Vercel project for admin panel
2. Set environment variables
3. Deploy from `temp-admin-panel` directory

### Environment Variables for Production

#### Frontend (Vercel)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

#### Admin Panel (Vercel)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 📁 Content Management

### Admin Panel Sections
- **Dashboard**: Overview and navigation
- **About Management**: Company information and insights
- **Projects**: Portfolio management with galleries
- **News**: Blog post management
- **Awards**: Recognition and achievements
- **Slider**: Hero section management
- **What We Do**: Services and capabilities
- **Contact**: Contact information
- **Intro Banners**: Banner management

### Database Tables
- `about_content` - Company information
- `projects` - Portfolio projects
- `project_gallery` - Project images
- `news` - Blog posts
- `awards` - Awards and recognition
- `slider` - Hero slider
- `what_we_do` - Services
- `contact` - Contact information
- `newsletter_subscribers` - Email subscriptions
- `about_gallery` - About page images
- `intro_banners` - Banner images

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with SSG/SSR
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **GSAP**: Professional animations
- **Framer Motion**: UI animations

### Admin Panel
- **React 19**: UI library
- **Vite**: Fast build tool
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Router**: Navigation

### Backend & Database
- **Supabase**: Backend as a Service
- **PostgreSQL**: Database
- **Row Level Security**: Data protection
- **Supabase Storage**: File management
- **Supabase Auth**: Authentication

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

## 📊 Performance

- **PageSpeed Insights**: 90+ score
- **Core Web Vitals**: Optimized
- **SEO**: Full optimization
- **Accessibility**: WCAG compliant
- **Mobile**: Responsive design

## 🔒 Security

- **Row Level Security**: Database-level protection
- **Environment Variables**: Secure configuration
- **Input Validation**: Client and server-side validation
- **CORS**: Cross-origin protection
- **Authentication**: Secure admin access

## 📝 API Endpoints

### Public APIs
- `GET /api/projects` - Get all projects
- `GET /api/projects/[slug]` - Get project by slug
- `GET /api/news` - Get all news
- `GET /api/news/[slug]` - Get news by slug
- `GET /api/about` - Get about content
- `GET /api/contact` - Get contact info
- `GET /api/slider` - Get slider content
- `GET /api/what-we-do` - Get services
- `GET /api/awards` - Get awards
- `POST /api/newsletter` - Subscribe to newsletter

### Admin APIs (Protected)
- All CRUD operations for content management
- File upload and deletion
- User authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the code comments and TypeScript types
- **Issues**: Create an issue on GitHub
- **Deployment**: See deployment scripts and environment setup

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Advanced image optimization
- [ ] PWA features
- [ ] Advanced SEO features

---

**Built with ❤️ using Next.js, Supabase, and TypeScript**
