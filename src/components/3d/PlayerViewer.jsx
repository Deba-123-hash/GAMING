'use client';

import { Pause, Play, RotateCcw, RotateCw } from 'lucide-react';
import CanvasWrapper from '@/components/3d/CanvasWrapper';
import Lighting from '@/components/3d/Lighting';
import Environment from '@/components/3d/Environment';
import CameraRig from '@/components/3d/CameraRig';
import PlayerModel from '@/components/3d/PlayerModel';
import Football from '@/components/3d/Football';
import Badge from '@/components/ui/Badge';
import { PLAYER_CAMERA_PRESETS, useThreeDStore } from '@/stores/threeDStore';
import { cn } from '@/lib/utils';

export default function PlayerViewer({
  playerName = 'Kai Vance',
  kitColor = '#c6ff3d',
  activeAnimation = 'idle',
  heightClass = 'h-[360px] md:h-[440px]',
}) {
  const cameraPreset = useThreeDStore((state) => state.cameraPreset);
  const isPlaying = useThreeDStore((state) => state.isPlaying);
  const rotationOffset = useThreeDStore((state) => state.rotationOffset);
  const setCameraPreset = useThreeDStore((state) => state.setCameraPreset);
  const togglePlayback = useThreeDStore((state) => state.togglePlayback);
  const rotateBy = useThreeDStore((state) => state.rotateBy);
  const resetViewer = useThreeDStore((state) => state.resetViewer);

  const preset = PLAYER_CAMERA_PRESETS[cameraPreset] || PLAYER_CAMERA_PRESETS['full-body'];
  const effectiveClip = isPlaying ? activeAnimation : 'idle';

  return (
    <div className="space-y-3">
      <CanvasWrapper
        heightClass={heightClass}
        camera={{ position: preset.position, fov: 42 }}
        hud={
          <div className="flex items-center justify-between gap-2">
            <Badge tone="lime">{playerName} (Stand-In)</Badge>
            <Badge tone="neutral">
              {preset.label} · {isPlaying ? effectiveClip : 'Paused'}
            </Badge>
          </div>
        }
      >
        <Environment backgroundColor="#080b09" />
        <Lighting enableShadows />
        <CameraRig
          target={preset.target}
          minDistance={2}
          maxDistance={8}
          autoRotate={isPlaying}
          autoRotateSpeed={0.75}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[3.5, 48]} />
          <meshStandardMaterial color="#0e1f18" roughness={0.85} />
        </mesh>
        <group rotation={[0, rotationOffset, 0]}>
          <PlayerModel position={[0, 0, 0]} kitColor={kitColor} activeAnimation={effectiveClip} />
        </group>
        <Football position={[0.75, 0.32, 0.5]} spin={isPlaying} />
      </CanvasWrapper>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#29342d] bg-[#151d18] p-2.5">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(PLAYER_CAMERA_PRESETS).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCameraPreset(key)}
              className={cn(
                'rounded px-2.5 py-1 font-mono text-[11px] uppercase transition-colors',
                cameraPreset === key
                  ? 'bg-[#c6ff3d] font-bold text-[#080b09]'
                  : 'bg-[#080b09] text-[#9ba69d] hover:text-[#f5f7f2]'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => rotateBy(-0.45)}
            aria-label="Rotate player left"
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#29342d] bg-[#080b09] text-[#f5f7f2] hover:border-[#c6ff3d]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => rotateBy(0.45)}
            aria-label="Rotate player right"
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#29342d] bg-[#080b09] text-[#f5f7f2] hover:border-[#c6ff3d]"
          >
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pause player animation' : 'Play player animation'}
            className="inline-flex h-8 items-center gap-1 rounded border border-[#29342d] bg-[#080b09] px-2.5 font-mono text-[11px] uppercase text-[#c6ff3d] hover:border-[#c6ff3d]"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={resetViewer}
            aria-label="Reset 3D viewer camera"
            className="inline-flex h-8 items-center rounded border border-[#29342d] bg-[#080b09] px-2.5 font-mono text-[11px] uppercase text-[#9ba69d] hover:text-[#f5f7f2]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
