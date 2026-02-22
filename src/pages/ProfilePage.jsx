// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import {
  changeUserPassword,
  clearUserSuccess,
  fetchSavedPlans,
  fetchUserProfile,
  logoutUser,
  removeSavedPlan,
  selectCurrentUser,
  selectSavedPlans,
  selectUserError,
  selectUserLoading,
  selectUserProfile,
  selectUserSuccess,
  updateUserDetails,
} from '../store';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Bookmark,
  Calendar,
  Check,
  Edit3,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  Trash2,
  User,
} from 'lucide-react';

const F = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const SAFFRON = '#E8650A';
const SAFFRON_BG = '#FDF0E6';

const TIER_ICON = { economy: '🪙', standard: '⭐', luxury: '💎' };
const TIER_COLOR = { economy: '#16A34A', standard: SAFFRON, luxury: '#9333EA' };

function Toast ({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'fixed',
                  bottom: 32,
                  right: 32,
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: type === 'error' ? '#FEF2F2' : '#F0FDF4',
                  border: `1px solid ${type === 'error' ? '#FECACA' : '#BBF7D0'}`,
                  borderRadius: 16,
                  padding: '14px 20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }}>
      {type === 'error'
        ? <AlertCircle size={18} style={{ color: '#EF4444' }}/>
        : <Check size={18} style={{ color: '#16A34A' }}/>}
      <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: type === 'error' ? '#DC2626' : '#15803D' }}>
        {message}
      </span>
    </motion.div>
  );
}

function SectionCard ({ title, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 24, border: '1px solid #F3F4F6',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden'
    }}>
      <div style={{ padding: '22px 28px', borderBottom: '1px solid #F3F4F6' }}>
        <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: '1rem', color: '#111', margin: 0 }}>{title}</h3>
      </div>
      <div style={{ padding: '28px' }}>{children}</div>
    </div>
  );
}

