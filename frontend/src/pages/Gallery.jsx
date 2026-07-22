import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, useTexture } from '@react-three/drei';
import { useRef, useState, Suspense, useMemo, Component, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ARTWORKS as FALLBACK_ARTWORKS } from '../data/artworks';

/* ── Error boundary to catch useTexture failures per frame ─────────────────── */
export class TextureErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { error: false }; }
    static getDerivedStateFromError() { return { error: true }; }
    render() {
        if (this.state.error) return this.props.fallback ?? null;
        return this.props.children;
    }
}

/* ── Gradient canvas texture as fallback ───────────────────────────────────── */
function makeGradientTexture(accent) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 512, 640);
    grad.addColorStop(0, accent + 'ff');
    grad.addColorStop(0.5, accent + '88');
    grad.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 640);
    for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = '#ffffff0a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, i * 32);
        ctx.lineTo(512, i * 32);
        ctx.stroke();
    }
    ctx.fillStyle = '#ffffff22';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('◈ ART', 256, 310);
    return new THREE.CanvasTexture(canvas);
}

/* ── Art image plane via useTexture ────────────────────────────────────────── */
function ArtImageCanvas({ art, navigate }) {
    const texture = useTexture(art.img || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    return (
        <mesh
            position={[0, 0.1, 0.06]}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'default'; }}
            onClick={() => navigate(`/artwork/${art.id}`)}
        >
            <planeGeometry args={[2.3, 2.65]} />
            <meshStandardMaterial map={texture} roughness={0.5} metalness={0.0} toneMapped={true} />
        </mesh>
    );
}

/* ── Fallback plane ─────────────────────────────────────────────────────────── */
function FallbackCanvas({ art }) {
    const accent = art?.accent || '#8a2be2';
    const fallbackTex = useMemo(() => makeGradientTexture(accent), [accent]);
    return (
        <mesh position={[0, 0.1, 0.06]}>
            <planeGeometry args={[2.3, 2.65]} />
            <meshStandardMaterial map={fallbackTex} roughness={0.6} metalness={0.0} />
        </mesh>
    );
}

/* ── Single artwork frame ───────────────────────────────────────────────────── */
export function ArtFrame({ art, position, rotation }) {
    const [hovered, setHovered] = useState(false);
    const frameRef = useRef();
    const navigate = useNavigate();
    const accent = art?.accent || '#8a2be2';

    useFrame(() => {
        if (frameRef.current) {
            frameRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
                frameRef.current.material.emissiveIntensity,
                hovered ? 0.6 : 0.08,
                0.08
            );
        }
    });

    const priceLabel = typeof art?.price === 'object'
        ? `${art.price.value} ${art.price.currency}`
        : (art?.price || '');

    return (
        <group position={position} rotation={rotation}>
            <mesh
                ref={frameRef}
                castShadow
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
                onClick={() => navigate(`/artwork/${art.id}`)}
            >
                <boxGeometry args={[2.6, 3.2, 0.1]} />
                <meshStandardMaterial
                    color={hovered ? '#2a1040' : '#1a1a1a'}
                    metalness={0.95}
                    roughness={0.1}
                    emissive={new THREE.Color(accent)}
                    emissiveIntensity={0.08}
                />
            </mesh>

            <TextureErrorBoundary fallback={<FallbackCanvas art={art} />}>
                <Suspense fallback={<FallbackCanvas art={art} />}>
                    <ArtImageCanvas art={art} navigate={navigate} />
                </Suspense>
            </TextureErrorBoundary>

            <pointLight
                position={[0, 2.8, 1.2]}
                intensity={hovered ? 4 : 1.2}
                color={accent}
                distance={6}
            />

            <Text
                position={[0, -1.45, 0.1]}
                fontSize={0.16}
                color={hovered ? '#ffffff' : '#cccccc'}
                anchorX="center"
                anchorY="middle"
                font={undefined}
            >
                {art?.title || ''}
            </Text>
            <Text
                position={[0, -1.65, 0.1]}
                fontSize={0.12}
                color={accent}
                anchorX="center"
                anchorY="middle"
                font={undefined}
            >
                {priceLabel}
            </Text>
        </group>
    );
}

/* ── Gallery room walls/floor/ceiling ──────────────────────────────────────── */
export function GalleryRoom() {
    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#0d0d0d" metalness={0.7} roughness={0.2} />
            </mesh>
            {/* Back wall */}
            <mesh position={[0, 2, -5]} receiveShadow>
                <boxGeometry args={[20, 6, 0.2]} />
                <meshStandardMaterial color="#121212" roughness={1} />
            </mesh>
            {/* Left wall */}
            <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                <boxGeometry args={[20, 6, 0.2]} />
                <meshStandardMaterial color="#121212" roughness={1} />
            </mesh>
            {/* Right wall */}
            <mesh position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
                <boxGeometry args={[20, 6, 0.2]} />
                <meshStandardMaterial color="#121212" roughness={1} />
            </mesh>
            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#0a0a0a" roughness={1} />
            </mesh>
            {/* Ceiling spotlights */}
            {[-3, 0, 3].map((x, i) => (
                <group key={i} position={[x, 4.5, -1]}>
                    <mesh>
                        <boxGeometry args={[0.25, 0.05, 0.25]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
                    </mesh>
                    <pointLight intensity={0.4} color="#fff9f0" distance={8} />
                </group>
            ))}
            {/* Purple floor trims */}
            <mesh position={[0, -0.59, -4.9]}>
                <boxGeometry args={[10, 0.02, 0.04]} />
                <meshStandardMaterial color="#8a2be2" emissive="#8a2be2" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[-4.9, -0.59, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[10, 0.02, 0.04]} />
                <meshStandardMaterial color="#8a2be2" emissive="#8a2be2" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[4.9, -0.59, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[10, 0.02, 0.04]} />
                <meshStandardMaterial color="#8a2be2" emissive="#8a2be2" emissiveIntensity={0.8} />
            </mesh>
        </group>
    );
}

