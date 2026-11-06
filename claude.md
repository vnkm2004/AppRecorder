# AppRecorder - 3D Device Mockup & 4K Video Studio

## Updates & Fixes (November 2026)

### 1. Solid Colored 90° Side Profile Rails
- **Problem**: When the device was rotated straight to a 90° side profile, it appeared as a colorless, paper-thin wireframe line because there were no solid surface panels facing the side camera normal.
- **Solution**:
  - Added solid metallic side panels (`backgroundColor: material.sideRailBg`) for the Left, Right, Top, and Bottom straight perimeters.
  - Positioned within `top: radius` to `bottom: radius` (`height: calc(100% - 2*radius)`) so they never protrude from the curved corners.
  - Fully visible at 90° side angles, displaying the physical material color (Space Black, Natural Titanium, Pure Silver, Ceramic White, Glass), 3D buttons, antenna bands, and ports.

### 2. Shaded White Studio Background in Light Mode
- Added Apple-style **Shaded White Studio** radial gradient (`radial-gradient(ellipse at center, #ffffff 15%, #f8fafc 45%, #e2e8f0 80%, #cbd5e1 100%)`).
- Produces soft luminous white center highlight with subtle studio shading at the edges.
- Floor shadow and floating HUD dynamically adapt to Light Mode.

### 3. Clean Recording Studio (No Cursor & No Floating UI)
- `cursor: 'never'` in `getDisplayMedia` natively strips the mouse pointer from 4K/HD video frames.
- Global `cursor: none !important;` during active recording.
- Auto-hides the bottom floating navigation HUD and collapses sidebars during recording.

### 4. True Native Viewport Resolutions
- **1440px** for Desktop & Laptop.
- **1024px** for Tablet.
- **393px** for Mobile.

### 5. Added iPhone 18 Pro Max Hardware Model
- **Razor-thin Micro-Bezel**: Sub-1mm border (`bezel: 5`, `borderRadius: 48px`, `viewportWidth: 402px`).
- **Micro Dynamic Island**: Next-generation compact pill with under-display optical sensor and cyan sapphire pulse.
- **Tactile Camera Control**: Added flush Camera Control button on the right titanium side rail alongside the power button.
- **Quad-Matrix Fusion Camera Plateau**: Precision-machined rear titanium plateau with quad sapphire crystal lenses, LiDAR 2.0 sensor, and dual-tone photonic flash.

### 6. Added Google Pixel 10 Pro & Removed Duo Mode
- **Removed Duo Mode**: Cleaned up Duo categories, models, and components per user request to maintain pure single-device focus.
- **Added Google Pixel 10 Pro**:
  - `pixel-10-pro` model added to Mobile models (`viewportWidth: 412px`, `width: 340px`, `height: 700px`, `bezel: 6`, `borderRadius: 42px`).
  - Signature horizontal anodized **Camera Visor Bar** stretching across the rear with dual pill sensor cutouts, 5x periscope telephoto aperture, and temperature sensor.
  - Centered punch-hole front camera and minimalist Google "G" emblem on rear.

### 7. Pure Stage Recording Mode & Region Capture (Zero UI Clutter)
- **Modal Auto-Closes**: When user clicks "Start Record", the recording modal instantly closes (`setIsRecordingModalOpen(false)`) with a clean unmount transition before capture begins.
- **Pure Stage Isolation**:
  - Entire top navbar is completely hidden during active recording (`!isRecording`).
  - Left controls sidebar is completely collapsed.
  - Bottom 3D navigation HUD is completely hidden.
  - Mouse pointer is completely hidden (`cursor: 'never'` and `.recording-active * { cursor: none !important; }`).
  - Only the 3D device mockup, website inside, and studio backdrop are captured.
- **W3C Region Capture API**:
  - Integrated `CropTarget.fromElement(document.getElementById('device-mockup-stage'))` to lock video streams strictly to the stage bounding box.
- **Convenient Stop Controls**:
  - Floating pill in top-right corner with live time counter and one-click stop.
  - Global `Escape` key shortcut to stop recording instantly.
- **Automatic Local Storage Save**:
  - Automatically commits recorded 4K video blob to browser IndexedDB upon completion and reopens the preview modal with Download button.

### 8. Default Website Configuration
- Set `https://servcate.com` as the permanent default landing URL across the application, input field, and presets list in Direct mode.

### 9. Mobile Card Auto-Scaling Fix (servcate.com)
- **Root Cause Identified**:
  - `servcate.com` contains a custom zoom-detection script: `xf = () => 1 / Dk(window.outerWidth / window.innerWidth)`.
  - In desktop browsers inside an iframe, `window.outerWidth` is the full computer screen width (1920px), while `window.innerWidth` is the phone iframe width (393px/402px).
  - The website mistakenly calculated `1920 / 402 = 4.77` as "desktop browser zoom", applying an artificial `transform: scale(0.20)` that shrunk the card to 20% of its size.
- **Solution Implemented in Smart Proxy**:
  - Automatically polyfills `window.outerWidth` and `window.outerHeight` inside the mobile mockup to match `window.innerWidth` and `window.innerHeight` (`t = 1.0`).
  - Injects `.login-content-wrapper { transform: scale(1) translateY(12px) !important; max-width: 92% !important; margin: 0 auto !important; }` to override any inline scale and ensure the login/welcome card renders at 100% full, legible mobile scale identical to a real smartphone.
  - Rewrites all relative assets through the proxy to eliminate CORS errors and defaulted to Proxy Mode.

### 10. Realistic Human Hand Grip & Fintech Ad Tilt
- **3D Sandwiched Hand Layers**:
  - `HandBackLayer`: Palm, thenar eminence, and finger stems positioned behind the phone (`translateZ(-halfDepth - 2px)`).
  - `HandFrontLayer`: Anatomical thumb pad and wrapping fingertips resting on the phone bezel with fingernails, cuticles, and contact occlusion shadow (`translateZ(+halfDepth + 3px)`).
- **Gender Builds**:
  - **Male**: Defined knuckles and broader palm.
  - **Female**: Slender contours and tapered nail beds.
- **4 Skin Tone Palettes**:
  - **Warm Honey (Ad Match)**: Rich golden-brown skin tone matching the uploaded fintech ad.
  - **Fair / Light**: Luminous fair tone with soft peach undertones.
  - **Rich Bronze**: Deep bronze tone with warm highlights.
  - **Deep Espresso**: Rich dark tone with subtle amber transitions.
- **Dynamic Angle Gestures**:
  - Automatically orients grip based on phone perspective (Left hand when tilted left, Right hand when tilted right, or Two-Handed).
