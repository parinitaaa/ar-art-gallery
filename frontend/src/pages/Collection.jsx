import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid, List, SlidersHorizontal, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { ARTWORKS as FALLBACK_ARTWORKS } from '../data/artworks';

const CATEGORIES = ['All', 'Abstract', 'Digital', 'Geometric', 'Expressionist', 'Pop Art', 'Generative'];

export default function Collection() {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('popular');
    const [viewMode, setViewMode] = useState('grid');
    const [liked, setLiked] = useState({});

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                setLoading(true);
                const res = await fetch('http://localhost:5000/api/artworks');

                if (!res.ok) throw new Error('API fetch failed');

                const data = await res.json();
                setArtworks(data && data.length > 0 ? data : FALLBACK_ARTWORKS);
            } catch (err) {
                console.warn('API offline, using fallback data:', err.message);
                setArtworks(FALLBACK_ARTWORKS);
            } finally {
                setLoading(false);
            }
        };

        fetchArtworks();
    }, []);

    const filtered = artworks.filter(a => {
        const titleMatch = a.title?.toLowerCase().includes(search.toLowerCase());
        const artistMatch = a.artist?.toLowerCase().includes(search.toLowerCase());
        const matchSearch = titleMatch || artistMatch;
        const matchCat = activeCategory === 'All' || a.badge === activeCategory;
        return matchSearch && matchCat;
    }).sort((a, b) => {
        if (sortBy === 'popular') return (b.likes || 0) - (a.likes || 0);
        if (sortBy === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
        if (sortBy === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
        return 0;
    });

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px 60px' }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ margin: '0 0 8px', fontSize: 36, fontWeight: 900, color: '#fff' }}>Browse Collection</h1>
                <p style={{ margin: 0, color: '#6b7280' }}>Explore {artworks.length} artworks from world-class digital artists</p>
            </div>

            {/* Search + Controls */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search artworks or artists..."
                        style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px 11px 40px', color: '#fff', fontSize: 14, outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = '#8a2be2'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <SlidersHorizontal size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px 11px 36px', color: '#fff', fontSize: 14, outline: 'none', cursor: 'pointer', paddingRight: 20 }}>
                        <option value="popular" style={{ background: '#1a1a1a' }}>Most Popular</option>
                        <option value="price-asc" style={{ background: '#1a1a1a' }}>Price: Low to High</option>
                        <option value="price-desc" style={{ background: '#1a1a1a' }}>Price: High to Low</option>
                    </select>
                </div>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
                    {[{ mode: 'grid', icon: <Grid size={18} /> }, { mode: 'list', icon: <List size={18} /> }].map(({ mode, icon }) => (
                        <button key={mode} onClick={() => setViewMode(mode)} style={{ padding: '11px 14px', background: viewMode === mode ? 'rgba(138,43,226,0.3)' : 'transparent', border: 'none', color: viewMode === mode ? '#a855f7' : '#6b7280', cursor: 'pointer', transition: 'all 0.2s' }}>
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Filters */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                        padding: '8px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                        background: activeCategory === cat ? '#8a2be2' : 'rgba(255,255,255,0.06)',
                        border: activeCategory === cat ? '1px solid #8a2be2' : '1px solid rgba(255,255,255,0.1)',
                        color: activeCategory === cat ? '#fff' : '#9ca3af',
                        boxShadow: activeCategory === cat ? '0 0 12px rgba(138,43,226,0.4)' : 'none',
                    }}>
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, color: '#6b7280' }}>
                    <Loader2 size={48} className="animate-spin" style={{ color: '#8a2be2', marginBottom: 16 }} />
                    <p>Fetching digital treasures...</p>
                </div>
            ) : (
                <>
                    <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Showing <span style={{ color: '#fff', fontWeight: 600 }}>{filtered.length}</span> artworks</p>

                    {/* Artworks */}
                    <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', gap: 20 }}>
                        {filtered.map(art => (
                            viewMode === 'grid' ? (
                                <div key={art.id} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden', transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s', cursor: 'pointer' }}
                                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = art.accent + '66'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${art.accent}22`; }}
                                    onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
                                        <img src={art.img} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', display: 'block' }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                                        <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: `1px solid ${art.accent}66`, color: art.accent, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99 }}>
                                            {art.badge}
                                        </div>
                                        <button onClick={(e) => { e.preventDefault(); setLiked(l => ({ ...l, [art.id]: !l[art.id] })); }} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <Heart size={14} fill={liked[art.id] ? '#dc3545' : 'none'} color={liked[art.id] ? '#dc3545' : '#fff'} />
                                        </button>
                                        <div style={{ position: 'absolute', bottom: 10, left: 12, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>by {art.artist}</div>
                                    </div>

                                    <div style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                            <Link to={`/artwork/${art.id}`} style={{ fontWeight: 700, color: '#fff', textDecoration: 'none', fontSize: 16, lineHeight: 1.2 }}>
                                                {art.title}
                                            </Link>
                                            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                                                <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{art.price}</div>
                                                <div style={{ color: '#6b7280', fontSize: 11 }}>{art.usd}</div>
                                            </div>
                                        </div>
                                        <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: art.accent + '22', border: `1px solid ${art.accent}44`, color: art.accent, fontWeight: 600, fontSize: 13, padding: '9px', borderRadius: 10, cursor: 'pointer', transition: 'background 0.2s' }}
                                            onMouseOver={e => e.currentTarget.style.background = art.accent + '44'}
                                            onMouseOut={e => e.currentTarget.style.background = art.accent + '22'}
                                        >
                                            <ShoppingCart size={14} /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div key={art.id} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 18, padding: 16, transition: 'border-color 0.2s, box-shadow 0.2s' }}
                                    onMouseOver={e => { e.currentTarget.style.borderColor = art.accent + '55'; e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3)`; }}
                                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={art.img} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Link to={`/artwork/${art.id}`} style={{ fontWeight: 700, color: '#fff', textDecoration: 'none', fontSize: 16, display: 'block', marginBottom: 4 }}>{art.title}</Link>
                                        <div style={{ color: '#6b7280', fontSize: 13 }}>by {art.artist} · <span style={{ background: art.accent + '22', color: art.accent, fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>{art.badge}</span></div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0 }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>{art.price}</div>
                                            <div style={{ color: '#6b7280', fontSize: 12 }}>{art.usd}</div>
                                        </div>
                                        <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #8a2be2, #a855f7)', border: 'none', color: '#fff', fontWeight: 600, fontSize: 13, padding: '10px 20px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            <ShoppingCart size={14} /> Buy Now
                                        </button>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </>
            )}
            <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

