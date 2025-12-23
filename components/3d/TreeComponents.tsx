import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../../constants';
import { getPineTreePoint, createStarShape, createDefaultTexture } from '../../utils/geometry';

export const TreeTrunk: React.FC<{ isFormed: boolean }> = ({ isFormed }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => { 
    if (!ref.current) return; 
    const targetScale = isFormed ? 1 : 0.01; 
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 1.5); 
  });
  return ( 
    <group ref={ref} position={[0, -8.5, 0]}> 
      <mesh receiveShadow castShadow> 
        <cylinderGeometry args={[1.0, 1.5, 7, 12]} /> 
        <meshStandardMaterial color="#2A1B0E" roughness={0.9} metalness={0.1} /> 
      </mesh> 
    </group> 
  );
};

export const GiftBoxes: React.FC<{ isFormed: boolean }> = ({ isFormed }) => {
  const groupRef = useRef<THREE.Group>(null);
  const gifts = useMemo(() => {
    const colors = ['#8a0a0a', '#003318', '#d4af37', '#c0c0c0'];
    return Array.from({ length: 14 }).map(() => {
      const scale = 0.6 + Math.random() * 0.6; 
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.0 + Math.random() * 3.5; 
      const x = Math.cos(angle) * radius; 
      const z = Math.sin(angle) * radius; 
      const y = -11.5 + scale/2; 
      return { 
        pos: new THREE.Vector3(x, y, z), 
        scale: new THREE.Vector3(scale, scale, scale), 
        color: colors[Math.floor(Math.random() * colors.length)], 
        rotation: new THREE.Euler(Math.random() * 0.2, Math.random() * Math.PI, Math.random() * 0.2) 
      };
    });
  }, []);

  useFrame((state, delta) => { 
    if (!groupRef.current) return; 
    const targetScale = isFormed ? 1 : 0.01; 
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2); 
  });

  return (
    <group ref={groupRef}>
      {gifts.map((gift, i) => (
        <group key={i} position={gift.pos} rotation={gift.rotation} scale={gift.scale}>
          <mesh castShadow receiveShadow> 
            <boxGeometry args={[1, 0.9, 1]} /> 
            <meshStandardMaterial color={gift.color} roughness={0.4} metalness={0.2} /> 
          </mesh>
          <mesh position={[0, 0.46, 0]} castShadow> 
            <boxGeometry args={[1.02, 0.05, 0.2]} /> 
            <meshStandardMaterial color="#FFD700" roughness={0.3} metalness={0.8} /> 
          </mesh>
          <mesh position={[0, 0.46, 0]} castShadow> 
            <boxGeometry args={[0.2, 0.05, 1.02]} /> 
            <meshStandardMaterial color="#FFD700" roughness={0.3} metalness={0.8} /> 
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const CloudySnowFloor: React.FC<{ isFormed: boolean; isLightsOff: boolean }> = ({ isFormed, isLightsOff }) => {
  const count = 1500; 
  const spread = 12;
  const meshRef = useRef<THREE.InstancedMesh>(null); 
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const r = Math.pow(Math.random(), 0.6) * spread; 
      const theta = Math.random() * Math.PI * 2; 
      const x = r * Math.cos(theta); 
      const z = r * Math.sin(theta); 
      const heightOffset = Math.max(0, (spread * 0.15) - r * 0.2); 
      const y = -12.0 + Math.random() * 0.5 + heightOffset * 0.2; 
      const randomScale = 0.3 + Math.random() * 0.5;
      return { pos: [x,y,z] as [number, number, number], randomScale };
    });
  }, [count, spread]);

  useFrame((state, delta) => {
    if (!meshRef.current) return; 
    const formScale = isFormed ? 1 : 0.01;
    
    // Animate scale only if needed, otherwise could be static after formed.
    // Keeping it interactive for the "isFormed" transition.
    particles.forEach((p, i) => { 
      dummy.position.set(...p.pos); 
      const s = p.randomScale * 0.4 * formScale; 
      dummy.scale.set(s, s * 0.25, s); 
      dummy.updateMatrix(); 
      meshRef.current!.setMatrixAt(i, dummy.matrix); 
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    if(meshRef.current.material instanceof THREE.MeshStandardMaterial) { 
      const targetEmissive = isLightsOff ? 0.0 : 0.1; 
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(meshRef.current.material.emissiveIntensity, targetEmissive, delta * 2); 
    }
  });

  const geo = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);

  return ( 
    <group> 
      <instancedMesh ref={meshRef} args={[geo, undefined, count]} receiveShadow> 
        <meshStandardMaterial 
          color={THEME.snowColor} 
          emissive={THEME.snowColor} 
          emissiveIntensity={0.1} 
          roughness={1.0} 
          metalness={0.0} 
          transparent={true} 
          opacity={0.85} 
        /> 
      </instancedMesh> 
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -12.1, 0]} receiveShadow> 
        <circleGeometry args={[spread + 2, 32]} /> 
        <meshBasicMaterial color="#000000" transparent opacity={0.5} blending={THREE.MultiplyBlending} /> 
      </mesh> 
    </group> 
  );
};

