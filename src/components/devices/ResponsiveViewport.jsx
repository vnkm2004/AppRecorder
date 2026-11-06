import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, ExternalLink, RefreshCw, Upload } from 'lucide-react';

/**
 * Universal scroll target resolver:
 * Intelligently finds the active scrollable container in modern SPAs (Tailwind, React, modals, custom scroll views,
 * and horizontal carousels/dish lists) for both vertical and horizontal (sideways) scrolling.
 */
function findScrollableElement(doc, x, y, deltaX = 0, deltaY = 0) {
  if (!doc) return null;

  // 1. If relative coordinates are available, start directly from the hovered / touched element
  let el = null;
  if (typeof x === 'number' && typeof y === 'number' && doc.elementFromPoint) {
    try {
      el = doc.elementFromPoint(x, y);
    } catch {}
  }

  const isHorizontal = Math.abs(deltaX || 0) > Math.abs(deltaY || 0);

  // 2. Helper to verify if an element is genuinely scrollable in the active direction
  const isScrollable = (node) => {
    if (!node || node.nodeType !== 1) return false;
    try {
      const win = doc.defaultView || window;
      const style = win.getComputedStyle(node);

      // If horizontal scrolling is dominant, prioritize horizontal scroll containers
      if (isHorizontal || Math.abs(deltaX || 0) > 0) {
        const overflowX = style.overflowX || style.overflow;
        const hasXOverflow = /(auto|scroll|overlay)/.test(overflowX);
        if (hasXOverflow && node.scrollWidth > node.clientWidth + 2) {
          return true;
        }
      }

      const overflowY = style.overflowY || style.overflow;
      const hasYOverflow = /(auto|scroll|overlay)/.test(overflowY);
      if (hasYOverflow && node.scrollHeight > node.clientHeight + 2) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  // Walk up the DOM tree from the hovered/touched node to find the nearest scrollable ancestor
  let curr = el;
  while (curr && curr !== doc.body && curr !== doc.documentElement) {
    if (isScrollable(curr)) {
      return curr;
    }
    curr = curr.parentElement;
  }

  // 3. Fallback to common candidate selectors (Tailwind carousels, flex containers)
  const candidateSelectors = isHorizontal
    ? [
        '#root [style*="overflow-x"]',
        '#root [class*="overflow-x"]',
        '.overflow-x-auto',
        '[class*="overflow-x-auto"]',
        '[style*="overflow-x: auto"]',
        '[style*="overflow-x:auto"]',
        '[style*="overflow-x: scroll"]',
        '.carousel',
        '.scroll-row',
        '.my-plate-scroll-list',
        'main',
      ]
    : [
        '#root [style*="overflow-y"]',
        '#root [style*="overflow: auto"]',
        '#root [style*="overflow:auto"]',
        '#root [class*="overflow-y"]',
        '.my-plate-scroll-list',
        '.dashboard-container',
        '.page-content',
        'main',
        '#root > div',
        '#root',
      ];

  for (const sel of candidateSelectors) {
    try {
      const candidate = doc.querySelector(sel);
      if (candidate && isScrollable(candidate)) {
        return candidate;
      }
    } catch {}
  }

  // 4. Broader scan across layout tags if an inner container has scrollable dimension
  try {
    const containers = doc.querySelectorAll('div, section, main, article, ul');
    for (let i = 0; i < containers.length; i++) {
      const node = containers[i];
      if (isHorizontal) {
        if (node.clientWidth > 60 && isScrollable(node)) return node;
      } else {
        if (node.clientHeight > 80 && isScrollable(node)) return node;
      }
    }
  } catch {}

  // 5. Default to standard document scroller
  return doc.scrollingElement || doc.documentElement || doc.body;
}

export default function ResponsiveViewport({
  src,
  srcDoc,
  imageSrc,
  contentType = 'url',
  viewportWidth = 1440,
  showGlare = true,
  isMobile = false,
}) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const fileInputRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [localImage, setLocalImage] = useState(imageSrc || null);

  useEffect(() => {
    if (imageSrc) {
      setLocalImage(imageSrc);
    }
  }, [imageSrc]);

  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setDimensions({ width: clientWidth, height: clientHeight });
        }
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Show loading indicator when URL changes
  useEffect(() => {
    if (contentType !== 'demo' && contentType !== 'image' && src) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [src, contentType]);

  // For mobile devices, bypass fractional downscaling entirely: render 1:1 at 100% native resolution
  const isMobileLayout = isMobile || (viewportWidth && viewportWidth <= 500);
  const isNative = isMobileLayout || Math.abs(dimensions.width - viewportWidth) <= 2;
  const scale = isNative ? 1 : dimensions.width > 0 ? dimensions.width / viewportWidth : 1;
  const scaledHeight =
    dimensions.height > 0 && scale > 0 ? dimensions.height / scale : dimensions.height;

  // Active scroll dispatcher: triggers instant scroll on the active scroll container inside the iframe
  const dispatchScroll = useCallback(
    (deltaY, deltaX, clientX, clientY) => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const effectiveScale = scale > 0 ? scale : 1;
      const relX = typeof clientX === 'number' ? clientX / effectiveScale : undefined;
      const relY = typeof clientY === 'number' ? clientY / effectiveScale : undefined;

      // Direct synchronous DOM scrolling when same-origin
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const target = findScrollableElement(doc, relX, relY, deltaX, deltaY);
          if (target && target.scrollBy) {
            target.scrollBy({ top: deltaY, left: deltaX, behavior: 'auto' });
          } else if (iframe.contentWindow?.scrollBy) {
            iframe.contentWindow.scrollBy({ top: deltaY, left: deltaX, behavior: 'auto' });
          }
        }
      } catch {}

      // Cross-origin message bridge
      try {
        iframe.contentWindow?.postMessage(
          {
            type: 'APPRECORDER_SCROLL',
            deltaY,
            deltaX,
            clientX: relX,
            clientY: relY,
          },
          '*'
        );
      } catch {}
    },
    [scale]
  );

  // Attach capturing listeners directly to iframe window & document upon load
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;
      const cw = iframe.contentWindow;
      const doc = iframe.contentDocument || cw.document;
      if (!doc) return;

      const onIframeWheel = (e) => {
        if (e.ctrlKey || e.metaKey) return;
        const target = findScrollableElement(doc, e.clientX, e.clientY, e.deltaX, e.deltaY);
        if (target && target.scrollBy) {
          target.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: 'auto' });
        } else if (cw.scrollBy) {
          cw.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: 'auto' });
        }
      };

      cw.addEventListener('wheel', onIframeWheel, { passive: true, capture: true });
      doc.addEventListener('wheel', onIframeWheel, { passive: true, capture: true });
    } catch {}
  }, []);

  // Global host capturing wheel listener: intercepts wheel when cursor is over the device screen
  useEffect(() => {
    const handleHostWheel = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isInside =
        containerRef.current.contains(e.target) ||
        (e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom);

      if (isInside) {
        // If the event directly targeted the iframe, let the browser handle native wheel scrolling for cross-origin pages
        if (iframeRef.current && (e.target === iframeRef.current || iframeRef.current.contains(e.target))) {
          return;
        }

        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          e.stopPropagation();
        }
        dispatchScroll(e.deltaY, e.deltaX, e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    window.addEventListener('wheel', handleHostWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener('wheel', handleHostWheel, { capture: true });
    };
  }, [dispatchScroll]);

  // Touch / Finger swipe listener for touch laptops and gesture interaction
  useEffect(() => {
    let isTouching = false;
    let lastX = 0;
    let lastY = 0;

    const getTouchCoords = (e) => {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const handleTouchStart = (e) => {
      if (!containerRef.current) return;
      const coords = getTouchCoords(e);
      const rect = containerRef.current.getBoundingClientRect();
      const isInside =
        coords.x >= rect.left &&
        coords.x <= rect.right &&
        coords.y >= rect.top &&
        coords.y <= rect.bottom;

      if (!isInside) return;

      isTouching = true;
      lastX = coords.x;
      lastY = coords.y;
    };

    const handleTouchMove = (e) => {
      if (!isTouching || !containerRef.current) return;
      const coords = getTouchCoords(e);
      const dx = lastX - coords.x;
      const dy = lastY - coords.y;
      lastX = coords.x;
      lastY = coords.y;

      if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
        const rect = containerRef.current.getBoundingClientRect();
        dispatchScroll(dy, dx, coords.x - rect.left, coords.y - rect.top);
      }
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    // Pointer events (fires for touch on Windows touchscreen laptops)
    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        handleTouchStart(e);
      }
    }, { passive: true, capture: true });

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        handleTouchMove(e);
      }
    }, { passive: true, capture: true });

    window.addEventListener('pointerup', handleTouchEnd, { passive: true, capture: true });
    window.addEventListener('pointercancel', handleTouchEnd, { passive: true, capture: true });

    // Touch events fallback
    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true, capture: true });

    return () => {
      window.removeEventListener('pointerup', handleTouchEnd, { capture: true });
      window.removeEventListener('pointercancel', handleTouchEnd, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('touchend', handleTouchEnd, { capture: true });
      window.removeEventListener('touchcancel', handleTouchEnd, { capture: true });
    };
  }, [dispatchScroll]);

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalImage(url);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-white overflow-hidden select-auto"
      style={{
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'optimizeLegibility',
        transform: 'translateZ(0)',
        touchAction: 'pan-x pan-y',
      }}
    >
      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500/20 z-30 overflow-hidden pointer-events-none">
          <div className="h-full bg-cyan-500 animate-pulse w-full" />
        </div>
      )}

      {/* 1. IMAGE / SCREENSHOT MODE */}
      {contentType === 'image' ? (
        localImage ? (
          <div
            className="w-full h-full overflow-y-auto overflow-x-auto no-scrollbar select-none bg-neutral-950 flex flex-col items-center"
            style={{
              touchAction: 'pan-x pan-y',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <img
              src={localImage}
              alt="Device Screen Display"
              className="w-full h-auto block select-none pointer-events-none"
              style={{
                imageRendering: '-webkit-optimize-contrast',
                maxWidth: '100%',
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-neutral-900 text-neutral-400 select-none">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFile}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-white/10 flex items-center justify-center mb-4 text-neutral-300">
              <ImageIcon className="w-7 h-7" />
            </div>
            <p className="text-xs font-semibold text-neutral-200 mb-1">No Screenshot Selected</p>
            <p className="text-[11px] text-neutral-400 max-w-[220px] mb-4">
              Upload any website screenshot, Figma frame, or app mockup to showcase in 3D.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs flex items-center space-x-2 hover:bg-neutral-200 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Select Screenshot</span>
            </button>
          </div>
        )
      ) : (
        /* 2. LIVE IFRAME & INTERACTIVE DEMO MODE (100% DIRECT, ZERO SCROLLBAR) */
        dimensions.width > 0 && (
          <div className="w-full h-full overflow-hidden relative">
            <iframe
              ref={iframeRef}
              onLoad={handleIframeLoad}
              title="Responsive Viewport Content"
              src={contentType !== 'demo' ? src : undefined}
              srcDoc={contentType === 'demo' ? srcDoc : undefined}
              className="border-0 select-auto block no-scrollbar"
              style={{
                width: isNative ? 'calc(100% + 20px)' : `${viewportWidth + 20}px`,
                height: isNative ? '100%' : `${scaledHeight}px`,
                marginRight: '-20px',
                transform: isNative ? 'none' : `scale(${scale})`,
                transformOrigin: 'top left',
                pointerEvents: 'auto',
                imageRendering: '-webkit-optimize-contrast',
                WebkitFontSmoothing: 'antialiased',
                textRendering: 'optimizeLegibility',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              allow="geolocation; camera; microphone; clipboard-read; clipboard-write; accelerometer; gyroscope; fullscreen"
              loading="eager"
            />
          </div>
        )
      )}

      {/* Specular Screen Glare */}
      {showGlare && (
        <div className="absolute inset-0 screen-glare pointer-events-none z-20" />
      )}
    </div>
  );
}
