import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Star, Image as ImageIcon } from 'lucide-react';
import { ARTWORKS as FALLBACK_ARTWORKS } from '../data/artworks';

const BASE_STATIC_ARTISTS = [
    { id: 1, name: 'Elena V.', handle: '@elenav', bio: 'Abstract digital painter exploring emotion through vivid chromatic geometry.', artworks: 12, followers: '8.2K', sales: '4.1 ETH', accent: '#8a2be2', avatar: '#6a0dad', categories: ['Abstract', 'Digital'] },
    { id: 2, name: 'Marco T.', handle: '@marcot', bio: 'Neon-inspired visuals from the intersection of city life and digital consciousness.', artworks: 9, followers: '6.7K', sales: '3.5 ETH', accent: '#3b82f6', avatar: '#0d1b6e', categories: ['Digital', 'Neon'] },
    { id: 3, name: 'Sia R.', handle: '@siar', bio: 'Generative artist using code and mathematics to create sacred geometric forms.', artworks: 15, followers: '11.4K', sales: '7.2 ETH', accent: '#10b981', avatar: '#065f46', categories: ['Geometric', 'Generative'] },
    { id: 4, name: 'Lena K.', handle: '@lenak', bio: 'Expressionist works that find beauty in controlled disorder and raw emotion.', artworks: 7, followers: '4.3K', sales: '2.0 ETH', accent: '#fd7e14', avatar: '#7c2d12', categories: ['Expressionist', 'Abstract'] },
    { id: 5, name: 'Ryu O.', handle: '@ryuo', bio: 'Pop art for the digital age — vibrant, bold, and unapologetically urban.', artworks: 11, followers: '9.8K', sales: '5.9 ETH', accent: '#dc3545', avatar: '#7f1d1d', categories: ['Pop Art', 'Urban'] },
    { id: 6, name: 'Kai M.', handle: '@kaim', bio: 'Minimalist digital sculptor creating art from light, shadow, and void.', artworks: 6, followers: '3.1K', sales: '1.8 ETH', accent: '#a855f7', avatar: '#1e1b4b', categories: ['Minimalist', 'Abstract'] },
];

