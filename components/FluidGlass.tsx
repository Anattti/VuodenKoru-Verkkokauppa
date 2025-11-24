// React client-side komponentti, ei renderöidy palvelimella
"use client";

// Tuodaan THREE.js 3D-grafiikkakirjasto
import * as THREE from 'three';
// Tuodaan Reactin hookit ja tyypit
import { useRef, useState, useEffect, memo, ReactNode } from 'react';
// Tuodaan react-three/fiber hookit 3D-renderöintiin
import { Canvas, createPortal, useFrame, useThree, ThreeElements } from '@react-three/fiber';
// Tuodaan drei-apukirjaston komponentit (FBO, GLTF-lataus, materiaalit)
import { useFBO, useGLTF, useScroll, Scroll, Preload, ScrollControls, MeshTransmissionMaterial } from '@react-three/drei';
// Tuodaan maath-kirjastosta easing-funktiot pehmeisiin animaatioihin
import { easing } from 'maath';

// Tyyppi: määrittelee kolme eri tilaa lasiefektille
type Mode = 'lens' | 'bar' | 'cube';

// Interface: määrittelee FluidGlass-komponentin props-tyypit
interface FluidGlassProps {
    mode?: Mode;                    // Lasiefektin muoto (linssi, palkki tai kuutio)
    children?: ReactNode;           // Sisältö joka näytetään lasiefektin päällä
    className?: string;             // CSS-luokat
    style?: React.CSSProperties;    // Inline-tyylit
    onClick?: () => void;           // Klikkaustapahtuma
}

// Pääkomponentti: luo lasiefektin 3D-mallin ja sisällön
// memo() optimoi renderöintiä cachettamalla komponentin
const FluidGlass = memo(function FluidGlass({
    mode = 'lens',      // Oletusarvo: linssi
    children,
    className,
    style,
    onClick
}: FluidGlassProps) {
    // State: seuraa onko käytössä mobiililaite
    const [isMobile, setIsMobile] = useState(false);

    // Effect: tarkistaa näytön leveyden ja asettaa isMobile-arvon
    // Lisää myös event listenerin ikkunan koon muutoksille
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();  // Tarkista heti
        window.addEventListener('resize', checkMobile);
        // Cleanup-funktio: poistaa event listenerin kun komponentti unmountataan
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div
            className={`relative ${className || ''}`}
            style={{ ...style }}
            onClick={onClick}
        >
            {/* 3D Canvas absoluuttisesti taustalla, ei reagoi hiiren tapahtumiin */}
            <div className="absolute inset-0 z-0 pointer-events-none w-[100%] h-[100%]">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 45 }}  // Kamera 5 yksikköä edessä, 45° näkökulma
                    gl={{
                        preserveDrawingBuffer: true,  // Säilyttää piirtoalueen (tarvitaan screenshotteihin)
                        antialias: true,              // Pehmennys reunoille
                        alpha: true,                  // Läpinäkyvyys taustalla
                    }}
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* Lens-komponentti joka renderöi 3D-mallin */}
                    <Lens mode={mode} isMobile={isMobile}>
                        {/* Ei scroll-sisältöä napissa, mutta rakenne säilytetään */}
                    </Lens>
                    {/* Preload-komponentti lataa kaikki resurssit etukäteen */}
                    <Preload />
                </Canvas>
            </div>
            {/* Sisältö (children) näytetään 3D-efektin päällä */}
            <div className="relative z-10 pointer-events-none w-[100%] h-[100%]">
                {children}
            </div>
        </div>
    );
});

