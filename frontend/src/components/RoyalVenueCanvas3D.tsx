'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface RoyalVenueCanvas3DProps {
  onSelectZone?: (zoneName: string) => void;
  lang?: 'en' | 'hi';
}

export function RoyalVenueCanvas3D({ onSelectZone, lang = 'en' }: RoyalVenueCanvas3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLighting, setActiveLighting] = useState<'night' | 'sunset' | 'day'>('night');
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeZone, setActiveZone] = useState<string>('mandap');
  const [isLoaded, setIsLoaded] = useState(false);

  // References for dynamic updates inside animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const mandapGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const petalsRef = useRef<THREE.InstancedMesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetCameraPos = useRef(new THREE.Vector3(0, 4.5, 11));
  const currentCameraPos = useRef(new THREE.Vector3(0, 4.5, 11));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 4.5, 11);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x2a1d38, 1.2);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xffdf88, 2.5);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Warm sacred altar point light
    const pointLight = new THREE.PointLight(0xff9922, 4, 15);
    pointLight.position.set(0, 1.2, 0);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // Additional side rim lights for royal glow
    const rimLight1 = new THREE.PointLight(0xd4af37, 2, 20);
    rimLight1.position.set(-6, 3, -4);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0x44aaff, 1.5, 20);
    rimLight2.position.set(6, 4, -4);
    scene.add(rimLight2);

    // --- Architectural Construction: The Royal Mandap & Palace Garden ---
    const mandapGroup = new THREE.Group();
    scene.add(mandapGroup);
    mandapGroupRef.current = mandapGroup;

    // 1. Grand Polished Marble & Velvet Dais
    const daisGeo = new THREE.CylinderGeometry(5.2, 5.5, 0.4, 32);
    const daisMat = new THREE.MeshStandardMaterial({
      color: 0x161219,
      roughness: 0.2,
      metalness: 0.7,
    });
    const dais = new THREE.Mesh(daisGeo, daisMat);
    dais.position.y = -0.2;
    dais.receiveShadow = true;
    mandapGroup.add(dais);

    // Gold Trim Ring around Dais
    const daisRingGeo = new THREE.TorusGeometry(5.22, 0.08, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf5cf66,
      roughness: 0.25,
      metalness: 0.9,
    });
    const daisRing = new THREE.Mesh(daisRingGeo, goldMat);
    daisRing.rotation.x = Math.PI / 2;
    daisRing.position.y = 0;
    mandapGroup.add(daisRing);

    // Inner Velvet Carpet Center
    const carpetGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.05, 32);
    const carpetMat = new THREE.MeshStandardMaterial({
      color: 0x580a18, // Royal Crimson Velvet
      roughness: 0.8,
      metalness: 0.1,
    });
    const carpet = new THREE.Mesh(carpetGeo, carpetMat);
    carpet.position.y = 0.03;
    carpet.receiveShadow = true;
    mandapGroup.add(carpet);

    // Sacred Havan Kund (Golden Fire Altar in Center)
    const altarGeo = new THREE.BoxGeometry(1.2, 0.4, 1.2);
    const altar = new THREE.Mesh(altarGeo, goldMat);
    altar.position.y = 0.25;
    mandapGroup.add(altar);

    // Sacred Flame / Glow Sphere inside Havan Kund
    const flameGeo = new THREE.ConeGeometry(0.3, 0.7, 16);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 0.75;
    mandapGroup.add(flame);

    // 2. Eight Carved Royal Golden Pillars
    const pillarCount = 6;
    const pillarRadius = 3.2;
    const pillarHeight = 3.8;

    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      const x = Math.cos(angle) * pillarRadius;
      const z = Math.sin(angle) * pillarRadius;

      // Base pedestal
      const pedGeo = new THREE.BoxGeometry(0.65, 0.4, 0.65);
      const ped = new THREE.Mesh(pedGeo, goldMat);
      ped.position.set(x, 0.2, z);
      mandapGroup.add(ped);

      // Fluted column
      const colGeo = new THREE.CylinderGeometry(0.18, 0.24, pillarHeight, 16);
      const marbleWhite = new THREE.MeshStandardMaterial({
        color: 0xfaeedd,
        roughness: 0.3,
        metalness: 0.2,
      });
      const col = new THREE.Mesh(colGeo, marbleWhite);
      col.position.set(x, 0.2 + pillarHeight / 2, z);
      col.castShadow = true;
      mandapGroup.add(col);

      // Ornate Gold Capital / Pillar Head
      const capGeo = new THREE.CylinderGeometry(0.35, 0.2, 0.3, 16);
      const cap = new THREE.Mesh(capGeo, goldMat);
      cap.position.set(x, 0.2 + pillarHeight + 0.1, z);
      mandapGroup.add(cap);

      // Hanging Diya / Lantern at each pillar
      const lanternGeo = new THREE.OctahedronGeometry(0.15, 0);
      const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
      const lantern = new THREE.Mesh(lanternGeo, lanternMat);
      lantern.position.set(x * 0.85, 0.2 + pillarHeight - 0.4, z * 0.85);
      mandapGroup.add(lantern);
    }

    // 3. Ornate Royal Canopy / Grand Dome
    // Top Arch Ring
    const archRingGeo = new THREE.TorusGeometry(pillarRadius, 0.14, 16, 32);
    const archRing = new THREE.Mesh(archRingGeo, goldMat);
    archRing.rotation.x = Math.PI / 2;
    archRing.position.y = 0.2 + pillarHeight + 0.25;
    mandapGroup.add(archRing);

    // Decorative Hanging Floral Torus Garlands
    const garlandGeo = new THREE.TorusGeometry(pillarRadius * 0.95, 0.08, 12, 32);
    const garlandMat = new THREE.MeshStandardMaterial({
      color: 0xe06b18, // Marigold Orange
      roughness: 0.9,
    });
    const garland = new THREE.Mesh(garlandGeo, garlandMat);
    garland.rotation.x = Math.PI / 2;
    garland.position.y = 0.2 + pillarHeight + 0.1;
    mandapGroup.add(garland);

    // Scalloped Palace Dome (Mughal / Rajasthani Chhatri)
    const domeGeo = new THREE.SphereGeometry(2.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.3);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
      side: THREE.DoubleSide,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.2 + pillarHeight + 0.3;
    dome.castShadow = true;
    mandapGroup.add(dome);

    // Sacred Golden Kalash & Spire on top of Dome
    const kalashGeo = new THREE.ConeGeometry(0.2, 0.8, 16);
    const kalash = new THREE.Mesh(kalashGeo, goldMat);
    kalash.position.y = 0.2 + pillarHeight + 2.7;
    mandapGroup.add(kalash);

    // 4. Background Royal Archways & Garden Palace Pillars
    const bgWallCount = 7;
    for (let j = 0; j < bgWallCount; j++) {
      const angle = (j / (bgWallCount - 1)) * Math.PI * 0.8 - Math.PI * 0.4;
      const dist = 9.5;
      const bx = Math.sin(angle) * dist;
      const bz = -Math.cos(angle) * dist;

      const bgColGeo = new THREE.BoxGeometry(0.8, 6, 0.8);
      const bgColMat = new THREE.MeshStandardMaterial({
        color: 0x181a24,
        roughness: 0.7,
        metalness: 0.3,
      });
      const bgCol = new THREE.Mesh(bgColGeo, bgColMat);
      bgCol.position.set(bx, 2.5, bz);
      scene.add(bgCol);

      // Floating ambient garden lights
      const lightMeshGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const lightMeshMat = new THREE.MeshBasicMaterial({ color: 0xffd97d });
      const lightMesh = new THREE.Mesh(lightMeshGeo, lightMeshMat);
      lightMesh.position.set(bx, 4.2, bz + 0.6);
      scene.add(lightMesh);
    }

    // 5. Shahi Lawn Ground with Subtle Grid Glow
    const lawnGeo = new THREE.PlaneGeometry(50, 50, 32, 32);
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0x07110c, // Deep Midnight Emerald Lawn
      roughness: 0.8,
      metalness: 0.2,
    });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.y = -0.4;
    lawn.receiveShadow = true;
    scene.add(lawn);

    // --- 3D Particle System: 500 Golden Sparkling Motes ---
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 18;
      particlePositions[p * 3 + 1] = Math.random() * 8;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 18;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffe680,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    // --- Floating Royal Rose & Marigold Petals (InstancedMesh) ---
    const petalCount = 120;
    const petalShape = new THREE.DodecahedronGeometry(0.08, 0);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xe63946, // Velvet Rose Red
      roughness: 0.4,
    });
    const petals = new THREE.InstancedMesh(petalShape, petalMat, petalCount);
    const dummy = new THREE.Object3D();
    const petalData: { pos: THREE.Vector3; rotSpeed: THREE.Vector3; fallSpeed: number }[] = [];

    for (let k = 0; k < petalCount; k++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        Math.random() * 7 + 1,
        (Math.random() - 0.5) * 14
      );
      dummy.position.copy(pos);
      dummy.scale.set(1.5, 0.4, 1.2);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      petals.setMatrixAt(k, dummy.matrix);

      petalData.push({
        pos,
        rotSpeed: new THREE.Vector3(
          Math.random() * 0.02,
          Math.random() * 0.03,
          Math.random() * 0.02
        ),
        fallSpeed: 0.008 + Math.random() * 0.012,
      });
    }
    petals.instanceMatrix.needsUpdate = true;
    scene.add(petals);
    petalsRef.current = petals;

    // --- Mouse & Touch Drag Controls ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let currentRotationY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      setAutoRotate(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      targetRotationY += deltaX * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Main Render / Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Camera smooth lerp
      currentCameraPos.current.lerp(targetCameraPos.current, 0.05);
      camera.position.copy(currentCameraPos.current);
      camera.lookAt(0, 1.8, 0);

      // Auto rotation or mouse drag
      if (mandapGroupRef.current) {
        if (autoRotate) {
          targetRotationY += 0.003;
        }
        currentRotationY += (targetRotationY - currentRotationY) * 0.08;
        mandapGroupRef.current.rotation.y = currentRotationY;
      }

      // Sacred flame flicker
      if (pointLightRef.current) {
        pointLightRef.current.intensity = 3.6 + Math.sin(elapsedTime * 8) * 0.6;
      }

      // Twinkling particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.03;
      }

      // Falling Petals Physics
      if (petalsRef.current) {
        for (let k = 0; k < petalCount; k++) {
          const item = petalData[k];
          item.pos.y -= item.fallSpeed;
          item.pos.x += Math.sin(elapsedTime + k) * 0.005;

          if (item.pos.y < -0.3) {
            item.pos.y = 7;
            item.pos.x = (Math.random() - 0.5) * 14;
            item.pos.z = (Math.random() - 0.5) * 14;
          }

          dummy.position.copy(item.pos);
          dummy.rotation.x += item.rotSpeed.x;
          dummy.rotation.y += item.rotSpeed.y;
          dummy.scale.set(1.5, 0.4, 1.2);
          dummy.updateMatrix();
          petalsRef.current.setMatrixAt(k, dummy.matrix);
        }
        petalsRef.current.instanceMatrix.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate]);

  // Lighting Mode Swapping
  const setLightingPreset = (mode: 'night' | 'sunset' | 'day') => {
    setActiveLighting(mode);
    if (!dirLightRef.current || !ambientLightRef.current || !sceneRef.current) return;

    if (mode === 'night') {
      dirLightRef.current.color.setHex(0xffdf88);
      dirLightRef.current.intensity = 2.2;
      ambientLightRef.current.color.setHex(0x2a1d38);
      ambientLightRef.current.intensity = 1.2;
      if (pointLightRef.current) pointLightRef.current.intensity = 4;
    } else if (mode === 'sunset') {
      dirLightRef.current.color.setHex(0xff7722);
      dirLightRef.current.intensity = 4.0;
      ambientLightRef.current.color.setHex(0x5a2d20);
      ambientLightRef.current.intensity = 1.8;
      if (pointLightRef.current) pointLightRef.current.intensity = 2.5;
    } else {
      // Day
      dirLightRef.current.color.setHex(0xffffff);
      dirLightRef.current.intensity = 3.2;
      ambientLightRef.current.color.setHex(0x607080);
      ambientLightRef.current.intensity = 2.4;
      if (pointLightRef.current) pointLightRef.current.intensity = 1.5;
    }
  };

  // Camera Target Zone Switcher
  const handleZoneSwitch = (zone: 'mandap' | 'hall' | 'lawn' | 'suites') => {
    setActiveZone(zone);
    if (onSelectZone) onSelectZone(zone);

    if (zone === 'mandap') {
      targetCameraPos.current.set(0, 4.2, 10.5);
    } else if (zone === 'lawn') {
      targetCameraPos.current.set(7, 8, 14);
    } else if (zone === 'hall') {
      targetCameraPos.current.set(-6, 3.5, 9);
    } else if (zone === 'suites') {
      targetCameraPos.current.set(0, 2.5, 7);
    }
  };

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] lg:h-[700px] rounded-3xl overflow-hidden glass-panel border border-amber-500/30 shadow-2xl">
      {/* Three.js Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        title={lang === 'hi' ? 'घुमाने के लिए ड्रैग करें' : 'Drag to rotate 360°'}
      />

      {/* Top Overlay Badge & Quick Instructions */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md border border-amber-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{lang === 'hi' ? 'लाइव 3D मंडप व वेन्यू व्यूअर (Three.js WebGL)' : 'LIVE 3D ROYAL VENUE (Three.js WebGL)'}</span>
        </div>
        <p className="text-[11px] text-amber-200/70 pl-2">
          {lang === 'hi' ? '🖱️ 360° में देखने के लिए स्क्रीन पर ड्रैग करें' : '🖱️ Drag to rotate 360° • Interactive 3D Architecture'}
        </p>
      </div>

      {/* Top Right: Day / Sunset / Night Lighting Controls */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-2xl border border-amber-500/30 shadow-lg">
        <button
          onClick={() => setLightingPreset('night')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeLighting === 'night'
              ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-inner'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🌙</span>
          <span className="hidden sm:inline">{lang === 'hi' ? 'रात्रि दीपोत्सव' : 'Midnight Gala'}</span>
        </button>
        <button
          onClick={() => setLightingPreset('sunset')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeLighting === 'sunset'
              ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-inner'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🌅</span>
          <span className="hidden sm:inline">{lang === 'hi' ? 'गोधूलि वेला' : 'Golden Sunset'}</span>
        </button>
        <button
          onClick={() => setLightingPreset('day')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeLighting === 'day'
              ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-inner'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>☀️</span>
          <span className="hidden sm:inline">{lang === 'hi' ? 'शाही दिवस' : 'Royal Day'}</span>
        </button>
      </div>

      {/* Bottom Center: Interactive 3D Zone Navigator */}
      <div className="absolute bottom-5 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-20 flex items-center justify-center gap-2 bg-black/80 backdrop-blur-lg px-3 py-2 rounded-2xl border border-amber-500/40 shadow-2xl">
        <button
          onClick={() => handleZoneSwitch('mandap')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeZone === 'mandap'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg font-black'
              : 'text-slate-300 hover:text-amber-300 hover:bg-white/5'
          }`}
        >
          <span>🏛️</span>
          <span>{lang === 'hi' ? 'शाही मंडप' : 'Royal Mandap'}</span>
        </button>
        <button
          onClick={() => handleZoneSwitch('lawn')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeZone === 'lawn'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg font-black'
              : 'text-slate-300 hover:text-amber-300 hover:bg-white/5'
          }`}
        >
          <span>🌿</span>
          <span>{lang === 'hi' ? 'शाही लॉन' : 'Grand Lawn'}</span>
        </button>
        <button
          onClick={() => handleZoneSwitch('hall')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeZone === 'hall'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg font-black'
              : 'text-slate-300 hover:text-amber-300 hover:bg-white/5'
          }`}
        >
          <span>✨</span>
          <span>{lang === 'hi' ? 'एसी बैंक्वेट' : 'AC Banquet'}</span>
        </button>
        <button
          onClick={() => handleZoneSwitch('suites')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeZone === 'suites'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg font-black'
              : 'text-slate-300 hover:text-amber-300 hover:bg-white/5'
          }`}
        >
          <span>👑</span>
          <span>{lang === 'hi' ? 'सुइट्स' : 'VIP Suites'}</span>
        </button>

        {/* Auto Rotate Toggle */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-xl text-xs transition border ${
            autoRotate
              ? 'border-amber-400/40 text-amber-300 bg-amber-950/40'
              : 'border-slate-700 text-slate-400 hover:text-white'
          }`}
          title={autoRotate ? 'Pause 3D Rotation' : 'Resume 3D Rotation'}
        >
          {autoRotate ? '⏸️' : '▶️'}
        </button>
      </div>

      {/* Floating Cultural Floral Accent Bottom Right */}
      <div className="absolute bottom-4 right-4 hidden lg:flex items-center gap-2 text-[11px] text-amber-300/80 bg-black/60 px-3 py-1.5 rounded-full border border-amber-500/20 backdrop-blur-sm pointer-events-none">
        <span>🌸</span>
        <span>{lang === 'hi' ? 'गुलाब व गेंदा पंखुड़ी सिमुलेशन' : 'Live Rose & Marigold Petals Flutter'}</span>
      </div>
    </div>
  );
}
