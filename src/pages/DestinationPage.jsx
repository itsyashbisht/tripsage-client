// src/pages/DestinationsPage.jsx — Redux-connected with real API data + static fallback
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllDestinations, selectDestinationLoading, selectDestinations } from '../store';
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion';

const FONT = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const MONO = '\'DM Mono\', monospace';
const SAFFRON = '#E8650A';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } }
});
const cardVariant = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};
const gridContainer = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function Reveal ({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
  return <motion.div ref={ref} variants={fadeUp(delay)} initial="hidden" animate={inView ? 'show' : 'hidden'}
                     style={style}>{children}</motion.div>;
}

// Static fallback data (shown while API loads or if API unavailable)
const STATIC_DESTINATIONS = [
  {
    _id: '1',
    name: 'Jaipur',
    state: 'Rajasthan',
    slug: 'jaipur',
    category: 'Heritage',
    bestSeason: 'Oct–Mar',
    avgDurationDays: 4,
    pricing: [{ tier: 'economy', hotel: { min: 600, max: 1500 } }],
    heroImageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=700&q=80',
    description: 'The Pink City — forts, palaces, and bazaars soaked in royal Rajput history.'
  },
  {
    _id: '2',
    name: 'Goa',
    state: 'Goa',
    slug: 'goa',
    category: 'Beaches',
    bestSeason: 'Nov–Feb',
    avgDurationDays: 5,
    pricing: [{ tier: 'economy', hotel: { min: 700, max: 2000 } }],
    heroImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80',
    description: 'Sun-drenched shores, spiced seafood, and a laid-back Portuguese coastal vibe.'
  },
  {
    _id: '3',
    name: 'Kerala',
    state: 'Kerala',
    slug: 'kerala',
    category: 'Nature',
    bestSeason: 'Sep–Mar',
    avgDurationDays: 6,
    pricing: [{ tier: 'economy', hotel: { min: 800, max: 2500 } }],
    heroImageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80',
    description: 'God\'s Own Country — backwaters, tea gardens, and houseboat sunsets.'
  },
  {
    _id: '4',
    name: 'Ladakh',
    state: 'Ladakh',
    slug: 'ladakh',
    category: 'Adventure',
    bestSeason: 'May–Sep',
    avgDurationDays: 7,
    pricing: [{ tier: 'economy', hotel: { min: 700, max: 2000 } }],
    heroImageUrl: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=700&q=80',
    description: 'High-altitude desert, Buddhist monasteries, and sky-high mountain passes.'
  },
  {
    _id: '5',
    name: 'Udaipur',
    state: 'Rajasthan',
    slug: 'udaipur',
    category: 'Heritage',
    bestSeason: 'Oct–Mar',
    avgDurationDays: 3,
    pricing: [{ tier: 'economy', hotel: { min: 600, max: 1800 } }],
    heroImageUrl: 'https://images.unsplash.com/photo-1515511856280-7b23f68d2996?auto=format&fit=crop&w=700&q=80',
    description: 'City of Lakes — palaces rising from shimmering water at every turn.'
  },
  {
    _id: '6',
    name: 'Manali',
    state: 'Himachal Pradesh',
    slug: 'manali',
    category: 'Adventure',
    bestSeason: 'Apr–Jun',
    avgDurationDays: 5,
    pricing: [{ tier: 'economy', hotel: { min: 700, max: 2000 } }],
    heroImageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80',
    description: 'Snow-capped peaks, pine forests, and the gateway to Spiti Valley.'
  },
  {
    _id: '7',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    slug: 'rishikesh',
    category: 'Spiritual',
    bestSeason: 'Feb–May',
    avgDurationDays: 3,
    pricing: [{ tier: 'economy', hotel: { min: 500, max: 1500 } }],
    heroImageUrl: 'https://images.unsplash.com/photo-1590050811270-c33c6df97517?auto=format&fit=crop&w=700&q=80',
    description: 'Yoga capital of the world — Ganga ghats, ashrams, and white-water thrills.'
  },
  {
    _id: '8',
    name: 'Hampi',
    state: 'Karnataka',
    slug: 'hampi',
    category: 'Heritage',
    bestSeason: 'Oct–Feb',
    avgDurationDays: 3,
    pricing: [{ tier: 'economy', hotel: { min: 400, max: 1200 } }],
    heroImageUrl: 'https://images.unsplash.com/photo-1582651957697-c47e4c0c7374?auto=format&fit=crop&w=700&q=80',
    description: 'Ancient Vijayanagara ruins scattered among giant boulder landscapes.'
  },
  {
    _id: '9',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    slug: 'varanasi',
    category: 'Spiritual',
    bestSeason: 'Oct–Mar',
    avgDurationDays: 3,
    pricing: [{ tier: 'economy', hotel: { min: 600, max: 1800 } }],
    heroImageUrl: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=700&q=80',
    description: 'The eternal city on the Ganga — ghats, aarti flames, and timeless spirituality.'
  },
  {
    _id: '10',
    name: 'Andaman',
    state: 'Andaman & Nicobar',
    slug: 'andaman',
    category: 'Beaches',
    bestSeason: 'Nov–May',
    avgDurationDays: 6,
    pricing: [{ tier: 'economy', hotel: { min: 800, max: 2500 } }],
    heroImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80',
    description: 'Turquoise coves, coral reefs, and India\'s most pristine beaches.'
  },
  {
    _id: '11',
    name: 'Coorg',
    state: 'Karnataka',
    slug: 'coorg',
    category: 'Nature',
    bestSeason: 'Oct–Mar',
    avgDurationDays: 3,
    pricing: [{ tier: 'economy', hotel: { min: 600, max: 2000 } }],
    heroImageUrl: 'https://images.unsplash.com/photo-1597149278282-4e0c1e73d2c2?auto=format&fit=crop&w=700&q=80',
    description: 'Scotland of India — misty coffee estates and cascading waterfalls.'
  },
  {
    _id: '12',
    name: 'Ranthambore',
    state: 'Rajasthan',
    slug: 'ranthambore',
    category: 'Wildlife',
    bestSeason: 'Oct–Apr',
    avgDurationDays: 2,
    pricing: [{ tier: 'economy', hotel: { min: 800, max: 3000 } }],
    heroImageUrl: 'https://images.unsplash.com/photo-1550850839-8dc894ed385a?auto=format&fit=crop&w=700&q=80',
    description: 'Track Bengal tigers through Rajasthan\'s top tiger reserve.'
  },
];

const CATEGORIES = ['All', 'Heritage', 'Beaches', 'Nature', 'Adventure', 'Spiritual', 'Wildlife'];
const CAT_COLORS = {
  Heritage: { bg: '#FDF0E6', text: '#E8650A' }, Beaches: { bg: '#E6F4F2', text: '#1A7F74' },
  Nature: { bg: '#DCFCE7', text: '#16A34A' }, Adventure: { bg: '#FEF3C7', text: '#D97706' },
  Spiritual: { bg: '#F5F3FF', text: '#7C3AED' }, Wildlife: { bg: '#FFF1F2', text: '#E11D48' },
};
const MIN_PRICES = {
  Heritage: '₹2,500',
  Beaches: '₹3,000',
  Nature: '₹3,500',
  Adventure: '₹5,000',
  Spiritual: '₹2,200',
  Wildlife: '₹4,500',
  default: '₹2,500'
};

function SkeletonCard () {
  return (
    <div style={{ borderRadius: 24, overflow: 'hidden', background: '#fff', border: '1px solid #F3F4F6' }}>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }}
                  style={{ height: 220, background: 'linear-gradient(90deg,#F3F4F6,#E5E7EB,#F3F4F6)' }}/>
      <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 14, borderRadius: 999, background: '#F3F4F6', width: '60%' }}/>
        <div style={{ height: 10, borderRadius: 999, background: '#F3F4F6', width: '80%' }}/>
        <div style={{ height: 10, borderRadius: 999, background: '#F3F4F6', width: '50%' }}/>
      </div>
    </div>
  );
}