export const StarTopper: React.FC<{ isFormed: boolean; color: string; isLightsOff: boolean }> = ({ isFormed, color, isLightsOff }) => {
  const ref = useRef<THREE.Group>(null);
  const chaosPos = useMemo(() => new THREE.Vector3(0, 50, 0), []); 
  const geometry = useMemo(() => { 
    const shape = createStarShape(1.3); 
    return new THREE.ExtrudeGeometry(shape, { depth: 0.4, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }); 
  }, []);
  
  useFrame((state, delta) => {
    if(!ref.current) return;
    const targetPos = isFormed ? new THREE.Vector3(0, 11.2, 0) : chaosPos; 
    ref.current.position.lerp(targetPos, delta * 1.5);
    const targetScaleVal = isFormed ? 1.0 : 0.8;
    ref.current.scale.lerp(new THREE.Vector3(targetScaleVal, targetScaleVal, targetScaleVal), delta * 2);
    ref.current.rotation.y += delta * 0.5; 
    
    const mesh = ref.current.children[0] as THREE.Mesh;
    if (mesh && mesh.material instanceof THREE.MeshStandardMaterial) {
       const targetEmissive = isLightsOff ? 0.2 : 2.0; 
       mesh.material.emissiveIntensity = THREE.MathUtils.lerp(mesh.material.emissiveIntensity, targetEmissive, delta * 2);
    }
  });

  return (
    <group ref={ref}>
      <mesh geometry={geometry}> 
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.0} toneMapped={false} /> 
      </mesh>
      <pointLight distance={15} intensity={isLightsOff ? 5 : 50} color={color} />
    </group>
  );
};

interface GeometricGroupProps {
  isFormed: boolean;
  type: string;
  color: string;
  geometry: THREE.BufferGeometry;
  count: number;
  scaleRange: [number, number];
  isLightsOff?: boolean;
  userIntensity?: number;
}

export const GeometricGroup: React.FC<GeometricGroupProps> = ({ isFormed, type, color, geometry, count, scaleRange, isLightsOff, userIntensity }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const t = Math.pow(Math.random(), 1.2); 
      const angle = Math.random() * Math.PI * 2; 
      let minR = 0.85, maxR = 1.15;
      if (type === 'TREE_BODY') { minR = 0.0; maxR = 0.85; }
      const rOffset = minR + Math.random() * (maxR - minR); 
      const point = getPineTreePoint(t, angle, rOffset); 
      const jitter = type === 'TREE_BODY' ? 0.3 : 0.2;
      point.x += (Math.random()-0.5) * jitter; 
      point.y += (Math.random()-0.5) * jitter; 
      point.z += (Math.random()-0.5) * jitter;
      
      arr.push({ 
        chaosPos: new THREE.Vector3((Math.random()-0.5)*60, (Math.random()-0.5)*60, (Math.random()-0.5)*60), 
        targetPos: point, 
        speed: (type === 'TREE_BODY' ? 1.0 : 1.5) * (0.8 + Math.random() * 0.4), 
        scale: scaleRange[0] + Math.random() * (scaleRange[1] - scaleRange[0]), 
        randomRot: new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI) 
      });
    }
    return arr;
  }, [count, type, scaleRange]);

  const progressRefs = useRef(new Float32Array(count).fill(0));
  
  useEffect(() => { 
    progressRefs.current = new Float32Array(count).fill(isFormed ? 1 : 0); 
  }, [count, isFormed]); // Reacting to isFormed changes via ref update if needed for jumps

  useFrame((state, delta) => {
    if (!meshRef.current) return; 
    
    items.forEach((item, i) => {
      const targetProgress = isFormed ? 1 : 0; 
      progressRefs.current[i] = THREE.MathUtils.lerp(progressRefs.current[i], targetProgress, delta * item.speed); 
      const p = progressRefs.current[i]; 
      const ease = p * p * (3 - 2 * p);
      
      dummy.position.lerpVectors(item.chaosPos, item.targetPos, ease); 
      let currentScale = item.scale; 
      if (type === 'TREE_BODY') currentScale = item.scale * (0.5 + 0.5 * ease); 
      dummy.scale.setScalar(currentScale);
      
      if (p < 0.9) { 
        const rotTime = state.clock.elapsedTime * 2; 
        dummy.rotation.set(rotTime + i, rotTime + i, 0); 
      } else { 
        dummy.rotation.copy(item.randomRot); 
        dummy.rotation.y += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.02; 
      }
      
      dummy.updateMatrix(); 
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    const isGlowType = ['GLOW_WHITE', 'STAR_GOLD', 'GLOW_GREEN', 'GLOW_RED'].includes(type);
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial && isGlowType) {
       let defaultBase = 1.0; 
       if (type === 'GLOW_WHITE') defaultBase = 4.0; 
       else if (type === 'STAR_GOLD') defaultBase = 1.5; 
       else if (type === 'GLOW_GREEN') defaultBase = 2.5; 
       else if (type === 'GLOW_RED') defaultBase = 3.0;
       
       const baseIntensity = userIntensity || defaultBase; 
       const targetIntensity = isLightsOff ? 0.1 : baseIntensity;
       meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(meshRef.current.material.emissiveIntensity, targetIntensity, delta * 3);
    }
  });

  let roughness = 0.2, metalness = 0.8, emissiveIntensity = 0, toneMapped = true;
  if (type === 'GLOW_WHITE') { roughness = 0.9; metalness = 0.1; emissiveIntensity = userIntensity || 4.0; toneMapped = false; } 
  else if (type === 'STAR_GOLD') { roughness = 0.1; metalness = 1.0; emissiveIntensity = 1.5; toneMapped = false; }
  else if (type === 'GLOW_GREEN') { roughness = 0.2; metalness = 0.5; emissiveIntensity = 2.5; toneMapped = false; }
  else if (type === 'GLOW_RED') { roughness = 0.2; metalness = 0.5; emissiveIntensity = 3.0; toneMapped = false; }

  return ( 
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]} castShadow receiveShadow> 
      <meshStandardMaterial 
        color={color} 
        roughness={roughness} 
        metalness={metalness} 
        emissive={emissiveIntensity > 0 ? color : undefined} 
        emissiveIntensity={emissiveIntensity} 
        toneMapped={toneMapped} 
      /> 
    </instancedMesh> 
  );
};

