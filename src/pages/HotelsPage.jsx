// src/pages/HotelsPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Search flow:
//   1. User types any Indian city → AI generates rich hotel data for that city
//   2. Simultaneously we call the backend /destinations/:slug/hotels endpoint
//   3. If backend returns data → show it; if not → show AI data as fallback
//   4. Static curated picks shown on first load with zero API calls
//
// All links are plain redirects — zero affiliation, no tracking params.
// ─────────────────────────────────────────────────────────────────────────────

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  ChevronRight,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDestinationHotels,
  fetchDestinationHotels,
  selectDestinationError,
  selectDestinationHotels,
  selectDestinationLoading,
} from "../store";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";

// ── Design tokens ─────────────────────────────────────────────────────────────
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

// ── Constants ─────────────────────────────────────────────────────────────────
const TIER_CLR = { economy: "#16A34A", standard: SAF, luxury: "#9333EA" };
const TIER_BG = { economy: "#DCFCE7", standard: SAF_BG, luxury: "#F5F3FF" };
const TIER_ICO = { economy: "🪙", standard: "⭐", luxury: "💎" };
const TIERS = ["All", "Economy", "Standard", "Luxury"];

// Popular Indian destinations for quick-pick chips
const POPULAR = [
  "Goa",
  "Jaipur",
  "Udaipur",
  "Manali",
  "Ladakh",
  "Rishikesh",
  "Coorg",
  "Munnar",
  "Varanasi",
  "Andaman",
  "Shimla",
  "Ooty",
  "Darjeeling",
  "Hampi",
  "Pondicherry",
  "Mysuru",
];

// Curated static cards shown before any search
const STATIC_HOTELS = [
  {
    _id: "s1",
    name: "The Oberoi Rajvilas",
    city: "Jaipur",
    tier: "luxury",
    starRating: 5,
    pricePerNight: 18000,
    rating: 4.9,
    reviewCount: 1240,
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80",
    description:
      "A palatial resort across 32 acres of landscaped gardens. Rajput grandeur, world-class spa, and the finest hospitality in Rajasthan.",
    amenities: ["Pool", "Spa", "Fine Dining", "Valet", "Wi-Fi"],
    website: "https://www.oberoihotels.com/hotels-in-jaipur-rajvilas/",
    phone: "+91 141 268 0101",
  },
  {
    _id: "s2",
    name: "Taj Lake Palace",
    city: "Udaipur",
    tier: "luxury",
    starRating: 5,
    pricePerNight: 22000,
    rating: 4.9,
    reviewCount: 2100,
    imageUrl:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=700&q=80",
    description:
      "Floating on Lake Pichola's marble island — India's most iconic hotel and the absolute definition of romance.",
    amenities: ["Lake View", "Pool", "Spa", "Heritage Dining"],
    website: "https://www.tajhotels.com/en-in/taj/taj-lake-palace-udaipur/",
    phone: "+91 294 242 8800",
  },
  {
    _id: "s3",
    name: "Zostel Rishikesh",
    city: "Rishikesh",
    tier: "economy",
    starRating: 2,
    pricePerNight: 600,
    rating: 4.5,
    reviewCount: 890,
    imageUrl:
      "https://images.unsplash.com/photo-1590050811270-c33c6df97517?auto=format&fit=crop&w=700&q=80",
    description:
      "A vibrant backpacker hostel right on the Ganga. Meet solo travellers from every corner of the planet.",
    amenities: ["River View", "Yoga Deck", "Café", "Wi-Fi"],
    website: "https://www.zostel.com/zostel/rishikesh/",
  },
  {
    _id: "s4",
    name: "The Grand Dragon Ladakh",
    city: "Leh",
    tier: "luxury",
    starRating: 5,
    pricePerNight: 14000,
    rating: 4.8,
    reviewCount: 740,
    imageUrl:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80",
    description:
      "Ladakh's finest hotel — floor-to-ceiling Himalayan views, warm rooms, and legendary hospitality at altitude.",
    amenities: ["Mountain View", "Restaurant", "Spa", "Wi-Fi", "Oxygen Bar"],
    website: "https://www.thegranddragonladakh.com/",
    phone: "+91 1982 257786",
  },
  {
    _id: "s5",
    name: "Alsisar Haveli",
    city: "Jaipur",
    tier: "standard",
    starRating: 4,
    pricePerNight: 4200,
    rating: 4.7,
    reviewCount: 560,
    imageUrl:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=700&q=80",
    description:
      "A beautifully restored 18th-century haveli with original frescoes, a lush courtyard, and impeccable service.",
    amenities: ["Heritage Pool", "Restaurant", "Wi-Fi", "Rooftop"],
    website: "https://www.alsisarhaveli.com/",
  },
  {
    _id: "s6",
    name: "Kumarakom Lake Resort",
    city: "Kottayam",
    tier: "luxury",
    starRating: 5,
    pricePerNight: 16000,
    rating: 4.8,
    reviewCount: 980,
    imageUrl:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80",
    description:
      "Sprawling backwater villas with private plunge pools and Ayurveda treatments you will carry forever.",
    amenities: ["Backwaters", "Private Pool", "Ayurveda", "Fine Dining"],
    website: "https://www.kumarakomlakeresort.in/",
    phone: "+91 481 252 4900",
  },
];

