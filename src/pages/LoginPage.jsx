// src/pages/LoginPage.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { clearAuthError, loginUser, selectAuthError, selectAuthLoading, selectIsAuthenticated, } from '../store';

const F = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const SAFFRON = '#E8650A';
const BG = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1920&q=90';

export default function LoginPage () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const from = location.state?.from || '/';

  useEffect(() => { if (isAuth) navigate(from, { replace: true }); }, [isAuth]);
  useEffect(() => () => dispatch(clearAuthError('login')), []);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = (e) => {
    e.preventDefault();
    if (form.email && form.password) dispatch(loginUser(form));
  };

  const inputStyle = (focus) => ({
    width: '100%', padding: '14px 16px 14px 44px', background: '#F9FAFB',
    border: `1.5px solid ${focus ? SAFFRON : '#EFEFEF'}`, borderRadius: 14,
    fontSize: 14, fontFamily: F, color: '#111', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  });

  const [focusField, setFocus] = useState('');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: F }}>

      {/* Left — hero */}
      <div style={{ flex: 1, position: 'relative', display: 'none' }} className="auth-hero">
        <img src={BG} alt=""
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg,rgba(0,0,0,0.62),rgba(0,0,0,0.3))'
        }}/>
        <div style={{
          position: 'relative',
          zIndex: 10,
          padding: '52px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: SAFFRON,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: 18 }}>✈</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: 22, color: '#fff', letterSpacing: '-0.02em' }}>TripWise</span>
          </Link>
          <div>
            <p style={{
              fontSize: 'clamp(1.6rem,3.5vw,2.6rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.18,
              marginBottom: 18
            }}>
              Your next great<br/>Indian adventure<br/><em style={{ color: SAFFRON }}>starts here.</em>
            </p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.7 }}>
              AI-crafted itineraries tailored to your budget,<br/>interests, and travel style.
            </p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{
        width: '100%',
        maxWidth: 520,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        background: '#fff'
      }}>
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo */}
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            marginBottom: 40
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: SAFFRON,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: 16 }}>✈</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: 20, color: '#111', letterSpacing: '-0.02em' }}>TripWise</span>
          </Link>

          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(1.8rem,4vw,2.4rem)',
            color: '#111',
            marginBottom: 8,
            letterSpacing: '-0.02em'
          }}>
            Welcome back
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: 15, marginBottom: 36 }}>Sign in to continue planning your trip.</p>

          {/* Error banner */}
          <AnimatePresence>
            {error.login && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, background: '#FEF2F2',
                            border: '1px solid #FECACA', borderRadius: 14, padding: '14px 18px', marginBottom: 22
                          }}>
                <AlertCircle size={15} color="#EF4444" style={{ flexShrink: 0 }}/>
                <p style={{ color: '#DC2626', fontSize: 13 }}>{error.login}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email */}
            <div>
              <p style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: 8
              }}>Email</p>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: focusField === 'email' ? SAFFRON : '#9CA3AF',
                  transition: 'color 0.2s'
                }}/>
                <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@email.com"
                       required autoComplete="email"
                       style={{ ...inputStyle(focusField === 'email') }}
                       onFocus={() => setFocus('email')} onBlur={() => setFocus('')}/>
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <p style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em'
                }}>Password</p>
                <button type="button" style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: SAFFRON,
                  fontWeight: 700,
                  fontFamily: F
                }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: focusField === 'password' ? SAFFRON : '#9CA3AF',
                  transition: 'color 0.2s'
                }}/>
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={onChange}
                       placeholder="••••••••" required autoComplete="current-password"
                       style={{ ...inputStyle(focusField === 'password'), paddingRight: 44 }}
                       onFocus={() => setFocus('password')} onBlur={() => setFocus('')}/>
                <button type="button" onClick={() => setShowPass(s => !s)}
                        style={{
                          position: 'absolute',
                          right: 16,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#9CA3AF',
                          display: 'flex'
                        }}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button type="submit" disabled={loading.login}
                           whileHover={{ scale: loading.login ? 1 : 1.02 }} whileTap={{ scale: 0.97 }}
                           style={{
                             width: '100%', background: SAFFRON, color: '#fff', border: 'none', borderRadius: 999,
                             padding: '16px', fontSize: 15, fontWeight: 800, fontFamily: F,
                             cursor: loading.login ? 'not-allowed' : 'pointer', opacity: loading.login ? 0.75 : 1,
                             display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                             boxShadow: '0 6px 24px rgba(232,101,10,0.32)', marginTop: 6
                           }}>
              {loading.login
                ? <><Spinner/> Signing in…</>
                : <>Sign in <ArrowRight size={16}/></>}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#6B7280' }}>
            No account?{' '}
            <Link to="/register" style={{ color: SAFFRON, fontWeight: 700, textDecoration: 'none' }}>Create one free
              →</Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) { .auth-hero { display: block !important; } }
      `}</style>
    </div>
  );
}

function Spinner () {
  return (
    <span style={{
      width: 16, height: 16, border: '2px solid rgba(255,255,255,0.35)',
      borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block',
      animation: 'spin 0.7s linear infinite'
    }}/>
  );
}