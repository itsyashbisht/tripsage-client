import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { Car, MapPin, Search, Star, UtensilsCrossed, Waves, Wifi } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllHotels, selectHotelLoading, selectHotels } from '../store';
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

const AMENITY_ICONS = {
  Pool: Waves,
  WiFi: Wifi,
  'Wi-Fi': Wifi,
  Transport: Car,
  Restaurant: UtensilsCrossed,
  Parking: Car
};

const STATIC_HOTELS = [
  {
    _id: '1',
    name: 'The Oberoi Rajvilas',
    destination: { name: 'Jaipur, Rajasthan' },
    tier: 'luxury',
    starRating: 5,
    pricePerNight: 18000,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80',
    description: 'A palatial resort within 32 acres of landscaped gardens — Rajput grandeur at its finest.',
    amenities: ['Pool', 'Spa', 'Fine Dining', 'Valet']
  },
  {
    _id: '2',
    name: 'Taj Lake Palace',
    destination: { name: 'Udaipur, Rajasthan' },
    tier: 'luxury',
    starRating: 5,
    pricePerNight: 22000,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=700&q=80',
    description: 'Floating on Lake Pichola — India\'s most iconic heritage hotel on a white marble island.',
    amenities: ['Lake View', 'Pool', 'Spa', 'Heritage']
  },
  {
    _id: '3',
    name: 'Spiti Eco Camp',
    destination: { name: 'Spiti, Himachal' },
    tier: 'economy',
    starRating: 2,
    pricePerNight: 800,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80',
    description: 'Sleep under a billion stars in a cosy camp with mountain views that no suite can match.',
    amenities: ['Mountain View', 'Bonfire', 'Local Food']
  },
  {
    _id: '4',
    name: 'Zostel Rishikesh',
    destination: { name: 'Rishikesh, Uttarakhand' },
    tier: 'economy',
    starRating: 2,
    pricePerNight: 600,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1590050811270-c33c6df97517?auto=format&fit=crop&w=700&q=80',
    description: 'A vibrant backpacker hostel on the Ganga — meet solo travellers from around the world.',
    amenities: ['River View', 'Yoga Deck', 'Café', 'Wi-Fi']
  },
  {
    _id: '5',
    name: 'Alsisar Haveli',
    destination: { name: 'Jaipur, Rajasthan' },
    tier: 'standard',
    starRating: 4,
    pricePerNight: 4200,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=700&q=80',
    description: 'A beautifully restored 18th-century haveli with painted frescoes and a lush courtyard.',
    amenities: ['Heritage', 'Pool', 'Restaurant', 'Wi-Fi']
  },
  {
    _id: '6',
    name: 'Kumarakom Lake Resort',
    destination: { name: 'Kerala' },
    tier: 'luxury',
    starRating: 5,
    pricePerNight: 16000,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80',
    description: 'A sprawling backwater resort with private villa plunge pools and houseboat transfers.',
    amenities: ['Backwaters', 'Pool', 'Ayurveda', 'Fine Dining']
  },
  {
    _id: '7',
    name: 'The Grand Dragon',
    destination: { name: 'Ladakh' },
    tier: 'luxury',
    starRating: 5,
    pricePerNight: 14000,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=700&q=80',
    description: 'Ladakh\'s finest hotel — Himalayan views, warm rooms, and legendary hospitality.',
    amenities: ['Mountain View', 'Restaurant', 'Spa', 'Wi-Fi']
  },
  {
    _id: '8',
    name: 'DreamCatcher Hostel',
    destination: { name: 'Goa' },
    tier: 'economy',
    starRating: 2,
    pricePerNight: 700,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80',
    description: 'Laid-back Goa vibes, hammocks, a rooftop bar, and a 5-min walk to Vagator beach.',
    amenities: ['Beach Nearby', 'Bar', 'Pool', 'Wi-Fi']
  },
];

const TIERS = ['All', 'Economy', 'Standard', 'Luxury'];
const TIER_COLORS = { Economy: '#16A34A', Standard: SAFFRON, Luxury: '#9333EA' };
const TIER_BG = { Economy: '#DCFCE7', Standard: SAFFRON_BG, Luxury: '#F5F3FF' };

function StarRating ({ rating, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} style={{
          color: s <= Math.round(rating) ? '#FBBF24' : '#E5E7EB',
          fill: s <= Math.round(rating) ? '#FBBF24' : '#E5E7EB'
        }}/>)}
      </div>
      {count && <span style={{ fontFamily: MONO, fontSize: 11, color: '#9CA3AF' }}>({count})</span>}
    </div>
  );
}

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