// ── Link builder ──────────────────────────────────────────────────────────────
// All plain redirects — no affiliate params whatsoever
const buildLinks = (hotel, city) => {
  const name = hotel.name || "";
  const dest = hotel.city || hotel.destination?.name || city || "";
  const destSlug = dest.toLowerCase().replace(/\s+/g, "-");
  const destEnc = encodeURIComponent(dest);
  const hotelQ = encodeURIComponent(`${name} hotel ${dest} India`);
  const mapsQ = encodeURIComponent(`${name} hotel ${dest}`);

  // Dates: today + 1 and today + 2 in MMDDYYYY format for MMT
  const d1 = new Date();
  d1.setDate(d1.getDate() + 1);
  const d2 = new Date();
  d2.setDate(d2.getDate() + 2);
  const pad = (n) => String(n).padStart(2, "0");
  const mmtDate1 = `${pad(d1.getMonth() + 1)}${pad(d1.getDate())}${d1.getFullYear()}`;
  const mmtDate2 = `${pad(d2.getMonth() + 1)}${pad(d2.getDate())}${d2.getFullYear()}`;

  return {
    official: hotel.website || null,
    phone: hotel.phone || null,
    // Google Maps — coordinates if available, else text search
    maps:
      hotel.mapLat && hotel.mapLng
        ? `https://www.google.com/maps?q=${hotel.mapLat},${hotel.mapLng}`
        : `https://www.google.com/maps/search/?api=1&query=${mapsQ}`,
    // MakeMyTrip — with dynamic dates so the URL is valid
    mmt: `https://www.makemytrip.com/hotels/hotel-listing/?checkin=${mmtDate1}&checkout=${mmtDate2}&city=${destEnc}&roomType=1&noOfRooms=1&noOfAdults=2`,
    // Goibibo — /hotels/hotels-in-<city-slug>/ works for all cities
    goibibo: `https://www.goibibo.com/hotels/hotels-in-${destSlug}/`,
    // Booking.com — ss param with "City, India" is reliable
    booking: `https://www.booking.com/searchresults.html?ss=${destEnc}%2C+India&dest_type=city`,
    // Fallback Google search for the specific hotel
    google: `https://www.google.com/search?q=${hotelQ}`,
  };
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const toArray = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v.trim())
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
};

const normaliseTier = (t) => {
  const s = (t || "").toLowerCase();
  if (["economy", "budget", "cheap", "hostel"].some((k) => s.includes(k)))
    return "economy";
  if (["luxury", "premium", "5-star", "five"].some((k) => s.includes(k)))
    return "luxury";
  return "standard";
};

