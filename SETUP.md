# Line-Inn - Premium E-Commerce Platform

A modern, scalable e-commerce platform built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Radix UI components**.

## ✨ Features

- **Next.js 15** - Latest React framework with App Router and server components
- **TypeScript** - Full type safety and better IDE support
- **Tailwind CSS** - Utility-first CSS framework with Tailwind CSS v4
- **Radix UI** - Accessible, unstyled component primitives
- **Fast Refresh** - Instant hot module reloading for development
- **Responsive Design** - Mobile-first, fully responsive interface
- **State Management** - React Context for cart and theme management
- **Dark Mode Support** - Built-in theme provider with `next-themes`

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.17 or later
- **Yarn**: 1.22 or later (or npm/pnpm)

### Installation

1. **Clone and install dependencies**:

```bash
git clone <repository-url>
cd e-commerce
yarn install
```

2. **Environment variables** (optional):

```bash
cp .env.example .env.local
```

3. **Start development server**:

```bash
yarn dev
```

The app will be available at `http://localhost:3000` with **hot reload enabled**.

## 📦 Project Structure

```
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx         # Root layout wrapper
│   ├── page.tsx           # Homepage
│   ├── shop/              # Shop page
│   ├── product/[id]/      # Dynamic product detail pages
│   ├── cart/              # Cart page
│   ├── wishlist/          # Wishlist page
│   ├── contact/           # Contact page
│   └── [other pages]/     # Additional pages
├── components/            # Reusable React components
│   ├── ui/                # Radix UI component library
│   ├── home/              # Homepage-specific components
│   ├── product/           # Product-related components
│   ├── navbar.tsx         # Navigation bar
│   ├── footer.tsx         # Footer
│   ├── theme-provider.tsx # Theme context provider
│   └── theme-toggle.tsx   # Dark mode toggle
├── hooks/                 # Custom React hooks
│   ├── use-toast.ts       # Toast notifications
│   └── use-mobile.ts      # Mobile breakpoint detection
├── lib/                   # Utility functions and shared logic
│   ├── cart-context.tsx   # Cart state management
│   ├── products.ts        # Product data and utilities
│   └── utils.ts           # Helper functions
├── public/                # Static assets
├── styles/                # Global CSS and Tailwind config
├── next.config.mjs        # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies and scripts
```

## 🛠 Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Build for production |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint checks |
| `yarn lint:fix` | Fix ESLint issues automatically |
| `yarn type-check` | Check TypeScript types without emitting |
| `yarn format` | Format code with Prettier |
| `yarn clean` | Remove build artifacts and node_modules |

## 🔧 Configuration

### Next.js Configuration (`next.config.mjs`)

The config includes:
- **Fast Refresh**: Instant hot module reloading
- **Image Optimization**: Disabled by default (enable with `NEXT_IMAGE_UNOPTIMIZED=false`)
- **TypeScript**: Strict mode enabled, errors can be ignored with `NEXT_IGNORE_TYPE_ERRORS=true`
- **Performance**: Package import optimization for Radix UI and Lucide icons

### TypeScript Configuration (`tsconfig.json`)

- **Target**: ES2020 for modern JavaScript features
- **Strict Mode**: Full strict type checking enabled
- **Path Aliases**: Clean imports with `@/*` shortcuts

### Environment Variables (`.env.example`)

```env
# Site URL (used in metadata and canonical URLs)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Image optimization (set to 'true' to disable)
NEXT_IMAGE_UNOPTIMIZED=true

# TypeScript errors (set to 'true' to ignore during build)
NEXT_IGNORE_TYPE_ERRORS=false
```

## 🎨 Styling

- **Tailwind CSS v4** with PostCSS support
- **Responsive Design** with mobile-first approach
- **Dark Mode** supported via `next-themes`
- **Animation** framework with `tailwindcss-animate`

## 🧩 Component Library

All UI components are built with **Radix UI** primitives for maximum accessibility:

- Buttons, Inputs, Forms
- Modals, Dialogs, Popovers
- Tabs, Accordions, Carousels
- Dropdowns, Menus, Navigation
- Tooltips, Badges, Avatars
- And many more...

See `components/ui/` for the complete collection.

## 🔌 State Management

### Cart Context

Manage shopping cart state globally using React Context:

```tsx
import { CartProvider, useCart } from '@/lib/cart-context'

// In your component
const { cart, addToCart, removeFromCart } = useCart()
```

### Theme Provider

Switch between light and dark modes:

```tsx
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
```

## 🚀 Deployment

### Build for Production

```bash
yarn build
yarn start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Vercel will auto-detect Next.js and configure deployment
4. Set environment variables in Vercel Dashboard
5. Deploy with a single click!

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Dev server won't start

1. Clear cache and reinstall:
   ```bash
   yarn clean
   yarn install
   ```

2. Check Node.js version:
   ```bash
   node --version  # Should be 18.17+
   ```

3. Kill existing processes on port 3000:
   ```bash
   lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
   ```

### Type errors during build

Set `NEXT_IGNORE_TYPE_ERRORS=true` in `.env.local` temporarily, or fix errors with:

```bash
yarn type-check
```

### Hot reload not working

- Ensure `next.config.mjs` has `onDemandEntries` configured
- Clear `.next` folder: `rm -rf .next`
- Restart dev server: `yarn dev`

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub or contact the development team.
