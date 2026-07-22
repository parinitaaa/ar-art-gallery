import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

export default function CartDrawer() {
    const { cart, removeFromCart, isCartOpen, setIsCartOpen, clearCart } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const total = cart.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);

    return (
        <>
            <div 
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} 
                onClick={() => setIsCartOpen(false)}
            />
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, maxWidth: '100vw',
                background: '#151515', zIndex: 1001, borderLeft: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontSize: 20 }}>
                        <ShoppingBag size={20} color="#a855f7" /> My Cart
                    </h2>
                    <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>
                            <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: 16, background: 'rgba(255,255,255,0.04)', padding: 12, borderRadius: 12, transition: 'background 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                >
                                    <img onClick={() => { setIsCartOpen(false); navigate(`/artwork/${item.id}`); }} src={item.img} alt={item.title} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', cursor: 'pointer' }} />
                                    <div onClick={() => { setIsCartOpen(false); navigate(`/artwork/${item.id}`); }} style={{ flex: 1, cursor: 'pointer' }}>
                                        <div style={{ fontWeight: 600, fontSize: 15 }}>{item.title}</div>
                                        <div style={{ color: '#9ca3af', fontSize: 13 }}>{item.artist}</div>
                                        <div style={{ color: '#a855f7', fontWeight: 700, marginTop: 4 }}>{item.price}</div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 18, fontWeight: 700 }}>
                            <span>Total</span>
                            <span>{total.toFixed(2)} ETH</span>
                        </div>
                        <button onClick={() => { alert('Checkout functionality coming soon!'); clearCart(); setIsCartOpen(false); }} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #8a2be2, #a855f7)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
