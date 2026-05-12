# ToolNest — Full-Featured Online Tools Website

## Overview
Building a premium SaaS-style online tools website with 30+ tools across 6 categories using React + Vite + Tailwind CSS. The design targets a dark-first, cyberpunk-modern aesthetic inspired by Smallpdf/ILovePDF but darker and more vibrant.

## Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v6
- **File Uploads**: react-dropzone
- **QR Code**: qrcode.react
- **PDF Work**: pdf-lib (client-side PDF operations)
- **Image Work**: browser-image-compression, canvas API
- **Icons**: lucide-react
- **Notifications**: react-hot-toast
- **Fonts**: Inter (body) + Space Grotesk (display) via Google Fonts

## Project Structure
```
src/
├── components/
│   ├── layout/     (Navbar, Footer, Layout)
│   ├── ui/         (ToolCard, DropZone, Button, Toast, Badge)
│   └── tools/      (shared tool page wrapper)
├── pages/
│   ├── Home.jsx
│   ├── categories/ (per-category listing pages)
│   └── tools/      (individual tool pages, ~30 files)
├── lib/
│   ├── converters/ (PDF, image processing logic)
│   └── utils.js
├── data/
│   └── tools.js    (tool metadata, icons, descriptions)
└── App.jsx + main.jsx
```

## Proposed Changes

### Foundation
#### [NEW] package.json, vite.config, tailwind.config, index.html
#### [NEW] src/index.css — design tokens, custom animations, scrollbar

### Layout & Navigation
#### [NEW] src/components/layout/Navbar.jsx — sticky, category links, theme toggle
#### [NEW] src/components/layout/Footer.jsx — links grid
#### [NEW] src/components/layout/Layout.jsx — wrapper with page transitions

### Data Layer
#### [NEW] src/data/tools.js — all 30+ tools with metadata

### UI Components
#### [NEW] src/components/ui/ToolCard.jsx
#### [NEW] src/components/ui/DropZone.jsx
#### [NEW] src/components/ui/Button.jsx
#### [NEW] src/components/ui/Badge.jsx
#### [NEW] src/components/ui/Toast.jsx

### Pages
#### [NEW] src/pages/Home.jsx — hero + search + tools grid
#### [NEW] src/pages/Category.jsx — per-category page

### Tool Pages (30+)
All converters, PDF tools, social downloaders, link tools, text tools

## Verification Plan
- Run `npm run dev`, open in browser
- Verify routing, tool pages, drag-and-drop, QR generation
- Check mobile responsiveness
- Verify toast notifications work
