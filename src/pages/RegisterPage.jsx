// src/pages/RegisterPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, registerUser, selectAuthError, selectAuthLoading, selectIsAuthenticated, } from '../store';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, AtSign, Check, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

const F = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const SAFFRON = '#E8650A';
const HERO_IMG = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85';

// Password strength rules — matches backend minimum of 8 chars
const PW_RULES = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: 'One uppercase letter', test: p => /[A-Z]/.test(p) },
  { label: 'One number', test: p => /\d/.test(p) },
];

// ── Small reusable input ──────────────────────────────────────────────────────
function Field ({
  label,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  placeholder,
  hint,
  showToggle,
  onToggle,
  showPw
}) {
  const inputType = type === 'password' ? (showPw ? 'text' : 'password') : type;
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 800, color: '#9CA3AF',
        textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={16} style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9CA3AF',
            pointerEvents: 'none'
          }}/>
        )}
        <input
          type={inputType}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={type === 'password' ? 'new-password' : type === 'email' ? 'email' : 'off'}
          style={{
            width: '100%', boxSizing: 'border-box',
            paddingLeft: Icon ? 44 : 16,
            paddingRight: showToggle ? 46 : 16,
            paddingTop: 14, paddingBottom: 14,
            border: '1.5px solid #E5E7EB', borderRadius: 14,
            fontFamily: F, fontSize: 15, color: '#111', outline: 'none',
            background: '#F9FAFB', transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = SAFFRON)}
          onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
        />
        {showToggle && (
          <button type="button" onClick={onToggle}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4
                  }}>
            {showPw ? <EyeOff size={17}/> : <Eye size={17}/>}
          </button>
        )}
      </div>
      {hint && <p style={{ fontFamily: F, fontSize: 11, color: '#9CA3AF', marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

export default function RegisterPage () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // ── Four fields matching backend: fullname, username, email, password ────
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  // Clear error on unmount
  useEffect(() => () => dispatch(clearAuthError('register')), [dispatch]);

  const pwPassed = PW_RULES.every(r => r.test(password));

  // Username: lowercase, no spaces, alphanumeric + underscore only
  const sanitizeUsername = (val) =>
    val.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pwPassed) return;
    // Send exactly what the backend expects
    dispatch(registerUser({
      fullname: fullname.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
    }));
  };

  const btnDisabled = loading.register || !pwPassed || !fullname || !username || !email || !password;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: F, background: '#fff' }}>

      {/* ── Left image panel (hidden on mobile) ─────────────────────────── */}
      <div
        className="auth-left-panel"
        style={{ display: 'none', flex: '0 0 46%', position: 'relative', overflow: 'hidden' }}>
        <img src={HERO_IMG} alt=""
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(8,4,2,0.58) 0%, rgba(22,163,74,0.28) 100%)'
        }}/>
        <div style={{
          position: 'relative', zIndex: 1, padding: '48px', height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>

          {/* Logo */}
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: F, fontWeight: 900, fontSize: 22, color: '#fff' }}>
              Trip<span style={{ color: SAFFRON }}>Wise</span>
            </span>
          </a>

          {/* Quote */}
          <div>
            <p style={{
              color: 'rgba(255,255,255,0.92)',
              fontSize: 'clamp(1.4rem,2.5vw,2rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              marginBottom: 16
            }}>
              "Start your next<br/>adventure today."
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Free forever. No credit card needed.</p>
          </div>

          {/* Stat pills */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['🆓 Free to join', '🤖 AI Itineraries', '💾 Save & Share'].map(pill => (
              <span key={pill} style={{
                background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.22)', borderRadius: 999,
                padding: '7px 16px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
              }}>{pill}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        overflowY: 'auto'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: 460 }}>

          {/* Mobile logo */}
          <a href="/" style={{ textDecoration: 'none', display: 'block', marginBottom: 36 }}>
            <span style={{ fontFamily: F, fontWeight: 900, fontSize: 22, color: '#111' }}>
              Trip<span style={{ color: SAFFRON }}>Wise</span>
            </span>
          </a>

          <h1 style={{
            fontSize: 'clamp(1.7rem,4vw,2.2rem)',
            fontWeight: 900,
            color: '#111',
            lineHeight: 1.1,
            marginBottom: 6
          }}>
            Create your account
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 32 }}>
            Free forever. Start planning in seconds.
          </p>

          {/* ── Error banner ── */}
          <AnimatePresence>
            {error.register && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start', background: '#FEF2F2',
                  border: '1px solid #FECACA', borderRadius: 14, padding: '14px 18px', marginBottom: 24
                }}>
                <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }}/>
                <p style={{ fontSize: 14, color: '#DC2626', fontWeight: 500, lineHeight: 1.5 }}>{error.register}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Row 1: Full Name + Username side-by-side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field
                label="Full Name"
                value={fullname}
                onChange={e => setFullname(e.target.value)}
                icon={User}
                placeholder="Arjun Sharma"
              />
              <Field
                label="Username"
                value={username}
                onChange={e => setUsername(sanitizeUsername(e.target.value))}
                icon={AtSign}
                placeholder="arjun_sharma"
                hint="Letters, numbers, _ only"
              />
            </div>

            {/* Email */}
            <Field
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={Mail}
              placeholder="arjun@example.com"
            />

            {/* Password */}
            <div>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 800, color: '#9CA3AF',
                textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF'
                }}/>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setPwFocused(true)}
                  onBlur={e => {
                    setPwFocused(false);
                    e.target.style.borderColor = '#E5E7EB';
                  }}
                  onFocusCapture={e => (e.target.style.borderColor = SAFFRON)}
                  placeholder="Min 8 characters"
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    paddingLeft: 44,
                    paddingRight: 50,
                    paddingTop: 14,
                    paddingBottom: 14,
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 14,
                    fontFamily: F,
                    fontSize: 15,
                    color: '#111',
                    outline: 'none',
                    background: '#F9FAFB',
                    transition: 'border-color 0.2s'
                  }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                        style={{
                          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4
                        }}>
                  {showPw ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>

              {/* Live password rules */}
              <AnimatePresence>
                {(pwFocused || password.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
                    {PW_RULES.map(rule => {
                      const passed = rule.test(password);
                      return (
                        <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: passed ? '#DCFCE7' : '#F3F4F6', transition: 'background 0.2s',
                          }}>
                            <Check size={10} style={{ color: passed ? '#16A34A' : '#D1D5DB' }}/>
                          </div>
                          <span style={{
                            fontSize: 12,
                            color: passed ? '#16A34A' : '#9CA3AF',
                            fontWeight: passed ? 600 : 400
                          }}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={btnDisabled}
              whileHover={{ scale: btnDisabled ? 1 : 1.02 }}
              whileTap={{ scale: btnDisabled ? 1 : 0.97 }}
              style={{
                marginTop: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: btnDisabled ? '#F3F4F6' : SAFFRON,
                color: btnDisabled ? '#9CA3AF' : '#fff',
                border: 'none', cursor: btnDisabled ? 'not-allowed' : 'pointer',
                borderRadius: 999, padding: '16px 28px', fontFamily: F, fontSize: 15, fontWeight: 800,
                boxShadow: btnDisabled ? 'none' : '0 4px 20px rgba(232,101,10,0.32)',
                transition: 'all 0.25s',
              }}>
              {loading.register ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 17,
                      height: 17,
                      border: '2.5px solid rgba(255,255,255,0.4)',
                      borderTopColor: '#fff',
                      borderRadius: '50%'
                    }}
                  />
                  Creating account…
                </>
              ) : (
                <>Create Free Account <ArrowRight size={17}/></>
              )}
            </motion.button>
          </form>

          {/* Sign in link */}
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#6B7280' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: SAFFRON, fontWeight: 700, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms note */}
          <p style={{ marginTop: 20, fontSize: 11, color: '#9CA3AF', textAlign: 'center', lineHeight: 1.7 }}>
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .auth-left-panel { display: flex !important; }
        }
        @media (max-width: 480px) {
          /* Stack the full name / username on mobile */
          form > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}