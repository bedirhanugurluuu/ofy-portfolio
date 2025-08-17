# 🎨 Portfolio Website - Merkezi API Sistemi

Modern portfolio website with centralized API management system, ready for Vercel deployment.

## 🚀 Features

### Frontend (Next.js)
- **Modern Design**: Clean, responsive portfolio design
- **Animations**: GSAP animations and smooth transitions
- **Dynamic Content**: CMS-like content management
- **SEO Optimized**: Static generation with Next.js

### Admin Panel (React + Vite)
- **Centralized API System**: Single source of truth for all API calls
- **CRUD Operations**: Full content management
- **File Uploads**: Image and media management
- **TypeScript**: Full type safety

### Backend (Next.js API Routes)
- **Serverless Functions**: Vercel-ready API routes
- **Database Integration**: MySQL with connection pooling
- **File Handling**: Image uploads and management
- **CORS Support**: Cross-origin request handling

## 🏗️ Architecture

```
portfolio-ofy/
├── pages/                    # Next.js pages
│   ├── api/                  # API routes (serverless functions)
│   └── *.tsx                 # Frontend pages
├── components/               # React components
├── admin-panel/              # Admin panel (React + Vite)
│   ├── src/
│   │   ├── config/
│   │   │   └── api.ts        # Centralized API config
│   │   ├── utils/
│   │   │   └── api.ts        # API client and functions
│   │   └── pages/            # Admin pages
│   └── package.json
├── backend/                  # Legacy Express backend (for reference)
└── package.json
```

## 🔧 Centralized API System

### Benefits:
- ✅ **Single Configuration**: All API URLs managed in one place
- ✅ **Environment Auto-Detection**: Development/Production switching
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Error Handling**: Centralized error management
- ✅ **Authentication**: Automatic token management

### Usage:
```typescript
import { api } from '../utils/api';

// All API calls go through centralized system
const projects = await api.getProjects();
const newProject = await api.createProject(data);
const updatedProject = await api.updateProject(id, data);
await api.deleteProject(id);
```

## 🚀 Quick Start

### 🎯 Environment Switch Scripts

We've created convenient PowerShell scripts to switch between environments:

**For Local Development:**
```powershell
.\switch-to-local.ps1
```

**For Vercel Production:**
```powershell
.\switch-to-vercel.ps1
```

**Quick Deploy to Vercel:**
```powershell
.\quick-deploy.ps1
```

### 📋 Manual Setup

#### 1. Install Dependencies
```bash
npm install
cd admin-panel && npm install
```

#### 2. Environment Setup
```bash
# Copy environment examples
cp env.example .env.local
cp admin-panel/env.example admin-panel/.env
```

#### 3. Database Setup
```bash
# Run SQL scripts for database tables
# See DEPLOYMENT.md for details
```

#### 4. Development
```bash
# Frontend
npm run dev

# Admin Panel (in admin-panel directory)
npm run dev

# Backend (legacy, optional)
cd backend && npm run dev
```

## 🌐 Deployment

### Vercel Deployment
1. **Database**: Set up MySQL database (PlanetScale, Railway, etc.)
2. **Environment Variables**: Configure in Vercel dashboard
3. **Deploy**: Push to GitHub, Vercel auto-deploys

### Admin Panel Deployment
- Deploy as separate Vercel project
- Point to main API endpoints

See `DEPLOYMENT.md` for detailed instructions.

## 📁 Project Structure

### Frontend Pages
- **Home**: Landing page with hero section
- **About**: Company information with slider
- **Projects**: Portfolio showcase
- **Blog**: News and articles
- **Contact**: Contact information and form

### Admin Panel Sections
- **Dashboard**: Overview and navigation
- **About Management**: Company content
- **Projects**: Portfolio management
- **News**: Blog post management
- **Awards**: Recognition management
- **Slider**: Hero section management
- **What We Do**: Services section
- **Contact**: Contact information

### API Endpoints
- `/api/about` - About page content
- `/api/projects` - Project management
- `/api/news` - News/blog management
- `/api/awards` - Awards management
- `/api/slider` - Slider management
- `/api/what-we-do` - Services content
- `/api/contact` - Contact information

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **GSAP**: Animations
- **Framer Motion**: UI animations

### Admin Panel
- **React 19**: UI library
- **Vite**: Build tool
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Router**: Navigation

### Backend
- **Next.js API Routes**: Serverless functions
- **MySQL**: Database
- **Formidable**: File uploads
- **CORS**: Cross-origin support

## 📝 Environment Variables

### Main Project
```bash
DATABASE_HOST=your-database-host
DATABASE_USER=your-database-user
DATABASE_PASSWORD=your-database-password
DATABASE_NAME=your-database-name
NEXT_PUBLIC_API_BASE_URL=https://your-domain.vercel.app/api
```

### Admin Panel
```bash
VITE_API_BASE_URL=https://your-domain.vercel.app/api
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For deployment issues, see `DEPLOYMENT.md`.
For API system questions, check the centralized config files.
