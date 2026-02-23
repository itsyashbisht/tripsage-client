// src/pages/PlannerPage.jsx
// Navigation: useNavigate ONLY — no <Link> wrapper on any button
import { Navbar } from '../components/Navbar';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlannerForm, setPlannerForm } from '../store';
import { ArrowRight, Calendar, ChevronDown, MapPin, Minus, Plus, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';

const F = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const FM = '\'DM Mono\', monospace';
const SAF = '#E8650A';
const SAF_BG = '#FDF0E6';

const fadeUp = (d = 0) => ({
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d } },
});
const pkgV = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const gridC = { hidden: {}, show: { transition: { staggerChildren: 0.11 } } };

const CITIES = [
  'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Bhopal', 'Surat',
];
const DESTINATIONS = [
  'Jaipur, Rajasthan', 'Goa', 'Kerala Backwaters', 'Ladakh',
  'Udaipur, Rajasthan', 'Manali, Himachal Pradesh', 'Rishikesh, Uttarakhand',
  'Hampi, Karnataka', 'Varanasi, Uttar Pradesh', 'Andaman Islands',
  'Coorg, Karnataka', 'Ranthambore, Rajasthan', 'Spiti Valley',
  'Darjeeling', 'Mysuru, Karnataka',
];
const INTERESTS = [
  'Heritage', 'Beaches', 'Adventure', 'Food', 'Wildlife',
  'Spiritual', 'Nature', 'Nightlife', 'Shopping', 'Wellness',
];
const PKG_IMGS = {
  Economy: 'https://images.unsplash.com/photo-1590050811270-c33c6df97517?auto=format&fit=crop&w=800&q=80',
  Standard: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
  Luxury: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
};

const buildPkgs = (days, adults, children, dailyBudget) => {
  const pax = adults + children * 0.5;
  const base = dailyBudget * days * pax;
  return [
    {
      tier: 'Economy', icon: '🪙', color: '#16A34A', lightBg: '#DCFCE7',
      headline: 'Travel smart, spend less.',
      desc: 'Hostels, local trains, dhabas — experience India like a local.',
      perPerson: Math.round(base * 0.55 / adults), total: Math.round(base * 0.55),
      extras: ['Local guided walks', 'Street food trail', 'Budget temple visits'],
    },
    {
      tier: 'Standard', icon: '⭐', color: SAF, lightBg: SAF_BG, popular: true,
      headline: 'Comfort meets authenticity.',
      desc: 'Handpicked 3–4★ stays, private transport, and the city\'s best mid-range dining.',
      perPerson: Math.round(base / adults), total: Math.round(base),
      extras: ['Guided heritage tours', 'Curated dining picks', 'Comfortable AC transport'],
    },
    {
      tier: 'Luxury', icon: '💎', color: '#9333EA', lightBg: '#F5F3FF',
      headline: 'Nothing but the finest.',
      desc: 'Palace hotels, chauffeur-driven SUVs, private guides, and exclusive culinary experiences.',
      perPerson: Math.round(base * 2.3 / adults), total: Math.round(base * 2.3),
      extras: ['Private heritage access', 'Spa & wellness daily', 'Exclusive local experiences'],
    },
  ];
};

function Label ({ children }) {
  return <p style={{
    fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase',
    letterSpacing: '0.15em', marginBottom: 8, fontFamily: F
  }}>{children}</p>;
}

function Shell ({ error, children }) {
  return (
    <div style={{
      background: '#F9FAFB', border: `1.5px solid ${error ? '#FCA5A5' : '#E5E7EB'}`,
      borderRadius: 14, overflow: 'hidden', display: 'flex', alignItems: 'center'
    }}>
      {children}
    </div>
  );
}

function Counter ({ value, min = 0, onInc, onDec }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px', background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 14
    }}>
      <button type="button" onClick={() => onDec(Math.max(min, value - 1))} disabled={value <= min}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #E5E7EB',
                background: value <= min ? '#F9FAFB' : '#fff', cursor: value <= min ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: value <= min ? '#D1D5DB' : '#111', flexShrink: 0
              }}>
        <Minus size={13}/>
      </button>
      <span style={{ fontFamily: FM, fontWeight: 800, fontSize: 17, color: '#111' }}>{value}</span>
      <button type="button" onClick={() => onInc(value + 1)}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #E5E7EB',
                background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#111', flexShrink: 0
              }}>
        <Plus size={13}/>
      </button>
    </div>
  );
}

