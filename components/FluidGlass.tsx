"use client";

import * as THREE from 'three';
import { useRef, useState, useEffect, memo, ReactNode } from 'react';
import { Canvas, createPortal, useFrame, useThree, ThreeElements } from '@react-three/fiber';
import { useFBO, useGLTF, useScroll, Scroll, Preload, ScrollControls, MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';

type Mode = 'lens' | 'bar' | 'cube';

interface FluidGlassProps {
    mode?: Mode;
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const FluidGlass = memo(function FluidGlass({
    mode = 'lens',
    children,
    className,
    style,
    onClick
}: FluidGlassProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div
            className={`relative ${className || ''}`}
            style={{ ...style }}
            onClick={onClick}
        >
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    gl={{
                        preserveDrawingBuffer: true,
                        antialias: true,
                        alpha: true,
                    }}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Lens mode={mode} isMobile={isMobile}>
                        {/* We don't need the scroll content here for a button, but we keep the structure */}
                    </Lens>
                    <Preload />
                </Canvas>
            </div>
            <div className="relative z-10 pointer-events-none">
                {children}
            </div>
        </div>
    );
});

function Lens({
    children,
    mode,
    isMobile,
    damping = 0.15,
    ...props
}: {
    children?: ReactNode;
    mode: Mode;
    isMobile: boolean;
    damping?: number;
} & ThreeElements['mesh']) {
    const { nodes } = useGLTF('/assets/3d/lens-transformed.glb');
    const barModel = useGLTF('/assets/3d/bar-transformed.glb');
    const cubeModel = useGLTF('/assets/3d/cube-transformed.glb');

    const buffer = useFBO();
    const viewport = useThree((state) => state.viewport);
    const [scene] = useState(() => new THREE.Scene());

    const lensRef = useRef<THREE.Mesh>(null);
    const barRef = useRef<THREE.Mesh>(null);
    const cubeRef = useRef<THREE.Mesh>(null);

    // Helper to find the first mesh in the nodes object
    const getGeometry = (n: any, name: string) => {
        if (n[name]) return (n[name] as THREE.Mesh).geometry;
        const firstMesh = Object.values(n).find((node: any) => node.isMesh) as THREE.Mesh;
        return firstMesh?.geometry;
    };

    const lensGeometry = getGeometry(nodes, 'lens');
    const barGeometry = getGeometry(barModel.nodes, 'bar');
    const cubeGeometry = getGeometry(cubeModel.nodes, 'cube');

    useFrame((state, delta) => {
        const meshRef = mode === 'lens' ? lensRef : mode === 'bar' ? barRef : cubeRef;

        if (meshRef.current) {
            // Gentle floating animation
            const time = state.clock.getElapsedTime();
            // meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
            // meshRef.current.rotation.y = Math.cos(time * 0.2) * 0.1;

            // Mouse follow
            const { x: mouseX, y: mouseY } = state.pointer;
            easing.damp3(meshRef.current.position, [mouseX * viewport.width / 4, mouseY * viewport.height / 4, 0], damping, delta);

            state.gl.setRenderTarget(buffer);
            state.gl.setClearColor('#000000', 0);
            state.gl.render(scene, state.camera);
            state.gl.setRenderTarget(null);
        }
    });

    return (
        <>
            {createPortal(children, scene)}
            {lensGeometry && (
                <mesh ref={lensRef} scale={0.4} visible={mode === 'lens'} {...props}>
                    <primitive object={lensGeometry} />
                    <MeshTransmissionMaterial buffer={buffer.texture} ior={1.15} thickness={1.5} anisotropy={0.1} chromaticAberration={0.04} />
                </mesh>
            )}
            {barGeometry && (
                <mesh ref={barRef} scale={0.3} visible={mode === 'bar'} {...props}>
                    <primitive object={barGeometry} />
                    <MeshTransmissionMaterial buffer={buffer.texture} ior={1.2} thickness={1.5} anisotropy={0.15} chromaticAberration={0.04} />
                </mesh>
            )}
            {cubeGeometry && (
                <mesh ref={cubeRef} scale={0.25} visible={mode === 'cube'} {...props}>
                    <primitive object={cubeGeometry} />
                    <MeshTransmissionMaterial buffer={buffer.texture} ior={1.25} thickness={1.5} anisotropy={0.2} chromaticAberration={0.04} />
                </mesh>
            )}
        </>
    );
}

export default FluidGlass;

// Preload GLTF models
useGLTF.preload('/assets/3d/lens-transformed.glb');
useGLTF.preload('/assets/3d/bar-transformed.glb');
useGLTF.preload('/assets/3d/cube-transformed.glb');
