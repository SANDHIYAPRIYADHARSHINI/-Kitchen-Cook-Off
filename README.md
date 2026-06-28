# 🍳 CodeChef Kitchen Cook-Off — Contest Control Center

A kitchen-themed competitive programming contest dashboard built with Next.js, React, TypeScript, and Zustand.

## Screenshots

The app features:
- 🥕 Custom carrot cursor throughout the entire app
- 🍳 Cooker/pressure-cooker navigation buttons with animated lid lift on hover
- 🌙/☀️ Dark and light theme toggle (persisted in localStorage)

---

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Zustand** (state management + persistence)
- **Recharts** (area chart on dashboard)
- **Lucide React** (icons)

---

## Project Setup

```bash
# Clone and install
npm install

# Run dev server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Folder Structure

```
app/
├── components/
│   ├── CarrotCursor.tsx     # Custom SVG carrot cursor
│   ├── Navbar.tsx           # Cooker-button nav with lid animation
│   ├── Dashboard.tsx        # Kitchen HQ — stats, chart, activity feed
│   ├── Participants.tsx     # Chef roster with search/filter/sort/pagination
│   ├── Submissions.tsx      # Dish monitor with rejudge system
│   └── Leaderboard.tsx      # Live rankings with freeze mode + CSV export
├── data/
│   └── mockData.ts          # All mock participants, problems, submissions, activities
├── store/
│   └── contestStore.ts      # Zustand store — all state + actions
├── types/
│   └── index.ts             # TypeScript interfaces
├── globals.css              # Carrot cursor hide, scrollbar styles
├── layout.tsx               # Root layout
└── page.tsx                 # Main page with tab routing
```

---

## State Management Approach

**Zustand** is used as a single global store (`contestStore.ts`) with:

- `participants` — array of all contestants, recalculated on rejudge/unfreeze
- `submissions` — all submissions; new ones can be added
- `activities` — reverse-chronological activity feed
- `isFrozen` / `frozenLeaderboard` — freeze mode snapshot
- `lastRejudge` — enables undo functionality
- `theme` — dark/light, **persisted to localStorage**
- `activeTab` — current page/tab

---

## Data Flow

```
mockData.ts → Zustand Store → Components (read via useContestStore hook)
                    ↑
              User Actions (rejudge, freeze, toggle theme, navigate)
```

1. App initialises with mock data loaded into Zustand
2. Components subscribe to only the slices they need
3. Actions mutate store state → React re-renders affected components
4. Rejudge → `recalcRanks()` recalculates all participant ranks dynamically
5. Freeze snapshots the current leaderboard; unfreeze triggers recalculation
6. Theme is persisted via Zustand `persist` middleware

---

## Features Implemented

### Core (All 7 required features)
- ✅ Contest Overview Dashboard (stats, countdown, chart, activity feed, mini leaderboard)
- ✅ Participant Management (search, multi-filter, sort by any column, pagination)
- ✅ Submission Monitoring (filter by verdict/problem/participant, all 6 verdict types)
- ✅ Dynamic Leaderboard (auto-recalculates on any verdict change)
- ✅ Contest Freeze Mode (snapshot + recalculate on unfreeze)
- ✅ Rejudge System (inline verdict picker, full rank recalculation)
- ✅ Activity Feed (reverse chronological, all event types)

### Bonus Features
- ✅ Dark / Light Mode (persisted to localStorage)
- ✅ Export Leaderboard as CSV
- ✅ Persist theme via localStorage (Zustand persist)
- ✅ Undo Last Rejudge Action
- ✅ 🥕 Custom carrot cursor (SVG, follows mouse)
- ✅ 🍳 Cooker navigation buttons with animated lid lift on hover

---

## Assumptions Made

- Contest start/end times are fixed in `mockData.ts` (past times, so countdown shows 0)
- Ranking: sorted by `problemsSolved DESC`, then `penaltyTime ASC`
- Penalty = minutes elapsed from contest start to accepted submission
- Only `Accepted` verdicts count toward solved count and penalty
- Each participant can solve each problem only once (first AC counts)
- Freeze mode prevents leaderboard UI updates but submissions still appear in the monitor

---

## Design Concept

**Kitchen Cook-Off** — contestants are "chefs", problems are "dishes", the app is a "kitchen control center".

- **Dark theme**: deep grays (`gray-950`, `gray-800`) with orange (`#F97316`) accents
- **Light theme**: warm ambers and whites with orange accents
- **Carrot cursor**: custom SVG carrot with green tops, replaces system cursor app-wide
- **Cooker buttons**: SVG pressure cookers in the navbar; lid lifts on hover with a spring animation, flame appears under active tab
