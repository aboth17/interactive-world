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
15. ⬜ Implement zoom-dependent rendering (polygons at globe scale, more detail when zoomed)

**Design decisions:**
- Feathered/soft edges at visited boundaries were tried and removed — hard cutoffs look cleaner with the current visual style
- Fog uses 3D view-space position for noise to avoid UV seam artifacts at the date line
- Fog color is warm-neutral (not blue) to complement the existing blue atmospheric Fresnel glow

**Exit criteria:** The contrast between explored and unexplored is dramatic and beautiful. The fog has subtle depth variation and living animation. Visited cities glow like embers. With sound enabled, the globe feels alive.

### Phase 3: Manual Entry + Reveal Logic (Week 4)

**Goal:** Type a city name, watch the globe come alive.

1. ✅ Bundle GeoNames city database (~23k cities, ~2MB JSON)
2. ✅ Build the search input with instant local autocomplete
3. ✅ Add city pin layer with ember glow
4. ✅ Exploration stats overlay (countries visited count + percentage of 195 UN countries)

**Exit criteria:** Adding a new place feels like a rewarding moment of discovery. The arrival animation is smooth and emotionally satisfying. The sound and visual reward are perfectly synced.

### Phase 4: Street-Level Drill-Down (Week 5)

**Goal:** Click a city, dive into an immersive 360 panorama.

1. ✅ Set up Google Street View JS API (client-side key with localhost restriction for local dev)
2. ✅ Build the panorama viewer component with custom controls (no Google chrome)
3. ✅ Implement cinematic fade-through-black transition (globe → black → panorama → black → globe)
4. ⬜ Auto-orient the initial panorama camera toward the most interesting direction
5. ✅ Build the exit animation: fade to black, return to globe (Esc key or close button)
6. ✅ Add vignette framing effect to the panorama viewer
7. ✅ Handle locations with no Street View coverage gracefully (message + return button)
8. ✅ Monthly API usage tracking with 5,000 panorama limit (localStorage)
9. ✅ City pin click detection via raycasting on globe

**Note:** For local development, the API key is loaded client-side from `.env.local` with localhost/referrer restriction. For production, this must be replaced with a Vercel serverless proxy (see Production Deployment section below).

**Exit criteria:** The transition from space to street level feels cinematic and intentional. The panorama viewer feels like part of the app, not an embedded Google widget.

### Phase 5: Photo Integration (Week 6)

**Goal:** Your photos appear on YOUR map.

1. Build the photo upload/drop zone (client-side only)
2. Integrate exifr for GPS extraction
3. Store photos in IndexedDB (local only)
4. Cluster photos by proximity and associate with visits
5. Build the photo thumbnail layer (appears when zoomed into visited cities)
6. Add parallax/depth effect on thumbnails during pan
7. Build the photo lightbox viewer
8. Handle photos without GPS data (manual placement flow)

**Exit criteria:** Seeing your own photos emerge from the map as you zoom into a city you visited feels personal and magical.

### Phase 6: Polish and Performance (Week 7)

**Goal:** Production-quality experience.

1. Performance audit: optimize polygon rendering, texture loading, shader complexity
2. Mobile optimization: touch controls, responsive layout, reduced polygon detail on mobile
3. Loading experience: elegant loading state while globe assets initialize
4. ⬜ Add Nominatim fallback for disambiguation
5. ⬜ Implement the tiered reveal logic (country for small nations, state/region for large nations)
6. ⬜ Load Natural Earth admin-1 boundaries for large countries
7. ⬜ Connect to Supabase for persistence (user accounts, saved visits)
8. ⬜ Build the arrival animation: illuminate-outward pulse from the pin point, spreading across the polygon
9. ⬜ Add arrival chime sound (warm, resonant tone synced to the visual reveal)
10. Sound polish: fine-tune crossfades, volumes, timing of arrival chime
11. Final visual polish pass: lighting, colors, animation curves, typography
12. Accessibility basics: keyboard navigation, screen reader landmarks, reduced motion support

---

## Production Deployment (Pre-Launch Checklist)

Before going live, the following must be completed. These are deferred from earlier phases to keep the build focused on functionality during local development.

1. **Vercel serverless proxy for Google API key** — Move the Street View API key from client-side `.env.local` to a Vercel Edge/Serverless function that proxies requests. The client never sees the key in production. Apply HTTP referrer and API-specific restrictions on the key as defense-in-depth.
2. **Supabase setup** — Provision Supabase project (free tier). Create `users` and `visits` tables per the schema in the Tech Stack section. Enable Row Level Security on all tables. Migrate persistence from localStorage to Supabase.
3. **Supabase Auth** — Enable email/password or OAuth (Google, GitHub). Wire up auth flow so users can access their map across devices.
4. **Environment variables** — All secrets stored in Vercel environment variables. `.env.example` documents required vars without exposing values.
5. **Content Security Policy** — Set CSP headers restricting resource loading to known domains (Google APIs, Supabase, CDN).
6. **Domain + deploy** — Configure custom domain on Vercel, verify SSL, set up production environment.

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