// ── AI call — generates real hotel data for any typed city ───────────────────
const AI_HOTEL_PROMPT = (city) => `You are a travel data expert for India.
Return ONLY a valid JSON array (no markdown, no explanation) of 8 real hotels in "${city}", India.
Each object must have ALL these fields:
{
  "_id": "unique string",
  "name": "Exact real hotel name",
  "city": "${city}",
  "tier": "economy|standard|luxury",
  "starRating": 1-5,
  "pricePerNight": number in INR (realistic for tier),
  "rating": 3.5-5.0,
  "reviewCount": realistic number,
  "description": "2-sentence description of the hotel",
  "amenities": ["Pool","Wi-Fi","Restaurant","Spa","Gym","Parking","AC","Bar"],
  "website": "real official hotel URL or empty string",
  "phone": "real phone number or empty string",
  "imageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80"
}
Use realistic prices:
- economy: ₹500–₹2500/night
- standard: ₹2500–₹8000/night
- luxury: ₹8000–₹50000/night
Include a mix of tiers. Use real hotel names that actually exist in ${city}.
Use this exact Unsplash URL for all: https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80
IMPORTANT: Return ONLY the JSON array, nothing else.`;

async function fetchAIHotels(city) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: AI_HOTEL_PROMPT(city) }],
    }),
  });
  const data = await res.json();
  const text = data.content?.map((b) => b.text || "").join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  const arr = JSON.parse(clean);
  if (!Array.isArray(arr)) throw new Error("Not an array");
  return arr.map((h, i) => ({
    ...h,
    _id: h._id || `ai-${i}`,
    tier: normaliseTier(h.tier),
    source: "ai",
  }));
}

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

