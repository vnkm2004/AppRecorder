import React from 'react';
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Palette,
  Eye,
  Sliders,
  Check,
  RotateCw,
  Hand,
  Sparkles,
  X,
} from 'lucide-react';
import {
  DEVICE_CATEGORIES,
  DEVICE_MODELS,
  FINISH_MATERIALS,
  VIEW_ANGLES,
  STAGE_BACKGROUNDS,
  HAND_SKIN_TONES,
  HAND_POSES,
} from '../data/devicePresets';

export default function SidebarControls({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  selectedModelId,
  setSelectedModelId,
  selectedMaterialId,
  setSelectedMaterialId,
  selectedAngleId,
  setSelectedAngleId,
  selectedBgId,
  setSelectedBgId,
  showGlare,
  setShowGlare,
  isTurntableActive,
  setIsTurntableActive,
  theme = 'dark',
  handConfig,
  setHandConfig,
}) {
  const categoryIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    laptop: Laptop,
    desktop: Monitor,
  };

  const filteredModels = Object.values(DEVICE_MODELS).filter(
    (m) => m.category === selectedCategory
  );

  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 md:z-30 w-80 max-w-[85vw] md:w-72 h-full md:h-[calc(100vh-4rem)] border-r flex flex-col overflow-y-auto text-xs transition-colors duration-200 select-none font-mono shadow-2xl md:shadow-none ${
          isDark
            ? 'glass-panel-dark border-white/10 text-neutral-200'
            : 'glass-panel-light border-black/10 text-neutral-800'
        }`}
      >
        {/* Mobile Header with Close button */}
        <div
          className={`p-3.5 border-b flex items-center justify-between md:hidden ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-xs uppercase tracking-wider">Device Studio Controls</span>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl border ${
              isDark ? 'border-white/10 text-neutral-400 hover:text-white' : 'border-black/10 text-neutral-600 hover:text-black'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      {/* 1. Category Tabs */}
      <div className={`p-3 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
        <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 opacity-50">
          Device Category
        </label>
        <div
          className={`grid grid-cols-4 gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-black/40 border-white/5' : 'bg-neutral-100 border-black/5'
          }`}
        >
          {DEVICE_CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.id];
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const first = Object.values(DEVICE_MODELS).find(
                    (m) => m.category === cat.id
                  );
                  if (first) setSelectedModelId(first.id);
                }}
                className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all ${
                  isSelected
                    ? isDark
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'bg-neutral-900 text-white font-bold shadow-sm'
                    : isDark
                    ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                    : 'text-neutral-600 hover:text-black hover:bg-black/5'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-[9px]">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Hardware Models */}
      <div className={`p-3 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
        <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 opacity-50">
          Model & Scale
        </label>
        <div className="space-y-1.5">
          {filteredModels.map((model) => {
            const isSelected = selectedModelId === model.id;
            return (
              <button
                key={model.id}
                onClick={() => setSelectedModelId(model.id)}
                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between border transition-all ${
                  isSelected
                    ? isDark
                      ? 'border-white/40 bg-white/10 text-white font-semibold'
                      : 'border-black/40 bg-black/5 text-black font-semibold'
                    : isDark
                    ? 'border-white/5 bg-white/[0.02] text-neutral-400 hover:bg-white/5'
                    : 'border-black/5 bg-black/[0.02] text-neutral-600 hover:bg-black/5'
                }`}
              >
                <div>
                  <div className="text-xs">{model.name}</div>
                  <div className="text-[9px] opacity-40 mt-0.5">
                    {model.width} × {model.height} px
                  </div>
                </div>
                {isSelected && (
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-white text-black' : 'bg-black text-white'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Chassis Finish Materials */}
      <div className={`p-3 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
        <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 flex items-center justify-between opacity-50">
          <span>Chassis Finish</span>
          <Palette className="w-3 h-3" />
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {FINISH_MATERIALS.map((mat) => {
            const isSelected = selectedMaterialId === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => setSelectedMaterialId(mat.id)}
                className={`p-2 rounded-xl flex items-center justify-between border transition-all ${
                  isSelected
                    ? isDark
                      ? 'border-white/40 bg-white/10 text-white font-semibold'
                      : 'border-black/40 bg-black/5 text-black font-semibold'
                    : isDark
                    ? 'border-white/5 bg-white/[0.02] text-neutral-400 hover:bg-white/5'
                    : 'border-black/5 bg-black/[0.02] text-neutral-600 hover:bg-black/5'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full border border-neutral-400 shrink-0"
                    style={{ backgroundColor: mat.colorHex }}
                  />
                  <span className="text-[11px]">{mat.name}</span>
                </div>
                {isSelected && <Check className="w-3 h-3 opacity-80" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3.5. HUMAN HAND GRIP (Active for Mobile when phone is static) */}
      {selectedCategory === 'mobile' && (
        <div className={`p-3 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 opacity-50">
              <Hand className="w-3.5 h-3.5" />
              <span>Human Hand Grip</span>
            </label>
            <input
              type="checkbox"
              checked={handConfig?.enabled || false}
              onChange={(e) => {
                const nextVal = e.target.checked;
                setHandConfig((prev) => ({ ...prev, enabled: nextVal }));
                if (nextVal) {
                  setIsTurntableActive(false);
                  setSelectedAngleId('hand-held-tilt');
                }
              }}
              className="accent-white rounded cursor-pointer"
            />
          </div>

          {handConfig?.enabled && (
            <div className="space-y-3 pt-1">
              {/* Ad Tilt Snap Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedAngleId('hand-held-tilt');
                  setIsTurntableActive(false);
                }}
                className={`w-full p-2 rounded-xl text-left border flex items-center justify-between transition-all ${
                  selectedAngleId === 'hand-held-tilt'
                    ? isDark
                      ? 'border-white/40 bg-white/10 text-white font-semibold'
                      : 'border-black/40 bg-black/5 text-black font-semibold'
                    : isDark
                    ? 'border-white/5 bg-white/[0.02] text-neutral-400 hover:bg-white/5'
                    : 'border-black/5 bg-black/[0.02] text-neutral-600 hover:bg-black/5'
                }`}
              >
                <div>
                  <div className="text-[11px] font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Fintech Ad Tilt (18° Pitch, -22° Yaw)</span>
                  </div>
                  <div className="text-[9px] opacity-40 mt-0.5">
                    Matches commercial ad perspective
                  </div>
                </div>
                {selectedAngleId === 'hand-held-tilt' && <Check className="w-3 h-3 opacity-80" />}
              </button>

              {/* Gender Selection */}
              <div>
                <label className="text-[9px] uppercase font-bold opacity-40 block mb-1">
                  Gender &amp; Hand Build
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setHandConfig((prev) => ({ ...prev, gender: 'male' }))}
                    className={`py-1.5 px-2 rounded-lg text-center border font-semibold transition-all ${
                      handConfig.gender === 'male'
                        ? isDark
                          ? 'border-white bg-white/15 text-white'
                          : 'border-black bg-black/10 text-black'
                        : isDark
                        ? 'border-white/5 opacity-50 hover:opacity-100'
                        : 'border-black/5 opacity-50 hover:opacity-100'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setHandConfig((prev) => ({ ...prev, gender: 'female' }))}
                    className={`py-1.5 px-2 rounded-lg text-center border font-semibold transition-all ${
                      handConfig.gender === 'female'
                        ? isDark
                          ? 'border-white bg-white/15 text-white'
                          : 'border-black bg-black/10 text-black'
                        : isDark
                        ? 'border-white/5 opacity-50 hover:opacity-100'
                        : 'border-black/5 opacity-50 hover:opacity-100'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Skin Tone Color Swatches */}
              <div>
                <label className="text-[9px] uppercase font-bold opacity-40 block mb-1.5">
                  Skin Tone Color
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {HAND_SKIN_TONES.map((tone) => {
                    const isSelected = handConfig.skinTone === tone.id;
                    return (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => setHandConfig((prev) => ({ ...prev, skinTone: tone.id }))}
                        className={`p-1.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                          isSelected
                            ? isDark
                              ? 'border-white bg-white/15'
                              : 'border-black bg-black/10'
                            : isDark
                            ? 'border-white/5 bg-white/[0.02] opacity-70 hover:opacity-100'
                            : 'border-black/5 bg-black/[0.02] opacity-70 hover:opacity-100'
                        }`}
                        title={tone.name}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: tone.previewHex }}
                        />
                        <span className="text-[8px] truncate max-w-full font-medium">
                          {tone.id.toUpperCase()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gesture Grip Type */}
              <div>
                <label className="text-[9px] uppercase font-bold opacity-40 block mb-1">
                  Hand Grip Gesture
                </label>
                <div className="space-y-1">
                  {HAND_POSES.map((pose) => {
                    const isSelected = handConfig.pose === pose.id;
                    return (
                      <button
                        key={pose.id}
                        type="button"
                        onClick={() => setHandConfig((prev) => ({ ...prev, pose: pose.id }))}
                        className={`w-full py-1.5 px-2 rounded-lg text-left border flex items-center justify-between text-[11px] transition-all ${
                          isSelected
                            ? isDark
                              ? 'border-white/30 bg-white/10 text-white font-semibold'
                              : 'border-black/30 bg-black/5 text-black font-semibold'
                            : isDark
                            ? 'border-white/5 opacity-50 hover:opacity-100'
                            : 'border-black/5 opacity-50 hover:opacity-100'
                        }`}
                      >
                        <span>{pose.label}</span>
                        {isSelected && <Check className="w-3 h-3 opacity-80" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Static Note */}
              <div className="text-[9px] opacity-40 leading-tight">
                * Note: Hand grip renders only when phone is static. Auto-rotations are paused.
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. 3D Camera Angles */}
      <div className={`p-3 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
        <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 flex items-center justify-between opacity-50">
          <span>3D Camera Angle</span>
          <Eye className="w-3 h-3" />
        </label>
        <div className="space-y-1">
          {VIEW_ANGLES.map((angle) => {
            const isSelected = selectedAngleId === angle.id;
            return (
              <button
                key={angle.id}
                onClick={() => setSelectedAngleId(angle.id)}
                className={`w-full p-2 rounded-xl text-left border transition-all flex items-center justify-between ${
                  isSelected
                    ? isDark
                      ? 'border-white/40 bg-white/10 text-white font-semibold'
                      : 'border-black/40 bg-black/5 text-black font-semibold'
                    : isDark
                    ? 'border-white/5 bg-white/[0.02] text-neutral-400 hover:bg-white/5'
                    : 'border-black/5 bg-black/[0.02] text-neutral-600 hover:bg-black/5'
                }`}
              >
                <div>
                  <div className="text-[11px]">{angle.name}</div>
                  <div className="text-[9px] opacity-40">{angle.description}</div>
                </div>
                {isSelected && <Check className="w-3 h-3 opacity-80" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Studio Backdrops */}
      <div className={`p-3 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
        <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 opacity-50">
          Backdrop Scene
        </label>
        <div className="space-y-1">
          {STAGE_BACKGROUNDS.map((bg) => {
            const isSelected = selectedBgId === bg.id;
            return (
              <button
                key={bg.id}
                onClick={() => setSelectedBgId(bg.id)}
                className={`w-full p-2 rounded-xl flex items-center space-x-2 border transition-all ${
                  isSelected
                    ? isDark
                      ? 'border-white/40 bg-white/10 text-white font-semibold'
                      : 'border-black/40 bg-black/5 text-black font-semibold'
                    : isDark
                    ? 'border-white/5 bg-white/[0.02] text-neutral-400 hover:bg-white/5'
                    : 'border-black/5 bg-black/[0.02] text-neutral-600 hover:bg-black/5'
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-md border border-neutral-400 shrink-0"
                  style={{
                    backgroundColor: bg.isTransparent ? 'transparent' : bg.previewHex,
                  }}
                />
                <span className="text-[11px] truncate flex-1 text-left">{bg.name}</span>
                {isSelected && <Check className="w-3 h-3 opacity-80" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Settings & Options */}
      <div className="p-3 space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 opacity-50">
          Display Controls
        </label>

        <label
          className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-colors ${
            isDark
              ? 'border-white/5 bg-white/[0.02] hover:bg-white/5'
              : 'border-black/5 bg-black/[0.02] hover:bg-black/5'
          }`}
        >
          <span className="text-[11px]">Glass Glare Reflection</span>
          <input
            type="checkbox"
            checked={showGlare}
            onChange={(e) => setShowGlare(e.target.checked)}
            className="accent-white rounded cursor-pointer"
          />
        </label>

        <label
          className={`flex items-center justify-between p-2 rounded-xl border transition-colors ${
            handConfig?.enabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
          } ${
            isDark
              ? 'border-white/5 bg-white/[0.02] hover:bg-white/5'
              : 'border-black/5 bg-black/[0.02] hover:bg-black/5'
          }`}
          title={handConfig?.enabled ? 'Disabled while hand grip is active' : ''}
        >
          <div>
            <span className="text-[11px] block">3D Auto Turntable</span>
            {handConfig?.enabled && (
              <span className="text-[9px] opacity-50 block">Disabled with Hand Grip</span>
            )}
          </div>
          <input
            type="checkbox"
            disabled={handConfig?.enabled}
            checked={isTurntableActive}
            onChange={(e) => {
              if (handConfig?.enabled) return;
              setIsTurntableActive(e.target.checked);
            }}
            className="accent-white rounded cursor-pointer"
          />
        </label>
      </div>
    </aside>
  </>
);
}
