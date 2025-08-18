# Pega ECC 2025 Conference Agenda

A dynamic conference agenda application built with Next.js, featuring regional breakout sessions and URL-based routing.

## Features

- 🌐 **Multi-region Support**: West, South, and North regions with specific breakout sessions
- 📅 **Multi-day Schedule**: Thursday, Friday, and Saturday sessions
- 🎯 **Dynamic Routing**: Direct URL access to specific region/day combinations
- ✨ **Smooth Animations**: Scroll-based card animations
- 📱 **Responsive Design**: Corporate styling matching Pega branding
- 🚀 **Static Export**: Optimized for GitHub Pages deployment

## Getting Started

### Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

### Building for Production

To create a static export for GitHub Pages:

```bash
npm run build
```

This will generate a `out/` directory with static files ready for deployment.

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

## Project Structure

```
├── src/app/
│   ├── [region]/[day]/     # Dynamic route for region/day pages
│   ├── [region]/           # Region redirect pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage (redirects to first region/day)
├── components/
│   └── AnimatedCardWrapper # Animation component
├── data/
│   └── multi-day-agenda.json # Conference data
├── services/
│   └── MultiDayConferenceService # Data service
└── styles/                 # CSS files
```

## Configuration

- **Region Data**: Edit `data/multi-day-agenda.json` to update sessions
- **Styling**: Modify CSS files in `src/styles/`
- **Build Settings**: Configure in `next.config.ts`

## URL Structure

- `/` - Homepage (redirects to first region/day)
- `/west` - West region (redirects to first day)
- `/west/friday` - West region Friday agenda
- `/south/saturday` - South region Saturday agenda
- etc.

## Technologies

- **Next.js 15.4.6** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **CSS Modules** - Styling
- **GitHub Actions** - CI/CD

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
