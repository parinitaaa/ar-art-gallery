import { Link } from 'react-router-dom';
import { ArrowRight, Box, Sparkles, TrendingUp, Users, Star } from 'lucide-react';
import { useState } from 'react';
import { ARTWORKS } from '../data/artworks';

const FEATURED = ARTWORKS.slice(0, 3);

const STATS = [
    { icon: <TrendingUp size={22} />, label: 'Artworks Listed', value: '12,500+' },
    { icon: <Users size={22} />, label: 'Active Artists', value: '3,200+' },
    { icon: <Star size={22} />, label: 'Collectors', value: '48,000+' },
    { icon: <Sparkles size={22} />, label: 'Total Sales', value: '$4.2M+' },
];

export default function Home() {
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <div style={{ minHeight: '90vh' }}>

            {/* ── HERO ── */}
            <section style={{ position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '80px 16px 60px' }}>
                <div style={{ position: 'absolute', top: '10%', left: '20%', width: 480, height: 480, background: 'radial-gradient(circle, rgba(138,43,226,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', bottom: '0%', right: '15%', width: 360, height: 360, background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(138,43,226,0.15)', border: '1px solid rgba(138,43,226,0.4)', borderRadius: 99, padding: '6px 16px 6px 8px', marginBottom: 32 }}>
                    <span style={{ background: '#8a2be2', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 99 }}>NEW</span>
                    <span style={{ color: '#ccc', fontSize: 13 }}>Experience our immersive 3D Gallery Mode</span>
                </div>

                <h1 style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 auto 24px', maxWidth: 800, color: '#fff' }}>
                    Discover Art in{' '}
                    <span style={{ background: 'linear-gradient(90deg, #8a2be2, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Virtual Reality
                    </span>
                </h1>

                <p style={{ position: 'relative', zIndex: 1, color: '#9ca3af', fontSize: 18, maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.7 }}>
                    Step into the future of art curation. Explore artworks in an immersive browser-based 3D gallery and collect exclusive digital pieces from artists worldwide.
                </p>

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/gallery" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #8a2be2, #a855f7)', color: '#fff', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 0 30px rgba(138,43,226,0.5)', transition: 'transform 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Box size={20} /> Enter 3D Gallery
                    </Link>
                    <Link to="/collection" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)', color: '#fff', fontWeight: 600, fontSize: 16, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                    >
                        Browse Collection <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* ── STATS BAR ── */}
            <section style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                    {STATS.map((s, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ color: '#8a2be2' }}>{s.icon}</div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: 20, color: '#fff' }}>{s.value}</div>
                                <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURED ARTWORKS ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto 80px', padding: '0 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <div>
                        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0 }}>Featured Artworks</h2>
                        <p style={{ color: '#6b7280', marginTop: 6, marginBottom: 0 }}>Curated picks from our top artists</p>
                    </div>
                    <Link to="/collection" style={{ color: '#8a2be2', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>View All →</Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                    {FEATURED.map((art) => (
                        <Link key={art.id} to={`/artwork/${art.id}`} style={{ textDecoration: 'none' }}
                            onMouseOver={() => setHoveredCard(art.id)}
                            onMouseOut={() => setHoveredCard(null)}
                        >
                            <div style={{
                                background: '#111', border: `1px solid ${hoveredCard === art.id ? art.accent + '55' : 'rgba(255,255,255,0.08)'}`,
                                borderRadius: 20, overflow: 'hidden',
                                transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
                                transform: hoveredCard === art.id ? 'translateY(-8px)' : 'none',
                                boxShadow: hoveredCard === art.id ? `0 24px 48px rgba(0,0,0,0.6), 0 0 24px ${art.accent}22` : 'none',
                            }}>
                                {/* Real artwork image */}
                                <div style={{ height: 260, position: 'relative', overflow: 'hidden' }}>
                                    <img src={art.img} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', display: 'block', transform: hoveredCard === art.id ? 'scale(1.08)' : 'scale(1)' }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
                                    <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: `1px solid ${art.accent}66`, color: art.accent, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99 }}>
                                        {art.badge}
                                    </div>
                                    <div style={{ position: 'absolute', bottom: 12, left: 14, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                                        by {art.artist}
                                    </div>
                                </div>

                                <div style={{ padding: '16px 18px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <h3 style={{ margin: 0, fontWeight: 700, fontSize: 17, color: '#fff' }}>{art.title}</h3>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>{art.price}</div>
                                            <div style={{ color: '#6b7280', fontSize: 12 }}>{art.usd}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: art.accent + '22', border: `1px solid ${art.accent}44`, color: art.accent, fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 8 }}>
                                        View in Gallery →
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── TRENDING MARQUEE STRIP ── */}
            <section style={{ overflow: 'hidden', marginBottom: 80, position: 'relative' }}>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 0', display: 'flex', gap: 0 }}>
                    <div style={{ display: 'flex', gap: 16, animation: 'marquee 30s linear infinite', whiteSpace: 'nowrap' }}>
                        {[...ARTWORKS, ...ARTWORKS].map((art, i) => (
                            <Link key={i} to={`/artwork/${art.id}`} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 99, padding: '8px 16px 8px 8px', flexShrink: 0 }}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={art.img} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <span style={{ color: '#ccc', fontSize: 13, fontWeight: 500 }}>{art.title}</span>
                                <span style={{ color: art.accent, fontSize: 13, fontWeight: 700 }}>{art.price}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
            </section>

            {/* ── ARTIST CTA BANNER ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto 80px', padding: '0 16px' }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(138,43,226,0.25), rgba(59,130,246,0.15))', border: '1px solid rgba(138,43,226,0.3)', borderRadius: 24, padding: '50px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, background: 'radial-gradient(circle, rgba(138,43,226,0.3), transparent)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, background: 'radial-gradient(circle, rgba(59,130,246,0.2), transparent)', borderRadius: '50%' }} />
                    <Sparkles size={36} style={{ color: '#a855f7', marginBottom: 16 }} />
                    <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Are you an Artist?</h2>
                    <p style={{ color: '#9ca3af', fontSize: 16, maxWidth: 500, margin: '0 auto 32px' }}>
                        Showcase your work in our immersive 3D gallery and sell directly to collectors worldwide.
                    </p>
                    <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #8a2be2, #a855f7)', color: '#fff', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 0 25px rgba(138,43,226,0.4)' }}>
                        Join as Artist <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