/* ── Compute positions for an arbitrary number of artworks ─────────────────── */
function buildGalleryFrames(artworks) {
    // Wall slot positions: back wall first, then left/right alternating
    const slots = [
        // Back wall (z = -4.8), up to 4 across
        { position: [-4.5, 1.2, -4.8], rotation: [0, 0, 0] },
        { position: [-1.5, 1.2, -4.8], rotation: [0, 0, 0] },
        { position: [1.5, 1.2, -4.8],  rotation: [0, 0, 0] },
        { position: [4.5, 1.2, -4.8],  rotation: [0, 0, 0] },
        // Left wall (x = -4.8), rotating towards viewer
        { position: [-4.8, 1.2, -2.5], rotation: [0, Math.PI / 2, 0] },
        { position: [-4.8, 1.2,  0.5], rotation: [0, Math.PI / 2, 0] },
        { position: [-4.8, 1.2,  3.0], rotation: [0, Math.PI / 2, 0] },
        // Right wall (x = 4.8)
        { position: [4.8, 1.2, -2.5],  rotation: [0, -Math.PI / 2, 0] },
        { position: [4.8, 1.2,  0.5],  rotation: [0, -Math.PI / 2, 0] },
        { position: [4.8, 1.2,  3.0],  rotation: [0, -Math.PI / 2, 0] },
    ];

    return artworks.slice(0, slots.length).map((art, i) => ({
        art: { ...art, accent: art.accent || '#8a2be2' },
        position: slots[i].position,
        rotation: slots[i].rotation,
    }));
}

/* ── Main Gallery component ─────────────────────────────────────────────────── */
const Gallery = () => {
    const [allArtworks, setAllArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch('http://localhost:5005/api/artworks');
                if (res.ok) {
                    const apiData = await res.json();
                    // Normalize API data to match the shape the gallery expects
                    const normalized = apiData.map(a => ({
                        ...a,
                        img: a.img || (a.images?.[0]?.url) || '',
                        accent: a.accent || '#8a2be2',
                        price: typeof a.price === 'object' ? `${a.price.value} ${a.price.currency}` : a.price,
                    }));
                    // Merge: prefer API data, add fallback artworks that aren't already in API
                    const apiIds = new Set(normalized.map(a => String(a.id)));
                    const fallbackOnly = FALLBACK_ARTWORKS.filter(a => !apiIds.has(String(a.id)));
                    setAllArtworks([...normalized, ...fallbackOnly]);
                } else {
                    setAllArtworks(FALLBACK_ARTWORKS);
                }
            } catch {
                setAllArtworks(FALLBACK_ARTWORKS);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const galleryFrames = useMemo(() => buildGalleryFrames(allArtworks), [allArtworks]);

    return (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, background: '#050505' }}>
            {/* HUD */}
            <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 18px', color: '#fff' }}>
                <div style={{ fontSize: 17, fontWeight: 700, background: 'linear-gradient(to right, #8a2be2, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Virtual Exhibition
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                    🖱 Drag to look around &nbsp;|&nbsp; 🔍 Scroll to zoom &nbsp;|&nbsp; 👆 Click artwork
                </div>
            </div>
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, background: 'rgba(138,43,226,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(138,43,226,0.3)', borderRadius: 10, padding: '8px 16px', color: '#a855f7', fontSize: 13, fontWeight: 600 }}>
                {loading ? 'Loading...' : `${allArtworks.length} Artworks on Display`}
            </div>

            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontSize: 18 }}>
                    Loading Gallery...
                </div>
            ) : (
                <Canvas shadows camera={{ position: [0, 1.4, 7], fov: 65 }} gl={{ antialias: true }}>
                    <color attach="background" args={['#050505']} />
                    <fog attach="fog" args={['#050505', 8, 20]} />
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[0, 8, 2]} intensity={0.8} castShadow />

                    <Suspense fallback={null}>
                        <GalleryRoom />
                        {galleryFrames.map((frame, i) => (
                            <ArtFrame key={`${frame.art.id}-${i}`} {...frame} />
                        ))}
                        <ContactShadows position={[0, -0.59, 0]} opacity={0.6} scale={12} blur={2.5} far={4} />
                        <Environment preset="night" />
                    </Suspense>

                    <OrbitControls
                        enablePan={false}
                        minDistance={2.5}
                        maxDistance={9}
                        minPolarAngle={Math.PI / 5}
                        maxPolarAngle={Math.PI / 1.9}
                        enableDamping
                        dampingFactor={0.05}
                    />
                </Canvas>
            )}
        </div>
    );
};

export default Gallery;

