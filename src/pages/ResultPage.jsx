// src/pages/ResultsPage.jsx — Redux-connected: save, share, read from store
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
import { Bookmark, Check, Clock, Copy, Hotel, Lightbulb, Share2 } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const F = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const FM = '\'DM Mono\', monospace';
const SAFFRON = '#E8650A';
const SAFFRON_BG = '#FDF0E6';

const fadeUp = (d = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d } }
});
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const cardV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

function Reveal ({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} variants={fadeUp(delay)} initial="hidden" animate={inView ? 'show' : 'hidden'} style={style}>
      {children}
    </motion.div>
  );
}

const CHART_COLORS = { Accommodation: '#1D4ED8', Food: '#16A34A', Transport: SAFFRON, 'Entry Fees': '#9333EA' };
const TIER_ICON = { economy: '🪙', standard: '⭐', luxury: '💎' };
const TIER_COLOR = { economy: '#16A34A', standard: SAFFRON, luxury: '#9333EA' };
const SLOT_ICONS = { attraction: '📍', food: '🍛', transport: '🚗', hotel: '🏨', free: '🌿' };

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
  const destination = aiItinerary?.destination?.name || aiItinerary?.destinationName || state.destination || 'Jaipur';
  const days = aiItinerary?.totalDays || state.days || 3;
  const adults = aiItinerary?.adults || state.adults || 2;
  const tier = (aiItinerary?.budgetTier || state.tier || 'standard').toLowerCase();

  const [activeDay, setActiveDay] = useState(1);
  const [budgetTier, setBudgetTier] = useState(tier);
  const [copied, setCopied] = useState(false);

  // Hero parallax
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Budget
  const budgetBreakdowns = aiItinerary?.budgetBreakdown || [];
  const currentBreakdown = budgetBreakdowns.find(b => b.tier === budgetTier) || null;
  const chartData = currentBreakdown ? [
    { name: 'Accommodation', value: currentBreakdown.accommodation },
    { name: 'Food', value: currentBreakdown.food },
    { name: 'Transport', value: currentBreakdown.transport },
    { name: 'Entry Fees', value: currentBreakdown.entryFees },
  ].filter(d => d.value > 0) : [];

  const daySlots = aiItinerary?.days?.find(d => d.dayNumber === activeDay)?.slots || [];

  // Share URL — from Redux or router state
  const shareUrl = shareData?.shareUrl || state.shareUrl || (aiItinerary?.shareToken ? `${window.location.origin}/trip/${aiItinerary.shareToken}` : null);

  // Success effects
  useEffect(() => {
    if (itin_success.save) {
      dispatch(clearItinerarySuccess('save'));
    }
  }, [itin_success.save, dispatch]);

  useEffect(() => {
    return () => dispatch(clearShareData());
  }, [dispatch]);

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
    const url = shareUrl || window.location.href;
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!aiItinerary) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: F,
        gap: 16
      }}>
        <p style={{ fontSize: 22, fontWeight: 800 }}>No itinerary found.</p>
        <Link to="/planner" style={{
          background: SAFFRON,
          color: '#fff',
          borderRadius: 999,
          padding: '13px 30px',
          fontWeight: 700,
          textDecoration: 'none'
        }}>Plan a Trip</Link>
      </div>
    );
  }

  const heroImg = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1920&q=85';

  return (
    <div style={{ fontFamily: F, color: '#111', background: '#F9FAFB', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar/>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ position: 'relative', height: '48vh', minHeight: 340, overflow: 'hidden' }}>
        <motion.div style={{
          y: bgY, position: 'absolute', inset: '-20% 0', zIndex: 0,
          backgroundImage: `url('${heroImg}')`, backgroundSize: 'cover', backgroundPosition: 'center 38%'
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
          background: 'radial-gradient(ellipse at 52% 50%, rgba(232,101,10,0.20) 0%, transparent 62%)'
        }}/>

        <motion.div style={{
          opacity: fadeOut, position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 0'
        }}>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{
                      color: SAFFRON,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      marginBottom: 14
                    }}>
            {TIER_ICON[tier]} {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan · {days} Days
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                     style={{
                       color: '#fff',
                       fontWeight: 900,
                       fontSize: 'clamp(1.8rem,4.5vw,3.2rem)',
                       lineHeight: 1.06,
                       marginBottom: 18
                     }}>
            {aiItinerary.title || `Your ${destination} Itinerary`}
          </motion.h1>

          {/* Action buttons */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
                      style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>

            {/* Save */}
            <motion.button onClick={handleSave} disabled={itin_loading.save || itin_success.save}
                           whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                           style={{
                             display: 'flex',
                             alignItems: 'center',
                             gap: 8,
                             padding: '11px 22px',
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

            {/* Share */}
            <motion.button onClick={shareUrl ? handleCopy : handleShare} disabled={itin_loading.share}
                           whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                           style={{
                             display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 999,
                             background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(12px)',
                             border: '1px solid rgba(255,255,255,0.28)', fontFamily: F, fontSize: 14, fontWeight: 700,
                             cursor: itin_loading.share ? 'wait' : 'pointer', color: '#fff'
                           }}>
              {copied ? <><Check size={15}/> Copied!</> : shareUrl ? <><Copy size={15}/> Copy Link</> : <><Share2
                size={15}/> {itin_loading.share ? 'Creating…' : 'Share'}</>}
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>

          {/* Left — Day-by-day */}
          <div>
            {/* Day tabs */}
            <Reveal>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                {aiItinerary.days?.map(d => (
                  <motion.button key={d.dayNumber} onClick={() => setActiveDay(d.dayNumber)}
                                 whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                 style={{
                                   padding: '9px 20px',
                                   borderRadius: 999,
                                   fontFamily: F,
                                   fontSize: 13,
                                   fontWeight: activeDay === d.dayNumber ? 800 : 500,
                                   background: activeDay === d.dayNumber ? SAFFRON : '#fff',
                                   color: activeDay === d.dayNumber ? '#fff' : '#6B7280',
                                   border: `1.5px solid ${activeDay === d.dayNumber ? SAFFRON : '#E5E7EB'}`,
                                   cursor: 'pointer',
                                   boxShadow: activeDay === d.dayNumber ? '0 4px 16px rgba(232,101,10,0.3)' : 'none'
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
                <Reveal style={{ marginBottom: 24 }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: 20,
                    padding: '22px 28px',
                    border: '1px solid #F3F4F6',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
                  }}>
                    <p style={{
                      fontFamily: FM,
                      fontSize: 12,
                      color: SAFFRON,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: 6
                    }}>Day {day.dayNumber}</p>
                    <h2 style={{
                      fontFamily: F,
                      fontWeight: 900,
                      fontSize: '1.3rem',
                      color: '#111',
                      marginBottom: 8
                    }}>{day.title || `Day ${day.dayNumber}`}</h2>
                    {day.summary &&
                      <p style={{ fontFamily: F, fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>{day.summary}</p>}
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
                              background: '#fff',
                              borderRadius: 20,
                              padding: '22px 26px',
                              border: '1px solid #F3F4F6',
                              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                              display: 'flex',
                              gap: 18,
                              alignItems: 'flex-start'
                            }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: SAFFRON_BG,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0
                  }}>
                    {SLOT_ICONS[slot.type] || '📍'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 6,
                      flexWrap: 'wrap',
                      gap: 8
                    }}>
                      <div>
                        {slot.timeLabel && <p style={{
                          fontFamily: FM,
                          fontSize: 11,
                          color: SAFFRON,
                          fontWeight: 700,
                          marginBottom: 3
                        }}>{slot.timeLabel}</p>}
                        <h3
                          style={{ fontFamily: F, fontWeight: 800, fontSize: '1rem', color: '#111' }}>{slot.title}</h3>
                      </div>
                      {slot.estimatedCost > 0 && (
                        <span style={{
                          fontFamily: FM,
                          fontSize: 13,
                          fontWeight: 800,
                          color: SAFFRON,
                          background: SAFFRON_BG,
                          borderRadius: 999,
                          padding: '4px 12px',
                          flexShrink: 0
                        }}>
                          ₹{slot.estimatedCost.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {slot.description && <p style={{
                      fontFamily: F,
                      fontSize: 13,
                      color: '#6B7280',
                      lineHeight: 1.7,
                      marginBottom: slot.aiTip ? 10 : 0
                    }}>{slot.description}</p>}
                    {slot.aiTip && (
                      <div style={{
                        background: '#FFF7ED',
                        border: '1px solid rgba(232,101,10,0.2)',
                        borderRadius: 12,
                        padding: '10px 14px',
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start'
                      }}>
                        <Lightbulb size={14} style={{ color: SAFFRON, flexShrink: 0, marginTop: 1 }}/>
                        <p style={{ fontFamily: F, fontSize: 12, color: '#92400E', lineHeight: 1.65 }}>{slot.aiTip}</p>
                      </div>
                    )}
                    {slot.durationMins > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                        <Clock size={12} style={{ color: '#9CA3AF' }}/>
                        <span style={{ fontFamily: F, fontSize: 12, color: '#9CA3AF' }}>{slot.durationMins} min</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Travel Tips */}
            {aiItinerary.travelTips?.length > 0 && (
              <Reveal style={{ marginTop: 36 }}>
                <div style={{ background: '#fff', borderRadius: 22, border: '1px solid #F3F4F6', overflow: 'hidden' }}>
                  <div style={{ padding: '20px 28px', borderBottom: '1px solid #F3F4F6' }}>
                    <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: '1.05rem', color: '#111', margin: 0 }}>✈️
                      Travel Tips</h3>
                  </div>
                  <div style={{ padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {aiItinerary.travelTips.map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: SAFFRON_BG,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 1
                        }}>
                          <span style={{ fontFamily: FM, fontSize: 10, fontWeight: 900, color: SAFFRON }}>{i + 1}</span>
                        </div>
                        <p style={{ fontFamily: F, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 24 }}>

            {/* Budget tier toggle */}
            <Reveal>
              <div style={{ background: '#fff', borderRadius: 22, border: '1px solid #F3F4F6', overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid #F3F4F6' }}>
                  <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: '0.95rem', color: '#111', margin: 0 }}>Budget
                    Breakdown</h3>
                </div>
                {/* Tier selector */}
                <div style={{ display: 'flex', padding: '12px', gap: 6, borderBottom: '1px solid #F3F4F6' }}>
                  {['economy', 'standard', 'luxury'].map(t => (
                    <button key={t} onClick={() => setBudgetTier(t)}
                            style={{
                              flex: 1,
                              padding: '8px 4px',
                              borderRadius: 999,
                              fontFamily: F,
                              fontSize: 11,
                              fontWeight: budgetTier === t ? 800 : 500,
                              cursor: 'pointer',
                              border: `1.5px solid ${budgetTier === t ? TIER_COLOR[t] : '#E5E7EB'}`,
                              background: budgetTier === t ? TIER_COLOR[t] : 'transparent',
                              color: budgetTier === t ? '#fff' : '#6B7280',
                              transition: 'all 0.18s',
                              textTransform: 'capitalize'
                            }}>
                      {TIER_ICON[t]} {t}
                    </button>
                  ))}
                </div>
                {currentBreakdown ? (
                  <div style={{ padding: '22px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <p style={{ fontFamily: FM, fontWeight: 900, fontSize: '1.8rem', color: TIER_COLOR[budgetTier] }}>
                        ₹{currentBreakdown.perPerson?.toLocaleString('en-IN') || '—'}
                      </p>
                      <p style={{ fontFamily: F, fontSize: 12, color: '#9CA3AF' }}>per person ·
                        ₹{currentBreakdown.total?.toLocaleString('en-IN')} total</p>
                    </div>
                    {chartData.length > 0 && (
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3}
                               dataKey="value">
                            {chartData.map((entry, i) => (
                              <Cell key={i} fill={Object.values(CHART_COLORS)[i % 4]}/>
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`}/>
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                      {[
                        { label: 'Accommodation', value: currentBreakdown.accommodation },
                        { label: 'Food', value: currentBreakdown.food },
                        { label: 'Transport', value: currentBreakdown.transport },
                        { label: 'Entry Fees', value: currentBreakdown.entryFees },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 10,
                              height: 10,
                              borderRadius: 3,
                              background: Object.values(CHART_COLORS)[i]
                            }}/>
                            <span style={{ fontFamily: F, fontSize: 12, color: '#6B7280' }}>{item.label}</span>
                          </div>
                          <span style={{
                            fontFamily: FM,
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#111'
                          }}>₹{item.value?.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ fontFamily: F, fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: '22px' }}>No
                    budget data available</p>
                )}
              </div>
            </Reveal>

            {/* Hotels */}
            {aiItinerary.hotels?.length > 0 && (
              <Reveal>
                <div style={{ background: '#fff', borderRadius: 22, border: '1px solid #F3F4F6', overflow: 'hidden' }}>
                  <div style={{
                    padding: '18px 22px',
                    borderBottom: '1px solid #F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    <Hotel size={16} style={{ color: SAFFRON }}/>
                    <h3 style={{
                      fontFamily: F,
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      color: '#111',
                      margin: 0
                    }}>Recommended Hotels</h3>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {aiItinerary.hotels.slice(0, 3).map((h, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'center',
                        padding: '12px',
                        background: '#F9FAFB',
                        borderRadius: 16
                      }}>
                        <div style={{
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          background: SAFFRON_BG,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Hotel size={17} style={{ color: SAFFRON }}/>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontFamily: F,
                            fontWeight: 700,
                            fontSize: 13,
                            color: '#111',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {h.hotel?.name || 'Hotel'}
                          </p>
                          <p style={{
                            fontFamily: FM,
                            fontSize: 11,
                            color: SAFFRON,
                            margin: 0
                          }}>₹{h.pricePerNight?.toLocaleString('en-IN')}/night</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Local phrases */}
            {aiItinerary.localPhrases?.length > 0 && (
              <Reveal>
                <div style={{
                  background: 'linear-gradient(135deg, #111 0%, #1f1208 100%)',
                  borderRadius: 22,
                  padding: '22px',
                  color: '#fff'
                }}>
                  <p style={{ fontFamily: F, fontWeight: 800, fontSize: '0.95rem', marginBottom: 14 }}>🗣️ Useful Local
                    Phrases</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {aiItinerary.localPhrases.slice(0, 4).map((p, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        paddingBottom: 8
                      }}>
                        <span style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{p.phrase}</span>
                        <span style={{ fontFamily: FM, fontSize: 12, color: SAFFRON }}>{p.translation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Plan another */}
            <Reveal>
              <Link to="/planner"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      background: SAFFRON,
                      color: '#fff',
                      borderRadius: 999,
                      padding: '14px',
                      fontFamily: F,
                      fontWeight: 800,
                      fontSize: 14,
                      textDecoration: 'none',
                      boxShadow: '0 6px 22px rgba(232,101,10,0.32)'
                    }}>
                Plan Another Trip
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}