import { ArrowRight, Calendar, ChevronDown, MapPin, Minus, Plus, Users } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const F = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const FM = '\'DM Mono\', monospace';
const SAF = '#E8650A';
const SAF_BG = '#FDF0E6';

const IMG = {
  hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=90',
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
  ladakh: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=600&q=80',
  udaipur: 'https://images.unsplash.com/photo-1695956353120-54ce5e91632b?q=80&w=735&auto=format&fit=crop',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
  rishikesh: 'https://images.unsplash.com/photo-1718383538820-524dd564fd06?q=80&w=687&auto=format&fit=crop',
  hampi: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?q=80&w=748&auto=format&fit=crop',
  statsBg: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=80',
  promo: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=90',
};

const POPULAR = [
  {
    id: 1,
    name: 'Goa Beach Escape',
    location: 'Goa, India',
    category: 'Beaches',
    image: IMG.goa,
    price: '₹3,000–₹7,000',
    date: 'Nov–Feb 2026',
    nights: 5
  },
  {
    id: 2,
    name: 'Ladakh High Altitude Trek',
    location: 'Ladakh, India',
    category: 'Adventure',
    image: IMG.ladakh,
    price: '₹5,000–₹12,000',
    date: 'Jun–Sep 2025',
    nights: 7
  },
  {
    id: 3,
    name: 'Jaipur Heritage Walk',
    location: 'Rajasthan, India',
    category: 'Heritage',
    image: IMG.jaipur,
    price: '₹2,500–₹8,000',
    date: 'Oct–Mar 2026',
    nights: 4
  },
  {
    id: 4,
    name: 'Kerala Backwater Cruise',
    location: 'Kerala, India',
    category: 'Nature',
    image: IMG.kerala,
    price: '₹3,500–₹10,000',
    date: 'Sep–Mar 2026',
    nights: 6
  },
];

const ALL_DEST = [
  { id: 1, name: 'Jaipur', location: 'Rajasthan', category: 'Heritage', image: IMG.jaipur, price: '₹2,500', nights: 4 },
  { id: 2, name: 'Goa', location: 'Goa', category: 'Beaches', image: IMG.goa, price: '₹3,000', nights: 5 },
  { id: 3, name: 'Kerala', location: 'Kerala', category: 'Nature', image: IMG.kerala, price: '₹3,500', nights: 6 },
  { id: 4, name: 'Ladakh', location: 'Ladakh', category: 'Adventure', image: IMG.ladakh, price: '₹5,000', nights: 7 },
  {
    id: 5,
    name: 'Udaipur',
    location: 'Rajasthan',
    category: 'Heritage',
    image: IMG.udaipur,
    price: '₹4,000',
    nights: 3
  },
  {
    id: 6,
    name: 'Manali',
    location: 'Himachal Pradesh',
    category: 'Nature',
    image: IMG.manali,
    price: '₹3,200',
    nights: 5
  },
  {
    id: 7,
    name: 'Rishikesh',
    location: 'Uttarakhand',
    category: 'Adventure',
    image: IMG.rishikesh,
    price: '₹2,800',
    nights: 4
  },
  { id: 8, name: 'Hampi', location: 'Karnataka', category: 'Heritage', image: IMG.hampi, price: '₹1,800', nights: 3 },
];

const MOMENTS = [IMG.goa, IMG.jaipur, IMG.kerala, IMG.ladakh, IMG.manali, IMG.rishikesh, IMG.udaipur, IMG.hampi];

const FAQS = [
  {
    q: 'Can I change or cancel my trip after booking?',
    a: 'Cancellations made 48+ hours before departure receive a 100% refund. Within 48 hours we issue travel credits valid 12 months.'
  },
  {
    q: 'Does TripWise offer group travel options?',
    a: 'Groups of 6+ get curated Heritage and Adventure packages at discounted rates. Contact our team for a custom quote.'
  },
  {
    q: 'How do I get travel support during my trip?',
    a: 'Every booking includes 24/7 WhatsApp support and an emergency contact number for your destination.'
  },
  {
    q: 'Can I save destinations to plan later?',
    a: 'Create a free account and bookmark any destination — we\'ll keep it safe until you\'re ready.'
  },
  {
    q: 'Does TripWise offer special deals or discounts?',
    a: 'Seasonal flash sales and early-bird offers are shared via email. Subscribe to never miss a deal.'
  },
];

