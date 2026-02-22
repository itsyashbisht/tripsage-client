import { Navbar } from '../components/Navbar';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlannerForm, setPlannerForm } from '../store';
import { ArrowRight, Calendar, ChevronRight, MapPin, Minus, Plus, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';

const F = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const FM = '\'DM Mono\', monospace';
const SAFFRON = '#E8650A';
const SAFFRON_BG = '#FDF0E6';

const fadeUp = (d = 0) => ({
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d } }
});
const pkgVariant = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};
const gridC = { hidden: {}, show: { transition: { staggerChildren: 0.11 } } };

const CITIES = ['New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Bhopal', 'Surat'];
const DESTINATIONS = ['Jaipur, Rajasthan', 'Goa', 'Kerala Backwaters', 'Ladakh', 'Udaipur, Rajasthan', 'Manali, Himachal Pradesh', 'Rishikesh, Uttarakhand', 'Hampi, Karnataka', 'Varanasi, Uttar Pradesh', 'Andaman Islands', 'Coorg, Karnataka', 'Ranthambore, Rajasthan', 'Spiti Valley', 'Darjeeling', 'Mysuru, Karnataka'];
const INTERESTS = ['Heritage', 'Beaches', 'Adventure', 'Food', 'Wildlife', 'Spiritual', 'Nature', 'Nightlife', 'Shopping', 'Wellness'];
const PACKAGE_IMAGES = {
  Economy: 'https://images.unsplash.com/photo-1590050811270-c33c6df97517?auto=format&fit=crop&w=800&q=80',
  Standard: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
  Luxury: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
};

const buildPackages = (days, adults, children, dailyBudget) => {
  const pax = adults + children * 0.5;
  const base = dailyBudget * days * pax;
  return [
    {
      tier: 'Economy',
      icon: '🪙',
      color: '#16A34A',
      lightBg: '#DCFCE7',
      headline: 'Travel smart, spend less.',
      desc: 'Hostels, local trains, dhabas — experience India like a local.',
      perPerson: Math.round(base * 0.55 / adults),
      total: Math.round(base * 0.55),
      stay: 'Budget guesthouses & hostels',
      transport: 'Trains, buses & shared cabs',
      food: 'Dhabas, chai stalls & street food',
      extras: ['Local guided walks', 'Street food trail', 'Budget temple visits']
    },
    {
      tier: 'Standard',
      icon: '⭐',
      color: SAFFRON,
      lightBg: SAFFRON_BG,
      headline: 'Comfort meets authenticity.',
      desc: 'Handpicked 3–4★ stays, private transport, and the city\'s best mid-range dining.',
      perPerson: Math.round(base / adults),
      total: Math.round(base),
      stay: '3–4 star hotels & boutique havelis',
      transport: 'Private cab + select trains',
      food: 'Curated restaurants & local gems',
      extras: ['Guided heritage tours', 'Curated dining picks', 'Comfortable AC transport'],
      popular: true
    },
    {
      tier: 'Luxury',
      icon: '💎',
      color: '#9333EA',
      lightBg: '#F5F3FF',
      headline: 'Nothing but the finest.',
      desc: 'Palace hotels, chauffeur-driven SUVs, private guides, and exclusive culinary experiences.',
      perPerson: Math.round(base * 2.3 / adults),
      total: Math.round(base * 2.3),
      stay: 'Heritage palaces & 5-star resorts',
      transport: 'Chauffeur-driven luxury SUV',
      food: 'Fine dining & private chef',
      extras: ['Private heritage access', 'Spa & wellness daily', 'Exclusive local experiences']
    },
  ];
};

function FieldLabel ({ children }) {
  return <p style={{
    fontFamily: F,
    fontSize: 11,
    fontWeight: 800,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: 8
  }}>{children}</p>;
}

function InputShell ({ error, children }) {
  return (
    <div style={{
      background: '#F9FAFB', border: `1.5px solid ${error ? '#FCA5A5' : '#E5E7EB'}`, borderRadius: 14,
      overflow: 'hidden', transition: 'border-color 0.18s', display: 'flex', alignItems: 'center'
    }}>
      {children}
    </div>
  );
}

