import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  ChevronRight,
  Clock,
  Globe,
  Leaf,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDestinationRestaurants,
  fetchDestinationRestaurants,
  selectDestinationLoading,
  selectDestinationRestaurants,
} from "../store";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";

// ── Design tokens
const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const FM = "'DM Mono', monospace";
const SAF = "#E8650A";
const SAF_BG = "#FDF0E6";
const INK = "#0E0A06";

const fadeUp = (d = 0) => ({
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  },
});
const cardV = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};
const gridC = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

// ── Constants
const PRICE_RANGES = ["All", "Budget", "Mid-Range", "Premium"];
const PRICE_MAP = {
  budget: "Budget",
  mid: "Mid-Range",
  "mid-range": "Mid-Range",
  premium: "Premium",
};
const PRICE_CLR = { Budget: "#16A34A", "Mid-Range": SAF, Premium: "#9333EA" };
const PRICE_BG = { Budget: "#DCFCE7", "Mid-Range": SAF_BG, Premium: "#F5F3FF" };

const POPULAR = [
  "Goa",
  "Jaipur",
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Udaipur",
  "Manali",
  "Rishikesh",
  "Varanasi",
  "Kolkata",
  "Kochi",
  "Pune",
  "Ahmedabad",
  "Chandigarh",
  "Pondicherry",
];

const STATIC_RESTAURANTS = [
  {
    _id: "s1",
    name: "LMB (Laxmi Misthan Bhandar)",
    city: "Jaipur",
    cuisineType: "Rajasthani",
    priceRange: "budget",
    pricePerPerson: 350,
    isVeg: true,
    rating: 4.7,
    reviewCount: 3400,
    imageUrl:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=80",
    mustTryDishes: ["Dal Baati Churma", "Ghevar", "Mawa Kachori"],
    description:
      "A legendary 70-year-old sweet shop turned full restaurant. The dal baati churma is unmissable.",
    website: "https://www.lmbjaipur.com/",
    phone: "+91 141 256 5844",
    openTime: "8:00 AM",
    closeTime: "11:00 PM",
  },
  {
    _id: "s2",
    name: "Fisherman's Wharf",
    city: "Goa",
    cuisineType: "Seafood",
    priceRange: "mid",
    pricePerPerson: 800,
    isVeg: false,
    rating: 4.6,
    reviewCount: 1800,
    imageUrl:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80",
    mustTryDishes: ["Prawn Balchaon", "Fish Curry Rice", "Crab Masala"],
    description:
      "Waterside Goan seafood at its freshest — the fish is caught that morning and grilled to perfection.",
    openTime: "12:00 PM",
    closeTime: "10:30 PM",
  },
  {
    _id: "s3",
    name: "Thalassa",
    city: "Goa",
    cuisineType: "Greek-Goan Fusion",
    priceRange: "premium",
    pricePerPerson: 1200,
    isVeg: false,
    rating: 4.8,
    reviewCount: 2200,
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80",
    mustTryDishes: ["Moussaka", "Fresh Calamari", "Grilled Branzino"],
    description:
      "Clifftop Greek dining above the Arabian Sea. Sunsets here are the stuff of travel legends.",
    openTime: "5:00 PM",
    closeTime: "11:30 PM",
  },
  {
    _id: "s4",
    name: "Ambrai Restaurant",
    city: "Udaipur",
    cuisineType: "Rajasthani",
    priceRange: "premium",
    pricePerPerson: 1200,
    isVeg: false,
    rating: 4.8,
    reviewCount: 1500,
    imageUrl:
      "https://images.unsplash.com/photo-1515511856280-7b23f68d2996?auto=format&fit=crop&w=700&q=80",
    mustTryDishes: ["Laal Maas", "Dal Kachori", "Ker Sangri"],
    description:
      "Floating lanterns, Lake Pichola views, and the finest Rajasthani cooking. Book ahead.",
    openTime: "12:00 PM",
    closeTime: "10:00 PM",
  },
  {
    _id: "s5",
    name: "Karavalli",
    city: "Bengaluru",
    cuisineType: "Coastal Karnataka",
    priceRange: "premium",
    pricePerPerson: 1500,
    isVeg: false,
    rating: 4.9,
    reviewCount: 2800,
    imageUrl:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80",
    mustTryDishes: ["Neer Dosa", "Kane Rava Fry", "Crab Ghee Roast"],
    description:
      "The definitive coastal Karnataka dining experience — fresh catches cooked with ancient family recipes.",
    openTime: "12:30 PM",
    closeTime: "10:30 PM",
  },
  {
    _id: "s6",
    name: "Chokhi Dhani",
    city: "Jaipur",
    cuisineType: "Rajasthani Village",
    priceRange: "mid",
    pricePerPerson: 900,
    isVeg: true,
    rating: 4.7,
    reviewCount: 5600,
    imageUrl:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=700&q=80",
    mustTryDishes: ["Unlimited Thali", "Bajra Roti", "Ker Sangri"],
    description:
      "A full cultural village experience — folk music, camel rides, and an unlimited thali.",
    website: "https://www.chokhidhani.com/",
    openTime: "5:00 PM",
    closeTime: "11:00 PM",
  },
];

