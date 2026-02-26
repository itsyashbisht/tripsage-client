import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { Leaf, MapPin, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllRestaurants, selectRestaurantLoading, selectRestaurants } from '../store';
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion';

const FONT = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const MONO = '\'DM Mono\', monospace';
const SAFFRON = '#E8650A';
const SAFFRON_BG = '#FDF0E6';

const fadeUp = (d = 0) => ({
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: d } }
});
const cardV = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};
const gridC = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function Reveal ({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
  return <motion.div ref={ref} variants={fadeUp(delay)} initial="hidden" animate={inView ? 'show' : 'hidden'}
                     style={style}>{children}</motion.div>;
}

const STATIC_RESTAURANTS = [
  {
    _id: '1',
    name: 'LMB (Laxmi Misthan Bhandar)',
    destination: { name: 'Jaipur' },
    cuisineType: 'Rajasthani',
    priceRange: 'budget',
    pricePerPerson: 350,
    isVeg: true,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=80',
    mustTryDishes: ['Dal Baati Churma', 'Ghevar', 'Mawa Kachori'],
    description: 'A legendary 70-year-old sweet shop turned full restaurant. The dal baati churma is unmissable.'
  },
  {
    _id: '2',
    name: 'Fisherman\'s Wharf',
    destination: { name: 'Goa' },
    cuisineType: 'Seafood',
    priceRange: 'mid',
    pricePerPerson: 800,
    isVeg: false,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80',
    mustTryDishes: ['Prawn Balchaon', 'Fish Curry Rice', 'Crab Masala'],
    description: 'Waterside Goan seafood at its freshest — the fish is caught that morning and grilled to perfection.'
  },
  {
    _id: '3',
    name: 'Thalassa',
    destination: { name: 'Goa' },
    cuisineType: 'Greek-Goan',
    priceRange: 'premium',
    pricePerPerson: 1200,
    isVeg: false,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80',
    mustTryDishes: ['Moussaka', 'Fresh Calamari', 'Grilled Branzino'],
    description: 'Clifftop Greek dining above the Arabian Sea. Sunsets here are the stuff of travel legends.'
  },
  {
    _id: '4',
    name: 'Ambrai Restaurant',
    destination: { name: 'Udaipur' },
    cuisineType: 'Rajasthani',
    priceRange: 'premium',
    pricePerPerson: 1200,
    isVeg: false,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1515511856280-7b23f68d2996?auto=format&fit=crop&w=700&q=80',
    mustTryDishes: ['Laal Maas', 'Dal Kachori', 'Ker Sangri'],
    description: 'Floating lanterns, Lake Pichola views, and the finest Rajasthani cooking. Book ahead.'
  },
  {
    _id: '5',
    name: 'Indian Coffee House',
    destination: { name: 'Delhi' },
    cuisineType: 'South Indian',
    priceRange: 'budget',
    pricePerPerson: 150,
    isVeg: true,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=80',
    mustTryDishes: ['Filter Coffee', 'Masala Dosa', 'Idli Sambar'],
    description: 'A Delhi institution since 1957 — retro charm and unbeatable filter coffee.'
  },
  {
    _id: '6',
    name: 'Karavalli',
    destination: { name: 'Bengaluru' },
    cuisineType: 'Coastal Karnataka',
    priceRange: 'premium',
    pricePerPerson: 1500,
    isVeg: false,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80',
    mustTryDishes: ['Neer Dosa', 'Kane Rava Fry', 'Crab Ghee Roast'],
    description: 'The definitive coastal Karnataka dining experience — fresh catches cooked with ancient family recipes.'
  },
  {
    _id: '7',
    name: 'Chokhi Dhani',
    destination: { name: 'Jaipur' },
    cuisineType: 'Rajasthani Village',
    priceRange: 'mid',
    pricePerPerson: 900,
    isVeg: true,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=700&q=80',
    mustTryDishes: ['Unlimited Thali', 'Bajra Roti', 'Ker Sangri'],
    description: 'A full cultural village experience — folk music, camel rides, and an unlimited thali.'
  },
  {
    _id: '8',
    name: 'Cafe Mami',
    destination: { name: 'Goa' },
    cuisineType: 'Cafe',
    priceRange: 'budget',
    pricePerPerson: 400,
    isVeg: true,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=700&q=80',
    mustTryDishes: ['Veg Shakshuka', 'Banana Bread', 'Cold Brew'],
    description: 'A cozy all-veg cafe tucked in North Goa — great for slow mornings and digital nomads.'
  },
];

// mustTryDishes can arrive as array, comma-string, or other — always normalise to array
const toArray = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string' && v.trim()) return v.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

const PRICE_RANGES = ['All', 'Budget', 'Mid-Range', 'Premium'];
const PRICE_MAP = { budget: 'Budget', mid: 'Mid-Range', premium: 'Premium' };
const RANGE_COLORS = { Budget: '#16A34A', 'Mid-Range': SAFFRON, Premium: '#9333EA' };
const RANGE_BG = { Budget: '#DCFCE7', 'Mid-Range': SAFFRON_BG, Premium: '#F5F3FF' };

function SkeletonCard () {
  return (
    <div style={{ borderRadius: 24, overflow: 'hidden', background: '#fff', border: '1px solid #F3F4F6' }}>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }}
                  style={{ height: 200, background: '#F3F4F6' }}/>
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[80, 60, 100].map((w, i) => <div key={i} style={{
          height: 12,
          borderRadius: 999,
          background: '#F3F4F6',
          width: `${w}%`
        }}/>)}
      </div>
    </div>
  );
}