// Lens-komponentti: vastaa 3D-mallin lataamisesta, animoinnista ja renderöinnistä
function Lens({
    children,
    mode,
    isMobile,
    damping = 0.15,  // Vaimennuskerroin hiiren seurantaan (pienempi = hitaampi)
    ...props
}: {
    children?: ReactNode;
    mode: Mode;
    isMobile: boolean;
    damping?: number;
} & ThreeElements['mesh']) {
    // Ladataan kolme erilaista 3D-mallia GLTF-muodossa
    const { nodes } = useGLTF('/assets/3d/lens-transformed.glb');
    const barModel = useGLTF('/assets/3d/bar-transformed.glb');
    const cubeModel = useGLTF('/assets/3d/cube-transformed.glb');

    // FBO (Frame Buffer Object): luo off-screen renderöintikohteen
    const buffer = useFBO();
    // Hakee viewportin koon Three.js-tilasta
    const viewport = useThree((state) => state.viewport);
    // Luo uuden THREE.js scenen (käytetään portaalissa)
    const [scene] = useState(() => new THREE.Scene());

    // Ref:it kolmelle eri 3D-meshille (linssi, palkki, kuutio)
    const lensRef = useRef<THREE.Mesh>(null);
    const barRef = useRef<THREE.Mesh>(null);
    const cubeRef = useRef<THREE.Mesh>(null);

    // Apufunktio: etsii geometrian nodes-objektista
    // Yrittää ensin löytää nimen perusteella, sitten ensimmäisen meshin
    const getGeometry = (n: any, name: string) => {
        if (n[name]) return (n[name] as THREE.Mesh).geometry;
        const firstMesh = Object.values(n).find((node: any) => node.isMesh) as THREE.Mesh;
        return firstMesh?.geometry;
    };

    // Haetaan geometriat jokaiselle 3D-mallille
    const lensGeometry = getGeometry(nodes, 'lens');
    const barGeometry = getGeometry(barModel.nodes, 'bar');
    const cubeGeometry = getGeometry(cubeModel.nodes, 'cube');

    // useFrame: kutsutaan joka frame (n. 60 kertaa sekunnissa)
    // Hoitaa animaatiot ja renderöinnin
    useFrame((state, delta) => {
        // Valitaan oikea mesh nykyisen moden perusteella
        const meshRef = mode === 'lens' ? lensRef : mode === 'bar' ? barRef : cubeRef;

        if (meshRef.current) {
            // Kelluva animaatio (kommentoitu pois tällä hetkellä)
            const time = state.clock.getElapsedTime();
            // meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
            // meshRef.current.rotation.y = Math.cos(time * 0.2) * 0.1;

            // Hiiren seuranta: mesh liikkuu pehmeästi kohti hiiren sijaintia
            const { x: mouseX, y: mouseY } = state.pointer;  // Hiiren koordinaatit (-1 to 1)
            // damp3 luo pehmeän siirtymän nykyisestä kohti uutta sijaintia
            easing.damp3(meshRef.current.position, [mouseX * viewport.width / 4, mouseY * viewport.height / 4, 0], damping, delta);

            // Renderöi scene FBO:hon (off-screen)
            state.gl.setRenderTarget(buffer);
            state.gl.setClearColor('#000000', 0);  // Musta tausta, täysin läpinäkyvä
            state.gl.render(scene, state.camera);
            state.gl.setRenderTarget(null);  // Palaa normaaliin renderöintiin
        }
    });

    return (
        <>
            {/* createPortal: renderöi children erilliseen sceneen */}
            {createPortal(children, scene)}

            {/* Linssi-mesh: näkyvissä kun mode === 'lens' */}
            {lensGeometry && (
                <mesh ref={lensRef} scale={0.4} visible={mode === 'lens'} {...props}>
                    <primitive object={lensGeometry} />
                    {/* MeshTransmissionMaterial: luo lasiefektin */}
                    {/* ior = taitekerroin, thickness = paksuus, chromaticAberration = väripoikkeama */}
                    <MeshTransmissionMaterial buffer={buffer.texture} ior={1.15} thickness={1.5} anisotropy={0.1} chromaticAberration={0.04} />
                </mesh>
            )}

            {/* Palkki-mesh: näkyvissä kun mode === 'bar' */}
            {barGeometry && (
                <mesh ref={barRef} scale={0.3} visible={mode === 'bar'} {...props}>
                    <primitive object={barGeometry} />
                    <MeshTransmissionMaterial buffer={buffer.texture} ior={1.2} thickness={1.5} anisotropy={0.15} chromaticAberration={0.04} />
                </mesh>
            )}

            {/* Kuutio-mesh: näkyvissä kun mode === 'cube' */}
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

// Esiladataan GLTF-mallit etukäteen nopeampaa latautumista varten
useGLTF.preload('/assets/3d/lens-transformed.glb');
useGLTF.preload('/assets/3d/bar-transformed.glb');
useGLTF.preload('/assets/3d/cube-transformed.glb');
