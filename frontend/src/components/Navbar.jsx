import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Palette, User, Menu, X, ShoppingCart, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';

const NAV_LINKS = [
    { to: '/gallery', label: 'Virtual Gallery' },
    { to: '/artists', label: 'Artists' },
    { to: '/collection', label: 'Browse' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const { cart, setIsCartOpen } = useCart();

    // Read auth from localStorage (updates on login/logout anywhere)
    const loadUser = () => {
        try {
            const stored = localStorage.getItem('ar_user');
            setUser(stored ? JSON.parse(stored) : null);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        loadUser();
        window.addEventListener('storage', loadUser);
        return () => window.removeEventListener('storage', loadUser);
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setDropdownOpen(false);
    }, [location.pathname]);

    // Close user dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('ar_token');
        localStorage.removeItem('ar_user');
        // Clear axios default auth header
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setDropdownOpen(false);
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

    // Avatar initials
    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '';

    return (
        <nav style={{
            background: 'rgba(10,10,10,0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            position: 'sticky', top: 0, zIndex: 100,
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                    <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #8a2be2, #a855f7)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Palette size={20} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: 2, color: '#fff' }}>
                        AR<span style={{ color: '#a855f7' }}>ART</span>
                    </span>
                </Link>

                {/* Desktop nav links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
                    {NAV_LINKS.map(link => (
                        <Link key={link.to} to={link.to} style={{
                            color: location.pathname === link.to ? '#a855f7' : '#9ca3af',
                            textDecoration: 'none', fontWeight: 500, fontSize: 14,
                            transition: 'color 0.2s',
                            borderBottom: location.pathname === link.to ? '2px solid #a855f7' : '2px solid transparent',
                            paddingBottom: 2,
                        }}
                            onMouseOver={e => e.currentTarget.style.color = '#fff'}
                            onMouseOut={e => e.currentTarget.style.color = location.pathname === link.to ? '#a855f7' : '#9ca3af'}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => setIsCartOpen(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', transition: 'color 0.2s', position: 'relative' }}
                        onMouseOver={e => e.currentTarget.style.color = '#fff'}
                        onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
                    >
                        <ShoppingCart size={22} />
                        {cart.length > 0 && (
                            <span style={{ position: 'absolute', top: -8, right: -10, background: '#a855f7', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 6px', borderRadius: 99 }}>
                                {cart.length}
                            </span>
                        )}
                    </button>

                    {user ? (
                        /* ── Logged-in: avatar + dropdown ── */
                        <div ref={dropdownRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => setDropdownOpen(prev => !prev)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: 'rgba(138,43,226,0.15)',
                                    border: '1px solid rgba(138,43,226,0.4)',
                                    borderRadius: 99, padding: '5px 12px 5px 5px',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(138,43,226,0.28)'}
                                onMouseOut={e => e.currentTarget.style.background = 'rgba(138,43,226,0.15)'}
                            >
                                {/* Avatar circle */}
                                <div style={{
                                    width: 30, height: 30, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #8a2be2, #a855f7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0,
                                }}>
                                    {initials}
                                </div>
                                <span style={{ color: '#e2d9f3', fontSize: 13, fontWeight: 600, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.name?.split(' ')[0]}
                                </span>
                                <ChevronDown size={14} color="#a855f7" style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                            </button>

                            {/* Dropdown menu */}
                            {dropdownOpen && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                                    background: '#151515', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 14, padding: 6, minWidth: 190,
                                    boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                                    zIndex: 200,
                                }}>
                                    {/* User info header */}
                                    <div style={{ padding: '10px 12px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 4 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{user.name}</div>
                                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{user.email}</div>
                                        <div style={{ marginTop: 6, display: 'inline-block', background: 'rgba(138,43,226,0.2)', border: '1px solid rgba(138,43,226,0.35)', borderRadius: 99, padding: '2px 9px', fontSize: 11, color: '#a855f7', fontWeight: 600, textTransform: 'capitalize' }}>
                                            {user.role}
                                        </div>
                                    </div>

                                    {[
                                        { to: '/dashboard', label: '🗂️  Dashboard' },
                                        { to: '/collection', label: '🎨  My Collection' },
                                    ].map(item => (
                                        <Link key={item.to} to={item.to}
                                            onClick={() => setDropdownOpen(false)}
                                            style={{
                                                display: 'block', padding: '9px 12px', color: '#d1d5db',
                                                textDecoration: 'none', fontSize: 13, fontWeight: 500,
                                                borderRadius: 8, transition: 'background 0.15s',
                                            }}
                                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}

                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 4, paddingTop: 4 }}>
                                        <button type="button" onClick={handleLogout} style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            width: '100%', padding: '9px 12px', background: 'transparent',
                                            border: 'none', cursor: 'pointer', color: '#f87171',
                                            fontSize: 13, fontWeight: 500, borderRadius: 8,
                                            transition: 'background 0.15s', textAlign: 'left',
                                        }}
                                            onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <LogOut size={14} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ── Logged-out: Sign In button ── */
                        <Link to="/login" style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: 'rgba(138,43,226,0.15)',
                            border: '1px solid rgba(138,43,226,0.4)',
                            color: '#a855f7', textDecoration: 'none',
                            fontWeight: 600, fontSize: 14,
                            padding: '8px 16px', borderRadius: 99,
                            transition: 'all 0.2s',
                        }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(138,43,226,0.3)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(138,43,226,0.15)'; e.currentTarget.style.color = '#a855f7'; }}
                        >
                            <User size={16} /> Sign In
                        </Link>
                    )}

                    {/* Mobile menu toggle */}
                    <button type="button" onClick={() => setIsOpen(!isOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'none' }} className="mobile-menu-btn">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 20px 20px' }}>
                    {NAV_LINKS.map(link => (
                        <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)} style={{ display: 'block', color: '#9ca3af', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 500 }}>
                            {link.label}
                        </Link>
                    ))}
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} style={{ display: 'block', color: '#9ca3af', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 500 }}>
                                🗂️ Dashboard
                            </Link>
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#f87171', padding: '12px 0', fontWeight: 600, cursor: 'pointer', fontSize: 14, marginTop: 4 }}>
                                <LogOut size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Sign Out
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)} style={{ display: 'block', color: '#a855f7', textDecoration: 'none', padding: '12px 0', fontWeight: 600, marginTop: 4 }}>
                            Sign In
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
