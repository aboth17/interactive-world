# Product Requirements Document: World Explorer

## One-liner

A personal, cinematic 3D globe that visualizes everywhere you've been — dark and mysterious where you haven't explored, vivid and alive where you have — with smooth drill-down into immersive street-level views and your own photos.

---

## Vision and Design Philosophy

This is not a travel tracker. It's a personal artifact — something you'd pull up to show someone at dinner, something that makes you feel a quiet sense of pride about the life you've lived. The design must feel like looking at a living planet from the window of a space station: dark, cinematic, and beautiful.

Every design decision should pass two tests:

1. **The contrast test.** Does this make the difference between "explored" and "unexplored" feel more dramatic?
2. **The emotional test.** Does this make the user feel something when they see their map?

The aesthetic is dark and cinematic. Think NASA control room, not Google Maps. A glowing planet floating in space, minimal chrome, the UI staying completely out of the way. The explored regions should feel warm and alive. The unexplored regions should feel vast and mysterious.

No feature should ship if it doesn't look beautiful. Functionality without polish is not acceptable for this product.

---

## Core Concepts

### The Fog of War

The globe renders Earth in a desaturated, darkened, slightly obscured state by default. Visited locations "punch through" this fog to reveal vivid, full-color satellite imagery underneath. The fog itself should not be a flat grey overlay — it should have subtle depth: drifting cloud-like noise, slight variation in opacity, an organic quality that makes the unexplored world feel alive but hidden.

The fog is built in two stages:

1. **Basic fog (hard cutouts).** Visited polygons are cleanly removed from the dark overlay, revealing vivid satellite imagery underneath. The contrast between visited and unvisited is the priority — get this right even with hard edges.
2. **Beautiful fog (organic and alive).** Procedural noise (Perlin/simplex) adds organic variation to the fog layer. Boundaries between visited and unvisited get soft, feathered edges. The fog slowly drifts with subtle animation, making the unexplored world feel atmospheric rather than static.

### Night-Side City Lights

On the unvisited/dark hemisphere, a very faint NASA nighttime Earth texture is blended in. This must be extremely understated — a whisper of city lights on the dark side, not a competing visual layer. The purpose is to give the unexplored world a hint of life and mystery. Visited areas still dominate because they show full-color satellite imagery; the nighttime texture only shows through the fog.

### City Ember Glow

Every visited city emits a warm amber point-light visible from globe scale. At full zoom-out, the globe is a dark planet with scattered warm dots — YOUR cities glowing like embers. This is the "quiet pride" moment: a deeply personal view of the planet where the only lights are places you've been.

### Real-Time Day/Night Terminator

A shader uniform driven by the sun's current position casts a realistic day/night shadow across the globe. The terminator line adds realism and makes the globe feel like a living object, not a static texture. The shadow of night creeping across your explored regions is visceral.

### Tiered Reveal System

There is no single unit of "visited." The system uses a three-tier model:

**Tier 1 — Country polygons.** The base reveal unit for most of the world. Visiting any city in Portugal reveals all of Portugal. At globe scale, this is how the map reads.

**Tier 2 — Region/state subdivision.** Large countries (threshold: ~1M sq km land area) subdivide into administrative regions. The US reveals by state, Canada by province, China by province, Russia by federal district, Australia by state, Brazil by state, India by state. This prevents a single visit to New York from lighting up all of Alaska.

**Tier 3 — City pins.** An overlay on top of polygon reveals. Every visited city gets a pin/glow marker regardless of which polygon it belongs to. These serve as drill-down targets for street view and photo browsing, and add visual richness to revealed regions.

The logic is automatic. A user enters "Austin, TX" and the system resolves it to a city pin on Austin + a polygon reveal on Texas (because the US is a large country). A user enters "Lisbon" and the system resolves it to a city pin on Lisbon + a polygon reveal on all of Portugal.

Users can override: a "mark entire country as visited" action should be available for cases where the auto-subdivision feels wrong.

### Zoom-Dependent Rendering

What is visible should change with zoom level:

