'use client';

import { Component, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ErrorFallback from '@/components/ui/ErrorFallback';
import useWebGLSupport from '@/hooks/useWebGLSupport';
import useDevicePerformance from '@/hooks/useDevicePerformance';
import { DEFAULT_CAMERA_CONFIG, RENDERER_GL_CONFIG } from '@/lib/three';
import { cn } from '@/lib/utils';

class ThreeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          title="3D Viewport Fallback"
          description="The WebGL scene could not initialize cleanly. Standard page navigation remains active."
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }
    return this.props.children;
  }
}

export default function CanvasWrapper({
  children,
  camera = DEFAULT_CAMERA_CONFIG,
  className,
  heightClass = 'h-[420px] md:h-[520px]',
  frameloop = 'always',
  hud = null,
}) {
  const { supported } = useWebGLSupport();
  const perf = useDevicePerformance();
  const [contextLost, setContextLost] = useState(false);

  if (!supported || contextLost) {
    return (
      <div
        className={cn(
          'r90-canvas-shell flex items-center justify-center p-6',
          heightClass,
          className
        )}
      >
        <ErrorFallback
          title={contextLost ? 'WebGL Context Lost' : 'WebGL Unavailable'}
          description="Your browser or hardware profile has WebGL disabled. RIVALRY 90 degrades gracefully to 2D showcase mode."
          onRetry={() => setContextLost(false)}
        />
      </div>
    );
  }

  return (
    <ThreeErrorBoundary>
      <div className={cn('r90-canvas-shell', heightClass, className)}>
        <Suspense
          fallback={
            <LoadingScreen label="Initializing 3D Stadium Canvas..." className="h-full border-0" />
          }
        >
          <Canvas
            shadows={perf.shadows}
            dpr={perf.dpr}
            camera={camera}
            gl={RENDERER_GL_CONFIG}
            frameloop={frameloop}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener(
                'webglcontextlost',
                (event) => {
                  event.preventDefault();
                  setContextLost(true);
                },
                false
              );
            }}
          >
            <color attach="background" args={['#090d10']} />
            <fog attach="fog" args={['#090d10', 22, 78]} />
            {children}
          </Canvas>
        </Suspense>
        {hud ? <div className="r90-canvas-hud">{hud}</div> : null}
      </div>
    </ThreeErrorBoundary>
  );
}
