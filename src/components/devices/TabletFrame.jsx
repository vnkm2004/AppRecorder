import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';
import ResponsiveViewport from './ResponsiveViewport';

export default function TabletFrame({
  model,
  material,
  contentUrl,
  contentType,
  imageSrc,
  demoHtml,
  showGlare = true,
  currentTime = '9:41',
  pitch = 0,
  yaw = 0,
  roll = 0,
  is3D = false,
}) {
  const depth = model.depth || 16;
  const halfDepth = depth / 2;
  const radius = model.borderRadius || 24;
  const isBlack = material.id === 'space-black';
  const activeIs3D =
    typeof is3D === 'boolean'
      ? is3D
      : Math.abs(pitch) > 0.1 || Math.abs(yaw) > 0.1 || Math.abs(roll) > 0.1;
  const sliceCount = 9;
  const depthSlices = Array.from({ length: sliceCount }, (_, i) => {
    return -halfDepth + (i / (sliceCount - 1)) * (depth - 1);
  });

  const iframeSrc = contentUrl;

  return (
    <div
      className="relative select-none preserve-3d"
      style={{
        width: `${model.width}px`,
        height: `${model.height}px`,
      }}
    >
      {/* 1. SEAMLESS ROUNDED CORNER DEPTH SLICES (Curves smoothly around the 4 corners, rendered strictly in 3D so they never occlude the front screen in 2D) */}
      {activeIs3D &&
        depthSlices.map((z, idx) => (
          <div
            key={idx}
            className="absolute inset-0 pointer-events-none transition-colors duration-200"
            style={{
              borderRadius: `${radius}px`,
              backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
              boxShadow: `inset 0 0 0 1px ${material.edgeHighlight || 'rgba(255, 255, 255, 0.08)'}`,
              transform: `translateZ(${z}px)`,
            }}
          />
        ))}

      {/* 2-5. 3D SOLID COLORED SIDE RAILS (Rendered strictly in 3D, omitted in 2D head-on view) */}
      {activeIs3D && (
        <>
          {/* 2. SOLID COLORED LEFT SIDE RAIL (Straight segment strictly between the rounded corners - never sticks out) */}
          <div
            className="absolute flex flex-col justify-start items-center py-6 shadow-inner"
            style={{
              top: `${radius}px`,
              height: `calc(100% - ${radius * 2}px)`,
              width: `${depth}px`,
              left: `-${halfDepth}px`,
              transform: 'rotateY(-90deg)',
              backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
            }}
          >
            <div className="flex flex-col space-y-3 items-center">
              <div className="w-2.5 h-7 rounded-sm bg-neutral-600 border border-white/20 shadow-md" title="Volume Up" />
              <div className="w-2.5 h-7 rounded-sm bg-neutral-600 border border-white/20 shadow-md" title="Volume Down" />
            </div>
          </div>

          {/* 3. SOLID COLORED RIGHT SIDE RAIL (Straight segment strictly between the rounded corners - never sticks out) */}
          <div
            className="absolute flex items-center justify-center shadow-inner"
            style={{
              top: `${radius}px`,
              height: `calc(100% - ${radius * 2}px)`,
              width: `${depth}px`,
              right: `-${halfDepth}px`,
              transform: 'rotateY(90deg)',
              backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
            }}
          >
            <div className="w-2 h-40 bg-black/40 rounded-full border border-white/15 flex items-center justify-center shadow-inner" title="Apple Pencil Magnetic Strip">
              <div className="w-1 h-36 bg-neutral-700/60 rounded-full" />
            </div>
          </div>

          {/* 4. SOLID COLORED TOP RAIL (Straight segment strictly between the rounded corners - never sticks out) */}
          <div
            className="absolute flex items-center justify-between px-8 shadow-inner"
            style={{
              left: `${radius}px`,
              width: `calc(100% - ${radius * 2}px)`,
              height: `${depth}px`,
              top: `-${halfDepth}px`,
              transform: 'rotateX(90deg)',
              backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
            }}
          >
            <div className="flex space-x-1">
              <div className="w-1.5 h-1 rounded-full bg-black" />
              <div className="w-1.5 h-1 rounded-full bg-black" />
            </div>
            <div className="w-7 h-1.5 bg-neutral-600 rounded-sm" title="Power Button" />
            <div className="flex space-x-1">
              <div className="w-1.5 h-1 rounded-full bg-black" />
              <div className="w-1.5 h-1 rounded-full bg-black" />
            </div>
          </div>

          {/* 5. SOLID COLORED BOTTOM RAIL (Straight segment strictly between the rounded corners - never sticks out) */}
          <div
            className="absolute flex items-center justify-between px-8 shadow-inner"
            style={{
              left: `${radius}px`,
              width: `calc(100% - ${radius * 2}px)`,
              height: `${depth}px`,
              bottom: `-${halfDepth}px`,
              transform: 'rotateX(-90deg)',
              backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
            }}
          >
            <div className="flex space-x-1">
              <div className="w-1.5 h-1 rounded-full bg-black" />
              <div className="w-1.5 h-1 rounded-full bg-black" />
            </div>
            <div className="w-8 h-2 rounded-full bg-black border border-white/10" title="USB-C" />
            <div className="flex space-x-1">
              <div className="w-1.5 h-1 rounded-full bg-black" />
              <div className="w-1.5 h-1 rounded-full bg-black" />
            </div>
          </div>
        </>
      )}

      {/* 6. FRONT FACE (Screen & Front Bezels - native 2D when head-on at 0°) */}
      <div
        className={`absolute inset-0 ${material.chassisClass} transition-colors duration-200 flex flex-col backface-hidden z-10`}
        style={{
          borderRadius: `${radius}px`,
          padding: `${model.bezel}px`,
          borderWidth: '2.5px',
          transform: activeIs3D ? `translateZ(${halfDepth}px)` : 'none',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          boxShadow: `
            0 0 0 1px ${material.rimHighlight || 'rgba(255, 255, 255, 0.15)'},
            0 1px 3px rgba(0, 0, 0, 0.8),
            0 25px 60px -15px rgba(0, 0, 0, 0.9),
            inset 0 1px 1px rgba(255, 255, 255, 0.2)
          `,
        }}
      >
        {/* Top Camera Dot */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-neutral-900 ring-1 ring-white/10 z-30" />

        {/* Screen Display Area */}
        <div
          className="relative w-full h-full bg-neutral-950 overflow-hidden flex flex-col"
          style={{
            borderRadius: `${Math.max(radius - model.bezel, 8)}px`,
          }}
        >
          {/* Status Bar - Physical 28px block absorbs top corner curve */}
          <div className="relative w-full h-7 px-6 flex items-center justify-between text-white text-[11px] font-semibold z-30 shrink-0 font-mono select-none bg-neutral-950 border-b border-white/5">
            <span className="tracking-tight text-white/90">{currentTime}</span>
            <div className="flex items-center space-x-2 text-white/90">
              <Signal className="w-3 h-3 stroke-[2]" />
              <Wifi className="w-3.5 h-3.5 stroke-[2]" />
              <Battery className="w-4 h-4 stroke-[2] fill-current" />
            </div>
          </div>

          {/* Iframe Viewport with 1024px Tablet Scaling */}
          <div className="relative w-full flex-1 overflow-hidden min-h-0 bg-white">
            <ResponsiveViewport
              src={iframeSrc}
              srcDoc={demoHtml}
              imageSrc={imageSrc}
              contentType={contentType}
              viewportWidth={model.viewportWidth || 1024}
              showGlare={showGlare}
            />
          </div>

          {/* Home Bar - Physical 14px block absorbs bottom corner curve */}
          <div className="relative w-full h-3.5 flex items-center justify-center shrink-0 z-30 pointer-events-none bg-neutral-950 border-t border-white/5">
            <div className="w-36 h-1 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>

      {/* 7. BACK FACE (Solid Aluminum Rear Enclosure, rendered strictly in 3D so it never covers the front screen in 2D) */}
      {activeIs3D && (
        <div
          className={`absolute inset-0 ${material.backClass} rounded-[${radius}px] border ${isBlack ? 'border-white/10' : 'border-black/10'} shadow-2xl flex flex-col justify-between p-6 backface-hidden`}
          style={{
            borderRadius: `${radius}px`,
            transform: `rotateY(180deg) translateZ(${halfDepth}px)`,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Dual Camera Module */}
          <div className="w-16 h-16 rounded-2xl bg-neutral-950/80 border border-white/10 p-2 flex flex-col justify-between shadow-md">
            <div className="w-5 h-5 rounded-full bg-neutral-900 border border-white/20" />
            <div className="flex justify-between items-center">
              <div className="w-5 h-5 rounded-full bg-neutral-900 border border-white/20" />
              <div className="w-2 h-2 rounded-full bg-amber-200/80" />
            </div>
          </div>

          {/* Center Logo & Branding */}
          <div className="self-center flex flex-col items-center justify-center space-y-3">
            <div
              className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-inner ${
                isBlack ? 'border-white/30 bg-white/10' : 'border-black/30 bg-black/5'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${isBlack ? 'bg-white/60' : 'bg-black/60'}`}
              />
            </div>
            <div
              className={`text-[10px] font-mono font-medium uppercase tracking-[0.2em] ${
                isBlack ? 'text-white/60' : 'text-black/60'
              }`}
            >
              AppRecorder 3D
            </div>
          </div>

          {/* Smart Connector Pins */}
          <div className="self-center flex space-x-1.5 opacity-60">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
          </div>
        </div>
      )}
    </div>
  );
}