- **Globe view (fully zoomed out):** Country/region polygons only. City ember glows visible. City labels hidden. The fog of war is the dominant visual.
- **Continent view (medium zoom):** Polygons still visible, city pins appear with labels. Fog thins slightly to show more terrain detail in explored areas.
- **Country/region view (zoomed in):** City pins are prominent. Explored areas show full satellite detail. Unexplored neighboring areas remain fogged.
- **City view (deep zoom):** Transitions toward street-level. Photo thumbnails begin appearing around the city. Pin becomes a drill-down target.
- **Street view (maximum zoom):** Full 360-degree panoramic viewer takes over.

---

## Features (MVP)

### F1: Interactive 3D Globe

A photorealistic 3D Earth rendered in a darkened/desaturated state. Smooth rotation, zoom, and pan. Atmospheric glow around the planet edge. Realistic star field background. The globe should feel like it's floating in space.

**Implementation:** Custom Three.js scene with `OrbitControls`. Full control over the rendering pipeline, camera, lighting, and post-processing.

**Atmospheric rendering details:**

- Atmospheric scattering effect on the globe's edge (subtle blue-white Fresnel glow, with depth — not a flat ring)
- Star field in the background (static is fine; parallax on rotation is a nice-to-have)
- Subtle ambient light so the dark side of the globe isn't pure black
- Real-time day/night terminator driven by sun position
- Post-processing pipeline: bloom on visited regions, subtle color grading, optional film grain

### F2: Fog of War Shader

The core visual effect. All unvisited areas are rendered dark, desaturated, and partially obscured. Visited areas show vivid, full-color satellite imagery. The transition at the boundary between visited and unvisited should have a soft, organic edge — not a hard polygon outline.

**Implementation approach:**

- Custom `ShaderMaterial` on a slightly-larger sphere overlaying the globe
- Pass visited polygons as a texture (rasterized polygon mask) to the shader
- The shader samples this mask to determine opacity at each fragment
- Apply procedural noise (Perlin or simplex) for organic fog variation
- Animate noise offset over time for subtle drift
- Soft edge blending at mask boundaries using distance field or blur

**Two-stage build:** Basic fog (hard cutouts, get the contrast right) ships first. Beautiful fog (noise, soft edges, animation) follows as a refinement pass. See Build Order for phasing.

### F3: Manual Place Entry

A minimal, elegant input for adding visited places. Text input with autocomplete powered by a bundled local city database. Resolves to coordinates + administrative hierarchy (city, region, country). Triggers the appropriate polygon reveal(s) and city pin creation.

**Input UX:**

- Floating search bar, minimal design, appears on demand (keyboard shortcut or small icon)
- Autocomplete dropdown with city, country format — instant results from local database
- After selection: the globe smoothly rotates to center the new location, then the arrival animation plays
- Support for both city-level ("Tokyo") and country-level ("I've been to Portugal") input
- Batch entry mode for initial setup: let users quickly add many places without waiting for animations (instant with local database, no rate limits)

### F4: Arrival Animations

When a new place is added, the reveal should feel like a moment of discovery. The polygon does not simply switch from dark to light — illumination radiates outward from the city pin in a pulse of warm light, spreading across the country/region polygon over ~1.5 seconds. The effect should feel like sunrise hitting a landscape.

This is a critical differentiator. Adding a place must feel rewarding.

### F5: Photo Import and Integration

Users can drop/upload photos. The app reads EXIF GPS metadata client-side and extracts coordinates. Photos are clustered by proximity and associated with visited cities. All processing happens in the browser — no photos leave the device.

**Photo display:**

- When zoomed into a visited city, photos appear as floating thumbnails clustered around the location
- Photos should feel integrated into the map, not like a separate gallery bolted on
- Subtle parallax or depth effect on photo thumbnails as the user pans
- Clicking a photo opens it in a lightbox-style viewer
- Photos without GPS data should be flagged with a gentle prompt: "This photo doesn't have location data. Want to place it manually?"

**MVP scope:** Photos are stored locally in the browser (IndexedDB). No cloud sync for MVP — this is a post-MVP feature. Original photos never leave the device.

### F6: Street-Level 360 Viewer

Clicking a city pin at sufficient zoom triggers a camera dive from the globe view into an immersive 360-degree street panorama. The transition uses a cinematic fade — not a page change, not a jarring pop-in.

