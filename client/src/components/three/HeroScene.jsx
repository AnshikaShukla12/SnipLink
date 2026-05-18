import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import LinkParticles from './LinkParticles';

/**
 * 3D Floating Orb Component.
 * Animates a glassmorphic mesh sphere drifting gently in 3D orbit.
 */
function FloatingOrb({ position, color, scale = 1 }) {
  const mesh = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Drifts Orb along sinusoidal waves
    mesh.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 0.4;
    mesh.current.position.x = position[0] + Math.cos(time * 0.3 + position[1]) * 0.3;
  });

  return (
    <Float speed={1.5} floatIntensity={0.8}>
      <mesh ref={mesh} position={position} scale={scale}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          transparent
          opacity={0.55}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

/**
 * Primary Hero Scene R3F Canvas.
 * Anchors the background starfields, floating color orbs, and link network points.
 */
export default function HeroScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        {/* Lights Setup */}
        <ambientLight intensity={0.25} />
        <pointLight position={[10, 10, 10]} intensity={0.55} color="#6366f1" />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#ec4899" />

        {/* Modular Dynamic Points Connection Network */}
        <LinkParticles count={90} maxDistance={3.2} />

        {/* floating glassmorphic blobs */}
        <FloatingOrb position={[-3, 2, -2]} color="#6366f1" scale={1.2} />
        <FloatingOrb position={[4, -1, -3]} color="#ec4899" scale={0.8} />
        <FloatingOrb position={[1.5, 2.5, -4]} color="#818cf8" scale={1} />
        <FloatingOrb position={[-2.5, -2, -1]} color="#f472b6" scale={0.65} />

        {/* Ambient starry backdrop */}
        <Stars
          radius={100}
          depth={50}
          count={800}
          factor={3.5}
          saturation={0}
          fade
          speed={0.4}
        />
      </Canvas>
    </div>
  );
}
