import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { BookMarked, ChevronDown, LogOut, MapPin, Menu, User, X } from 'lucide-react';
import { logoutUser, selectCurrentUser, selectIsAuthenticated, } from '../store';

const F = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const SAFFRON = '#E8650A';

const NAV_LINKS = [
  { label: 'Destinations', to: '/destinations' },
  { label: 'Hotels', to: '/hotels' },
  { label: 'Food', to: '/food' },
  { label: 'About', to: '/about' },
];

export function Navbar () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const isAuth = useSelector(selectIsAuthenticated);

  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setUserDropdown(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserDropdown(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const isActive = (to) => location.pathname === to;

  const avatar = user?.avatar || null;
  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: SAFFRON,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <span style={{ fontSize: 16 }}>✈</span>
            </div>
            <span style={{
              fontFamily: F, fontWeight: 900, fontSize: 20,
              color: scrolled ? '#111' : '#fff', letterSpacing: '-0.02em', transition: 'color 0.3s'
            }}>
              TripWise
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
            {NAV_LINKS.map(({ label, to }) => (
              <Link key={to} to={to} style={{
                fontFamily: F, fontSize: 14, fontWeight: isActive(to) ? 700 : 500,
                color: isActive(to) ? SAFFRON : scrolled ? '#374151' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none', padding: '8px 16px', borderRadius: 99,
                background: isActive(to) ? (scrolled ? '#FDF0E6' : 'rgba(255,255,255,0.12)') : 'transparent',
                transition: 'all 0.2s',
              }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right side — auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="nav-desktop">
            {isAuth ? (
              <>
                {/* Plan trip CTA */}
                <Link to="/planner">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                 style={{
                                   background: SAFFRON,
                                   color: '#fff',
                                   border: 'none',
                                   borderRadius: 999,
                                   padding: '10px 22px',
                                   fontFamily: F,
                                   fontSize: 13,
                                   fontWeight: 800,
                                   cursor: 'pointer',
                                   boxShadow: '0 4px 16px rgba(232,101,10,0.35)',
                                   display: 'flex',
                                   alignItems: 'center',
                                   gap: 8
                                 }}>
                    <MapPin size={13}/> Plan a Trip
                  </motion.button>
                </Link>

                {/* Avatar dropdown */}
                <div ref={dropRef} style={{ position: 'relative' }}>
                  <button onClick={() => setUserDropdown(d => !d)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            background: scrolled ? '#F9FAFB' : 'rgba(255,255,255,0.15)',
                            border: scrolled ? '1.5px solid #EFEFEF' : '1.5px solid rgba(255,255,255,0.25)',
                            borderRadius: 999,
                            padding: '6px 12px 6px 6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}>
                    {avatar
                      ? <img src={avatar} alt={user.name}
                             style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}/>
                      : <div style={{
                        width: 30, height: 30, borderRadius: '50%', background: SAFFRON,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: F
                      }}>
                        {initials}
                      </div>
                    }
                    <span style={{
                      fontFamily: F,
                      fontSize: 13,
                      fontWeight: 700,
                      color: scrolled ? '#111' : '#fff',
                      maxWidth: 80,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={12} style={{
                      color: scrolled ? '#6B7280' : 'rgba(255,255,255,0.7)',
                      transition: 'transform 0.2s',
                      transform: userDropdown ? 'rotate(180deg)' : 'none'
                    }}/>
                  </button>

                  <AnimatePresence>
                    {userDropdown && (
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                  transition={{ duration: 0.18 }}
                                  style={{
                                    position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 210,
                                    background: '#fff', borderRadius: 18, boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
                                    border: '1px solid #F3F4F6', overflow: 'hidden', zIndex: 200
                                  }}>

                        {/* User info */}
                        <div style={{ padding: '16px 18px', borderBottom: '1px solid #F3F4F6' }}>
                          <p style={{
                            fontFamily: F,
                            fontWeight: 700,
                            fontSize: 14,
                            color: '#111',
                            marginBottom: 2
                          }}>{user?.name}</p>
                          <p style={{
                            fontFamily: F,
                            fontSize: 12,
                            color: '#9CA3AF',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{user?.email}</p>
                        </div>

                        {[
                          { icon: <User size={15}/>, label: 'My Profile', to: '/profile' },
                          { icon: <BookMarked size={15}/>, label: 'Saved Trips', to: '/profile#saved' },
                        ].map(item => (
                          <Link key={item.to} to={item.to}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                  padding: '13px 18px',
                                  textDecoration: 'none',
                                  color: '#374151',
                                  fontFamily: F,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  transition: 'background 0.15s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <span style={{ color: '#9CA3AF' }}>{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}

                        <div style={{ borderTop: '1px solid #F3F4F6' }}>
                          <button onClick={handleLogout}
                                  style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px',
                                    background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444',
                                    fontFamily: F, fontSize: 14, fontWeight: 500, transition: 'background 0.15s'
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <LogOut size={15}/> Log out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  fontFamily: F, fontSize: 14, fontWeight: 600,
                  color: scrolled ? '#374151' : 'rgba(255,255,255,0.85)', textDecoration: 'none',
                  padding: '9px 18px', borderRadius: 999, transition: 'all 0.2s',
                  border: '1.5px solid transparent'
                }}>
                  Sign in
                </Link>
                <Link to="/register">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                 style={{
                                   background: SAFFRON, color: '#fff', border: 'none', borderRadius: 999,
                                   padding: '10px 22px', fontFamily: F, fontSize: 13, fontWeight: 800,
                                   cursor: 'pointer', boxShadow: '0 4px 16px rgba(232,101,10,0.35)'
                                 }}>
                    Get started free
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} className="nav-mobile"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: scrolled ? '#111' : '#fff',
                    display: 'none',
                    padding: 4
                  }}>
            {menuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.22 }}
                      style={{
                        position: 'fixed', top: 68, left: 0, right: 0, zIndex: 999,
                        background: '#fff', borderBottom: '1px solid #F3F4F6',
                        padding: '20px 24px 28px', boxShadow: '0 16px 48px rgba(0,0,0,0.1)'
                      }}>

            {/* Nav links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
              {NAV_LINKS.map(({ label, to }) => (
                <Link key={to} to={to} style={{
                  fontFamily: F, fontSize: 16, fontWeight: isActive(to) ? 700 : 500,
                  color: isActive(to) ? SAFFRON : '#111', textDecoration: 'none',
                  padding: '12px 16px', borderRadius: 14, background: isActive(to) ? '#FDF0E6' : 'transparent'
                }}>
                  {label}
                </Link>
              ))}
            </div>

            <div style={{ height: 1, background: '#F3F4F6', marginBottom: 20 }}/>

            {isAuth ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 4px 14px' }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: SAFFRON,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#fff'
                  }}>
                    {initials}
                  </div>
                  <div>
                    <p style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: '#111' }}>{user?.name}</p>
                    <p style={{ fontFamily: F, fontSize: 12, color: '#9CA3AF' }}>{user?.email}</p>
                  </div>
                </div>
                <Link to="/profile" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  borderRadius: 14,
                  background: '#F9FAFB',
                  textDecoration: 'none',
                  color: '#374151',
                  fontFamily: F,
                  fontSize: 14,
                  fontWeight: 600
                }}>
                  <User size={16} style={{ color: '#9CA3AF' }}/> My Profile
                </Link>
                <Link to="/planner" style={{
                  display: 'block',
                  textAlign: 'center',
                  background: SAFFRON,
                  color: '#fff',
                  borderRadius: 999,
                  padding: '14px',
                  fontFamily: F,
                  fontSize: 14,
                  fontWeight: 800,
                  textDecoration: 'none',
                  marginTop: 4,
                  boxShadow: '0 4px 16px rgba(232,101,10,0.32)'
                }}>
                  Plan a Trip
                </Link>
                <button onClick={handleLogout} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  borderRadius: 14,
                  border: '1.5px solid #FECACA',
                  background: '#FEF2F2',
                  color: '#EF4444',
                  fontFamily: F,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  <LogOut size={16}/> Log out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/login" style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '13px',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: 999,
                  fontFamily: F,
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#111',
                  textDecoration: 'none'
                }}>
                  Sign in
                </Link>
                <Link to="/register" style={{
                  display: 'block',
                  textAlign: 'center',
                  background: SAFFRON,
                  color: '#fff',
                  borderRadius: 999,
                  padding: '13px',
                  fontFamily: F,
                  fontSize: 14,
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(232,101,10,0.32)'
                }}>
                  Get started free
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }
      `}</style>
    </>
  );
}