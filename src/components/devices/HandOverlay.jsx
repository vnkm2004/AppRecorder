import React from 'react';
import { HAND_SKIN_TONES } from '../../data/devicePresets';

// Ultra-Realistic 3D Modeled Human Hand System for 3D Device Studio
// Features Multi-Stop Subsurface Scattering, Anatomical Phalanges, Natural Keratin Nails,
// Flexion Skin Creases, Knuckle Highlights, and 100% Mathematically Exact Mirroring

function HandBackGeometry({
  tone,
  gender,
  phoneWidth,
  phoneHeight,
  isMirrored = false,
}) {
  const isFemale = gender === 'female';
  const scaleFactor = isFemale ? 0.94 : 1.0;
  const pw = phoneWidth || 340;
  const skinToneId = tone.id;

  return (
    <g
      transform={isMirrored ? `translate(${pw}, 0) scale(-1, 1)` : undefined}
      style={{
        transformOrigin: isMirrored ? undefined : 'bottom left',
        transform: isMirrored ? undefined : `scale(${scaleFactor})`,
      }}
      className="transition-all duration-300"
    >
      {/* 1. Deep Ambient Occlusion Shadow cast by phone onto palm & forearm */}
      <ellipse
        cx="160"
        cy="530"
        rx="155"
        ry="120"
        fill={`url(#contact-shadow-${skinToneId})`}
      />

      {/* 2. Forearm & Wrist: Natural muscular taper with atmospheric studio fade */}
      <path
        d="M -75 920 C -45 815, -10 735, 18 665 C 42 610, 78 575, 128 580 C 168 585, 185 635, 175 685 C 160 765, 170 835, 180 920 Z"
        fill={`url(#arm-grad-${skinToneId})`}
      />

      {/* Forearm Extensor Muscle & Radius Bone Highlight */}
      <path
        d="M -20 880 C 12 795, 42 725, 72 660 C 88 630, 112 615, 136 620"
        stroke={tone.highlightColor}
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
        opacity="0.28"
      />

      {/* Forearm Subsurface Amber Glow along Lateral Edge */}
      <path
        d="M -70 910 C -42 810, -8 730, 20 665 C 32 638, 48 615, 68 600"
        stroke={tone.subsurfaceColor}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />

      {/* Wrist Flexion Crease Lines */}
      <path
        d="M 28 660 C 52 654, 95 652, 135 664"
        stroke={tone.creaseColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M 36 672 C 60 666, 102 664, 142 676"
        stroke={tone.creaseColor}
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />

      {/* 3. Main Palm & Thenar Eminence (Fleshy muscle mound cradling lower phone corner) */}
      <path
        d="M 12 675 C -15 635, -35 585, -25 535 C -15 485, 30 475, 75 505 C 115 530, 145 555, 150 605 C 155 645, 120 680, 60 685 Z"
        fill={`url(#thenar-grad-${skinToneId})`}
      />

      {/* Thenar Life Line / Palmar Crease */}
      <path
        d="M 35 520 C 55 540, 85 575, 95 620"
        stroke={tone.creaseColor}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />

      {/* Hypothenar Palm Cushion (Outer pinky side) */}
      <ellipse
        cx="135"
        cy="615"
        rx="38"
        ry="48"
        fill={tone.baseColor}
        opacity="0.75"
        transform="rotate(-15 135 615)"
      />

      {/* 4. Four Anatomical Rear Fingers (Curving gracefully across the back to the side rail) */}
      {/* -------------------- INDEX FINGER (Digit II) -------------------- */}
      <g>
        {/* Soft cast shadow under finger */}
        <path
          d={`M 142 458 C 192 400, 262 365, ${pw} 356 L ${pw} 378 C 262 395, 192 430, 142 478 Z`}
          fill="rgba(0, 0, 0, 0.35)"
        />
        {/* Main Volumetric Finger Shaft */}
        <path
          d={`M 138 435 C 188 378, 258 342, ${pw} 334 L ${pw} 368 C 258 382, 188 418, 144 466 Z`}
          fill={`url(#finger-shaft-${skinToneId})`}
        />
        {/* Subsurface glow rim along top crest */}
        <path
          d={`M 140 432 C 188 376, 258 340, ${pw} 332`}
          stroke={tone.subsurfaceColor}
          strokeWidth="3.5"
          fill="none"
          opacity="0.45"
        />
        {/* Knuckle Dome Highlight (MCP / PIP) */}
        <ellipse
          cx="238"
          cy="374"
          rx="26"
          ry="11"
          fill={tone.highlightColor}
          opacity="0.32"
          transform="rotate(-14 238 374)"
        />
        {/* Knuckle Flexion Skin Creases */}
        <path
          d="M 230 366 C 238 374, 242 384, 240 392"
          stroke={tone.creaseColor}
          strokeWidth="1.0"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M 236 364 C 244 372, 248 382, 246 390"
          stroke={tone.creaseColor}
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
        />
      </g>

      {/* -------------------- MIDDLE FINGER (Digit III - Longest) -------------------- */}
      <g>
        <path
          d={`M 132 505 C 188 462, 260 438, ${pw} 432 L ${pw} 454 C 260 460, 188 485, 132 525 Z`}
          fill="rgba(0, 0, 0, 0.35)"
        />
        <path
          d={`M 128 480 C 184 436, 258 412, ${pw} 408 L ${pw} 446 C 258 454, 184 478, 134 515 Z`}
          fill={`url(#finger-shaft-${skinToneId})`}
        />
        <path
          d={`M 130 478 C 184 434, 258 410, ${pw} 406`}
          stroke={tone.subsurfaceColor}
          strokeWidth="3.5"
          fill="none"
          opacity="0.45"
        />
        <ellipse
          cx="244"
          cy="436"
          rx="28"
          ry="12"
          fill={tone.highlightColor}
          opacity="0.32"
          transform="rotate(-8 244 436)"
        />
        <path
          d="M 238 428 C 246 436, 249 446, 247 454"
          stroke={tone.creaseColor}
          strokeWidth="1.0"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M 244 426 C 252 434, 255 444, 253 452"
          stroke={tone.creaseColor}
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
        />
      </g>

      {/* -------------------- RING FINGER (Digit IV) -------------------- */}
      <g>
        <path
          d={`M 122 550 C 176 525, 255 512, ${pw} 510 L ${pw} 530 C 255 532, 176 545, 122 570 Z`}
          fill="rgba(0, 0, 0, 0.35)"
        />
        <path
          d={`M 118 528 C 174 500, 254 488, ${pw} 485 L ${pw} 522 C 254 526, 174 540, 124 564 Z`}
          fill={`url(#finger-shaft-${skinToneId})`}
        />
        <path
          d={`M 120 526 C 174 498, 254 486, ${pw} 483`}
          stroke={tone.subsurfaceColor}
          strokeWidth="3.2"
          fill="none"
          opacity="0.45"
        />
        <ellipse
          cx="240"
          cy="508"
          rx="25"
          ry="11"
          fill={tone.highlightColor}
          opacity="0.3"
          transform="rotate(-3 240 508)"
        />
        <path
          d="M 234 502 C 241 508, 244 516, 242 524"
          stroke={tone.creaseColor}
          strokeWidth="0.9"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
      </g>

      {/* -------------------- LITTLE FINGER (Pinky - Digit V) -------------------- */}
      <g>
        <path
          d={`M 112 590 C 166 584, 250 578, ${pw} 580 L ${pw} 600 C 250 600, 166 602, 112 612 Z`}
          fill="rgba(0, 0, 0, 0.35)"
        />
        <path
          d={`M 108 570 C 164 562, 248 556, ${pw} 558 L ${pw} 590 C 248 592, 164 594, 114 606 Z`}
          fill={`url(#finger-shaft-${skinToneId})`}
        />
        <path
          d={`M 110 568 C 164 560, 248 554, ${pw} 556`}
          stroke={tone.subsurfaceColor}
          strokeWidth="3.0"
          fill="none"
          opacity="0.4"
        />
        <ellipse
          cx="230"
          cy="575"
          rx="22"
          ry="10"
          fill={tone.highlightColor}
          opacity="0.25"
        />
        <path
          d="M 224 570 C 230 575, 233 582, 231 588"
          stroke={tone.creaseColor}
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />
      </g>
    </g>
  );
}

export function HandBackLayer({
  gender = 'male',
  skinToneId = 'honey',
  pose = 'left',
  phoneWidth = 340,
  phoneHeight = 700,
}) {
  const tone =
    HAND_SKIN_TONES.find((t) => t.id === skinToneId) || HAND_SKIN_TONES[0];
  const isLeft = pose === 'left' || pose === 'auto';
  const isRight = pose === 'right';
  const isTwoHanded = pose === 'two-handed';

  return (
    <svg
      className="absolute overflow-visible pointer-events-none select-none"
      style={{
        width: `${phoneWidth}px`,
        height: `${phoneHeight}px`,
        left: 0,
        top: 0,
      }}
      viewBox={`0 0 ${phoneWidth} ${phoneHeight}`}
    >
      <defs>
        {/* Forearm & Wrist Multi-stop Gradient with Atmospheric Fade */}
        <linearGradient
          id={`arm-grad-${skinToneId}`}
          x1={isLeft ? '20%' : '80%'}
          y1="100%"
          x2={isLeft ? '60%' : '40%'}
          y2="0%"
        >
          <stop offset="0%" stopColor={tone.shadowColor} stopOpacity="0" />
          <stop offset="25%" stopColor={tone.shadowColor} stopOpacity="0.85" />
          <stop offset="55%" stopColor={tone.baseColor} stopOpacity="1" />
          <stop offset="85%" stopColor={tone.highlightColor} stopOpacity="1" />
          <stop offset="100%" stopColor={tone.baseColor} stopOpacity="1" />
        </linearGradient>

        {/* Palm & Thenar Eminence (Thumb Ball) Fleshy Shading */}
        <radialGradient
          id={`thenar-grad-${skinToneId}`}
          cx="35%"
          cy="40%"
          r="65%"
        >
          <stop offset="0%" stopColor={tone.highlightColor} />
          <stop offset="45%" stopColor={tone.baseColor} />
          <stop offset="80%" stopColor={tone.subsurfaceColor} />
          <stop offset="100%" stopColor={tone.shadowColor} />
        </radialGradient>

        {/* Ambient Contact Shadow behind Phone Body */}
        <radialGradient
          id={`contact-shadow-${skinToneId}`}
          cx="45%"
          cy="55%"
          r="55%"
        >
          <stop offset="0%" stopColor={tone.ambientColor} stopOpacity="0.95" />
          <stop offset="60%" stopColor={tone.ambientColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={tone.ambientColor} stopOpacity="0" />
        </radialGradient>

        {/* Finger Shaft Cylindrical Shading with Subsurface Scattering */}
        <linearGradient
          id={`finger-shaft-${skinToneId}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={tone.subsurfaceColor} />
          <stop offset="25%" stopColor={tone.highlightColor} />
          <stop offset="65%" stopColor={tone.baseColor} />
          <stop offset="100%" stopColor={tone.shadowColor} />
        </linearGradient>
      </defs>

      {/* 1. LEFT HAND BACK LAYER */}
      {(isLeft || isTwoHanded) && (
        <HandBackGeometry
          tone={tone}
          gender={gender}
          phoneWidth={phoneWidth}
          phoneHeight={phoneHeight}
          isMirrored={false}
        />
      )}

      {/* 2. RIGHT HAND BACK LAYER (100% Mathematically Exact Mirror across phoneWidth) */}
      {(isRight || isTwoHanded) && (
        <HandBackGeometry
          tone={tone}
          gender={gender}
          phoneWidth={phoneWidth}
          phoneHeight={phoneHeight}
          isMirrored={true}
        />
      )}
    </svg>
  );
}

// Volumetric Side Rail Wrapping: Seamlessly bridges the back fingers to front fingertips across the 3D phone chassis
export function HandSideWrap({
  side = 'right',
  gender = 'male',
  skinToneId = 'honey',
  pose = 'left',
  radius = 46,
  depth = 18,
}) {
  const tone =
    HAND_SKIN_TONES.find((t) => t.id === skinToneId) || HAND_SKIN_TONES[0];
  const isLeft = pose === 'left' || pose === 'auto';
  const isRight = pose === 'right';
  const isTwoHanded = pose === 'two-handed';

  const shouldRenderFingers =
    (side === 'right' && (isLeft || isTwoHanded)) ||
    (side === 'left' && (isRight || isTwoHanded));
  const shouldRenderThumb =
    (side === 'left' && (isLeft || isTwoHanded)) ||
    (side === 'right' && (isRight || isTwoHanded));

  if (!shouldRenderFingers && !shouldRenderThumb) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 4 Fingers Wrapping Over Side Rail */}
      {shouldRenderFingers && (
        <>
          {/* Index Wrap (y: 334 to 368) */}
          <div
            className="absolute left-0 w-full rounded-full shadow-md"
            style={{
              top: `${Math.max(0, 334 - radius)}px`,
              height: '34px',
              background: `linear-gradient(to bottom, ${tone.subsurfaceColor} 0%, ${tone.highlightColor} 25%, ${tone.baseColor} 70%, ${tone.shadowColor} 100%)`,
              boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -2px 3px ${tone.ambientColor}, 0 2px 5px rgba(0,0,0,0.4)`,
              borderTop: '1px solid rgba(255,255,255,0.3)',
              borderBottom: `1px solid ${tone.shadowColor}`,
            }}
          />

          {/* Middle Wrap (y: 408 to 446) */}
          <div
            className="absolute left-0 w-full rounded-full shadow-md"
            style={{
              top: `${Math.max(0, 408 - radius)}px`,
              height: '38px',
              background: `linear-gradient(to bottom, ${tone.subsurfaceColor} 0%, ${tone.highlightColor} 25%, ${tone.baseColor} 70%, ${tone.shadowColor} 100%)`,
              boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -2px 3px ${tone.ambientColor}, 0 2px 5px rgba(0,0,0,0.4)`,
              borderTop: '1px solid rgba(255,255,255,0.3)',
              borderBottom: `1px solid ${tone.shadowColor}`,
            }}
          />

          {/* Ring Wrap (y: 485 to 522) */}
          <div
            className="absolute left-0 w-full rounded-full shadow-md"
            style={{
              top: `${Math.max(0, 485 - radius)}px`,
              height: '37px',
              background: `linear-gradient(to bottom, ${tone.subsurfaceColor} 0%, ${tone.highlightColor} 25%, ${tone.baseColor} 70%, ${tone.shadowColor} 100%)`,
              boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -2px 3px ${tone.ambientColor}, 0 2px 5px rgba(0,0,0,0.4)`,
              borderTop: '1px solid rgba(255,255,255,0.3)',
              borderBottom: `1px solid ${tone.shadowColor}`,
            }}
          />

          {/* Pinky Wrap (y: 558 to 590) */}
          <div
            className="absolute left-0 w-full rounded-full shadow-md"
            style={{
              top: `${Math.max(0, 558 - radius)}px`,
              height: '32px',
              background: `linear-gradient(to bottom, ${tone.subsurfaceColor} 0%, ${tone.highlightColor} 25%, ${tone.baseColor} 70%, ${tone.shadowColor} 100%)`,
              boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -2px 3px ${tone.ambientColor}, 0 2px 5px rgba(0,0,0,0.4)`,
              borderTop: '1px solid rgba(255,255,255,0.3)',
              borderBottom: `1px solid ${tone.shadowColor}`,
            }}
          />
        </>
      )}

      {/* Thumb Knuckle Wrap Over Opposite Side Rail */}
      {shouldRenderThumb && (
        <div
          className="absolute left-0 w-full rounded-2xl shadow-lg"
          style={{
            top: `${Math.max(0, 442 - radius)}px`,
            height: '68px',
            background: `linear-gradient(to bottom, ${tone.subsurfaceColor} 0%, ${tone.highlightColor} 25%, ${tone.baseColor} 65%, ${tone.shadowColor} 100%)`,
            boxShadow: `inset 0 2px 3px rgba(255,255,255,0.35), inset 0 -3px 4px ${tone.ambientColor}, 0 3px 6px rgba(0,0,0,0.5)`,
          }}
        />
      )}
    </div>
  );
}

function HandFrontGeometry({
  tone,
  gender,
  phoneWidth,
  phoneHeight,
  isMirrored = false,
}) {
  const isFemale = gender === 'female';
  const scaleFactor = isFemale ? 0.94 : 1.0;
  const pw = phoneWidth || 340;
  const skinToneId = tone.id;

  return (
    <g
      transform={isMirrored ? `translate(${pw}, 0) scale(-1, 1)` : undefined}
      style={{
        transformOrigin: isMirrored ? undefined : 'bottom left',
        transform: isMirrored ? undefined : `scale(${scaleFactor})`,
      }}
      className="transition-all duration-300"
    >
      {/* ==================== THE THUMB (Anatomical Distal Phalanx & Pad) ==================== */}
      <g filter="url(#glass-contact-shadow)">
        {/* Thumb Metacarpal Muscle Cushion extending from left side */}
        <path
          d="M -32 590 C -18 555, -4 520, 6 492 C 12 468, 16 448, 4 442 C -8 438, -24 466, -34 506 Z"
          fill={tone.baseColor}
        />

        {/* Distal Thumb Pad: Soft, fleshy contour resting gracefully on the bezel */}
        <path
          d="M -6 444 C 10 436, 24 446, 25 470 C 26 494, 14 518, -2 528 C -16 518, -18 458, -6 444 Z"
          fill={`url(#thumb-pad-${skinToneId})`}
          stroke={tone.shadowColor}
          strokeWidth="0.8"
        />

        {/* Thumb Joint Skin Crease Wrinkles */}
        <path
          d="M -4 488 C 2 490, 8 494, 12 500"
          stroke={tone.creaseColor}
          strokeWidth="0.9"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M -2 496 C 4 498, 8 502, 11 508"
          stroke={tone.creaseColor}
          strokeWidth="0.7"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
        />

        {/* -------------------- Keratin Fingernail (Anatomically Complete) -------------------- */}
        {/* 1. Nail Groove & Lateral Fold Shadow */}
        <path
          d="M 4 450 C 14 445, 20 453, 19 469 C 17 479, 9 477, 4 469 Z"
          fill="rgba(0, 0, 0, 0.25)"
          filter="blur(1px)"
        />
        {/* 2. Vascular Nail Bed (Translucent pinkish keratin plate) */}
        <path
          d="M 5 451 C 15 446, 20 454, 19 470 C 17 480, 9 478, 5 470 Z"
          fill={`url(#nail-bed-${skinToneId})`}
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="0.6"
        />
        {/* 3. Pale Lunula (Half-moon at base of nail) */}
        <path
          d="M 6 452 C 9 450, 13 452, 15 456 C 11 458, 8 457, 6 452 Z"
          fill="rgba(255, 255, 255, 0.65)"
        />
        {/* 4. Natural Free Edge Tip (Clean manicured off-white tip) */}
        <path
          d="M 17 470 C 18 474, 15 478, 9 479 C 7 479, 6 476, 8 474 C 13 474, 16 472, 17 470 Z"
          fill={tone.nailTipColor}
        />
        {/* 5. Glossy Specular Light Reflection Arc */}
        <path
          d="M 8 453 C 14 450, 18 456, 17 467"
          stroke="#ffffff"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
      </g>

      {/* ==================== FOUR FINGERTIPS (Resting on Opposite Bezel Edge) ==================== */}
      {/* 1. INDEX FINGERTIP (y: 334 to 368) */}
      <g filter="url(#fingertip-glass-shadow)">
        <path
          d={`M ${pw} 334 C ${pw - 16} 335, ${pw - 26} 344, ${pw - 24} 354 C ${pw - 22} 364, ${pw - 12} 368, ${pw} 366 Z`}
          fill={`url(#tip-pad-${skinToneId})`}
          stroke={tone.shadowColor}
          strokeWidth="0.75"
        />
        {/* Profile Fingernail Plate */}
        <path
          d={`M ${pw - 9} 338 C ${pw - 19} 341, ${pw - 20} 350, ${pw - 11} 355 C ${pw - 7} 352, ${pw - 5} 344, ${pw - 9} 338 Z`}
          fill={`url(#nail-bed-${skinToneId})`}
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="0.4"
        />
        <path
          d={`M ${pw - 12} 341 C ${pw - 18} 344, ${pw - 17} 349, ${pw - 13} 353`}
          stroke="#ffffff"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
      </g>

      {/* 2. MIDDLE FINGERTIP (y: 408 to 446) */}
      <g filter="url(#fingertip-glass-shadow)">
        <path
          d={`M ${pw} 408 C ${pw - 18} 410, ${pw - 28} 420, ${pw - 26} 432 C ${pw - 24} 442, ${pw - 12} 446, ${pw} 444 Z`}
          fill={`url(#tip-pad-${skinToneId})`}
          stroke={tone.shadowColor}
          strokeWidth="0.75"
        />
        <path
          d={`M ${pw - 10} 413 C ${pw - 21} 416, ${pw - 22} 427, ${pw - 12} 433 C ${pw - 8} 430, ${pw - 6} 420, ${pw - 10} 413 Z`}
          fill={`url(#nail-bed-${skinToneId})`}
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="0.4"
        />
        <path
          d={`M ${pw - 14} 416 C ${pw - 20} 420, ${pw - 20} 426, ${pw - 15} 430`}
          stroke="#ffffff"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
      </g>

      {/* 3. RING FINGERTIP (y: 485 to 522) */}
      <g filter="url(#fingertip-glass-shadow)">
        <path
          d={`M ${pw} 485 C ${pw - 16} 487, ${pw - 26} 496, ${pw - 24} 506 C ${pw - 22} 516, ${pw - 12} 520, ${pw} 518 Z`}
          fill={`url(#tip-pad-${skinToneId})`}
          stroke={tone.shadowColor}
          strokeWidth="0.75"
        />
        <path
          d={`M ${pw - 9} 490 C ${pw - 19} 493, ${pw - 20} 502, ${pw - 11} 507 C ${pw - 7} 504, ${pw - 5} 496, ${pw - 9} 490 Z`}
          fill={`url(#nail-bed-${skinToneId})`}
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="0.4"
        />
        <path
          d={`M ${pw - 12} 492 C ${pw - 18} 495, ${pw - 18} 500, ${pw - 13} 504`}
          stroke="#ffffff"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
      </g>

      {/* 4. LITTLE FINGERTIP (Pinky - y: 558 to 590) */}
      <g filter="url(#fingertip-glass-shadow)">
        <path
          d={`M ${pw} 558 C ${pw - 14} 560, ${pw - 22} 568, ${pw - 20} 576 C ${pw - 18} 584, ${pw - 10} 588, ${pw} 586 Z`}
          fill={`url(#tip-pad-${skinToneId})`}
          stroke={tone.shadowColor}
          strokeWidth="0.75"
        />
        <path
          d={`M ${pw - 7} 563 C ${pw - 16} 565, ${pw - 17} 573, ${pw - 9} 577 C ${pw - 5} 574, ${pw - 4} 568, ${pw - 7} 563 Z`}
          fill={`url(#nail-bed-${skinToneId})`}
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="0.4"
        />
        <path
          d={`M ${pw - 10} 565 C ${pw - 15} 568, ${pw - 14} 571, ${pw - 11} 574`}
          stroke="#ffffff"
          strokeWidth="1.0"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      </g>
    </g>
  );
}

// Front Layer: Anatomical Thumb Pad and Curving Fingertips Resting on Front Glass Bezel
export function HandFrontLayer({
  gender = 'male',
  skinToneId = 'honey',
  pose = 'left',
  phoneWidth = 340,
  phoneHeight = 700,
}) {
  const tone =
    HAND_SKIN_TONES.find((t) => t.id === skinToneId) || HAND_SKIN_TONES[0];
  const isLeft = pose === 'left' || pose === 'auto';
  const isRight = pose === 'right';
  const isTwoHanded = pose === 'two-handed';

  return (
    <svg
      className="absolute overflow-visible pointer-events-none select-none z-40"
      style={{
        width: `${phoneWidth}px`,
        height: `${phoneHeight}px`,
        left: 0,
        top: 0,
      }}
      viewBox={`0 0 ${phoneWidth} ${phoneHeight}`}
    >
      <defs>
        {/* Thumb Pad Fleshy Curvature Gradient */}
        <radialGradient
          id={`thumb-pad-${skinToneId}`}
          cx="30%"
          cy="35%"
          r="65%"
        >
          <stop offset="0%" stopColor={tone.highlightColor} />
          <stop offset="45%" stopColor={tone.baseColor} />
          <stop offset="78%" stopColor={tone.subsurfaceColor} />
          <stop offset="100%" stopColor={tone.shadowColor} />
        </radialGradient>

        {/* Fingertip Fleshy Pad Radial Gradient */}
        <radialGradient
          id={`tip-pad-${skinToneId}`}
          cx="35%"
          cy="40%"
          r="60%"
        >
          <stop offset="0%" stopColor={tone.highlightColor} />
          <stop offset="50%" stopColor={tone.baseColor} />
          <stop offset="80%" stopColor={tone.subsurfaceColor} />
          <stop offset="100%" stopColor={tone.shadowColor} />
        </radialGradient>

        {/* Realistic Translucent Keratin Nail Gradient */}
        <linearGradient
          id={`nail-bed-${skinToneId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={tone.nailBedColor} stopOpacity="0.88" />
          <stop offset="65%" stopColor={tone.nailBedColor} stopOpacity="0.95" />
          <stop offset="88%" stopColor={tone.nailTipColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.98" />
        </linearGradient>

        {/* Contact Occlusion Filter for Soft Shadow onto Glass Screen */}
        <filter id="glass-contact-shadow" x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow
            dx="2.5"
            dy="3.5"
            stdDeviation="3.2"
            floodColor="rgba(0, 0, 0, 0.6)"
          />
        </filter>

        <filter id="fingertip-glass-shadow" x="-45%" y="-35%" width="190%" height="170%">
          <feDropShadow
            dx="-2.2"
            dy="3"
            stdDeviation="2.8"
            floodColor="rgba(0, 0, 0, 0.55)"
          />
        </filter>
      </defs>

      {/* 1. LEFT HAND FRONT LAYER */}
      {(isLeft || isTwoHanded) && (
        <HandFrontGeometry
          tone={tone}
          gender={gender}
          phoneWidth={phoneWidth}
          phoneHeight={phoneHeight}
          isMirrored={false}
        />
      )}

      {/* 2. RIGHT HAND FRONT LAYER (100% Mathematically Exact Mirror across phoneWidth) */}
      {(isRight || isTwoHanded) && (
        <HandFrontGeometry
          tone={tone}
          gender={gender}
          phoneWidth={phoneWidth}
          phoneHeight={phoneHeight}
          isMirrored={true}
        />
      )}
    </svg>
  );
}