// ── Helpers
const toArray = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v.trim())
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
};

const normalisePrice = (p) => {
  const s = (p || "").toLowerCase();
  if (s.includes("budget") || s.includes("cheap") || s.includes("low"))
    return "Budget";
  if (s.includes("premium") || s.includes("luxury") || s.includes("fine"))
    return "Premium";
  return "Mid-Range";
};

// ── Link builder — zero affiliation
const buildLinks = (r, city) => {
  const name = r?.name || "";
  const dest = r?.city || r.destination?.name || city || "";
  const destSlug = dest.toLowerCase().replace(/\s+/g, "-");
  const restQ = encodeURIComponent(`${name} restaurant ${dest}`);
  const zomatoQ = encodeURIComponent(`${name} ${dest} zomato`);
  const swiggyQ = encodeURIComponent(`${name} ${dest} swiggy`);
  const mapsQ = encodeURIComponent(`${name} restaurant ${dest}`);
  return {
    official: r.website || null,
    phone: r.phone || null,
    // Zomato: use direct listing if we have it, else their city restaurants page
    // The /search?q= endpoint is broken — city page is the correct fallback
    zomato: r.zomatoUrl || `https://www.zomato.com/${destSlug}/restaurants`,
    // Swiggy: city page is reliable; /search?query= doesn't work as a URL
    swiggy: r.swiggyUrl || `https://www.swiggy.com/city/${destSlug}`,
    // Maps: coordinates if available, else text search
    maps:
      r.mapLat && r.mapLng
        ? `https://www.google.com/maps?q=${r.mapLat},${r.mapLng}`
        : `https://www.google.com/maps/search/?api=1&query=${mapsQ}`,
    // Find on Zomato/Swiggy via Google (most reliable restaurant-specific search)
    google: `https://www.google.com/search?q=${restQ}`,
    // Direct Google links for finding on each platform
    onZomato: `https://www.google.com/search?q=${zomatoQ}`,
    onSwiggy: `https://www.google.com/search?q=${swiggyQ}`,
  };
};

