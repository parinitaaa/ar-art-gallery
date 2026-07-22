import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ShoppingCart, RotateCcw, ZoomIn, Maximize2, Eye, Loader2, X } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useCart } from '../components/CartContext';
import { GalleryRoom, ArtFrame } from './Gallery';


import { ARTWORKS as FALLBACK_ARTWORKS } from '../data/artworks';

const ArtworkDetails = () => {
    const { id } = useParams();
    const [art, setArt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const { cart, addToCart } = useCart();
    const isArtInCart = art ? cart.some(item => item.id === art.id) : false;
    const [zoomed, setZoomed] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [show3D, setShow3D] = useState(false);
    
    const [offerOpen, setOfferOpen] = useState(false);
    const [offerAmount, setOfferAmount] = useState('');
    const [offerMsg, setOfferMsg] = useState('');

    useEffect(() => {
        const fetchArtwork = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:5005/api/artworks/${id}`);

                if (!res.ok) throw new Error('Artwork not found in API');

                const data = await res.json();
                setArt(data);
            } catch (err) {
                console.warn('API fetch failed, searching in fallback data...', err.message);
                const fallback = FALLBACK_ARTWORKS.find(a => a.id.toString() === id.toString()) || FALLBACK_ARTWORKS[0];
                setArt(fallback);
            } finally {
                setLoading(false);
            }
        };

        fetchArtwork();
    }, [id]);

    if (loading || !art) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#6b7280' }}>
                <Loader2 size={48} className="animate-spin" style={{ color: '#8a2be2', marginBottom: 16 }} />
                <p>Decoding digital signals...</p>
                <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px 60px' }}>
            {/* Back link */}
            <Link to="/collection" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9ca3af', textDecoration: 'none', marginBottom: 32, fontSize: 14, transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = '#fff'}
                onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
            >
                <ArrowLeft size={16} /> Back to Collection
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48 }}>

                {/* ── LEFT: ARTWORK VIEWER ── */}
                <div>
                    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, overflow: 'hidden' }}>
                        <div style={{ position: 'relative', overflow: 'hidden', cursor: zoomed ? 'zoom-out' : 'zoom-in' }} onClick={() => setZoomed(z => !z)}>
                            <img
                                src={art.img}
                                alt={art.title}
                                style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block', transition: 'transform 0.5s', transform: `rotate(${rotation}deg) scale(${zoomed ? 1.4 : 1})` }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', border: `1px solid ${art.accent}66`, color: art.accent, fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 99 }}>
                                {art.badge}
                            </div>
                            <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', borderRadius: 99, padding: '5px 12px', color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                <Eye size={13} /> {art.likes * 42 || 3412} views
                            </div>
                        </div>

                        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'center', gap: 10 }}>
                            {[
                                { icon: <RotateCcw size={15} />, label: 'Rotate', action: () => setRotation(r => r + 90) },
                                { icon: <ZoomIn size={15} />, label: 'Zoom', action: () => setZoomed(z => !z) },
                                { icon: <Maximize2 size={15} />, label: '3D View', action: () => setShow3D(true) },
                            ].map((ctrl, i) => (
                                <button key={i} onClick={ctrl.action} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', fontSize: 12, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}
                                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#9ca3af'; }}
                                >
                                    {ctrl.icon} {ctrl.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: INFO & PURCHASE ── */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{art.title}</h1>
                            <Link to="/artists" style={{ color: art.accent, textDecoration: 'none', fontWeight: 600, fontSize: 16, marginTop: 6, display: 'block' }}>by {art.artist}</Link>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setLiked(l => !l)} style={{ width: 44, height: 44, borderRadius: '50%', background: liked ? '#dc354522' : 'rgba(255,255,255,0.06)', border: `1px solid ${liked ? '#dc3545aa' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                                <Heart size={18} fill={liked ? '#dc3545' : 'none'} color={liked ? '#dc3545' : '#9ca3af'} />
                            </button>
                            <button style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Share2 size={18} color="#9ca3af" />
                            </button>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${art.accent}44`, borderRadius: 18, padding: '24px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: `radial-gradient(circle, ${art.accent}33, transparent)`, borderRadius: '50%' }} />
                        <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 4 }}>Current Price</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
                            <span style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>{art.price}</span>
                            <span style={{ color: '#6b7280', fontSize: 16 }}>{art.usd || '$450'}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => addToCart(art)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: isArtInCart ? '#15803d' : `linear-gradient(135deg, ${art.accent}, #a855f7)`, border: 'none', color: '#fff', fontWeight: 700, fontSize: 15, padding: '14px', borderRadius: 12, cursor: 'pointer', boxShadow: `0 0 20px ${art.accent}44`, transition: 'all 0.3s' }}>
                                <ShoppingCart size={18} />
                                {isArtInCart ? '✓ Added to Cart' : 'Add to Cart'}
                            </button>
                            <button onClick={() => setOfferOpen(true)} style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: 15, padding: '14px', borderRadius: 12, cursor: 'pointer', transition: 'background 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                            >
                                Make Offer
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 10, fontSize: 17 }}>About This Piece</h3>
                        <p style={{ color: '#9ca3af', lineHeight: 1.75, margin: 0 }}>{art.description}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24 }}>
                        {[
                            { label: 'Category', value: art.category || art.badge },
                            { label: 'Style', value: art.style || art.badge },
                            { label: 'Dimensions', value: art.dimensions || '2000 x 2500 px' },
                            { label: 'Authenticity', value: '✅ Verified' },
                        ].map((m, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '13px 16px' }}>
                                <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>{m.label}</div>
                                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{m.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            
            {show3D && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column' }}>
                    <button onClick={() => setShow3D(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 44, height: 44, color: '#fff', cursor: 'pointer', zIndex: 10 }}>
                        <X size={24} style={{ margin: 'auto' }} />
                    </button>
                    <Canvas shadows camera={{ position: [0, 1.4, 4], fov: 65 }} gl={{ antialias: true }}>
                        <color attach="background" args={['#050505']} />
                        <fog attach="fog" args={['#050505', 8, 20]} />
                        <ambientLight intensity={0.3} />
                        <directionalLight position={[0, 8, 2]} intensity={0.8} castShadow />
                        
                        <Suspense fallback={null}>
                            <GalleryRoom />
                            <ArtFrame art={art} position={[0, 1.2, -4.8]} rotation={[0, 0, 0]} />
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
                </div>
            )}

            {offerOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                    <div style={{ width: '100%', maxWidth: 440, background: '#111', border: `1px solid ${art.accent}66`, borderRadius: 24, padding: 32, position: 'relative', boxShadow: `0 0 40px ${art.accent}33` }}>
                        <button onClick={() => setOfferOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                        <h2 style={{ margin: '0 0 8px 0', fontSize: 24, fontWeight: 800, color: '#fff' }}>Make an Offer</h2>
                        <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 24 }}>Offer for <strong style={{ color: '#fff' }}>{art.title}</strong> by {art.artist}</p>

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', color: '#9ca3af', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Offer Amount (ETH)</label>
                            <input type="number" step="0.01" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} placeholder="e.g. 0.5" style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px', color: '#fff', fontSize: 15, outline: 'none' }} />
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', color: '#9ca3af', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Message (Optional)</label>
                            <textarea value={offerMsg} onChange={e => setOfferMsg(e.target.value)} placeholder="Introduce yourself or explain why you want this piece..." rows={3} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px', color: '#fff', fontSize: 15, outline: 'none', resize: 'vertical' }} />
                        </div>
                        
                        <button onClick={() => { alert(`Success! Your offer of ${offerAmount} ETH has been sent to ${art.artist}.`); setOfferOpen(false); setOfferAmount(''); setOfferMsg(''); }} style={{ width: '100%', background: `linear-gradient(135deg, ${art.accent}, #a855f7)`, border: 'none', color: '#fff', fontWeight: 700, fontSize: 15, padding: '14px', borderRadius: 12, cursor: 'pointer', transition: 'filter 0.2s' }} onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'} onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}>
                            Submit Offer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArtworkDetails;