export default function PlannerPage () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const savedForm = useSelector(selectPlannerForm);

  const heroRef = useRef(null);
  const packagesRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const fadeOut = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Local state — initialised from Redux store (so form persists on back)
  const [origin, setOriginState] = useState(savedForm.origin || '');
  const [destination, setDestState] = useState(savedForm.destination || '');
  const [startDate, setStartDate] = useState(savedForm.startDate || '');
  const [endDate, setEndDate] = useState(savedForm.endDate || '');
  const [adults, setAdults] = useState(savedForm.adults || 2);
  const [children, setChildrenCount] = useState(savedForm.children || 0);
  const [dailyBudget, setDailyBudget] = useState(savedForm.dailyBudget || 3000);
  const [interests, setInterests] = useState(savedForm.interests || []);
  const [errors, setErrors] = useState({});
  const [packages, setPackages] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const days = (startDate && endDate)
    ? Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000))
    : savedForm.days || 3;

  // Sync local → Redux on each change
  const set = (field, value, localSetter) => {
    localSetter(value);
    dispatch(setPlannerForm({ [field]: value }));
  };

  const toggleInterest = (interest) => {
    const next = interests.includes(interest) ? interests.filter(i => i !== interest) : [...interests, interest];
    setInterests(next);
    dispatch(setPlannerForm({ interests: next }));
  };

  const validate = () => {
    const e = {};
    if (!origin.trim()) e.origin = 'Please select your departure city.';
    if (!destination.trim()) e.destination = 'Please select a destination.';
    if (!startDate) e.startDate = 'Please pick a start date.';
    if (!endDate) e.endDate = 'Please pick an end date.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setErrors({});
    dispatch(setPlannerForm({ days }));
    setPackages(buildPackages(days, adults, children, dailyBudget));
    setSubmitted(true);
    setTimeout(() => packagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const selectPackage = (tier) => {
    navigate('/loading', {
      state: { origin, destination, days, startDate, endDate, adults, children, tier, interests, dailyBudget },
    });
  };

  return (
    <div style={{ fontFamily: F, color: '#111', overflowX: 'hidden', background: '#fff', minHeight: '100vh' }}>
      <Navbar/>

      {/* Hero */}
      <section ref={heroRef} style={{
        position: 'relative',
        height: '56vh',
        minHeight: 380,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div style={{
          y: bgY, position: 'absolute', inset: '-20% 0', zIndex: 0,
          backgroundImage: 'url(\'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=90\')',
          backgroundSize: 'cover', backgroundPosition: 'center 42%'
        }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(8,4,2,0.46) 0%, rgba(8,4,2,0.26) 40%, rgba(8,4,2,0.70) 80%, rgba(8,4,2,0.94) 100%)'
        }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'radial-gradient(ellipse at 58% 42%, rgba(232,101,10,0.24) 0%, transparent 60%)'
        }}/>
        <motion.div style={{
          y: contentY,
          opacity: fadeOut,
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: 740
        }}>
          <motion.p variants={fadeUp(0.08)} initial="hidden" animate="show"
                    style={{
                      color: SAFFRON,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      marginBottom: 16
                    }}>
            ✦ &nbsp;AI-Powered Trip Planning
          </motion.p>
          <motion.h1 variants={fadeUp(0.18)} initial="hidden" animate="show"
                     style={{
                       color: '#fff',
                       fontWeight: 900,
                       fontSize: 'clamp(2rem,5vw,3.6rem)',
                       lineHeight: 1.05,
                       marginBottom: 20
                     }}>
            Plan your dream India trip — in under a minute.
          </motion.h1>
          <motion.p variants={fadeUp(0.3)} initial="hidden" animate="show"
                    style={{
                      color: 'rgba(255,255,255,0.72)',
                      fontSize: 'clamp(0.95rem,1.8vw,1.12rem)',
                      lineHeight: 1.75,
                      maxWidth: 540,
                      margin: '0 auto'
                    }}>
            Tell us where and when. Claude AI builds a personalised day-by-day itinerary with real hotels, restaurants,
            and budgets.
          </motion.p>
        </motion.div>
      </section>

      {/* Form */}
      <section
        style={{ maxWidth: 860, margin: '-60px auto 0', padding: '0 20px 100px', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      background: '#fff',
                      borderRadius: 32,
                      boxShadow: '0 32px 96px rgba(0,0,0,0.14)',
                      border: '1px solid #F3F4F6',
                      overflow: 'hidden'
                    }}>

          <div style={{ padding: '40px 44px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                background: SAFFRON_BG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin size={18} style={{ color: SAFFRON }}/>
              </div>
              <div>
                <h2 style={{
                  fontFamily: F,
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  color: '#111',
                  margin: 0,
                  marginBottom: 2
                }}>Where are you going?</h2>
                <p style={{ fontFamily: F, fontSize: 13, color: '#9CA3AF', margin: 0 }}>Fill in the details to get your
                  personalised plan</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Row 1: Origin + Destination */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <div>
                  <FieldLabel>Departing From</FieldLabel>
                  <InputShell error={errors.origin}>
                    <MapPin size={16} style={{ marginLeft: 14, color: '#9CA3AF', flexShrink: 0 }}/>
                    <select value={origin} onChange={e => set('origin', e.target.value, setOriginState)}
                            style={{
                              flex: 1,
                              padding: '14px 14px 14px 10px',
                              background: 'transparent',
                              border: 'none',
                              fontFamily: F,
                              fontSize: 14,
                              color: origin ? '#111' : '#9CA3AF',
                              outline: 'none',
                              cursor: 'pointer',
                              width: '100%'
                            }}>
                      <option value="">Select city</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </InputShell>
                  {errors.origin &&
                    <p style={{ fontFamily: F, fontSize: 11, color: '#EF4444', marginTop: 5 }}>{errors.origin}</p>}
                </div>
                <div>
                  <FieldLabel>Destination</FieldLabel>
                  <InputShell error={errors.destination}>
                    <ChevronRight size={16} style={{ marginLeft: 14, color: '#9CA3AF', flexShrink: 0 }}/>
                    <select value={destination} onChange={e => set('destination', e.target.value, setDestState)}
                            style={{
                              flex: 1,
                              padding: '14px 14px 14px 10px',
                              background: 'transparent',
                              border: 'none',
                              fontFamily: F,
                              fontSize: 14,
                              color: destination ? '#111' : '#9CA3AF',
                              outline: 'none',
                              cursor: 'pointer',
                              width: '100%'
                            }}>
                      <option value="">Select destination</option>
                      {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </InputShell>
                  {errors.destination &&
                    <p style={{ fontFamily: F, fontSize: 11, color: '#EF4444', marginTop: 5 }}>{errors.destination}</p>}
                </div>
              </div>

              {/* Row 2: Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <div>
                  <FieldLabel>Start Date</FieldLabel>
                  <InputShell error={errors.startDate}>
                    <Calendar size={16} style={{ marginLeft: 14, color: '#9CA3AF', flexShrink: 0 }}/>
                    <input type="date" value={startDate} onChange={e => set('startDate', e.target.value, setStartDate)}
                           min={new Date().toISOString().split('T')[0]}
                           style={{
                             flex: 1,
                             padding: '14px 14px 14px 10px',
                             background: 'transparent',
                             border: 'none',
                             fontFamily: F,
                             fontSize: 14,
                             color: '#111',
                             outline: 'none',
                             width: '100%'
                           }}/>
                  </InputShell>
                  {errors.startDate &&
                    <p style={{ fontFamily: F, fontSize: 11, color: '#EF4444', marginTop: 5 }}>{errors.startDate}</p>}
                </div>
                <div>
                  <FieldLabel>End Date</FieldLabel>
                  <InputShell error={errors.endDate}>
                    <Calendar size={16} style={{ marginLeft: 14, color: '#9CA3AF', flexShrink: 0 }}/>
                    <input type="date" value={endDate} onChange={e => set('endDate', e.target.value, setEndDate)}
                           min={startDate || new Date().toISOString().split('T')[0]}
                           style={{
                             flex: 1,
                             padding: '14px 14px 14px 10px',
                             background: 'transparent',
                             border: 'none',
                             fontFamily: F,
                             fontSize: 14,
                             color: '#111',
                             outline: 'none',
                             width: '100%'
                           }}/>
                  </InputShell>
                  {errors.endDate &&
                    <p style={{ fontFamily: F, fontSize: 11, color: '#EF4444', marginTop: 5 }}>{errors.endDate}</p>}
                </div>
              </div>

              {/* Row 3: Adults + Children + Budget */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
                {[
                  { label: 'Adults', value: adults, min: 1, setter: v => set('adults', v, setAdults) },
                  { label: 'Children', value: children, min: 0, setter: v => set('children', v, setChildrenCount) },
                ].map(({ label, value, min, setter }) => (
                  <div key={label}>
                    <FieldLabel>{label}</FieldLabel>
                    <div style={{
                      background: '#F9FAFB',
                      border: '1.5px solid #E5E7EB',
                      borderRadius: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 16px'
                    }}>
                      <button type="button" onClick={() => setter(Math.max(min, value - 1))}
                              disabled={value <= min}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                border: '1.5px solid #E5E7EB',
                                background: value <= min ? '#F9FAFB' : '#fff',
                                cursor: value <= min ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: value <= min ? '#D1D5DB' : '#111'
                              }}>
                        <Minus size={12}/>
                      </button>
                      <span style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: '#111' }}>{value}</span>
                      <button type="button" onClick={() => setter(value + 1)}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                border: '1.5px solid #E5E7EB',
                                background: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#111'
                              }}>
                        <Plus size={12}/>
                      </button>
                    </div>
                  </div>
                ))}
                <div>
                  <FieldLabel>Daily Budget (₹/person)</FieldLabel>
                  <InputShell>
                    <span style={{
                      paddingLeft: 14,
                      color: '#9CA3AF',
                      fontWeight: 700,
                      fontSize: 15,
                      fontFamily: FM
                    }}>₹</span>
                    <input type="number" value={dailyBudget} min={500} step={500}
                           onChange={e => set('dailyBudget', Number(e.target.value), setDailyBudget)}
                           style={{
                             flex: 1,
                             padding: '14px 14px 14px 8px',
                             background: 'transparent',
                             border: 'none',
                             fontFamily: FM,
                             fontSize: 14,
                             color: '#111',
                             outline: 'none',
                             width: '100%'
                           }}/>
                  </InputShell>
                </div>
              </div>

              {/* Interests */}
              <div style={{ marginBottom: 32 }}>
                <FieldLabel>Interests (optional)</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {INTERESTS.map(interest => {
                    const active = interests.includes(interest);
                    return (
                      <motion.button key={interest} type="button" onClick={() => toggleInterest(interest)}
                                     whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                     style={{
                                       padding: '9px 18px',
                                       borderRadius: 999,
                                       fontFamily: F,
                                       fontSize: 13,
                                       fontWeight: active ? 700 : 500,
                                       cursor: 'pointer',
                                       border: `1.5px solid ${active ? SAFFRON : '#E5E7EB'}`,
                                       background: active ? SAFFRON_BG : '#fff',
                                       color: active ? SAFFRON : '#6B7280',
                                       transition: 'all 0.18s'
                                     }}>
                        {interest}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                             style={{
                               width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                               background: SAFFRON, color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 999,
                               padding: '18px 32px', fontFamily: F, fontSize: 16, fontWeight: 800,
                               boxShadow: '0 6px 24px rgba(232,101,10,0.36)', transition: 'box-shadow 0.2s'
                             }}>
                See Package Options <ArrowRight size={18}/>
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Package cards */}
        <AnimatePresence>
          {submitted && packages.length > 0 && (
            <div ref={packagesRef} style={{ marginTop: 56 }}>
              <motion.div variants={fadeUp(0)} initial="hidden" animate="show"
                          style={{ textAlign: 'center', marginBottom: 36 }}>
                <p style={{
                  fontFamily: F,
                  fontWeight: 900,
                  fontSize: 'clamp(1.5rem,3vw,2.1rem)',
                  color: '#111',
                  marginBottom: 8
                }}>
                  Choose your experience
                </p>
                <p style={{ fontFamily: F, fontSize: 15, color: '#6B7280' }}>
                  {days} nights
                  · {adults} adult{adults > 1 ? 's' : ''}{children > 0 ? ` + ${children} child${children > 1 ? 'ren' : ''}` : ''} · {destination}
                </p>
              </motion.div>
              <motion.div variants={gridC} initial="hidden" animate="show"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
                            gap: 22
                          }}>
                {packages.map(pkg => (
                  <motion.div key={pkg.tier} variants={pkgVariant}
                              style={{
                                background: '#fff',
                                borderRadius: 28,
                                border: `2px solid ${pkg.popular ? pkg.color : '#F3F4F6'}`,
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: pkg.popular ? `0 12px 40px rgba(232,101,10,0.18)` : '0 4px 20px rgba(0,0,0,0.06)',
                                display: 'flex',
                                flexDirection: 'column'
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
                        fontFamily: F
                      }}>Most Popular</div>
                    )}
                    <div style={{ height: 140, overflow: 'hidden' }}>
                      <img src={PACKAGE_IMAGES[pkg.tier]} alt={pkg.tier}
                           style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                      <div style={{
                        position: 'relative',
                        marginTop: -140,
                        height: 140,
                        background: `linear-gradient(to bottom, transparent 30%, ${pkg.lightBg} 100%)`
                      }}/>
                    </div>
                    <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                        style={{ background: pkg.lightBg, borderRadius: 16, padding: '14px 16px', marginBottom: 18 }}>
                        <p style={{
                          fontFamily: F,
                          fontSize: 11,
                          fontWeight: 800,
                          color: '#9CA3AF',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          marginBottom: 8
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
                      <motion.button onClick={() => selectPackage(pkg.tier)} whileHover={{ scale: 1.03 }}
                                     whileTap={{ scale: 0.97 }}
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
                <p style={{ fontFamily: F, fontSize: 13, color: '#6B7280' }}>AI-powered by Claude · Day-by-day itinerary
                  · Real budgets</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}