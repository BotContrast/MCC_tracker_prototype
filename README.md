# MCC Player Tracker — React Prototype

Converted from the original HTML/CSS prototype into a Vite + React frontend.

## Run it
1. Open this folder in VS Code.
2. Open a terminal in the folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL Vite prints (normally http://localhost:5173).

## Prototype features
- React home, stats, and about views
- Player search (mocked: typed gamertag is shown on the stats page)
- Game navigation state
- Multiplayer/Campaign state
- Reusable StatCard, PlayerHeader, GameSidebar and Footer components
- Existing images and styling retained
- Mock data in `src/data/mockPlayer.js`

## Backend later
Replace the mock player data with a fetch call to your Express API (for example `/api/players/:gamertag`). The UI components can remain largely unchanged.