export default function Artists() {
    const [artistsList, setArtistsList] = useState(BASE_STATIC_ARTISTS);

    useEffect(() => {
        const loadAllArtists = async () => {
            const userStr = localStorage.getItem('ar_user');
            const currentUser = userStr ? JSON.parse(userStr) : null;

            let allArtworks = FALLBACK_ARTWORKS;
            try {
                const res = await fetch('http://localhost:5005/api/artworks');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const normalized = data.map(a => ({
                            ...a,
                            artist: typeof a.artist === 'object' ? a.artist.name : (a.artist || 'Unknown Artist'),
                            badge: a.badge || a.category || 'Digital',
                            accent: a.accent || '#8a2be2'
                        }));
                        const apiIds = new Set(normalized.map(a => String(a.id)));
                        const fallbackOnly = FALLBACK_ARTWORKS.filter(a => !apiIds.has(String(a.id)));
                        allArtworks = [...normalized, ...fallbackOnly];
                    }
                }
            } catch {
                allArtworks = FALLBACK_ARTWORKS;
            }

            // Group artworks by artist name to calculate live stats
            const artistMap = {};
            allArtworks.forEach(art => {
                const name = art.artist || 'Digital Creator';
                if (!artistMap[name]) {
                    artistMap[name] = {
                        name: name,
                        count: 0,
                        categories: new Set(),
                        accent: art.accent || '#8a2be2',
                        sampleDesc: art.description || ''
                    };
                }
                artistMap[name].count += 1;
                if (art.badge) artistMap[name].categories.add(art.badge);
                if (art.category) artistMap[name].categories.add(art.category);
            });

            // Map static artists and update their live artwork count & bio from published works
            const updatedList = BASE_STATIC_ARTISTS.map(staticArtist => {
                const liveData = artistMap[staticArtist.name];
                if (liveData) {
                    return {
                        ...staticArtist,
                        artworks: Math.max(staticArtist.artworks, liveData.count),
                        bio: staticArtist.bio || liveData.sampleDesc
                    };
                }
                return staticArtist;
            });

            // Add any newly discovered artists from API that aren't in static list
            const knownNames = new Set(updatedList.map(a => a.name.toLowerCase()));
            
            Object.values(artistMap).forEach((liveArtist, idx) => {
                if (!knownNames.has(liveArtist.name.toLowerCase())) {
                    const handle = '@' + liveArtist.name.toLowerCase().replace(/\s+/g, '');
                    updatedList.push({
                        id: 'discovered-' + idx,
                        name: liveArtist.name,
                        handle: handle,
                        bio: liveArtist.sampleDesc || 'Digital creator publishing original artworks on AR Art Gallery.',
                        artworks: liveArtist.count,
                        followers: '1.4K',
                        sales: '1.2 ETH',
                        accent: liveArtist.accent,
                        avatar: '#3b0764',
                        categories: Array.from(liveArtist.categories).slice(0, 2)
                    });
                }
            });

            // Ensure current user is present if logged in
            if (currentUser && currentUser.name) {
                const userIndex = updatedList.findIndex(a => a.name.toLowerCase() === currentUser.name.toLowerCase());
                if (userIndex !== -1) {
                    updatedList[userIndex] = {
                        ...updatedList[userIndex],
                        bio: currentUser.bio || updatedList[userIndex].bio,
                        isUser: true
                    };
                } else {
                    const handle = '@' + currentUser.name.toLowerCase().replace(/\s+/g, '');
                    const userCard = {
                        id: 'user-' + (currentUser.id || Date.now()),
                        name: currentUser.name,
                        handle: handle,
                        bio: currentUser.bio || 'Digital creator & VR enthusiast publishing original artwork on AR Art Gallery.',
                        artworks: artistMap[currentUser.name]?.count || 1,
                        followers: '1.2K',
                        sales: '0.8 ETH',
                        accent: '#a855f7',
                        avatar: '#4c1d95',
                        categories: ['Digital', '3D'],
                        isUser: true
                    };
                    updatedList.unshift(userCard);
                }
            }

            setArtistsList(updatedList);
        };

        loadAllArtists();
    }, []);

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px 60px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <div style={{ display: 'inline-flex', background: 'rgba(138,43,226,0.15)', border: '1px solid rgba(138,43,226,0.3)', borderRadius: 99, padding: '6px 20px', marginBottom: 20 }}>
                    <span style={{ color: '#a855f7', fontSize: 13, fontWeight: 600 }}>✦ Featured Creators</span>
                </div>
                <h1 style={{ margin: '0 0 12px', fontSize: 40, fontWeight: 900, color: '#fff' }}>Meet Our Artists</h1>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 16, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>The visionaries shaping our virtual gallery with their extraordinary digital works.</p>
            </div>

            {/* Artists grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                {artistsList.map((artist, i) => (
                    <div key={artist.id} style={{
                        background: 'rgba(255,255,255,0.04)', border: artist.isUser ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 20, overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s', position: 'relative',
                        boxShadow: artist.isUser ? '0 0 20px rgba(168,85,247,0.2)' : 'none'
                    }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = artist.accent + '66'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = artist.isUser ? '#a855f7' : 'rgba(255,255,255,0.08)'; }}
                    >
                        {/* Cover banner */}
                        <div style={{ height: 100, background: `linear-gradient(135deg, ${artist.avatar || '#3b0764'}, #0a0a0a)`, position: 'relative' }}>
                            <div style={{ position: 'absolute', bottom: -28, left: 24, width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${artist.accent || '#8a2be2'}, ${artist.avatar || '#3b0764'})`, border: '3px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: '#fff' }}>
                                {artist.name[0]}{(artist.name.split(' ')[1] || artist.name[1] || '').charAt(0).toUpperCase()}
                            </div>
                            {(i < 3 || artist.isUser) && (
                                <div style={{ position: 'absolute', top: 10, right: 14, background: artist.isUser ? 'rgba(168,85,247,0.8)' : 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', borderRadius: 99, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Star size={11} fill="#f59e0b" color="#f59e0b" />
                                    <span style={{ color: artist.isUser ? '#fff' : '#f59e0b', fontSize: 11, fontWeight: 700 }}>{artist.isUser ? 'You (Verified)' : 'Featured'}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '36px 24px 24px' }}>
                            {/* Name & handle */}
                            <div style={{ marginBottom: 10 }}>
                                <h3 style={{ margin: '0 0 2px', fontWeight: 800, fontSize: 18, color: '#fff' }}>{artist.name}</h3>
                                <span style={{ color: artist.accent || '#a855f7', fontSize: 13, fontWeight: 500 }}>{artist.handle}</span>
                            </div>

                            {/* Category badges */}
                            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                                {(artist.categories || ['Digital']).map(cat => (
                                    <span key={cat} style={{ background: (artist.accent || '#8a2be2') + '22', border: `1px solid ${(artist.accent || '#8a2be2')}44`, color: artist.accent || '#a855f7', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99 }}>{cat}</span>
                                ))}
                            </div>

                            <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>{artist.bio}</p>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                                {[
                                    { label: 'Works', value: artist.artworks },
                                    { label: 'Followers', value: artist.followers || '1.2K' },
                                    { label: 'Total Sales', value: artist.sales || '1.0 ETH' },
                                ].map(s => (
                                    <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                                        <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{s.value}</div>
                                        <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 10 }}>
                                <Link to={`/gallery`} style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    background: (artist.accent || '#8a2be2') + '22', border: `1px solid ${(artist.accent || '#8a2be2')}44`,
                                    color: artist.accent || '#a855f7', fontWeight: 600, fontSize: 13,
                                    padding: '10px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.2s',
                                }}
                                    onMouseOver={e => e.currentTarget.style.background = (artist.accent || '#8a2be2') + '44'}
                                    onMouseOut={e => e.currentTarget.style.background = (artist.accent || '#8a2be2') + '22'}
                                >
                                    <ImageIcon size={14} /> View Gallery
                                </Link>
                                <button style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Instagram size={16} />
                                </button>
                                <button style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Twitter size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