- **Fintech Ad Tilt Preset**:
  - Added 1-click angle preset (`pitch: 18°`, `yaw: -22°`, `roll: -8°`) reproducing the exact angle in commercial mobile advertisements.
- **Static-Only Enforcement**:
  - Hand grip is exclusively active when the phone is static; turntable rotation is automatically paused when hand grip is enabled.

### 11. Restored Full Scrolling & Wheel Event Forwarding
- **Root Cause Identified**:
  - Clicking near the edge or scrollbar triggered 3D stage dragging because `handlePointerDown` in `DeviceStage.jsx` did not isolate clicks within `#tight-device-capture-box` or the phone frame.
  - When an iframe is inside a CSS 3D transformed context (`perspective`, `transform-style: preserve-3d`), Chromium compositors often do not dispatch mouse wheel events across the 3D boundary.
- **Solution Implemented**:
  - Added event guard in `DeviceStage.jsx`: clicks inside `#tight-device-capture-box`, `.device-chassis`, or on the iframe are completely ignored by 3D dragging, reserving the entire phone surface for website interaction and scrolling.
  - Added active `onWheel` listener on `ResponsiveViewport.jsx` that forwards `scrollBy({ top: e.deltaY, left: e.deltaX })` directly to the iframe window.
  - Added cross-origin fallback via `postMessage` with `APPRECORDER_SCROLL`.
  - Injected `html, body { overflow-y: auto !important; -webkit-overflow-scrolling: touch !important; touch-action: pan-y !important; }` in `server.js` and `vite.config.js`.
  - Designed a sleek 4px mobile scrollbar (`::-webkit-scrollbar { width: 4px; }`) with rounded ends that never clips into phone corners or edges.

### 12. Zero Website Corner Clipping (Physical Status Bar & Safe Area Clearance)
- **Root Cause Identified**:
  - In `PhoneFrame.jsx` and `TabletFrame.jsx`, the Status Bar was positioned as `absolute top-0`, which placed the website at `(0, 0)`.
  - With a 43px rounded corner screen display, the top-left (ServCate logo) and top-right (notification bell and hamburger menu) were pushed directly into the circular corner cutout and clipped off.
  - The dynamic island and punch-hole camera cutouts sat on top of website header text.
- **Solution Implemented**:
  - Converted the Top Status Bar into a real physical flex block (`relative w-full h-8 px-4 flex items-center justify-between bg-neutral-950 border-b border-white/5`).
  - Shifting the website down to `y = 32px` places the website header in the 100% full rectangular display area, completely eliminating corner clipping for logos, hamburger menus, and buttons.
  - The Dynamic Island / Punch Hole is safely housed within the physical black status bar above the website, never obscuring any website content.
  - Converted the Home Bar into a physical flex item (`h-3.5 bg-neutral-950 border-t border-white/5`) at the bottom to absorb the bottom corner radius and protect footer elements.
  - Applied the same physical safe area architecture to `TabletFrame.jsx`.

### 13. Tight Device Recording (~0.5cm Margin)
- **Root Cause Identified**:
  - Previously, `CropTarget.fromElement` cropped to `#device-mockup-stage` (100vw × 100vh), capturing a small device surrounded by massive empty canvas.
- **Solution Implemented**:
  - Wrapped the 3D device in `#tight-device-capture-box` with `p-5` (20px, exactly ~0.52cm padding around the device).
  - Updated `src/utils/recorder.js` to target `#tight-device-capture-box` via W3C Region Capture API (`CropTarget.fromElement`), cropping recorded video strictly to the device plus the ~0.5cm studio margin.
  - Added adaptive `tightRecordingScale` fallback in `DeviceStage.jsx` that automatically scales the device during recording so that it fills the viewport with ~0.5cm margin even on browsers without Region Capture support.
  - Guaranteed clean modal unmounting, cursor hiding (`cursor: 'never'`), and direct IndexedDB saving.

### 14. Resolved Blank Map & Geolocation Blocking (servcate.com Leaflet Chunk Proxying)
- **Root Cause Identified**:
  - The map component in `servcate.com` uses Leaflet with dynamic ES module import (`import("./leaflet-src-DynTsIQs.js")`) and Google Maps satellite/street tiles (`https://mt{s}.google.com/vt/lyrs=...`).
  - Because the main bundle was served from `/api/proxy?url=https%3A%2F%2Fservcate.com%2Fassets%2Findex-C7Bcdlwb.js`, the browser's ES module loader resolved relative imports against the proxy route, requesting `/api/leaflet-src-DynTsIQs.js`.
  - The previous proxy middleware did not recognize `/api/*.js` chunks and fell through to the SPA router, returning `index.html` with `Content-Type: text/html`.
  - The browser rejected this HTML as an invalid module (`SyntaxError: Unexpected token '<'`), causing `A.map` to never initialize and leaving the map container as a blank white box.
  - In addition, the iframe lacked the `allow="geolocation"` policy, causing `servcate.com` to show a red forbidden symbol on the "Get GPS..." button.
- **Solution Implemented**:
  - Enhanced smart proxy middleware in both `vite.config.js` and `server.js` with intelligent dynamic chunk resolution:
    - Automatically captures requests to `/api/*.js`, `/assets/*`, and `leaflet*`.
    - Resolves dynamic chunk filenames relative to the parent bundle directory (`https://servcate.com/assets/${chunkName}`).
    - Returns genuine JavaScript chunks with `Content-Type: text/javascript` and full CORS headers.
  - Added permissions to `ResponsiveViewport.jsx`:
    - `allow="geolocation; camera; microphone; clipboard-read; clipboard-write; accelerometer; gyroscope"`.
    - Extended `sandbox` to include `allow-downloads`.
  - Result: Leaflet 1.9.4 loads instantly, Google Maps street & satellite tiles render in real time, and GPS geolocation functionality is unblocked.

### 15. Ultra-Realistic 3D Human Hand Model & Seamless Multi-Angle Volumetric Rails
- **Root Cause Identified**:
  - The previous hand implementation used flat, disconnected 2D SVG planes placed at `translateZ(-11px)` (back) and `translateZ(+12px)` (front).
  - When the phone tilted in 3D, the fingers appeared severed across the 18px phone thickness because there was no geometry spanning the side rails.
  - The forearm appeared as an unnatural angular wedge with a harsh diagonal cut, and the fingertips looked like simple circular cartoon knobs without anatomical nails, joints, or skin subsurface scattering.
