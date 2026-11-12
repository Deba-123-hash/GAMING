'use client';

/**
 * Declarative waypoint definitions for future GSAP ScrollTrigger -> CameraRig interpolation.
 */
export const CAMERA_WAYPOINTS = [
  { id: 'aerial', label: '01 Aerial Stadium Reveal', position: [0, 26, 36], target: [0, 0, 0] },
  { id: 'bowl', label: '02 Bowl Descent', position: [14, 12, 22], target: [0, 1, 0] },
  { id: 'tunnel', label: '03 Tunnel Entrance', position: [0, 2.2, 16], target: [0, 1.5, 0] },
  {
    id: 'player',
    label: '04 Player Center Circle',
    position: [3.2, 2.1, 6.2],
    target: [0, 1.1, 0],
  },
  { id: 'tactical', label: '05 Tactical Top-Down', position: [0, 22, 4], target: [0, 0, 0] },
];

export default function CameraAnimation({ children }) {
  return children || null;
}
