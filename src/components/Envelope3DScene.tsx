import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Heart } from 'lucide-react';
import { playPaperRustleSound } from '../utils/audioSynth';

interface Envelope3DSceneProps {
  onEnvelopeOpened: () => void;
}

export const Envelope3DScene: React.FC<Envelope3DSceneProps> = ({ onEnvelopeOpened }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0a09, 0.12);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xfff1f2, 0.9);
    scene.add(ambientLight);

    const warmPointLight = new THREE.PointLight(0xfef08a, 2.5, 20);
    warmPointLight.position.set(2, 3, 5);
    warmPointLight.castShadow = true;
    scene.add(warmPointLight);

    const roseLight = new THREE.PointLight(0xf43f5e, 1.8, 15);
    roseLight.position.set(-3, -2, 3);
    scene.add(roseLight);

    // 5. Envelope Group
    const envelopeGroup = new THREE.Group();
    scene.add(envelopeGroup);

    // Envelope dimensions
    const width = 3.6;
    const height = 2.4;
    const depth = 0.12;

    // Envelope Body Material (warm ivory aged parchment)
    const envelopeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3e8d3,
      roughness: 0.45,
      metalness: 0.05
    });

    const envelopeBackMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5d2b3,
      roughness: 0.5
    });

    // Main Envelope Base
    const baseGeo = new THREE.BoxGeometry(width, height, depth);
    const baseMesh = new THREE.Mesh(baseGeo, envelopeMaterial);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    envelopeGroup.add(baseMesh);

    // Letter sheet sliding inside
    const letterGeo = new THREE.PlaneGeometry(width * 0.92, height * 1.25);
    const letterMaterial = new THREE.MeshStandardMaterial({
      color: 0xfaf5ea,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const letterMesh = new THREE.Mesh(letterGeo, letterMaterial);
    letterMesh.position.set(0, 0, -0.01);
    envelopeGroup.add(letterMesh);

    // Envelope Flap
    const flapShape = new THREE.Shape();
    flapShape.moveTo(-width / 2, 0);
    flapShape.lineTo(0, -height * 0.65);
    flapShape.lineTo(width / 2, 0);
    flapShape.closePath();

    const flapGeo = new THREE.ShapeGeometry(flapShape);
    const flapMesh = new THREE.Mesh(flapGeo, envelopeBackMaterial);
    flapMesh.position.set(0, height / 2, depth / 2 + 0.005);
    flapMesh.rotation.x = 0; // closed flap angle
    envelopeGroup.add(flapMesh);

    // Crimson Wax Seal with Heart
    const sealGroup = new THREE.Group();
    const sealGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.08, 32);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0x881337, // deep crimson
      roughness: 0.25,
      metalness: 0.3
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.rotation.x = Math.PI / 2;
    sealGroup.add(sealMesh);

    // Gold Heart Emblem on Seal
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.08);
    heartShape.bezierCurveTo(0, 0.15, -0.12, 0.2, -0.12, 0.08);
    heartShape.bezierCurveTo(-0.12, 0, 0, -0.1, 0, -0.15);
    heartShape.bezierCurveTo(0, -0.1, 0.12, 0, 0.12, 0.08);
    heartShape.bezierCurveTo(0.12, 0.2, 0, 0.15, 0, 0.08);

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, { depth: 0.02, bevelEnabled: true, bevelSize: 0.005 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.8 });
    const heartMesh = new THREE.Mesh(heartGeo, goldMat);
    heartMesh.position.set(0, 0, 0.04);
    heartMesh.scale.set(1.2, 1.2, 1.2);
    sealGroup.add(heartMesh);

    sealGroup.position.set(0, 0.1, depth / 2 + 0.05);
    envelopeGroup.add(sealGroup);

    // Gentle Floating Particles around 3D space
    const particleGeo = new THREE.BufferGeometry();
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xfbcfe8,
      transparent: true,
      opacity: 0.7
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Animation Loop
    let clock = new THREE.Clock();
    let animFrameId: number;

    // Scale envelope slightly down on small mobile screens to prevent UI overlap
    if (window.innerWidth < 480) {
      envelopeGroup.scale.set(0.82, 0.82, 0.82);
    }

    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = mouseX * 0.25;
      targetRotX = mouseY * 0.15;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touchX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        const touchY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        targetRotY = touchX * 0.3;
        targetRotX = touchY * 0.2;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    let openingProgress = 0;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (!isOpening) {
        // Gentle bobbing & mouse/touch tilt
        envelopeGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
        envelopeGroup.rotation.y += (targetRotY - envelopeGroup.rotation.y) * 0.05;
        envelopeGroup.rotation.x += (targetRotX - envelopeGroup.rotation.x) * 0.05;
        envelopeGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.03;
      } else {
        // Opening sequence
        openingProgress += 0.02;

        // Flap unhinges
        if (openingProgress < 1.0) {
          flapMesh.rotation.x = Math.min(Math.PI, openingProgress * Math.PI);
          sealGroup.position.y = 0.1 + openingProgress * 0.8;
          sealGroup.scale.multiplyScalar(0.98);
        } else if (openingProgress < 2.0) {
          // Letter slides up out of envelope
          const letterOffset = (openingProgress - 1.0) * 1.8;
          letterMesh.position.y = letterOffset;
          letterMesh.position.z = 0.15;

          // Camera moves forward into letter
          camera.position.z = Math.max(2.2, 8 - (openingProgress - 1.0) * 4);
        }
      }

      particleSystem.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);

      if (window.innerWidth < 480) {
        envelopeGroup.scale.set(0.82, 0.82, 0.82);
      } else {
        envelopeGroup.scale.set(1, 1, 1);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpening]);

  const handleOpenClick = () => {
    if (isOpening) return;
    playPaperRustleSound();
    setIsOpening(true);
    setTimeout(() => {
      onEnvelopeOpened();
    }, 2800);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-rose-950/40 flex items-center justify-center">
      {/* 3D Canvas Background */}
      <div ref={containerRef} className="absolute inset-0 z-0 cursor-pointer" onClick={handleOpenClick} />

      {/* OVERLAY UI */}
      <div className="relative z-20 pointer-events-none flex flex-col items-center justify-between h-full py-12 px-6 text-center select-none">
        
        {/* Header */}
        <div className="space-y-2 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs sm:text-sm font-medium tracking-widest uppercase backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Private Secret Letter</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-amber-100/95 font-light tracking-wide drop-shadow-md">
            For You <span className="text-rose-500 font-normal">❤️</span>
          </h1>
        </div>

        {/* Interactive Prompt Button */}
        {!isOpening ? (
          <div className="pointer-events-auto space-y-3">
            <button
              onClick={handleOpenClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-rose-100 font-serif text-lg sm:text-xl font-medium shadow-2xl hover:shadow-rose-900/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-400/40"
            >
              <Heart className={`w-5 h-5 text-rose-300 transition-transform duration-300 ${isHovered ? 'scale-125 fill-rose-400' : ''}`} />
              <span>Click to Open the Envelope</span>
              <Sparkles className="w-4 h-4 text-amber-300 opacity-80" />
            </button>
            <p className="text-stone-400 text-xs sm:text-sm font-sans tracking-wider opacity-80">
              ( or tap directly on the floating 3D envelope )
            </p>
          </div>
        ) : (
          <div className="space-y-2 animate-pulse">
            <p className="text-amber-200/90 font-serif text-xl sm:text-2xl tracking-widest italic">
              Unfolding the secret message...
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="flex flex-col items-center gap-0.5 text-stone-500 text-xs tracking-wider font-serif opacity-80">
          <span className="text-amber-200/70">Made with ❤️ by Ryan Zannah</span>
          <span className="text-[10px] tracking-widest font-mono uppercase text-stone-600">Shhh... this is only for you</span>
        </div>
      </div>
    </div>
  );
};