- **Solution Implemented**:
  - **Volumetric 3D Side Rail Wrapping (`HandSideWrap`)**:
    - Embedded physical 3D finger wrap elements directly into the Left and Right side rails (`rotateY(90deg)` planes).
    - Bridges the rear finger stems to the front finger pads across the entire depth of the titanium chassis.
    - Fingers seamlessly wrap around the physical edge of the device from all 3D viewing angles (front, side profiles, and tilted perspectives).
  - **Photorealistic Anatomical Rendering (Ad Match Quality)**:
    - **Forearm & Wrist**: Redesigned with realistic muscle contours and a natural vertical linear fadeout into the studio background (zero harsh cutoffs).
    - **Thenar Muscle Cushion**: Volumetric thumb ball with deep ambient contact shadows cast by the phone body.
    - **Translucent Keratin Fingernails**: Added natural nail plates, white half-moon lunula, free-edge manicure tips, and glossy specular reflection arcs.
    - **Subsurface Scattering & Skin Creases**: Integrated multi-stop skin gradients with warm peach/coral SSS glow and fine dermal joint creases.
    - **Glass Contact Shadows**: Soft drop shadows under the thumb and fingertips pressing against the front glass bezel.
  - **Enhanced Skin Tone Profiles**:
    - Upgraded all 4 skin tone palettes (Warm Honey, Fair, Rich Bronze, Deep Espresso) with dedicated `subsurfaceColor`, `nailBedColor`, `nailTipColor`, and `creaseColor` definitions.

### 16. Full 3D Chassis Side Profile Rails at 90° & CSS 3D `preserve-3d` Continuity
- **Root Cause Identified**:
  - In `DeviceStage.jsx`, the intermediate container `<div id="tight-device-capture-box">` lacked `transformStyle: 'preserve-3d'`.
  - In CSS 3D Transforms, any intermediate DOM container defaulting to `transform-style: flat` flattens the entire 3D subtree into a single 2D sheet.
  - When rotating the device around Y to a 90° straight side angle (`yaw: 90°` or `-90°`), this flattened 2D sheet was viewed edge-on, collapsing into a 0-pixel invisible sliver with only faint dashed lines visible (as seen in user screenshots of MacBook Pro 16" and iPad Pro 13" M4).
  - Additionally, `LaptopFrame.jsx` lacked a volumetric 3D base chassis with physical side rails and ports (MagSafe, Thunderbolt, HDMI), and `TabletFrame.jsx`, `DesktopFrame.jsx`, and `PhoneFrame.jsx` needed full-coverage opaque metallic side rail panels to prevent corner voids at 90° side profile.
- **Solution Implemented**:
  1. **Fixed CSS 3D Transform Hierarchy in `DeviceStage.jsx`**:
     - Added `preserve-3d` class and `style={{ transformStyle: 'preserve-3d' }}` to `#tight-device-capture-box`.
     - Preserves true 3D spatial coordinate geometry from the root stage down to every 3D child face.
  2. **Tablet 100% Full-Coverage Side Rails (`TabletFrame.jsx`)**:
     - Extended Left, Right, Top, and Bottom rails to 100% full coverage (`top: 0`, `height: 100%`, `borderRadius: ${radius}px`).
     - Added solid metallic background color (`material.sideRailBg || material.solidColor`) so the chassis is fully opaque and colored at 90°.
     - Configured Apple Pencil magnetic wireless charger strip, dual volume rockers, quad stereo speaker grilles, and Thunderbolt/USB-C port on the side rails.
  3. **Volumetric Laptop 3D Side Rails & Base Chassis (`LaptopFrame.jsx`)**:
     - Added solid metallic background to display lid rails so the lid is visible at 90°.
     - Built a fully volumetric 3D base chassis with `transformStyle: 'preserve-3d'`.
     - Added physical Left and Right side rails to the base chassis featuring MagSafe 3 charging port with status LED, dual Thunderbolt 4 / USB-C ports on the left, and HDMI 2.1 port + SDXC card slot on the right.
     - Added solid front chin lip and back hinge rail.
  4. **Desktop Full-Coverage Rails (`DesktopFrame.jsx`)**:
     - Updated Left, Right, Top, and Bottom rails with full coverage, rounded caps, and `material.sideRailBg`.
  5. **Mobile Full-Coverage Rails (`PhoneFrame.jsx`)**:
     - Updated Left, Right, Top, and Bottom rails with rounded caps and full continuous coverage, eliminating corner gaps.

### 17. Ultra-Crisp HD Screen Clarity & Elimination of Blurriness
- **Root Cause Identified**:
  1. **Fractional Downscaling Mismatch (`scale: 0.82`)**:
     - In `devicePresets.js`, mobile models were set to `width: 340px` with `viewportWidth: 402px`.
     - With a 5px bezel, the display width was 330px, forcing `ResponsiveViewport.jsx` to apply `transform: scale(330 / 402 = 0.82089)`.
     - Fractional scaling forces the browser to interpolate all fonts and vector UI elements across non-integer pixel boundaries using bilinear resampling, making text fuzzy.
  2. **Double Shrinkage from Low Default Stage Scale (`0.58` / 58%)**:
     - `App.jsx` initialized the stage scale to `0.58`.
     - At 58%, the phone was shrunk to 197px total width on screen, and the website was reduced to ~191px.
     - Viewing or recording a 191px element on a 1080p or 4K monitor resulted in severe pixelation and blur.
  3. **Milky Frosted Screen Glare Gradient**:
     - `.screen-glare` had a high 15% solid white opacity (`rgba(255, 255, 255, 0.15)`), casting a milky haze over the top half of the screen that reduced text contrast and washed out black backgrounds.
  4. **Browser 3D Compositor Texture Downsampling**:
     - Elements in a CSS 3D transformed context (`perspective`, `preserve-3d`) are rasterized into GPU textures without subpixel font antialiasing unless explicitly forced.
