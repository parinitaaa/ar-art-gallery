import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5005/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Login failed. Please try again.');
                setLoading(false);
                return;
            }

            // Save token and user info
            localStorage.setItem('ar_token', data.token);
            localStorage.setItem('ar_user', JSON.stringify(data.user));

            setSuccess(`Welcome back, ${data.user.name}! Redirecting...`);

            // Dispatch storage event so Navbar updates immediately
            window.dispatchEvent(new Event('storage'));

            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            setError('Could not connect to the server. Please check your connection.');
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: '12px 12px 12px 38px',
        color: '#fff', fontSize: 14, outline: 'none',
    };

    return (
        <div style={{ minHeight: '82vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(138,43,226,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 36, position: 'relative' }}>
                {/* Top gradient bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #8a2be2, #a855f7, #3b82f6)', borderRadius: '24px 24px 0 0' }} />

                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, background: 'linear-gradient(90deg,#fff,#9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome Back</h2>
                    <p style={{ color: '#6b7280', marginTop: 8, fontSize: 14 }}>Sign in to your collector account</p>
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

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* Email */}
                    <div>
                        <label style={{ display: 'block', color: '#9ca3af', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="name@example.com" required style={inputStyle}
                                onFocus={e => e.target.style.borderColor = '#8a2be2'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ color: '#9ca3af', fontSize: 13, fontWeight: 600 }}>Password</label>
                            <Link to="#" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your email!"); }} style={{ color: '#8a2be2', fontSize: 12, textDecoration: 'none' }}>Forgot password?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                            <input
                                type="password" value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••" required style={inputStyle}
                                onFocus={e => e.target.style.borderColor = '#8a2be2'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: loading ? 'rgba(138,43,226,0.4)' : 'linear-gradient(135deg, #8a2be2, #a855f7)',
                            border: 'none', color: '#fff', fontWeight: 700, fontSize: 15,
                            padding: '14px', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: 4, boxShadow: '0 0 20px rgba(138,43,226,0.3)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseOver={e => { if (!loading) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(138,43,226,0.5)'; } }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(138,43,226,0.3)'; }}
                    >
                        {loading ? (
                            <>
                                <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                                Signing in...
                            </>
                        ) : (
                            <><LogIn size={18} /> Sign In</>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 14, marginTop: 24, marginBottom: 0 }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#8a2be2', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
                </p>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Login;