const CAT_STYLE = {
  Heritage: { bg: '#FDF0E6', color: SAF },
  Beaches: { bg: '#E0F7F5', color: '#0D9488' },
  Nature: { bg: '#DCFCE7', color: '#16A34A' },
  Adventure: { bg: '#FEF3C7', color: '#D97706' },
};

// ─── Guest Selector ───────────────────────────────────────────────────────────
function GuestSelector () {
  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const ref = useRef(null);
  
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  
  const label = children > 0
    ? `${adults} Adult${adults !== 1 ? 's' : ''}, ${children} Child${children !== 1 ? 'ren' : ''}`
    : `${adults} Adult${adults !== 1 ? 's' : ''}`;
  
  const Counter = ({ value, onInc, onDec, min = 0 }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={onDec} disabled={value <= min}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #E5E7EB',
                background: value <= min ? '#F9FAFB' : '#fff', cursor: value <= min ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: value <= min ? '#D1D5DB' : '#111', flexShrink: 0
              }}>
        <Minus size={13}/>
      </button>
      <span style={{
        fontFamily: FM, fontWeight: 700, fontSize: 16, color: '#111',
        minWidth: 22, textAlign: 'center'
      }}>{value}</span>
      <button onClick={onInc}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #E5E7EB',
                background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#111', flexShrink: 0
              }}>
        <Plus size={13}/>
      </button>
    </div>
  );
  
  return (
    <div ref={ref} style={{ position: 'relative', flex: '1 1 160px', minWidth: 0 }}>
      <button onClick={() => setOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px',
                width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
                minWidth: 0, overflow: 'hidden'
              }}>
        <Users size={17} style={{ color: 'rgba(255,255,255,0.55)', flexShrink: 0 }}/>
        <span style={{
          color: 'rgba(255,255,255,0.85)', fontSize: 14, flex: 1, textAlign: 'left',
          fontFamily: F, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {label}
        </span>
        <ChevronDown size={14} style={{
          color: 'rgba(255,255,255,0.45)', flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'
        }}/>
      </button>
      
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 12px)', left: '50%',
          transform: 'translateX(-50%)', width: 270, background: '#fff', borderRadius: 20,
          boxShadow: '0 24px 64px rgba(0,0,0,0.22)', border: '1px solid #F3F4F6',
          padding: 24, zIndex: 400
        }}>
          <div style={{
            position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
            width: 14, height: 14, background: '#fff', border: '1px solid #F3F4F6',
            borderBottom: 'none', borderRight: 'none'
          }}/>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 2, fontFamily: F }}>Adults</p>
              <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: F }}>Age 13+</p>
            </div>
            <Counter value={adults} onInc={() => setAdults(v => v + 1)} onDec={() => setAdults(v => Math.max(1, v - 1))}
                     min={1}/>
          </div>
          <div style={{ height: 1, background: '#F3F4F6', marginBottom: 20 }}/>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 2, fontFamily: F }}>Children</p>
              <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: F }}>Age 2–12</p>
            </div>
            <Counter value={children} onInc={() => setChildren(v => v + 1)}
                     onDec={() => setChildren(v => Math.max(0, v - 1))}/>
          </div>
          <button onClick={() => setOpen(false)}
                  style={{
                    width: '100%', background: '#111', color: '#fff', borderRadius: 999,
                    padding: '12px 0', fontSize: 14, fontWeight: 700, fontFamily: F, border: 'none',
                    cursor: 'pointer', transition: 'background 0.18s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = SAF}
                  onMouseLeave={e => e.currentTarget.style.background = '#111'}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Reusable section heading ─────────────────────────────────────────────────
function SectionHead ({ eyebrow, title, sub, center = true }) {
  return (
    <div style={{
      textAlign: center ? 'center' : 'left',
      marginBottom: 'clamp(32px,4vw,52px)'
    }}>
      {eyebrow && (
        <p style={{
          fontSize: 11, fontWeight: 800, color: SAF, textTransform: 'uppercase',
          letterSpacing: '0.22em', marginBottom: 10
        }}>{eyebrow}</p>
      )}
      <h2 style={{
        fontWeight: 900, fontSize: 'clamp(1.8rem,3.8vw,2.7rem)',
        color: '#111', lineHeight: 1.12, marginBottom: sub ? 10 : 0, fontFamily: F
      }}>
        {title}
      </h2>
      {sub && <p style={{
        color: '#9CA3AF', fontSize: 15, maxWidth: 500,
        margin: center ? '0 auto' : '0', lineHeight: 1.75
      }}>{sub}</p>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HomePage () {
  const [filter, setFilter] = useState('All');
  const [activeFaq, setActiveFaq] = useState(null);
  const [query, setQuery] = useState('');
  
  const filtered = useMemo(() =>
    ALL_DEST.filter(d =>
      (filter === 'All' || d.category === filter) &&
      d.name.toLowerCase().includes(query.toLowerCase())
    ), [filter, query]);
  
  return (
    <div style={{
      fontFamily: F, color: '#111', background: '#fff',
      overflowX: 'hidden', minHeight: '100vh'
    }}>
      <Navbar transparent/>
      
      {/* ═══════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════ */}
      <section style={{
        position: 'relative', minHeight: '100svh',
        display: 'flex', alignItems: 'flex-end',
        paddingBottom: 'clamp(48px,7vw,96px)'
      }}>
        
        <img src={IMG.hero} alt="Hero" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', animation: 'heroZoom 22s ease-in-out infinite alternate',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 28%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.84) 100%)'
        }}/>
        
        <div style={{
          position: 'relative', zIndex: 10, width: '100%',
          maxWidth: 1060, margin: '0 auto',
          padding: '80px clamp(20px,5vw,48px) 0',
          textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          
          {/* Eyebrow pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(232,101,10,0.16)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(232,101,10,0.36)', borderRadius: 999,
            padding: '7px 18px', marginBottom: 22
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: SAF, display: 'inline-block' }}/>
            <span style={{
              color: 'rgba(255,255,255,0.92)', fontSize: 11, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.18em'
            }}>AI-Powered Trip Planning</span>
          </div>
          
          <h1 style={{
            fontWeight: 900, color: '#fff', lineHeight: 0.92,
            fontSize: 'clamp(2.8rem,9vw,7rem)', textShadow: '0 2px 40px rgba(0,0,0,0.35)',
            marginBottom: 'clamp(14px,2vw,20px)', fontFamily: F
          }}>
            Find your next<br/>unforgettable trip
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(0.9rem,1.8vw,1.08rem)',
            maxWidth: 480, marginBottom: 'clamp(28px,4vw,40px)', lineHeight: 1.8
          }}>
            Discover hidden gems, ancient forts, pristine beaches — all across India, planned by AI in seconds.
          </p>
          
          {/* ── Search bar ── */}
          <div style={{
            width: '100%', maxWidth: 960,
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: 'clamp(20px,3vw,999px)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.28)',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: 'clamp(6px,1vw,8px)',
            gap: 0,
          }}>
            {/* Where */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 20px', flex: '1 1 150px', minWidth: 0
            }}>
              <MapPin size={17} style={{ color: 'rgba(255,255,255,0.55)', flexShrink: 0 }}/>
              <input type="text" placeholder="Where to next?" value={query}
                     onChange={e => setQuery(e.target.value)}
                     style={{
                       background: 'transparent', border: 'none', outline: 'none', color: '#fff',
                       fontSize: 14, width: '100%', fontFamily: F, caretColor: SAF,
                       minWidth: 0
                     }}/>
            </div>
            
            {/* Divider — hidden on wrap */}
            <div className="tw-divider" style={{
              width: 1, height: 28,
              background: 'rgba(255,255,255,0.18)', flexShrink: 0, alignSelf: 'center'
            }}/>
            
            {/* Date */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 20px', flex: '1 1 145px', minWidth: 0
            }}>
              <Calendar size={17} style={{ color: 'rgba(255,255,255,0.55)', flexShrink: 0 }}/>
              <input type="date" style={{
                background: 'transparent', border: 'none',
                outline: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 14,
                colorScheme: 'dark', fontFamily: F, width: '100%', minWidth: 0
              }}/>
            </div>
            
            <div className="tw-divider" style={{
              width: 1, height: 28,
              background: 'rgba(255,255,255,0.18)', flexShrink: 0, alignSelf: 'center'
            }}/>
            
            {/* Guests */}
            <GuestSelector/>
            
            {/* CTA */}
            <Link to="/planner" style={{
              flexShrink: 0, width: 'auto',
              padding: 'clamp(4px,1vw,6px)', display: 'block'
            }}>
              <button style={{
                background: SAF, color: '#fff', borderRadius: 999,
                padding: '13px clamp(20px,3vw,32px)',
                fontSize: 14, fontWeight: 800, fontFamily: F, border: 'none',
                cursor: 'pointer', boxShadow: `0 4px 20px rgba(232,101,10,0.52)`,
                whiteSpace: 'nowrap', width: '100%', transition: 'filter 0.18s',
              }}
                      onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                      onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}>
                Find my trip
              </button>
            </Link>
          </div>
          
          {/* Trust pills */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'clamp(12px,3vw,28px)',
            marginTop: 18, flexWrap: 'wrap', justifyContent: 'center'
          }}>
            {['Free to plan', 'No sign-up needed', 'Ready in 15 sec'].map((t, i) => (
              <span key={i} style={{
                color: 'rgba(255,255,255,0.42)', fontSize: 12,
                display: 'flex', alignItems: 'center', gap: 6
              }}>
                <span style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)', display: 'inline-block'
                }}/>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════
          2. POPULAR TRIPS
      ═══════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: 'clamp(56px,8vw,96px) clamp(20px,4vw,48px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHead
            eyebrow="Trending Now"
            title="Our Popular Trips"
            sub="Discover where travellers are heading this season, from popular escapes to offbeat adventures"
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
            gap: 'clamp(20px,3vw,28px)'
          }}>
            {POPULAR.map(dest => {
              const cs = CAT_STYLE[dest.category] || { bg: '#F3F4F6', color: '#374151' };
              return (
                <div key={dest.id} style={{ cursor: 'pointer' }}>
                  <div style={{
                    position: 'relative', borderRadius: 24, aspectRatio: '3/4',
                    overflow: 'hidden', marginBottom: 16
                  }}>
                    <img src={dest.image} alt={dest.name} loading="lazy"
                         style={{
                           width: '100%', height: '100%', objectFit: 'cover',
                           transition: 'transform 0.7s ease', display: 'block'
                         }}
                         onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                         onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}/>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)'
                    }}/>
                    <div style={{
                      position: 'absolute', top: 14, left: 14,
                      background: cs.bg, borderRadius: 999,
                      padding: '5px 13px', fontSize: 10, fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '0.08em', color: cs.color
                    }}>
                      {dest.category}
                    </div>
                  </div>
                  <p style={{
                    color: '#9CA3AF', fontSize: 11, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4
                  }}>
                    {dest.location}
                  </p>
                  <h3 style={{
                    fontWeight: 800, fontSize: '1.05rem', color: '#111',
                    marginBottom: 8, fontFamily: F
                  }}>{dest.name}</h3>
                  <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
                    <span style={{ color: '#9CA3AF', fontSize: 12 }}>📅 {dest.date}</span>
                    <span style={{ color: '#9CA3AF', fontSize: 12 }}>🌙 {dest.nights} nights</span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', flexWrap: 'wrap', gap: 10
                  }}>
                    <div>
                      <span style={{ fontFamily: FM, fontWeight: 800, fontSize: 17, color: '#111' }}>
                        {dest.price}
                      </span>
                      <span style={{ color: '#9CA3AF', fontSize: 11, marginLeft: 4 }}>/ person</span>
                    </div>
                    <Link to="/planner" style={{ textDecoration: 'none' }}>
                      <button style={{
                        background: '#111', color: '#fff', borderRadius: 999,
                        padding: '9px 20px', fontSize: 12, fontWeight: 700, fontFamily: F,
                        border: 'none', cursor: 'pointer', transition: 'background 0.18s'
                      }}
                              onMouseEnter={e => e.currentTarget.style.background = SAF}
                              onMouseLeave={e => e.currentTarget.style.background = '#111'}>
                        Book Now
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Pagination dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 44 }}>
            <div style={{ width: 28, height: 8, borderRadius: 999, background: '#111' }}/>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: '#E5E7EB' }}/>
          </div>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════
          3. VALUE PROP
      ═══════════════════════════════════════════ */}
      <section style={{
        background: '#fff', borderTop: '1px solid #F3F4F6',
        padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,48px)'
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            color: '#9CA3AF', fontSize: 11, textTransform: 'uppercase',
            letterSpacing: '0.18em', fontWeight: 800, marginBottom: 18
          }}>
            Travel made simple, stories made unforgettable
          </p>
          <h2 style={{
            fontWeight: 900, fontSize: 'clamp(1.9rem,4.5vw,3.2rem)',
            color: '#111', lineHeight: 1.14, marginBottom: 40, fontFamily: F
          }}>
            We make planning effortless so you can focus on what really matters
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex' }}>
              {[
                { bg: 'linear-gradient(135deg,#E8650A,#F97316)', l: 'P' },
                { bg: 'linear-gradient(135deg,#1A7F74,#0D9488)', l: 'R' },
                { bg: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', l: 'A' },
                { bg: 'linear-gradient(135deg,#7C3AED,#A855F7)', l: 'M' },
              ].map((a, i) => (
                <div key={i} style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: '2.5px solid #fff', marginLeft: i > 0 ? -12 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 14, fontWeight: 900, background: a.bg,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.16)'
                }}>
                  {a.l}
                </div>
              ))}
            </div>
            <p style={{ color: '#6B7280', fontSize: 14 }}>
              Trusted by <strong style={{ color: '#111' }}>44,000+</strong> travellers across India
            </p>
          </div>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════
          4. STATS — Ticket blocks
      ═══════════════════════════════════════════ */}
      <section style={{
        position: 'relative', padding: 'clamp(64px,8vw,100px) clamp(20px,4vw,48px)',
        overflow: 'hidden'
      }}>
        <img src={IMG.statsBg} alt="" style={{
          position: 'absolute', inset: 0, width: '100%',
          height: '100%', objectFit: 'cover', filter: 'brightness(0.38) saturate(0.65)'
        }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)' }}/>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1000, margin: '0 auto' }}>
          <p style={{
            textAlign: 'center', color: 'rgba(255,255,255,0.46)', fontSize: 11,
            textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 800, marginBottom: 48
          }}>
            Trusted by thousands of travellers just like you
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,240px), 1fr))', gap: 20
          }}>
            {[
              { stat: '44K+', label: 'Happy explorers\nplanned with us' },
              { stat: '50+', label: 'Destinations across\nincredible India' },
              { stat: '30%', label: 'Users who return for\ntheir next adventure' },
            ].map((item, i) => (
              <div key={i} style={{
                position: 'relative', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: 'clamp(32px,4vw,44px) 24px', textAlign: 'center',
                background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.13)',
                borderRadius: 24, boxShadow: '0 4px 32px rgba(0,0,0,0.3)', overflow: 'visible'
              }}>
                {/* Ticket punch circles */}
                <div style={{
                  position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)',
                  width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}/>
                <div style={{
                  position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)',
                  width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}/>
                <div style={{
                  position: 'absolute', top: '40%', left: 32, right: 32,
                  borderTop: '1px dashed rgba(255,255,255,0.1)'
                }}/>
                <p style={{
                  fontWeight: 900, fontSize: 'clamp(2.8rem,6vw,4rem)', color: '#fff',
                  lineHeight: 1, marginBottom: 12, fontFamily: F, position: 'relative', zIndex: 1
                }}>
                  {item.stat}
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.58)', fontSize: 13, fontWeight: 500,
                  lineHeight: 1.65, whiteSpace: 'pre-line', position: 'relative', zIndex: 1
                }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════
          5. DISCOVER INDIA
      ═══════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: 'clamp(56px,8vw,96px) 0' }}>
        <div style={{
          maxWidth: 1440, margin: '0 auto',
          padding: '0 clamp(20px,4vw,40px)'
        }}>
          
          {/* Header row */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end',
            justifyContent: 'space-between', gap: 20, marginBottom: 40
          }}>
            <div>
              <h2 style={{
                fontWeight: 900, fontSize: 'clamp(1.9rem,4vw,3rem)',
                color: '#111', marginBottom: 4, fontFamily: F
              }}>Discover India</h2>
              <p style={{ color: '#9CA3AF', fontSize: 15 }}>Every traveller finds their perfect India here</p>
            </div>
            
            {/* Filter pills — scrollable on mobile */}
            <div style={{
              display: 'flex', alignItems: 'center', background: '#F9FAFB',
              border: '1px solid #F3F4F6', borderRadius: 999, padding: '5px 6px', gap: 2,
              overflowX: 'auto', WebkitOverflowScrolling: 'touch', flexShrink: 0,
              maxWidth: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none'
            }}>
              {['All', 'Heritage', 'Beaches', 'Nature', 'Adventure'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                        style={{
                          padding: '8px clamp(12px,2vw,22px)', borderRadius: 999,
                          background: filter === f ? '#111' : 'transparent',
                          color: filter === f ? '#fff' : '#6B7280',
                          fontSize: 13, fontWeight: 700, fontFamily: F, border: 'none',
                          cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          {/* Horizontally scrolling card strip */}
          <div style={{
            display: 'flex', gap: 18, overflowX: 'auto',
            paddingBottom: 20, scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {filtered.map(dest => {
              const cs = CAT_STYLE[dest.category] || { bg: '#F3F4F6', color: '#374151' };
              return (
                <div key={dest.id} style={{
                  flexShrink: 0, scrollSnapAlign: 'start',
                  width: 'clamp(185px,22vw,255px)', cursor: 'pointer'
                }}>
                  <div style={{
                    position: 'relative', borderRadius: 28, aspectRatio: '3/4',
                    overflow: 'hidden', marginBottom: 14
                  }}>
                    <img src={dest.image} alt={dest.name} loading="lazy"
                         style={{
                           width: '100%', height: '100%', objectFit: 'cover',
                           transition: 'transform 0.65s ease', display: 'block'
                         }}
                         onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.09)'}
                         onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}/>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 55%)'
                    }}/>
                    <div style={{
                      position: 'absolute', top: 14, left: 14, background: cs.bg,
                      borderRadius: 999, padding: '5px 13px', fontSize: 10, fontWeight: 900,
                      textTransform: 'uppercase', letterSpacing: '0.08em', color: cs.color
                    }}>
                      {dest.category}
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 14, right: 14, width: 38, height: 38,
                      borderRadius: '50%', background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(8px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                      transition: 'background 0.2s', cursor: 'pointer'
                    }}
                         onMouseEnter={e => e.currentTarget.style.background = SAF}
                         onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.48)'}>
                      <ArrowRight size={15}/>
                    </div>
                  </div>
                  <p style={{
                    color: '#9CA3AF', fontSize: 10, fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 3
                  }}>
                    {dest.location}
                  </p>
                  <h3 style={{
                    fontWeight: 800, fontSize: '1rem', color: '#111',
                    marginBottom: 6, fontFamily: F
                  }}>{dest.name}</h3>
                  <span style={{ fontFamily: FM, fontWeight: 900, fontSize: 17, color: '#111' }}>
                    {dest.price}
                    <span style={{
                      fontFamily: F, fontWeight: 400, fontSize: 11,
                      color: '#9CA3AF', marginLeft: 4
                    }}>/ person</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════
          6. MOMENTS — auto-scroll strip
      ═══════════════════════════════════════════ */}
      <section style={{
        background: '#F9FAFB',
        padding: 'clamp(56px,8vw,96px) 0', overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 clamp(20px,4vw,40px)', textAlign: 'center', marginBottom: 48
        }}>
          <p style={{
            color: '#9CA3AF', fontSize: 11, textTransform: 'uppercase',
            letterSpacing: '0.18em', fontWeight: 800, marginBottom: 12
          }}>
            Real stories from our travellers
          </p>
          <h2 style={{
            fontWeight: 900, fontSize: 'clamp(1.7rem,4vw,2.8rem)',
            color: '#111', fontFamily: F
          }}>
            Moments that made every journey{' '}
            <em style={{ fontStyle: 'italic', color: SAF }}>unforgettable</em>
          </h2>
        </div>
        
        <div style={{
          display: 'flex', gap: 16, animation: 'autoScroll 28s linear infinite',
          width: 'max-content', paddingLeft: 'clamp(16px,3vw,24px)'
        }}>
          {[...MOMENTS, ...MOMENTS].map((img, i) => (
            <div key={i} style={{
              flexShrink: 0,
              width: 'clamp(140px,17vw,210px)', height: 'clamp(180px,22vw,270px)',
              borderRadius: 22, overflow: 'hidden'
            }}>
              <img src={img} alt="Moment" loading="lazy"
                   style={{
                     width: '100%', height: '100%', objectFit: 'cover',
                     display: 'block', transition: 'transform 0.5s'
                   }}
                   onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                   onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}/>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <button style={{
            padding: '12px 32px', border: '1.5px solid #E5E7EB', borderRadius: 999,
            color: '#374151', fontSize: 14, fontWeight: 600, fontFamily: F, background: 'transparent',
            cursor: 'pointer', transition: 'all 0.18s'
          }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#111';
                    e.currentTarget.style.color = '#111';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.color = '#374151';
                  }}>
            See more together
          </button>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════
          7. FAQ
      ═══════════════════════════════════════════ */}
      <section style={{
        background: '#fff',
        padding: 'clamp(56px,8vw,96px) clamp(20px,4vw,48px)'
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <SectionHead
            eyebrow="Support"
            title="Frequently Asked Questions"
            sub="Got questions before booking? We have you covered."
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                borderRadius: 20, border: '1px solid #F3F4F6',
                overflow: 'hidden',
                boxShadow: activeFaq === i ? '0 4px 24px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s'
              }}>
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                        style={{
                          width: '100%', padding: 'clamp(16px,2vw,20px) clamp(18px,3vw,28px)',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          gap: 16, textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer'
                        }}>
                  <span style={{
                    color: '#111', fontWeight: 600,
                    fontSize: 'clamp(13px,1.8vw,15px)', fontFamily: F, flex: 1
                  }}>
                    {faq.q}
                  </span>
                  <div style={{
                    flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: activeFaq === i ? '#111' : '#F3F4F6',
                    color: activeFaq === i ? '#fff' : '#374151', transition: 'all 0.2s'
                  }}>
                    {activeFaq === i ? <Minus size={14}/> : <Plus size={14}/>}
                  </div>
                </button>
                {activeFaq === i && (
                  <div style={{
                    padding: `0 clamp(18px,3vw,28px) clamp(16px,2vw,22px)`,
                    color: '#6B7280', fontSize: 14, lineHeight: 1.78, fontFamily: F
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button style={{
              background: '#111', color: '#fff', borderRadius: 999,
              padding: '14px 36px', fontSize: 14, fontWeight: 700, fontFamily: F, border: 'none',
              cursor: 'pointer', transition: 'background 0.18s'
            }}
                    onMouseEnter={e => e.currentTarget.style.background = SAF}
                    onMouseLeave={e => e.currentTarget.style.background = '#111'}>
              Explore more questions
            </button>
          </div>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════
          8. PROMO BANNER
      ═══════════════════════════════════════════ */}
      <section style={{
        background: '#fff',
        padding: `0 clamp(20px,4vw,48px) clamp(56px,8vw,96px)`
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', position: 'relative',
          borderRadius: 'clamp(24px,4vw,44px)', overflow: 'hidden',
          minHeight: 'clamp(300px,42vw,460px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
        }}>
          <img src={IMG.promo} alt="Promo"
               style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0.72) 100%)'
          }}/>
          <div style={{
            position: 'relative', zIndex: 10,
            padding: 'clamp(40px,6vw,72px) clamp(24px,4vw,48px)', maxWidth: 680
          }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.24)', borderRadius: 999,
              padding: '8px 24px', color: '#fff', fontSize: 11, fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 22
            }}>
              Limited Time
            </span>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(2.2rem,6vw,4.5rem)',
              color: '#fff', lineHeight: 1.0, marginBottom: 18,
              textShadow: '0 2px 20px rgba(0,0,0,0.4)', fontFamily: F
            }}>
              Limited Time<br/>Travel Promo
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.72)',
              fontSize: 'clamp(14px,1.8vw,16px)', marginBottom: 36, fontFamily: F, lineHeight: 1.8
            }}>
              Only the best of India waits for you. Plan your perfect trip in seconds — free, no sign-up required.
            </p>
            <Link to="/planner" style={{ textDecoration: 'none' }}>
              <button style={{
                background: '#fff', color: '#111', borderRadius: 999,
                padding: 'clamp(14px,2vw,18px) clamp(32px,5vw,52px)',
                fontSize: 'clamp(14px,1.8vw,16px)', fontWeight: 900, fontFamily: F, border: 'none',
                cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
                transition: 'transform 0.18s, box-shadow 0.18s'
              }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.36)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.28)';
                      }}>
                Book My Trip
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer/>
      
      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1.04); }
          to   { transform: scale(1.11); }
        }
        @keyframes autoScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        /* Hide scrollbars on strip + filters */
        *::-webkit-scrollbar { display: none; }

        /* On mobile: search bar becomes column, hide dividers */
        @media (max-width: 600px) {
          .tw-divider { display: none !important; }
        }
      `}</style>
    </div>
  );
}