- **Solution Implemented**:
  1. **Engineered 1:1 Native Pixel Mapping (`scale = 1.000`) in `devicePresets.js`**:
     - Updated phone models to realistic flagship dimensions where inner screen width matches the mobile viewport exactly:
       - `iphone-18-pro`: `width: 414px`, `height: 874px`, `viewportWidth: 402px`, `bezel: 6px`. Inner width = `414 - 12 = 402px` (`scale = 402 / 402 = 1.0000`).
       - `pixel-10-pro`: `width: 424px`, `height: 880px`, `viewportWidth: 412px`, `bezel: 6px`. Inner width = `412px` (`scale = 1.0000`).
       - `iphone-16-pro`: `width: 405px`, `height: 852px`, `viewportWidth: 393px`, `bezel: 6px`. Inner width = `393px` (`scale = 1.0000`).
       - `s24-ultra` & `pixel-9-pro`: `width: 424px`, `height: 880px`, `viewportWidth: 412px` (`scale = 1.0000`).
     - Set default stage zoom to a comfortable, high-res `0.85` (85%) across mobile presets.
  2. **Direct Vector Pass-Through in `ResponsiveViewport.jsx`**:
     - When `isNative` (within 2px of 1:1), bypassed CSS `scale()` transform entirely:
       `width: '100%'`, `height: '100%'`, `transform: 'translateZ(0)'`.
     - Enables native subpixel ClearType / CoreText antialiasing and crisp vector font rendering directly from the browser engine.
     - Added `image-rendering: -webkit-optimize-contrast`, `-webkit-font-smoothing: antialiased`, and `text-rendering: optimizeLegibility`.
  3. **Refined Specular Screen Glare & 1-Click Glare Toggle**:
     - Replaced the harsh 15% white haze with an ultra-delicate 5% specular reflection (`rgba(255, 255, 255, 0.05)` to `transparent 45%`) that preserves 100% deep contrast and crisp text.
     - Added a `Sparkles` Glare toggle in the floating 3D HUD so users can disable glare completely for pure contrast.
  4. **HUD Quick 100% HD Crisp Button & 200% Zoom Range**:
     - Added a `100% HD` button in the floating HUD that switches instantly to 1.0 (100% native 1:1 pixel rendering).
     - Extended maximum zoom limit from 120% to 200% (`0.35` to `2.0`) for crystal-clear inspection on 4K and Retina monitors.
  5. **Injected High-Definition Typography into Proxied Websites**:
     - In `server.js` and `vite.config.js`, injected `-webkit-font-smoothing: antialiased !important`, `-moz-osx-font-smoothing: grayscale !important`, `text-rendering: optimizeLegibility !important`, and `image-rendering: -webkit-optimize-contrast !important` into all proxied pages.

### 18. Elimination of Square Corner Lines Sticking Out of Rounded Devices
- **Root Cause Identified**:
  - In `PhoneFrame.jsx`, `TabletFrame.jsx`, and `DesktopFrame.jsx`, the side rails were previously set to `height: 100%` and `width: 100%`.
  - While the front and back faces have a 48px corner radius (`borderRadius: ${radius}px`), the flat rectangular Top and Left rails met at `(0, 0)` in a sharp 90-degree right angle with 1px border lines.
  - As a result, at the 4 rounded corners, the sharp rectangular edges of the rails poked out past the curved bezels as square black lines/wireframe boxes (as seen in `media_1793899196727_8b37c160.jpg`).
- **Solution Implemented**:
  1. **Strictly Constrained Straight Rails Between Corner Radiuses**:
     - **Left & Right Rails**: Constrained to `top: ${radius}px` and `height: calc(100% - ${radius * 2}px)`. They span only the straight portion of the phone edge and terminate precisely where the corner curve begins.
     - **Top & Bottom Rails**: Constrained to `left: ${radius}px` and `width: calc(100% - ${radius * 2}px)`. They terminate precisely where the horizontal corner curve begins.
     - Removed outer rectangular border lines (`border-y border-white/10`, `border-x border-white/10`) on the rail ends that were rendering visible artifacts at the corners.
  2. **100% Solid Opaque Rounded Corner Slices across Z Depth**:
     - Generated 11 continuous depth slices from `-halfDepth` to `+halfDepth`.
     - Each slice is an exact duplicate rounded rectangle with `borderRadius: ${radius}px` and `backgroundColor: material.sideRailBg || material.solidColor`.
     - At 0° front view, every slice is bounded inside the identical `${radius}px` contour as the front face, completely invisible behind the bezel with zero square corners sticking out.
     - At 90° straight side view and all intermediate angles, the solid stacked slices form a continuous, seamless, opaque 3D rounded cap at all 4 corners.
  3. **Universal Alignment Across All Device Frames**:
     - Applied the identical corner-radius boundary containment and solid depth slicing to `TabletFrame.jsx`, `DesktopFrame.jsx`, and `LaptopFrame.jsx`.

### 19. Screen Clarity Overhaul Inside Device Model (Retina 2.5x & Direct 2D Pass-Through)
- **Root Cause Identified**:
  1. **Residual Fractional Scaling in Mobile Iframe (`scale: 0.98756`)**:
     - `PhoneFrame.jsx` has a 2.5px border and 6px padding (`padding: 6px`, `borderWidth: 2.5px`).
     - On a 414px phone, the inner screen container width measured `397px`, while `viewportWidth` was `402px`.
     - Because `Math.abs(397 - 402) = 5 > 2`, `isNative` was evaluated as `false`, forcing `ResponsiveViewport.jsx` to apply `transform: scale(397 / 402 = 0.98756)`.
     - Scaling an iframe by 98.7% causes severe subpixel interpolation blur, softening all font stems and lines across adjacent pixels.
  2. **Chromium 3D Compositor Texture Downsampling on Iframes**:
     - When any ancestor has `perspective` and `transform-style: preserve-3d`, Chromium rasterizes descendant iframes into low-resolution 1x GPU texture quads and disables subpixel ClearType / CoreText font antialiasing.
  3. **Standard 1x Device Pixel Ratio inside Iframe**:
     - On desktop browsers, `window.devicePixelRatio` defaults to 1.0 (or 1.25), causing Leaflet, Google Maps, `<canvas>`, and `<img srcset>` to load low-resolution 1x map tiles and compressed standard-res images rather than Retina `@2x` assets.
- **Solution Implemented**:
  1. **Direct Mobile Native Bypass in `ResponsiveViewport.jsx`**:
     - Mobile devices (`isMobile || viewportWidth <= 500`) now bypass the scaling engine entirely:
       `width: '100%'`, `height: '100%'`, `transform: 'none'`.
     - Zero downscaling, zero resampling, and zero subpixel font blur. The website renders at 100% native vector font clarity.
  2. **Direct 2D Framebuffer Rendering at 0° Front View**:
     - When `pitch === 0 && yaw === 0 && roll === 0` (head-on front view):
       - `#device-mockup-stage`: `perspective: 'none'`.
       - 3D Scene Wrapper and `#tight-device-capture-box`: `transformStyle: 'flat'`, `transform: scale(${activeScale})`.
       - Front face in `PhoneFrame.jsx`, `TabletFrame.jsx`, `LaptopFrame.jsx`, `DesktopFrame.jsx`: `transform: 'none'`.
     - Bypasses Chromium's 3D GPU texture rasterizer completely when looking straight at the device, delivering full native subpixel ClearType / CoreText antialiasing directly to the screen.
     - When rotated in 3D (pitch or yaw > 0.1°), `is3D` activates dynamically to render the volumetric unibody chassis, rails, and ports in 60 FPS 3D.
  3. **Injected Retina 2.5x Resolution (`devicePixelRatio = 2.5`)**:
     - In `server.js` and `vite.config.js`, injected `Object.defineProperty(window, 'devicePixelRatio', { get: () => 2.5 })`.
     - Automatically prompts Leaflet and Google Maps to download high-DPI Retina `@2x` satellite/street map tiles.
     - Prompts responsive images (`<img srcset>`) to fetch ultra-sharp high-density Retina assets.
  4. **Universal High-Contrast Typography & Graphic Sharpness**:
     - Injected `* { -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; text-rendering: geometricPrecision !important; }` and `img, svg, canvas { image-rendering: -webkit-optimize-contrast !important; }` into all proxied pages.






