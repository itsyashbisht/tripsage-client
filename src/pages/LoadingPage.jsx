// src/pages/LoadingPage.jsx
// Fixed: correctly extracts itinerary + hotelSuggestions from Redux, uses useNavigate
import { Navbar } from '../components/Navbar';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearGenerated,
  generateItinerary,
  selectGeneratedItinerary,
  selectGenerateError,
  selectGenerateLoading,
  selectGenerateMeta,
  selectPlannerForm,
  selectShareUrl,
} from '../store';
import { AlertCircle, Check } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';

const F = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const FM = '\'DM Mono\', monospace';
const SAF = '#E8650A';

const FACTS = [
  {
    icon: '🏯',
    text: 'Jaipur\'s Hawa Mahal has 953 tiny windows — designed so royal ladies could watch street festivals without being seen.'
  },
  {
    icon: '🌊',
    text: 'The Andaman Islands have over 500 coral species, making them one of Asia\'s top scuba diving destinations.'
  },
  {
    icon: '🐯',
    text: 'Ranthambore\'s tigers are unusually bold — spotted drinking from lakes right next to tourist jeeps.'
  },
  {
    icon: '🛶',
    text: 'Kerala\'s backwater canal network stretches over 900 km, longer than the entire coastline of Goa.'
  },
  {
    icon: '🏔',
    text: 'Ladakh\'s Nubra Valley at 3,048m still hosts double-humped Bactrian camels — a relic of the ancient Silk Route.'
  },
  {
    icon: '🕌',
    text: 'Varanasi is one of the world\'s oldest continuously inhabited cities, with over 3,000 years of recorded history.'
  },
  {
    icon: '☕',
    text: 'Coorg produces 30% of India\'s total coffee and is known as the \'Scotland of India\' for its misty estates.'
  },
  {
    icon: '🌅',
    text: 'Udaipur\'s City Palace was built over 400 years by 22 successive Maharanas — each one added their own wing.'
  },
];

const STEPS = [
  'Reading your travel preferences',
  'Mapping the optimal route',
  'Curating top attractions & entry fees',
  'Handpicking restaurants by area',
  'Selecting hotels for your budget tier',
  'Calculating your full budget breakdown',
  'Finalising your day-by-day itinerary',
];

