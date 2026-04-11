🎬 STREAMIX: Streamiverse Hub

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Aman-Real/streamiverse-hub)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)

**Streamiverse Hub** (branded as **STREAMIX**) is a high-performance, feature-rich video streaming platform interface. Built with a focus on cinematic user experience, it provides a seamless environment for discovering movies and series, managing personal watchlists, and tracking viewing progress with a custom-engineered video player.

---

## 🚀 Features

### 📺 Cinematic Viewing Experience
*   **Custom Video Player**: Fully featured player with play/pause, 10s skip, volume control, fullscreen mode, and real-time progress tracking.
*   **Hero Banners**: Dynamic featured content display with high-impact visuals.
*   **Interactive Video Cards**: Hover-sensitive cards providing quick previews and metadata.

### 🛠 Personalization & Management
*   **My List**: Add or remove titles from a personalized collection using a global state provider via `useMyList`.
*   **Watch History**: Track exactly where you left off with persistent progress bars for every title.
*   **Notification System**: Integrated alert panel for new releases and account updates.
*   **Profile Management**: Customizable user profiles and account settings.

### 🔍 Discovery & Navigation
*   **Smart Search**: Real-time filtering of the content library.
*   **Categorized Browsing**: Dedicated views for Movies, Series, and Genre-based rows.
*   **Help Center**: Comprehensive FAQ section with interactive accordions and support links.

### 📱 Technical Excellence
*   **Responsive Design**: Optimized for mobile, tablet, and desktop using Tailwind CSS and custom hooks like `use-mobile`.
*   **Performance**: Built on Vite for lightning-fast HMR and optimized production builds.
*   **Type Safety**: 100% TypeScript implementation for robust development.
## 🛠 Tech Stack

| Category | Technology |
| --- | --- |
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Lucide React (Icons), Shadcn/UI |
| **State/Data** | TanStack Query, Context API |
| **Routing** | React Router DOM v6 |
| **UI Components** | Radix UI (Accordion, Dialog, Dropdown, etc.) |
| **Testing** | Vitest, Testing Library |
| **Package Manager** | Bun, NPM |
## 🏗 Architecture

The project follows a modular React architecture focused on reusability and separation of concerns:

text
src/
├── components/       # Atomic UI components and layout elements
│   ├── ui/           # Shadcn/UI base components
│   └── ...           # Feature-specific components (VideoPlayer, Navbar)
├── hooks/            # Custom React hooks (useMyList, useNotifications, use-mobile)
├── lib/              # Utility functions and mock data (videoData.ts)
├── pages/            # View components mapped to routes (Movies, Series, Profile)
├── assets/           # Static images and styles
├── test/             # Test setup and example suites
└── App.tsx           # Root component with Providers and Routing

## 🚦 Getting Started

### Prerequisites
*   **Node.js**: v18.0.0 or higher
*   **Package Manager**: Bun (recommended) or NPM

### Installation

1.  **Clone the repository**
    bash
    git clone https://github.com/Aman-Real/streamiverse-hub.git
    cd streamiverse-hub
    

2.  **Install dependencies**
    bash
    bun install
    # OR
    npm install
    

3.  **Start the development server**
    bash
    bun dev
    # OR
    npm run dev
    

4.  **Build for production**
    bash
    bun run build
    
## 📖 Usage Examples

### Adding to "My List"
The application uses a custom `useMyList` hook to manage user collections globally:

```tsx
const { isInList, toggleList } = useMyList();
const inList = isInList(video.id);

<button onClick={() => toggleList(video)}>
  {inList ? <Check /> : <Plus />}
</button>
```

### Video Player Integration
The `VideoPlayer` component tracks progress and communicates updates back to the parent state:

```tsx
<VideoPlayer 
  video={selectedVideo} 
  onClose={() => setPlaying(false)} 
  onProgressUpdate={(id, progress) => handleUpdate(id, progress)}
/>
```

---

## 🔧 Configuration

The project uses a standard Vite configuration. Environment variables can be added to a `.env` file in the root:

env
VITE_APP_TITLE=STREAMIX
VITE_API_URL=https://api.example.com


Key configuration files:
*   `vite.config.ts`: Vite bundler and plugin configuration
*   `tailwind.config.ts`: Tailwind CSS theme and plugin setup
*   `tsconfig.json`: TypeScript compiler settings
## 🧪 Testing

The project uses **Vitest** for unit and component testing.

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 🛣 Roadmap
- [ ] Integration with TMDB API for real-time movie data.
- [ ] User authentication (Firebase/Supabase).
- [ ] Multi-profile support (Kids vs. Adults).
- [ ] Offline download simulation.
- [ ] Advanced video quality selector (4K/HD/SD).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 🆘 Support

For support, email support@streamix.app or visit the **Help Center** within the application.

Developed with ❤️ by [Aman](https://github.com/Aman-Real)
