import React from 'react';
import ResponsiveViewport from './ResponsiveViewport';

export default function DesktopFrame({
  model,
  material,
  contentUrl,
  contentType,
  imageSrc,
  demoHtml,
  showGlare = true,
  pitch = 0,
  yaw = 0,
  roll = 0,
  is3D = false,
}) {
  const depth = model.depth || 22;
  const halfDepth = depth / 2;
  const radius = model.borderRadius || 14;
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
      className="relative select-none flex flex-col items-center preserve-3d"
      style={{
        width: `${model.width}px`,
      }}
    >
      {/* 1. SOLID 3D MONITOR CASING WITH RICH COLORED SIDE PROFILE */}
      <div
        className="relative w-full preserve-3d"
        style={{
          height: `${model.height}px`,
        }}
      >
        {/* SEAMLESS ROUNDED CORNER DEPTH SLICES (Curves smoothly around the 4 corners, rendered strictly in 3D so they never occlude the front screen in 2D) */}
        {activeIs3D &&
          depthSlices.map((z, idx) => (
            <div
              key={idx}
              className="absolute inset-0 pointer-events-none transition-colors duration-200"
              style={{
                borderRadius: `${radius}px`,
                backgroundColor: material.sideRailBg || material.solidColor || '#d4d4d8',
                boxShadow: `inset 0 0 0 1px ${material.edgeHighlight || 'rgba(255, 255, 255, 0.08)'}`,
                transform: `translateZ(${z}px)`,
              }}
            />
          ))}

        {/* 3D SOLID COLORED SIDE RAILS (Rendered strictly in 3D, omitted in 2D head-on view) */}
        {activeIs3D && (
          <>
            {/* SOLID COLORED LEFT SIDE RAIL */}
            <div
              className="absolute shadow-inner"
              style={{
                top: `${radius}px`,
                height: `calc(100% - ${radius * 2}px)`,
                width: `${depth}px`,
                left: `-${halfDepth}px`,
                transform: 'rotateY(-90deg)',
                backgroundColor: material.sideRailBg || material.solidColor || '#d4d4d8',
              }}
            />

            {/* SOLID COLORED RIGHT SIDE RAIL */}
            <div
              className="absolute shadow-inner"
              style={{
                top: `${radius}px`,
                height: `calc(100% - ${radius * 2}px)`,
                width: `${depth}px`,
                right: `-${halfDepth}px`,
                transform: 'rotateY(90deg)',
                backgroundColor: material.sideRailBg || material.solidColor || '#d4d4d8',
              }}
            />

            {/* SOLID COLORED TOP RAIL */}
            <div
              className="absolute shadow-inner"
              style={{
                left: `${radius}px`,
                width: `calc(100% - ${radius * 2}px)`,
                height: `${depth}px`,
                top: `-${halfDepth}px`,
                transform: 'rotateX(90deg)',
                backgroundColor: material.sideRailBg || material.solidColor || '#d4d4d8',
              }}
            />

            {/* SOLID COLORED BOTTOM RAIL */}
            <div
              className="absolute shadow-inner"
              style={{
                left: `${radius}px`,
                width: `calc(100% - ${radius * 2}px)`,
                height: `${depth}px`,
                bottom: `-${halfDepth}px`,
                transform: 'rotateX(-90deg)',
                backgroundColor: material.sideRailBg || material.solidColor || '#d4d4d8',
              }}
            />
          </>
        )}

        {/* FRONT FACE (Screen & Front Bezels - native 2D when head-on at 0°) */}
        <div
          className={`absolute inset-0 ${material.chassisClass} rounded-[${radius}px] border-2 shadow-2xl flex flex-col backface-hidden z-10`}
          style={{
            padding: `${model.bezel}px`,
            transform: activeIs3D ? `translateZ(${halfDepth}px)` : 'none',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: `
              0 0 0 1px ${material.rimHighlight || 'rgba(255, 255, 255, 0.15)'},
              0 25px 60px -15px rgba(0, 0, 0, 0.9)
            `,
          }}
        >
          {/* Front Camera Dot */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-neutral-900 ring-1 ring-white/10 z-30" />

          {/* Screen Display Area with True Desktop Viewport Scaling */}
          <div className="relative w-full h-full bg-black rounded-[8px] overflow-hidden flex-1 flex flex-col">
            <ResponsiveViewport
              src={iframeSrc}
              srcDoc={demoHtml}
              imageSrc={imageSrc}
              contentType={contentType}
              viewportWidth={model.viewportWidth || 1440}
              showGlare={showGlare}
            />
          </div>

          {/* Aluminum Chin */}
          <div className="h-8 w-full mt-1 flex items-center justify-center opacity-70">
            <div className="w-3.5 h-3.5 rounded-full border border-current opacity-30 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-current opacity-50" />
            </div>
          </div>
        </div>

        {/* BACK FACE (Solid Aluminum Rear Enclosure, rendered strictly in 3D so it never covers the front screen in 2D) */}
        {activeIs3D && (
          <div
            className={`absolute inset-0 ${material.backClass} rounded-[${radius}px] border ${isBlack ? 'border-white/10' : 'border-black/10'} shadow-2xl flex flex-col justify-between p-6 backface-hidden`}
            style={{
              transform: `rotateY(180deg) translateZ(${halfDepth}px)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
            }}
          >
            {/* Top Airflow Grille */}
            <div className={`w-3/4 mx-auto h-1.5 ${isBlack ? 'bg-black/40 border-white/5' : 'bg-black/20 border-black/10'} rounded-full border`} />

            {/* Logo & Stand Mount Knuckle */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div
                className={`w-12 h-12 rounded-full border flex items-center justify-center shadow-inner ${
                  isBlack ? 'border-white/30 bg-white/10' : 'border-black/30 bg-black/5'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${isBlack ? 'bg-white/60' : 'bg-black/60'}`}
                />
              </div>
              <div
                className={`text-[10px] font-mono font-medium uppercase tracking-[0.2em] ${
                  isBlack ? 'text-white/60' : 'text-black/60'
                }`}
              >
                AppRecorder 3D
              </div>

              <div className="w-16 h-8 rounded-lg bg-neutral-950 border border-white/10 shadow-lg flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/10" />
              </div>
            </div>

            {/* Bottom I/O Ports */}
            <div className="flex items-center justify-between px-6 pt-2 border-t border-white/5">
              <div className="flex space-x-2">
                <div className="w-3 h-1.5 bg-black rounded-sm border border-white/10" title="Thunderbolt 4" />
                <div className="w-3 h-1.5 bg-black rounded-sm border border-white/10" title="USB-C" />
                <div className="w-3 h-1.5 bg-black rounded-sm border border-white/10" title="USB-C" />
              </div>

              <div className="w-4 h-4 rounded-full bg-black border border-white/15 flex items-center justify-center" title="Power Cable">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. STAND & BASE */}
      <div className="relative flex flex-col items-center z-0 preserve-3d">
        <div
          className="w-14 h-20 -mt-1 bg-gradient-to-b from-neutral-700 to-neutral-900 border-x border-white/10 shadow-lg"
          style={{
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
          }}
        />

        <div className="w-48 h-3.5 bg-neutral-800 border border-white/15 rounded-t-lg shadow-2xl -mt-0.5" />
      </div>
    </div>
  );
}
