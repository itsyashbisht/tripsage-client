import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearItinerarySuccess,
  clearShareData,
  saveItinerary,
  selectIsAuthenticated,
  selectItineraryLoading,
  selectItinerarySuccess,
  selectShareData,
  shareItinerary,
} from '../store';
import {
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Hotel,
  Leaf,
  Lightbulb,
  Share2,
  Star
} from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion';

const F = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const FM = '\'DM Mono\', monospace';
const SAF = '#E8650A';
const SAF_BG = '#FDF0E6';

const fadeUp = (d = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d } }
});
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const cardV = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.48 } } };

function Reveal ({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} variants={fadeUp(delay)} initial="hidden" animate={inView ? 'show' : 'hidden'} style={style}>
      {children}
    </motion.div>
  );
}

const CHART_COLORS = ['#1D4ED8', '#16A34A', SAF, '#9333EA'];
const TIER_ICON = { economy: '🪙', standard: '⭐', luxury: '💎' };
const TIER_COLOR = { economy: '#16A34A', standard: SAF, luxury: '#9333EA' };
const SLOT_ICONS = { attraction: '📍', food: '🍛', transport: '🚗', hotel: '🏨', free: '🌿' };

// ─── Hotel Suggestion Card ────────────────────────────────────────────────────
function HotelCard ({ hotel, adults }) {
  const totalPerNight = hotel.pricePerNight || 0;
  return (
    <div style={{
      background: hotel.isRecommended ? SAF_BG : '#fff',
      border: `1.5px solid ${hotel.isRecommended ? SAF : '#E5E7EB'}`,
      borderRadius: 18, padding: '16px', position: 'relative',
    }}>
      {hotel.isRecommended && (
        <div style={{
          position: 'absolute', top: -10, left: 16,
          background: SAF, color: '#fff', borderRadius: 999,
          padding: '3px 12px', fontSize: 10, fontWeight: 800, fontFamily: F
        }}>
          ★ Recommended
        </div>
      )}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
        marginTop: hotel.isRecommended ? 6 : 0
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: '#111', marginBottom: 3 }}>
            {hotel.name}
          </p>
          <p style={{ fontFamily: F, fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>
            {hotel.type} · {hotel.location}
          </p>
          {hotel.whyStayHere && (
            <p style={{ fontFamily: F, fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>
              {hotel.whyStayHere}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{
            fontFamily: FM,
            fontWeight: 900,
            fontSize: '1rem',
            color: hotel.isRecommended ? SAF : '#111',
            margin: 0
          }}>
            ₹{totalPerNight?.toLocaleString('en-IN')}
          </p>
          <p style={{ fontFamily: F, fontSize: 10, color: '#9CA3AF', margin: 0 }}>per night</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 4 }}>
            {[...Array(Math.min(hotel.rating || 4, 5))].map((_, i) => (
              <Star key={i} size={10} style={{ fill: SAF, color: SAF }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Restaurant Suggestion Pills ─────────────────────────────────────────────
function FoodSuggestions ({ suggestions, mealLabel }) {
  const [selected, setSelected] = useState(0);
  if (!suggestions?.length) return null;
  const active = suggestions[selected];
  return (
    <div style={{
      marginTop: 14, background: '#F9FAFB', borderRadius: 16,
      border: '1px solid #F0F0F0', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid #F0F0F0',
        display: 'flex', alignItems: 'center', gap: 6
      }}>
        <span style={{ fontSize: 14 }}>🍽️</span>
        <p style={{
          fontFamily: F, fontSize: 11, fontWeight: 800, color: '#9CA3AF',
          textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0
        }}>
          {mealLabel} — Pick a spot
        </p>
      </div>
      {/* Tab selectors */}
      <div
        style={{ display: 'flex', padding: '10px 12px', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid #F0F0F0' }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => setSelected(i)}
                  style={{
                    padding: '6px 14px', borderRadius: 999, fontFamily: F, fontSize: 12,
                    fontWeight: selected === i ? 700 : 500, cursor: 'pointer', border: '1.5px solid',
                    borderColor: selected === i ? SAF : '#E5E7EB',
                    background: selected === i ? SAF_BG : '#fff',
                    color: selected === i ? SAF : '#6B7280', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 5
                  }}>
            {s.isVeg && <Leaf size={10} style={{ color: '#16A34A' }}/>}
            {s.name}
          </button>
        ))}
      </div>
      {/* Selected detail */}
      {active && (
        <div style={{
          padding: '12px 14px', display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'flex-start', gap: 10
        }}>
          <div>
            <p style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 3 }}>
              {active.name}
            </p>
            <p style={{ fontFamily: F, fontSize: 12, color: '#6B7280', marginBottom: 4 }}>
              {active.cuisine} · {active.vibe}
            </p>
            {active.mustOrder && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12 }}>⭐</span>
                <p style={{ fontFamily: F, fontSize: 12, color: SAF, fontWeight: 700, margin: 0 }}>
                  Must order: {active.mustOrder}
                </p>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: FM, fontWeight: 800, fontSize: '1rem', color: SAF, margin: 0 }}>
              ₹{active.pricePerPerson?.toLocaleString('en-IN')}
            </p>
            <p style={{ fontFamily: F, fontSize: 10, color: '#9CA3AF' }}>per person</p>
            {active.isVeg && (
              <span style={{
                fontFamily: F, fontSize: 10, fontWeight: 700, color: '#16A34A',
                background: '#DCFCE7', borderRadius: 999, padding: '2px 8px', display: 'inline-block'
              }}>
                🌿 Veg
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResultsPage () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  
  const isAuth = useSelector(selectIsAuthenticated);
  const itin_loading = useSelector(selectItineraryLoading);
  const itin_success = useSelector(selectItinerarySuccess);
  const shareData = useSelector(selectShareData);
  
  const aiItinerary = state.itinerary || null;
  const destination = aiItinerary?.destination?.name || aiItinerary?.destinationName || state.destination || 'Your Destination';
  const days = aiItinerary?.totalDays || state.days || 3;
  const adults = aiItinerary?.adults || state.adults || 2;
  const tier = (aiItinerary?.budgetTier || state.tier || 'standard').toLowerCase();
  
  const [activeDay, setActiveDay] = useState(1);
  const [budgetTier, setBudgetTier] = useState(tier);
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  
  const budgetBreakdowns = aiItinerary?.budgetBreakdown || [];
  const currentBreakdown = budgetBreakdowns.find(b => b.tier === budgetTier) || null;
  const chartData = currentBreakdown ? [
    { name: 'Accommodation', value: currentBreakdown.accommodation },
    { name: 'Food', value: currentBreakdown.food },
    { name: 'Transport', value: currentBreakdown.transport },
    { name: 'Entry Fees', value: currentBreakdown.entryFees },
  ].filter(d => d.value > 0) : [];
  
  const daySlots = aiItinerary?.days?.find(d => d.dayNumber === activeDay)?.slots || [];
  const hotelSuggestions = state.hotelSuggestions || aiItinerary?.hotelSuggestions || [];
  
  const shareUrl = shareData?.shareUrl || state.shareUrl ||
    (aiItinerary?.shareToken ? `${window.location.origin}/trip/${aiItinerary.shareToken}` : null);
  
  useEffect(() => {
    if (itin_success.save) dispatch(clearItinerarySuccess('save'));
  }, [itin_success.save, dispatch]);
  useEffect(() => () => dispatch(clearShareData()), [dispatch]);
  
  const handleSave = () => {
    if (!isAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (aiItinerary?._id) dispatch(saveItinerary({ itineraryId: aiItinerary._id }));
  };
  const handleShare = () => {
    if (aiItinerary?._id) dispatch(shareItinerary({ itineraryId: aiItinerary._id, platform: 'link' }));
  };
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl || window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  
  if (!aiItinerary) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', fontFamily: F, gap: 16, padding: 24
      }}>
        <p style={{ fontSize: 'clamp(1.1rem,3vw,1.4rem)', fontWeight: 800 }}>No itinerary found.</p>
        <Link to="/planner" style={{
          background: SAF, color: '#fff', borderRadius: 999,
          padding: '13px 30px', fontWeight: 700, textDecoration: 'none', fontFamily: F
        }}>
          Plan a Trip
        </Link>
      </div>
    );
  }
  
  // ─── Sidebar content ──────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* ── Hotel Suggestions ── */}
      {hotelSuggestions.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 22, border: '1px solid #F3F4F6', overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid #F3F4F6',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <Hotel size={16} style={{ color: SAF }}/>
            <div>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: '0.95rem', color: '#111', margin: 0 }}>
                Where to Stay
              </h3>
              <p style={{ fontFamily: F, fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                For {adults} guest{adults > 1 ? 's' : ''} · {days} night{days > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {hotelSuggestions.map((hotel, i) => (
              <HotelCard key={i} hotel={hotel} adults={adults}/>
            ))}
          </div>
        </div>
      )}
      
      {/* ── Budget breakdown ── */}
      <div style={{ background: '#fff', borderRadius: 22, border: '1px solid #F3F4F6', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
          <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: '0.95rem', color: '#111', margin: 0 }}>Budget
            Breakdown</h3>
        </div>
        <div style={{ display: 'flex', padding: '10px', gap: 5, borderBottom: '1px solid #F3F4F6' }}>
          {['economy', 'standard', 'luxury'].map(t => (
            <button key={t} onClick={() => setBudgetTier(t)}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: 999, fontFamily: F, fontSize: 11,
                      fontWeight: budgetTier === t ? 800 : 500, cursor: 'pointer',
                      border: `1.5px solid ${budgetTier === t ? TIER_COLOR[t] : '#E5E7EB'}`,
                      background: budgetTier === t ? TIER_COLOR[t] : 'transparent',
                      color: budgetTier === t ? '#fff' : '#6B7280', transition: 'all 0.18s',
                      textTransform: 'capitalize'
                    }}>
              {TIER_ICON[t]} {t}
            </button>
          ))}
        </div>
        {currentBreakdown ? (
          <div style={{ padding: 'clamp(14px,2vw,20px)' }}>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <p style={{
                fontFamily: FM,
                fontWeight: 900,
                fontSize: '1.7rem',
                color: TIER_COLOR[budgetTier],
                margin: 0
              }}>
                ₹{currentBreakdown.perPerson?.toLocaleString('en-IN') || '—'}
              </p>
              <p style={{ fontFamily: F, fontSize: 12, color: '#9CA3AF' }}>
                per person · ₹{currentBreakdown.total?.toLocaleString('en-IN')} total
              </p>
            </div>
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={46} outerRadius={68}
                       paddingAngle={3} dataKey="value">
                    {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % 4]}/>)}
                  </Pie>
                  <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`}/>
                </PieChart>
              </ResponsiveContainer>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              {[
                { label: 'Accommodation', value: currentBreakdown.accommodation },
                { label: 'Food', value: currentBreakdown.food },
                { label: 'Transport', value: currentBreakdown.transport },
                { label: 'Entry Fees', value: currentBreakdown.entryFees },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{ width: 10, height: 10, borderRadius: 3, background: CHART_COLORS[i], flexShrink: 0 }}/>
                    <span style={{ fontFamily: F, fontSize: 12, color: '#6B7280' }}>{item.label}</span>
                  </div>
                  <span style={{ fontFamily: FM, fontSize: 12, fontWeight: 700, color: '#111' }}>
                    ₹{item.value?.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: F, fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>
            No budget data available
          </p>
        )}
      </div>
      
      {/* ── Local phrases ── */}
      {aiItinerary.localPhrases?.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #111 0%, #1f1208 100%)',
          borderRadius: 22, padding: 'clamp(16px,2vw,22px)', color: '#fff'
        }}>
          <p style={{ fontFamily: F, fontWeight: 800, fontSize: '0.93rem', marginBottom: 14 }}>
            🗣️ Useful Local Phrases
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {aiItinerary.localPhrases.slice(0, 4).map((p, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8, gap: 12
              }}>
                <span style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.7)', flex: 1 }}>{p.phrase}</span>
                <span style={{ fontFamily: FM, fontSize: 12, color: SAF, flexShrink: 0 }}>{p.translation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* ── Plan another ── */}
      <Link to="/planner" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 10, background: SAF, color: '#fff', borderRadius: 999, padding: '14px',
        fontFamily: F, fontWeight: 800, fontSize: 14, textDecoration: 'none',
        boxShadow: '0 6px 22px rgba(232,101,10,0.32)'
      }}>
        Plan Another Trip
      </Link>
    </div>
  );
  
  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: F, color: '#111', background: '#F9FAFB', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar/>
      
      {/* ── Hero ── */}
      <section ref={heroRef} style={{ position: 'relative', height: 'clamp(280px,46vh,480px)', overflow: 'hidden' }}>
        <motion.div style={{
          y: bgY, position: 'absolute', inset: '-20% 0', zIndex: 0,
          backgroundImage: 'url(\'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1920&q=85\')',
          backgroundSize: 'cover', backgroundPosition: 'center 38%'
        }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(8,4,2,0.48) 0%, rgba(8,4,2,0.82) 100%)'
        }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'radial-gradient(ellipse at 52% 50%, rgba(232,101,10,0.18) 0%, transparent 60%)'
        }}/>
        
        <motion.div style={{
          opacity: fadeOut, position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 'clamp(72px,10vw,96px) clamp(20px,5vw,40px) 0'
        }}>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{
                      color: SAF, fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.22em', marginBottom: 14
                    }}>
            {TIER_ICON[tier]} {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan · {days} Days
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                     style={{
                       color: '#fff',
                       fontWeight: 900,
                       fontSize: 'clamp(1.6rem,4.5vw,3.2rem)',
                       lineHeight: 1.06,
                       marginBottom: 18
                     }}>
            {aiItinerary.title || `Your ${destination} Itinerary`}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
                      style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <motion.button onClick={handleSave} disabled={itin_loading.save || itin_success.save}
                           whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                           style={{
                             display: 'flex',
                             alignItems: 'center',
                             gap: 8,
                             padding: '11px clamp(14px,2vw,22px)',
                             borderRadius: 999,
                             background: itin_success.save ? '#DCFCE7' : 'rgba(255,255,255,0.14)',
                             backdropFilter: 'blur(12px)',
                             border: `1px solid ${itin_success.save ? '#86EFAC' : 'rgba(255,255,255,0.28)'}`,
                             fontFamily: F,
                             fontSize: 14,
                             fontWeight: 700,
                             cursor: itin_loading.save ? 'wait' : 'pointer',
                             color: itin_success.save ? '#15803D' : '#fff'
                           }}>
              {itin_success.save ? <><Check size={15}/> Saved!</> : <><Bookmark
                size={15}/> {itin_loading.save ? 'Saving…' : 'Save Trip'}</>}
            </motion.button>
            <motion.button onClick={shareUrl ? handleCopy : handleShare} disabled={itin_loading.share}
                           whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                           style={{
                             display: 'flex', alignItems: 'center', gap: 8, padding: '11px clamp(14px,2vw,22px)',
                             borderRadius: 999, background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(12px)',
                             border: '1px solid rgba(255,255,255,0.28)', fontFamily: F, fontSize: 14, fontWeight: 700,
                             cursor: itin_loading.share ? 'wait' : 'pointer', color: '#fff'
                           }}>
              {copied ? <><Check size={15}/> Copied!</> : shareUrl ? <><Copy size={15}/> Copy Link</> : <><Share2
                size={15}/> {itin_loading.share ? 'Creating…' : 'Share'}</>}
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
      
      {/* ── Main layout ── */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(16px,4vw,24px) 80px' }}>
        
        {/* Mobile sidebar accordion */}
        <div className="results-mobile-toggle" style={{ marginBottom: 20 }}>
          <button onClick={() => setSidebarOpen(o => !o)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16,
                    padding: '14px 18px', fontFamily: F, fontSize: 14, fontWeight: 700,
                    color: '#111', cursor: 'pointer'
                  }}>
            <span>🏨 Hotels, Budget & Details</span>
            {sidebarOpen ? <ChevronUp size={18} style={{ color: '#9CA3AF' }}/> : <ChevronDown size={18}
                                                                                              style={{ color: '#9CA3AF' }}/>}
          </button>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                          style={{ overflow: 'hidden', marginTop: 12 }}>
                <SidebarContent/>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 28 }} className="results-grid">
          
          {/* ── Left: Itinerary ── */}
          <div>
            {/* Day tabs */}
            <Reveal>
              <div style={{
                display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 24,
                scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none', msOverflowStyle: 'none'
              }}>
                {aiItinerary.days?.map(d => (
                  <motion.button key={d.dayNumber} onClick={() => setActiveDay(d.dayNumber)}
                                 whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                 style={{
                                   padding: '9px 20px', borderRadius: 999, fontFamily: F, fontSize: 13,
                                   fontWeight: activeDay === d.dayNumber ? 800 : 500,
                                   background: activeDay === d.dayNumber ? SAF : '#fff',
                                   color: activeDay === d.dayNumber ? '#fff' : '#6B7280',
                                   border: `1.5px solid ${activeDay === d.dayNumber ? SAF : '#E5E7EB'}`,
                                   cursor: 'pointer', flexShrink: 0, scrollSnapAlign: 'start',
                                   boxShadow: activeDay === d.dayNumber ? '0 4px 16px rgba(232,101,10,0.30)' : 'none'
                                 }}>
                    Day {d.dayNumber}
                  </motion.button>
                ))}
              </div>
            </Reveal>
            
            {/* Active day header */}
            {(() => {
              const day = aiItinerary.days?.find(d => d.dayNumber === activeDay);
              if (!day) return null;
              return (
                <Reveal style={{ marginBottom: 20 }}>
                  <div style={{
                    background: '#fff', borderRadius: 20,
                    padding: 'clamp(16px,2vw,22px) clamp(18px,3vw,28px)',
                    border: '1px solid #F3F4F6', boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
                  }}>
                    <p style={{
                      fontFamily: FM, fontSize: 11, color: SAF, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5
                    }}>
                      Day {day.dayNumber}
                    </p>
                    <h2 style={{
                      fontFamily: F,
                      fontWeight: 900,
                      fontSize: 'clamp(1rem,2.5vw,1.3rem)',
                      color: '#111',
                      marginBottom: day.summary ? 8 : 0
                    }}>
                      {day.title || `Day ${day.dayNumber}`}
                    </h2>
                    {day.summary && (
                      <p style={{ fontFamily: F, fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>{day.summary}</p>
                    )}
                  </div>
                </Reveal>
              );
            })()}
            
            {/* Slots */}
            <motion.div variants={stagger} initial="hidden" animate="show"
                        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {daySlots.map((slot, idx) => (
                <motion.div key={idx} variants={cardV}
                            style={{
                              background: '#fff', borderRadius: 20,
                              padding: 'clamp(14px,2vw,20px) clamp(16px,2.5vw,24px)',
                              border: '1px solid #F3F4F6', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                            }}>
                  <div style={{ display: 'flex', gap: 'clamp(12px,2vw,18px)', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 13, background: SAF_BG,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, flexShrink: 0
                    }}>
                      {SLOT_ICONS[slot.type] || '📍'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', marginBottom: 5, flexWrap: 'wrap', gap: 8
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {slot.timeLabel && (
                            <p style={{ fontFamily: FM, fontSize: 11, color: SAF, fontWeight: 700, marginBottom: 2 }}>
                              {slot.timeLabel}
                            </p>
                          )}
                          <h3 style={{
                            fontFamily: F, fontWeight: 800,
                            fontSize: 'clamp(0.88rem,1.6vw,1rem)', color: '#111', margin: 0
                          }}>
                            {slot.title}
                          </h3>
                        </div>
                        {slot.estimatedCost > 0 && (
                          <span style={{
                            fontFamily: FM, fontSize: 13, fontWeight: 800, color: SAF,
                            background: SAF_BG, borderRadius: 999, padding: '4px 12px', flexShrink: 0
                          }}>
                            ₹{slot.estimatedCost?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {slot.description && (
                        <p style={{ fontFamily: F, fontSize: 13, color: '#6B7280', lineHeight: 1.7, marginBottom: 8 }}>
                          {slot.description}
                        </p>
                      )}
                      
                      {/* ── Restaurant suggestions for food slots ── */}
                      {slot.type === 'food' && slot.suggestions?.length > 0 && (
                        <FoodSuggestions
                          suggestions={slot.suggestions}
                          mealLabel={slot.title}
                        />
                      )}
                      
                      {slot.aiTip && (
                        <div style={{
                          background: '#FFF7ED', border: '1px solid rgba(232,101,10,0.2)',
                          borderRadius: 12, padding: '10px 14px', display: 'flex', gap: 10,
                          alignItems: 'flex-start', marginTop: 10
                        }}>
                          <Lightbulb size={14} style={{ color: SAF, flexShrink: 0, marginTop: 1 }}/>
                          <p
                            style={{ fontFamily: F, fontSize: 12, color: '#92400E', lineHeight: 1.65 }}>{slot.aiTip}</p>
                        </div>
                      )}
                      {slot.durationMins > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                          <Clock size={12} style={{ color: '#9CA3AF' }}/>
                          <span style={{ fontFamily: F, fontSize: 12, color: '#9CA3AF' }}>{slot.durationMins} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Travel Tips */}
            {aiItinerary.travelTips?.length > 0 && (
              <Reveal style={{ marginTop: 32 }}>
                <div style={{ background: '#fff', borderRadius: 22, border: '1px solid #F3F4F6', overflow: 'hidden' }}>
                  <div
                    style={{ padding: 'clamp(14px,2vw,20px) clamp(18px,3vw,28px)', borderBottom: '1px solid #F3F4F6' }}>
                    <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: '1.05rem', color: '#111', margin: 0 }}>✈️
                      Travel Tips</h3>
                  </div>
                  <div style={{
                    padding: 'clamp(16px,2vw,22px) clamp(18px,3vw,28px)',
                    display: 'flex', flexDirection: 'column', gap: 12
                  }}>
                    {aiItinerary.travelTips.map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%', background: SAF_BG,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, marginTop: 1
                        }}>
                          <span style={{ fontFamily: FM, fontSize: 10, fontWeight: 900, color: SAF }}>{i + 1}</span>
                        </div>
                        <p style={{ fontFamily: F, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
          
          {/* ── Right: Desktop Sidebar ── */}
          <div className="results-sidebar"
               style={{ display: 'none', flexDirection: 'column', gap: 24, position: 'sticky', top: 24 }}>
            <SidebarContent/>
          </div>
        </div>
      </div>
      
      <Footer/>
      
      <style>{`
        @media (min-width: 900px) {
          .results-grid { grid-template-columns: minmax(0,1fr) 360px !important; }
          .results-sidebar { display: flex !important; }
          .results-mobile-toggle { display: none !important; }
        }
        .results-grid ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}