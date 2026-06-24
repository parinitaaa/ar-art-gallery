import { useState } from 'react';
import { TrendingUp, Image as ImageIcon, Package, Settings, LogOut, DollarSign, Eye, Heart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ARTWORKS } from '../data/artworks';

const TABS = [
    { id: 'overview', icon: <TrendingUp size={18} />, label: 'Overview' },
    { id: 'artworks', icon: <ImageIcon size={18} />, label: 'My Artworks' },
    { id: 'orders', icon: <Package size={18} />, label: 'Orders' },
    { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
];

const STATS = [
    { label: 'Total Revenue', value: '4.25 ETH', subtext: '+12% this month', icon: <DollarSign size={20} />, color: '#10b981' },
    { label: 'Active Artworks', value: '12', subtext: '3 sold this month', icon: <ImageIcon size={20} />, color: '#3b82f6' },
    { label: 'Profile Views', value: '8,412', subtext: '+2.1k this week', icon: <Eye size={20} />, color: '#f59e0b' },
    { label: 'Total Likes', value: '1,248', subtext: 'Across all artworks', icon: <Heart size={20} />, color: '#ec4899' },
];

const RECENT_ARTWORKS = [
    { ...ARTWORKS[0], status: 'active', views: 342, likes: 89 },
    { ...ARTWORKS[1], status: 'sold', views: 561, likes: 134 },
    { ...ARTWORKS[2], status: 'active', views: 218, likes: 67 },
];

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div style={{ display: 'flex', gap: 28, maxWidth: 1200, margin: '0 auto', padding: '24px 16px 60px' }}>

            {/* ── SIDEBAR ── */}
            <aside style={{
                width: 220, flexShrink: 0,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: 20,
                display: 'flex', flexDirection: 'column',
                height: 'fit-content', position: 'sticky', top: 88,
            }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #8a2be2, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff' }}>
                        EV
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>Elena V.</div>
                        <div style={{ fontSize: 11, color: '#8a2be2', background: 'rgba(138,43,226,0.15)', padding: '2px 8px', borderRadius: 99, marginTop: 4, display: 'inline-block', border: '1px solid rgba(138,43,226,0.3)' }}>Artist</div>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 14px', borderRadius: 10, border: 'none',
                            background: activeTab === tab.id ? 'rgba(138,43,226,0.2)' : 'transparent',
                            color: activeTab === tab.id ? '#fff' : '#6b7280',
                            fontWeight: activeTab === tab.id ? 600 : 400,
                            cursor: 'pointer', fontSize: 14, textAlign: 'left',
                            borderLeft: activeTab === tab.id ? '3px solid #8a2be2' : '3px solid transparent',
                            transition: 'all 0.2s',
                        }}>
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <button style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 10, border: 'none',
                    background: 'transparent', color: '#ef4444',
                    cursor: 'pointer', fontSize: 14, marginTop: 16,
                    borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16,
                }}>
                    <LogOut size={18} /> Sign Out
                </button>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main style={{ flex: 1, minWidth: 0 }}>
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', textTransform: 'capitalize' }}>{activeTab}</h1>
                    <p style={{ margin: '6px 0 0', color: '#6b7280' }}>
                        {activeTab === 'overview' ? 'Your gallery performance at a glance' : `Manage your ${activeTab}`}
                    </p>
                </div>

                {activeTab === 'overview' && (
                    <>
                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                            {STATS.map((s, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <div style={{ color: s.color, background: s.color + '22', width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {s.icon}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{s.value}</div>
                                    <div style={{ fontSize: 12, color: '#6b7280' }}>{s.label}</div>
                                    <div style={{ fontSize: 11, color: s.color, marginTop: 4 }}>{s.subtext}</div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Artworks */}
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, color: '#fff', fontWeight: 700 }}>Recent Artworks</h3>
                                <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #8a2be2, #a855f7)', border: 'none', color: '#fff', fontWeight: 600, fontSize: 13, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
                                    <Plus size={15} /> Upload New
                                </button>
                            </div>
                            {RECENT_ARTWORKS.map((art) => (
                                <div key={art.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={art.img} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Link to={`/artwork/${art.id}`} style={{ fontWeight: 600, color: '#fff', textDecoration: 'none', fontSize: 15 }}>{art.title}</Link>
                                        <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{art.views} views · {art.likes} likes</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>{art.price}</div>
                                        <span style={{
                                            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
                                            background: art.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(139,92,246,0.15)',
                                            color: art.status === 'active' ? '#10b981' : '#a855f7',
                                            border: `1px solid ${art.status === 'active' ? 'rgba(16,185,129,0.3)' : 'rgba(139,92,246,0.3)'}`,
                                        }}>
                                            {art.status === 'active' ? 'Active' : 'Sold'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'artworks' && (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 40, textAlign: 'center', color: '#6b7280' }}>
                        <ImageIcon size={48} style={{ margin: '0 auto 16px', display: 'block', color: '#374151' }} />
                        <p style={{ margin: 0 }}>Upload and manage your artworks here</p>
                        <button style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #8a2be2, #a855f7)', border: 'none', color: '#fff', fontWeight: 700, padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>
                            <Plus size={18} /> Upload Artwork
                        </button>
                    </div>
                )}

                {(activeTab === 'orders' || activeTab === 'settings') && (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 40, textAlign: 'center', color: '#6b7280' }}>
                        <p>This section is coming soon.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