export default function PlannerPage () {
  const navigate = useNavigate();   // ← THE ONLY navigation hook used in this file
  const dispatch = useDispatch();
  const savedForm = useSelector(selectPlannerForm);
  
  const heroRef = useRef(null);
  const pkgsRef = useRef(null);
  
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const fadeO = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  
  const [origin, setOrigin] = useState(savedForm.origin || '');
  const [destination, setDest] = useState(savedForm.destination || '');
  const [startDate, setStart] = useState(savedForm.startDate || '');
  const [endDate, setEnd] = useState(savedForm.endDate || '');
  const [adults, setAdults] = useState(savedForm.adults || 2);
  const [children, setChildren] = useState(savedForm.children || 0);
  const [dailyBudget, setBudget] = useState(savedForm.dailyBudget || 3000);
  const [interests, setInterests] = useState(savedForm.interests || []);
  const [errors, setErrors] = useState({});
  const [packages, setPackages] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  
  const days = startDate && endDate
    ? Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000))
    : savedForm.days || 3;
  
  const sync = (field, value, setter) => {
    setter(value);
    dispatch(setPlannerForm({ [field]: value }));
  };
  
  const toggleInterest = (v) => {
    const next = interests.includes(v) ? interests.filter(i => i !== v) : [...interests, v];
    setInterests(next);
    dispatch(setPlannerForm({ interests: next }));
  };
  
  const validate = () => {
    const e = {};
    if (!origin.trim()) e.origin = 'Please select your departure city.';
    if (!destination.trim()) e.destination = 'Please select a destination.';
    if (!startDate) e.startDate = 'Please pick a start date.';
    if (!endDate) e.endDate = 'Please pick an end date.';
    if (startDate && endDate && new Date(endDate) <= new Date(startDate))
      e.endDate = 'End date must be after start date.';
    return e;
  };
  
  // Step 1: validate -> show package cards
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    dispatch(setPlannerForm({ days }));
    setPackages(buildPkgs(days, adults, children, dailyBudget));
    setSubmitted(true);
    setTimeout(() => pkgsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };
  
  // Step 2: user picks tier -> navigate to /loading using useNavigate
  const handleSelectPackage = (tier) => {
    dispatch(setPlannerForm({
      origin,
      destination,
      days,
      startDate,
      endDate,
      adults,
      children,
      dailyBudget,
      interests,
      tier
    }));
    navigate('/loading', {
      state: {
        origin,
        destination,
        days,
        startDate,
        endDate,
        adults,
        children,
        tier,
        interests,
        dailyBudget
      }
    });
  };
  
  return (
    <div style={{ fontFamily: F, color: '#111', overflowX: 'hidden', background: '#fff', minHeight: '100vh' }}>
      <Navbar/>
      
      {/* Hero */}
      <section ref={heroRef} style={{ position: 'relative', height: 'clamp(260px,38vh,420px)', overflow: 'hidden' }}>
        <motion.div style={{
          y: bgY, position: 'absolute', inset: '-20% 0', zIndex: 0,
          backgroundImage: 'url(\'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=85\')',
          backgroundSize: 'cover', backgroundPosition: 'center 38%'
        }}/>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(8,4,2,0.46) 0%, rgba(8,4,2,0.80) 100%)'
        }}/>
        <motion.div style={{
          opacity: fadeO, position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 'clamp(72px,10vw,96px) clamp(20px,5vw,40px) 0'
        }}>
          <motion.p variants={fadeUp(0.06)} initial="hidden" animate="show"
                    style={{
                      color: SAF,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      marginBottom: 14
                    }}>
            ✦ Plan Your Perfect Trip
          </motion.p>
          <motion.h1 variants={fadeUp(0.16)} initial="hidden" animate="show"
                     style={{
                       color: '#fff',
                       fontWeight: 900,
                       fontSize: 'clamp(1.7rem,4.5vw,3rem)',
                       lineHeight: 1.06,
                       marginBottom: 12
                     }}>
            Where do you want to go?
          </motion.h1>
          <motion.p variants={fadeUp(0.26)} initial="hidden" animate="show"
                    style={{
                      color: 'rgba(255,255,255,0.65)',
                      fontSize: 'clamp(0.88rem,1.6vw,1rem)',
                      maxWidth: 460,
                      lineHeight: 1.8
                    }}>
            Tell us your preferences — our AI crafts a personalised day-by-day itinerary in seconds.
          </motion.p>
        </motion.div>
      </section>
      
      {/* Form card */}
      <section style={{
        maxWidth: 780,
        margin: '-40px auto 0',
        padding: '0 clamp(16px,4vw,32px) 80px',
        position: 'relative',
        zIndex: 10
      }}>
        <motion.div variants={fadeUp(0.1)} initial="hidden" animate="show"
                    style={{
                      background: '#fff', borderRadius: 28, padding: 'clamp(24px,4vw,40px)',
                      boxShadow: '0 24px 80px rgba(0,0,0,0.11)', border: '1px solid #F3F4F6'
                    }}>
          
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Origin + Destination */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: 20
            }}>
              <div>
                <Label>Travelling From</Label>
                <Shell error={errors.origin}>
                  <MapPin size={16} style={{ margin: '0 0 0 14px', color: '#9CA3AF', flexShrink: 0 }}/>
                  <select value={origin} onChange={e => sync('origin', e.target.value, setOrigin)}
                          style={{
                            flex: 1, padding: '14px 12px', background: 'transparent', border: 'none',
                            fontFamily: F, fontSize: 14, color: origin ? '#111' : '#9CA3AF',
                            outline: 'none', appearance: 'none', cursor: 'pointer', width: '100%'
                          }}>
                    <option value="">Select departure city</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={15} style={{ margin: '0 12px 0 0', color: '#9CA3AF', flexShrink: 0 }}/>
                </Shell>
                {errors.origin &&
                  <p style={{ fontSize: 12, color: '#EF4444', marginTop: 5, fontFamily: F }}>{errors.origin}</p>}
              </div>
              <div>
                <Label>Destination</Label>
                <Shell error={errors.destination}>
                  <MapPin size={16} style={{ margin: '0 0 0 14px', color: '#9CA3AF', flexShrink: 0 }}/>
                  <select value={destination} onChange={e => sync('destination', e.target.value, setDest)}
                          style={{
                            flex: 1, padding: '14px 12px', background: 'transparent', border: 'none',
                            fontFamily: F, fontSize: 14, color: destination ? '#111' : '#9CA3AF',
                            outline: 'none', appearance: 'none', cursor: 'pointer', width: '100%'
                          }}>
                    <option value="">Choose destination</option>
                    {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={15} style={{ margin: '0 12px 0 0', color: '#9CA3AF', flexShrink: 0 }}/>
                </Shell>
                {errors.destination &&
                  <p style={{ fontSize: 12, color: '#EF4444', marginTop: 5, fontFamily: F }}>{errors.destination}</p>}
              </div>
            </div>
            
            {/* Dates */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: 20
            }}>
              <div>
                <Label>Start Date</Label>
                <Shell error={errors.startDate}>
                  <Calendar size={16} style={{ margin: '0 0 0 14px', color: '#9CA3AF', flexShrink: 0 }}/>
                  <input type="date" value={startDate} min={new Date().toISOString().split('T')[0]}
                         onChange={e => sync('startDate', e.target.value, setStart)}
                         style={{
                           flex: 1, padding: '14px', background: 'transparent', border: 'none',
                           fontFamily: F, fontSize: 14, color: '#111', outline: 'none', width: '100%'
                         }}/>
                </Shell>
                {errors.startDate &&
                  <p style={{ fontSize: 12, color: '#EF4444', marginTop: 5, fontFamily: F }}>{errors.startDate}</p>}
              </div>
              <div>
                <Label>End Date</Label>
                <Shell error={errors.endDate}>
                  <Calendar size={16} style={{ margin: '0 0 0 14px', color: '#9CA3AF', flexShrink: 0 }}/>
                  <input type="date" value={endDate} min={startDate || new Date().toISOString().split('T')[0]}
                         onChange={e => sync('endDate', e.target.value, setEnd)}
                         style={{
                           flex: 1, padding: '14px', background: 'transparent', border: 'none',
                           fontFamily: F, fontSize: 14, color: '#111', outline: 'none', width: '100%'
                         }}/>
                </Shell>
                {errors.endDate &&
                  <p style={{ fontSize: 12, color: '#EF4444', marginTop: 5, fontFamily: F }}>{errors.endDate}</p>}
              </div>
              {startDate && endDate && days > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: SAF_BG, border: `1.5px solid ${SAF}30`, borderRadius: 14,
                  padding: '14px 18px', alignSelf: 'flex-end'
                }}>
                  <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: SAF }}>
                    🌙 {days} night{days !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            
            {/* Guests + Budget */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
              gap: 20
            }}>
              <div>
                <Label>Adults</Label>
                <Counter value={adults} min={1} onInc={v => sync('adults', v, setAdults)}
                         onDec={v => sync('adults', v, setAdults)}/>
              </div>
              <div>
                <Label>Children</Label>
                <Counter value={children} min={0} onInc={v => sync('children', v, setChildren)}
                         onDec={v => sync('children', v, setChildren)}/>
              </div>
              <div>
                <Label>Daily Budget (₹/person)</Label>
                <Shell>
                  <span style={{
                    paddingLeft: 14,
                    color: '#9CA3AF',
                    fontWeight: 700,
                    fontSize: 15,
                    fontFamily: FM
                  }}>₹</span>
                  <input type="number" value={dailyBudget} min={500} step={500}
                         onChange={e => sync('dailyBudget', Number(e.target.value), setBudget)}
                         style={{
                           flex: 1, padding: '14px 14px 14px 8px', background: 'transparent',
                           border: 'none', fontFamily: FM, fontSize: 14, color: '#111', outline: 'none', width: '100%'
                         }}/>
                </Shell>
              </div>
            </div>
            
            {/* Interests */}
            <div>
              <Label>Interests (optional)</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {INTERESTS.map(v => {
                  const active = interests.includes(v);
                  return (
                    <motion.button key={v} type="button" onClick={() => toggleInterest(v)}
                                   whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                   style={{
                                     padding: '9px 18px', borderRadius: 999, fontFamily: F, fontSize: 13,
                                     fontWeight: active ? 700 : 500, cursor: 'pointer',
                                     border: `1.5px solid ${active ? SAF : '#E5E7EB'}`,
                                     background: active ? SAF_BG : '#fff',
                                     color: active ? SAF : '#6B7280', transition: 'all 0.18s'
                                   }}>
                      {v}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            {/* type="submit" — triggers handleSubmit which shows packages */}
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                           style={{
                             width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                             background: SAF, color: '#fff', border: 'none', cursor: 'pointer',
                             borderRadius: 999, padding: 'clamp(15px,2vw,18px) 32px',
                             fontFamily: F, fontSize: 16, fontWeight: 800,
                             boxShadow: '0 6px 24px rgba(232,101,10,0.36)'
                           }}>
              See Package Options <ArrowRight size={18}/>
            </motion.button>
          </form>
        </motion.div>
        
        {/* Package cards */}
        <AnimatePresence>
          {submitted && packages.length > 0 && (
            <div ref={pkgsRef} style={{ marginTop: 52 }}>
              <motion.div variants={fadeUp(0)} initial="hidden" animate="show"
                          style={{ textAlign: 'center', marginBottom: 36 }}>
                <p style={{
                  fontWeight: 900,
                  fontSize: 'clamp(1.4rem,3vw,2rem)',
                  color: '#111',
                  marginBottom: 8,
                  fontFamily: F
                }}>
                  Choose your experience
                </p>
                <p style={{ fontSize: 15, color: '#6B7280', fontFamily: F }}>
                  {days} night{days !== 1 ? 's' : ''} · {adults} adult{adults > 1 ? 's' : ''}{children > 0 ? ` + ${children} child${children > 1 ? 'ren' : ''}` : ''} · {destination.split(',')[0]}
                </p>
              </motion.div>
              
              <motion.div variants={gridC} initial="hidden" animate="show"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                            gap: 22
                          }}>
                {packages.map(pkg => (
                  <motion.div key={pkg.tier} variants={pkgV}
                              style={{
                                background: '#fff', borderRadius: 28,
                                border: `2px solid ${pkg.popular ? pkg.color : '#F3F4F6'}`,
                                overflow: 'hidden', position: 'relative',
                                boxShadow: pkg.popular ? `0 12px 40px ${pkg.color}30` : '0 4px 20px rgba(0,0,0,0.06)',
                                display: 'flex', flexDirection: 'column'
                              }}>
                    
                    {pkg.popular && (
                      <div style={{
                        position: 'absolute',
                        top: 18,
                        right: 18,
                        background: pkg.color,
                        color: '#fff',
                        borderRadius: 999,
                        padding: '4px 12px',
                        fontSize: 11,
                        fontWeight: 800,
                        fontFamily: F,
                        zIndex: 2
                      }}>
                        Most Popular
                      </div>
                    )}
                    
                    <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                      <img src={PKG_IMGS[pkg.tier]} alt={pkg.tier}
                           style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(to bottom, transparent 30%, ${pkg.lightBg} 100%)`
                      }}/>
                    </div>
                    
                    <div style={{
                      padding: 'clamp(16px,3vw,22px) clamp(18px,3vw,24px)',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <span style={{ fontSize: 26 }}>{pkg.icon}</span>
                        <div>
                          <p style={{
                            fontFamily: F,
                            fontWeight: 900,
                            fontSize: '1.05rem',
                            color: pkg.color,
                            margin: 0
                          }}>{pkg.tier}</p>
                          <p style={{ fontFamily: F, fontSize: 12, color: '#9CA3AF', margin: 0 }}>{pkg.headline}</p>
                        </div>
                      </div>
                      
                      <p style={{
                        fontFamily: F,
                        fontSize: 13,
                        color: '#6B7280',
                        lineHeight: 1.65,
                        marginBottom: 16,
                        flex: 1
                      }}>{pkg.desc}</p>
                      
                      <div
                        style={{ background: pkg.lightBg, borderRadius: 16, padding: '14px 16px', marginBottom: 16 }}>
                        <p style={{
                          fontFamily: F,
                          fontSize: 11,
                          fontWeight: 800,
                          color: '#9CA3AF',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          marginBottom: 6
                        }}>Estimated Cost</p>
                        <p style={{
                          fontFamily: FM,
                          fontWeight: 900,
                          fontSize: '1.4rem',
                          color: pkg.color,
                          margin: 0
                        }}>₹{pkg.perPerson.toLocaleString('en-IN')}</p>
                        <p style={{ fontFamily: F, fontSize: 12, color: '#9CA3AF', margin: 0 }}>per person ·
                          ₹{pkg.total.toLocaleString('en-IN')} total</p>
                      </div>
                      
                      <ul style={{
                        margin: '0 0 16px',
                        padding: 0,
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6
                      }}>
                        {pkg.extras.map((ex, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: pkg.color,
                              flexShrink: 0
                            }}/>
                            <span style={{ fontFamily: F, fontSize: 12, color: '#6B7280' }}>{ex}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* type="button" prevents form re-submit; calls handleSelectPackage which uses navigate() */}
                      <motion.button type="button" onClick={() => handleSelectPackage(pkg.tier)}
                                     whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                     style={{
                                       width: '100%',
                                       padding: '14px',
                                       background: pkg.color,
                                       color: '#fff',
                                       border: 'none',
                                       borderRadius: 999,
                                       fontFamily: F,
                                       fontSize: 14,
                                       fontWeight: 800,
                                       cursor: 'pointer',
                                       display: 'flex',
                                       alignItems: 'center',
                                       justifyContent: 'center',
                                       gap: 8,
                                       boxShadow: `0 4px 16px ${pkg.color}44`
                                     }}>
                        Generate with AI <ArrowRight size={15}/>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                <ShieldCheck size={15} style={{ color: '#16A34A' }}/>
                <p style={{ fontFamily: F, fontSize: 13, color: '#6B7280' }}>AI-powered · Day-by-day itinerary · Real
                  budgets</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}