export default function LoadingPage () {
  const navigate = useNavigate();        // ← useNavigate — used for ALL navigation
  const location = useLocation();
  const dispatch = useDispatch();
  const routeState = location.state || {};
  const plannerForm = useSelector(selectPlannerForm);
  
  // selectGeneratedItinerary → state.generate.generatedItinerary (the Mongo doc, already extracted by the slice)
  const itinerary = useSelector(selectGeneratedItinerary);
  const shareUrl = useSelector(selectShareUrl);
  const meta = useSelector(selectGenerateMeta);
  const loadingObj = useSelector(selectGenerateLoading);
  const errorObj = useSelector(selectGenerateError);
  const genError = errorObj.generating;
  
  const heroRef = useRef(null);
  const hasFired = useRef(false);
  
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const [done, setDone] = useState(false);
  
  const tripParams = {
    destination: routeState.destination || plannerForm.destination || '',
    originCity: routeState.origin || plannerForm.origin || '',
    days: routeState.days || plannerForm.days || 3,
    startDate: routeState.startDate || plannerForm.startDate || null,
    endDate: routeState.endDate || plannerForm.endDate || null,
    adults: routeState.adults || plannerForm.adults || 2,
    children: routeState.children || plannerForm.children || 0,
    tier: (routeState.tier || plannerForm.tier || 'standard').toLowerCase(),
    interests: routeState.interests || plannerForm.interests || [],
    dailyBudgetPerPerson: routeState.dailyBudget || plannerForm.dailyBudget || 3000,
  };
  
  // Fire the API call exactly once
  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;
    dispatch(clearGenerated());
    dispatch(generateItinerary(tripParams));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Progress bar + step ticker + fact rotator
  useEffect(() => {
    const stepT = setInterval(() => setStep(p => Math.min(p + 1, STEPS.length - 1)), 700);
    const progT = setInterval(() => setProgress(p => {
      if (done) return 100;
      if (p >= 92) return p + 0.08;
      return p + 1.2;
    }), 80);
    const factT = setInterval(() => setFactIdx(p => (p + 1) % FACTS.length), 2400);
    return () => {
      clearInterval(stepT);
      clearInterval(progT);
      clearInterval(factT);
    };
  }, [done]);
  
  // When Redux stores the generated itinerary → navigate to /results
  useEffect(() => {
    if (!itinerary || genError) return;
    
    // hotelSuggestions live in meta (added by the controller in the last session)
    const hotelSuggestions = meta?.hotelSuggestions || [];
    
    setDone(true);
    setProgress(100);
    setStep(STEPS.length - 1);
    
    setTimeout(() => {
      navigate('/results', {
        state: {
          // display context for the hero
          origin: routeState.origin || plannerForm.origin,
          destination: routeState.destination || plannerForm.destination,
          days: tripParams.days,
          tier: routeState.tier || plannerForm.tier || 'Standard',
          adults: tripParams.adults,
          children: tripParams.children,
          // the full Mongo itinerary document
          itinerary,
          // extras not persisted to DB
          shareUrl: shareUrl || null,
          hotelSuggestions,
        },
      });
    }, 900);
  }, [itinerary, genError]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const TIER_ICONS = { Economy: '🪙', Standard: '⭐', Luxury: '💎' };
  const tierIcon = TIER_ICONS[routeState.tier] || '⭐';
  const destName = (routeState.destination || plannerForm.destination || '').split(',')[0] || 'your destination';
  
  return (
    <div style={{ fontFamily: F, color: '#111', background: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar/>
      
      {/* Hero band */}
      <section ref={heroRef} style={{ position: 'relative', height: 'clamp(240px,36vh,380px)', overflow: 'hidden' }}>
        <motion.div style={{
          y: bgY, position: 'absolute', inset: '-20% 0', zIndex: 0,
          backgroundImage: 'url(\'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1920&q=85\')',
          backgroundSize: 'cover', backgroundPosition: 'center 38%'
        }}/>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(8,4,2,0.50) 0%, rgba(8,4,2,0.76) 100%)'
        }}/>
        <div style={{
          position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 'clamp(72px,10vw,96px) clamp(20px,5vw,40px) 0'
        }}>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{
                      color: SAF,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      marginBottom: 14
                    }}>
            ✦ &nbsp;{genError ? 'Generation Failed' : 'Generating Your Trip'}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                     style={{
                       color: '#fff',
                       fontWeight: 900,
                       fontSize: 'clamp(1.4rem,4vw,2.8rem)',
                       lineHeight: 1.08,
                       marginBottom: 16
                     }}>
            {genError ? 'Oops — something went wrong' : `Crafting your perfect ${destName} itinerary…`}
          </motion.h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              tripParams.days && `🌙 ${tripParams.days} nights`,
              tripParams.adults && `👥 ${tripParams.adults} adults`,
              routeState.tier && `${tierIcon} ${routeState.tier}`,
            ].filter(Boolean).map((pill, i) => (
              <span key={i} style={{
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999,
                padding: '6px 14px', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)'
              }}>
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>
      
      {/* Loading card */}
      <section style={{
        maxWidth: 560,
        margin: '-36px auto 0',
        padding: '0 clamp(16px,4vw,24px) 80px',
        position: 'relative',
        zIndex: 10
      }}>
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      background: '#fff', borderRadius: 28, padding: 'clamp(24px,4vw,38px)',
                      boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
                      border: `1px solid ${genError ? '#FEE2E2' : '#F3F4F6'}`
                    }}>
          
          {genError ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: '#FEE2E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
              }}>
                <AlertCircle size={28} style={{ color: '#EF4444' }}/>
              </div>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: '1.1rem', color: '#111', marginBottom: 8 }}>
                Generation Failed
              </h3>
              <p style={{ fontFamily: F, fontSize: 14, color: '#6B7280', marginBottom: 24, lineHeight: 1.7 }}>
                {typeof genError === 'string' ? genError : 'Something went wrong. Please try again.'}
              </p>
              {/* useNavigate for retry */}
              <motion.button onClick={() => navigate(-1)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                             style={{
                               background: SAF, color: '#fff', border: 'none', cursor: 'pointer',
                               borderRadius: 999, padding: '13px 28px', fontFamily: F, fontSize: 14, fontWeight: 700
                             }}>
                ← Go Back & Retry
              </motion.button>
            </div>
          ) : (
            <>
              {/* Spinner */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                <div style={{ position: 'relative', width: 68, height: 68 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                              style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                border: '2.5px solid transparent',
                                borderTopColor: SAF
                              }}/>
                  <motion.div animate={{ rotate: -360 }}
                              transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                              style={{
                                position: 'absolute',
                                inset: 9,
                                borderRadius: '50%',
                                border: '2px solid transparent',
                                borderTopColor: 'rgba(232,101,10,0.35)'
                              }}/>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: SAF }}/>
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div style={{ background: '#F3F4F6', borderRadius: 999, height: 6, marginBottom: 8, overflow: 'hidden' }}>
                <motion.div animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 0.4 }}
                            style={{
                              height: '100%',
                              background: `linear-gradient(90deg,${SAF},#F97316)`,
                              borderRadius: 999,
                              originX: 0
                            }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
                <p style={{ fontFamily: F, fontSize: 12, color: '#9CA3AF' }}>AI is working…</p>
                <p style={{
                  fontFamily: FM,
                  fontSize: 13,
                  fontWeight: 800,
                  color: SAF
                }}>{Math.min(Math.round(progress), 100)}%</p>
              </div>
              
              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {STEPS.map((s, i) => {
                  const isDone = i < step, isActive = i === step;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isDone ? '#16A34A' : isActive ? '#FDF0E6' : '#F3F4F6',
                        border: isActive ? `2px solid ${SAF}` : 'none'
                      }}>
                        {isDone
                          ? <Check size={12} style={{ color: '#fff' }}/>
                          : isActive
                            ? <motion.div animate={{ scale: [1, 1.4, 1] }}
                                          transition={{ duration: 0.75, repeat: Infinity }}
                                          style={{ width: 8, height: 8, borderRadius: '50%', background: SAF }}/>
                            : <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#D1D5DB' }}/>
                        }
                      </div>
                      <p style={{
                        fontFamily: F, fontSize: 'clamp(12px,1.5vw,14px)',
                        fontWeight: isActive ? 700 : 500,
                        color: isDone ? '#16A34A' : isActive ? SAF : '#9CA3AF', flex: 1
                      }}>
                        {s}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Rotating facts */}
              <AnimatePresence mode="wait">
                <motion.div key={factIdx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.38 }}
                            style={{
                              background: '#F9FAFB',
                              border: '1px solid #F3F4F6',
                              borderRadius: 18,
                              padding: 'clamp(14px,2vw,20px)'
                            }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>{FACTS[factIdx].icon}</span>
                    <div>
                      <p style={{
                        fontFamily: F, fontSize: 11, fontWeight: 800, color: SAF,
                        textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6
                      }}>
                        Did you know?
                      </p>
                      <p style={{
                        fontFamily: F,
                        fontSize: 'clamp(12px,1.4vw,13px)',
                        color: '#374151',
                        lineHeight: 1.7
                      }}>
                        {FACTS[factIdx].text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </section>
    </div>
  );
}