### 20. Bulletproof Mouse Wheel & Trackpad Scrolling Over Device Screen
- **Root Cause Identified**:
  1. **Single Page Application (SPA) Scroll Container Mismatch**:
     - Modern React/Tailwind web apps (including `servcate.com`) frequently lock the outer viewport (`document.body.style.overflow = "hidden"` and `document.documentElement.style.overflow = "hidden"`) and place the actual scrollable content inside inner flex containers (`style={{ flex: 1, overflowY: "auto" }}` or `.my-plate-scroll-list`, `main`, `.page-content`).
     - Previous event listeners called `window.scrollBy(...)`, which attempts to scroll `window`/`document.scrollingElement`. Because `body` was overflow-locked, calling `window.scrollBy` moved 0 pixels, even though manually dragging the scrollbar thumb worked.
  2. **Chromium Event Boundary Swallowing & 3D Transform Compositor**:
     - When hovering an `<iframe>` inside a CSS 3D transformed container (`transform: scale(...)`, `rotateX(...)`, `rotateY(...)`, `perspective`), Chromium's compositor often fails to deliver OS mouse wheel events across the frame boundary or sends them to the host window's non-scrollable stage.
     - React's `onWheel` listener on `ResponsiveViewport.jsx` was attached to the outer div, but when the cursor was over the iframe, events were consumed before bubbling to React.
  3. **Injected CSS Conflicts on Windows Precision Touchpads**:
     - Injected `touch-action: pan-y !important` and `height: auto !important` interfered with Windows DirectManipulation and broke flex-height percentage resolution (`height: 100%`) for internal scroll views.
     - Injected `scroll-behavior: smooth !important` caused wheel tick queueing and frame skipping.
- **Solution Implemented**:
  1. **Dual-Layer Capturing Wheel Listener (`{ passive: false, capture: true }`)**:
     - **Host Window Level**: Attached a capturing wheel listener on the host window in `ResponsiveViewport.jsx`. When the mouse is anywhere inside `containerRef.current.getBoundingClientRect()` (or on descendants), it halts parent page scroll (`e.preventDefault()`, `e.stopPropagation()`) and forwards relative delta values (`deltaY`, `deltaX`, `relX`, `relY`).
     - **Iframe Document Level**: In `handleIframeLoad`, directly attaches capturing `wheel` listeners to `iframe.contentWindow` and `iframe.contentDocument` so that native events within the iframe are captured before any child element or library (e.g. Leaflet) can suppress them.
  2. **Multi-Container Smart Scroll Resolver (`findScrollableElement` / `getAppRecorderScrollTarget`)**:
     - Walks up the DOM tree starting from `document.elementFromPoint(x, y)` to find the closest ancestor with `overflowY: auto|scroll|overlay` and `scrollHeight > clientHeight + 2`.
     - Automatically inspects SPA root candidates: `#root [style*="overflow-y"]`, `#root [class*="overflow-y"]`, `.my-plate-scroll-list`, `.page-content`, `main`, and inner scroll divs.
     - Calls `target.scrollBy({ top: deltaY, left: deltaX, behavior: 'auto' })` directly on the active scroll container.
  3. **Guaranteed PostMessage Fallback Bridge**:
     - Sends `APPRECORDER_SCROLL` with `deltaY`, `deltaX`, `clientX`, `clientY` across the iframe boundary.
     - Injected script in `server.js` and `vite.config.js` routes the message to the smart scroll resolver and executes instant 1:1 scroll updates.
  4. **Cleaned Injected Styles in Proxy Middleware**:
     - Removed `touch-action: pan-y !important` and `height: auto !important`.
     - Set `scroll-behavior: auto !important` for immediate tactile responsiveness without queue lag.


### 21. Netlify Production Deployment Configuration & Serverless Proxy
- **Goal**: Ensure the entire AppRecorder application, all dependencies, build scripts, routing rules, and proxy capabilities are 100% self-contained in `c:\Users\vishw\New folder\AppRecorder` for effortless deployment to Netlify.
- **Audit Results**:
  - All source code imports (`react`, `react-dom`, `lucide-react`, `idb-keyval`, `clsx`, `tailwind-merge`) are declared in `package.json` with 0 missing packages.
  - No external file dependencies exist outside the `AppRecorder` root directory.
  - Production build generates a self-contained static distribution in `dist/` (2.27s build time, 0 errors).
