/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export const cursorConfig = {
  // DOM cursor size (px) — matches SVG viewBox
  size: 32,
  // Physics smoothing (0 = instant, 1 = frozen)
  positionSmoothing: 0.22,
  rotationSmoothing: 0.18,
  // Minimum speed to update rotation direction (px/frame)
  minVelocity: 0.5,
  // Base rotation offset: the SVG path points roughly to top-left (-131 degrees),
  // so we add +131° to align the tip with the 0° (right) velocity vector.
  // We'll use 131 to perfectly align our specific asymmetric shape.
  baseRotationOffset: 131,
  // Trail
  trail: {
    maxLength: 4,
    minSpeed: 2,
    opacityMultiplier: 0.45,
    scaleStep: 0.15,
  },
  // Glitch
  glitch: {
    maxFragments: 4,
    highSpeedFragments: 12,
  },
  // Decelerate fragments
  decelerate: {
    threshold: -3,
    minSpeed: 4,
    fragmentCount: 4,
  },
  // Click impact
  click: {
    decay: 0.65,
    shatterCount: 4,
    maxExpansion: 25,
  },
  // Interaction States
  hover: {
    scale: 1.12,
  },
  
  maxSpeedForEnergy: 35, // Normalizes energy clamp
};
