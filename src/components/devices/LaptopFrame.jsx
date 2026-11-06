import React from 'react';
import ResponsiveViewport from './ResponsiveViewport';

export default function LaptopFrame({
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
  const isNotch = model.cameraType === 'notch';
  const depth = model.depth || 18;
  const halfDepth = depth / 2;
  const lidDepth = 12;
  const halfLid = lidDepth / 2;
  const isBlack = material.id === 'space-black';
  const activeIs3D =
    typeof is3D === 'boolean'
      ? is3D
      : Math.abs(pitch) > 0.1 || Math.abs(yaw) > 0.1 || Math.abs(roll) > 0.1;

  const iframeSrc = contentUrl;

  return (
    <div
      className="relative select-none flex flex-col items-center preserve-3d"
      style={{
        width: `${model.width}px`,
      }}
    >
      {/* 1. SOLID 3D DISPLAY LID WITH THICKNESS */}
      <div
        className="relative w-full preserve-3d"
        style={{
          height: `${model.height}px`,
        }}
      >
        {/* FRONT FACE (Screen & Notch - native 2D when head-on at 0°) */}
        <div
          className={`absolute inset-0 ${material.chassisClass} rounded-t-[16px] border-2 border-b-0 shadow-2xl flex flex-col backface-hidden z-10`}
          style={{
            padding: `${model.bezel}px`,
            transform: activeIs3D ? `translateZ(${halfLid}px)` : 'none',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: `
              0 0 0 1px ${material.rimHighlight || 'rgba(255, 255, 255, 0.15)'},
              0 25px 60px -15px rgba(0, 0, 0, 0.9)
            `,
          }}
        >
          {/* Inner Screen Display */}
          <div className="relative w-full h-full bg-black rounded-t-[8px] overflow-hidden flex flex-col">
            {/* Notch */}
            {isNotch && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-b-xl z-30 flex items-center justify-center space-x-1.5 border-b border-x border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 ring-1 ring-white/10" />
                <div className="w-1 h-1 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>
            )}

            {/* Responsive Viewport */}
            <div className="relative w-full h-full bg-black overflow-hidden flex-1 no-scrollbar">
              <ResponsiveViewport
                src={iframeSrc}
                srcDoc={demoHtml}
                imageSrc={imageSrc}
                contentType={contentType}
                viewportWidth={model.viewportWidth || 1440}
                showGlare={showGlare}
              />
            </div>
          </div>
        </div>

        {/* 3D LID BACK FACE & SIDE RAILS (Rendered strictly in 3D, omitted in 2D head-on view) */}
        {activeIs3D && (
          <>
            {/* BACK FACE (Solid Aluminum Display Lid with Logo) */}
            <div
              className={`absolute inset-0 ${material.backClass} rounded-t-[16px] border ${isBlack ? 'border-white/10' : 'border-black/10'} shadow-2xl flex flex-col items-center justify-center space-y-3 backface-hidden`}
              style={{
                transform: `rotateY(180deg) translateZ(${halfLid}px)`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
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

            {/* LID THICKNESS: LEFT RAIL */}
            <div
              className="absolute shadow-inner"
              style={{
                top: '16px',
                height: `calc(100% - 16px)`,
                left: `-${halfLid}px`,
                width: `${lidDepth}px`,
                transform: 'rotateY(-90deg)',
                backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
              }}
            />

            {/* LID THICKNESS: RIGHT RAIL */}
            <div
              className="absolute shadow-inner"
              style={{
                top: '16px',
                height: `calc(100% - 16px)`,
                right: `-${halfLid}px`,
                width: `${lidDepth}px`,
                transform: 'rotateY(90deg)',
                backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
              }}
            />

            {/* LID THICKNESS: TOP RAIL */}
            <div
              className="absolute shadow-inner"
              style={{
                left: '16px',
                width: `calc(100% - 32px)`,
                top: `-${halfLid}px`,
                height: `${lidDepth}px`,
                transform: 'rotateX(90deg)',
                backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
              }}
            />
          </>
        )}
      </div>

      {/* 2. SOLID 3D LAPTOP BASE WITH PORTS VISIBLE AT 90° STRAIGHT SIDE ANGLE */}
      <div
        className="relative w-[106%] h-6 preserve-3d -mt-0.5"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front Face with Thumb Notch & Bevel */}
        <div
          className={`absolute inset-0 rounded-b-[14px] ${material.chassisClass} border border-white/15 flex items-center justify-between px-6 shadow-2xl`}
          style={{
            transform: activeIs3D ? `translateZ(${halfLid}px)` : 'none',
            backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
            boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.9)',
          }}
        >
          {/* Left Ports (MagSafe, USB-C) */}
          <div className="flex space-x-1.5 opacity-70">
            <div className="w-2.5 h-1.5 rounded-full bg-black border border-white/20" />
            <div className="w-2 h-1.5 rounded-sm bg-black border border-white/20" />
          </div>

          {/* Center Thumb Groove */}
          <div className="w-24 h-1.5 bg-black/60 rounded-b-md shadow-inner" />

          {/* Right Ports (HDMI, SD) */}
          <div className="flex space-x-1.5 opacity-70">
            <div className="w-3 h-1.5 rounded-sm bg-black border border-white/20" />
            <div className="w-2 h-1.5 rounded-sm bg-black border border-white/20" />
          </div>
        </div>

        {/* SOLID BASE RAILS (Rendered strictly in 3D) */}
        {activeIs3D && (
          <>
            {/* SOLID LEFT BASE RAIL: MagSafe 3 Port + Dual Thunderbolt 4 */}
            <div
              className="absolute flex items-center justify-center space-x-2 px-2 shadow-inner border-y border-white/10 rounded-sm"
              style={{
                left: `-${halfLid}px`,
                width: `${lidDepth}px`,
                height: '24px',
                transform: 'rotateY(-90deg)',
                backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
              }}
            >
              <div className="w-2 h-1 rounded-full bg-black border border-white/30" title="MagSafe 3" />
              <div className="w-1.5 h-1 rounded-full bg-black border border-white/25" title="Thunderbolt 4" />
            </div>

            {/* SOLID RIGHT BASE RAIL: HDMI Port + SDXC Slot */}
            <div
              className="absolute flex items-center justify-center space-x-2 px-2 shadow-inner border-y border-white/10 rounded-sm"
              style={{
                right: `-${halfLid}px`,
                width: `${lidDepth}px`,
                height: '24px',
                transform: 'rotateY(90deg)',
                backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
              }}
            >
              <div className="w-2.5 h-1 bg-black border border-white/25 rounded-xs" title="HDMI 2.1" />
              <div className="w-3 h-0.5 bg-black border-y border-white/20" title="SDXC Slot" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
