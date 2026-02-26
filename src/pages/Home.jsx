import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronDown,
  Compass,
  MapPin,
  Minus,
  Mountain,
  Plus,
  Sparkles,
  Star,
  TreePine,
  Users,
  Waves,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const FM = "'DM Mono', monospace";
const SAF = "#E8650A";
const SAF_BG = "#FDF0E6";
const INK = "#0E0A06";

const IMG = {
  hero: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=90",
  jaipur:
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80",
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
  kerala:
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
  ladakh:
    "https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=600&q=80",
  udaipur:
    "https://images.unsplash.com/photo-1695956353120-54ce5e91632b?q=80&w=735&auto=format&fit=crop",
  manali:
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
  rishikesh:
    "https://images.unsplash.com/photo-1718383538820-524dd564fd06?q=80&w=687&auto=format&fit=crop",
  hampi:
    "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?q=80&w=748&auto=format&fit=crop",
  statsBg:
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=80",
  promo:
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=90",
};

const POPULAR = [
  {
    id: 1,
    name: "Goa Beach Escape",
    location: "Goa, India",
    category: "Beaches",
    image: IMG.goa,
    price: "₹3,000–₹7,000",
    date: "Nov–Feb 2026",
    nights: 5,
  },
  {
    id: 2,
    name: "Ladakh High Altitude Trek",
    location: "Ladakh, India",
    category: "Adventure",
    image: IMG.ladakh,
    price: "₹5,000–₹12,000",
    date: "Jun–Sep 2025",
    nights: 7,
  },
  {
    id: 3,
    name: "Jaipur Heritage Walk",
    location: "Rajasthan, India",
    category: "Heritage",
    image: IMG.jaipur,
    price: "₹2,500–₹8,000",
    date: "Oct–Mar 2026",
    nights: 4,
  },
  {
    id: 4,
    name: "Kerala Backwater Cruise",
    location: "Kerala, India",
    category: "Nature",
    image: IMG.kerala,
    price: "₹3,500–₹10,000",
    date: "Sep–Mar 2026",
    nights: 6,
  },
];

const ALL_DEST = [
  {
    id: 1,
    name: "Jaipur",
    location: "Rajasthan",
    category: "Heritage",
    image: IMG.jaipur,
    price: "₹2,500",
    nights: 4,
  },
  {
    id: 2,
    name: "Goa",
    location: "Goa",
    category: "Beaches",
    image: IMG.goa,
    price: "₹3,000",
    nights: 5,
  },
  {
    id: 3,
    name: "Kerala",
    location: "Kerala",
    category: "Nature",
    image: IMG.kerala,
    price: "₹3,500",
    nights: 6,
  },
  {
    id: 4,
    name: "Ladakh",
    location: "Ladakh",
    category: "Adventure",
    image: IMG.ladakh,
    price: "₹5,000",
    nights: 7,
  },
  {
    id: 5,
    name: "Udaipur",
    location: "Rajasthan",
    category: "Heritage",
    image: IMG.udaipur,
    price: "₹4,000",
    nights: 3,
  },
  {
    id: 6,
    name: "Manali",
    location: "Himachal Pradesh",
    category: "Nature",
    image: IMG.manali,
    price: "₹3,200",
    nights: 5,
  },
  {
    id: 7,
    name: "Rishikesh",
    location: "Uttarakhand",
    category: "Adventure",
    image: IMG.rishikesh,
    price: "₹2,800",
    nights: 4,
  },
  {
    id: 8,
    name: "Hampi",
    location: "Karnataka",
    category: "Heritage",
    image: IMG.hampi,
    price: "₹1,800",
    nights: 3,
  },
];

const MOMENTS = [
  IMG.goa,
  IMG.jaipur,
  IMG.kerala,
  IMG.ladakh,
  IMG.manali,
  IMG.rishikesh,
  IMG.udaipur,
  IMG.hampi,
];

const FAQS = [
  {
    q: "Can I change or cancel my trip after booking?",
    a: "Cancellations made 48+ hours before departure receive a 100% refund. Within 48 hours we issue travel credits valid 12 months.",
  },
  {
    q: "Does TripWise offer group travel options?",
    a: "Groups of 6+ get curated Heritage and Adventure packages at discounted rates. Contact our team for a custom quote.",
  },
  {
    q: "How do I get travel support during my trip?",
    a: "Every booking includes 24/7 WhatsApp support and an emergency contact number for your destination.",
  },
  {
    q: "Can I save destinations to plan later?",
    a: "Create a free account and bookmark any destination — we'll keep it safe until you're ready.",
  },
  {
    q: "Does TripWise offer special deals or discounts?",
    a: "Seasonal flash sales and early-bird offers are shared via email. Subscribe to never miss a deal.",
  },
];