// ── Sub-components ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp(delay)}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 24,
        overflow: "hidden",
        background: "#fff",
        border: "1px solid #F0EBE5",
      }}
    >
      <motion.div
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        style={{
          height: 200,
          background: "linear-gradient(90deg,#F5EFE8,#EDE7DC,#F5EFE8)",
        }}
      />
      <div
        style={{
          padding: "18px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {[70, 45, 90, 55, 80].map((w, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.4, 0.85, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.12 }}
            style={{
              height: 10,
              borderRadius: 999,
              background: "#F0EBE5",
              width: `${w}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Restaurant card ───────────────────────────────────────────────────────────
function RestaurantCard({ rest, searchCity }) {
  const rangeDisplay = normalisePrice(
    PRICE_MAP[rest.priceRange] || rest.priceRange,
  );
  const rangeColor = PRICE_CLR[rangeDisplay] || SAF;
  const rangeBg = PRICE_BG[rangeDisplay] || SAF_BG;
  const links = buildLinks(rest, searchCity);
  const dishes = toArray(rest.mustTryDishes);

  const FALLBACKS = [
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?auto=format&fit=crop&w=700&q=80",
  ];
  const fallbackImg =
    FALLBACKS[(rest.name?.charCodeAt(0) || 0) % FALLBACKS.length];

  return (
    <motion.div
      variants={cardV}
      whileHover={{ y: -5, boxShadow: "0 20px 60px rgba(14,10,6,0.12)" }}
      style={{
        borderRadius: 24,
        overflow: "hidden",
        background: "#fff",
        border: "1px solid #F0EBE5",
        boxShadow: "0 4px 20px rgba(14,10,6,0.06)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          height: 200,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={rest.imageUrl || fallbackImg}
          alt={rest.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.55s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.07)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          onError={(e) => {
            e.target.src = fallbackImg;
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,rgba(14,10,6,0.5) 0%,transparent 55%)",
          }}
        />

        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            display: "flex",
            gap: 6,
          }}
        >
          <span
            style={{
              fontFamily: F,
              fontSize: 11,
              fontWeight: 700,
              background: rangeBg,
              color: rangeColor,
              borderRadius: 999,
              padding: "5px 12px",
              backdropFilter: "blur(8px)",
            }}
          >
            {rangeDisplay}
          </span>
          {rest.isVeg && (
            <span
              style={{
                fontFamily: F,
                fontSize: 11,
                fontWeight: 700,
                background: "#DCFCE7",
                color: "#16A34A",
                borderRadius: 999,
                padding: "5px 10px",
                display: "flex",
                alignItems: "center",
                gap: 4,
                backdropFilter: "blur(8px)",
              }}
            >
              <Leaf size={10} /> Veg
            </span>
          )}
        </div>

        {/* AI badge + rating */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
          }}
        >
          {rest.source === "ai" && (
            <span
              style={{
                fontFamily: FM,
                fontSize: 10,
                fontWeight: 700,
                background: "rgba(14,10,6,0.72)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                borderRadius: 999,
                padding: "4px 9px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Sparkles size={10} /> AI
            </span>
          )}
          {rest.rating > 0 && (
            <span
              style={{
                fontFamily: FM,
                fontSize: 12,
                fontWeight: 700,
                background: "rgba(0,0,0,0.62)",
                backdropFilter: "blur(8px)",
                color: "#FBBF24",
                borderRadius: 999,
                padding: "4px 10px",
              }}
            >
              ★ {rest.rating}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "18px 20px 20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Name + reviews */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <h3
            style={{
              fontFamily: F,
              fontWeight: 800,
              fontSize: "0.98rem",
              color: INK,
              margin: 0,
              flex: 1,
              lineHeight: 1.3,
            }}
          >
            {rest.name}
          </h3>
          {rest.reviewCount > 0 && (
            <span
              style={{
                fontFamily: FM,
                fontSize: 10,
                color: "#9CA3AF",
                flexShrink: 0,
              }}
            >
              {rest.reviewCount.toLocaleString("en-IN")} reviews
            </span>
          )}
        </div>

        {/* Location + cuisine */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            flexWrap: "wrap",
          }}
        >
          <MapPin size={11} style={{ color: "#9CA3AF", flexShrink: 0 }} />
          <span style={{ fontFamily: F, fontSize: 12, color: "#9CA3AF" }}>
            {rest.city || rest.destination?.name || searchCity} ·{" "}
            {rest.cuisineType}
          </span>
        </div>

        {/* Description */}
        {rest.description && (
          <p
            style={{
              fontFamily: F,
              fontSize: 13,
              color: "#6B7280",
              lineHeight: 1.7,
              margin: 0,
              flex: 1,
            }}
          >
            {rest.description}
          </p>
        )}

        {/* Opening hours */}
        {(rest.openTime || rest.closeTime) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              background: "#FDFAF7",
              borderRadius: 10,
              border: "1px solid #F0EBE5",
            }}
          >
            <Clock size={12} style={{ color: "#9CA3AF", flexShrink: 0 }} />
            <span style={{ fontFamily: FM, fontSize: 11, color: "#6B7280" }}>
              {rest.openTime && rest.closeTime
                ? `${rest.openTime} – ${rest.closeTime}`
                : rest.openTime || rest.closeTime}
            </span>
          </div>
        )}

        {/* Must-try dishes */}
        {dishes.length > 0 && (
          <div>
            <p
              style={{
                fontFamily: FM,
                fontSize: 10,
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                margin: "0 0 7px",
              }}
            >
              Must Try
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {dishes.slice(0, 3).map((dish) => (
                <span
                  key={dish}
                  style={{
                    fontFamily: F,
                    fontSize: 11,
                    fontWeight: 600,
                    background: SAF_BG,
                    color: SAF,
                    borderRadius: 999,
                    padding: "4px 10px",
                  }}
                >
                  {dish}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              fontFamily: FM,
              fontWeight: 900,
              fontSize: "1.1rem",
              color: SAF,
            }}
          >
            ~₹{(rest.pricePerPerson || 0).toLocaleString("en-IN")}
          </span>
          <span style={{ fontFamily: F, fontSize: 11, color: "#9CA3AF" }}>
            per person
          </span>
        </div>

        {/* ── Links ─────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            paddingTop: 8,
            borderTop: "1px solid #F0EBE5",
            marginTop: 2,
          }}
        >
          {/* Official site */}
          {links.official && (
            <a
              href={links.official}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: SAF,
                color: "#fff",
                borderRadius: 12,
                padding: "11px 16px",
                textDecoration: "none",
                fontFamily: F,
                fontSize: 13,
                fontWeight: 700,
                boxShadow: `0 4px 18px ${SAF}35`,
                transition: "opacity 0.18s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Globe size={14} /> Official Website
            </a>
          )}

          {/* Zomato + Swiggy */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}
          >
            <a
              href={rest?.zomatoUrl || links.onZomato}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: "#FFF1F0",
                border: "1.5px solid #FECACA",
                borderRadius: 10,
                padding: "10px 8px",
                textDecoration: "none",
                fontFamily: F,
                fontSize: 12,
                fontWeight: 700,
                color: "#E53E3E",
                transition: "background 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFE4E4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFF1F0";
              }}
            >
              🍽️ {rest.zomatoUrl ? "Zomato" : "Find on Zomato"}
            </a>
            <a
              href={rest.swiggyUrl || links.onSwiggy}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: "#FFF7F0",
                border: "1.5px solid #FED7AA",
                borderRadius: 10,
                padding: "10px 8px",
                textDecoration: "none",
                fontFamily: F,
                fontSize: 12,
                fontWeight: 700,
                color: "#EA580C",
                transition: "background 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFEDD5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFF7F0";
              }}
            >
              🛵 {rest.swiggyUrl ? "Swiggy" : "Find on Swiggy"}
            </a>
          </div>

          {/* Maps + Phone + Google */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `1fr 1fr${links.phone ? " 1fr" : ""}`,
              gap: 6,
            }}
          >
            {[
              { label: "📍 Maps", url: links.maps },
              { label: "🔍 Google", url: links.google },
              ...(links.phone
                ? [
                    {
                      label: "📞 Call",
                      url: `tel:${links.phone}`,
                      isPhone: true,
                    },
                  ]
                : []),
            ].map(({ label, url, isPhone }) => (
              <a
                key={label}
                href={url}
                target={isPhone ? "_self" : "_blank"}
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#FDFAF7",
                  border: "1.5px solid #EDE7DE",
                  borderRadius: 10,
                  padding: "8px 4px",
                  textDecoration: "none",
                  fontFamily: isPhone ? FM : F,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6B7280",
                  transition: "border-color 0.18s, background 0.18s",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = SAF_BG;
                  e.currentTarget.style.borderColor = SAF;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FDFAF7";
                  e.currentTarget.style.borderColor = "#EDE7DE";
                }}
              >
                {isPhone ? links.phone : label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FoodPage() {
  const dispatch = useDispatch();
  const dbRests = useSelector(selectDestinationRestaurants);
  const destLoading = useSelector(selectDestinationLoading);

  const [searchCity, setSearchCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggOpen, setSuggOpen] = useState(false);

  const [aiRests, setAiRests] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const [priceFilter, setPriceFilter] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [query, setQuery] = useState("");

  const heroRef = useRef(null);
  const inputRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }
    const q = inputValue.toLowerCase();
    setSuggestions(
      POPULAR.filter((c) => c.toLowerCase().includes(q)).slice(0, 6),
    );
  }, [inputValue]);

  useEffect(() => {
    const fn = (e) => {
      if (!inputRef.current?.contains(e.target)) setSuggOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // ── Search handler ────────────────────────────────────────────────────────
  const doSearch = useCallback(
    async (city) => {
      if (!city?.trim()) return;
      const slug = city.trim().toLowerCase().replace(/\s+/g, "-");

      setSearchCity(city);
      setAiRests([]);
      setAiError(null);
      setQuery("");
      setPriceFilter("All");
      setVegOnly(false);

      // DB fetch
      dispatch(clearDestinationRestaurants());
      dispatch(fetchDestinationRestaurants({ slug, params: {} }));

      // AI fetch in parallel
      setAiLoading(true);
      try {
        const rests = await fetchAIRestaurants(city);
        setAiRests(rests);
      } catch (e) {
        setAiError(
          "AI restaurant data unavailable — showing database results only.",
        );
      } finally {
        setAiLoading(false);
      }
    },
    [dispatch],
  );

  const selectCity = (city) => {
    setInputValue(city);
    setSuggOpen(false);
    doSearch(city);
  };

  const clearSearch = () => {
    setSearchCity("");
    setInputValue("");
    setAiRests([]);
    setAiError(null);
    setQuery("");
    setPriceFilter("All");
    setVegOnly(false);
    dispatch(clearDestinationRestaurants());
  };

  // ── Merge DB + AI ─────────────────────────────────────────────────────────
  const rawRests = useMemo(() => {
    if (!searchCity) return STATIC_RESTAURANTS;
    const db = Array.isArray(dbRests) ? dbRests : [];
    if (db.length > 0) return db;
    if (aiRests.length > 0) return aiRests;
    return [];
  }, [searchCity, dbRests, aiRests]);

  const isLoading = (searchCity && destLoading.restaurants) || aiLoading;

  const filtered = useMemo(
    () =>
      rawRests.filter((r) => {
        const rng = normalisePrice(PRICE_MAP[r.priceRange] || r.priceRange);
        const matchP = priceFilter === "All" || rng === priceFilter;
        const matchV = !vegOnly || r.isVeg;
        const matchQ =
          !query.trim() ||
          (r.name || "").toLowerCase().includes(query.toLowerCase()) ||
          (r.city || r.destination?.name || "")
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          (r.cuisineType || "").toLowerCase().includes(query.toLowerCase());
        return matchP && matchV && matchQ;
      }),
    [rawRests, priceFilter, vegOnly, query],
  );

  return (
    <div
      style={{
        fontFamily: F,
        color: INK,
        background: "#FDFAF7",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      {/* ════ HERO ═══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          height: "44vh",
          minHeight: 300,
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            y: bgY,
            position: "absolute",
            inset: "-20% 0",
            zIndex: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1920&q=85')",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(to bottom, rgba(5,2,10,0.5) 0%, rgba(14,8,4,0.90) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "radial-gradient(ellipse at 75% 110%, rgba(232,101,10,0.28) 0%, transparent 55%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "clamp(72px,10vw,96px) clamp(20px,5vw,40px) 0",
          }}
        >
          <motion.p
            variants={fadeUp(0.06)}
            initial="hidden"
            animate="show"
            style={{
              color: SAF,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              marginBottom: 14,
            }}
          >
            ✦ India's Finest Food
          </motion.p>
          <motion.h1
            variants={fadeUp(0.16)}
            initial="hidden"
            animate="show"
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: "clamp(1.9rem,5vw,3.2rem)",
              lineHeight: 1.06,
              marginBottom: 14,
            }}
          >
            Eat like a local, anywhere
          </motion.h1>
          <motion.p
            variants={fadeUp(0.26)}
            initial="hidden"
            animate="show"
            style={{
              color: "rgba(255,255,255,0.62)",
              fontSize: "clamp(0.9rem,1.6vw,1rem)",
              maxWidth: 480,
              lineHeight: 1.8,
            }}
          >
            From street-side dhabas to lakeside fine dining — type any city to
            discover real restaurants.
          </motion.p>
        </div>
      </section>

      {/* ════ SEARCH CARD ════════════════════════════════════════════════════ */}
      <div
        className="search-card-wrap"
        style={{
          maxWidth: 900,
          margin: "-32px auto 0",
          padding: "0 clamp(12px,4vw,24px)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.div
          variants={fadeUp(0.32)}
          initial="hidden"
          animate="show"
          className="search-card-inner"
          style={{
            background: "#fff",
            borderRadius: 24,
            padding:
              "clamp(12px,3vw,24px) clamp(12px,3vw,28px) clamp(10px,2vw,20px)",
            boxShadow: "0 20px 60px rgba(14,10,6,0.15)",
            border: "1px solid rgba(232,101,10,0.1)",
          }}
        >
          <p
            className="search-label"
            style={{
              fontFamily: FM,
              fontSize: 11,
              color: SAF,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              margin: "0 0 10px",
            }}
          >
            Search any destination
          </p>

          {/* City input + Search button — single tight row on all sizes */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              ref={inputRef}
              style={{ flex: 1, position: "relative", minWidth: 0 }}
            >
              <MapPin
                size={15}
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: searchCity ? SAF : "#9CA3AF",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
              <input
                value={inputValue}
                placeholder="Type any city — Mumbai, Hyderabad, Chandigarh…"
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setSuggOpen(true);
                }}
                onFocus={() => {
                  if (inputValue) setSuggOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim())
                    selectCity(inputValue.trim());
                }}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  paddingLeft: 44,
                  paddingRight: inputValue ? 44 : 16,
                  paddingTop: 13,
                  paddingBottom: 13,
                  border: `1.5px solid ${searchCity ? SAF : "#EDE7DE"}`,
                  borderRadius: 14,
                  fontFamily: F,
                  fontSize: 14,
                  color: INK,
                  outline: "none",
                  background: searchCity ? SAF_BG : "#FFFDF9",
                  boxShadow: searchCity ? `0 0 0 3px ${SAF}1A` : "none",
                  transition:
                    "border-color 0.18s, background 0.18s, box-shadow 0.18s",
                }}
                onFocus={(e) => {
                  if (!searchCity) e.target.style.borderColor = SAF;
                }}
                onBlur={(e) => {
                  if (!searchCity) e.target.style.borderColor = "#EDE7DE";
                }}
              />
              {inputValue && (
                <button
                  onClick={clearSearch}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    padding: 4,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <X size={14} />
                </button>
              )}

              <AnimatePresence>
                {suggOpen && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.14 }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: 0,
                      right: 0,
                      zIndex: 999,
                      background: "#fff",
                      border: "1.5px solid #EDE7DE",
                      borderRadius: 16,
                      boxShadow: "0 16px 44px rgba(14,10,6,0.14)",
                      overflow: "hidden",
                    }}
                  >
                    {suggestions.map((city, i) => (
                      <button
                        key={city}
                        onMouseDown={() => selectCity(city)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "12px 16px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: F,
                          fontSize: 14,
                          color: INK,
                          textAlign: "left",
                          borderBottom:
                            i < suggestions.length - 1
                              ? "1px solid #F5F0EB"
                              : "none",
                          transition: "background 0.14s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = SAF_BG)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <MapPin
                          size={13}
                          style={{ color: "#9CA3AF", flexShrink: 0 }}
                        />
                        <span>{city}</span>
                        <ChevronRight
                          size={13}
                          style={{ color: "#9CA3AF", marginLeft: "auto" }}
                        />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={() => inputValue.trim() && selectCity(inputValue.trim())}
              whileHover={{ scale: 1.04, boxShadow: `0 8px 28px ${SAF}45` }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: SAF,
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "11px clamp(14px,3vw,24px)",
                fontFamily: F,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 4px 18px ${SAF}38`,
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              <Search size={15} /> Search
            </motion.button>
          </div>

          {/* Filters + Popular — single compact scrollable row on all sizes */}
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "nowrap",
              alignItems: "center",
              marginTop: 10,
              overflowX: "auto",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              paddingBottom: 2,
              borderTop: "1px solid #F5F0EB",
              paddingTop: 10,
            }}
          >
            {/* Veg toggle */}
            <motion.button
              onClick={() => setVegOnly((p) => !p)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                flexShrink: 0,
                padding: "6px 12px",
                borderRadius: 999,
                fontFamily: F,
                fontSize: 11,
                fontWeight: vegOnly ? 700 : 500,
                cursor: "pointer",
                border: `1.5px solid ${vegOnly ? "#16A34A" : "#EDE7DE"}`,
                background: vegOnly ? "#DCFCE7" : "#fff",
                color: vegOnly ? "#16A34A" : "#6B7280",
                transition: "all 0.18s",
              }}
            >
              <Leaf
                size={12}
                style={{ color: vegOnly ? "#16A34A" : "#9CA3AF" }}
              />{" "}
              Veg
            </motion.button>

            {/* Price filters */}
            {PRICE_RANGES.filter((r) => r !== "All").map((r) => (
              <motion.button
                key={r}
                onClick={() => setPriceFilter(priceFilter === r ? "All" : r)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontFamily: F,
                  fontSize: 11,
                  flexShrink: 0,
                  fontWeight: priceFilter === r ? 700 : 500,
                  cursor: "pointer",
                  border: `1.5px solid ${priceFilter === r ? PRICE_CLR[r] || SAF : "#EDE7DE"}`,
                  background: priceFilter === r ? PRICE_CLR[r] || SAF : "#fff",
                  color: priceFilter === r ? "#fff" : "#6B7280",
                  transition: "all 0.18s",
                }}
              >
                {r}
              </motion.button>
            ))}

            <span
              style={{
                flexShrink: 0,
                alignSelf: "center",
                color: "#D1D5DB",
                fontSize: 16,
                margin: "0 2px",
              }}
            >
              ·
            </span>

            {/* Popular city chips */}
            {POPULAR.map((city) => (
              <motion.button
                key={city}
                onClick={() => selectCity(city)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontFamily: F,
                  fontSize: 11,
                  flexShrink: 0,
                  fontWeight: searchCity === city ? 700 : 500,
                  cursor: "pointer",
                  border: `1.5px solid ${searchCity === city ? SAF : "#EDE7DE"}`,
                  background: searchCity === city ? SAF_BG : "#FDFAF7",
                  color: searchCity === city ? SAF : "#6B7280",
                  transition: "all 0.18s",
                }}
              >
                {city}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ════ RESULTS ════════════════════════════════════════════════════════ */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "36px clamp(16px,4vw,24px) 80px",
        }}
      >
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: F,
                  fontWeight: 900,
                  fontSize: "clamp(1.1rem,2.5vw,1.4rem)",
                  color: INK,
                  margin: 0,
                }}
              >
                {searchCity
                  ? `Restaurants in ${searchCity}`
                  : "Featured Restaurants"}
              </h2>
              <p
                style={{
                  fontFamily: FM,
                  fontSize: 12,
                  color: "#9CA3AF",
                  margin: "4px 0 0",
                }}
              >
                {isLoading
                  ? "Searching…"
                  : `${filtered.length} place${filtered.length !== 1 ? "s" : ""} found`}
                {!searchCity && " · Type any city above to search"}
                {searchCity &&
                  aiRests.length > 0 &&
                  !destLoading.restaurants &&
                  " · AI-generated data"}
              </p>
              {aiError && (
                <p
                  style={{
                    fontFamily: F,
                    fontSize: 12,
                    color: "#9CA3AF",
                    margin: "2px 0 0",
                  }}
                >
                  {aiError}
                </p>
              )}
            </div>

            {rawRests.length > 0 && !isLoading && (
              <div style={{ position: "relative" }}>
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                  }}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter results…"
                  style={{
                    paddingLeft: 38,
                    paddingRight: 16,
                    paddingTop: 10,
                    paddingBottom: 10,
                    border: "1.5px solid #EDE7DE",
                    borderRadius: 999,
                    fontFamily: F,
                    fontSize: 13,
                    color: INK,
                    outline: "none",
                    background: "#fff",
                    width: 190,
                    transition: "border-color 0.18s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = SAF)}
                  onBlur={(e) => (e.target.style.borderColor = "#EDE7DE")}
                />
              </div>
            )}
          </div>
        </Reveal>

        {/* Loading */}
        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
              gap: 24,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", padding: "72px 24px" }}
          >
            <p style={{ fontSize: 52, marginBottom: 16 }}>🍽️</p>
            <p
              style={{
                fontFamily: F,
                fontWeight: 800,
                fontSize: "1.1rem",
                color: INK,
                marginBottom: 8,
              }}
            >
              {searchCity
                ? `No restaurants found in ${searchCity}`
                : "No places match your filters"}
            </p>
            <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 24 }}>
              Try clearing your filters or search another city.
            </p>
            <button
              onClick={() => {
                setPriceFilter("All");
                setVegOnly(false);
                setQuery("");
              }}
              style={{
                background: SAF,
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "12px 28px",
                fontFamily: F,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 4px 18px ${SAF}38`,
              }}
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${searchCity}-${priceFilter}-${vegOnly}-${query}`}
              variants={gridC}
              initial="hidden"
              animate="show"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
                gap: 24,
              }}
            >
              {filtered.map((rest) => (
                <RestaurantCard
                  key={rest._id}
                  rest={rest}
                  searchCity={searchCity}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <Footer />
      <style>{`
        @media (max-width: 480px) {
          .search-label { display: none !important; }
        }
        *::-webkit-scrollbar { display: none; }

        /* ── Mobile: compact search card ── */
        @media (max-width: 600px) {
          .search-card-wrap { margin-top: -20px !important; padding: 0 12px !important; }
          .search-card-wrap input { font-size: 13px !important; padding-top: 9px !important; padding-bottom: 9px !important; }
          .search-card-inner { padding: 12px 14px 12px !important; }
          .search-card-wrap .tier-pill { padding: 5px 10px !important; font-size: 11px !important; }
          .search-card-wrap .pop-row { gap: 5px !important; }
          .search-card-wrap .pop-chip { padding: 4px 10px !important; font-size: 10px !important; }
        }
      `}</style>
    </div>
  );
}
