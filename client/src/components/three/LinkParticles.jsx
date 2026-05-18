import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Advanced React Three Fiber Point & Connection Network.
 * Renders nodes (URLs) and connection linkages that float and breathe dynamically.
 */
export default function LinkParticles({ count = 80, maxDistance = 3.5 }) {
  const pointsRef = useRef();
  const linesRef = useRef();

  // 1. Initialize random 3D velocities and coordinates for each particle node
  const { positions, velocities, originalPositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Scatter nodes in a central spherical cloud
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2 + Math.random() * 4;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = orig[i * 3] = x;
      pos[i * 3 + 1] = orig[i * 3 + 1] = y;
      pos[i * 3 + 2] = orig[i * 3 + 2] = z;

      // Small movement velocities
      vels[i * 3] = (Math.random() - 0.5) * 0.005;
      vels[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    return {
      positions: pos,
      velocities: vels,
      originalPositions: orig,
    };
  }, [count]);

  // 2. Perform frame-by-frame simulation updates (floating and dynamic link computation)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const linePosAttr = linesRef.current.geometry.attributes.position;

    const linePoints = [];

    // Float each particle gently in space using its velocity + wave equations
    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      // Gentle wave float (breathing effect)
      posAttr.array[idx] = originalPositions[idx] + Math.sin(time * 0.2 + originalPositions[idx]) * 0.4;
      posAttr.array[idx + 1] = originalPositions[idx + 1] + Math.cos(time * 0.15 + originalPositions[idx + 1]) * 0.4;
      posAttr.array[idx + 2] = originalPositions[idx + 2] + Math.sin(time * 0.25 + originalPositions[idx + 2]) * 0.4;

      // Rotate nodes slightly based on frame time
      posAttr.array[idx] += velocities[idx];
      posAttr.array[idx + 1] += velocities[idx + 1];
      posAttr.array[idx + 2] += velocities[idx + 2];
    }

    posAttr.needsUpdate = true;

    // 3. Compute connection lines on the fly between nodes within `maxDistance`
    for (let i = 0; i < count; i++) {
      const idxI = i * 3;
      const xi = posAttr.array[idxI];
      const yi = posAttr.array[idxI + 1];
      const zi = posAttr.array[idxI + 2];

      for (let j = i + 1; j < count; j++) {
        const idxJ = j * 3;
        const xj = posAttr.array[idxJ];
        const yj = posAttr.array[idxJ + 1];
        const zj = posAttr.array[idxJ + 2];

        // Core distance formula
        const dist = Math.sqrt((xi - xj) ** 2 + (yi - yj) ** 2 + (zi - zj) ** 2);

        if (dist < maxDistance) {
          // If close enough, push both 3D points to compile a connection segment
          linePoints.push(xi, yi, zi, xj, yj, zj);
        }
      }
    }

    // 4. Update the lines attribute buffer dynamically
    // Map array values manually into Float32Array buffer
    const limit = Math.min(linePoints.length, 3000); // Caps line segments to avoid memory spike
    for (let k = 0; k < limit; k++) {
      linePosAttr.array[k] = linePoints[k];
    }

    // Set trailing unused indexes to 0
    for (let k = limit; k < linePosAttr.array.length; k++) {
      linePosAttr.array[k] = 0;
    }

    linePosAttr.needsUpdate = true;

    // Gently rotate the entire network system
    pointsRef.current.rotation.y = time * 0.015;
    linesRef.current.rotation.y = time * 0.015;
  });

  // Pre-compiled arrays to size buffers to fixed memory length for performance
  const lineBufferArray = useMemo(() => new Float32Array(3000), []);

  return (
    <group>
      {/* 3D Node points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#a5b4fc"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Dynamic connecting segments */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1000} // Allocates buffer block for 1000 lines
            array={lineBufferArray}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.18}
          linewidth={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
