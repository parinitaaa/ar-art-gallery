import { Link } from 'react-router-dom';
import { Twitter, Instagram, Globe, Star, Image as ImageIcon } from 'lucide-react';

const ARTISTS = [
    { id: 1, name: 'Elena V.', handle: '@elenav', bio: 'Abstract digital painter exploring emotion through vivid chromatic geometry.', artworks: 12, followers: '8.2K', sales: '4.1 ETH', accent: '#8a2be2', avatar: '#6a0dad', categories: ['Abstract', 'Digital'] },
    { id: 2, name: 'Marco T.', handle: '@marcot', bio: 'Neon-inspired visuals from the intersection of city life and digital consciousness.', artworks: 9, followers: '6.7K', sales: '3.5 ETH', accent: '#3b82f6', avatar: '#0d1b6e', categories: ['Digital', 'Neon'] },
    { id: 3, name: 'Sia R.', handle: '@siar', bio: 'Generative artist using code and mathematics to create sacred geometric forms.', artworks: 15, followers: '11.4K', sales: '7.2 ETH', accent: '#10b981', avatar: '#065f46', categories: ['Geometric', 'Generative'] },
    { id: 4, name: 'Lena K.', handle: '@lenak', bio: 'Expressionist works that find beauty in controlled disorder and raw emotion.', artworks: 7, followers: '4.3K', sales: '2.0 ETH', accent: '#fd7e14', avatar: '#7c2d12', categories: ['Expressionist', 'Abstract'] },
    { id: 5, name: 'Ryu O.', handle: '@ryuo', bio: 'Pop art for the digital age — vibrant, bold, and unapologetically urban.', artworks: 11, followers: '9.8K', sales: '5.9 ETH', accent: '#dc3545', avatar: '#7f1d1d', categories: ['Pop Art', 'Urban'] },
    { id: 6, name: 'Kai M.', handle: '@kaim', bio: 'Minimalist digital sculptor creating art from light, shadow, and void.', artworks: 6, followers: '3.1K', sales: '1.8 ETH', accent: '#a855f7', avatar: '#1e1b4b', categories: ['Minimalist', 'Abstract'] },
];

export default function Artists() {
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
                {ARTISTS.map((artist, i) => (
                    <div key={artist.id} style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 20, overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s',
                    }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = artist.accent + '44'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    >
                        {/* Cover banner */}
                        <div style={{ height: 100, background: `linear-gradient(135deg, ${artist.avatar}, #0a0a0a)`, position: 'relative' }}>
                            <div style={{ position: 'absolute', bottom: -28, left: 24, width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${artist.accent}, ${artist.avatar})`, border: '3px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: '#fff' }}>
                                {artist.name[0]}{artist.name.split(' ')[1][0]}
                            </div>
                            {i < 3 && (
                                <div style={{ position: 'absolute', top: 10, right: 14, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', borderRadius: 99, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Star size={11} fill="#f59e0b" color="#f59e0b" />
                                    <span style={{ color: '#f59e0b', fontSize: 11, fontWeight: 700 }}>Featured</span>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '36px 24px 24px' }}>
                            {/* Name & handle */}
                            <div style={{ marginBottom: 10 }}>
                                <h3 style={{ margin: '0 0 2px', fontWeight: 800, fontSize: 18, color: '#fff' }}>{artist.name}</h3>
                                <span style={{ color: artist.accent, fontSize: 13, fontWeight: 500 }}>{artist.handle}</span>
                            </div>

                            {/* Category badges */}
                            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                                {artist.categories.map(cat => (
                                    <span key={cat} style={{ background: artist.accent + '22', border: `1px solid ${artist.accent}44`, color: artist.accent, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99 }}>{cat}</span>
                                ))}
                            </div>

                            <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>{artist.bio}</p>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                                {[
                                    { label: 'Works', value: artist.artworks },
                                    { label: 'Followers', value: artist.followers },
                                    { label: 'Total Sales', value: artist.sales },
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
                                    background: artist.accent + '22', border: `1px solid ${artist.accent}44`,
                                    color: artist.accent, fontWeight: 600, fontSize: 13,
                                    padding: '10px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.2s',
                                }}
                                    onMouseOver={e => e.currentTarget.style.background = artist.accent + '44'}
                                    onMouseOut={e => e.currentTarget.style.background = artist.accent + '22'}
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