const PhotoHanger: React.FC<{ texture: THREE.Texture }> = ({ texture }) => (
  <group>
    <mesh position={[0, -0.3, 0]}> 
      <cylinderGeometry args={[0.008, 0.008, 0.6]} /> 
      <meshStandardMaterial color="#FFD700" metalness={1} roughness={0} /> 
    </mesh>
    <group position={[0, -0.7, 0]}>
      <mesh position={[0, 0.12, 0]}> 
        <boxGeometry args={[0.1, 0.05, 0.02]} /> 
        <meshStandardMaterial color="#FFD700" /> 
      </mesh>
      <mesh position={[0, -0.15, -0.01]}> 
        <planeGeometry args={[1.1, 1.35]} /> 
        <meshStandardMaterial color="#fff" roughness={0.8} side={THREE.DoubleSide} /> 
      </mesh>
      <mesh position={[0, -0.05, 0]}> 
        <planeGeometry args={[1.0, 1.0]} /> 
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} /> 
      </mesh>
    </group>
  </group>
);

export const Polaroids: React.FC<{ isFormed: boolean; userTextures: THREE.Texture[] }> = ({ isFormed, userTextures }) => {
  const count = 80;
  const defaultTex = useMemo(() => createDefaultTexture(), []);
  
  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const t = Math.pow(Math.random(), 1.4); 
      const angle = Math.random() * Math.PI * 2; 
      const point = getPineTreePoint(t, angle, 2.0); 
      arr.push({ 
        chaosPos: new THREE.Vector3((Math.random()-0.5)*50, (Math.random()-0.5)*50, (Math.random()-0.5)*50), 
        targetPos: point 
      });
    }
    return arr;
  }, [count]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if(!groupRef.current) return;
    const targetP = isFormed ? 1 : 0;
    
    items.forEach((item, i) => {
      const wrapper = groupRef.current!.children[i]; 
      if(!wrapper) return;
      
      const currentP = wrapper.userData.p || 0;
      wrapper.userData.p = THREE.MathUtils.lerp(currentP, targetP, delta * 1.5);
      const p = wrapper.userData.p; 
      const ease = p * p * (3 - 2 * p);
      
      wrapper.position.lerpVectors(item.chaosPos, item.targetPos, ease); 
      wrapper.scale.setScalar(1); 
      wrapper.lookAt(0, wrapper.position.y, 0); 
      wrapper.rotateY(Math.PI); 
      
      const inner = wrapper.children[0];
      if (inner) { 
         const wind = Math.sin(state.clock.elapsedTime * 2 + i) * 0.1; 
         inner.rotation.x = (-0.4 + Math.abs(wind) * 0.3) * (p > 0.9 ? 1 : 0);
         inner.rotation.z = wind * 0.5 * (p > 0.9 ? 1 : 0); 
      }
    });
  });

  return ( 
    <group ref={groupRef}> 
      {items.map((item, i) => { 
        const tex = (userTextures && userTextures.length > 0) ? userTextures[i % userTextures.length] : defaultTex; 
        return ( 
          <group key={i}> 
            <PhotoHanger texture={tex} /> 
          </group> 
        ); 
      })} 
    </group> 
  );
};