const CAT_STYLE = {
  Heritage: { bg: "#FDF0E6", color: SAF },
  Beaches: { bg: "#E0F7F5", color: "#0D9488" },
  Nature: { bg: "#DCFCE7", color: "#16A34A" },
  Adventure: { bg: "#FEF3C7", color: "#D97706" },
};
const CAT_ICONS = {
  Heritage: Building2,
  Beaches: Waves,
  Nature: TreePine,
  Adventure: Mountain,
};

// ── Parallax ──────────────────────────────────────────────────────────────────
function useParallax(factor = 0.3) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const fn = () => setOffset(window.scrollY * factor);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [factor]);
  return offset;
}

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          ob.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function Reveal({ children, delay = 0, up = 32, style = {} }) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : `translateY(${up}px)`,
        transition: `opacity 0.72s ease ${delay}s, transform 0.72s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Animated stat counter ─────────────────────────────────────────────────────
function AnimStat({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [ref, vis] = useReveal();
  useEffect(() => {
    if (!vis) return;
    const n = parseFloat(target);
    const dur = 1800;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(n * e * 10) / 10);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [vis, target]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

// ── Guest selector ────────────────────────────────────────────────────────────
function GuestSelector() {
  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const label =
    children > 0
      ? `${adults} Adult${adults !== 1 ? "s" : ""}, ${children} Child${children !== 1 ? "ren" : ""}`
      : `${adults} Adult${adults !== 1 ? "s" : ""}`;
  const Ctr = ({ value, onInc, onDec, min = 0 }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button
        onClick={onDec}
        disabled={value <= min}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid #E5E7EB",
          background: value <= min ? "#F9FAFB" : "#fff",
          cursor: value <= min ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: value <= min ? "#D1D5DB" : "#111",
          flexShrink: 0,
        }}
      >
        <Minus size={13} />
      </button>
      <span
        style={{
          fontFamily: FM,
          fontWeight: 700,
          fontSize: 16,
          color: "#111",
          minWidth: 22,
          textAlign: "center",
        }}
      >
        {value}
      </span>
      <button
        onClick={onInc}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid #E5E7EB",
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#111",
          flexShrink: 0,
          transition: "border-color 0.18s, background 0.18s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = SAF;
          e.currentTarget.style.background = SAF_BG;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#E5E7EB";
          e.currentTarget.style.background = "#fff";
        }}
      >
        <Plus size={13} />
      </button>
    </div>
  );
  return (
    <div
      ref={ref}
      style={{ position: "relative", flex: "1 1 140px", minWidth: 0 }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 14px",
          width: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Users
          size={15}
          style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }}
        />
        <span
          style={{
            color: "rgba(255,255,255,0.82)",
            fontSize: 13,
            flex: 1,
            textAlign: "left",
            fontFamily: F,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </span>
        <ChevronDown
          size={12}
          style={{
            color: "rgba(255,255,255,0.4)",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: 260,
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
            border: "1px solid #F3F4F6",
            padding: 22,
            zIndex: 400,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -6,
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: 12,
              height: 12,
              background: "#fff",
              border: "1px solid #F3F4F6",
              borderBottom: "none",
              borderRight: "none",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: 2,
                  fontFamily: F,
                }}
              >
                Adults
              </p>
              <p style={{ fontSize: 11, color: "#9CA3AF", fontFamily: F }}>
                Age 13+
              </p>
            </div>
            <Ctr
              value={adults}
              onInc={() => setAdults((v) => v + 1)}
              onDec={() => setAdults((v) => Math.max(1, v - 1))}
              min={1}
            />
          </div>
          <div style={{ height: 1, background: "#F3F4F6", marginBottom: 18 }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 22,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: 2,
                  fontFamily: F,
                }}
              >
                Children
              </p>
              <p style={{ fontSize: 11, color: "#9CA3AF", fontFamily: F }}>
                Age 2–12
              </p>
            </div>
            <Ctr
              value={children}
              onInc={() => setChildren((v) => v + 1)}
              onDec={() => setChildren((v) => Math.max(0, v - 1))}
            />
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              width: "100%",
              background: "#111",
              color: "#fff",
              borderRadius: 999,
              padding: "11px 0",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: F,
              border: "none",
              cursor: "pointer",
              transition: "background 0.18s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = SAF)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

function SectionHead({ eyebrow, title, sub, center = true }) {
  return (
    <div
      style={{
        textAlign: center ? "center" : "left",
        marginBottom: "clamp(32px,4vw,52px)",
      }}
    >
      {eyebrow && (
        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: SAF,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            marginBottom: 10,
          }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        style={{
          fontWeight: 900,
          fontSize: "clamp(1.8rem,3.8vw,2.7rem)",
          color: INK,
          lineHeight: 1.12,
          marginBottom: sub ? 10 : 0,
          fontFamily: F,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            color: "#9CA3AF",
            fontSize: 15,
            maxWidth: 500,
            margin: center ? "0 auto" : "0",
            lineHeight: 1.75,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [filter, setFilter] = useState("All");
  const [activeFaq, setActiveFaq] = useState(null);
  const [query, setQuery] = useState("");
  const [hovCard, setHovCard] = useState(null);
  const parallaxY = useParallax(0.26);

  const filtered = useMemo(
    () =>
      ALL_DEST.filter(
        (d) =>
          (filter === "All" || d.category === filter) &&
          d.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [filter, query],
  );

  return (
    <div
      style={{
        fontFamily: F,
        color: INK,
        background: "#FDFAF7",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <Navbar transparent />

      {/* ══════════════════════════════════════════════════
          1. HERO — cinematic parallax
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          alignItems: "flex-end",
          paddingBottom: "clamp(48px,7vw,96px)",
        }}
      >
        {/* Parallax background */}
        <div
          style={{
            position: "absolute",
            inset: "-20% 0 -5%",
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          <img
            src={IMG.hero}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translateY(${parallaxY}px)`,
              willChange: "transform",
            }}
          />
        </div>

        {/* Gradient layers */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(to bottom, rgba(5,2,10,0.18) 0%, rgba(5,2,10,0.02) 30%, rgba(5,2,10,0.6) 68%, rgba(5,2,10,0.94) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "radial-gradient(ellipse at 75% 15%, rgba(232,101,10,0.2) 0%, transparent 50%)",
          }}
        />

        {/* Floating badge — desktop only */}
        <div
          style={{
            position: "absolute",
            top: "24%",
            right: "clamp(16px,6vw,80px)",
            zIndex: 3,
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(16px)",
            borderRadius: 18,
            padding: "14px 18px",
            boxShadow: "0 8px 40px rgba(14,10,6,0.2)",
            border: "1px solid rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            animation: "floatA 4s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: `linear-gradient(135deg,${SAF},#F97316)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Star size={16} fill="#fff" color="#fff" />
          </div>
          <div>
            <p
              style={{
                fontFamily: FM,
                fontSize: 13,
                fontWeight: 800,
                color: INK,
                margin: 0,
              }}
            >
              4.9 / 5.0
            </p>
            <p
              style={{
                fontFamily: F,
                fontSize: 11,
                color: "#9CA3AF",
                margin: 0,
              }}
            >
              44K+ happy trips
            </p>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: "42%",
            left: "clamp(16px,5vw,60px)",
            zIndex: 3,
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(16px)",
            borderRadius: 999,
            padding: "10px 20px",
            boxShadow: "0 6px 28px rgba(14,10,6,0.16)",
            display: "flex",
            gap: 8,
            alignItems: "center",
            animation: "floatB 5s ease-in-out infinite",
          }}
        >
          <Sparkles size={14} style={{ color: SAF }} />
          <span
            style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: INK }}
          >
            AI plans in 15 sec
          </span>
        </div>

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 1060,
            margin: "0 auto",
            padding: "80px clamp(20px,5vw,48px) 0",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(232,101,10,0.18)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(232,101,10,0.4)",
              borderRadius: 999,
              padding: "7px 18px",
              marginBottom: 22,
              animation: "fadeSlideDown 0.8s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: SAF,
                display: "inline-block",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.92)",
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}
            >
              AI-Powered Trip Planning
            </span>
          </div>

          <h1
            style={{
              fontWeight: 900,
              color: "#fff",
              lineHeight: 0.92,
              fontSize: "clamp(2.8rem,9vw,7rem)",
              textShadow: "0 2px 40px rgba(0,0,0,0.35)",
              marginBottom: "clamp(14px,2vw,20px)",
              fontFamily: F,
              animation:
                "fadeSlideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both",
            }}
          >
            Find your next
            <br />
            unforgettable trip
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.68)",
              fontSize: "clamp(0.9rem,1.8vw,1.08rem)",
              maxWidth: 460,
              marginBottom: "clamp(28px,4vw,40px)",
              lineHeight: 1.8,
              animation:
                "fadeSlideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both",
            }}
          >
            Discover hidden gems, ancient forts, pristine beaches — all across
            India, planned by AI in seconds.
          </p>

          {/* Search bar */}
          <div
            style={{
              width: "100%",
              maxWidth: 940,
              background: "rgba(255,255,255,0.11)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "clamp(20px,3vw,999px)",
              boxShadow: "0 8px 52px rgba(0,0,0,0.32)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              padding: "clamp(5px,0.8vw,7px)",
              gap: 0,
              animation:
                "fadeSlideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 14px",
                flex: "1 1 120px",
                minWidth: 0,
              }}
            >
              <MapPin
                size={15}
                style={{ color: "rgba(255,255,255,0.45)", flexShrink: 0 }}
              />
              <input
                type="text"
                placeholder="Where to next?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: 13,
                  width: "100%",
                  fontFamily: F,
                  caretColor: SAF,
                  minWidth: 0,
                }}
              />
            </div>
            <div className="tw-div" />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 14px",
                flex: "1 1 120px",
                minWidth: 0,
              }}
            >
              <Calendar
                size={15}
                style={{ color: "rgba(255,255,255,0.45)", flexShrink: 0 }}
              />
              <input
                type="date"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "rgba(255,255,255,0.58)",
                  fontSize: 13,
                  colorScheme: "dark",
                  fontFamily: F,
                  width: "100%",
                  minWidth: 0,
                }}
              />
            </div>
            <div className="tw-div" />
            <GuestSelector />
            <Link
              to="/planner"
              style={{
                flexShrink: 0,
                padding: "clamp(4px,0.6vw,5px)",
                display: "block",
              }}
            >
              <button
                style={{
                  background: SAF,
                  color: "#fff",
                  borderRadius: 999,
                  padding: "12px clamp(18px,3vw,28px)",
                  fontSize: 13,
                  fontWeight: 800,
                  fontFamily: F,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: `0 4px 22px rgba(232,101,10,0.55)`,
                  whiteSpace: "nowrap",
                  transition: "filter 0.18s, transform 0.18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.12)";
                  e.currentTarget.style.transform = "scale(1.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                Find my trip
              </button>
            </Link>
          </div>

          {/* Trust pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(12px,3vw,24px)",
              marginTop: 16,
              flexWrap: "wrap",
              justifyContent: "center",
              animation:
                "fadeSlideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.45s both",
            }}
          >
            {["Free to plan", "No sign-up needed", "Ready in 15 sec"].map(
              (t, i) => (
                <span
                  key={i}
                  style={{
                    color: "rgba(255,255,255,0.38)",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.25)",
                      display: "inline-block",
                    }}
                  />
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. POPULAR TRIPS
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#fff",
          padding: "clamp(56px,8vw,96px) clamp(20px,4vw,48px)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <SectionHead
              eyebrow="Trending Now"
              title="Our Popular Trips"
              sub="Discover where travellers are heading this season — from popular escapes to offbeat adventures"
            />
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
              gap: "clamp(20px,3vw,28px)",
            }}
          >
            {POPULAR.map((dest, idx) => {
              const cs = CAT_STYLE[dest.category] || {
                bg: "#F3F4F6",
                color: "#374151",
              };
              const CatIcon = CAT_ICONS[dest.category] || Compass;
              const isHov = hovCard === `p${dest.id}`;
              return (
                <Reveal key={dest.id} delay={idx * 0.08}>
                  <div
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovCard(`p${dest.id}`)}
                    onMouseLeave={() => setHovCard(null)}
                  >
                    <div
                      style={{
                        position: "relative",
                        borderRadius: 24,
                        aspectRatio: "3/4",
                        overflow: "hidden",
                        marginBottom: 16,
                        transform: isHov ? "scale(1.02)" : "scale(1)",
                        transition:
                          "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                        boxShadow: isHov
                          ? "0 24px 56px rgba(14,10,6,0.22)"
                          : "0 4px 20px rgba(14,10,6,0.08)",
                      }}
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transform: isHov ? "scale(1.08)" : "scale(1)",
                          transition: "transform 0.65s ease",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(14,10,6,0.58) 0%, transparent 55%)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 14,
                          left: 14,
                          background: cs.bg,
                          borderRadius: 999,
                          padding: "5px 12px",
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: cs.color,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <CatIcon size={9} /> {dest.category}
                      </div>
                      <div
                        style={{ position: "absolute", bottom: 14, left: 14 }}
                      >
                        <span
                          style={{
                            fontFamily: FM,
                            fontSize: 13,
                            fontWeight: 900,
                            color: "#fff",
                          }}
                        >
                          {dest.nights}n
                        </span>
                        <span
                          style={{
                            fontFamily: F,
                            fontSize: 10,
                            color: "rgba(255,255,255,0.55)",
                            marginLeft: 3,
                          }}
                        >
                          trip
                        </span>
                      </div>
                    </div>
                    <p
                      style={{
                        color: "#9CA3AF",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        marginBottom: 4,
                      }}
                    >
                      {dest.location}
                    </p>
                    <h3
                      style={{
                        fontWeight: 800,
                        fontSize: "1.05rem",
                        color: INK,
                        marginBottom: 8,
                        fontFamily: F,
                      }}
                    >
                      {dest.name}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        marginBottom: 14,
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ color: "#9CA3AF", fontSize: 12 }}>
                        📅 {dest.date}
                      </span>
                      <span style={{ color: "#9CA3AF", fontSize: 12 }}>
                        🌙 {dest.nights} nights
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontFamily: FM,
                            fontWeight: 800,
                            fontSize: 17,
                            color: INK,
                          }}
                        >
                          {dest.price}
                        </span>
                        <span
                          style={{
                            color: "#9CA3AF",
                            fontSize: 11,
                            marginLeft: 4,
                          }}
                        >
                          / person
                        </span>
                      </div>
                      {/* ✅ correct route: /planner */}
                      <Link to="/planner" style={{ textDecoration: "none" }}>
                        <button
                          style={{
                            background: INK,
                            color: "#fff",
                            borderRadius: 999,
                            padding: "9px 20px",
                            fontSize: 12,
                            fontWeight: 700,
                            fontFamily: F,
                            border: "none",
                            cursor: "pointer",
                            transition: "background 0.18s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = SAF)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = INK)
                          }
                        >
                          Book Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          {/* Pagination dots */}
          <Reveal delay={0.1}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 44,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 8,
                  borderRadius: 999,
                  background: INK,
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "#E5E7EB",
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3. VALUE PROP
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#FDFAF7",
          borderTop: "1px solid #F0EBE5",
          borderBottom: "1px solid #F0EBE5",
          padding: "clamp(56px,7vw,88px) clamp(20px,4vw,48px)",
        }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 800,
                marginBottom: 18,
              }}
            >
              Travel made simple, stories made unforgettable
            </p>
            <h2
              style={{
                fontWeight: 900,
                fontSize: "clamp(1.9rem,4.5vw,3.2rem)",
                color: INK,
                lineHeight: 1.14,
                marginBottom: 40,
                fontFamily: F,
              }}
            >
              We make planning effortless so you can focus on what really
              matters
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: 40,
              }}
            >
              {[
                { icon: "⚡", label: "15-second itineraries" },
                { icon: "🗺️", label: "50+ destinations" },
                { icon: "💰", label: "All budget tiers" },
                { icon: "📱", label: "24/7 trip support" },
              ].map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#fff",
                    border: "1.5px solid #F0EBE5",
                    borderRadius: 999,
                    padding: "10px 18px",
                    fontFamily: F,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    boxShadow: "0 2px 8px rgba(14,10,6,0.05)",
                    transition: "border-color 0.18s, transform 0.18s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = SAF;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#F0EBE5";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <span>{f.icon}</span> {f.label}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ display: "flex" }}>
                {[
                  { bg: `linear-gradient(135deg,${SAF},#F97316)`, l: "P" },
                  { bg: "linear-gradient(135deg,#1A7F74,#0D9488)", l: "R" },
                  { bg: "linear-gradient(135deg,#1D4ED8,#3B82F6)", l: "A" },
                  { bg: "linear-gradient(135deg,#7C3AED,#A855F7)", l: "M" },
                ].map((a, i) => (
                  <div
                    key={i}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: "2.5px solid #FDFAF7",
                      marginLeft: i > 0 ? -12 : 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 900,
                      background: a.bg,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.16)",
                    }}
                  >
                    {a.l}
                  </div>
                ))}
              </div>
              <p style={{ color: "#6B7280", fontSize: 14 }}>
                Trusted by <strong style={{ color: INK }}>44,000+</strong>{" "}
                travellers across India
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. STATS — animated ticket blocks with parallax
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          padding: "clamp(64px,8vw,100px) clamp(20px,4vw,48px)",
          overflow: "hidden",
        }}
      >
        <div
          style={{ position: "absolute", inset: "-20% 0", overflow: "hidden" }}
        >
          <img
            src={IMG.statsBg}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.35) saturate(0.6)",
              transform: `translateY(${parallaxY * 0.45}px)`,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(5,2,10,0.38)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          <Reveal>
            <p
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.42)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                fontWeight: 800,
                marginBottom: 48,
              }}
            >
              Trusted by thousands of travellers just like you
            </p>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%,240px), 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                stat: "44",
                suffix: "K+",
                label: "Happy explorers\nplanned with us",
              },
              {
                stat: "50",
                suffix: "+",
                label: "Destinations across\nincredible India",
              },
              {
                stat: "30",
                suffix: "%",
                label: "Users who return for\ntheir next adventure",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "clamp(32px,4vw,44px) 24px",
                    textAlign: "center",
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 24,
                    boxShadow: "0 4px 32px rgba(0,0,0,0.3)",
                    transition: "transform 0.3s, background 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: -14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "rgba(5,2,10,0.6)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: -14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "rgba(5,2,10,0.6)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "40%",
                      left: 32,
                      right: 32,
                      borderTop: "1px dashed rgba(255,255,255,0.1)",
                    }}
                  />
                  <p
                    style={{
                      fontWeight: 900,
                      fontSize: "clamp(2.8rem,6vw,4rem)",
                      color: "#fff",
                      lineHeight: 1,
                      marginBottom: 12,
                      fontFamily: F,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <AnimStat target={item.stat} suffix={item.suffix} />
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: 13,
                      fontWeight: 500,
                      lineHeight: 1.65,
                      whiteSpace: "pre-line",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {item.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. DISCOVER INDIA — horizontal scroll strip
      ══════════════════════════════════════════════════ */}
      <section
        style={{ background: "#fff", padding: "clamp(56px,8vw,96px) 0" }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 clamp(20px,4vw,40px)",
          }}
        >
          <Reveal>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 20,
                marginBottom: 40,
              }}
            >
              <div>
                <h2
                  style={{
                    fontWeight: 900,
                    fontSize: "clamp(1.9rem,4vw,3rem)",
                    color: INK,
                    marginBottom: 4,
                    fontFamily: F,
                  }}
                >
                  Discover India
                </h2>
                <p style={{ color: "#9CA3AF", fontSize: 15 }}>
                  Every traveller finds their perfect India here
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#F9FAFB",
                  border: "1px solid #F0EBE5",
                  borderRadius: 999,
                  padding: "4px 5px",
                  gap: 2,
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                  flexShrink: 0,
                  maxWidth: "100%",
                  scrollbarWidth: "none",
                }}
              >
                {["All", "Heritage", "Beaches", "Nature", "Adventure"].map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{
                        padding: "8px clamp(10px,2vw,20px)",
                        borderRadius: 999,
                        background: filter === f ? INK : "transparent",
                        color: filter === f ? "#fff" : "#6B7280",
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: F,
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {f}
                    </button>
                  ),
                )}
              </div>
            </div>
          </Reveal>
          <div
            style={{
              display: "flex",
              gap: 18,
              overflowX: "auto",
              paddingBottom: 20,
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          >
            {filtered.map((dest, idx) => {
              const cs = CAT_STYLE[dest.category] || {
                bg: "#F3F4F6",
                color: "#374151",
              };
              const CatIcon = CAT_ICONS[dest.category] || Compass;
              const isHov = hovCard === `d${dest.id}`;
              return (
                <div
                  key={dest.id}
                  onMouseEnter={() => setHovCard(`d${dest.id}`)}
                  onMouseLeave={() => setHovCard(null)}
                  style={{
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                    width: "clamp(185px,22vw,250px)",
                    cursor: "pointer",
                    transform: isHov ? "translateY(-6px)" : "none",
                    transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 28,
                      aspectRatio: "3/4",
                      overflow: "hidden",
                      marginBottom: 14,
                      boxShadow: isHov
                        ? "0 20px 48px rgba(14,10,6,0.2)"
                        : "0 4px 16px rgba(14,10,6,0.08)",
                      transition: "box-shadow 0.35s",
                    }}
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transform: isHov ? "scale(1.09)" : "scale(1)",
                        transition: "transform 0.65s ease",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(14,10,6,0.52) 0%, transparent 55%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        background: cs.bg,
                        borderRadius: 999,
                        padding: "5px 12px",
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: cs.color,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <CatIcon size={9} /> {dest.category}
                    </div>
                    {/* ✅ correct route: /destinations (list page) */}
                    <Link to="/destinations" style={{ textDecoration: "none" }}>
                      <div
                        style={{
                          position: "absolute",
                          bottom: 14,
                          right: 14,
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: isHov ? SAF : "rgba(14,10,6,0.48)",
                          backdropFilter: "blur(8px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          transition: "all 0.22s",
                          transform: isHov
                            ? "scale(1.1) rotate(-45deg)"
                            : "scale(1) rotate(0deg)",
                        }}
                      >
                        <ArrowRight size={14} />
                      </div>
                    </Link>
                  </div>
                  <p
                    style={{
                      color: "#9CA3AF",
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      marginBottom: 3,
                    }}
                  >
                    {dest.location}
                  </p>
                  <h3
                    style={{
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: INK,
                      marginBottom: 6,
                      fontFamily: F,
                    }}
                  >
                    {dest.name}
                  </h3>
                  <span
                    style={{
                      fontFamily: FM,
                      fontWeight: 900,
                      fontSize: 16,
                      color: INK,
                    }}
                  >
                    {dest.price}
                    <span
                      style={{
                        fontFamily: F,
                        fontWeight: 400,
                        fontSize: 11,
                        color: "#9CA3AF",
                        marginLeft: 4,
                      }}
                    >
                      / person
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. MOMENTS — auto-scroll strip
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#FDFAF7",
          padding: "clamp(56px,8vw,96px) 0",
          overflow: "hidden",
        }}
      >
        <Reveal>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 clamp(20px,4vw,40px)",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            <p
              style={{
                color: "#9CA3AF",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              Real stories from our travellers
            </p>
            <h2
              style={{
                fontWeight: 900,
                fontSize: "clamp(1.7rem,4vw,2.8rem)",
                color: INK,
                fontFamily: F,
              }}
            >
              Moments that made every journey{" "}
              <em style={{ fontStyle: "italic", color: SAF }}>unforgettable</em>
            </h2>
          </div>
        </Reveal>
        <div
          style={{
            display: "flex",
            gap: 16,
            animation: "autoScroll 28s linear infinite",
            width: "max-content",
            paddingLeft: "clamp(16px,3vw,24px)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.animationPlayState = "running")
          }
        >
          {[...MOMENTS, ...MOMENTS].map((img, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: "clamp(140px,17vw,210px)",
                height: "clamp(180px,22vw,270px)",
                borderRadius: 22,
                overflow: "hidden",
                transition: "transform 0.4s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <img
                src={img}
                alt=""
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
        <Reveal>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <button
              style={{
                padding: "12px 32px",
                border: "1.5px solid #E5E7EB",
                borderRadius: 999,
                color: "#374151",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: F,
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = INK;
                e.currentTarget.style.color = INK;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.color = "#374151";
              }}
            >
              See more together
            </button>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
          7. FAQ — smooth accordion
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#fff",
          padding: "clamp(56px,8vw,96px) clamp(20px,4vw,48px)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal>
            <SectionHead
              eyebrow="Support"
              title="Frequently Asked Questions"
              sub="Got questions before booking? We have you covered."
            />
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div
                  style={{
                    borderRadius: 20,
                    border: `1.5px solid ${activeFaq === i ? SAF : "#F0EBE5"}`,
                    overflow: "hidden",
                    boxShadow:
                      activeFaq === i
                        ? `0 4px 24px rgba(232,101,10,0.12)`
                        : "0 1px 4px rgba(14,10,6,0.03)",
                    transition: "border-color 0.22s, box-shadow 0.22s",
                  }}
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    style={{
                      width: "100%",
                      padding: "clamp(16px,2vw,20px) clamp(18px,3vw,28px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        color: activeFaq === i ? SAF : INK,
                        fontWeight: 600,
                        fontSize: "clamp(13px,1.8vw,15px)",
                        fontFamily: F,
                        flex: 1,
                      }}
                    >
                      {faq.q}
                    </span>
                    <div
                      style={{
                        flexShrink: 0,
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: activeFaq === i ? SAF : "#F3F4F6",
                        color: activeFaq === i ? "#fff" : "#374151",
                        transition: "all 0.22s",
                        transform: activeFaq === i ? "rotate(45deg)" : "none",
                      }}
                    >
                      <Plus size={13} />
                    </div>
                  </button>
                  <div
                    style={{
                      maxHeight: activeFaq === i ? 200 : 0,
                      overflow: "hidden",
                      transition:
                        "max-height 0.38s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <div
                      style={{
                        padding: `0 clamp(18px,3vw,28px) clamp(16px,2vw,22px)`,
                        color: "#6B7280",
                        fontSize: 14,
                        lineHeight: 1.78,
                        fontFamily: F,
                      }}
                    >
                      {faq.a}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <button
                style={{
                  background: INK,
                  color: "#fff",
                  borderRadius: 999,
                  padding: "14px 36px",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: F,
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.18s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = SAF)}
                onMouseLeave={(e) => (e.currentTarget.style.background = INK)}
              >
                Explore more questions
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          8. PROMO BANNER — parallax image
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#fff",
          padding: `0 clamp(20px,4vw,48px) clamp(56px,8vw,96px)`,
        }}
      >
        <Reveal>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              position: "relative",
              borderRadius: "clamp(24px,4vw,44px)",
              overflow: "hidden",
              minHeight: "clamp(300px,42vw,460px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <img
              src={IMG.promo}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `translateY(${parallaxY * 0.18}px)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(5,2,10,0.28) 0%, rgba(5,2,10,0.8) 100%)",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 10,
                padding: "clamp(40px,6vw,72px) clamp(24px,4vw,48px)",
                maxWidth: 680,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(232,101,10,0.28)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(232,101,10,0.5)",
                  borderRadius: 999,
                  padding: "8px 24px",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  marginBottom: 22,
                }}
              >
                Limited Time
              </span>
              <h2
                style={{
                  fontWeight: 900,
                  fontSize: "clamp(2.2rem,6vw,4.5rem)",
                  color: "#fff",
                  lineHeight: 1.0,
                  marginBottom: 18,
                  textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                  fontFamily: F,
                }}
              >
                Limited Time
                <br />
                Travel Promo
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "clamp(14px,1.8vw,16px)",
                  marginBottom: 36,
                  fontFamily: F,
                  lineHeight: 1.8,
                }}
              >
                Only the best of India waits for you. Plan your perfect trip in
                seconds — free, no sign-up required.
              </p>
              {/* ✅ correct route: /planner */}
              <Link to="/planner" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    background: "#fff",
                    color: INK,
                    borderRadius: 999,
                    padding: "clamp(14px,2vw,18px) clamp(32px,5vw,52px)",
                    fontSize: "clamp(14px,1.8vw,16px)",
                    fontWeight: 900,
                    fontFamily: F,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
                    transition: "transform 0.18s, box-shadow 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 14px 40px rgba(0,0,0,0.36)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(0,0,0,0.28)";
                  }}
                >
                  Book My Trip
                </button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity:0; transform:translateY(-18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(26px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes floatA {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-10px); }
        }
        @keyframes floatB {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-7px); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.55; transform:scale(0.82); }
        }
        @keyframes autoScroll {
          from { transform:translateX(0); }
          to   { transform:translateX(-50%); }
        }
        *::-webkit-scrollbar { display:none; }
        .tw-div {
          width:1px; height:26px;
          background:rgba(255,255,255,0.16);
          flex-shrink:0; align-self:center;
        }
        @media (max-width:580px) {
          .tw-div { display:none !important; }
        }
        /* Hide floating hero badges on small screens */
        @media (max-width:768px) {
          section > div[style*="floatA"],
          section > div[style*="floatB"] { display:none !important; }
        }
        input::placeholder { color:rgba(255,255,255,0.38); }
      `}</style>
    </div>
  );
}