function InputField ({ label, type = 'text', value, onChange, icon: Icon, placeholder, disabled }) {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 800, color: '#9CA3AF',
        textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 7
      }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={15} style={{
          position: 'absolute',
          left: 15,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9CA3AF'
        }}/>}
        <input type={isPw && show ? 'text' : type} value={value} onChange={onChange}
               disabled={disabled} placeholder={placeholder}
               style={{
                 width: '100%', boxSizing: 'border-box',
                 paddingLeft: Icon ? 42 : 16, paddingRight: isPw ? 46 : 16,
                 paddingTop: 13, paddingBottom: 13,
                 border: '1.5px solid #E5E7EB', borderRadius: 13, fontFamily: F, fontSize: 14,
                 color: '#111', outline: 'none', background: disabled ? '#F9FAFB' : '#fff',
                 transition: 'border-color 0.18s', cursor: disabled ? 'not-allowed' : 'text'
               }}
               onFocus={e => { if (!disabled) e.target.style.borderColor = SAFFRON; }}
               onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
        {isPw && (
          <button type="button" onClick={() => setShow(p => !p)}
                  style={{
                    position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4
                  }}>
            {show ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const authUser = useSelector(selectCurrentUser);
  const profile = useSelector(selectUserProfile);
  const saved = useSelector(selectSavedPlans);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const success = useSelector(selectUserSuccess);
  
  const user = profile || authUser;
  
  const [tab, setTab] = useState('profile');  // 'profile' | 'password' | 'saved'
  const [toast, setToast] = useState(null);
  
  // Profile form
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  
  // Password form
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confPw, setConfPw] = useState('');
  const [pwErr, setPwErr] = useState('');
  
  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchSavedPlans());
  }, [dispatch]);
  
  useEffect(() => {
    if (user) {
      setName(user.fullname || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);
  
  // Success toasts
  useEffect(() => {
    if (success.updateDetails) {
      setToast({
        message: 'Profile updated!',
        type: 'success'
      });
      dispatch(clearUserSuccess('updateDetails'));
    }
  }, [success.updateDetails, dispatch]);
  
  useEffect(() => {
    if (success.changePassword) {
      setToast({ message: 'Password changed!', type: 'success' });
      setCurPw('');
      setNewPw('');
      setConfPw('');
      dispatch(clearUserSuccess('changePassword'));
    }
  }, [success.changePassword, dispatch]);
  
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(updateUserDetails({ name, avatar }));
  };
  
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwErr('');
    if (newPw !== confPw) {
      setPwErr('Passwords don\'t match.');
      return;
    }
    if (newPw.length < 8) {
      setPwErr('New password must be at least 8 characters.');
      return;
    }
    dispatch(changeUserPassword({ currentPassword: curPw, newPassword: newPw }));
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };
  
  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'saved', label: 'Saved Trips', icon: Bookmark, badge: saved?.length },
  ];
  
  return (
    <div style={{ fontFamily: F, background: '#F9FAFB', minHeight: '100vh' }}>
      <Navbar/>
      
      {/* Hero strip */}
      <div style={{ background: 'linear-gradient(135deg, #111 0%, #1f1208 100%)', paddingTop: 100, paddingBottom: 60 }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 24
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: SAFFRON,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 28,
            fontWeight: 900,
            color: '#fff',
            border: '3px solid rgba(255,255,255,0.2)'
          }}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 style={{
              color: '#fff',
              fontWeight: 900,
              fontSize: 'clamp(1.4rem,3vw,2rem)',
              margin: 0,
              marginBottom: 6
            }}>
              {user?.name || 'Traveller'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>{user?.email}</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <motion.button onClick={handleLogout} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                           style={{
                             display: 'flex',
                             alignItems: 'center',
                             gap: 8,
                             background: 'rgba(255,255,255,0.08)',
                             border: '1px solid rgba(255,255,255,0.14)',
                             borderRadius: 999,
                             padding: '10px 20px',
                             color: 'rgba(255,255,255,0.7)',
                             fontFamily: F,
                             fontSize: 13,
                             fontWeight: 600,
                             cursor: 'pointer'
                           }}>
              <LogOut size={15}/> Sign Out
            </motion.button>
          </div>
        </div>
      </div>
      
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px', display: 'grid',
        gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'start'
      }}>
        
        {/* Sidebar tabs */}
        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #F3F4F6',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden', position: 'sticky', top: 24
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
                      background: tab === t.id ? SAFFRON_BG : 'transparent',
                      border: 'none', borderLeft: tab === t.id ? `3px solid ${SAFFRON}` : '3px solid transparent',
                      cursor: 'pointer', fontFamily: F, fontSize: 14, fontWeight: tab === t.id ? 700 : 500,
                      color: tab === t.id ? SAFFRON : '#6B7280', transition: 'all 0.18s', textAlign: 'left'
                    }}>
              <t.icon size={17}/>
              {t.label}
              {t.badge > 0 && (
                <span style={{
                  marginLeft: 'auto', background: SAFFRON, color: '#fff', borderRadius: 999,
                  fontSize: 11, fontWeight: 800, padding: '2px 8px'
                }}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* ── PROFILE TAB ── */}
            {tab === 'profile' && (
              <SectionCard title="Personal Information">
                <form
                  onSubmit={handleUpdateProfile}
                  style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                    <InputField
                      label="Full Name"
                      value={user?.fullname || ''}
                      onChange={e => setName(e.target.value)}
                      icon={User}
                      placeholder="Your name"/>
                    <InputField
                      label="Email"
                      type="email"
                      value={user?.email || ''}
                      icon={Mail}
                      disabled/>
                  </div>
                  <InputField
                    label="Avatar URL (optional)"
                    value={avatar}
                    onChange={e => setAvatar(e.target.value)}
                    placeholder="https://..."/>
                  
                  {error.updateDetails && (
                    <div style={{
                      display: 'flex', gap: 10, alignItems: 'center', background: '#FEF2F2',
                      border: '1px solid #FECACA', borderRadius: 12, padding: '12px 16px'
                    }}>
                      <AlertCircle size={16} style={{ color: '#EF4444' }}/>
                      <span style={{ fontSize: 13, color: '#DC2626' }}>{error.updateDetails}</span>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <motion.button type="submit" disabled={loading.updateDetails}
                                   whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                   style={{
                                     display: 'flex',
                                     alignItems: 'center',
                                     gap: 8,
                                     background: SAFFRON,
                                     color: '#fff',
                                     border: 'none',
                                     borderRadius: 999,
                                     padding: '13px 28px',
                                     fontFamily: F,
                                     fontSize: 14,
                                     fontWeight: 700,
                                     cursor: loading.updateDetails ? 'wait' : 'pointer',
                                     boxShadow: '0 4px 18px rgba(232,101,10,0.28)'
                                   }}>
                      {loading.updateDetails ? 'Saving…' : <><Edit3 size={15}/> Save Changes</>}
                    </motion.button>
                  </div>
                </form>
              </SectionCard>
            )}
            
            {/* ── PASSWORD TAB ── */}
            {tab === 'password' && (
              <SectionCard title="Change Password">
                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <InputField label="Current Password" type="password" value={curPw}
                              onChange={e => setCurPw(e.target.value)} icon={Lock} placeholder="••••••••"/>
                  <InputField label="New Password" type="password" value={newPw}
                              onChange={e => setNewPw(e.target.value)} icon={Lock} placeholder="Min 8 characters"/>
                  <InputField label="Confirm New Password" type="password" value={confPw}
                              onChange={e => setConfPw(e.target.value)} icon={Lock} placeholder="Repeat new password"/>
                  
                  {(pwErr || error.changePassword) && (
                    <div style={{
                      display: 'flex', gap: 10, alignItems: 'center', background: '#FEF2F2',
                      border: '1px solid #FECACA', borderRadius: 12, padding: '12px 16px'
                    }}>
                      <AlertCircle size={16} style={{ color: '#EF4444' }}/>
                      <span style={{ fontSize: 13, color: '#DC2626' }}>{pwErr || error.changePassword}</span>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <motion.button type="submit" disabled={loading.changePassword}
                                   whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                   style={{
                                     display: 'flex',
                                     alignItems: 'center',
                                     gap: 8,
                                     background: '#111',
                                     color: '#fff',
                                     border: 'none',
                                     borderRadius: 999,
                                     padding: '13px 28px',
                                     fontFamily: F,
                                     fontSize: 14,
                                     fontWeight: 700,
                                     cursor: loading.changePassword ? 'wait' : 'pointer'
                                   }}>
                      {loading.changePassword ? 'Updating…' : <><Lock size={15}/> Update Password</>}
                    </motion.button>
                  </div>
                </form>
              </SectionCard>
            )}
            
            {/* ── SAVED TRIPS TAB ── */}
            {tab === 'saved' && (
              <SectionCard title={`Saved Trips (${saved?.length || 0})`}>
                {loading.savedPlans ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ height: 88, borderRadius: 16, background: '#F3F4F6' }}>
                        <motion.div animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.4, repeat: Infinity }}
                                    style={{
                                      height: '100%',
                                      borderRadius: 16,
                                      background: 'linear-gradient(90deg,#F3F4F6,#E5E7EB,#F3F4F6)'
                                    }}/>
                      </div>
                    ))}
                  </div>
                ) : saved?.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111', marginBottom: 8 }}>No saved trips
                      yet</p>
                    <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>Generate a trip and save it to see
                      it here.</p>
                    <Link to="/planner" style={{
                      background: SAFFRON, color: '#fff', borderRadius: 999,
                      padding: '12px 28px', fontWeight: 700, fontSize: 14, textDecoration: 'none',
                      boxShadow: '0 4px 18px rgba(232,101,10,0.28)'
                    }}>
                      Plan a Trip
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {saved.map(plan => {
                      const itin = plan.itinerary || plan;
                      const tier = itin.budgetTier?.toLowerCase() || 'standard';
                      return (
                        <motion.div key={plan._id || itin._id}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 16, background: '#F9FAFB',
                                      border: '1px solid #F3F4F6', borderRadius: 18, padding: '18px 20px'
                                    }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: 14, background: SAFFRON_BG,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0
                          }}>
                            {TIER_ICON[tier] || '⭐'}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontWeight: 800, fontSize: 15, color: '#111', marginBottom: 3,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>
                              {itin.title || itin.destinationName || 'Trip Plan'}
                            </p>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                              {itin.totalDays && (
                                <span style={{
                                  fontSize: 12,
                                  color: '#6B7280',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}>
                                  <Calendar size={12}/> {itin.totalDays} days
                                </span>
                              )}
                              <span style={{
                                fontSize: 12, color: TIER_COLOR[tier], fontWeight: 700,
                                textTransform: 'capitalize'
                              }}>{tier}</span>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                            {itin._id && (
                              <Link to="/results" state={{ itinerary: itin }}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 6, background: '#fff',
                                      border: '1.5px solid #E5E7EB', borderRadius: 999, padding: '8px 16px',
                                      fontSize: 13, fontWeight: 600, color: '#374151', textDecoration: 'none'
                                    }}>
                                <Eye size={14}/> View
                              </Link>
                            )}
                            <motion.button onClick={() => dispatch(removeSavedPlan(itin._id))}
                                           disabled={loading.removeSaved} whileHover={{ scale: 1.08 }}
                                           whileTap={{ scale: 0.93 }}
                                           style={{
                                             display: 'flex', alignItems: 'center', justifyContent: 'center',
                                             width: 36, height: 36, borderRadius: 999, background: '#FEF2F2',
                                             border: '1px solid #FECACA', cursor: 'pointer'
                                           }}>
                              <Trash2 size={15} style={{ color: '#EF4444' }}/>
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Toast */}
      <AnimatePresence>
        {
          toast
          &&
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        }
      </AnimatePresence>
      
      <Footer/>
    </div>
  );
}