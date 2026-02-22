import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItineraryByToken, selectCurrentItinerary, selectItineraryError, selectItineraryLoading } from '../store';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { AlertCircle, Clock, Globe, Lightbulb } from 'lucide-react';

const F = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const FM = '\'DM Mono\', monospace';
const SAFFRON = '#E8650A';
const SAFFRON_BG = '#FDF0E6';

const TIER_ICON = { economy: '🪙', standard: '⭐', luxury: '💎' };
const TIER_COLOR = { economy: '#16A34A', standard: SAFFRON, luxury: '#9333EA' };
const SLOT_ICONS = { attraction: '📍', food: '🍛', transport: '🚗', hotel: '🏨', free: '🌿' };

const fadeUp = (d = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d } }
});

function Reveal ({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return <motion.div ref={ref} variants={fadeUp(delay)} initial="hidden" animate={inView ? 'show' : 'hidden'}
                     style={style}>{children}</motion.div>;
}

function SkeletonLine ({ width = '100%', height = 12 }) {
  return (
    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }}
                style={{ height, width, borderRadius: 999, background: '#E5E7EB', margin: '6px 0' }}/>
  );
}

export default function SharedTripPage () {
  const { token } = useParams();
  const dispatch = useDispatch();
  const itinerary = useSelector(selectCurrentItinerary);
  const loading = useSelector(selectItineraryLoading);
  const error = useSelector(selectItineraryError);

  const [activeDay, setActiveDay] = useState(1);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);

  useEffect(() => {
    if (token) dispatch(fetchItineraryByToken(token));
  }, [token, dispatch]);

  const tier = (itinerary?.budgetTier || 'standard').toLowerCase();
  const destName = itinerary?.destinationName || itinerary?.destination?.name || 'This Trip';
  const daySlots = itinerary?.days?.find(d => d.dayNumber === activeDay)?.slots || [];

  // Loading skeleton
  if (loading.current) {
    return (
      <div style={{ fontFamily: F, background: '#F9FAFB', minHeight: '100vh' }}>
        <Navbar/>
        <div style={{ height: '40vh', background: 'linear-gradient(135deg, #111 0%, #1f1208 100%)' }}/>
        <div style={{ maxWidth: 860, margin: '-40px auto 80px', padding: '0 24px' }}>
          <div style={{
            background: '#fff',
            borderRadius: 28,
            padding: '40px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.10)'
          }}>
            <SkeletonLine width="50%" height={28}/>
            <SkeletonLine width="35%" height={16}/>
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[1, 2, 3].map(i => <SkeletonLine key={i} width={`${60 + i * 10}%`}/>)}
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  // Error state
  if (error.current || (!loading.current && !itinerary)) {
    return (
      <div style={{ fontFamily: F, background: '#F9FAFB', minHeight: '100vh' }}>
        <Navbar/>
        <div style={{ maxWidth: 560, margin: '160px auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#FEF2F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <AlertCircle size={32} style={{ color: '#EF4444' }}/>
          </div>
          <h2 style={{ fontWeight: 900, fontSize: '1.5rem', color: '#111', marginBottom: 10 }}>Trip not found</h2>
          <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 28, lineHeight: 1.7 }}>
            This share link may have expired or the trip was deleted.
          </p>
          <Link to="/planner" style={{
            background: SAFFRON, color: '#fff', borderRadius: 999, padding: '14px 32px',
            fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 18px rgba(232,101,10,0.3)'
          }}>
            Plan Your Own Trip
          </Link>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: F, color: '#111', background: '#F9FAFB', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar/>

      {/* Hero */}
      <section ref={heroRef} style={{ position: 'relative', height: '44vh', minHeight: 300, overflow: 'hidden' }}>
        <motion.div style={{
          y: bgY, position: 'absolute', inset: '-20% 0', zIndex: 0,
          backgroundImage: 'url(\'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1920&q=85\')',
          backgroundSize: 'cover', backgroundPosition: 'center 38%'
        }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(8,4,2,0.48) 0%, rgba(8,4,2,0.84) 100%)'
        }}/>

        <div style={{
          position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 0'
        }}>
          {/* Shared badge */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.22)',
                        borderRadius: 999, padding: '7px 18px', marginBottom: 18
                      }}>
            <Globe size={13} style={{ color: SAFFRON }}/>
            <span style={{
              fontFamily: F,
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Shared Itinerary
            </span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                    style={{
                      color: SAFFRON,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      marginBottom: 12
                    }}>
            {TIER_ICON[tier]} {tier} · {itinerary?.totalDays} Days
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
                     style={{
                       color: '#fff',
                       fontWeight: 900,
                       fontSize: 'clamp(1.6rem,4vw,3rem)',
                       lineHeight: 1.06,
                       marginBottom: 14
                     }}>
            {itinerary?.title || `${destName} Itinerary`}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
                    style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
            {itinerary?.adults} adult{itinerary?.adults > 1 ? 's' : ''}{itinerary?.children > 0 ? ` + ${itinerary.children} child${itinerary.children > 1 ? 'ren' : ''}` : ''} · {destName}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* CTA to plan own trip */}
        <Reveal style={{ marginBottom: 32 }}>
          <div style={{
            background: `linear-gradient(135deg, ${SAFFRON_BG} 0%, #fff 100%)`,
            border: `1px solid rgba(232,101,10,0.2)`,
            borderRadius: 20,
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div>
              <p style={{ fontFamily: F, fontWeight: 800, fontSize: '1rem', color: '#111', marginBottom: 4 }}>Love this
                itinerary?</p>
              <p style={{ fontFamily: F, fontSize: 14, color: '#6B7280' }}>Create your own personalised trip with AI —
                free.</p>
            </div>
            <Link to="/planner" style={{
              background: SAFFRON,
              color: '#fff',
              borderRadius: 999,
              padding: '12px 28px',
              fontFamily: F,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(232,101,10,0.30)'
            }}>
              Plan My Trip →
            </Link>
          </div>
        </Reveal>

        {/* Day tabs */}
        <Reveal style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {itinerary?.days?.map(d => (
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
                               boxShadow: activeDay === d.dayNumber ? '0 4px 14px rgba(232,101,10,0.28)' : 'none'
                             }}>
                Day {d.dayNumber}
              </motion.button>
            ))}
          </div>
        </Reveal>

        {/* Active day title */}
        {(() => {
          const day = itinerary?.days?.find(d => d.dayNumber === activeDay);
          if (!day) return null;
          return (
            <Reveal style={{ marginBottom: 20 }}>
              <div style={{
                background: '#fff',
                borderRadius: 20,
                padding: '20px 26px',
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
                  marginBottom: 5
                }}>Day {day.dayNumber}</p>
                <h2 style={{
                  fontFamily: F,
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  color: '#111',
                  marginBottom: day.summary ? 8 : 0
                }}>{day.title}</h2>
                {day.summary &&
                  <p style={{ fontFamily: F, fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>{day.summary}</p>}
              </div>
            </Reveal>
          );
        })()}

        {/* Slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {daySlots.map((slot, idx) => (
            <Reveal key={idx} delay={idx * 0.04}>
              <div style={{
                background: '#fff', borderRadius: 20, padding: '22px 26px', border: '1px solid #F3F4F6',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', gap: 18, alignItems: 'flex-start'
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
                <div style={{ flex: 1 }}>
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
                        marginBottom: 2
                      }}>{slot.timeLabel}</p>}
                      <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: '1rem', color: '#111' }}>{slot.title}</h3>
                    </div>
                    {slot.estimatedCost > 0 && (
                      <span style={{
                        fontFamily: FM,
                        fontSize: 13,
                        fontWeight: 800,
                        color: SAFFRON,
                        background: SAFFRON_BG,
                        borderRadius: 999,
                        padding: '4px 12px'
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
                      gap: 10
                    }}>
                      <Lightbulb size={14} style={{ color: SAFFRON, flexShrink: 0, marginTop: 1 }}/>
                      <p style={{ fontFamily: F, fontSize: 12, color: '#92400E', lineHeight: 1.65 }}>{slot.aiTip}</p>
                    </div>
                  )}
                  {slot.durationMins > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      <Clock size={12} style={{ color: '#9CA3AF' }}/> <span
                      style={{ fontFamily: F, fontSize: 12, color: '#9CA3AF' }}>{slot.durationMins} min</span>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Travel tips */}
        {itinerary?.travelTips?.length > 0 && (
          <Reveal style={{ marginTop: 36 }}>
            <div style={{ background: '#fff', borderRadius: 22, border: '1px solid #F3F4F6', overflow: 'hidden' }}>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #F3F4F6' }}>
                <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: '1rem', color: '#111', margin: 0 }}>✈️ Travel
                  Tips</h3>
              </div>
              <div style={{ padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {itinerary.travelTips.map((tip, i) => (
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

        {/* Bottom CTA */}
        <Reveal style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ fontFamily: F, fontSize: 16, color: '#6B7280', marginBottom: 20 }}>Ready to plan your own
            adventure?</p>
          <Link to="/planner" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: SAFFRON,
            color: '#fff',
            borderRadius: 999,
            padding: '16px 40px',
            fontFamily: F,
            fontWeight: 800,
            fontSize: 16,
            textDecoration: 'none',
            boxShadow: '0 6px 24px rgba(232,101,10,0.34)'
          }}>
            🤖 Generate My AI Itinerary
          </Link>
        </Reveal>
      </div>

      <Footer/>
    </div>
  );
}