function Stars({ n, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={11}
            style={{
              fill: s <= Math.round(n) ? "#FBBF24" : "#E5E7EB",
              color: s <= Math.round(n) ? "#FBBF24" : "#E5E7EB",
            }}
          />
        ))}
      </div>
      {count > 0 && (
        <span style={{ fontFamily: FM, fontSize: 10, color: "#9CA3AF" }}>
          ({count.toLocaleString("en-IN")})
        </span>
      )}
    </div>
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
          height: 210,
          background: "linear-gradient(90deg,#F5EFE8,#EDE7DC,#F5EFE8)",
        }}
      />
      <div
        style={{
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {[75, 50, 90, 60, 40].map((w, i) => (
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

// ── Hotel card ────────────────────────────────────────────────────────────────
function HotelCard({ hotel, searchCity }) {
  const tier = normaliseTier(hotel.tier);
  const links = buildLinks(hotel, searchCity);
  const amen = toArray(hotel.amenities);

  const UNSPLASH_FALLBACKS = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1590050811270-c33c6df97517?auto=format&fit=crop&w=700&q=80",
  ];
  const fallbackImg =
    UNSPLASH_FALLBACKS[
      Math.abs(hotel.name?.charCodeAt(0) || 0) % UNSPLASH_FALLBACKS.length
    ];

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
          height: 210,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={hotel.imageUrl || fallbackImg}
          alt={hotel.name}
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
              "linear-gradient(to top,rgba(14,10,6,0.55) 0%,transparent 55%)",
          }}
        />

        {/* Tier + AI badge */}
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
              background: TIER_BG[tier] || SAF_BG,
              color: TIER_CLR[tier] || SAF,
              borderRadius: 999,
              padding: "5px 12px",
              backdropFilter: "blur(8px)",
            }}
          >
            {TIER_ICO[tier]} {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </span>
          {hotel.source === "ai" && (
            <span
              style={{
                fontFamily: FM,
                fontSize: 10,
                fontWeight: 700,
                background: "rgba(14,10,6,0.72)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                borderRadius: 999,
                padding: "5px 10px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Sparkles size={10} /> AI
            </span>
          )}
        </div>

        {/* Star class */}
        {hotel.starRating > 0 && (
          <div style={{ position: "absolute", top: 14, right: 14 }}>
            <span
              style={{
                fontFamily: FM,
                fontSize: 11,
                fontWeight: 700,
                background: "rgba(0,0,0,0.62)",
                backdropFilter: "blur(8px)",
                color: "#FBBF24",
                borderRadius: 999,
                padding: "5px 10px",
              }}
            >
              {"★".repeat(Math.min(hotel.starRating, 5))}
            </span>
          </div>
        )}

        {/* Price */}
        <div style={{ position: "absolute", bottom: 14, right: 14 }}>
          <div
            style={{
              background: "rgba(14,10,6,0.74)",
              backdropFilter: "blur(10px)",
              borderRadius: 12,
              padding: "8px 14px",
              textAlign: "right",
            }}
          >
            <p
              style={{
                fontFamily: FM,
                fontWeight: 900,
                fontSize: "1rem",
                color: "#fff",
                margin: 0,
              }}
            >
              ₹{(hotel.pricePerNight || 0).toLocaleString("en-IN")}
            </p>
            <p
              style={{
                fontFamily: F,
                fontSize: 10,
                color: "rgba(255,255,255,0.55)",
                margin: 0,
              }}
            >
              per night
            </p>
          </div>
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
        {/* Name + rating */}
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
              fontSize: "1rem",
              color: INK,
              margin: 0,
              flex: 1,
              lineHeight: 1.3,
            }}
          >
            {hotel.name}
          </h3>
          {hotel.rating > 0 && (
            <Stars n={hotel.rating} count={hotel.reviewCount || 0} />
          )}
        </div>

        {/* Location */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <MapPin size={12} style={{ color: "#9CA3AF", flexShrink: 0 }} />
          <span style={{ fontFamily: F, fontSize: 12, color: "#9CA3AF" }}>
            {hotel.city || hotel.destination?.name || searchCity}
            {hotel.address ? ` · ${hotel.address.split(",")[0]}` : ""}
          </span>
        </div>

        {/* Description */}
        {hotel.description && (
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
            {hotel.description}
          </p>
        )}

        {/* Check-in / out */}
        {(hotel.checkInTime || hotel.checkOutTime) && (
          <div
            style={{
              display: "flex",
              gap: 14,
              padding: "10px 12px",
              background: "#FDFAF7",
              borderRadius: 10,
              border: "1px solid #F0EBE5",
            }}
          >
            {hotel.checkInTime && (
              <div>
                <p
                  style={{
                    fontFamily: FM,
                    fontSize: 9,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 2px",
                  }}
                >
                  Check-in
                </p>
                <p
                  style={{
                    fontFamily: F,
                    fontSize: 12,
                    fontWeight: 700,
                    color: INK,
                    margin: 0,
                  }}
                >
                  {hotel.checkInTime}
                </p>
              </div>
            )}
            {hotel.checkOutTime && (
              <div>
                <p
                  style={{
                    fontFamily: FM,
                    fontSize: 9,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 2px",
                  }}
                >
                  Check-out
                </p>
                <p
                  style={{
                    fontFamily: F,
                    fontSize: 12,
                    fontWeight: 700,
                    color: INK,
                    margin: 0,
                  }}
                >
                  {hotel.checkOutTime}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Amenities */}
        {amen.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {amen.slice(0, 5).map((a) => (
              <span
                key={a}
                style={{
                  fontFamily: F,
                  fontSize: 11,
                  fontWeight: 600,
                  background: "#F5F0EB",
                  color: "#6B7280",
                  borderRadius: 999,
                  padding: "4px 10px",
                }}
              >
                {a}
              </span>
            ))}
          </div>
        )}

        {/* ── Links ───────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            paddingTop: 8,
            borderTop: "1px solid #F0EBE5",
            marginTop: 4,
          }}
        >
          {/* Primary: Official site or Google */}
          {links.official ? (
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
                padding: "12px 16px",
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
          ) : (
            <a
              href={links.google}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: INK,
                color: "#fff",
                borderRadius: 12,
                padding: "12px 16px",
                textDecoration: "none",
                fontFamily: F,
                fontSize: 13,
                fontWeight: 700,
                transition: "opacity 0.18s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Search size={14} /> Search Online
            </a>
          )}

          {/* OTA search row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 6,
            }}
          >
            {[
              { label: "MakeMyTrip", url: links.mmt },
              { label: "Goibibo", url: links.goibibo },
              { label: "Booking", url: links.booking },
            ].map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  background: "#FDFAF7",
                  border: "1.5px solid #EDE7DE",
                  borderRadius: 10,
                  padding: "9px 4px",
                  textDecoration: "none",
                  fontFamily: F,
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#374151",
                  transition: "border-color 0.18s, background 0.18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = SAF;
                  e.currentTarget.style.background = SAF_BG;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#EDE7DE";
                  e.currentTarget.style.background = "#FDFAF7";
                }}
              >
                <ExternalLink size={10} /> {label}
              </a>
            ))}
          </div>

          {/* Maps + Phone */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: links.phone ? "1fr 1fr" : "1fr",
              gap: 6,
            }}
          >
            <a
              href={links.maps}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: "#FDFAF7",
                border: "1.5px solid #EDE7DE",
                borderRadius: 10,
                padding: "9px 6px",
                textDecoration: "none",
                fontFamily: F,
                fontSize: 11,
                fontWeight: 600,
                color: "#374151",
                transition: "border-color 0.18s, background 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = SAF;
                e.currentTarget.style.background = SAF_BG;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#EDE7DE";
                e.currentTarget.style.background = "#FDFAF7";
              }}
            >
              📍 Maps
            </a>
            {links.phone && (
              <a
                href={`tel:${links.phone}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "#FDFAF7",
                  border: "1.5px solid #EDE7DE",
                  borderRadius: 10,
                  padding: "9px 6px",
                  textDecoration: "none",
                  fontFamily: FM,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#374151",
                  transition: "border-color 0.18s, background 0.18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#9CA3AF";
                  e.currentTarget.style.background = "#F5F0EB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#EDE7DE";
                  e.currentTarget.style.background = "#FDFAF7";
                }}
              >
                <Phone size={11} /> {links.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HotelsPage() {
  const dispatch = useDispatch();
  const dbHotels = useSelector(selectDestinationHotels);
  const destLoading = useSelector(selectDestinationLoading);
  const destError = useSelector(selectDestinationError);

  // Search state
  const [searchCity, setSearchCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggOpen, setSuggOpen] = useState(false);

  // AI state
  const [aiHotels, setAiHotels] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Filters
  const [tier, setTier] = useState("All");
  const [query, setQuery] = useState("");

  const heroRef = useRef(null);
  const inputRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  // Autocomplete from popular list
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

  // Close suggestions on outside click
  useEffect(() => {
    const fn = (e) => {
      if (!inputRef.current?.contains(e.target)) setSuggOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // ── Main search handler ───────────────────────────────────────────────────
  const doSearch = useCallback(
    async (city) => {
      if (!city?.trim()) return;
      const slug = city.trim().toLowerCase().replace(/\s+/g, "-");

      setSearchCity(city);
      setAiHotels([]);
      setAiError(null);
      setQuery("");
      setTier("All");

      // 1. Fetch from backend DB
      dispatch(clearDestinationHotels());
      dispatch(fetchDestinationHotels({ slug, tier: undefined }));

      // 2. Simultaneously generate AI data
      setAiLoading(true);
      try {
        const hotels = await fetchAIHotels(city);
        setAiHotels(hotels);
      } catch (e) {
        setAiError(
          "AI hotel data unavailable — showing database results only.",
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
    setAiHotels([]);
    setAiError(null);
    setQuery("");
    setTier("All");
    dispatch(clearDestinationHotels());
  };

  // ── Merge DB + AI data ────────────────────────────────────────────────────
  // DB data takes priority; AI fills in if DB returns nothing
  const rawHotels = useMemo(() => {
    if (!searchCity) return STATIC_HOTELS;
    const db = Array.isArray(dbHotels) ? dbHotels : [];
    if (db.length > 0) return db; // DB has real data → use it exclusively
    if (aiHotels.length > 0) return aiHotels; // AI fallback
    return [];
  }, [searchCity, dbHotels, aiHotels]);

  const isLoading = (searchCity && destLoading.hotels) || aiLoading;

  const filtered = useMemo(
    () =>
      rawHotels.filter((h) => {
        const t = normaliseTier(h.tier);
        const matchTier = tier === "All" || t === tier.toLowerCase();
        const matchQuery =
          !query.trim() ||
          (h.name || "").toLowerCase().includes(query.toLowerCase()) ||
          (h.city || h.destination?.name || "")
            .toLowerCase()
            .includes(query.toLowerCase());
        return matchTier && matchQuery;
      }),
    [rawHotels, tier, query],
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
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=85')",
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
            ✦ Curated Stays
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
            Find your perfect stay
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
            Type any Indian city — our AI finds real hotels with live pricing
            and direct links.
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

          {/* City input + Search button — compact row on all sizes */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              ref={inputRef}
              style={{ flex: 1, position: "relative", minWidth: 0 }}
            >
              <MapPin
                size={15}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: searchCity ? SAF : "#9CA3AF",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
              <input
                value={inputValue}
                placeholder="Any city — Goa, Manali, Ooty…"
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
                  paddingLeft: 40,
                  paddingRight: inputValue ? 38 : 14,
                  paddingTop: 11,
                  paddingBottom: 11,
                  border: `1.5px solid ${searchCity ? SAF : "#EDE7DE"}`,
                  borderRadius: 12,
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
                    right: 10,
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

              {/* Autocomplete dropdown */}
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

            {/* Search button */}
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
              <Search size={15} />
              <span style={{ display: "var(--search-label-display, inline)" }}>
                Search
              </span>
            </motion.button>
          </div>

          {/* Tier + Popular — single compact scrollable row on mobile */}
          <div
            style={{
              marginTop: 10,
              paddingTop: 10,
              borderTop: "1px solid #F5F0EB",
              display: "flex",
              gap: 6,
              overflowX: "auto",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              flexWrap: "nowrap",
              paddingBottom: 2,
            }}
          >
            {/* Tier pills */}
            {TIERS.filter((t) => t !== "All").map((t) => (
              <motion.button
                key={t}
                onClick={() => setTier(tier === t ? "All" : t)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontFamily: F,
                  fontSize: 11,
                  fontWeight: tier === t ? 700 : 500,
                  cursor: "pointer",
                  flexShrink: 0,
                  border: `1.5px solid ${tier === t ? TIER_CLR[t.toLowerCase()] || SAF : "#EDE7DE"}`,
                  background:
                    tier === t ? TIER_CLR[t.toLowerCase()] || SAF : "#fff",
                  color: tier === t ? "#fff" : "#6B7280",
                  transition: "all 0.18s",
                }}
              >
                {t === "Economy"
                  ? "🪙 "
                  : t === "Standard"
                    ? "⭐ "
                    : t === "Luxury"
                      ? "💎 "
                      : ""}
                {t}
              </motion.button>
            ))}
            {/* Divider dot */}
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
                  fontWeight: searchCity === city ? 700 : 500,
                  cursor: "pointer",
                  flexShrink: 0,
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
                {searchCity ? `Hotels in ${searchCity}` : "Featured Hotels"}
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
                  : `${filtered.length} hotel${filtered.length !== 1 ? "s" : ""} found`}
                {!searchCity && " · Type any city above to search"}
                {searchCity &&
                  aiHotels.length > 0 &&
                  !destLoading.hotels &&
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

            {rawHotels.length > 0 && !isLoading && (
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
            <p style={{ fontSize: 52, marginBottom: 16 }}>🏨</p>
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
                ? `No hotels found in ${searchCity}`
                : "No hotels match your filters"}
            </p>
            <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 24 }}>
              {searchCity
                ? "Try a different tier filter or search another city."
                : "Clear your filters to browse all hotels."}
            </p>
            <button
              onClick={() => {
                setTier("All");
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
              key={`${searchCity}-${tier}-${query}`}
              variants={gridC}
              initial="hidden"
              animate="show"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
                gap: 24,
              }}
            >
              {filtered.map((hotel) => (
                <HotelCard
                  key={hotel._id}
                  hotel={hotel}
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
          /* Shrink the card margin so it doesn't overlap hero too much */
          .search-card-wrap { margin-top: -20px !important; padding: 0 12px !important; }
          /* Smaller input text and padding */
          .search-card-wrap input { font-size: 13px !important; padding-top: 9px !important; padding-bottom: 9px !important; }
          /* Smaller search button */
          .search-card-wrap button[class*="search-btn"] { padding: 9px 14px !important; font-size: 13px !important; }
          /* Compact tier pills */
          .search-card-wrap .tier-pill { padding: 5px 10px !important; font-size: 11px !important; }
          /* Popular chips row — tighter */
          .search-card-wrap .pop-row { gap: 5px !important; }
          .search-card-wrap .pop-chip { padding: 4px 10px !important; font-size: 10px !important; }
          /* Card padding tighter */
          .search-card-inner { padding: 12px 14px 12px !important; }
        }
      `}</style>
    </div>
  );
}
