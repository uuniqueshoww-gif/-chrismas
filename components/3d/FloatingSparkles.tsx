import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FloatingSparkles: React.FC<{ isFormed: boolean }> = ({ isFormed }) => {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => 
    Array.from({ length: count }).map(() => ({
      basePos: new THREE.Vector3((Math.random() - 0.5) * 25, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 25),
      speed: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      scale: 0.05 + Math.random() * 0.1
    })), 
  []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Only show sparkles when formed (or animate opacity)
    if (!isFormed) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;
    
    const time = state.clock.elapsedTime;
    
    particles.forEach((p, i) => {
      dummy.position.copy(p.basePos);
      dummy.position.y += Math.sin(time * p.speed + p.phase) * 2.0;
      dummy.position.x += Math.cos(time * p.speed * 0.5 + p.phase) * 1.0;
      
      const sparkle = Math.sin(time * 3.0 + p.phase) * 0.5 + 0.5;
      dummy.scale.setScalar(p.scale * sparkle);
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const geo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  return (
    <instancedMesh ref={meshRef} args={[geo, undefined, count]}>
      <meshBasicMaterial 
        color="#FFD700" 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
        side={THREE.DoubleSide} 
      />
    </instancedMesh>
  );
};