**Transition sequence:**

1. Globe rotates to center the selected city
2. Camera dives toward the surface (eased acceleration curve, not linear)
3. At a threshold altitude, a brief cinematic **fade through black** (~300ms, like a blink) transitions from the 3D globe into the panoramic viewer
4. Panorama opens and auto-orients toward the most interesting direction (landmark if detectable, otherwise city center)

The fade-through-black is intentional and styled — it should feel like closing and opening your eyes, not like a loading screen. An alternative approach (crossfade using a screenshot of the last globe frame behind the panorama) can be explored if it feels smoother.

**Viewer requirements:**

- Full interactive panorama: pan, tilt, zoom
- Custom-styled controls (no default Google/Mapillary chrome)
- Subtle vignette around edges to frame the view
- Smooth exit animation: fade back to black, return to globe centered on the city

### F7: Exploration Stats

A subtle, non-intrusive stat display: "You've explored X% of Earth's surface." Updates live as places are added. Consider showing country count and city count as secondary stats. This should be a quiet presence, not a gamification layer — elegant typography, tucked into a corner or accessible via a small icon.

### F8: Sound Design

Ambient audio that elevates the experience from visual to sensory. Sound is **muted by default** with a minimal toggle in the UI to enable it.

**Sound layers:**

- **Globe scale:** Low-frequency space hum — a deep, barely-perceptible ambient drone that makes space feel vast
- **Zooming toward surface:** Gradual crossfade from space hum to atmospheric wind, increasing in presence as altitude decreases
- **Arrival animation:** A warm, resonant chime or tone when a new region reveals — the audio reward paired with the visual reward
- **Street-level:** Subtle ambient city/nature sounds (optional, could be sourced or generated)

