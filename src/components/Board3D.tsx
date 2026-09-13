import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BoardTile, CharacterArchetype } from '../types';
import { Board2D } from './Board2D';

interface Board3DProps {
  innerTiles: BoardTile[];
  outerTiles: BoardTile[];
  playerIndex: number;
  isOnFastTrack: boolean;
  archetype: CharacterArchetype;
  isMoving: boolean;
  diceValue: number[];
  isRolling: boolean;
  onTileClick?: (tile: BoardTile) => void;
  cameraMode: 'isometric' | 'topdown' | 'follow';
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const Board3D: React.FC<Board3DProps> = (props) => {
  const {
    innerTiles,
    outerTiles,
    playerIndex,
    isOnFastTrack,
    archetype,
    isMoving,
    diceValue,
    isRolling,
    onTileClick,
    cameraMode,
  } = props;

  const [webGLFailed, setWebGLFailed] = useState<boolean>(!checkWebGLSupport());
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pawnRef = useRef<THREE.Group | null>(null);
  const diceGroupRef = useRef<THREE.Group | null>(null);
  const tilesMapRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const hoveredTileIdRef = useRef<number | null>(null);

  // Pawn animation state
  const pawnPosRef = useRef({ x: 0, y: 0.8, z: 0, targetX: 0, targetY: 0.8, targetZ: 0 });
  const isJumpingRef = useRef(false);
  const jumpTimeRef = useRef(0);

  // Camera target
  const targetCamPosRef = useRef(new THREE.Vector3(0, 32, 28));
  const targetCamLookRef = useRef(new THREE.Vector3(0, 0, 0));

  // Initialize Three.js Scene
  useEffect(() => {
    if (webGLFailed || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'default' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to 2.5D Canvas Board:', err);
      setWebGLFailed(true);
      return;
    }

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.015);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 32, 28);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f2fe, 1.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 2.5, 60);
    purpleLight.position.set(-15, 12, -15);
    scene.add(purpleLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 2.5, 60);
    goldLight.position.set(15, 15, 15);
    scene.add(goldLight);

