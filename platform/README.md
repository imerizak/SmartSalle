# SmartSalle

## Setup Instructions

1. Create a new project at [Supabase](https://supabase.com)
2. Copy your project URL and anon key from the project settings
3. Create a `.env` file in the root directory
4. Add your Supabase credentials to the `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase project anonymous key

Make sure to enable Email auth in your Supabase Authentication settings.
