import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { ArrowRight, Heart, MapPin, ShieldCheck, Zap } from 'lucide-react';
import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const FONT = '\'Plus Jakarta Sans\', system-ui, sans-serif';

// ─── Animation helpers
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
});
const fadeLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay } },
});
const fadeRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay } },
});
const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } },
});
const gridC = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const cardV = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function Reveal ({ children, delay = 0, style = {}, className = '', dir = 'up' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
  const variant = dir === 'left' ? fadeLeft(delay) : dir === 'right' ? fadeRight(delay) : dir === 'scale' ? scaleIn(delay) : fadeUp(delay);
  return (<motion.div ref={ref} variants={variant} initial="hidden"
                      animate={inView ? 'show' : 'hidden'} style={style} className={className}>
    {children}
  </motion.div>);
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [{ stat: '44K+', label: 'Trips planned' }, { stat: '50+', label: 'Destinations covered' }, {
  stat: '15s', label: 'To generate an itinerary'
}, { stat: '₹0', label: 'Hidden fees, ever' },];
const VALUES = [{
  icon: <Zap size={22}/>,
  color: '#E8650A',
  title: 'Speed First',
  desc: 'We believe planning shouldn\'t take longer than packing. Every itinerary is generated in under 15 seconds.'
}, {
  icon: <ShieldCheck size={22}/>,
  color: '#1A7F74',
  title: 'Transparency',
  desc: 'No hidden costs, no partner promotions. Every recommendation is honest and based on real traveller data.'
}, {
  icon: <Heart size={22}/>,
  color: '#E11D48',
  title: 'India Obsessed',
  desc: 'Built by Indians for Indians — we deeply understand the nuances of travelling this vast, beautiful country.'
}, {
  icon: <MapPin size={22}/>,
  color: '#1D4ED8',
  title: 'Hyper-Local',
  desc: 'We don\'t just list places — we surface insider tips, authentic eateries, and offbeat gems at every destination.'
},];
const TEAM = [{
  name: 'Arjun Sharma', role: 'Co-founder & CEO', from: 'Delhi', bg: 'linear-gradient(135deg,#E8650A,#F97316)'
}, {
  name: 'Priya Nair', role: 'Co-founder & Design Lead', from: 'Kochi', bg: 'linear-gradient(135deg,#1A7F74,#0D9488)'
}, {
  name: 'Rahul Mehta', role: 'Head of AI & Engineering', from: 'Pune', bg: 'linear-gradient(135deg,#1D4ED8,#3B82F6)'
}, {
  name: 'Sneha Iyer', role: 'Head of Content & Travel', from: 'Mumbai', bg: 'linear-gradient(135deg,#7C3AED,#A855F7)'
},];
const MILESTONES = [{
  year: '2023', event: 'TripWise founded in a Bengaluru apartment with 3 people and a Claude API key.'
}, {
  year: 'Early 2024', event: 'Launched beta with 10 destinations — 1,000 itineraries generated in week 1.'
}, {
  year: 'Mid 2024', event: 'Expanded to 50+ destinations. Introduced budget tiers and hotel recommendations.'
}, { year: '2025', event: 'Crossed 44,000 trips planned. Introduced AI food trails and group planning features.' },];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AboutPage () {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const fadeOut = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (<div className="min-h-screen bg-white" style={{ fontFamily: FONT, color: '#111111', overflowX: 'hidden' }}>
    <Navbar transparent={true}/>

    {/* PARALLAX HERO — Spiti Valley / Himalayan aerial */}
    <section ref={heroRef} style={{
      position: 'relative',
      height: '100vh',
      minHeight: 600,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>

      <motion.div style={{
        y: bgY,
        position: 'absolute',
        inset: '-20% 0',
        zIndex: 0,
        backgroundImage: 'url(\'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=90\')',
        backgroundSize: 'cover',
        backgroundPosition: 'center 45%'
      }}/>

      {/* Deep teal-green overlay for "journey/nature" brand feel */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: 'linear-gradient(to bottom, rgba(4,12,10,0.48) 0%, rgba(4,12,10,0.24) 38%, rgba(4,12,10,0.62) 76%, rgba(4,12,10,0.92) 100%)'
      }}/>
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: 'radial-gradient(ellipse at 38% 42%, rgba(26,127,116,0.25) 0%, transparent 60%)'
      }}/>

      <motion.div style={{
        y: contentY,
        opacity: fadeOut,
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: 860,
        margin: '0 auto'
      }}>

        <motion.h1 variants={fadeUp(0.2)} initial="hidden" animate="show"
                   style={{
                     color: '#fff',
                     fontWeight: 900,
                     fontSize: 'clamp(2.8rem,6.5vw,5rem)',
                     lineHeight: 1.02,
                     marginBottom: 20,
                     marginTop: 44,
                     fontFamily: FONT,
                     textShadow: '0 2px 40px rgba(0,0,0,0.4)'
                   }}>
          We got lost in planning.<br/>So we built a way out.
        </motion.h1>
        <motion.p variants={fadeUp(0.34)} initial="hidden" animate="show"
                  style={{
                    color: 'rgba(255,255,255,0.7)', fontSize: 17, maxWidth: 580, margin: '0 auto 52px', lineHeight: 1.78
                  }}>
          TripWise was born from frustration — 14 open tabs, three conflicting blogs, and a trip that never happened.
          We knew India deserved better.
        </motion.p>

        {/* Stats strip in hero */}
        <motion.div variants={fadeUp(0.5)} initial="hidden" animate="show"
                    style={{
                      display: 'inline-flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 20,
                      overflow: 'hidden'
                    }}>
          {STATS.map((s, i) => (<div key={i} style={{
            padding: '22px 32px',
            textAlign: 'center',
            borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
          }}>
            <p style={{
              fontFamily: FONT, fontWeight: 900, fontSize: '1.9rem', color: '#fff', marginBottom: 4, lineHeight: 1
            }}>{s.stat}</p>
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap'
            }}>{s.label}</p>
          </div>))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
                  style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
        <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      width: 26,
                      height: 42,
                      border: '2px solid rgba(255,255,255,0.28)',
                      borderRadius: 13,
                      display: 'flex',
                      justifyContent: 'center',
                      paddingTop: 6
                    }}>
          <motion.div animate={{ opacity: [1, 0, 1], scaleY: [1, 0.4, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      style={{ width: 3, height: 10, background: 'rgba(255,255,255,0.55)', borderRadius: 99 }}/>
        </motion.div>
      </motion.div>
    </section>

    {/* ── MISSION ── */}
    <section style={{ padding: '96px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
        <Reveal><p style={{
          color: '#9CA3AF',
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          marginBottom: 20
        }}>Our Mission</p></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 'clamp(1.9rem,4.5vw,3rem)',
            color: '#111111',
            lineHeight: 1.2,
            marginBottom: 24
          }}>
            Make every Indian capable of experiencing the full magic of their own country.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{ color: '#6B7280', fontSize: 16, lineHeight: 1.85 }}>
            India has 28 states, 8 union territories, over 5,000 years of history, 22 official languages, and infinite
            flavours. Most people see 2% of it. We want to change that — one perfectly planned trip at a time.
          </p>
        </Reveal>
      </div>
    </section>

    {/* ── VALUES ── */}
    <section style={{ padding: '80px 24px', background: '#F9FAFB' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{
            color: '#9CA3AF',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            marginBottom: 12
          }}>What We Stand For</p>
          <h2 style={{
            fontFamily: FONT, fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: '#111111'
          }}>Our Values</h2>
        </Reveal>
        <motion.div variants={gridC} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
          {VALUES.map((v, i) => (<motion.div key={i} variants={cardV}
                                             whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}
                                             style={{
                                               background: '#fff',
                                               borderRadius: 20,
                                               padding: '28px 26px',
                                               boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                                               transition: 'box-shadow 0.3s'
                                             }}>
            <motion.div whileHover={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 0.4 }}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 20,
                          background: `${v.color}18`,
                          color: v.color
                        }}>
              {v.icon}
            </motion.div>
            <h3 style={{
              fontFamily: FONT, fontWeight: 800, fontSize: '1.05rem', color: '#111111', marginBottom: 10
            }}>{v.title}</h3>
            <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.72 }}>{v.desc}</p>
          </motion.div>))}
        </motion.div>
      </div>
    </section>

    {/* ── PARALLAX JOURNEY IMAGE BREAK ── */}
    <ParallaxImageBreak
      image="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85"
      quote="Every great trip starts with a single tap."
      tint="rgba(26,127,116,0.28)"
    />

    {/* ── TIMELINE ── */}
    <section style={{ padding: '96px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            color: '#9CA3AF',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            marginBottom: 12
          }}>How We Got Here</p>
          <h2 style={{
            fontFamily: FONT, fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: '#111111'
          }}>The TripWise Journey</h2>
        </Reveal>
        <div style={{ position: 'relative' }}>
          {/* Vertical track */}
          <div style={{
            position: 'absolute',
            left: 19,
            top: 8,
            bottom: 0,
            width: 2,
            background: 'linear-gradient(to bottom, #E8650A 0%, #E5E7EB 100%)'
          }}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
            {MILESTONES.map((m, i) => (<Reveal key={i} delay={i * 0.1} dir="left">
              <div style={{ display: 'flex', gap: 24 }}>
                <motion.div whileInView={{ scale: [0.5, 1.15, 1] }} viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            style={{
                              flexShrink: 0,
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: i === MILESTONES.length - 1 ? '#E8650A' : '#111111',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 1,
                              boxShadow: i === MILESTONES.length - 1 ? '0 0 0 6px rgba(232,101,10,0.15)' : '0 0 0 4px rgba(17,17,17,0.1)',
                            }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }}/>
                </motion.div>
                <div style={{ paddingTop: 8 }}>
                  <p style={{
                    color: '#E8650A',
                    fontSize: 12,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginBottom: 6
                  }}>{m.year}</p>
                  <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.72 }}>{m.event}</p>
                </div>
              </div>
            </Reveal>))}
          </div>
        </div>
      </div>
    </section>

    {/* ── TEAM ── */}
    <section style={{ padding: '80px 24px', background: '#F9FAFB' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{
            color: '#9CA3AF',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            marginBottom: 12
          }}>The People</p>
          <h2 style={{
            fontFamily: FONT, fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: '#111111'
          }}>Built by Travellers, for Travellers</h2>
        </Reveal>
        <motion.div variants={gridC} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 20 }}>
          {TEAM.map((p, i) => (<motion.div key={i} variants={cardV}
                                           whileHover={{ y: -7, boxShadow: '0 20px 48px rgba(0,0,0,0.11)' }}
                                           style={{
                                             background: '#fff',
                                             borderRadius: 20,
                                             padding: '28px 22px',
                                             textAlign: 'center',
                                             boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                                             transition: 'box-shadow 0.3s'
                                           }}>
            <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.3 }}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: '50%',
                          background: p.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px',
                          fontSize: 26,
                          fontWeight: 900,
                          color: '#fff',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                        }}>
              {p.name.charAt(0)}
            </motion.div>
            <h3 style={{
              fontFamily: FONT, fontWeight: 800, fontSize: '1rem', color: '#111111', marginBottom: 4
            }}>{p.name}</h3>
            <p style={{ color: '#E8650A', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{p.role}</p>
            <p style={{
              color: '#9CA3AF', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
            }}>
              <MapPin size={11}/>{p.from}
            </p>
          </motion.div>))}
        </motion.div>
      </div>
    </section>

    {/* ── PRESS ── */}
    <section
      style={{ padding: '64px 24px', background: '#fff', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
      <Reveal><p style={{
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        marginBottom: 32
      }}>As Featured In</p></Reveal>
      <Reveal delay={0.1}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', opacity: 0.3 }}>
          {['Economic Times', 'YourStory', 'Inc42', 'TechCrunch India', 'Outlook Traveller'].map((pub, i) => (
            <p key={i} style={{
              fontFamily: FONT, fontWeight: 800, fontSize: 15, color: '#111111', letterSpacing: '-0.02em'
            }}>{pub}</p>))}
        </div>
      </Reveal>
    </section>

    {/* ── CTA ── */}
    <CtaBanner
      image="https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=1920&q=80"
      eyebrow="Join Us"
      heading={<>Your next trip is<br/>waiting to be planned.</>}
      sub="Free, fast, and built entirely around you. No sign-up needed to get started."
      cta="Plan My First Trip"
    />

    <Footer/>
  </div>);
}

