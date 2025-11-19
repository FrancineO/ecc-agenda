# Pega ECC 2025 Conference Agenda

A comprehensive conference agenda application built with Next.js, featuring user authentication, delivery circle breakouts, regional sessions, interactive room maps, and MongoDB integration.

## 🚀 Features

### 🔐 **User Authentication & Management**
- **Email/Pega ID Login**: Secure user lookup via MongoDB database
- **Personalized Experience**: Welcome messages and role-based content
- **Session Persistence**: User data stored in localStorage for seamless navigation

### 🎯 **Delivery Circle Breakouts**
- **Dynamic Breakout Groups**: Viktoria, Sparta, Slavia, and Management tracks
- **Saturday Override Support**: Special Saturday-only delivery circle assignments
- **Automatic Routing**: Users automatically directed to correct breakout based on day
- **Clear Assignment Display**: Separate Friday/Saturday group labels when different

### 📅 **Multi-Day Schedule Management**
- **Three-Day Event**: Thursday, Friday, and Saturday sessions
- **Smart Navigation**: Tab-based day switching with proper breakout group routing
- **Day-Specific Content**: Different agendas for each delivery circle and day

### 🗺️ **Interactive Room Maps**
- **Clickable Room Links**: Click any room name to view location map
- **Modal Display**: Full-screen map overlay with venue details
- **Local Asset Management**: Optimized image serving from `/public/maps/`

### 🏷️ **Enhanced Session Categorization**
- **Break Type Badges**: Visual indicators for coffee breaks vs. meals
- **Color-Coded Badges**: Pink for coffee breaks, yellow for meals
- **Duration Display**: Clear session timing and length indicators
- **Session Type Icons**: Visual distinction between session types

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for all device sizes
- **Corporate Branding**: Pega-themed styling and colors
- **Smooth Animations**: Scroll-based card animations and transitions
- **Accessible Design**: WCAG-compliant interface elements

## 🛠️ Getting Started

### Prerequisites

- **Node.js 18+**
- **MongoDB Database** (for user management)
- **Environment Variables** (see `.env.local.example`)

### Environment Setup

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://your-mongodb-connection-string
MONGODB_DB_NAME=userlist
```

### Development

1. **Install dependencies**:
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open your browser**: [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

### Database Management

Check database connection and user count:
```bash
npm run db:status
```

Migrate users (if needed):
```bash
npm run db:migrate
```

## GitHub Pages Deployment

This project is configured for automatic GitHub Pages deployment:

### Automatic Deployment

1. **Push to main branch** - GitHub Actions will automatically build and deploy
2. **Enable GitHub Pages** in your repository settings:
   - Go to Settings > Pages
   - Source: GitHub Actions
   - The site will be available at `https://[username].github.io/[repository-name]`

### Manual Deployment

```bash
# Build the static export
npm run build

# Deploy the out/ directory to GitHub Pages
# (You can use gh-pages or manually upload the out/ directory)
```

## 📁 Project Structure

```
├── src/app/
│   ├── [breakout-group]/[day]/   # Dynamic routes for delivery circles
│   │   ├── page.tsx              # Static generation for all combinations
│   │   └── RegionDayClient.tsx   # Main agenda display component
│   ├── api/                      # API endpoints
│   │   ├── user-lookup/          # User authentication endpoint
│   │   ├── migrate-users/        # Database migration endpoint
│   │   └── test-connection/      # Database health check
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Login/homepage
│   └── HomePage.module.css       # Login page styles
├── components/
│   ├── AnimatedCardWrapper.tsx   # Scroll-based animation wrapper
│   ├── RoomMapModal.tsx          # Interactive room map modal
│   └── Header.tsx                # Navigation header component
├── services/
│   ├── MultiDayConferenceService.ts  # Conference data management
│   ├── UserDatabaseService.ts        # MongoDB user operations
│   ├── ClientUserService.ts          # Client-side user lookup
│   └── UserLookupService.ts          # Server-side user validation
├── utils/
│   └── breakoutGroupUtils.ts     # Delivery circle name mapping utilities
├── data/
│   └── multi-day-agenda.json     # Complete conference agenda data
├── public/
│   └── maps/                     # Room map images and assets
├── lib/
│   └── mongodb.ts                # MongoDB connection configuration
└── styles/                       # Global CSS and component styles
    ├── conference-agenda.css     # Main application styles
    └── animations.css            # Animation and transition styles
```

## ⚙️ Configuration

### Conference Data
- **Agenda Content**: Edit `data/multi-day-agenda.json` to update sessions, speakers, and schedules
- **Delivery Circles**: Configure breakout groups in the JSON structure
- **Room Information**: Add room details and map links in the rooms section

### User Management
- **Database Structure**: MongoDB collection with user delivery circle assignments
- **Saturday Overrides**: Support for special Saturday-only delivery circle assignments
- **Regional Breakouts**: Geographic groupings (Central, North, South)

