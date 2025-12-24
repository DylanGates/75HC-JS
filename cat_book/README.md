# 🐱 Cat Gallery

A beautiful Next.js web app for discovering and browsing cat images using The Cat API.

## Features

✨ **Random Cat Display** - Get random cat images with breed information
🔍 **Breed Filtering** - Filter cats by specific breeds
📖 **Detailed Information** - View comprehensive breed details like origin, temperament, and life span
❤️ **Favorites** - Save your favorite cats (stored in localStorage)
📱 **Responsive Design** - Works great on mobile, tablet, and desktop
🎨 **Modern UI** - Beautiful Tailwind CSS styling with gradients and animations
⚡ **Fast Loading** - Optimized Next.js app with Image component

## Getting Started

### Prerequisites

- Node.js 18+
- Bun or npm

### Installation

1. Navigate to project directory

```bash
cd cat_book
```

2. Install dependencies

```bash
bun install
# or
npm install
```

3. Set up environment variables
   Create a `.env.local` file and add your Cat API key:

```env
NEXT_PUBLIC_CAT_API_KEY=your_api_key_here
```

Get your free API key from [The Cat API](https://thecatapi.com/)

4. Run the development server

```bash
bun dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
cat_book/
├── app/
│   ├── page.tsx              # Random cat page
│   ├── browse/
│   │   └── page.tsx          # Browse & filter page
│   ├── cat/
│   │   └── [id]/
│   │       └── page.tsx      # Cat detail page
│   ├── layout.tsx            # Root layout with navigation
│   ├── globals.css           # Global styles
│   └── favicon.ico
├── components/
│   ├── Navigation.tsx        # Top navigation
│   ├── CatImageDisplay.tsx  # Single cat display component
│   ├── CatGrid.tsx          # Grid layout for multiple cats
│   └── LoadingSpinner.tsx   # Loading indicator
├── lib/
│   └── catApi.ts            # API functions
├── public/                  # Static assets
└── package.json
```

## Features in Detail

### 🎲 Random Cat Page

- Display a random cat image with breed information
- One-click refresh to get a new random cat
- Add cats to your favorites
- View all your favorited cats

### 🔍 Browse Page

- Filter cats by 18 different breeds
- Paginate through results
- Responsive grid layout
- Loading states and error handling

### ❤️ Favorites

- Save favorite cats locally
- Persistent storage using localStorage
- Quick view of all favorites
- Remove cats from favorites with one click

### 📖 Detailed Info

- Individual cat detail pages
- Full breed information including:
  - Origin country
  - Temperament traits
  - Life span
  - Wikipedia link
- Image dimensions and ID

## API Usage

The app uses The Cat API with these endpoints:

- `GET /images/search` - Get random cat images
- `GET /images/{id}` - Get specific cat by ID

Query parameters supported:

- `limit` - Number of images (1-100)
- `page` - Page number for pagination
- `breed_ids` - Filter by breed ID
- `order` - Sort order (ASC, DESC, RAND)

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **The Cat API** - Cat data source
- **localStorage** - Client-side persistence

## Building for Production

```bash
bun run build
bun start
# or
npm run build
npm start
```

## Git Commits

The app was built progressively with these features:

1. Add cat API service and random image display
2. Add cat grid, breed filtering, pagination, navigation
3. Add favorites feature with localStorage
4. Add detail page and loading component

## Resources

- [The Cat API Docs](https://documenter.getpostman.com/view/25236/2s9YkgD5G)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Made with 🐱 and ❤️

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
