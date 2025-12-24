# Cat Gallery - Quick Start Guide

## 🚀 Quickest Setup

1. **Get your API key** (free)
   - Visit [thecatapi.com](https://thecatapi.com)
   - Sign up for a free account
   - Copy your API key

2. **Set up the app**
   ```bash
   cd /Users/admin/Projects/75HC/75HC-JS/cat_book
   
   # Create .env.local
   echo "NEXT_PUBLIC_CAT_API_KEY=your_api_key_here" > .env.local
   ```

3. **Run it**
   ```bash
   bun install  # (or npm install)
   bun dev      # (or npm run dev)
   ```

4. **Open browser**
   - Go to http://localhost:3000

## 📌 Pages

| Route | Purpose |
|-------|---------|
| `/` | Random cat display with favorites |
| `/browse` | Filter by breed & paginate |
| `/cat/[id]` | Full breed details & info |

## ✨ Key Features

- 🎲 **Random**: Get a random cat instantly
- ❤️ **Favorites**: Save cats you love (stored locally)
- 🔍 **Filter**: Browse 18+ cat breeds
- 📖 **Details**: Learn origin, temperament, lifespan
- 📱 **Responsive**: Mobile-first design
- ⚡ **Fast**: Built with Next.js & optimized images

## 🔑 Environment Variables

Only one variable needed in `.env.local`:
```
NEXT_PUBLIC_CAT_API_KEY=live_RqFEbIONQEviwDf2moYVMufa211aAmVG83YCVjfqNhHZNV5v83e2BiBMd0QNWpiL
```

(Your API key is already configured)

## 🛠️ Tech Stack

- Next.js 16 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- The Cat API for data
- localStorage for favorites

## 📦 Project Structure

```
components/
  ├── Navigation.tsx       # Top nav bar
  ├── CatImageDisplay.tsx # Single cat card
  ├── CatGrid.tsx        # Grid of cats
  └── LoadingSpinner.tsx # Loading indicator

lib/
  └── catApi.ts          # API functions

app/
  ├── page.tsx           # Home (random)
  ├── browse/page.tsx    # Browse & filter
  ├── cat/[id]/page.tsx  # Detail page
  └── layout.tsx         # Root layout
```

## 🎯 Common Tasks

**View random cats**
- Visit homepage, click "Get Random Cat"

**Find a specific breed**
- Go to /browse
- Select breed from dropdown
- Use prev/next to paginate

**Save a favorite**
- Click "Add to Favorites" on any cat
- View all in "My Favorite Cats" section

**Learn about a breed**
- Click any cat in the grid
- See full details, origin, temperament
- Visit Wikipedia link for more info

## 🔧 Development

**Build for production**
```bash
bun run build
bun start
```

**Check for issues**
```bash
bun run lint
```

## 📚 API Endpoints Used

- `GET /v1/images/search` - Get cat images
- `GET /v1/images/{id}` - Get specific cat

## 🐛 Troubleshooting

**"API Error" messages?**
- Check your API key is valid
- Verify internet connection
- Check browser console for details

**Favorites not persisting?**
- Enable localStorage in browser
- Try a different browser
- Clear cache and reload

**Images not loading?**
- Check internet connection
- Verify API key is correct
- The Cat API might be temporarily down

## 📖 Learn More

- [The Cat API Docs](https://documenter.getpostman.com/view/25236/2s9YkgD5G)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Happy cat browsing!** 🐱❤️