- **Files Added & Configured**:
  1. **`netlify.toml`**:
     - Configured build command (`npm run build`), publish directory (`dist`), and functions directory (`netlify/functions`).
     - Set Node runtime environment (`NODE_VERSION = "20"`).
     - Configured 200 rewrite rules for `/api/proxy`, `/api/proxy/*`, and `/api/*` to `/.netlify/functions/proxy`.
     - Configured SPA fallback rewrite (`/* -> /index.html 200`).
     - Added security headers (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`) and long-term immutable caching for `/assets/*`.
  2. **`netlify/functions/proxy.js`**:
     - Deploys the full Smart Proxy capability to Netlify serverless infrastructure.
     - Dual-export architecture: supports modern Netlify Functions v2 (`export default async (req, context)`) and classic Netlify/AWS Lambda v1 (`export async function handler(event, context)`).
     - Strips `X-Frame-Options`, `Content-Security-Policy`, and integrity tags.
     - Automatically resolves dynamic chunks and Leaflet assets.
     - Injects the `frameScript` and `frameStyle` for mobile card scaling (`1.0x`), Retina 2.5x `devicePixelRatio`, and the smart scroll resolver.
     - Uses native Node 20 standard Web APIs (`fetch`, `Response`, `URL`) with zero external npm dependencies.
  3. **`public/_redirects`**:
     - Automatically bundled into `dist/_redirects` by Vite.
     - Guarantees seamless routing even if the `dist/` folder is deployed manually or dragged directly into Netlify.
  4. **`.gitignore`**:
     - Properly ignores `node_modules`, `dist`, `.netlify`, `.vscode`, and logs for clean Git repository imports.


### 22. 100% Direct Website & Screenshot Loading (Removed Proxy Dependency)
- **Root Cause Identified**:
  - The navbar featured a `[Direct | Proxy]` toggle that caused confusion when deployed to static hosting.
  - In direct mode, typing `https://google.com` failed because Google's root domain sends `X-Frame-Options: SAMEORIGIN`, causing Chrome to display `refused to connect` with a red blocked icon.
  - Users had no way to upload screenshots or Figma designs to showcase within the 3D device mockups.
- **Solution Implemented**:
  1. **Complete Removal of Proxy UI**:
     - Stripped the `[Direct | Proxy]` toggle from `Navbar.jsx`.
     - Removed `/api/proxy` URL rewrites from `PhoneFrame.jsx`, `TabletFrame.jsx`, `LaptopFrame.jsx`, and `DesktopFrame.jsx`.
     - Set default content loading to direct 1:1 embedding.
  2. **Smart URL Normalization (`src/utils/urlHelper.js`)**:
     - Automatically prefixes `https://` if protocol is omitted.
     - Automatically transforms `google.com` and `www.google.com` into Google's official embeddable URL: `https://www.google.com/search?igu=1` (`igu=1` = Iframe Google Universal, which strips `X-Frame-Options` and enables live interactive Google search directly inside the phone).
     - Automatically converts YouTube and Vimeo links into standard embed players.
  3. **High-Definition Screenshot & Design Upload Mode**:
     - Added a dedicated "Screenshot" button in the Navbar with file upload dialog.
     - Users can load any full-page screenshot (PNG, JPG, WebP) or Figma export directly into the device display.
     - Renders within a smooth scrollable container so users can scroll full-length screenshots up and down in 3D using the mouse wheel.
  4. **Direct Wheel Event Passthrough in `ResponsiveViewport.jsx`**:
     - When wheel events occur over the iframe for cross-origin pages, bypassed `e.preventDefault()`, allowing standard native browser mouse wheel scrolling to work freely.
  5. **Live Loading Progress Bar**:
     - Added an animated top progress bar while websites load to provide immediate visual feedback upon clicking "Load".

### 23. Resolved Blank Black Screen on Reset 3D & Front (0°) Angle View
- **Root Cause Identified**:
  1. **Occlusion by Depth Slices & Rear Faces in 2D**:
     - When clicking "Reset 3D View Angle" or choosing "Front (0°)", `pitch`, `yaw`, and `roll` reset to 0, which evaluated `is3D = false`.
     - In `PhoneFrame.jsx`, `TabletFrame.jsx`, `DesktopFrame.jsx`, and `LaptopFrame.jsx`, the Front Face switched to `transform: 'none'` (Z = 0) to deliver native 2D vector sharpness.
     - However, the 11 corner thickness depth slices (`depthSlices`) remained in the DOM with positive `translateZ` values (`z = 1.7px` to `8.5px`) and solid metallic background colors (`#18181b`). Because their Z coordinate was greater than the Front Face (Z = 0), these solid depth slices rendered in front of the screen.
     - In addition, the Back Face (`rotateY(180deg) translateZ(...)`) remained in the DOM. In flattened 2D rendering contexts (`transformStyle: flat`), `backface-visibility: hidden` does not apply across flat subtrees, causing the solid rear casing to paint directly on top of the Front Face due to DOM order.
     - Consequently, the website, status bar, dynamic island, and home bar were completely hidden behind a solid black `#18181b` rectangle.
  2. **Z-Fighting in 3D Mode**:
     - Previously, the final depth slice sat at `z = +halfDepth`, which was the exact same Z coordinate as the Front Face (`translateZ(${halfDepth}px)`), introducing potential Z-buffer collisions.
- **Solution Implemented**:
  1. **Strict 3D Guarding for Volumetric Layers**:
     - Wrapped `depthSlices.map(...)` with `{activeIs3D && ...}` in `PhoneFrame.jsx`, `TabletFrame.jsx`, and `DesktopFrame.jsx`. At 0° head-on view, 3D thickness slices are omitted from the DOM entirely.
     - Wrapped the side rails (Left, Right, Top, Bottom) in `{activeIs3D && ...}` so they are only created when rotating in 3D.
     - Wrapped the Back Face in `{activeIs3D && ...}` across all four device frames (`PhoneFrame`, `TabletFrame`, `LaptopFrame`, `DesktopFrame`), guaranteeing that the rear hardware panel is never painted over the screen in 2D.
  2. **Elevated Stacking Context on Front Display Face**:
     - Assigned `z-10` to the Front Face container across all device models, ensuring the screen, status bar, and website maintain absolute priority in 2D stacking order.
  3. **1px Clearance from Front Glass in 3D**:
     - Constrained depth slice generation to `(depth - 1)`, positioning all corner slices strictly behind the front glass face (`z <= halfDepth - 1px`) to prevent any Z-buffer fighting.
  4. **Synchronized 3D Angle Reset**:
     - Wired `onResetAngle` callback from `DeviceStage.jsx` to `App.jsx`, ensuring that clicking "Reset 3D View Angle" in the floating HUD cleanly resets view angles and aligns the sidebar camera angle state to "Front (0°)".

### 24. Touchscreen Finger Swipe & Sideways (Horizontal) Carousel Scrolling
- **Root Cause Identified**:
  1. **Strictly Vertical Scroll Resolver**:
     - The scroll target resolver (`findScrollableElement` in `ResponsiveViewport.jsx` and `getAppRecorderScrollTarget` in `server.js`, `vite.config.js`, and `netlify/functions/proxy.js`) previously inspected only `overflowY` and `scrollHeight > clientHeight + 2`.
     - When attempting to scroll sideways across horizontal carousels (e.g. food dish categories like "Dosa & Roti's", "Starters", tab bars, card rows), the resolver evaluated horizontal containers as non-scrollable.
     - As a result, horizontal scroll attempts fell through to `document.body` (which has `overflow-x: hidden !important`), completely dropping horizontal scroll deltas.
  2. **Absence of Host Touch & Pointer Listeners for Finger Swiping**:
     - On touchscreen laptops, finger gestures emit `pointerdown`, `pointermove`, `pointerup` and `touchstart`, `touchmove`, `touchend`.
     - Previously, the host container only listened for `wheel` events. When a user swiped with a finger during recording, no wheel events fired, and finger gestures were never routed to the scroll resolver.
- **Solution Implemented**:
  1. **Bidirectional Smart Scroll Resolver**:
     - Updated `findScrollableElement` and `getAppRecorderScrollTarget` to inspect `deltaX` and `deltaY`.
     - When `Math.abs(deltaX) > Math.abs(deltaY)` (horizontal swipe/scroll sideways), the resolver checks `overflowX: auto|scroll|overlay` and `scrollWidth > clientWidth + 2`.
     - Scans horizontal candidate containers (`#root [style*="overflow-x"]`, `[class*="overflow-x"]`, `.overflow-x-auto`, `.carousel`, `.scroll-row`) and directly targets the carousel under the cursor or finger.
  2. **Comprehensive Touch & Finger Swipe Listeners on Host**:
     - Added global capturing `pointerdown`, `pointermove`, `pointerup`, `touchstart`, `touchmove`, and `touchend` listeners in `ResponsiveViewport.jsx`.
     - Tracks finger coordinates across touchscreen displays on Windows touch laptops, computing real-time `dx` and `dy` movement and dispatching smooth 1:1 scroll events to the target element.
  3. **Touchscreen Gestures Inside Iframe**:
     - Injected active `touchstart`, `touchmove`, and `touchend` listeners inside the proxy scripts, allowing finger swipes to directly scroll horizontal carousels and vertical lists inside proxied pages.
  4. **Enforced Horizontal Touch Action**:
     - Injected `touch-action: pan-x pan-y !important` and `-webkit-overflow-scrolling: touch !important` across `html`, `body`, and all `[class*="overflow-x"]` containers, preventing touch suppression.


### 25. Git Repository Initialization & GitHub Remote Deployment
- **Task Executed**:
  1. Initialized an isolated git repository inside `AppRecorder` to prevent parent directory traversal.
  2. Configured `.gitignore` to protect against unintentional staging of build artifacts, dependencies, and environment files (`.env*`, `node_modules`, `dist`, `.netlify`).
  3. Staged all core codebase files, assets, configurations, and documentation.
  4. Created root commit on `main` branch.
  5. Configured remote `origin` pointing to `https://github.com/vnkm2004/AppRecorder.git`.
  6. Successfully pushed `main` branch with upstream tracking to GitHub.


### 26. Vercel Deployment Configuration & Serverless Proxy Adaptation
- **Context & Objectives**:
  - The project is deployed to Vercel directly from the GitHub repository (`https://github.com/vnkm2004/AppRecorder.git`).
  - Previously, serverless proxy routing and rewriting relied strictly on Netlify-specific configurations (`netlify.toml` and `netlify/functions/proxy.js`).
  - On Vercel, requests to `/api/proxy` or dynamic chunks (`/api/*.js`) would fail with 404 without standard Vercel serverless function paths and rewrite definitions.
- **Changes Implemented**:
  1. **Vercel Serverless Function (`api/proxy.js`)**:
     - Created `api/proxy.js` supporting both standard Node.js serverless handlers (`(req, res)`) and Web standard Request/Response handlers.
     - Implemented full frame injection with smart bidirectional scroll target resolution, finger touchscreen gestures, device pixel ratio emulation, anti-framing header stripping, and dynamic asset proxying.
  2. **Vercel Configuration (`vercel.json`)**:
     - Configured `buildCommand` (`npm run build`) and `outputDirectory` (`dist`).
     - Added URL rewrites routing `/api/proxy`, `/api/proxy/:path*`, and `/api/:path*` directly to the `api/proxy` serverless function.
     - Added SPA fallback rewrite `/(.*) -> /index.html` for client-side routing.
     - Added security headers (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`) and long-term immutable caching headers for `/assets/*`.
  3. **Updated `.gitignore` & Documentation**:
     - Added `.vercel` to `.gitignore`.
     - Added Vercel deployment documentation to `README.md`.


### 27. Dynamic Rear Branding & Logo Contrast Adaptation
- **Root Cause Identified**:
  - On the 3D rear chassis of device frames, the centered hardware logo and regulatory text (`AppRecorder 3D`) previously used static white styles (`border-white/20`, `bg-white/5`, `bg-white/40`, and faint `opacity-20`).
  - When switching chassis finishes from Space Black to Ceramic White, Pure Silver, or Natural Titanium, the white text and borders became invisible against the white and light metallic backgrounds.
- **Solution Implemented**:
  1. **Dynamic Contrast Switching**:
     - Evaluated `isBlack = material.id === 'space-black'`.
     - In Space Black (`isBlack === true`), the text is styled white (`text-white/60`) and the logo is rendered with white accents (`border-white/30`, `bg-white/10`, inner dot `bg-white/60`).
     - In all other finishes (`isBlack === false` - Ceramic White, Pure Silver, Natural Titanium, Liquid Glass), the text is rendered black (`text-black/60`) and the logo is rendered with crisp dark accents (`border-black/30`, `bg-black/5`, inner dot `bg-black/60`, and `border-black/50 text-black/80` for Pixel emblems).
  2. **Applied Across All Device Frames**:
     - Updated `PhoneFrame.jsx`, `TabletFrame.jsx`, `LaptopFrame.jsx`, and `DesktopFrame.jsx` for consistent branding contrast and laser-etched visual fidelity.
  3. **Verified Production Build**:
     - Verified with `npm run build`, ensuring zero syntax errors and clean bundle compilation.


### 28. Complete Elimination of Scrollbars on Devices and Embedded Websites
- **Root Cause Identified**:
  - In Chromium on Windows, embedding cross-origin websites inside an `iframe` causes the browser to draw its default 16px wide desktop OS scrollbar (gray thumb with arrow buttons) along the right edge of the viewport.
  - Furthermore, previous proxy scripts injected a 4px custom scrollbar (`::-webkit-scrollbar { width: 4px }`), which caused a scrollbar track to render inside embedded sites and mockups.
- **Solution Implemented**:
  1. **Purged Injected Scrollbars from Proxy & Config Handlers**:
     - Removed all visible scrollbar width and styling from `api/proxy.js`, `netlify/functions/proxy.js`, `server.js`, and `vite.config.js`.
     - Injected `* { scrollbar-width: none !important; -ms-overflow-style: none !important; }` and `::-webkit-scrollbar { display: none !important; width: 0px !important; height: 0px !important; }`.
  2. **Zero-Scrollbar Clipping Architecture in `ResponsiveViewport.jsx`**:
     - Wrapped the `iframe` inside an `overflow-hidden` container and assigned `width: calc(100% + 20px)` with `marginRight: -20px`.
     - Even when Windows Chrome renders its native OS scrollbar for cross-origin pages, the scrollbar is pushed 20px off-screen into the parent's overflow-hidden boundary, completely hiding it from view while preserving full mouse wheel and touchscreen finger scrolling.
     - Set `scrollbarWidth: none` and `msOverflowStyle: none` on both the iframe and image container.
  3. **Universal Global Styles & Frame Container Updates**:
     - Added `.no-scrollbar` utility and enforced `display: none !important` on `iframe::-webkit-scrollbar` in `src/index.css`.
     - Added `no-scrollbar` across viewport containers in `PhoneFrame.jsx`, `TabletFrame.jsx`, `LaptopFrame.jsx`, and `DesktopFrame.jsx`.


### 29. Mobile Responsive UI Overhaul & Mobile Clean Studio Recorder
- **Root Cause Identified**:
  1. `navigator.mediaDevices.getDisplayMedia` is not implemented in mobile web browsers (Android Chrome and iOS Safari) due to mobile OS privacy and sandbox restrictions. Invoking it triggered an unhandled exception alert (`Could not start screen capture: navigator.mediaDevices.getDisplayMedia is not a function`).
  2. The navigation header and sidebar controls were originally optimized for desktop viewports (`md:`): on mobile screens (< 768px), the top bar overflowed and the static 288px sidebar occupied nearly the entire mobile viewport, leaving the 3D canvas squeezed and illegible.
  3. The 3D phone model default scale (0.85) caused devices to clip outside mobile screen bounds.
- **Solution Implemented**:
  1. **Two-Row Responsive Mobile Navbar**:
     - Transformed header into a two-row layout on mobile screens (`< md`):
       - Row 1: Brand badge (`AR AppRecorder 3D`), sidebar controls toggle, theme toggle, video vault button, and record trigger.
       - Row 2: Full-width, touch-friendly URL input bar with `Globe` icon, `Load` button, interactive web demos dropdown, and screenshot upload button.
     - Preserves clean single-row 64px layout on desktop (`md:`).
  2. **Mobile Sliding Drawer with Tap-to-Dismiss Backdrop**:
     - Converted the sidebar into a sliding overlay drawer (`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw]`) backed by a tap-to-dismiss backdrop (`fixed inset-0 bg-black/60 backdrop-blur-sm z-40`).
     - Added a mobile drawer header with title and close (`X`) button.
     - Initialized `sidebarOpen` to `false` on mobile devices (`window.innerWidth >= 768`) so the 3D stage gets 100% viewport width on mobile launch.
  3. **Dynamic Responsive Stage Scaling**:
     - Added `calculateFitScale(model)` in `App.jsx`: dynamically calculates a proportional scale (~0.35 to 0.58) based on mobile screen dimensions (`window.innerWidth` and `window.innerHeight`), ensuring the 3D device fits comfortably within mobile displays.
  4. **Mobile Clean Studio Mode (`getDisplayMedia` Fallback)**:
     - Added `canUseDisplayMedia` check in `RecordingModal.jsx` and guarded `handleStartRecord` in `App.jsx`.
     - On mobile browsers where `getDisplayMedia` is unavailable, provides an informative explanation and **Launch Clean Studio Mode**.
     - In Clean Studio Mode, all navbars, sidebars, and HUD elements are hidden, the 3D phone is centered in full-screen, smooth turntable rotation is started, and a floating "Exit Studio Mode" button is displayed. Users can swipe down their mobile notification shade and record pristine 4K video using the phone's native OS screen recorder without UI clutter.
  5. **Mobile Touch-Friendly HUD**:
     - Added `max-w-[95vw] overflow-x-auto no-scrollbar` to floating HUD in `DeviceStage.jsx`.
     - Hid desktop-only labels on small screens (`hidden sm:flex`), keeping touch-friendly buttons for 3D Spin, Reset, Glare, 100% HD, and Zoom.


### 30. Ultra-Realistic Clean 3D Modeled Human Hand Overhaul
- **Root Causes Identified**:
  1. The right-hand grip pose (and dynamic pose when `yaw > 5`) detached and floated 700px to the right of the phone into the black void due to broken SVG CSS transform origin and translation arithmetic (`transformOrigin: 'bottom right', transform: 'scaleX(-1) translateX(-${phoneWidth}px)'`).
  2. The previous hand geometry was composed of crude, low-poly 2D SVG shapes and flat gradients that appeared like cardboard cutouts, potato wedges, or cartoon stickers rather than an authentic 3D modeled human hand.
  3. Lack of anatomical depth: absence of multi-stop subsurface scattering, joint flexion creases, authentic keratin nail anatomy (lunula, cuticle border, vascular bed, specular reflection arc), and realistic contact ambient occlusion.
- **Solutions Implemented**:
  1. **Complete Anatomical Re-engineering in `HandOverlay.jsx`**:
     - **Volumetric Forearm & Wrist**: Muscular taper following the brachioradialis contour, radius bone highlight, flexor tendon definition, and soft atmospheric studio gradient fading at the bottom edge.
     - **Sculpted Thenar Eminence (Thumb Ball)**: Rounded, volumetric muscle mound with radial illumination, deep palmar crease lines (life line), subtle subsurface scattering (warm amber/peach translucency around the skin edges), and anatomical contact occlusion shadow cast onto the rear phone casing.
     - **Four Proportioned Rear Fingers**: Index, middle, ring, and pinky fingers curving gracefully across the back to the titanium rail, with volumetric knuckle mounds, cylindrical 3D shading, specular highlights, and interphalangeal skin creases.
     - **Volumetric 3D Side Rail Wrapping**: Fleshy, curved cylindrical segments that wrap seamlessly across the 18px phone thickness on the 3D rails with specular crest highlights and core shadows.
     - **Front Layer (Thumb & Fingertips)**:
       - Soft, fleshy, anatomically correct thumb pad resting with natural ergonomic angle along the front left bezel.
       - Realistic Keratin Fingernail: 3D convex dome shading, delicate white lunula (half-moon), natural cuticle border (eponychium), translucent pinkish nail bed, manicured off-white free edge, and glossy specular reflection arc reflecting studio lights.
       - Subtle flexion skin creases across the thumb joint.
       - Soft contact drop shadows cast onto the front glass screen (`feDropShadow` filter).
       - Rounded fingertip pads curving smoothly over the opposite side rail onto the bezel rim.
  2. **100% Mathematically Exact Mirroring**:
     - Replaced broken CSS transforms with exact SVG coordinate space mirroring:
       `<g transform={isMirrored ? 'translate(${pw}, 0) scale(-1, 1)' : undefined}>`
     - Eliminates offset drift, ensuring both left and right hands are always 100% locked to the phone chassis without floating in empty space.
  3. **Added Clean 3D Studio Clay & Obsidian Finishes**:
     - In `devicePresets.js` and `SidebarControls.jsx`, expanded skin tone palettes to 6 options:
       - Warm Honey (Commercial ad match)
       - Fair / Light (Porcelain)
       - Rich Bronze
       - Deep Espresso
       - Clean 3D Studio Clay (Apple keynote style matte porcelain/clay aesthetic)
       - Clean 3D Obsidian (Sleek dark graphite 3D aesthetic)
     - Arranged in a clean 2x3 grid in the sidebar.


