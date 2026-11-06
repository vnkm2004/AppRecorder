import React, { useRef, useState, useEffect } from 'react';
import PhoneFrame from './devices/PhoneFrame';
import TabletFrame from './devices/TabletFrame';
import LaptopFrame from './devices/LaptopFrame';
import DesktopFrame from './devices/DesktopFrame';
import {
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Move,
  Sparkles,
} from 'lucide-react';

export default function DeviceStage({
  deviceModel,
  finishMaterial,
  viewAngle,
  stageBg,
  contentUrl,
  contentType,
  imageSrc,
  demoHtml,
  scale,
  setScale,
  showGlare = true,
  setShowGlare = () => {},
  isTurntableActive,
  setIsTurntableActive,
  stageRef,
  theme = 'dark',
  isRecording = false,
  handConfig = null,
  onResetAngle = null,
}) {
  const [pitch, setPitch] = useState(viewAngle.pitch || 0);
  const [yaw, setYaw] = useState(viewAngle.yaw || 0);
  const [roll, setRoll] = useState(viewAngle.roll || 0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, pitch: 0, yaw: 0 });
  const animFrameRef = useRef(null);

  useEffect(() => {
    setPitch(viewAngle.pitch || 0);
    setYaw(viewAngle.yaw || 0);
    setRoll(viewAngle.roll || 0);
  }, [viewAngle]);

  useEffect(() => {
    if (!isTurntableActive) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();
    const animate = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setYaw((prev) => (prev + delta * 20) % 360);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isTurntableActive]);

  const handlePointerDown = (e) => {
    // Only drag 3D stage if clicking on the background backdrop, NOT on the device itself
    if (
      e.target.closest('#tight-device-capture-box') ||
      e.target.tagName === 'IFRAME' ||
      e.target.closest('button')
    ) {
      return;
    }

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      pitch,
      yaw,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const newYaw = dragStartRef.current.yaw + dx * 0.35;
    const newPitch = Math.max(-50, Math.min(50, dragStartRef.current.pitch - dy * 0.35));

    setYaw(newYaw);
    setPitch(newPitch);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta) => {
    setScale((prev) => Math.max(0.35, Math.min(2.0, +(prev + delta).toFixed(2))));
  };

  const handleReset3D = () => {
    setPitch(0);
    setYaw(0);
    setRoll(0);
    setIsTurntableActive(false);
    if (dragStartRef.current) {
      dragStartRef.current = { x: 0, y: 0, pitch: 0, yaw: 0 };
    }
    if (onResetAngle) {
      onResetAngle();
    }
  };

  const is3D = Math.abs(pitch) > 0.1 || Math.abs(yaw) > 0.1 || Math.abs(roll) > 0.1;

  const renderDevice = () => {
    const props = {
      model: deviceModel,
      material: finishMaterial,
      contentUrl,
      contentType,
      imageSrc,
      demoHtml,
      showGlare,
      handConfig,
      isTurntableActive,
      pitch,
      yaw,
      roll,
      is3D,
    };

    switch (deviceModel.category) {
      case 'mobile':
        return <PhoneFrame {...props} />;
      case 'tablet':
        return <TabletFrame {...props} />;
      case 'laptop':
        return <LaptopFrame {...props} />;
      case 'desktop':
        return <DesktopFrame {...props} />;
      default:
        return null;
    }
  };

  const isDark = theme === 'dark';
  const bgClass = isDark ? stageBg.bgClassDark : stageBg.bgClassLight;

  // Calculate tight scale during recording: device fills view with ~0.5cm (20px) surrounding margin
  const tightRecordingScale = Math.min(
    (typeof window !== 'undefined' ? window.innerWidth - 44 : 800) / (deviceModel.width || 340),
    (typeof window !== 'undefined' ? window.innerHeight - 44 : 800) / (deviceModel.height || 700),
    1.45
  );
  const activeScale = isRecording ? tightRecordingScale : scale;

  return (
    <div
      ref={stageRef}
      id="device-mockup-stage"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none transition-colors duration-300 ${
        isRecording ? 'cursor-none' : 'cursor-grab active:cursor-grabbing'
      } ${bgClass}`}
      style={{
        perspective: is3D ? '1400px' : 'none',
      }}
    >
      {/* 3D Scene Wrapper - Scaled and Rotated */}
      <div
        className="relative flex items-center justify-center transition-transform ease-out"
        style={{
          transform: is3D
            ? `scale(${activeScale}) rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${roll}deg)`
            : `scale(${activeScale})`,
          transformOrigin: 'center center',
          transformStyle: is3D ? 'preserve-3d' : 'flat',
          transitionDuration: isDragging || isTurntableActive ? '0ms' : '250ms',
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'optimizeLegibility',
        }}
      >
        {/* Dedicated Tight Device Capture Box (~0.5cm = 20px studio margin around the device) */}
        <div
          id="tight-device-capture-box"
          className="relative inline-flex items-center justify-center p-5 rounded-[44px]"
          style={{
            transformStyle: is3D ? 'preserve-3d' : 'flat',
          }}
        >
          {renderDevice()}
        </div>
      </div>

      {/* Realistic Floor Ambient Shadow (Soft in light mode, deeper in dark mode) */}
      {!stageBg.isTransparent && (
        <div
          className={`absolute bottom-16 left-1/2 -translate-x-1/2 w-[380px] h-[40px] blur-2xl rounded-full pointer-events-none transition-all duration-300 ${
            isDark ? 'bg-black/50' : 'bg-neutral-900/15'
          }`}
          style={{
            transform: `scale(${scale * 1.1})`,
          }}
        />
      )}

      {/* Floating 3D Navigation Controls HUD (Hidden during recording) */}
      {!isRecording && (
        <div
          className={`absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 p-1.5 rounded-2xl border shadow-2xl z-30 font-mono text-xs transition-colors ${
            isDark
              ? 'glass-panel-dark border-white/10 text-white'
              : 'glass-panel-light border-black/10 text-neutral-900'
          }`}
        >
          {/* Drag Hint */}
          <div
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-[11px] ${
              isDark ? 'bg-white/5 text-neutral-300' : 'bg-black/5 text-neutral-700'
            }`}
          >
            <Move className={`w-3.5 h-3.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
            <span>Drag to Rotate 3D</span>
          </div>

          {/* 3D Continuous Spin Toggle */}
          <button
            onClick={() => setIsTurntableActive(!isTurntableActive)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl transition-all ${
              isTurntableActive
                ? isDark
                  ? 'bg-white text-black font-semibold'
                  : 'bg-black text-white font-semibold'
                : isDark
                ? 'bg-white/5 hover:bg-white/10 text-neutral-300'
                : 'bg-black/5 hover:bg-black/10 text-neutral-700'
            }`}
            title="Auto 3D Turntable Spin"
          >
            {isTurntableActive ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            <span>{isTurntableActive ? 'Stop Spin' : '3D Spin'}</span>
          </button>

          {/* Reset Angle Button */}
          <button
            onClick={handleReset3D}
            className={`p-1.5 rounded-xl transition-colors ${
              isDark ? 'bg-white/5 hover:bg-white/10 text-neutral-300' : 'bg-black/5 hover:bg-black/10 text-neutral-700'
            }`}
            title="Reset 3D View Angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Specular Screen Glare Toggle */}
          <button
            onClick={() => setShowGlare(!showGlare)}
            className={`p-1.5 rounded-xl transition-colors ${
              showGlare
                ? isDark
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  : 'bg-amber-500/15 text-amber-700 border border-amber-500/25'
                : isDark
                ? 'bg-white/5 text-neutral-500 hover:text-neutral-300'
                : 'bg-black/5 text-neutral-400 hover:text-neutral-700'
            }`}
            title={showGlare ? 'Screen Glare ON (Click to Disable for Pure Contrast)' : 'Screen Glare OFF (Click to Enable)'}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <div className={`w-[1px] h-4 my-auto ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

          {/* 100% Native HD Crisp Button */}
          <button
            onClick={() => setScale(1.0)}
            className={`px-2 py-1 rounded-xl text-[11px] font-semibold transition-all ${
              scale === 1.0
                ? isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-emerald-600/10 text-emerald-700 border border-emerald-600/30'
                : isDark
                ? 'bg-white/5 hover:bg-white/10 text-neutral-300'
                : 'bg-black/5 hover:bg-black/10 text-neutral-700'
            }`}
            title="Switch to 100% Native 1:1 Pixel HD Quality"
          >
            100% HD
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom(-0.05)}
            className={`p-1.5 rounded-xl transition-colors ${
              isDark ? 'bg-white/5 hover:bg-white/10 text-neutral-300' : 'bg-black/5 hover:bg-black/10 text-neutral-700'
            }`}
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span
            onClick={() => setScale(deviceModel.defaultScale || 0.85)}
            className="text-[11px] font-semibold px-1 min-w-[36px] text-center cursor-pointer hover:underline"
            title="Click to reset to optimal fit scale"
          >
            {Math.round(scale * 100)}%
          </span>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom(0.05)}
            className={`p-1.5 rounded-xl transition-colors ${
              isDark ? 'bg-white/5 hover:bg-white/10 text-neutral-300' : 'bg-black/5 hover:bg-black/10 text-neutral-700'
            }`}
            title="Zoom In (up to 200%)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
