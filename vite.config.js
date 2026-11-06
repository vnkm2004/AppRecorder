import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function webProxyPlugin() {
  return {
    name: 'web-mockup-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const isDirectProxy = req.url.startsWith('/api/proxy');
        const referer = req.headers['referer'] || '';
        const refererHasProxy = referer.includes('/api/proxy?url=');
        const isTargetAsset =
          req.url.includes('leaflet') ||
          (req.url.startsWith('/api/') && req.url.endsWith('.js')) ||
          (req.url.startsWith('/assets/') &&
            !req.url.includes('index-1dQCL7zG') &&
            !req.url.includes('index-Bw-v_1eg') &&
            !req.url.includes('src/'));

        if (!isDirectProxy && !refererHasProxy && !isTargetAsset) {
          return next();
        }

        try {
          let target = '';

          if (isDirectProxy) {
            const parsedUrl = new URL(req.url, 'http://localhost:5173');
            target = parsedUrl.searchParams.get('url') || '';
          } else if (refererHasProxy) {
            const refUrl = new URL(referer);
            const parentTarget = refUrl.searchParams.get('url') || '';
            if (parentTarget) {
              const parentUrlObj = new URL(parentTarget);
              const parentOrigin = parentUrlObj.origin;

              if (req.url.startsWith('/api/') && !req.url.startsWith('/api/proxy')) {
                // Dynamic chunk import (e.g. /api/leaflet-src-DynTsIQs.js)
                const chunkName = req.url.replace(/^\/api\//, '');
                if (parentTarget.includes('/assets/')) {
                  target = new URL(chunkName, parentTarget).href;
                } else {
                  target = new URL('/assets/' + chunkName, parentOrigin).href;
                }
              } else {
                target = new URL(req.url, parentOrigin).href;
              }
            }
          } else if (isTargetAsset) {
            // Direct fallback for chunks and assets from target site (servcate.com)
            const cleanPath = req.url.replace(/^\/api\//, '/assets/');
            target = 'https://servcate.com' + (cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath);
          }

          if (!target) {
            return next();
          }

          if (target.endsWith('.js') && !target.includes('/assets/')) {
            const filename = target.split('/').pop();
            target = new URL('/assets/' + filename, 'https://servcate.com').href;
          }

          if (!/^https?:\/\//i.test(target)) {
            target = 'https://' + target;
          }

          const targetUrl = new URL(target);

          const response = await fetch(target, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              Accept: '*/*',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            redirect: 'follow',
          });

          const contentType = response.headers.get('content-type') || 'text/html';

          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
          res.setHeader('Access-Control-Allow-Headers', '*');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Content-Type', contentType);

          res.removeHeader('X-Frame-Options');
          res.removeHeader('Content-Security-Policy');
          res.removeHeader('Cross-Origin-Embedder-Policy');
          res.removeHeader('Cross-Origin-Opener-Policy');

          if (contentType.includes('text/html')) {
            let html = await response.text();

            html = html.replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, '');
            html = html.replace(/crossorigin(=["'][^"']*["'])?/gi, '');
            html = html.replace(/integrity(=["'][^"']*["'])?/gi, '');

            const targetOrigin = targetUrl.origin;
            // Rewrite root-relative links to pass through /api/proxy to maintain same-origin & avoid CORS
            html = html.replace(/(src|href)=["']\/([^"']+)["']/gi, (match, attr, path) => {
              if (path.startsWith('api/proxy') || path.startsWith('http')) return match;
              return `${attr}="/api/proxy?url=${encodeURIComponent(targetOrigin + '/' + path)}"`;
            });

            const frameScript = `
              <script>
                window.onbeforeunload = null;
                try {
                  if (window.top !== window.self) {
                    window.top = window.self;
                  }
                } catch(e) {}
                try {
                  Object.defineProperty(window, 'devicePixelRatio', {
                    get: function() { return 2.5; },
                    configurable: true
                  });
                  Object.defineProperty(window, 'outerWidth', {
                    get: function() { return window.innerWidth; },
                    configurable: true
                  });
                  Object.defineProperty(window, 'outerHeight', {
                    get: function() { return window.innerHeight; },
                    configurable: true
                  });
                  Object.defineProperty(screen, 'width', {
                    get: function() { return window.innerWidth; },
                    configurable: true
                  });
                  Object.defineProperty(screen, 'height', {
                    get: function() { return window.innerHeight; },
                    configurable: true
                  });
                } catch(e) {}

                // Multi-Container Smart Scroll Resolver for SPAs & custom layouts (Supports both vertical & sideways scrolling)
                function getAppRecorderScrollTarget(x, y, deltaX, deltaY) {
                  let el = null;
                  if (typeof x === 'number' && typeof y === 'number' && document.elementFromPoint) {
                    try { el = document.elementFromPoint(x, y); } catch(err) {}
                  }

                  const isHorizontal = Math.abs(deltaX || 0) > Math.abs(deltaY || 0);

                  function isScrollableNode(node) {
                    if (!node || node.nodeType !== 1) return false;
                    const style = window.getComputedStyle(node);
                    if (isHorizontal || Math.abs(deltaX || 0) > 0) {
                      const ovX = style.overflowX || style.overflow;
                      if (/(auto|scroll|overlay)/.test(ovX) && (node.scrollWidth > node.clientWidth + 2)) {
                        return true;
                      }
                    }
                    const ovY = style.overflowY || style.overflow;
                    return /(auto|scroll|overlay)/.test(ovY) && (node.scrollHeight > node.clientHeight + 2);
                  }

                  let curr = el;
                  while (curr && curr !== document.body && curr !== document.documentElement) {
                    if (isScrollableNode(curr)) return curr;
                    curr = curr.parentElement;
                  }

                  const candidates = isHorizontal
                    ? [
                        document.querySelector('#root [style*="overflow-x"]'),
                        document.querySelector('#root [class*="overflow-x"]'),
                        document.querySelector('.overflow-x-auto'),
                        document.querySelector('[class*="overflow-x-auto"]'),
                        document.querySelector('[style*="overflow-x: auto"]'),
                        document.querySelector('[style*="overflow-x:auto"]'),
                        document.querySelector('[style*="overflow-x: scroll"]'),
                        document.querySelector('.carousel'),
                        document.querySelector('.scroll-row'),
                        document.querySelector('.my-plate-scroll-list')
                      ]
                    : [
                        document.querySelector('#root [style*="overflow-y"]'),
                        document.querySelector('#root [style*="overflow: auto"]'),
                        document.querySelector('#root [style*="overflow:auto"]'),
                        document.querySelector('#root [class*="overflow-y"]'),
                        document.querySelector('.my-plate-scroll-list'),
                        document.querySelector('.dashboard-container'),
                        document.querySelector('main'),
                        document.querySelector('.page-content'),
                        document.querySelector('#root > div'),
                        document.querySelector('#root'),
                        document.scrollingElement,
                        document.documentElement,
                        document.body
                      ];

                  for (let i = 0; i < candidates.length; i++) {
                    const c = candidates[i];
                    if (c && isScrollableNode(c)) return c;
                  }

                  return document.scrollingElement || document.documentElement || document.body || window;
                }

                // Active capturing wheel listener inside iframe
                window.addEventListener('wheel', function(e) {
                  if (e.ctrlKey || e.metaKey) return;
                  const target = getAppRecorderScrollTarget(e.clientX, e.clientY, e.deltaX, e.deltaY);
                  if (target && target.scrollBy) {
                    target.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: 'auto' });
                  } else if (window.scrollBy) {
                    window.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: 'auto' });
                  }
                }, { passive: true, capture: true });

                // Forward wheel / scroll events from host mockup container
                window.addEventListener('message', function(e) {
                  if (e.data && e.data.type === 'APPRECORDER_SCROLL') {
                    const deltaY = e.data.deltaY || 0;
                    const deltaX = e.data.deltaX || 0;
                    const x = typeof e.data.clientX === 'number' ? e.data.clientX : window.innerWidth / 2;
                    const y = typeof e.data.clientY === 'number' ? e.data.clientY : window.innerHeight / 2;
                    const target = getAppRecorderScrollTarget(x, y, deltaX, deltaY);
                    if (target && target.scrollBy) {
                      target.scrollBy({
                        top: deltaY,
                        left: deltaX,
                        behavior: 'auto'
                      });
                    } else if (window.scrollBy) {
                      window.scrollBy({
                        top: deltaY,
                        left: deltaX,
                        behavior: 'auto'
                      });
                    }
                  }
                });

                // Touch / Finger swipe listener inside iframe for touch laptops
                let iframeTouchStartX = 0;
                let iframeTouchStartY = 0;
                let activeIframeTouchTarget = null;

                window.addEventListener('touchstart', function(e) {
                  if (!e.touches || e.touches.length !== 1) return;
                  iframeTouchStartX = e.touches[0].clientX;
                  iframeTouchStartY = e.touches[0].clientY;
                  activeIframeTouchTarget = null;
                }, { passive: true, capture: true });

                window.addEventListener('touchmove', function(e) {
                  if (!e.touches || e.touches.length !== 1) return;
                  const curX = e.touches[0].clientX;
                  const curY = e.touches[0].clientY;
                  const dx = iframeTouchStartX - curX;
                  const dy = iframeTouchStartY - curY;
                  iframeTouchStartX = curX;
                  iframeTouchStartY = curY;

                  if (!activeIframeTouchTarget) {
                    activeIframeTouchTarget = getAppRecorderScrollTarget(curX, curY, dx, dy);
                  }
                  if (activeIframeTouchTarget && activeIframeTouchTarget.scrollBy) {
                    activeIframeTouchTarget.scrollBy({ left: dx, top: dy, behavior: 'auto' });
                  }
                }, { passive: true, capture: true });

                window.addEventListener('touchend', function() {
                  activeIframeTouchTarget = null;
                }, { passive: true, capture: true });
              </script>
              <style>
                /* Guaranteed instant scrolling & ultra-crisp HD text inside mockups */
                html, body {
                  overflow-x: hidden !important;
                  scroll-behavior: auto !important;
                  touch-action: pan-x pan-y !important;
                  -webkit-font-smoothing: antialiased !important;
                  -moz-osx-font-smoothing: grayscale !important;
                  text-rendering: optimizeLegibility !important;
                  image-rendering: -webkit-optimize-contrast !important;
                }

                /* Enable responsive horizontal touch scrolling on cards and carousels */
                [style*="overflow-x"], [class*="overflow-x"], .overflow-x-auto, [data-scroll="horizontal"] {
                  touch-action: pan-x pan-y !important;
                  -webkit-overflow-scrolling: touch !important;
                }

                /* 100% Invisible scrollbar for authentic mobile device mockup */
                * {
                  scrollbar-width: none !important;
                  -ms-overflow-style: none !important;
                }
                ::-webkit-scrollbar {
                  display: none !important;
                  width: 0px !important;
                  height: 0px !important;
                  background: transparent !important;
                }

                /* Card scaling fix: prevents artificial zoom shrinkage inside mobile iframe */
                .login-content-wrapper {
                  transform: scale(1) translateY(12px) !important;
                  max-width: 92% !important;
                  width: 100% !important;
                  margin: 0 auto !important;
                }
                .login-card {
                  max-width: 100% !important;
                  width: 100% !important;
                  box-sizing: border-box !important;
                }
              </style>
            `;

            if (html.includes('<head>')) {
              html = html.replace('<head>', `<head>${frameScript}`);
            } else if (html.includes('<HEAD>')) {
              html = html.replace('<HEAD>', `<HEAD>${frameScript}`);
            } else {
              html = frameScript + html;
            }

            return res.end(html);
          } else {
            const arrayBuffer = await response.arrayBuffer();
            return res.end(Buffer.from(arrayBuffer));
          }
        } catch (err) {
          console.error('Proxy error:', err.message);
          res.statusCode = 502;
          res.setHeader('Content-Type', 'text/html');
          return res.end(`
            <html>
              <body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#050a18;color:#94a3b8;text-align:center;padding:24px;">
                <div>
                  <h3 style="color:#f87171;margin-bottom:8px;">Unable to fetch via Smart Proxy</h3>
                  <p style="font-size:13px;max-width:380px;margin-bottom:16px;">${err.message}</p>
                  <p style="font-size:12px;color:#38bdf8;">Try switching to Direct URL mode using the toggle in the top bar.</p>
                </div>
              </body>
            </html>
          `);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), webProxyPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