**Implementation:** Web Audio API for spatial audio and crossfading. Audio assets loaded lazily (don't block globe rendering). Volume tied to zoom level for seamless transitions between layers.

---

## Tech Stack

### Frontend Framework

**React + TypeScript**, deployed on **Vercel** (free tier).

React because the component model maps well to the layered UI (globe, overlays, panels, modals), TypeScript for safety on a project with complex geometry/data transformations. Vercel because it's free, fast, and you're already familiar with deploying there.

### 3D Globe

**Custom Three.js** as the rendering engine. Full control over the scene graph, camera, shaders, and post-processing pipeline. Key components:

- `WebGLRenderer` with HDR tone mapping for cinematic lighting
- `OrbitControls` for smooth rotation, zoom, and pan (with damping)
- Custom `ShaderMaterial` for the fog of war overlay
- `EffectComposer` for post-processing (bloom, color grading)
- High-resolution NASA Blue Marble textures for the base globe
- NASA Black Marble (nighttime) texture for the city lights layer

This gives full control over every visual detail — no framework abstractions to fight against.

### Fog of War / Shader Effects

**Custom GLSL shaders.** The fog of war is the most technically complex piece. Approach:

- Custom `ShaderMaterial` on a slightly-larger sphere overlaying the globe
- Rasterize visited polygons into a texture (polygon mask) on the CPU, upload as a uniform
- The fragment shader samples this mask to determine fog opacity
- Apply procedural simplex noise for organic fog variation
- Animate noise offset over time for subtle drift
- Soft edges via distance field blur on the polygon mask

### Geocoding

**Local GeoNames database** as the primary source. A bundled dataset of ~23,000 cities (populations >1,000) with coordinates and administrative hierarchy, compressed to ~2MB JSON. Provides instant autocomplete with zero latency and no rate limits.

**Nominatim** (OpenStreetMap) as a fallback for disambiguation or obscure locations not in the local dataset. Endpoint: `https://nominatim.openstreetmap.org/search`. Rate limit: 1 request/second, which is fine for fallback usage.

### Polygon Boundaries

**Natural Earth** for all boundary data:

- **Country polygons:** 1:50m resolution for globe view, 1:110m for performance fallback
- **Admin-1 boundaries (states/provinces):** 1:10m resolution for sub-national regions (US states, Canadian provinces, etc.)

All Natural Earth data is public domain — no licensing restrictions, even for commercial use. Host as static JSON files in the repo or on a CDN.

### Street-Level Imagery

**Google Street View JavaScript API.** $200/month free credit covers ~28,000 panorama loads. For a personal app this is effectively unlimited. Use the `google.maps.StreetViewPanorama` class for the interactive viewer.

**Important:** The API key must be restricted (see Security section). Do not use the embed API — the JS API gives full control over the viewer UI and camera, which is necessary for the custom-styled experience.

**Fallback/future option:** Mapillary API (completely free, open source imagery). Coverage is patchier but could serve as a supplementary source or a fully-free alternative if Google costs become a concern.

### Photo EXIF Processing

**exifr** (JavaScript library). Reads EXIF metadata including GPS coordinates entirely client-side. No server round-trip, no API calls, no privacy concerns. Lightweight and fast.

### Data Persistence

**Supabase** (free tier). PostgreSQL database for storing visited locations and user data. Free tier includes 500MB storage, 50k monthly active users, and unlimited API requests.

Schema (simplified):

```
users
  - id (uuid, PK)
  - created_at

visits
  - id (uuid, PK)
  - user_id (FK)
  - city (text)
  - region (text, nullable)
  - country (text)
  - country_code (text)
  - lat (float)
  - lng (float)
  - visited_at (timestamp, nullable)
  - created_at
```

Photos are stored locally in IndexedDB for MVP. Cloud photo sync (Supabase Storage or Cloudflare R2) is a post-MVP feature.

### Authentication

**Supabase Auth** (free). Email/password or OAuth (Google, GitHub). Needed so users can access their map across devices.

### Audio

**Web Audio API** (built into browsers). No external library needed. Audio assets (ambient drones, chimes) stored as compressed audio files in the repo or loaded from CDN. Lazy-loaded to avoid blocking the initial render.

---

## Security Posture

Lean conservative. Even where documentation says client-side exposure is acceptable, prefer server-side handling.

### Google API Keys

**Do not expose in client-side code**, even though Google's docs say browser-restricted keys are safe to expose. Instead:

- Create a lightweight API route (Vercel serverless function or Supabase Edge Function) that proxies Street View requests
- The API key lives in server-side environment variables only
- The proxy adds the key to outgoing requests and forwards responses
- Apply HTTP referrer restrictions on the key as a defense-in-depth measure
- Apply API-specific restrictions (Street View JS API only)

### Supabase

- Enable Row Level Security (RLS) on all tables from day one
- Users can only read/write their own data
- Anon key is exposed (this is expected with Supabase) but RLS ensures it's safe
- Service role key never leaves the server

### Photo Privacy

- All EXIF processing happens client-side in the browser
- Photos are stored in IndexedDB locally — they never leave the device for MVP
- Make the privacy model explicit in the UI: "Your photos never leave your device"

### Environment Variables

All secrets stored in Vercel environment variables (or `.env.local` for development). A `.env.example` file in the repo documents required variables without exposing values.

```
GOOGLE_MAPS_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

### Content Security Policy

Set appropriate CSP headers to prevent XSS and restrict resource loading to known domains (Google APIs, Supabase, CDN for static assets).

---

## Build Order

The build is sequenced so that each phase produces something visually impressive and testable on its own. No phase should end with an ugly or broken intermediate state.

### Phase 1: The Globe ✅

**Goal:** A beautiful dark globe floating in space that you can spin and zoom.

1. ✅ Scaffold React + TypeScript project, deploy to Vercel
2. ✅ Build custom Three.js scene: renderer, camera, OrbitControls with damping
3. ✅ Apply NASA Blue Marble texture to a sphere, darkened/desaturated via shader
4. ✅ Add atmospheric rendering: Fresnel edge glow with depth, atmospheric scattering (outer + inner atmosphere)
5. ✅ Add star field background (8000 stars with color temperature variation)
6. ✅ Set up post-processing pipeline (EffectComposer): bloom, ACES filmic tone mapping
7. ✅ Style the page: full-viewport globe, dark background, zero UI chrome
8. ✅ Verify performance on desktop (touch/mobile TBD)

### Phase 2: Fog of War + Sound ✅

**Goal:** Visited countries glow with vivid color; everything else is dark and fogged with living, animated atmosphere. Sound foundations laid.

1. ✅ Load Natural Earth country polygons (1:50m TopoJSON via `countries-50m.json`)
2. ✅ Rasterize polygon data into a 2048×1024 visited-mask texture
3. ✅ Implement fog of war: custom fragment shader with hard polygon cutouts
4. ✅ Hardcode visited countries (US) for visual development
5. ✅ Tune visited/unvisited contrast: visited areas boosted (1.7× brightness, raised diffuse floor), unvisited darkened to ~12% luminance with natural color preservation (45% hue retention)
6. ✅ Snow/ice suppression: detect bright desaturated regions and darken without imposing artificial color
7. ✅ Add NASA Black Marble (nighttime) texture blended faintly on unvisited areas
8. ✅ Add city ember glow: warm amber point-lights with multi-layered core/inner/outer glow and subtle pulse animation
9. ✅ Real-time day/night terminator driven by sun position
10. ✅ Procedural 3D simplex noise (FBM, 4 octaves) for fog density variation — subtle brightness differences across unvisited areas
11. ✅ Animated fog drift over time (subliminal noise offset)
12. ✅ Subtle warm atmospheric fog floor in unvisited regions
13. ✅ Set up Web Audio API infrastructure: AudioManager with gain nodes, lazy asset loading
14. ✅ Implement space ambient hum (globe scale) and zoom-linked crossfade to atmospheric wind


**Design decisions:**
- Feathered/soft edges at visited boundaries were tried and removed — hard cutoffs look cleaner with the current visual style
- Fog uses 3D view-space position for noise to avoid UV seam artifacts at the date line
- Fog color is warm-neutral (not blue) to complement the existing blue atmospheric Fresnel glow

**Exit criteria:** The contrast between explored and unexplored is dramatic and beautiful. The fog has subtle depth variation and living animation. Visited cities glow like embers. With sound enabled, the globe feels alive.

### Phase 3: Manual Entry ✅

**Goal:** Type a city name, watch the globe come alive.

1. ✅ Bundle GeoNames city database (~23k cities, ~2MB JSON)
2. ✅ Build the search input with instant local autocomplete
3. ✅ Add city pin layer with ember glow

**Exit criteria:** Users can search and add cities/countries with instant local autocomplete.

### Phase 4: Street-Level Drill-Down (Week 5)

**Goal:** Click a city, dive into an immersive 360 panorama.

1. Set up Google Street View JS API with server-side key proxy
2. Build the panorama viewer component with custom controls (no Google chrome)
3. Implement the zoom-dive transition: camera dives toward surface, cinematic fade-through-black, panorama opens
4. Auto-orient the initial panorama camera toward the most interesting direction
5. Build the exit animation: fade to black, return to globe at city position
6. Add vignette and framing effects to the panorama viewer
7. Handle locations with no Street View coverage gracefully (show a message, don't break the experience)

**Exit criteria:** The transition from space to street level feels cinematic and intentional. The panorama viewer feels like part of the app, not an embedded Google widget.

### Phase 5: Photo Integration + Persistence + Onboarding

**Goal:** Full photo format support, cloud persistence, and guided first-run experience.

#### 5A: Extended Photo Format Support
1. ✅ Add .png file support with EXIF/metadata extraction (exifr handles natively)
2. ✅ Add .heic file support (iPhone native format) with EXIF GPS extraction (exifr handles natively, file picker updated)
3. ⬜ Store photos in IndexedDB (local only)
4. ⬜ Cluster photos by proximity and associate with visits
5. ⬜ Build the photo thumbnail layer (appears when zoomed into visited cities)
6. ⬜ Add parallax/depth effect on thumbnails during pan
7. ⬜ Build the photo lightbox viewer
8. ⬜ Handle photos without GPS data (manual placement flow)

#### 5B: Persistence + User Accounts
9. ⬜ Set up Supabase project (free tier: PostgreSQL + Auth)
10. ⬜ Implement user authentication (email/password + Google OAuth)
11. ⬜ Create database schema (users, visits tables)
12. ⬜ Enable Row Level Security — users can only access their own data
13. ⬜ Sync visited countries/cities to Supabase (replace localStorage as primary store, keep as offline fallback)
14. ⬜ Handle offline/online transitions gracefully

#### 5C: Onboarding Flow
15. ⬜ Build first-run onboarding overlay (cinematic, minimal, matches dark aesthetic)
16. ⬜ Step 1: "Add countries you've visited" — explain manual country/city entry via search (Cmd+K)
17. ⬜ Step 2: "Drop your photos" — explain photo import with auto-location detection
18. ⬜ Step 3: "Explore street view" — explain clicking city pins to dive into Google Street View
19. ⬜ Step 4: "Watch your world light up" — explain fog of war reveal and exploration stats
20. ⬜ Allow skipping, remember completion state, show a "?" help button to replay

#### 5D: Shareable Globe Link + OG Preview Image
21. ⬜ Add a public read-only route (`/globe/:userId`) that renders another user's globe
22. ⬜ Add a "Share" button that copies the public link to clipboard
23. ⬜ Public view is read-only — no search, no photo import, no editing. Just the cinematic globe with their visited places glowing
24. ⬜ Supabase RLS policy: visits rows are publicly readable when user opts into sharing
25. ⬜ **OG Preview Image**: When the share link is pasted into iMessage/Twitter/Instagram, the link preview shows a server-rendered snapshot of the user's globe — their personal planet with their places glowing against the dark void. This is the single most important growth lever: a dark globe with scattered amber lights is visually arresting in a social feed and doesn't look like any other link preview. Implementation: server-side screenshot via headless browser (Puppeteer on Vercel serverless or Cloudflare Worker), cached to Supabase Storage or R2, served via `<meta property="og:image">` tag on the public route.
26. ⬜ **Stats in OG image**: Overlay "X countries, Y cities" text on the preview image for social proof

**Exit criteria:** New users understand every feature within 30 seconds. Photos from iPhones (.heic) and all common formats work seamlessly. User data persists across devices via Supabase. Users can share a link to their globe that looks stunning.

### Phase 6: Polish, Performance, and Advanced Reveal

**Goal:** Production-quality experience with rewarding animations and full geographic fidelity.

#### 6A: Arrival Animation + Sound (Revised Design)

The first attempt at arrival animation used a simple radial mask wipe — it looked flat and artificial. The revised approach uses multiple layered effects that work with the existing shader pipeline to create something that feels organic and earned.

**The core idea: light propagation, not mask removal.** The fog doesn't disappear — it burns away. Light bleeds through terrain like sunrise over a mountain range.

**Layer 1 — Terrain-aware light propagation (~2s)**
- Pass a `revealOrigin` (city lat/lng) and `revealProgress` (0→1) uniform to the earth fragment shader
- Compute distance from each fragment to the reveal origin *on the sphere surface* (great-circle distance, not UV distance)
- Modulate the reveal threshold with the bump/topology texture: ridges and coastlines resist the light slightly longer, valleys fill first
- The result: light spreads outward but follows the natural contours of the geography, not a perfect circle
- Ease curve: fast initial burst (0→0.3 in 400ms), then decelerating spread (0.3→1.0 over 1.6s) — feels like an explosion of light that settles

**Layer 2 — Boundary ember particles**
- At the advancing edge of the reveal, spawn small particle emitters
- Particles rise upward (away from globe surface) and fade — like embers from a fire line
- Warm amber color, additive blending, caught by the bloom post-processing
- Particle count scales with the polygon's perimeter length (small countries get fewer, large ones more)
- Particles live ~0.8s each, spawn rate peaks at revealProgress ~0.3 (fastest expansion moment)

**Layer 3 — Color temperature shift**
- As the fog burns away at a fragment, don't snap directly to full satellite color
- Brief intermediate state (~300ms): oversaturated warm gold, brighter than final
- Then ease down to the normal visited brightness (1.4× base)
- Creates a "flash of heat" at the reveal edge that reads as energy

**Layer 4 — Sound**
- A warm, resonant chime/tone that begins at the moment of reveal
- Low rumble undertone that swells with the light propagation
- Chime pitch subtly varies by latitude (higher pitch for northern locations, lower for southern — subliminal but adds uniqueness to each reveal)
- Duration matches the visual (~2s), with a tail that rings out over another 1s

**Layer 5 — Camera response**
- Subtle camera pull: 2-3% zoom toward the revealing area during the animation
- Micro-shake (< 1px amplitude) at the moment of ignition
- Both are subliminal — if you notice them consciously, they're too strong

**Implementation notes:**
- All shader work happens in the existing `earthFragment.glsl` — add `revealOrigin`, `revealProgress`, `revealActive` uniforms
- Particle system is a separate `Points` geometry (similar to CityEmberGlow but temporary)
- Animation state managed by a `RevealAnimationManager` that queues reveals (in case user adds multiple places quickly)
- Performance: the extra distance computation per fragment is ~1ms on modern GPUs. Particles capped at 200.

1. ⬜ Add reveal uniforms to earth shader (origin, progress, active flag)
2. ⬜ Implement terrain-modulated distance field for organic reveal shape
3. ⬜ Build color temperature shift (gold flash → settle to normal)
4. ⬜ Create boundary ember particle system
5. ⬜ Add reveal sound design (chime + rumble)
6. ⬜ Add subtle camera response (pull + micro-shake)
7. ⬜ Build RevealAnimationManager (queue, timing, state machine)
8. ⬜ Tune all parameters until it feels magical

#### 6B: Tiered Reveal Logic
3. ⬜ Implement tiered reveal logic (country for small nations, state/region for large nations)
4. ⬜ Load Natural Earth admin-1 boundaries for large countries (US, Canada, China, Russia, Australia, Brazil, India)
5. ⬜ Add Nominatim fallback for geocoding disambiguation

#### 6C: Performance + Polish
6. ⬜ Performance audit: optimize polygon rendering, texture loading, shader complexity
7. ⬜ Mobile optimization: touch controls, responsive layout, reduced polygon detail on mobile
8. ⬜ Implement zoom-dependent rendering (polygons at globe scale, more detail when zoomed)
9. ⬜ Loading experience: elegant loading state while globe assets initialize
10. ⬜ Sound polish: fine-tune crossfades, volumes, timing
11. ⬜ Final visual polish pass: lighting, colors, animation curves, typography
12. ⬜ Accessibility basics: keyboard navigation, screen reader landmarks, reduced motion support

### Phase 7: Growth & Engagement Features

**Goal:** Features that solve cold start, add new data lenses, and give users reasons to return and share.

#### 7A: Google Timeline / Location History Import

The biggest friction point is cold start — manually adding dozens of places is tedious. Most users have years of location data sitting in their Google account. One-click import creates an instant, dramatic "your whole life visualized" moment.

**Flow:**
1. User clicks "Import Google Timeline" in the menu
2. App shows instructions: go to Google Takeout, download Location History (JSON format)
3. User drops the downloaded JSON file into the app (same drag-and-drop UX as photo import)
4. Client-side parsing extracts location records, clusters by city (haversine distance, ~50km radius)
5. Deduplicates against existing visits
6. Bulk-adds to visitedStore with `visited_at` timestamps preserved
7. If arrival animation is implemented, plays a rapid-fire montage sequence (batch reveal)

**Privacy:** Same model as photo import — the Google Takeout file never leaves the device. All parsing is client-side. The app only extracts city/country/coordinates, not the raw location trail.

**Implementation notes:**
- Google Takeout Location History is a JSON file with `locations[].latitudeE7`, `locations[].longitudeE7`, `locations[].timestamp`
- Cluster algorithm: group points within 50km haversine radius, take the centroid, resolve to nearest city via existing `getNearestCity()`
- For large files (>100MB), use streaming JSON parser or chunked processing to avoid blocking the main thread
- Show progress: "Processing 24,000 location records..." → "Found 47 cities across 12 countries"

1. ⬜ Build Google Timeline file drop/select UI
2. ⬜ Implement client-side JSON parser for Google Takeout Location History format
3. ⬜ Cluster location records by proximity (haversine, ~50km radius)
4. ⬜ Resolve clusters to cities/countries via existing geo utilities
5. ⬜ Bulk-add to visitedStore with timestamps
6. ⬜ Show processing progress and results summary
7. ⬜ Handle edge cases: empty files, wrong format, very large files

#### 7B: Heatmap Mode

A toggle that switches from fog-of-war view to a frequency-based heatmap. Places visited multiple times glow more intensely — frequently visited cities burn white-hot, one-time visits are dim amber. Adds a new lens on your own data without requiring any new input.

**Visual design:**
- Toggle in the settings dropdown: "Heatmap mode" on/off
- When active, the ember glow intensity for each city scales with visit count
- Color gradient: dim amber (1 visit) → bright gold (3-5 visits) → white-hot (10+ visits)
- Country polygon brightness also scales with the number of distinct cities visited within it
- The fog of war remains for unvisited areas — heatmap only affects revealed regions

**Data requirements:**
- Requires `visited_at` timestamps and/or a visit count field
- Could count visits by the number of distinct `visited_at` dates for a city
- Or could add a simple `visit_count` column to the visits table
- Google Timeline import naturally provides multiple visits to the same city

**Implementation:**
- New uniform `heatmapMode` (bool) in the earth fragment shader
- Per-city intensity passed via a data texture or attribute on the ember points
- Smooth transition when toggling (1s crossfade between fog-of-war and heatmap render modes)

1. ⬜ Add visit frequency tracking (count or distinct dates per city)
2. ⬜ Add heatmap toggle to settings UI
3. ⬜ Implement intensity-scaled ember glow (color gradient by frequency)
4. ⬜ Implement intensity-scaled polygon brightness
5. ⬜ Add smooth crossfade transition between modes

---

## Design Constraints

- **No visible UI chrome on the globe view.** Controls and inputs should be floating, minimal, and disappear when not in use. The globe is the entire experience.
- **Animations must be smooth.** Target 60fps for all transitions. If a feature can't run smoothly, simplify it rather than shipping jank.
- **Dark theme only.** No light mode, no theme toggle. The dark cinematic aesthetic is the product identity.
- **Typography:** Use a clean, modern sans-serif. Inter or similar. Light weights for stats and labels, medium weight for inputs.
- **Color palette:** The globe itself provides most of the color. UI elements should be near-white text on near-black/transparent backgrounds. Accent color (for pins, glows, interactive elements): warm gold or amber, reinforcing the "illumination" metaphor.
- **Sound is muted by default.** A minimal, elegant toggle (small icon, bottom corner) lets users opt into audio. No sound should ever play without the user choosing to enable it.

---

## Cost Analysis

| Service | Free Tier | Expected Usage | Monthly Cost |
|---|---|---|---|
| Vercel (hosting) | 100GB bandwidth | Personal app | $0 |
| Supabase (DB + auth) | 500MB, 50k MAU | Personal app | $0 |
| Google Street View JS API | $200 credit/month | ~28k loads | $0 |
| Nominatim (geocoding) | Unlimited (fair use) | Fallback only | $0 |
| Natural Earth (polygons) | Public domain | Static files | $0 |
| GeoNames (city database) | Open data | Bundled locally | $0 |
| exifr (EXIF parsing) | Open source | Client-side | $0 |
| Three.js | Open source | Client-side | $0 |
| **Total** | | | **$0** |

If the app grows beyond personal use, the first cost pressure point will be Google Street View API ($7/1000 panoramas beyond free credit). Mapillary is the free escape hatch. Supabase would need a paid plan ($25/month) around 50k MAU or 500MB storage.

---

## Open Questions

1. **Offline support.** Should the globe work offline with cached polygon data? Could be valuable for showing off your map without wifi, but adds complexity.
2. **Social / sharing.** Should users be able to share a read-only view of their globe? A shareable link would be a strong growth lever but introduces hosting and privacy considerations.
3. **Import from existing services.** Google Timeline export, TripIt, airline booking emails — these could be powerful onboarding accelerators but each is a separate integration effort.
4. **Cloud photo sync (post-MVP).** When ready, options include Supabase Storage (1GB free) or Cloudflare R2 (10GB free). Need to decide on sync model, storage limits, and privacy UX.
5. **Mobile experience.** The cinematic globe experience is strongest on a large screen. Desktop-first for MVP, with responsive mobile as a Phase 6 concern. Mobile could focus on input/management while desktop focuses on the visual experience.
