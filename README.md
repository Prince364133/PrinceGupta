<<<<<<< HEAD
# PrinceGupta
=======
# Firebase Portfolio CMS Platform

A comprehensive, admin-controlled personal portfolio platform built with Next.js and Firebase.

## 🚀 Features

### Public Features
- **Dynamic Homepage** with hero section, animated counters, and featured content
- **About/Journey Page** with timeline visualization
- **Skills Showcase** with category filtering and proficiency meters
- **Projects Portfolio** with detailed pages and status tracking
- **Startups & Ventures** documentation with outcomes and lessons
- **Media Gallery** with lightbox viewing
- **Contact Form** with Firebase integration
- **Instagram Integration** for social presence

### Admin Features
- **Secure Authentication** with Firebase Auth and role-based access
- **Dashboard** with analytics and quick actions
- **Full CRUD** for all content collections
- **Image Upload Manager** with Firebase Storage
- **Form Management** for contact submissions
- **SEO Manager** for meta tags and structured data
- **Analytics Dashboard** for visitor tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Analytics)
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Icons**: React Icons
- **Date Handling**: date-fns

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase config

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Enable Firebase Storage
5. Copy your config to `.env.local`

### Security Rules

Deploy the included security rules:

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage
```

### Admin Setup

After deployment, set up your admin account:

1. Create a user in Firebase Authentication
2. Add a document in the `admin` collection:
   ```json
   {
     "role": "admin",
     "email": "your-email@example.com"
   }
   ```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (public pages)/    # Homepage, About, Skills, etc.
│   ├── admin/             # Admin panel pages
│   ├── globals.css        # Global styles
│   └── layout.js          # Root layout
├── components/
│   ├── ui/                # Reusable UI components
│   ├── sections/          # Page sections
│   ├── layout/            # Layout components
│   └── admin/             # Admin-specific components
├── lib/
│   ├── firebase/          # Firebase configuration
│   ├── schema/            # Data schemas
│   └── utils/             # Utility functions
├── firestore.rules        # Firestore security rules
├── storage.rules          # Storage security rules
└── firebase.json          # Firebase configuration
```

## 🎨 Design System

### Colors (Minimal Entrepreneur Theme)
- **Background**: `#0D0D0D`
- **Primary**: `#3B82F6` (Professional Blue)
- **Secondary**: `#10B981` (Success Green)
- **Accent**: `#1E1E1E`

### Typography
- **Sans**: Inter
- **Mono**: Source Code Pro

## 📝 Content Management

### Adding Content

1. Log in to the admin panel at `/admin/login`
2. Navigate to the relevant section (Projects, Skills, etc.)
3. Use the CRUD interface to add/edit/delete content
4. Upload images through the media manager
5. Changes are immediately reflected on the public site

### Collections

- **profile**: Hero section and personal info
- **education**: Timeline entries
- **skills**: Technical skills with proficiency
- **projects**: Portfolio projects
- **startups**: Entrepreneurial ventures
- **media**: Images and videos
- **forms**: Contact form submissions
- **seo_settings**: Page-specific SEO configuration

## 🔒 Security

- **Firestore Rules**: Public read, admin-only write
- **Storage Rules**: Public read, admin-only write with file validation
- **Authentication**: Role-based access control
- **Environment Variables**: Sensitive data in `.env.local`

## 📊 Analytics

The platform tracks:
- Page views
- Button clicks
- Form submissions
- Project views

View analytics in the admin dashboard.

## 🚀 Deployment

### Firebase Hosting

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

### Custom Domain

1. Go to Firebase Console → Hosting
2. Add custom domain
3. Follow DNS configuration instructions

## 🔄 Scaling

### Performance Optimization
- Images are optimized and lazy-loaded
- Firebase CDN for global distribution
- Firestore indexes for fast queries
- Client-side caching

### Future Enhancements
- Blog functionality
- Newsletter integration
- Advanced analytics
- Multi-language support
- Dark/Light mode toggle

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🤝 Contributing

This is a personal portfolio template. Feel free to fork and customize for your own use.

## 📧 Support

For issues or questions, please open an issue on GitHub or contact via the portfolio contact form.

---

**Built with ❤️ using Next.js and Firebase**
>>>>>>> 3ac1690 (Initial commit: Portfolio website with admin panel and data upload feature)