export default function FoodPage () {
  const dispatch = useDispatch();
  const apiRestaurants = useSelector(selectRestaurants);
  const loading = useSelector(selectRestaurantLoading);
  
  const [priceRange, setPriceRange] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [search, setSearch] = useState('');
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  
  useEffect(() => {
    const params = {};
    if (priceRange !== 'All') {
      const key = Object.entries(PRICE_MAP).find(([, v]) => v === priceRange)?.[0];
      if (key) params.priceRange = key;
    }
    if (vegOnly) params.isVeg = true;
    dispatch(fetchAllRestaurants(params));
  }, [dispatch, priceRange, vegOnly]);
  
  const source = apiRestaurants?.length > 0 ? apiRestaurants : STATIC_RESTAURANTS;
  const filtered = useMemo(() => {
    return source.filter(r => {
      const rangeDisplay = PRICE_MAP[r.priceRange] || r.priceRange;
      const matchRange = priceRange === 'All' || rangeDisplay === priceRange;
      const matchVeg = !vegOnly || r.isVeg;
      const matchSearch = !search.trim() ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.destination?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.cuisineType || '').toLowerCase().includes(search.toLowerCase());
      return matchRange && matchVeg && matchSearch;
    });
  }, [source, priceRange, vegOnly, search]);
  
  return (
    <div style={{ fontFamily: FONT, color: '#111', background: '#F9FAFB', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar/>
      
      <section ref={heroRef} style={{ position: 'relative', height: '44vh', minHeight: 300, overflow: 'hidden' }}>
        <motion.div style={{
          y: bgY, position: 'absolute', inset: '-20% 0', zIndex: 0,
          backgroundImage: 'url(\'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1920&q=85\')',
          backgroundSize: 'cover', backgroundPosition: 'center 40%'
        }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(8,4,2,0.50) 0%, rgba(8,4,2,0.84) 100%)'
        }}/>
        <div style={{
          position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 0'
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
            ✦ India's Finest Food
          </motion.p>
          <motion.h1 variants={fadeUp(0.16)} initial="hidden" animate="show"
                     style={{
                       color: '#fff',
                       fontWeight: 900,
                       fontSize: 'clamp(2rem,5vw,3.4rem)',
                       lineHeight: 1.06,
                       marginBottom: 16
                     }}>
            Eat like a local, anywhere
          </motion.h1>
          <motion.p variants={fadeUp(0.26)} initial="hidden" animate="show"
                    style={{
                      color: 'rgba(255,255,255,0.68)',
                      fontSize: 'clamp(0.9rem,1.6vw,1.05rem)',
                      maxWidth: 480,
                      lineHeight: 1.8
                    }}>
            From street-side dhabas to lakeside fine dining — every rupee spent deliciously.
          </motion.p>
        </div>
      </section>
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>
        <Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: 460 }}>
                <Search size={17} style={{
                  position: 'absolute',
                  left: 18,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF'
                }}/>
                <input value={search} onChange={e => setSearch(e.target.value)}
                       placeholder="Search restaurants, cuisines or cities..."
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
                         background: '#fff'
                       }}
                       onFocus={e => e.target.style.borderColor = SAFFRON}
                       onBlur={e => e.target.style.borderColor = '#E5E7EB'}/>
              </div>
              <motion.button onClick={() => setVegOnly(p => !p)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                             style={{
                               display: 'flex',
                               alignItems: 'center',
                               gap: 8,
                               padding: '12px 20px',
                               borderRadius: 999,
                               fontFamily: FONT,
                               fontSize: 13,
                               fontWeight: vegOnly ? 700 : 500,
                               cursor: 'pointer',
                               border: `1.5px solid ${vegOnly ? '#16A34A' : '#E5E7EB'}`,
                               background: vegOnly ? '#DCFCE7' : '#fff',
                               color: vegOnly ? '#16A34A' : '#6B7280',
                               transition: 'all 0.18s'
                             }}>
                <Leaf size={15} style={{ color: vegOnly ? '#16A34A' : '#9CA3AF' }}/> Veg Only
              </motion.button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PRICE_RANGES.map(range => (
                <motion.button key={range} onClick={() => setPriceRange(range)} whileHover={{ scale: 1.04 }}
                               whileTap={{ scale: 0.96 }}
                               style={{
                                 padding: '9px 20px',
                                 borderRadius: 999,
                                 fontFamily: FONT,
                                 fontSize: 13,
                                 fontWeight: priceRange === range ? 700 : 500,
                                 cursor: 'pointer',
                                 border: `1.5px solid ${priceRange === range ? (RANGE_COLORS[range] || SAFFRON) : '#E5E7EB'}`,
                                 background: priceRange === range ? (RANGE_COLORS[range] || SAFFRON) : '#fff',
                                 color: priceRange === range ? '#fff' : '#6B7280',
                                 transition: 'all 0.18s'
                               }}>
                  {range}
                </motion.button>
              ))}
            </div>
          </div>
        </Reveal>
        
        {loading.list && apiRestaurants.length === 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i}/>)}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={priceRange + String(vegOnly) + search} variants={gridC} initial="hidden" animate="show"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
                          gap: 24
                        }}>
              {filtered.map(rest => {
                const rangeDisplay = PRICE_MAP[rest.priceRange] || rest.priceRange;
                const rangeColor = RANGE_COLORS[rangeDisplay] || SAFFRON;
                const rangeBg = RANGE_BG[rangeDisplay] || SAFFRON_BG;
                return (
                  <motion.div key={rest._id} variants={cardV}
                              whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
                              style={{
                                borderRadius: 24, overflow: 'hidden', background: '#fff', border: '1px solid #F3F4F6',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column'
                              }}>
                    <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                      <img src={rest.imageUrl} alt={rest.name}
                           style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                           onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                           onMouseLeave={e => e.target.style.transform = 'scale(1)'}/>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 55%)'
                      }}/>
                      <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6 }}>
                        <span style={{
                          fontFamily: FONT,
                          fontSize: 11,
                          fontWeight: 700,
                          background: rangeBg,
                          color: rangeColor,
                          borderRadius: 999,
                          padding: '5px 12px'
                        }}>
                          {rangeDisplay}
                        </span>
                        {rest.isVeg && (
                          <span style={{
                            fontFamily: FONT,
                            fontSize: 11,
                            fontWeight: 700,
                            background: '#DCFCE7',
                            color: '#16A34A',
                            borderRadius: 999,
                            padding: '5px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            <Leaf size={10}/> Veg
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ padding: '18px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 5
                      }}>
                        <h3 style={{
                          fontFamily: FONT,
                          fontWeight: 800,
                          fontSize: '0.98rem',
                          color: '#111',
                          margin: 0,
                          flex: 1,
                          marginRight: 8
                        }}>{rest.name}</h3>
                        {rest.rating && (
                          <span style={{
                            fontFamily: MONO,
                            fontSize: 12,
                            fontWeight: 800,
                            color: '#FBBF24',
                            flexShrink: 0
                          }}>★ {rest.rating}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                        <MapPin size={11} style={{ color: '#9CA3AF' }}/>
                        <span style={{
                          fontFamily: FONT,
                          fontSize: 12,
                          color: '#9CA3AF'
                        }}>{rest.destination?.name} · {rest.cuisineType}</span>
                      </div>
                      <p style={{
                        fontFamily: FONT,
                        fontSize: 13,
                        color: '#6B7280',
                        lineHeight: 1.7,
                        marginBottom: 14,
                        flex: 1
                      }}>{rest.description}</p>
                      {toArray(rest.mustTryDishes).length > 0 && (
                        <div style={{ marginBottom: 14 }}>
                          <p style={{
                            fontFamily: FONT,
                            fontSize: 11,
                            fontWeight: 800,
                            color: '#9CA3AF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: 7
                          }}>Must Try</p>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {toArray(rest.mustTryDishes).slice(0, 3).map(dish => (
                              <span key={dish} style={{
                                fontFamily: FONT,
                                fontSize: 11,
                                fontWeight: 600,
                                background: SAFFRON_BG,
                                color: SAFFRON,
                                borderRadius: 999,
                                padding: '4px 10px'
                              }}>{dish}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{
                            fontFamily: MONO,
                            fontWeight: 900,
                            fontSize: '1rem',
                            color: SAFFRON,
                            margin: 0
                          }}>~₹{rest.pricePerPerson?.toLocaleString('en-IN')}</p>
                          <p style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF', margin: 0 }}>per person</p>
                        </div>
                        <Link to="/planner"
                              style={{
                                background: SAFFRON, color: '#fff', borderRadius: 999, padding: '10px 18px',
                                fontFamily: FONT, fontSize: 13, fontWeight: 700, textDecoration: 'none',
                                boxShadow: '0 4px 12px rgba(232,101,10,0.28)'
                              }}>
                          Plan Trip
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