export default function DestinationsPage () {
  const dispatch = useDispatch();
  const apiData = useSelector(selectDestinations);
  const loading = useSelector(selectDestinationLoading);

  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);

  // Fetch from API on mount + when category changes
  useEffect(() => {
    const params = {};
    if (category !== 'All') params.category = category;
    if (search.trim()) params.search = search.trim();
    dispatch(fetchAllDestinations(params));
  }, [dispatch, category]);

  // Use API data if available, else static fallback
  const source = apiData?.length > 0 ? apiData : STATIC_DESTINATIONS;

  const filtered = useMemo(() => {
    return source.filter(d => {
      const matchCat = category === 'All' || d.category === category;
      const matchSearch = !search.trim() ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.state.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [source, category, search]);

  const getPriceDisplay = (dest) => {
    if (dest.pricing?.length > 0) {
      const eco = dest.pricing.find(p => p.tier === 'economy');
      if (eco?.hotel?.min) return `₹${eco.hotel.min.toLocaleString('en-IN')}`;
    }
    return MIN_PRICES[dest.category] || MIN_PRICES.default;
  };

  return (
    <div style={{ fontFamily: FONT, color: '#111', background: '#F9FAFB', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar/>

      {/* Hero */}
      <section ref={heroRef} style={{ position: 'relative', height: '46vh', minHeight: 320, overflow: 'hidden' }}>
        <motion.div style={{
          y: bgY, position: 'absolute', inset: '-20% 0', zIndex: 0,
          backgroundImage: 'url(\'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=85\')',
          backgroundSize: 'cover', backgroundPosition: 'center 52%'
        }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(8,4,2,0.52) 0%, rgba(8,4,2,0.82) 100%)'
        }}/>
        <div style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 24px 0'
        }}>
          <motion.p variants={fadeUp(0.06)} initial="hidden" animate="show"
                    style={{
                      color: SAFFRON,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      marginBottom: 14
                    }}>
            ✦ &nbsp;40+ Handpicked Destinations
          </motion.p>
          <motion.h1 variants={fadeUp(0.16)} initial="hidden" animate="show"
                     style={{
                       color: '#fff',
                       fontWeight: 900,
                       fontSize: 'clamp(2rem,5vw,3.4rem)',
                       lineHeight: 1.06,
                       marginBottom: 16
                     }}>
            Where do you want to go?
          </motion.h1>
          <motion.p variants={fadeUp(0.26)} initial="hidden" animate="show"
                    style={{
                      color: 'rgba(255,255,255,0.68)',
                      fontSize: 'clamp(0.9rem,1.6vw,1.05rem)',
                      maxWidth: 500,
                      lineHeight: 1.8
                    }}>
            From Himalayan peaks to palm-fringed shores — find your perfect India.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 0' }}>
        <Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
            {/* Search */}
            <div style={{ position: 'relative', maxWidth: 480 }}>
              <Search size={17} style={{
                position: 'absolute',
                left: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF'
              }}/>
              <input value={search} onChange={e => setSearch(e.target.value)}
                     placeholder="Search destinations or states…"
                     style={{
                       width: '100%',
                       boxSizing: 'border-box',
                       paddingLeft: 48,
                       paddingRight: 20,
                       paddingTop: 14,
                       paddingBottom: 14,
                       border: '1.5px solid #E5E7EB',
                       borderRadius: 999,
                       fontFamily: FONT,
                       fontSize: 14,
                       color: '#111',
                       outline: 'none',
                       background: '#fff',
                       boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                     }}
                     onFocus={e => e.target.style.borderColor = SAFFRON}
                     onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
            </div>
            {/* Category pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <motion.button key={cat} onClick={() => setCategory(cat)}
                               whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                               style={{
                                 padding: '9px 20px',
                                 borderRadius: 999,
                                 fontFamily: FONT,
                                 fontSize: 13,
                                 fontWeight: category === cat ? 700 : 500,
                                 cursor: 'pointer',
                                 border: `1.5px solid ${category === cat ? SAFFRON : '#E5E7EB'}`,
                                 background: category === cat ? SAFFRON : '#fff',
                                 color: category === cat ? '#fff' : '#6B7280',
                                 transition: 'all 0.18s',
                                 boxShadow: category === cat ? '0 4px 14px rgba(232,101,10,0.26)' : 'none'
                               }}>
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Count */}
        <Reveal>
          <p style={{
            fontFamily: MONO,
            fontSize: 12,
            fontWeight: 700,
            color: '#9CA3AF',
            marginBottom: 24,
            textTransform: 'uppercase',
            letterSpacing: '0.12em'
          }}>
            {loading.list ? 'Loading…' : `${filtered.length} destination${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </Reveal>

        {/* Grid */}
        {loading.list && apiData.length === 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
            gap: 24,
            marginBottom: 80
          }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i}/>)}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={category + search} variants={gridContainer} initial="hidden" animate="show"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
                          gap: 24,
                          marginBottom: 80
                        }}>
              {filtered.map(dest => {
                const cc = CAT_COLORS[dest.category] || { bg: '#F3F4F6', text: '#6B7280' };
                const img = dest.heroImageUrl || `https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=700&q=80`;
                return (
                  <motion.div key={dest._id} variants={cardVariant}
                              style={{
                                borderRadius: 24,
                                overflow: 'hidden',
                                background: '#fff',
                                border: '1px solid #F3F4F6',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                cursor: 'pointer',
                                transition: 'box-shadow 0.2s, transform 0.2s'
                              }}
                              whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}>
                    <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                      <img src={img} alt={dest.name}
                           style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                           onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                           onMouseLeave={e => e.target.style.transform = 'scale(1)'}/>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.48) 0%, transparent 55%)'
                      }}/>
                      <div style={{ position: 'absolute', top: 14, left: 14 }}>
                        <span style={{
                          fontFamily: FONT, fontSize: 11, fontWeight: 700, background: cc.bg, color: cc.text,
                          borderRadius: 999, padding: '5px 12px', backdropFilter: 'blur(8px)'
                        }}>{dest.category}</span>
                      </div>
                      <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
                        <p style={{
                          fontFamily: FONT,
                          fontWeight: 900,
                          fontSize: '1.15rem',
                          color: '#fff',
                          margin: 0
                        }}>{dest.name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <MapPin size={12} style={{ color: 'rgba(255,255,255,0.7)' }}/>
                          <span style={{
                            fontFamily: FONT,
                            fontSize: 12,
                            color: 'rgba(255,255,255,0.7)'
                          }}>{dest.state}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '18px 22px' }}>
                      <p style={{
                        fontFamily: FONT,
                        fontSize: 13,
                        color: '#6B7280',
                        lineHeight: 1.7,
                        marginBottom: 16
                      }}>{dest.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{
                            fontFamily: MONO,
                            fontSize: 11,
                            color: '#9CA3AF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: 2
                          }}>From</p>
                          <p style={{
                            fontFamily: MONO,
                            fontWeight: 900,
                            fontSize: '1.05rem',
                            color: SAFFRON
                          }}>{getPriceDisplay(dest)}<span
                            style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 400 }}>/night</span></p>
                        </div>
                        <Link to={`/planner?destination=${encodeURIComponent(dest.name + ', ' + dest.state)}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 7,
                                background: SAFFRON,
                                color: '#fff',
                                borderRadius: 999,
                                padding: '10px 18px',
                                fontFamily: FONT,
                                fontSize: 13,
                                fontWeight: 700,
                                textDecoration: 'none',
                                boxShadow: '0 4px 14px rgba(232,101,10,0.28)'
                              }}>
                          Plan Trip <ArrowRight size={14}/>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <Footer/>
    </div>
  );
}