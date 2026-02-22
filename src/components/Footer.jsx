import { ArrowRight, Instagram, Mail, MapPin, Phone, Sparkles, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

const F = '\'Plus Jakarta Sans\', system-ui, sans-serif';
const FM = '\'DM Mono\', monospace';
const SAF = '#E8650A';

const NAV = {
  Explore: ['Destinations', 'Hotels', 'Food & Dining', 'About Us'],
  Plan: ['Start Planning', 'How It Works', 'AI Itinerary', 'Packages'],
  Legal: ['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Sitemap'],
};

const SOCIAL = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
  { Icon: Youtube, href: '#', label: 'YouTube' },
];

const LINKS = {
  Explore: ['/destinations', '/hotels', '/food', '/about'],
  Plan: ['/planner', '/about', '/planner', '/planner'],
  Legal: ['#', '#', '#', '#'],
};

export function Footer () {
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);
  const [hovered, setHovered] = useState(null);
  
  const handleSub = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubbed(true);
      setEmail('');
    }
  };
  
  return (
    <footer style={{
      background: '#0A0705',
      color: '#fff',
      fontFamily: F,
      borderTop: `3px solid ${SAF}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      {/* Ambient glow blobs */}
      <div style={{
        position: 'absolute', top: -120, left: -100, width: 420, height: 420, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(232,101,10,0.12) 0%, transparent 70%)`,
        pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute', bottom: -80, right: -60, width: 340, height: 340, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(232,101,10,0.07) 0%, transparent 70%)`,
        pointerEvents: 'none'
      }}/>
      
      {/* ── TOP CTA BAND ── */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(40px,6vw,64px) clamp(20px,5vw,64px)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 24
        }}>
          <div>
            <p style={{
              color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 10
            }}>
              ✦ Start for free today
            </p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', lineHeight: 1.12,
              color: '#fff', margin: 0
            }}>
              Your next adventure,<br/>
              <span style={{ color: SAF }}>planned in 15 seconds.</span>
            </h2>
          </div>
          <Link to="/planner" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: SAF, color: '#fff', border: 'none', cursor: 'pointer',
              borderRadius: 999, padding: '16px 32px',
              fontFamily: F, fontSize: 15, fontWeight: 800,
              boxShadow: `0 8px 32px rgba(232,101,10,0.40)`,
              transition: 'transform 0.18s, box-shadow 0.18s',
            }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(232,101,10,0.55)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(232,101,10,0.40)';
                    }}>
              Plan My Trip <ArrowRight size={17}/>
            </button>
          </Link>
        </div>
      </div>
      
      {/* ── MAIN GRID ── */}
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: 'clamp(48px,6vw,72px) clamp(20px,5vw,64px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
        gap: 'clamp(36px,4vw,48px)',
      }}>
        
        {/* Brand column */}
        <div style={{ gridColumn: 'span 1' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>
            <span style={{ fontFamily: F, fontWeight: 900, fontSize: 26, color: '#fff', letterSpacing: '-0.02em' }}>
              Trip<span style={{ color: SAF }}>Wise</span>
            </span>
          </Link>
          <p style={{
            color: 'rgba(255,255,255,0.38)', fontSize: 13, lineHeight: 1.85,
            maxWidth: 240, marginBottom: 28
          }}>
            India's first AI-powered trip planner. We turn your travel dreams into detailed,
            day-by-day itineraries — in seconds, for free.
          </p>
          
          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {[
              { Icon: MapPin, text: 'India — serving all 28 states' },
              { Icon: Phone, text: '+91 98765 43210' },
              { Icon: Mail, text: 'hello@tripwise.in' },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  flexShrink: 0, width: 30, height: 30, borderRadius: 8,
                  background: 'rgba(232,101,10,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={13} style={{ color: SAF }}/>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12, fontFamily: F }}>{text}</span>
              </div>
            ))}
          </div>
          
          {/* Social icons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {SOCIAL.map(({ Icon, href, label }, i) => (
              <a key={i} href={href} aria-label={label}
                 style={{
                   width: 38, height: 38, borderRadius: 10,
                   background: hovered === `soc${i}` ? SAF : 'rgba(255,255,255,0.06)',
                   border: `1px solid ${hovered === `soc${i}` ? SAF : 'rgba(255,255,255,0.1)'}`,
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   color: hovered === `soc${i}` ? '#fff' : 'rgba(255,255,255,0.4)',
                   textDecoration: 'none', transition: 'all 0.22s',
                 }}
                 onMouseEnter={() => setHovered(`soc${i}`)}
                 onMouseLeave={() => setHovered(null)}>
                <Icon size={15}/>
              </a>
            ))}
          </div>
        </div>
        
        {/* Nav columns */}
        {Object.entries(NAV).map(([section, items], si) => (
          <div key={section}>
            <h4 style={{
              fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.28)',
              textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 24
            }}>
              {section}
            </h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {items.map((item, i) => (
                <li key={i}>
                  <Link to={LINKS[section]?.[i] || '#'}
                        style={{
                          color: hovered === `${section}${i}` ? '#fff' : 'rgba(255,255,255,0.42)',
                          fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: F,
                          display: 'flex', alignItems: 'center', gap: 6,
                          transition: 'color 0.18s',
                        }}
                        onMouseEnter={() => setHovered(`${section}${i}`)}
                        onMouseLeave={() => setHovered(null)}>
                    {hovered === `${section}${i}` && (
                      <span style={{
                        display: 'inline-block', width: 14, height: 1.5,
                        background: SAF, borderRadius: 999, flexShrink: 0, transition: 'width 0.2s'
                      }}/>
                    )}
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        {/* Newsletter column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Sparkles size={13} style={{ color: SAF }}/>
            <h4 style={{
              fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.28)',
              textTransform: 'uppercase', letterSpacing: '0.22em'
            }}>
              Stay Updated
            </h4>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
            Flash sales, seasonal guides and AI travel tips — straight to your inbox.
          </p>
          
          {subbed ? (
            <div style={{
              background: 'rgba(232,101,10,0.12)', border: '1px solid rgba(232,101,10,0.3)',
              borderRadius: 16, padding: '16px 20px', textAlign: 'center',
            }}>
              <p style={{ color: SAF, fontWeight: 700, fontSize: 14, margin: 0 }}>
                ✓ You're subscribed!
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '4px 0 0' }}>
                Next deal lands in your inbox soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSub} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 14, padding: '13px 18px', color: '#fff', fontSize: 14, fontFamily: F,
                  outline: 'none', width: '100%', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = SAF}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button type="submit" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: SAF, color: '#fff', border: 'none', cursor: 'pointer',
                borderRadius: 14, padding: '13px 0',
                fontFamily: F, fontSize: 14, fontWeight: 700,
                transition: 'filter 0.18s',
                boxShadow: `0 4px 20px rgba(232,101,10,0.32)`,
              }}
                      onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.12)'}
                      onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}>
                Subscribe <ArrowRight size={15}/>
              </button>
            </form>
          )}
          
          {/* Trust note */}
          <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, marginTop: 14, lineHeight: 1.7 }}>
            No spam. Unsubscribe any time. We respect your privacy.
          </p>
        </div>
      </div>
      
      {/* ── BOTTOM BAR ── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(18px,3vw,28px) clamp(20px,5vw,64px)',
        maxWidth: '100%',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
        }}>
          {/* Copyright */}
          <p style={{
            color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.18em', margin: 0
          }}>
            © 2026 TripWise · Made with ♥ in India
          </p>
          
          {/* AI Active pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 999, padding: '8px 18px',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#22C55E', flexShrink: 0,
              boxShadow: '0 0 8px rgba(34,197,94,0.7)', animation: 'pulse 2s ease-in-out infinite',
            }}/>
            <span style={{
              color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: FM
            }}>
              AI Engine Operational
            </span>
          </div>
          
          {/* Edition tag */}
          <p style={{
            color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.18em', margin: 0
          }}>
            India Edition 🇮🇳
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @media (max-width: 640px) {
          footer .bottom-flex { flex-direction: column; align-items: center; text-align: center; }
        }
      `}</style>
    </footer>
  );
}