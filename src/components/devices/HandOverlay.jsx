import React from 'react';
import { HAND_SKIN_TONES } from '../../data/devicePresets';

// High-Fidelity Photorealistic Human Hand Overlay for 3D Device Studio
// Features Multi-Layer Subsurface Scattering, Natural Keratin Fingernails, Fleshy Knuckle Folds, and Volumetric 3D Rails

export function HandBackLayer({
  gender = 'male',
  skinToneId = 'honey',
  pose = 'left',
  phoneWidth = 340,
  phoneHeight = 700,
}) {
  const tone =
    HAND_SKIN_TONES.find((t) => t.id === skinToneId) || HAND_SKIN_TONES[0];
  const isFemale = gender === 'female';
  const isLeft = pose === 'left' || pose === 'auto';
  const isRight = pose === 'right';
  const isTwoHanded = pose === 'two-handed';

  const scaleFactor = isFemale ? 0.94 : 1.0;
  const dx = phoneWidth - 340;

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
        {/* Forearm & Wrist Multi-stop Photorealistic Gradient with Atmospheric Fade */}
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

        {/* Forearm Cylindrical Muscle Shading */}
        <linearGradient
          id={`arm-cyl-${skinToneId}`}
          x1="0%"
          y1="50%"
          x2="100%"
          y2="50%"
        >
          <stop offset="0%" stopColor={tone.shadowColor} stopOpacity="0.9" />
          <stop offset="35%" stopColor={tone.baseColor} stopOpacity="1" />
          <stop offset="70%" stopColor={tone.highlightColor} stopOpacity="1" />
          <stop offset="100%" stopColor={tone.subsurfaceColor} stopOpacity="0.95" />
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
        <g
          className="transition-all duration-300"
          style={{
            transformOrigin: 'bottom left',
            transform: `scale(${scaleFactor})`,
          }}
        >
          {/* Deep Ambient Occlusion Shadow cast by phone onto palm */}
          <ellipse
            cx="170"
            cy="520"
            rx="145"
            ry="110"
            fill={`url(#contact-shadow-${skinToneId})`}
          />

          {/* Forearm & Wrist (Atmospheric fade at bottom, realistic muscle contour) */}
          <path
            d="M -70 920 C -40 820, -5 740, 20 670 C 45 615, 80 580, 130 585 C 170 590, 185 640, 175 690 C 160 770, 170 840, 180 920 Z"
            fill={`url(#arm-grad-${skinToneId})`}
          />
          {/* Forearm tendon highlight */}
          <path
            d="M -15 880 C 15 800, 45 730, 75 665 C 90 635, 115 620, 140 625"
            stroke={tone.highlightColor}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            opacity="0.25"
          />

          {/* Main Palm & Thenar Eminence (Fleshy mound supporting phone) */}
          <path
            d="M 10 680 C -15 640, -35 590, -25 540 C -15 490, 30 480, 75 510 C 115 535, 145 560, 150 610 C 155 650, 120 685, 60 690 Z"
            fill={`url(#thenar-grad-${skinToneId})`}
          />

          {/* Four Rear Finger Shafts (Reaching smoothly behind phone to the right edge) */}
          <g transform={dx !== 0 ? `translate(${dx}, 0)` : undefined}>
          {/* Index Finger (Phalanx II) */}
          <g>
            <path
              d="M 140 435 C 190 380, 260 345, 342 334 L 342 368 C 265 382, 195 415, 148 465 Z"
              fill={`url(#finger-shaft-${skinToneId})`}
            />
            {/* Knuckle highlight bump */}
            <ellipse cx="240" cy="378" rx="28" ry="12" fill={tone.highlightColor} opacity="0.3" transform="rotate(-15 240 378)" />
          </g>

          {/* Middle Finger (Phalanx III - Primary Grip) */}
          <g>
            <path
              d="M 130 480 C 185 440, 260 415, 342 410 L 342 448 C 260 455, 185 478, 138 515 Z"
              fill={`url(#finger-shaft-${skinToneId})`}
            />
            <ellipse cx="245" cy="440" rx="30" ry="13" fill={tone.highlightColor} opacity="0.3" transform="rotate(-8 245 440)" />
          </g>

          {/* Ring Finger (Phalanx IV) */}
          <g>
            <path
              d="M 120 528 C 175 502, 255 490, 342 488 L 342 524 C 255 528, 175 542, 128 565 Z"
              fill={`url(#finger-shaft-${skinToneId})`}
            />
            <ellipse cx="240" cy="512" rx="26" ry="12" fill={tone.highlightColor} opacity="0.3" transform="rotate(-3 240 512)" />
          </g>

          {/* Little Finger (Pinky - Phalanx V) */}
          <g>
            <path
              d="M 110 572 C 165 565, 250 560, 342 562 L 342 594 C 250 594, 165 596, 118 608 Z"
              fill={`url(#finger-shaft-${skinToneId})`}
            />
            <ellipse cx="230" cy="580" rx="24" ry="11" fill={tone.highlightColor} opacity="0.25" />
          </g>
          </g>
        </g>
      )}

      {/* 2. RIGHT HAND BACK LAYER (Horizontally Mirrored) */}
      {(isRight || isTwoHanded) && (
        <g
          className="transition-all duration-300"
          style={{
            transformOrigin: 'bottom right',
            transform: `scale(${scaleFactor}) scaleX(-1) translateX(-${phoneWidth}px)`,
          }}
        >
          <ellipse
            cx="170"
            cy="520"
            rx="145"
            ry="110"
            fill={`url(#contact-shadow-${skinToneId})`}
          />
          <path
            d="M -70 920 C -40 820, -5 740, 20 670 C 45 615, 80 580, 130 585 C 170 590, 185 640, 175 690 C 160 770, 170 840, 180 920 Z"
            fill={`url(#arm-grad-${skinToneId})`}
          />
          <path
            d="M 10 680 C -15 640, -35 590, -25 540 C -15 490, 30 480, 75 510 C 115 535, 145 560, 150 610 C 155 650, 120 685, 60 690 Z"
            fill={`url(#thenar-grad-${skinToneId})`}
          />
          <path d="M 140 435 C 190 380, 260 345, 342 334 L 342 368 C 265 382, 195 415, 148 465 Z" fill={`url(#finger-shaft-${skinToneId})`} />
          <path d="M 130 480 C 185 440, 260 415, 342 410 L 342 448 C 260 455, 185 478, 138 515 Z" fill={`url(#finger-shaft-${skinToneId})`} />
          <path d="M 120 528 C 175 502, 255 490, 342 488 L 342 524 C 255 528, 175 542, 128 565 Z" fill={`url(#finger-shaft-${skinToneId})`} />
          <path d="M 110 572 C 165 565, 250 560, 342 562 L 342 594 C 250 594, 165 596, 118 608 Z" fill={`url(#finger-shaft-${skinToneId})`} />
        </g>
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

  const shouldRenderFingers = (side === 'right' && (isLeft || isTwoHanded)) || (side === 'left' && (isRight || isTwoHanded));
  const shouldRenderThumb = (side === 'left' && (isLeft || isTwoHanded)) || (side === 'right' && (isRight || isTwoHanded));

  if (!shouldRenderFingers && !shouldRenderThumb) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 4 Fingers Wrapping Over Side Rail */}
      {shouldRenderFingers && (
        <>
          {/* Index Wrap */}
          <div
            className="absolute left-0 w-full rounded-full shadow-md"
            style={{
              top: `${Math.max(0, 334 - radius)}px`,
              height: '34px',
              background: `linear-gradient(to bottom, ${tone.subsurfaceColor} 0%, ${tone.highlightColor} 30%, ${tone.baseColor} 70%, ${tone.shadowColor} 100%)`,
              boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -2px 3px ${tone.ambientColor}, 0 2px 5px rgba(0,0,0,0.4)`,
              borderTop: '1px solid rgba(255,255,255,0.3)',
              borderBottom: `1px solid ${tone.shadowColor}`,
            }}
          />

          {/* Middle Wrap */}
          <div
            className="absolute left-0 w-full rounded-full shadow-md"
            style={{
              top: `${Math.max(0, 410 - radius)}px`,
              height: '38px',
              background: `linear-gradient(to bottom, ${tone.subsurfaceColor} 0%, ${tone.highlightColor} 30%, ${tone.baseColor} 70%, ${tone.shadowColor} 100%)`,
              boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -2px 3px ${tone.ambientColor}, 0 2px 5px rgba(0,0,0,0.4)`,
              borderTop: '1px solid rgba(255,255,255,0.3)',
              borderBottom: `1px solid ${tone.shadowColor}`,
            }}
          />

          {/* Ring Wrap */}
          <div
            className="absolute left-0 w-full rounded-full shadow-md"
            style={{
              top: `${Math.max(0, 488 - radius)}px`,
              height: '36px',
              background: `linear-gradient(to bottom, ${tone.subsurfaceColor} 0%, ${tone.highlightColor} 30%, ${tone.baseColor} 70%, ${tone.shadowColor} 100%)`,
              boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -2px 3px ${tone.ambientColor}, 0 2px 5px rgba(0,0,0,0.4)`,
              borderTop: '1px solid rgba(255,255,255,0.3)',
              borderBottom: `1px solid ${tone.shadowColor}`,
            }}
          />

          {/* Pinky Wrap */}
          <div
            className="absolute left-0 w-full rounded-full shadow-md"
            style={{
              top: `${Math.max(0, 562 - radius)}px`,
              height: '32px',
              background: `linear-gradient(to bottom, ${tone.subsurfaceColor} 0%, ${tone.highlightColor} 30%, ${tone.baseColor} 70%, ${tone.shadowColor} 100%)`,
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
            top: `${Math.max(0, 465 - radius)}px`,
            height: '62px',
            background: `linear-gradient(to bottom, ${tone.subsurfaceColor} 0%, ${tone.highlightColor} 25%, ${tone.baseColor} 65%, ${tone.shadowColor} 100%)`,
            boxShadow: `inset 0 2px 3px rgba(255,255,255,0.35), inset 0 -3px 4px ${tone.ambientColor}, 0 3px 6px rgba(0,0,0,0.5)`,
          }}
        />
      )}
    </div>
  );
}

// Front Layer: High-Fidelity Anatomical Thumb Pad and Curving Fingertips Resting on Front Glass Bezel
export function HandFrontLayer({
  gender = 'male',
  skinToneId = 'honey',
  pose = 'left',
  phoneWidth = 340,
  phoneHeight = 700,
}) {
  const tone =
    HAND_SKIN_TONES.find((t) => t.id === skinToneId) || HAND_SKIN_TONES[0];
  const isFemale = gender === 'female';
  const isLeft = pose === 'left' || pose === 'auto';
  const isRight = pose === 'right';
  const isTwoHanded = pose === 'two-handed';

  const scaleFactor = isFemale ? 0.94 : 1.0;
  const dx = phoneWidth - 340;

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
        <filter id="glass-contact-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="3"
            dy="4"
            stdDeviation="3"
            floodColor="rgba(0, 0, 0, 0.65)"
          />
        </filter>

        <filter id="fingertip-glass-shadow" x="-40%" y="-30%" width="180%" height="160%">
          <feDropShadow
            dx="-2.5"
            dy="3"
            stdDeviation="2.8"
            floodColor="rgba(0, 0, 0, 0.6)"
          />
        </filter>
      </defs>

      {/* 1. LEFT HAND FRONT LAYER */}
      {(isLeft || isTwoHanded) && (
        <g
          className="transition-all duration-300"
          style={{
            transformOrigin: 'bottom left',
            transform: `scale(${scaleFactor})`,
          }}
        >
          {/* ==================== THE THUMB ==================== */}
          <g filter="url(#glass-contact-shadow)">
            {/* Thumb Metacarpal Muscle Cushion flowing from left rim */}
            <path
              d="M -30 600 C -15 560, -2 525, 6 495 C 12 470, 16 450, 4 445 C -8 440, -22 470, -32 510 Z"
              fill={tone.baseColor}
            />

            {/* Distal Thumb Pad Resting Gracefully on Left Glass Bezel */}
            <path
              d="M -6 446 C 8 440, 22 448, 22 472 C 22 494, 12 518, -4 530 C -16 520, -18 460, -6 446 Z"
              fill={`url(#thumb-pad-${skinToneId})`}
              stroke={tone.shadowColor}
              strokeWidth="0.75"
            />

            {/* Natural Keratin Fingernail */}
            <path
              d="M 5 452 C 14 448, 18 456, 17 470 C 15 478, 8 476, 5 468 Z"
              fill={`url(#nail-bed-${skinToneId})`}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="0.5"
            />
            {/* White Half-Moon Lunula at base of thumb nail */}
            <path
              d="M 6 453 C 9 451, 13 453, 14 457 C 11 458, 8 457, 6 453 Z"
              fill="rgba(255, 255, 255, 0.6)"
            />
            {/* Glossy Specular Nail Reflection Arc */}
            <path
              d="M 8 454 C 13 451, 16 456, 15 466"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />

            {/* Subtle Skin Joint Creases (Interphalangeal fold) */}
            <path
              d="M 0 500 C 6 496, 12 499, 16 504"
              stroke={tone.creaseColor || tone.shadowColor}
              strokeWidth="0.9"
              strokeLinecap="round"
              fill="none"
              opacity="0.45"
            />
            <path
              d="M -2 506 C 5 503, 11 506, 15 510"
              stroke={tone.creaseColor || tone.shadowColor}
              strokeWidth="0.7"
              strokeLinecap="round"
              fill="none"
              opacity="0.35"
            />
          </g>

          {/* ==================== 4 FINGERTIPS CURVING OVER RIGHT BEZEL ==================== */}
          <g transform={dx !== 0 ? `translate(${dx}, 0)` : undefined}>
          {/* 1. INDEX FINGERTIP (y: 334 to 368) */}
          <g filter="url(#fingertip-glass-shadow)">
            {/* Fleshy Pad */}
            <path
              d="M 342 334 C 328 335, 318 344, 320 354 C 322 364, 332 368, 342 366 Z"
              fill={`url(#tip-pad-${skinToneId})`}
              stroke={tone.shadowColor}
              strokeWidth="0.7"
            />
            {/* Fingernail Plate */}
            <path
              d="M 334 337 C 324 340, 323 350, 332 355 C 336 352, 338 343, 334 337 Z"
              fill={`url(#nail-bed-${skinToneId})`}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.4"
            />
            {/* Nail Gloss highlight */}
            <path
              d="M 331 340 C 325 343, 326 348, 330 352"
              stroke="#ffffff"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </g>

          {/* 2. MIDDLE FINGERTIP (y: 410 to 448) */}
          <g filter="url(#fingertip-glass-shadow)">
            <path
              d="M 342 410 C 326 412, 314 422, 316 434 C 318 444, 330 448, 342 446 Z"
              fill={`url(#tip-pad-${skinToneId})`}
              stroke={tone.shadowColor}
              strokeWidth="0.7"
            />
            <path
              d="M 333 414 C 321 418, 320 429, 330 435 C 335 431, 337 421, 333 414 Z"
              fill={`url(#nail-bed-${skinToneId})`}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.4"
            />
            <path
              d="M 329 417 C 323 421, 323 427, 328 431"
              stroke="#ffffff"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </g>

          {/* 3. RING FINGERTIP (y: 488 to 524) */}
          <g filter="url(#fingertip-glass-shadow)">
            <path
              d="M 342 488 C 328 490, 318 498, 320 508 C 322 518, 332 522, 342 520 Z"
              fill={`url(#tip-pad-${skinToneId})`}
              stroke={tone.shadowColor}
              strokeWidth="0.7"
            />
            <path
              d="M 334 492 C 324 495, 323 504, 332 509 C 336 506, 338 498, 334 492 Z"
              fill={`url(#nail-bed-${skinToneId})`}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.4"
            />
            <path
              d="M 331 494 C 325 497, 326 502, 330 506"
              stroke="#ffffff"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </g>

          {/* 4. LITTLE FINGERTIP (PINKY - y: 562 to 594) */}
          <g filter="url(#fingertip-glass-shadow)">
            <path
              d="M 342 562 C 330 564, 322 572, 324 580 C 326 588, 334 592, 342 590 Z"
              fill={`url(#tip-pad-${skinToneId})`}
              stroke={tone.shadowColor}
              strokeWidth="0.7"
            />
            <path
              d="M 336 566 C 327 568, 326 576, 334 580 C 338 577, 339 571, 336 566 Z"
              fill={`url(#nail-bed-${skinToneId})`}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.4"
            />
            <path
              d="M 333 568 C 328 571, 329 574, 332 577"
              stroke="#ffffff"
              strokeWidth="1.0"
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
            />
          </g>
          </g>
        </g>
      )}

      {/* 2. RIGHT HAND FRONT LAYER (Horizontally Mirrored) */}
      {(isRight || isTwoHanded) && (
        <g
          className="transition-all duration-300"
          style={{
            transformOrigin: 'bottom right',
            transform: `scale(${scaleFactor}) scaleX(-1) translateX(-${phoneWidth}px)`,
          }}
        >
          {/* Thumb */}
          <g filter="url(#glass-contact-shadow)">
            <path d="M -30 600 C -15 560, -2 525, 6 495 C 12 470, 16 450, 4 445 C -8 440, -22 470, -32 510 Z" fill={tone.baseColor} />
            <path d="M -6 446 C 8 440, 22 448, 22 472 C 22 494, 12 518, -4 530 C -16 520, -18 460, -6 446 Z" fill={`url(#thumb-pad-${skinToneId})`} stroke={tone.shadowColor} strokeWidth="0.75" />
            <path d="M 5 452 C 14 448, 18 456, 17 470 C 15 478, 8 476, 5 468 Z" fill={`url(#nail-bed-${skinToneId})`} stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" />
            <path d="M 6 453 C 9 451, 13 453, 14 457 C 11 458, 8 457, 6 453 Z" fill="rgba(255, 255, 255, 0.6)" />
            <path d="M 8 454 C 13 451, 16 456, 15 466" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.75" />
          </g>
          {/* 4 Fingertips */}
          <g filter="url(#fingertip-glass-shadow)">
            <path d="M 342 334 C 328 335, 318 344, 320 354 C 322 364, 332 368, 342 366 Z" fill={`url(#tip-pad-${skinToneId})`} stroke={tone.shadowColor} strokeWidth="0.7" />
            <path d="M 334 337 C 324 340, 323 350, 332 355 C 336 352, 338 343, 334 337 Z" fill={`url(#nail-bed-${skinToneId})`} />
          </g>
          <g filter="url(#fingertip-glass-shadow)">
            <path d="M 342 410 C 326 412, 314 422, 316 434 C 318 444, 330 448, 342 446 Z" fill={`url(#tip-pad-${skinToneId})`} stroke={tone.shadowColor} strokeWidth="0.7" />
            <path d="M 333 414 C 321 418, 320 429, 330 435 C 335 431, 337 421, 333 414 Z" fill={`url(#nail-bed-${skinToneId})`} />
          </g>
          <g filter="url(#fingertip-glass-shadow)">
            <path d="M 342 488 C 328 490, 318 498, 320 508 C 322 518, 332 522, 342 520 Z" fill={`url(#tip-pad-${skinToneId})`} stroke={tone.shadowColor} strokeWidth="0.7" />
            <path d="M 334 492 C 324 495, 323 504, 332 509 C 336 506, 338 498, 334 492 Z" fill={`url(#nail-bed-${skinToneId})`} />
          </g>
          <g filter="url(#fingertip-glass-shadow)">
            <path d="M 342 562 C 330 564, 322 572, 324 580 C 326 588, 334 592, 342 590 Z" fill={`url(#tip-pad-${skinToneId})`} stroke={tone.shadowColor} strokeWidth="0.7" />
            <path d="M 336 566 C 327 568, 326 576, 334 580 C 338 577, 339 571, 336 566 Z" fill={`url(#nail-bed-${skinToneId})`} />
          </g>
        </g>
      )}
    </svg>
  );
}