    // Cyber Grid Floor
    const gridHelper = new THREE.GridHelper(90, 45, 0x00f2fe, 0x1e293b);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    // Glowing Center Ring Core
    const ringGeo = new THREE.RingGeometry(5.8, 6.2, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, side: THREE.DoubleSide });
    const centerRing = new THREE.Mesh(ringGeo, ringMat);
    centerRing.rotation.x = -Math.PI / 2;
    centerRing.position.y = 0.05;
    scene.add(centerRing);

    // Starfield Background Particles
    const starGeo = new THREE.BufferGeometry();
    const starCount = 450;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 160;
      starPositions[i + 1] = Math.random() * 60 + 5;
      starPositions[i + 2] = (Math.random() - 0.5) * 160;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.8, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Holographic City Monoliths in Background
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const dist = 36 + Math.random() * 12;
      const bHeight = 12 + Math.random() * 24;
      const bWidth = 2 + Math.random() * 3;
      const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bWidth);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: Math.random() > 0.6,
      });
      const building = new THREE.Mesh(bGeo, bMat);
      building.position.set(Math.cos(angle) * dist, bHeight / 2 - 2, Math.sin(angle) * dist);
      scene.add(building);
    }

    // Build Inner Loop Tiles (The Rat Race)
    const innerRadius = 12;
    innerTiles.forEach((tile) => {
      const angle = (tile.index / innerTiles.length) * Math.PI * 2;
      const x = Math.cos(angle) * innerRadius;
      const z = Math.sin(angle) * innerRadius;

      // Base Pedestal
      const tileGeo = new THREE.BoxGeometry(2.4, 0.4, 2.4);
      const hexColor = new THREE.Color(tile.color);
      const tileMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.3,
        metalness: 0.7,
        emissive: hexColor,
        emissiveIntensity: 0.25,
      });
      const tileMesh = new THREE.Mesh(tileGeo, tileMat);
      tileMesh.position.set(x, 0.2, z);
      tileMesh.rotation.y = -angle;
      tileMesh.castShadow = true;
      tileMesh.receiveShadow = true;
      tileMesh.userData = { tileId: tile.id, tileData: tile };
      scene.add(tileMesh);
      tilesMapRef.current.set(tile.id, tileMesh);

      // Glowing Neon Accent Frame on top of tile
      const borderGeo = new THREE.BoxGeometry(2.2, 0.08, 2.2);
      const borderMat = new THREE.MeshBasicMaterial({ color: hexColor });
      const borderMesh = new THREE.Mesh(borderGeo, borderMat);
      borderMesh.position.set(0, 0.22, 0);
      tileMesh.add(borderMesh);

      // Holographic Floating Icon Marker
      const markerGeo = new THREE.OctahedronGeometry(0.35);
      const markerMat = new THREE.MeshBasicMaterial({ color: hexColor, wireframe: true });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.set(0, 0.9, 0);
      tileMesh.add(markerMesh);
    });

    // Build Outer Track Tiles (The Fast Track)
    const outerRadius = 21;
    outerTiles.forEach((tile) => {
      const angle = (tile.index / outerTiles.length) * Math.PI * 2;
      const x = Math.cos(angle) * outerRadius;
      const z = Math.sin(angle) * outerRadius;

      const tileGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.5, 8);
      const hexColor = new THREE.Color(tile.color);
      const tileMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        roughness: 0.2,
        metalness: 0.9,
        emissive: hexColor,
        emissiveIntensity: 0.4,
      });
      const tileMesh = new THREE.Mesh(tileGeo, tileMat);
      tileMesh.position.set(x, 1.2, z);
      tileMesh.userData = { tileId: tile.id, tileData: tile };
      scene.add(tileMesh);
      tilesMapRef.current.set(tile.id, tileMesh);

      // Fast Track Floating Energy Rings
      const ringG = new THREE.TorusGeometry(1.7, 0.06, 8, 24);
      const ringM = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const ringMsh = new THREE.Mesh(ringG, ringM);
      ringMsh.rotation.x = Math.PI / 2;
      ringMsh.position.y = 0.35;
      tileMesh.add(ringMsh);
    });

    // Connect Outer Track with Glowing Laser Ring
    const fastTrackRingGeo = new THREE.TorusGeometry(outerRadius, 0.15, 16, 64);
    const fastTrackRingMat = new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true });
    const fastTrackRing = new THREE.Mesh(fastTrackRingGeo, fastTrackRingMat);
    fastTrackRing.rotation.x = Math.PI / 2;
    fastTrackRing.position.y = 1.0;
    scene.add(fastTrackRing);

    // Create 3D Player Mecha Pawn
    const pawnGroup = new THREE.Group();
    pawnRef.current = pawnGroup;

    // Pawn Body
    const pBodyGeo = new THREE.ConeGeometry(0.55, 1.4, 6);
    const pBodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(archetype.color || '#00f2fe'),
      emissive: new THREE.Color(archetype.color || '#00f2fe'),
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1,
    });
    const pBody = new THREE.Mesh(pBodyGeo, pBodyMat);
    pBody.position.y = 0.7;
    pBody.rotation.x = Math.PI;
    pawnGroup.add(pBody);

    // Pawn Head Sphere
    const pHeadGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const pHeadMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pHead = new THREE.Mesh(pHeadGeo, pHeadMat);
    pHead.position.y = 1.35;
    pawnGroup.add(pHead);

    // Glowing Halo around Pawn
    const haloGeo = new THREE.TorusGeometry(0.7, 0.05, 8, 24);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.3;
    pawnGroup.add(halo);

    // Light attached to player pawn
    const pawnPointLight = new THREE.PointLight(new THREE.Color(archetype.color || '#00f2fe'), 2, 8);
    pawnPointLight.position.y = 1.2;
    pawnGroup.add(pawnPointLight);

    scene.add(pawnGroup);

    // 3D Dice in center of board
    const diceGroup = new THREE.Group();
    diceGroupRef.current = diceGroup;
    const diceGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const diceMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
    });
    const diceMesh = new THREE.Mesh(diceGeo, diceMat);
    diceMesh.castShadow = true;
    diceGroup.add(diceMesh);

    // Dice edges glow
    const diceEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(diceGeo),
      new THREE.LineBasicMaterial({ color: 0x00f2fe, linewidth: 2 })
    );
    diceGroup.add(diceEdges);

    diceGroup.position.set(0, 1.2, 0);
    scene.add(diceGroup);

    // Mouse Interaction / Raycasting for Tile selection & Orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = Math.PI / 4;
    let sphericalPhi = Math.PI / 3;
    let sphericalRadius = 42;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && cameraMode === 'isometric') {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        sphericalTheta -= deltaX * 0.006;
        sphericalPhi = Math.max(0.2, Math.min(Math.PI / 2.2, sphericalPhi - deltaY * 0.006));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - prevMouseX, e.clientY - prevMouseY);
      isDragging = false;

      // If clicked without dragging, raycast to find tile
      if (dist < 4 && cameraRef.current && sceneRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);
        for (const hit of intersects) {
          let cur: THREE.Object3D | null = hit.object;
          while (cur) {
            if (cur.userData?.tileData) {
              onTileClick?.(cur.userData.tileData);
              return;
            }
            cur = cur.parent;
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRadius = Math.max(20, Math.min(65, sphericalRadius + e.deltaY * 0.04));
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate stars & ambient lights
      stars.rotation.y = elapsed * 0.02;

      // Animate 3D Dice if rolling
      if (diceGroupRef.current) {
        if (isRolling) {
          diceGroupRef.current.rotation.x += delta * 14;
          diceGroupRef.current.rotation.y += delta * 18;
          diceGroupRef.current.rotation.z += delta * 12;
          diceGroupRef.current.position.y = 1.2 + Math.sin(elapsed * 20) * 0.8;
        } else {
          // Subtle hover
          diceGroupRef.current.rotation.y += delta * 0.4;
          diceGroupRef.current.position.y = 1.2 + Math.sin(elapsed * 2) * 0.15;
        }
      }

      // Smooth Pawn Interpolation with Jump Arcs
      if (pawnRef.current) {
        const p = pawnPosRef.current;
        p.x += (p.targetX - p.x) * 0.15;
        p.z += (p.targetZ - p.z) * 0.15;

        if (isJumpingRef.current) {
          jumpTimeRef.current += delta * 8;
          const jumpOffset = Math.sin(jumpTimeRef.current) * 1.6;
          pawnRef.current.position.set(p.x, p.targetY + Math.max(0, jumpOffset), p.z);
        } else {
          // Floating bob
          pawnRef.current.position.set(p.x, p.targetY + Math.sin(elapsed * 4) * 0.1, p.z);
        }

        pawnRef.current.rotation.y = elapsed * 1.5;
      }

      // Camera Positioning based on mode
      if (cameraRef.current) {
        if (cameraMode === 'isometric') {
          targetCamPosRef.current.x = sphericalRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
          targetCamPosRef.current.y = sphericalRadius * Math.cos(sphericalPhi);
          targetCamPosRef.current.z = sphericalRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
          targetCamLookRef.current.set(0, 0, 0);
        } else if (cameraMode === 'topdown') {
          targetCamPosRef.current.set(0, 44, 0.1);
          targetCamLookRef.current.set(0, 0, 0);
        } else if (cameraMode === 'follow' && pawnRef.current) {
          targetCamPosRef.current.set(
            pawnRef.current.position.x * 1.4 + 8,
            18,
            pawnRef.current.position.z * 1.4 + 14
          );
          targetCamLookRef.current.copy(pawnRef.current.position);
        }

        cameraRef.current.position.lerp(targetCamPosRef.current, 0.08);
        cameraRef.current.lookAt(targetCamLookRef.current);
      }

      // Raycasting for hover highlights
      if (cameraRef.current && sceneRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);
        let foundId: number | null = null;
        for (const hit of intersects) {
          let cur: THREE.Object3D | null = hit.object;
          while (cur) {
            if (cur.userData?.tileId !== undefined) {
              foundId = cur.userData.tileId;
              break;
            }
            cur = cur.parent;
          }
          if (foundId !== null) break;
        }

        // Reset previous highlight
        if (hoveredTileIdRef.current !== null && hoveredTileIdRef.current !== foundId) {
          const prevMesh = tilesMapRef.current.get(hoveredTileIdRef.current);
          if (prevMesh && prevMesh.material instanceof THREE.MeshStandardMaterial) {
            prevMesh.material.emissiveIntensity = (prevMesh.userData?.tileData?.track === 'FAST_TRACK') ? 0.4 : 0.25;
          }
        }

        // Set new highlight
        if (foundId !== null) {
          const curMesh = tilesMapRef.current.get(foundId);
          if (curMesh && curMesh.material instanceof THREE.MeshStandardMaterial) {
            curMesh.material.emissiveIntensity = 0.9;
          }
        }
        hoveredTileIdRef.current = foundId;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update pawn target position when playerIndex or track changes
  useEffect(() => {
    const activeTiles = isOnFastTrack ? outerTiles : innerTiles;
    const radius = isOnFastTrack ? 21 : 12;
    const targetTile = activeTiles[playerIndex] || activeTiles[0];

    if (targetTile) {
      const angle = (targetTile.index / activeTiles.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = isOnFastTrack ? 1.6 : 0.6;

      pawnPosRef.current.targetX = x;
      pawnPosRef.current.targetY = y;
      pawnPosRef.current.targetZ = z;

      isJumpingRef.current = true;
      jumpTimeRef.current = 0;
      setTimeout(() => {
        isJumpingRef.current = false;
      }, 500);
    }
  }, [playerIndex, isOnFastTrack, innerTiles, outerTiles]);

  // Render 2.5D Holographic Canvas fallback if WebGL is unavailable or failed
  if (webGLFailed) {
    return <Board2D {...props} />;
  }

  return (
    <div className="relative w-full h-full min-h-[420px] select-none overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950 shadow-2xl shadow-cyan-950/40">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D View Overlay Indicators */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{isOnFastTrack ? '⚡ FAST TRACK (ORBITAL RING)' : '🔄 THE RAT RACE (INNER CIRCUIT)'}</span>
        </div>
        <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-mono text-slate-400">
          Tile #{playerIndex + 1}
        </div>
      </div>

      {/* Camera Control Helper Badge */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 pointer-events-none text-[11px] font-mono text-slate-500 bg-slate-950/60 px-3 py-1 rounded-md border border-slate-800/60 backdrop-blur-sm">
        <span>🖱️ Drag to Orbit</span>
        <span>•</span>
        <span>Scroll to Zoom</span>
        <span>•</span>
        <span>Click Tiles to Inspect</span>
      </div>
    </div>
  );
};
