
# JS Radio Stream App

A modern, responsive internet radio streaming web app built with HTML, CSS, and vanilla JavaScript. It uses the Radio Browser API to fetch and stream live internet radio stations from around the world.

## Features

- Real-time audio streaming with play/pause controls
- API integration with live radio station data (radio-browser.info)
- Category-based filtering: Top 100, Trending, Most Voted, Recently Added, Podcasts
- Live search with instant results and fallback messaging
- Slide-out mobile menu navigation for smooth UX
- Responsive layout for mobile and desktop devices
- Clean, modular UI with carousel-style station display

## Technologies Used

- HTML5 / CSS3 / JavaScript
- Font Awesome (icons)
- Radio-Browser API (free, open-source)

## File Structure

\`\`\`
project-root/
│
├── index.html        # Main HTML layout
├── style.css         # All UI styling
├── script.js         # App logic, API calls, audio control
├── img/              # Default station image fallback
└── assets/           # (Optional) other static files
\`\`\`

## How to Run

1. Clone the repository:
   git clone https://github.com/phantekzy/js-radio-stream-app.git

2. Navigate into the folder:
   cd js-radio-stream-app

3. Open \`index.html\` directly in a browser, or use a local server:
   python3 -m http.server

## Planned Enhancements

- Volume controls and mute button
- Visual audio waveform or spectrum
- Save favorite stations to localStorage
- Light/dark theme toggle
- Better error handling for broken streams




