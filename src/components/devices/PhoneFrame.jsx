import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';
import ResponsiveViewport from './ResponsiveViewport';
import { HandBackLayer, HandSideWrap, HandFrontLayer } from './HandOverlay';

export default function PhoneFrame({
  model,
  material,
  contentUrl,
  contentType,
  imageSrc,
  demoHtml,
  showGlare = true,
  currentTime = '9:41',
  handConfig = null,
  isTurntableActive = false,
  pitch = 0,
  yaw = 0,
  roll = 0,
  is3D = false,
}) {
  const isIPhone18 = model.id === 'iphone-18-pro';
  const isIPhone16 = model.id === 'iphone-16-pro';
  const isIPhone = isIPhone18 || isIPhone16;
  const isPixel10 = model.id === 'pixel-10-pro';
  const isPixel9 = model.id === 'pixel-9-pro';
  const isPixel = isPixel10 || isPixel9;
  const isGalaxy = model.id === 's24-ultra';
  const depth = model.depth || 18;
  const halfDepth = depth / 2;
  const radius = model.borderRadius || 46;
  const activeIs3D =
    typeof is3D === 'boolean'
      ? is3D
      : Math.abs(pitch) > 0.1 || Math.abs(yaw) > 0.1 || Math.abs(roll) > 0.1;

  const effectiveHandPose =
    handConfig?.pose === 'auto'
      ? yaw < -5
        ? 'left'
        : yaw > 5
        ? 'right'
        : 'left'
      : handConfig?.pose || 'left';

  const iframeSrc = contentUrl;

  const sliceCount = 11;
  const depthSlices = Array.from({ length: sliceCount }, (_, i) => {
    return -halfDepth + (i / (sliceCount - 1)) * (depth - 1);
  });

  return (
    <div
      className="relative select-none preserve-3d"
      style={{
        width: `${model.width}px`,
        height: `${model.height}px`,
      }}
    >
      {/* 0. HUMAN HAND REAR LAYER (Palm & Fingers Sandwiched Behind Phone) */}
      {handConfig?.enabled && !isTurntableActive && (
        <div
          className="absolute inset-0 pointer-events-none preserve-3d"
          style={{
            transform: `translateZ(-${halfDepth + 2}px)`,
          }}
        >
          <HandBackLayer
            gender={handConfig.gender || 'male'}
            skinToneId={handConfig.skinTone || 'honey'}
            pose={effectiveHandPose}
            phoneWidth={model.width}
            phoneHeight={model.height}
          />
        </div>
      )}

      {/* 1. SEAMLESS ROUNDED CORNER DEPTH SLICES (Curves smoothly around the 4 corners, solid metallic, rendered strictly in 3D so they never occlude the front screen in 2D) */}
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
            className="absolute flex flex-col justify-between items-center py-6 shadow-inner"
            style={{
              top: `${radius}px`,
              height: `calc(100% - ${radius * 2}px)`,
              width: `${depth}px`,
              left: `-${halfDepth}px`,
              transform: 'rotateY(-90deg)',
              backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
            }}
          >
            {handConfig?.enabled && !isTurntableActive && (
              <HandSideWrap
                side="left"
                gender={handConfig.gender || 'male'}
                skinToneId={handConfig.skinTone || 'honey'}
                pose={effectiveHandPose}
                radius={radius}
                depth={depth}
              />
            )}
            <div className="w-full h-1 bg-black/50" title="Antenna Band" />
            <div className="flex flex-col space-y-4 items-center">
              <div className="w-3.5 h-6 rounded-sm bg-neutral-600 border border-white/20 shadow-md" title="Action Button" />
              <div className="w-3.5 h-12 rounded-sm bg-neutral-600 border border-white/20 shadow-md" title="Volume Up" />
              <div className="w-3.5 h-12 rounded-sm bg-neutral-600 border border-white/20 shadow-md" title="Volume Down" />
            </div>
            <div className="w-full h-1 bg-black/50" title="Antenna Band" />
          </div>

          {/* 3. SOLID COLORED RIGHT SIDE RAIL (Straight segment strictly between the rounded corners - never sticks out) */}
          <div
            className="absolute flex flex-col justify-between items-center py-6 shadow-inner"
            style={{
              top: `${radius}px`,
              height: `calc(100% - ${radius * 2}px)`,
              width: `${depth}px`,
              right: `-${halfDepth}px`,
              transform: 'rotateY(90deg)',
              backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
            }}
          >
            {handConfig?.enabled && !isTurntableActive && (
              <HandSideWrap
                side="right"
                gender={handConfig.gender || 'male'}
                skinToneId={handConfig.skinTone || 'honey'}
                pose={effectiveHandPose}
                radius={radius}
                depth={depth}
              />
            )}
            <div className="w-full h-1 bg-black/50" title="Antenna Band" />
            <div className="flex flex-col space-y-12 items-center">
              <div className="w-3.5 h-16 rounded-sm bg-neutral-600 border border-white/20 shadow-md" title="Power Button" />
              {isIPhone && (
                <div className="w-3.5 h-9 rounded-sm bg-neutral-700 border border-white/25 shadow-inner" title="Camera Control" />
              )}
            </div>
            <div className="w-full h-1 bg-black/50" title="Antenna Band" />
          </div>

          {/* 4. SOLID COLORED TOP RAIL (Straight segment strictly between the rounded corners - never sticks out) */}
          <div
            className="absolute flex justify-between items-center px-12 shadow-inner"
            style={{
              left: `${radius}px`,
              width: `calc(100% - ${radius * 2}px)`,
              height: `${depth}px`,
              top: `-${halfDepth}px`,
              transform: 'rotateX(90deg)',
              backgroundColor: material.sideRailBg || material.solidColor || '#18181b',
            }}
          >
            <div className="w-1 h-full bg-black/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-black" />
            <div className="w-1 h-full bg-black/50" />
          </div>

          {/* 5. SOLID COLORED BOTTOM RAIL (Straight segment strictly between the rounded corners - never sticks out) */}
          <div
            className="absolute flex justify-between items-center px-6 shadow-inner"
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
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
            </div>
            <div className="w-8 h-2.5 rounded-full bg-black border border-white/15 flex items-center justify-center shadow-inner">
              <div className="w-5 h-1 rounded-sm bg-neutral-800" />
            </div>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
            </div>
          </div>
        </>
      )}

      {/* 6. FRONT FACE: Display Screen, Bezels, Dynamic Island (translateZ = +halfDepth when 3D, 'none' at 0° for 100% native vector crispness) */}
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
            0 1px 2px rgba(0, 0, 0, 0.7),
            0 25px 60px -15px rgba(0, 0, 0, 0.8),
            inset 0 1px 1px rgba(255, 255, 255, 0.2)
          `,
        }}
      >
        {/* Screen Display Area */}
        <div
          className="relative w-full h-full bg-neutral-950 overflow-hidden flex flex-col"
          style={{
            borderRadius: `${Math.max(radius - model.bezel, 10)}px`,
            transformStyle: 'flat',
          }}
        >
          {/* Top Status Bar (Safe Area Header) - Physical 32px block absorbs top corner radius so website is NEVER clipped */}
          {model.hasStatusBar && (
            <div className="relative w-full h-8 px-4 flex items-center justify-between text-white text-[11px] font-semibold z-30 shrink-0 font-mono select-none bg-neutral-950 border-b border-white/5">
              <span className="tracking-tight text-white/90">{currentTime}</span>

              {/* iPhone 18 Pro Max Micro Dynamic Island */}
              {isIPhone18 && (
                <div className="absolute left-1/2 -translate-x-1/2 top-1.5 h-[17px] w-[62px] bg-black rounded-full flex items-center justify-between px-2 shadow-md border border-white/10 ring-1 ring-cyan-500/20">
                  <div className="w-2 h-2 rounded-full bg-neutral-900 ring-1 ring-white/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-cyan-900/90" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-neutral-950 ring-1 ring-white/10" />
                </div>
              )}

              {/* iPhone 16 Pro Max Dynamic Island */}
              {isIPhone16 && (
                <div className="absolute left-1/2 -translate-x-1/2 top-1.5 h-[24px] w-[96px] bg-black rounded-full flex items-center justify-between px-2.5 shadow-md border border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-white/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-900/60" />
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 ring-1 ring-white/10" />
                </div>
              )}

              {/* Pixel / Galaxy Centered Punch Hole */}
              {(isGalaxy || isPixel) && (
                <div className="absolute left-1/2 -translate-x-1/2 top-2 w-3.5 h-3.5 rounded-full bg-black ring-1 ring-neutral-800 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
                </div>
              )}

              <div className="flex items-center space-x-1.5 text-white/90">
                <Signal className="w-3 h-3 stroke-[2]" />
                <Wifi className="w-3.5 h-3.5 stroke-[2]" />
                <Battery className="w-4 h-4 stroke-[2] fill-current" />
              </div>
            </div>
          )}

          {/* Website Viewport Container - 100% full rectangular clearance, NO corner edges hidden */}
          <div className="relative w-full flex-1 overflow-hidden min-h-0 bg-white">
            <ResponsiveViewport
              src={iframeSrc}
              srcDoc={demoHtml}
              imageSrc={imageSrc}
              contentType={contentType}
              viewportWidth={model.viewportWidth || 393}
              showGlare={showGlare}
              isMobile={true}
            />
          </div>

          {/* Home Bar (Safe Area Footer) - Physical 14px block absorbs bottom corner radius */}
          {model.hasHomeBar && (
            <div className="relative w-full h-3.5 flex items-center justify-center shrink-0 z-30 pointer-events-none bg-neutral-950 border-t border-white/5">
              <div className="w-28 h-1 bg-white/70 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* 6.5. HUMAN HAND FRONT LAYER (Thumb & Fingertips Wrapping Over Front Rim) */}
      {handConfig?.enabled && !isTurntableActive && (
        <div
          className="absolute inset-0 pointer-events-none preserve-3d"
          style={{
            transform: `translateZ(${halfDepth + 3}px)`,
          }}
        >
          <HandFrontLayer
            gender={handConfig.gender || 'male'}
            skinToneId={handConfig.skinTone || 'honey'}
            pose={effectiveHandPose}
            phoneWidth={model.width}
            phoneHeight={model.height}
          />
        </div>
      )}

      {/* 7. BACK FACE: Solid Hardware Casing (translateZ = -halfDepth, rendered strictly in 3D so it never covers the front screen in 2D) */}
      {activeIs3D && (
        <div
          className={`absolute inset-0 ${material.backClass} rounded-[${radius}px] border border-white/15 shadow-2xl flex flex-col justify-between p-5 backface-hidden`}
          style={{
            borderRadius: `${radius}px`,
            transform: `rotateY(180deg) translateZ(${halfDepth}px)`,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
          }}
        >
          {/* Raised 3D Camera Island / Visor */}
          {isPixel ? (
            <div className="w-[calc(100%+40px)] -mx-5 px-5 h-16 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 rounded-2xl border-y border-white/20 flex items-center justify-between shadow-2xl">
              {/* Pill cutout for dual/triple lenses */}
              <div className="h-11 px-3 bg-black rounded-full border border-white/20 flex items-center space-x-2 shadow-inner">
                <div className="w-6 h-6 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-cyan-950/90 border border-cyan-500/40" />
                </div>
                <div className="w-6 h-6 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-cyan-950/90 border border-cyan-500/40" />
                </div>
                {isPixel10 && (
                  <div className="w-5 h-5 rounded-md bg-neutral-900 border border-white/20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-sm bg-cyan-950/90 border border-cyan-500/40" />
                  </div>
                )}
              </div>
              {/* Flash & Temperature sensor */}
              <div className="flex flex-col items-center space-y-1 pr-1">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-200 border border-white/30 shadow-sm" />
                <div className="w-2 h-2 rounded-full bg-neutral-900 border border-white/20" />
              </div>
            </div>
          ) : isIPhone18 ? (
            <div className="w-28 h-28 rounded-3xl bg-neutral-950/85 border border-white/20 p-2 grid grid-cols-2 gap-1.5 shadow-2xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-zinc-500 flex items-center justify-center shadow-inner">
                <div className="w-5 h-5 rounded-full bg-cyan-950/90 border border-zinc-400 ring-1 ring-cyan-500/30" />
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-zinc-500 flex items-center justify-center shadow-inner">
                <div className="w-5 h-5 rounded-full bg-cyan-950/90 border border-zinc-400 ring-1 ring-cyan-500/30" />
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-zinc-500 flex items-center justify-center shadow-inner">
                <div className="w-5 h-5 rounded-full bg-cyan-950/90 border border-zinc-400 ring-1 ring-cyan-500/30" />
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-zinc-500 flex flex-col items-center justify-center space-y-1 shadow-inner">
                <div className="w-3.5 h-3.5 rounded-full bg-neutral-950 border border-zinc-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-200" />
                </div>
                <div className="w-2 h-2 rounded-full bg-cyan-900/80" />
              </div>
            </div>
          ) : (
            <div className="w-28 h-28 rounded-3xl bg-neutral-950/80 border border-white/15 p-2 grid grid-cols-2 gap-1.5 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-inner">
                <div className="w-5 h-5 rounded-full bg-blue-950/90 border border-neutral-600" />
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-inner">
                <div className="w-5 h-5 rounded-full bg-blue-950/90 border border-neutral-600" />
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-inner">
                <div className="w-5 h-5 rounded-full bg-blue-950/90 border border-neutral-600" />
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-200/90 shadow-sm" />
                <div className="w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700" />
              </div>
            </div>
          )}

          {/* Minimal Centered Logo */}
          <div className="self-center flex items-center justify-center opacity-40">
            {isPixel ? (
              <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center font-bold text-xs font-sans">
                G
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
              </div>
            )}
          </div>

          {/* Regulatory Text */}
          <div className="self-center text-[9px] font-mono opacity-20 uppercase tracking-widest">
            AppRecorder 3D
          </div>
        </div>
      )}
    </div>
  );
}
