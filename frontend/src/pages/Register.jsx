import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('collector');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Registration failed. Please try again.');
                setLoading(false);
                return;
            }

            // Auto-login: save token and user
            localStorage.setItem('ar_token', data.token);
            localStorage.setItem('ar_user', JSON.stringify(data.user));
            window.dispatchEvent(new Event('storage'));

            setSuccess(`Account created! Welcome, ${data.user.name}! Redirecting...`);
            setTimeout(() => navigate('/dashboard'), 1200);
        } catch (err) {
            setError('Could not connect to the server. Please check your connection.');
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: '11px 12px 11px 38px',
        color: '#fff', fontSize: 14, outline: 'none',
    };

    return (
        <div style={{ minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 440, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 36, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #3b82f6, #8a2be2, #ec4899)', borderRadius: '24px 24px 0 0' }} />

                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff' }}>Join the Platform</h2>
                    <p style={{ color: '#6b7280', marginTop: 8, fontSize: 14 }}>Start your collection or showcase your art</p>
                </div>

                {/* Error / success banners */}
                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, color: '#f87171', fontSize: 13 }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
                    </div>
                )}
                {success && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, color: '#34d399', fontSize: 13 }}>
                        <CheckCircle size={16} style={{ flexShrink: 0 }} /> {success}
                    </div>
                )}

                {/* Role toggle */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
                    {['collector', 'artist'].map(r => (
                        <button key={r} onClick={() => setRole(r)} type="button" style={{
                            flex: 1, padding: '10px', fontSize: 14, fontWeight: 600,
                            background: role === r ? 'linear-gradient(135deg, #8a2be2, #a855f7)' : 'transparent',
                            color: role === r ? '#fff' : '#6b7280',
                            border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                            textTransform: 'capitalize',
                        }}>
                            {r === 'collector' ? '🎨 Collector' : '✏️ Artist'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                        { icon: <User size={16} />, label: 'Full Name', value: name, onChange: setName, type: 'text', placeholder: 'Alex Doe' },
                        { icon: <Mail size={16} />, label: 'Email Address', value: email, onChange: setEmail, type: 'email', placeholder: 'name@example.com' },
                        { icon: <Lock size={16} />, label: 'Password', value: password, onChange: setPassword, type: 'password', placeholder: '•••••••• (min. 6 chars)' },
                    ].map((field, i) => (
                        <div key={i}>
                            <label style={{ display: 'block', color: '#9ca3af', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{field.label}</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>{field.icon}</span>
                                <input
                                    type={field.type} value={field.value}
                                    onChange={e => field.onChange(e.target.value)}
                                    placeholder={field.placeholder} required style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#8a2be2'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: loading ? 'rgba(138,43,226,0.4)' : 'linear-gradient(135deg, #8a2be2, #a855f7)',
                            border: 'none', color: '#fff', fontWeight: 700, fontSize: 15,
                            padding: '14px', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: 8, boxShadow: '0 0 20px rgba(138,43,226,0.3)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseOver={e => { if (!loading) { e.currentTarget.style.transform = 'scale(1.02)'; } }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                        {loading ? (
                            <>
                                <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                                Creating account...
                            </>
                        ) : (
                            <><LogIn size={18} /> Create Account</>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 14, marginTop: 24, marginBottom: 0 }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#8a2be2', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                </p>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Register;