export default function HotelsPage () {
  const dispatch = useDispatch();
  const apiHotels = useSelector(selectHotels);
  const loading = useSelector(selectHotelLoading);

  const [tier, setTier] = useState('All');
  const [search, setSearch] = useState('');

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);

  useEffect(() => {
    const params = {};
    if (tier !== 'All') params.tier = tier.toLowerCase();
    dispatch(fetchAllHotels(params));
  }, [dispatch, tier]);

  const source = apiHotels?.length > 0 ? apiHotels : STATIC_HOTELS;
  const filtered = useMemo(() => {
    return source.filter(h => {
      const matchTier = tier === 'All' || h.tier?.toLowerCase() === tier.toLowerCase();
      const matchSearch = !search.trim() ||
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        (h.destination?.name || '').toLowerCase().includes(search.toLowerCase());
      return matchTier && matchSearch;
    });
  }, [source, tier, search]);

  return (
    <div style={{ fontFamily: FONT, color: '#111', background: '#F9FAFB', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar/>
      <section ref={heroRef} style={{ position: 'relative', height: '44vh', minHeight: 300, overflow: 'hidden' }}>
        <motion.div style={{
          y: bgY, position: 'absolute', inset: '-20% 0', zIndex: 0,
          backgroundImage: 'url(\'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=85\')',
          backgroundSize: 'cover', backgroundPosition: 'center 40%'
        }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(8,4,2,0.50) 0%, rgba(8,4,2,0.84) 100%)'
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
          <motion.p variants={fadeUp(0.06)} initial="hidden" animate="show" style={{
            color: SAFFRON,
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            marginBottom: 14
          }}>✦ &nbsp;Curated Stays
          </motion.p>
          <motion.h1 variants={fadeUp(0.16)} initial="hidden" animate="show" style={{
            color: '#fff',
            fontWeight: 900,
            fontSize: 'clamp(2rem,5vw,3.4rem)',
            lineHeight: 1.06,
            marginBottom: 16
          }}>Find your perfect stay
          </motion.h1>
          <motion.p variants={fadeUp(0.26)} initial="hidden" animate="show" style={{
            color: 'rgba(255,255,255,0.68)',
            fontSize: 'clamp(0.9rem,1.6vw,1.05rem)',
            maxWidth: 480,
            lineHeight: 1.8
          }}>From palace suites to backpacker hostels — every budget, every vibe.
          </motion.p>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>
        <Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
            <div style={{ position: 'relative', maxWidth: 480 }}>
              <Search size={17} style={{
                position: 'absolute',
                left: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF'
              }}/>
              <input value={search} onChange={e => setSearch(e.target.value)}
                     placeholder="Search hotels or destinations…"
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
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TIERS.map(t => (
                <motion.button key={t} onClick={() => setTier(t)} whileHover={{ scale: 1.04 }}
                               whileTap={{ scale: 0.96 }}
                               style={{
                                 padding: '9px 22px',
                                 borderRadius: 999,
                                 fontFamily: FONT,
                                 fontSize: 13,
                                 fontWeight: tier === t ? 700 : 500,
                                 cursor: 'pointer',
                                 border: `1.5px solid ${tier === t ? (TIER_COLORS[t] || SAFFRON) : '#E5E7EB'}`,
                                 background: tier === t ? (TIER_COLORS[t] || SAFFRON) : '#fff',
                                 color: tier === t ? '#fff' : '#6B7280',
                                 transition: 'all 0.18s'
                               }}>
                  {t === 'Economy' ? '🪙' : t === 'Standard' ? '⭐' : t === 'Luxury' ? '💎' : ''} {t}
                </motion.button>
              ))}
            </div>
          </div>
        </Reveal>

        {loading.list && apiHotels.length === 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i}/>)}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={tier + search} variants={gridC} initial="hidden" animate="show"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
                          gap: 24
                        }}>
              {filtered.map(hotel => {
                const tierKey = hotel.tier?.charAt(0).toUpperCase() + hotel.tier?.slice(1);
                return (
                  <motion.div key={hotel._id} variants={cardV}
                              whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
                              style={{
                                borderRadius: 24,
                                overflow: 'hidden',
                                background: '#fff',
                                border: '1px solid #F3F4F6',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                display: 'flex',
                                flexDirection: 'column'
                              }}>
                    <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                      <img src={hotel.imageUrl} alt={hotel.name}
                           style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                           onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                           onMouseLeave={e => e.target.style.transform = 'scale(1)'}/>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 55%)'
                      }}/>
                      <div style={{ position: 'absolute', top: 14, left: 14 }}>
                        <span style={{
                          fontFamily: FONT,
                          fontSize: 11,
                          fontWeight: 700,
                          background: TIER_BG[tierKey] || '#F3F4F6',
                          color: TIER_COLORS[tierKey] || '#6B7280',
                          borderRadius: 999,
                          padding: '5px 12px'
                        }}>
                          {tierKey === 'Economy' ? '🪙' : tierKey === 'Standard' ? '⭐' : tierKey === 'Luxury' ? '💎' : ''} {tierKey}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <h3 style={{
                          fontFamily: FONT,
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: '#111',
                          margin: 0
                        }}>{hotel.name}</h3>
                        {hotel.rating && <StarRating rating={hotel.rating}/>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
                        <MapPin size={12} style={{ color: '#9CA3AF' }}/>
                        <span style={{
                          fontFamily: FONT,
                          fontSize: 12,
                          color: '#9CA3AF'
                        }}>{hotel.destination?.name || hotel.location}</span>
                      </div>
                      <p style={{
                        fontFamily: FONT,
                        fontSize: 13,
                        color: '#6B7280',
                        lineHeight: 1.7,
                        marginBottom: 16,
                        flex: 1
                      }}>{hotel.description}</p>
                      {hotel.amenities?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                          {hotel.amenities.slice(0, 4).map(a => (
                            <span key={a} style={{
                              fontFamily: FONT,
                              fontSize: 11,
                              fontWeight: 600,
                              background: '#F3F4F6',
                              color: '#6B7280',
                              borderRadius: 999,
                              padding: '4px 10px'
                            }}>{a}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{
                            fontFamily: MONO,
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            color: SAFFRON,
                            margin: 0
                          }}>₹{hotel.pricePerNight?.toLocaleString('en-IN')}</p>
                          <p style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF', margin: 0 }}>per night</p>
                        </div>
                        <Link to="/planner" style={{
                          background: SAFFRON,
                          color: '#fff',
                          borderRadius: 999,
                          padding: '10px 20px',
                          fontFamily: FONT,
                          fontSize: 13,
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}>
                          Plan Stay
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