// ─── Parallax image break (quote divider) ─────────────────────────────────────
function ParallaxImageBreak ({ image, quote, tint = 'rgba(26,127,116,0.25)' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  return (<section ref={ref} style={{
    position: 'relative',
    height: 340,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <motion.div style={{
      y,
      position: 'absolute',
      inset: '-20% 0',
      zIndex: 0,
      backgroundImage: `url('${image}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}/>
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(4,12,10,0.72)' }}/>
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 1,
      background: `radial-gradient(ellipse at 50% 50%,${tint} 0%,transparent 70%)`
    }}/>
    <Reveal dir="scale" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 32px' }}>
      <p style={{
        color: 'rgba(255,255,255,0.9)',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 'clamp(1.4rem,3vw,2rem)',
        fontStyle: 'italic',
        letterSpacing: '-0.01em'
      }}>
        "{quote}"
      </p>
      <div style={{ width: 48, height: 2, background: '#E8650A', margin: '20px auto 0', borderRadius: 99 }}/>
    </Reveal>
  </section>);
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CtaBanner ({ image, eyebrow, heading, sub, cta }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const F = '\'Plus Jakarta Sans\',system-ui,sans-serif';
  return (
    <section ref={ref} style={{ position: 'relative', padding: '100px 24px', textAlign: 'center', overflow: 'hidden' }}>
      <motion.div style={{
        y,
        position: 'absolute',
        inset: '-20% 0',
        zIndex: 0,
        backgroundImage: `url('${image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}/>
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: 'linear-gradient(135deg,rgba(4,12,10,0.84) 0%,rgba(4,12,10,0.70) 100%)'
      }}/>
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: 'radial-gradient(ellipse at 50% 60%,rgba(26,127,116,0.28) 0%,transparent 65%)'
      }}/>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Reveal><p style={{
          color: '#5EEAD4',
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginBottom: 16
        }}>{eyebrow}</p></Reveal>
        <Reveal delay={0.1}><h2 style={{
          color: '#fff', fontWeight: 900, fontSize: 'clamp(1.9rem,4vw,3.2rem)', marginBottom: 18, fontFamily: F
        }}>{heading}</h2></Reveal>
        <Reveal delay={0.2}><p style={{
          color: 'rgba(255,255,255,0.65)', fontSize: 15, marginBottom: 40, maxWidth: 440, margin: '0 auto 40px'
        }}>{sub}</p></Reveal>
        <Reveal delay={0.3}>
          <Link to="/planner">
            <motion.button whileHover={{ scale: 1.06, boxShadow: '0 8px 36px rgba(232,101,10,0.5)' }}
                           whileTap={{ scale: 0.95 }}
                           style={{
                             background: '#E8650A',
                             color: '#fff',
                             borderRadius: 999,
                             padding: '16px 44px',
                             fontSize: 15,
                             fontWeight: 700,
                             fontFamily: F,
                             border: 'none',
                             cursor: 'pointer',
                             display: 'inline-flex',
                             alignItems: 'center',
                             gap: 10,
                             boxShadow: '0 4px 20px rgba(232,101,10,0.35)'
                           }}>
              {cta} <ArrowRight size={18}/>
            </motion.button>
          </Link>
        </Reveal>
      </div>
    </section>);
}