### Styling & Branding
- **Main Styles**: Modify `src/styles/conference-agenda.css` for layout and colors
- **Animations**: Update `src/styles/animations.css` for transitions and effects
- **Component Styles**: Individual component CSS files and modules

### Room Maps
- **Image Assets**: Add room map images to `/public/maps/` directory
- **Map Links**: Configure `mapLink` properties in room objects
- **Modal Display**: Customize room information in `RoomMapModal.tsx`

## 🌐 URL Structure & Navigation

### Authentication Flow
- `/` - Login page (email/Pega ID entry)
- Automatic redirection to user's appropriate delivery circle

### Delivery Circle Routes
- `/delivery-circle-1/[day]` - Viktoria delivery circle
- `/delivery-circle-2/[day]` - Sparta delivery circle  
- `/delivery-circle-3/[day]` - Slavia delivery circle
- `/management/[day]` - Management track

### Day-Specific Navigation
- `/[breakout-group]/thursday` - Thursday agenda
- `/[breakout-group]/friday` - Friday agenda
- `/[breakout-group]/saturday` - Saturday agenda (with override support)

### Smart Routing Features
- **Automatic Redirection**: Users routed to correct group based on day
- **Saturday Overrides**: Special handling for Saturday-only delivery circle changes
- **Invalid Route Protection**: Redirects to homepage for invalid combinations

## 🧑‍💻 Technologies & Dependencies

### Core Framework
- **Next.js 15.4.6** - React framework with App Router and static generation
- **React 19.1.0** - UI library with latest features
- **TypeScript** - Type safety and developer experience

### Database & Backend
- **MongoDB** - User data and authentication storage
- **MongoDB Driver 6.20.0** - Node.js database connectivity
- **Server-Side APIs** - User lookup and database management

### Styling & UI
- **CSS Modules** - Component-scoped styling
- **CSS Grid & Flexbox** - Modern responsive layouts
- **Custom CSS Variables** - Consistent theming and colors

### Utilities & Tools
- **classnames** - Dynamic CSS class management
- **dotenv** - Environment variable management
- **ESLint** - Code quality and consistency

### Development & Build
- **Static Generation** - Pre-rendered pages for optimal performance
- **Image Optimization** - Next.js Image component for room maps
- **Animation System** - Custom scroll-based animations

## 🚀 Deployment

This application is designed for deployment on platforms that support Node.js and MongoDB:

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Environment Variables Required
```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=userlist
```

### Database Setup
1. **MongoDB Atlas** (recommended) or self-hosted MongoDB
2. Create database collection: `attendees`
3. Import user data with required fields:
   - Email
   - Pega ID  
   - Delivery Circle Breakout
   - Regional Breakout
   - Saturday Delivery Circle Breakout (optional)
   - Preferred Name
   - Last Name

## 📝 User Data Structure

### Required MongoDB Fields
```json
{
  "Email": "user@example.com",
  "Pega ID": "USER123",
  "Delivery Circle Breakout": 1,
  "Regional Breakout": "Central",
  "Preferred Name": "John",
  "Last Name": "Doe",
  "Saturday Delivery Circle Breakout": 2  // Optional
}
```

### Delivery Circle Mapping
- **1** → delivery-circle-1 (Viktoria)
- **2** → delivery-circle-2 (Sparta)  
- **3** → delivery-circle-3 (Slavia)
- **Other** → management

## 🎯 Getting Started

### Prerequisites
- **Node.js 18+** and npm
- **MongoDB** database (Atlas or self-hosted)
- User data collection with required fields

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pega-ecc-2025-agenda
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env.local` file in root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB_NAME=userlist
   ```

4. **Prepare your MongoDB database**
   - Create collection named `attendees`
   - Import user data with all required fields
   - Ensure delivery circle mappings align with route structure

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Login with your email to access personal agenda
   - Navigate through breakout groups and days

### Build for Production
```bash
npm run build
npm start
```

## 🔧 Development

### Adding New Features
1. **New Components**: Place in `/components` directory
2. **Styling**: Use CSS modules with component-specific files
3. **Services**: Add to `/services` for external integrations
4. **Routes**: Use Next.js App Router conventions in `/src/app`

### Code Style
- TypeScript for all new code
- CSS modules for component styling
- Descriptive component and function names
- Comment complex logic and business rules

## 🔍 Troubleshooting

### Common Issues
1. **"User not found"** - Check email format and database connection
2. **Room maps not loading** - Verify files exist in `/public/maps/`
3. **Saturday breakout not working** - Ensure user has `saturdayBreakoutGroup` field
4. **Styling issues** - Check CSS specificity and module imports

### Database Connection
- Verify MongoDB URI and database name
- Check network connectivity and authentication
- Ensure collection name matches service configuration

## 📞 Support

For development questions or deployment issues:
- Check Next.js documentation for framework questions
- MongoDB documentation for database setup
- Review component code for customization examples
