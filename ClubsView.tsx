@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Plus Jakarta Sans', 'Inter', sans-serif;
}

html { font-family: var(--font-sans); -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
body { background-color: #faf7f0; color: #0f2a20; }
.font-display { font-family: var(--font-display); }

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #b3d1c8; border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: #80b4a6; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
@keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(45, 110, 94, 0.4); } 70% { box-shadow: 0 0 0 8px rgba(45, 110, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(45, 110, 94, 0); } }

.animate-fade-in { animation: fadeIn 0.4s ease-out both; }
.animate-scale-in { animation: scaleIn 0.25s ease-out both; }
.animate-pulse-ring { animation: pulse-ring 2s infinite; }
.skeleton { background: linear-gradient(90deg, #ece3cd 25%, #f5efe1 50%, #ece3cd 75%); background-size: 1000px 100%; animation: shimmer 1.6s infinite linear; }

.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
