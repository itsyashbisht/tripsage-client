import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  changeUserPassword,
  clearUserSuccess,
  fetchSavedPlans,
  fetchUserProfile,
  logoutUser,
  removeSavedPlan,
  selectCurrentUser,
  selectIsAuthenticated,
  selectSavedPlans,
  selectUserError,
  selectUserLoading,
  selectUserProfile,
  selectUserSuccess,
  updateUserDetails,
} from "../store";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  AlertCircle,
  Bookmark,
  Calendar,
  Check,
  Edit3,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Shield,
  Trash2,
  User,
  Zap,
} from "lucide-react";

// ── Design tokens
const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const FM = "'DM Mono', monospace";
const SAF = "#E8650A";
const SAF_LT = "#FF8C2A";
const INK = "#0E0A06";

const TIER_ICON = { economy: "🪙", standard: "⭐", luxury: "💎" };
const TIER_COLOR = { economy: "#16A34A", standard: SAF, luxury: "#9333EA" };
const TIER_BG = { economy: "#DCFCE7", standard: "#FDF0E6", luxury: "#F5F3FF" };

const fadeUp = (d = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d },
  },
});
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

// ── Data helpers
const deriveUser = (profile, auth) => profile?.user || auth;
const deriveSaved = (raw) => (Array.isArray(raw) ? raw : (raw?.saved ?? []));

// ── Avatar gradient seeded from name ─────────────────────────────────────────
const AVATAR_PALETTES = [
  ["#FF6B35", "#F7931E"],
  ["#E8650A", "#FFB347"],
  ["#667EEA", "#764BA2"],
  ["#11998E", "#38EF7D"],
  ["#FC466B", "#3F5EFB"],
  ["#F7971E", "#FFD200"],
];
const avatarColors = (name) =>
  AVATAR_PALETTES[(name?.charCodeAt(0) || 65) % AVATAR_PALETTES.length];

// SUB-COMPONENTS
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  const isErr = type === "error";
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "max-content",
        maxWidth: "calc(100vw - 32px)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: isErr ? "rgba(30,10,10,0.94)" : "rgba(10,30,10,0.94)",
        borderRadius: 999,
        padding: "12px 20px 12px 14px",
        backdropFilter: "blur(24px)",
        boxShadow: `0 20px 60px ${isErr ? "rgba(239,68,68,0.3)" : "rgba(22,163,74,0.25)"}`,
        border: `1px solid ${isErr ? "rgba(239,68,68,0.3)" : "rgba(22,163,74,0.3)"}`,
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          flexShrink: 0,
          background: isErr ? "rgba(239,68,68,0.2)" : "rgba(22,163,74,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isErr ? (
          <AlertCircle size={15} style={{ color: "#F87171" }} />
        ) : (
          <Check size={15} style={{ color: "#4ADE80" }} />
        )}
      </div>
      <span
        style={{
          fontFamily: F,
          fontSize: 13,
          fontWeight: 600,
          color: isErr ? "#FCA5A5" : "#86EFAC",
        }}
      >
        {message}
      </span>
    </motion.div>
  );
}

// Floating glass pill used in the hero strip
function HeroPill({ icon, label, value, delay = 0 }) {
  return (
    <motion.div
      variants={fadeUp(delay)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.13)",
        borderRadius: 18,
        padding: "12px 18px",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          flexShrink: 0,
          background: `linear-gradient(135deg, ${SAF}33, ${SAF}11)`,
          border: `1px solid ${SAF}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            margin: 0,
            fontFamily: FM,
            fontSize: 17,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </p>
        <p
          style={{
            margin: "3px 0 0",
            fontFamily: F,
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
            fontWeight: 500,
          }}
        >
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// Content card wrapper
function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 24,
        border: "1px solid rgba(232,101,10,0.08)",
        boxShadow: "0 2px 20px rgba(14,10,6,0.06)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Labelled input with icon and focus ring
function Field({ label, children }) {
  return (
    <div>
      <p
        style={{
          fontFamily: FM,
          fontSize: 10,
          fontWeight: 700,
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function Input({
  type = "text",
  value,
  onChange,
  icon: Icon,
  placeholder,
  disabled,
}) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div style={{ position: "relative" }}>
      {Icon && (
        <Icon
          size={14}
          style={{
            position: "absolute",
            left: 15,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#BDB5AD",
            pointerEvents: "none",
          }}
        />
      )}
      <input
        type={isPw && show ? "text" : type}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          width: "100%",
          boxSizing: "border-box",
          paddingLeft: Icon ? 42 : 16,
          paddingRight: isPw ? 46 : 16,
          paddingTop: 13,
          paddingBottom: 13,
          background: disabled ? "#FAFAF9" : "#FFFDF9",
          border: "1.5px solid #EDE7DE",
          borderRadius: 14,
          fontFamily: F,
          fontSize: 14,
          color: disabled ? "#9CA3AF" : INK,
          outline: "none",
          transition: "border-color 0.18s, box-shadow 0.18s",
          cursor: disabled ? "not-allowed" : "text",
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = SAF;
            e.target.style.boxShadow = `0 0 0 3px ${SAF}1A`;
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#EDE7DE";
          e.target.style.boxShadow = "none";
        }}
      />
      {isPw && (
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#BDB5AD",
            padding: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
}

function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        background: "#FFF1F1",
        border: "1px solid #FED7D7",
        borderRadius: 14,
        padding: "12px 16px",
      }}
    >
      <AlertCircle
        size={14}
        style={{ color: "#E53E3E", flexShrink: 0, marginTop: 1 }}
      />
      <span
        style={{
          fontFamily: F,
          fontSize: 13,
          color: "#C53030",
          lineHeight: 1.5,
        }}
      >
        {msg}
      </span>
    </motion.div>
  );
}

// Password strength meter
function StrengthBar({ password }) {
  if (!password) return null;
  const score =
    password.length < 6
      ? 1
      : password.length < 10
        ? 2
        : /[A-Z]/.test(password) && /[0-9]/.test(password)
          ? 4
          : 3;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ background: i <= score ? colors[score] : "#EDE7DE" }}
            transition={{ duration: 0.3 }}
            style={{ height: 3, flex: 1, borderRadius: 99 }}
          />
        ))}
      </div>
      <p
        style={{
          fontFamily: FM,
          fontSize: 11,
          color: colors[score],
          margin: 0,
        }}
      >
        {labels[score]}
      </p>
    </div>
  );
}

// MAIN PAGE
export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 100]);

  // Redux
  const isAuth = useSelector(selectIsAuthenticated);
  const authUser = useSelector(selectCurrentUser);
  const profile = useSelector(selectUserProfile);
  const savedRaw = useSelector(selectSavedPlans);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const success = useSelector(selectUserSuccess);

  const user = deriveUser(profile, authUser);
  const saved = deriveSaved(savedRaw);

  // Local state
  const [tab, setTab] = useState("profile");
  const [toast, setToast] = useState(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confPw, setConfPw] = useState("");
  const [pwErr, setPwErr] = useState("");

  // Auth guard
  useEffect(() => {
    if (!isAuth) navigate("/login", { replace: true });
  }, [isAuth, navigate]);

  // Fetch
  useEffect(() => {
    if (isAuth) {
      dispatch(fetchUserProfile());
      dispatch(fetchSavedPlans());
    }
  }, [dispatch, isAuth]);

  // Seed form
  useEffect(() => {
    if (user) {
      setName(user.fullname || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  // Toasts
  useEffect(() => {
    if (success.updateDetails) {
      setToast({ message: "Profile updated!", type: "success" });
      dispatch(clearUserSuccess("updateDetails"));
    }
  }, [success.updateDetails, dispatch]);

  useEffect(() => {
    if (success.changePassword) {
      setToast({ message: "Password changed!", type: "success" });
      setCurPw("");
      setNewPw("");
      setConfPw("");
      dispatch(clearUserSuccess("changePassword"));
    }
  }, [success.changePassword, dispatch]);

  // Handlers
  const handleProfile = (e) => {
    e.preventDefault();
    dispatch(updateUserDetails({ name, avatar }));
  };
  const handlePassword = (e) => {
    e.preventDefault();
    setPwErr("");
    if (!curPw) return setPwErr("Enter your current password.");
    if (newPw.length < 8)
      return setPwErr("New password must be at least 8 characters.");
    if (newPw !== confPw) return setPwErr("Passwords don't match.");
    dispatch(
      changeUserPassword({ currentPassword: curPw, newPassword: newPw }),
    );
  };
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  // Avatar
  const initial = (user?.name || "?")[0].toUpperCase();
  const [c1, c2] = avatarColors(user?.name);
  const joinedAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : null;

  const TABS = [
    { id: "profile", label: "Profile", icon: User, hint: "Personal details" },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      hint: "Password & safety",
    },
    { id: "saved", label: "Saved Trips", icon: Bookmark, badge: saved.length },
  ];

  if (loading.profile && !user) {
    return (
      <div style={{ fontFamily: F, background: "#FDFAF7", minHeight: "100vh" }}>
        <Navbar />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
          }}
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                margin: "0 auto 16px",
                background: `linear-gradient(135deg,${c1},${c2})`,
              }}
            />
            <p style={{ fontFamily: FM, fontSize: 12, color: "#9CA3AF" }}>
              Loading…
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: F, background: "#FDFAF7", minHeight: "100vh" }}>
      <Navbar />

      {/* ══ CSS ══════════════════════════════════════════════════════════════ */}
      <style>{`
        /* Layout */
        .pg { max-width:1100px; margin:0 auto; padding:36px clamp(16px,4vw,28px) 100px;
              display:grid; grid-template-columns:248px 1fr; gap:24px; align-items:start; }
        .pg-sidebar { display:flex; flex-direction:column; gap:14px; position:sticky; top:24px; }
        .pg-mobile-nav { display:none; }
        .pg-2col { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr)); gap:18px; }
        .pg-plan { display:flex; align-items:center; gap:14px; }

        /* Tab hover */
        .pg-tab:hover { background:#FDF0E6 !important; }
        .pg-tab:hover .pg-tab-icon { background:${SAF} !important; }
        .pg-tab:hover .pg-tab-icon svg { color:#fff !important; }
        .pg-tab:hover .pg-tab-label { color:${SAF} !important; }

        /* Plan card hover */
        .pg-plan-card { transition:box-shadow .2s,transform .2s; cursor:default; }
        .pg-plan-card:hover { box-shadow:0 8px 32px rgba(232,101,10,0.10) !important; transform:translateY(-2px); }

        /* Mobile */
        @media(max-width:860px){
          .pg { grid-template-columns:1fr; padding-top:0; }
          .pg-sidebar { display:none !important; }
          .pg-mobile-nav { display:flex !important; }
        }
        @media(max-width:480px){
          .pg-plan { flex-wrap:wrap; }
          .pg-plan-actions { width:100%; justify-content:flex-end; }
        }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{ position: "relative", minHeight: 380, overflow: "hidden" }}
      >
        {/* Parallax photo */}
        <motion.div
          style={{
            y: bgY,
            position: "absolute",
            inset: "-20% 0",
            zIndex: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center 38%",
          }}
        />

        {/* Same cinematic overlays as ResultsPage */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(to bottom, rgba(5,2,10,0.52) 0%, rgba(14,8,4,0.96) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "radial-gradient(ellipse at 15% 60%, rgba(232,101,10,0.20) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "radial-gradient(ellipse at 85% 110%, rgba(232,101,10,0.28) 0%, transparent 50%)",
          }}
        />

        {/* Subtle dot-grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            opacity: 0.35,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1100,
            margin: "0 auto",
            padding: "clamp(100px,14vw,130px) clamp(16px,4vw,28px) 48px",
          }}
        >
          <motion.div variants={stagger} initial="hidden" animate="show">
            {/* Top row: avatar + info + signout */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 24,
                flexWrap: "wrap",
                marginBottom: 36,
              }}
            >
              {/* Avatar — large, glowing */}
              <motion.div variants={fadeUp(0)} style={{ flexShrink: 0 }}>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 28,
                    overflow: "hidden",
                    background: avatar
                      ? "transparent"
                      : `linear-gradient(145deg, ${c1} 0%, ${c2} 100%)`,
                    border: "2px solid rgba(255,255,255,0.16)",
                    boxShadow: `0 0 0 6px rgba(232,101,10,0.14), 0 20px 60px rgba(0,0,0,0.5)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 38,
                    fontWeight: 900,
                    color: "#fff",
                    position: "relative",
                  }}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    initial
                  )}
                  {/* top-glint */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "40%",
                      background:
                        "linear-gradient(to bottom,rgba(255,255,255,0.16),transparent)",
                      borderRadius: "28px 28px 0 0",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </motion.div>

              {/* Name block */}
              <motion.div
                variants={fadeUp(0.07)}
                style={{ flex: 1, minWidth: 0 }}
              >
                <p
                  style={{
                    fontFamily: FM,
                    fontSize: 11,
                    color: SAF,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                  }}
                >
                  ✦ Traveller Profile
                </p>
                <h1
                  style={{
                    color: "#fff",
                    fontWeight: 900,
                    margin: "0 0 10px",
                    fontSize: "clamp(1.6rem,4.5vw,2.8rem)",
                    lineHeight: 1.04,
                    letterSpacing: "-0.025em",
                    textShadow: "0 4px 32px rgba(0,0,0,0.5)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.name || "Traveller"}
                </h1>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: F,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    <Mail size={12} />
                    {user?.email}
                  </span>
                  {joinedAt && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: FM,
                        fontSize: 11,
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      <Calendar size={11} /> Since {joinedAt}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Sign out */}
              <motion.div variants={fadeUp(0.12)}>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{
                    scale: 1.04,
                    background: "rgba(255,255,255,0.14)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 999,
                    padding: "10px 20px",
                    color: "rgba(255,255,255,0.65)",
                    fontFamily: F,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    backdropFilter: "blur(12px)",
                    transition: "background 0.2s",
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </motion.button>
              </motion.div>
            </div>

            {/* Stat pills row */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <HeroPill
                delay={0.18}
                icon={<Bookmark size={15} style={{ color: SAF }} />}
                label="Saved Trips"
                value={saved.length}
              />
              <HeroPill
                delay={0.24}
                icon={<Zap size={15} style={{ color: SAF }} />}
                label="Status"
                value={user?.isVerified ? "Verified ✓" : "Active"}
              />
              <HeroPill
                delay={0.3}
                icon={<Shield size={15} style={{ color: SAF }} />}
                label="Account Type"
                value={
                  user?.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : "User"
                }
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ MOBILE TAB NAV ═══════════════════════════════════════════════════ */}
      <div
        className="pg-mobile-nav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(255,253,249,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #EDE7DE",
          padding: "8px 16px",
          gap: 6,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "8px 4px",
              borderRadius: 14,
              background: tab === t.id ? "#FDF0E6" : "transparent",
              border: "none",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <t.icon
              size={17}
              style={{ color: tab === t.id ? SAF : "#9CA3AF" }}
            />
            <span
              style={{
                fontFamily: F,
                fontSize: 10,
                fontWeight: tab === t.id ? 700 : 500,
                color: tab === t.id ? SAF : "#9CA3AF",
              }}
            >
              {t.label}
            </span>
            {t.badge > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: "50%",
                  transform: "translateX(120%)",
                  background: SAF,
                  color: "#fff",
                  borderRadius: 999,
                  fontSize: 9,
                  fontWeight: 800,
                  padding: "1px 5px",
                }}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══ PAGE BODY ════════════════════════════════════════════════════════ */}
      <div className="pg">
        {/* ── Desktop sidebar ──────────────────────────────────────────── */}
        <aside className="pg-sidebar">
          {/* Tab nav card */}
          <Card>
            <div style={{ padding: 8 }}>
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="pg-tab"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 13,
                    padding: "12px 14px",
                    borderRadius: 16,
                    marginBottom: i < TABS.length - 1 ? 4 : 0,
                    background: tab === t.id ? "#FDF0E6" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.18s",
                  }}
                >
                  <div
                    className="pg-tab-icon"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 11,
                      flexShrink: 0,
                      background: tab === t.id ? SAF : "#F5EFE8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.18s",
                    }}
                  >
                    <t.icon
                      size={15}
                      style={{ color: tab === t.id ? "#fff" : "#9CA3AF" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      className="pg-tab-label"
                      style={{
                        fontFamily: F,
                        fontWeight: 700,
                        fontSize: 13,
                        color: tab === t.id ? SAF : INK,
                        margin: 0,
                        transition: "color 0.18s",
                      }}
                    >
                      {t.label}
                    </p>
                    {t.hint && (
                      <p
                        style={{
                          fontFamily: F,
                          fontSize: 11,
                          color: "#BDB5AD",
                          margin: "2px 0 0",
                        }}
                      >
                        {t.hint}
                      </p>
                    )}
                  </div>
                  {t.badge > 0 && (
                    <span
                      style={{
                        background: SAF,
                        color: "#fff",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "2px 9px",
                        flexShrink: 0,
                      }}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Mini profile card */}
          <div
            style={{
              background: `linear-gradient(145deg, ${INK} 0%, #261508 100%)`,
              borderRadius: 22,
              padding: "22px",
              boxShadow: "0 12px 40px rgba(14,10,6,0.28)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  overflow: "hidden",
                  flexShrink: 0,
                  background: `linear-gradient(135deg,${c1},${c2})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  initial
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: F,
                    fontWeight: 800,
                    fontSize: 14,
                    color: "#fff",
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.name || "Traveller"}
                </p>
                <p
                  style={{
                    fontFamily: FM,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.35)",
                    margin: "3px 0 0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.email}
                </p>
              </div>
            </div>
            {/* Quick stats */}
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { v: saved.length, l: "Saved" },
                { v: user?.isVerified ? "✓" : "—", l: "Verified" },
                { v: joinedAt?.split(" ")[1] || "—", l: "Joined" },
              ].map((s) => (
                <div
                  key={s.l}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 12,
                    padding: "10px 6px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: FM,
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#fff",
                      margin: 0,
                    }}
                  >
                    {s.v}
                  </p>
                  <p
                    style={{
                      fontFamily: F,
                      fontSize: 10,
                      color: "rgba(255,255,255,0.35)",
                      margin: "3px 0 0",
                    }}
                  >
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Content area ─────────────────────────────────────────────── */}
        <div style={{ minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* ════════════════════════════
                  PROFILE TAB
              ════════════════════════════ */}
              {tab === "profile" && (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  style={{ display: "flex", flexDirection: "column", gap: 18 }}
                >
                  {/* Main form card */}
                  <motion.div variants={fadeUp(0)}>
                    <Card>
                      {/* Card header with saffron accent bar */}
                      <div
                        style={{
                          padding: "22px 26px 18px",
                          borderBottom: "1px solid rgba(232,101,10,0.08)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 4,
                              height: 22,
                              borderRadius: 99,
                              background: SAF,
                            }}
                          />
                          <div>
                            <h3
                              style={{
                                fontFamily: F,
                                fontWeight: 800,
                                fontSize: "0.95rem",
                                color: INK,
                                margin: 0,
                              }}
                            >
                              Personal Information
                            </h3>
                            <p
                              style={{
                                fontFamily: FM,
                                fontSize: 11,
                                color: "#BDB5AD",
                                margin: "2px 0 0",
                              }}
                            >
                              Updates reflected immediately across the app
                            </p>
                          </div>
                        </div>
                      </div>

                      <form
                        onSubmit={handleProfile}
                        style={{
                          padding: "24px 26px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 20,
                        }}
                      >
                        {/* Avatar preview strip */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            background:
                              "linear-gradient(135deg,#FDF0E6,#FFF8F2)",
                            border: "1px solid rgba(232,101,10,0.12)",
                            borderRadius: 18,
                            padding: "16px 20px",
                          }}
                        >
                          <div
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: 16,
                              overflow: "hidden",
                              background: `linear-gradient(135deg,${c1},${c2})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 22,
                              fontWeight: 900,
                              color: "#fff",
                              flexShrink: 0,
                              border: "2px solid rgba(255,255,255,0.6)",
                              boxShadow: "0 4px 16px rgba(232,101,10,0.18)",
                            }}
                          >
                            {avatar ? (
                              <img
                                src={avatar}
                                alt=""
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                            ) : (
                              initial
                            )}
                          </div>
                          <div>
                            <p
                              style={{
                                fontFamily: F,
                                fontWeight: 700,
                                fontSize: 14,
                                color: INK,
                                margin: "0 0 3px",
                              }}
                            >
                              {name || user?.name || "Your Name"}
                            </p>
                            <p
                              style={{
                                fontFamily: FM,
                                fontSize: 11,
                                color: "#9CA3AF",
                                margin: 0,
                              }}
                            >
                              {avatar
                                ? "Custom avatar active"
                                : "Using initial avatar — add a URL below"}
                            </p>
                          </div>
                          {avatar && (
                            <button
                              type="button"
                              onClick={() => setAvatar("")}
                              style={{
                                marginLeft: "auto",
                                background: "none",
                                border: "1px solid #EDE7DE",
                                borderRadius: 999,
                                padding: "5px 12px",
                                fontFamily: F,
                                fontSize: 11,
                                color: "#9CA3AF",
                                cursor: "pointer",
                                flexShrink: 0,
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        {/* Fields */}
                        <div className="pg-2col">
                          <Field label="Full Name">
                            <Input
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              icon={User}
                              placeholder="Your name"
                            />
                          </Field>
                          <Field label="Email Address">
                            <Input
                              type="email"
                              value={user?.email || ""}
                              icon={Mail}
                              disabled
                            />
                          </Field>
                        </div>
                        <Field label="Avatar URL">
                          <Input
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                          />
                        </Field>

                        <ErrBox msg={error.updateDetails} />

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <motion.button
                            type="submit"
                            disabled={loading.updateDetails}
                            whileHover={{
                              scale: 1.03,
                              boxShadow: `0 10px 32px ${SAF}50`,
                            }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              background: loading.updateDetails
                                ? "#F5EDE4"
                                : SAF,
                              color: loading.updateDetails ? SAF : "#fff",
                              border: "none",
                              borderRadius: 999,
                              padding: "13px 30px",
                              fontFamily: F,
                              fontSize: 14,
                              fontWeight: 700,
                              cursor: loading.updateDetails
                                ? "wait"
                                : "pointer",
                              boxShadow: `0 6px 22px ${SAF}38`,
                              transition: "all 0.2s",
                            }}
                          >
                            {loading.updateDetails ? (
                              "⟳ Saving…"
                            ) : (
                              <>
                                <Edit3 size={14} /> Save Changes
                              </>
                            )}
                          </motion.button>
                        </div>
                      </form>
                    </Card>
                  </motion.div>

                  {/* Account details — dark card */}
                  <motion.div variants={fadeUp(0.1)}>
                    <div
                      style={{
                        background: `linear-gradient(135deg, ${INK} 0%, #1C1008 100%)`,
                        borderRadius: 24,
                        padding: "24px 26px",
                        border: "1px solid rgba(255,255,255,0.06)",
                        boxShadow: "0 8px 40px rgba(14,10,6,0.22)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 20,
                        }}
                      >
                        <div
                          style={{
                            width: 4,
                            height: 20,
                            borderRadius: 99,
                            background: SAF,
                          }}
                        />
                        <p
                          style={{
                            fontFamily: F,
                            fontWeight: 800,
                            fontSize: "0.9rem",
                            color: "#fff",
                            margin: 0,
                          }}
                        >
                          Account Details
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0,
                        }}
                      >
                        {[
                          {
                            label: "Status",
                            val: user?.isVerified
                              ? "✅ Verified"
                              : "⏳ Pending",
                            mono: false,
                          },
                          {
                            label: "Role",
                            val: user?.role || "user",
                            mono: true,
                          },
                          {
                            label: "Member Since",
                            val: joinedAt || "—",
                            mono: true,
                          },
                          {
                            label: "User ID",
                            val: (user?._id || "").slice(-10).toUpperCase(),
                            mono: true,
                          },
                        ].map((row, i, arr) => (
                          <div
                            key={row.label}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "13px 0",
                              gap: 16,
                              borderBottom:
                                i < arr.length - 1
                                  ? "1px solid rgba(255,255,255,0.06)"
                                  : "none",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: F,
                                fontSize: 13,
                                color: "rgba(255,255,255,0.4)",
                              }}
                            >
                              {row.label}
                            </span>
                            <span
                              style={{
                                fontFamily: row.mono ? FM : F,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.82)",
                                letterSpacing: row.mono ? "0.04em" : 0,
                              }}
                            >
                              {row.val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* ════════════════════════════
                  SECURITY TAB
              ════════════════════════════ */}
              {tab === "security" && (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  style={{ display: "flex", flexDirection: "column", gap: 18 }}
                >
                  <motion.div variants={fadeUp(0)}>
                    <Card>
                      <div
                        style={{
                          padding: "22px 26px 18px",
                          borderBottom: "1px solid rgba(232,101,10,0.08)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 4,
                              height: 22,
                              borderRadius: 99,
                              background: INK,
                            }}
                          />
                          <div>
                            <h3
                              style={{
                                fontFamily: F,
                                fontWeight: 800,
                                fontSize: "0.95rem",
                                color: INK,
                                margin: 0,
                              }}
                            >
                              Change Password
                            </h3>
                            <p
                              style={{
                                fontFamily: FM,
                                fontSize: 11,
                                color: "#BDB5AD",
                                margin: "2px 0 0",
                              }}
                            >
                              Use a strong password with letters, numbers &
                              symbols
                            </p>
                          </div>
                        </div>
                      </div>

                      <form
                        onSubmit={handlePassword}
                        style={{
                          padding: "24px 26px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 20,
                        }}
                      >
                        <Field label="Current Password">
                          <Input
                            type="password"
                            value={curPw}
                            onChange={(e) => setCurPw(e.target.value)}
                            icon={Lock}
                            placeholder="Your current password"
                          />
                        </Field>

                        {/* Divider */}
                        <div
                          style={{
                            height: 1,
                            background:
                              "linear-gradient(to right,transparent,#EDE7DE,transparent)",
                            margin: "0 -4px",
                          }}
                        />

                        <Field label="New Password">
                          <Input
                            type="password"
                            value={newPw}
                            onChange={(e) => setNewPw(e.target.value)}
                            icon={Lock}
                            placeholder="At least 8 characters"
                          />
                        </Field>

                        {/* Strength meter */}
                        <StrengthBar password={newPw} />

                        <Field label="Confirm New Password">
                          <Input
                            type="password"
                            value={confPw}
                            onChange={(e) => setConfPw(e.target.value)}
                            icon={Lock}
                            placeholder="Repeat new password"
                          />
                        </Field>

                        {/* Match indicator */}
                        {confPw && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                              fontFamily: FM,
                              fontSize: 12,
                              margin: "-8px 0 0",
                              color: newPw === confPw ? "#10B981" : "#EF4444",
                            }}
                          >
                            {newPw === confPw
                              ? "✓ Passwords match"
                              : "✗ Passwords do not match"}
                          </motion.p>
                        )}

                        <ErrBox msg={pwErr || error.changePassword} />

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <motion.button
                            type="submit"
                            disabled={loading.changePassword}
                            whileHover={{
                              scale: 1.03,
                              boxShadow: "0 10px 32px rgba(14,10,6,0.35)",
                            }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              background: loading.changePassword
                                ? "#F3F4F6"
                                : INK,
                              color: loading.changePassword
                                ? "#6B7280"
                                : "#fff",
                              border: "none",
                              borderRadius: 999,
                              padding: "13px 30px",
                              fontFamily: F,
                              fontSize: 14,
                              fontWeight: 700,
                              cursor: loading.changePassword
                                ? "wait"
                                : "pointer",
                              boxShadow: "0 6px 22px rgba(14,10,6,0.22)",
                              transition: "all 0.2s",
                            }}
                          >
                            {loading.changePassword ? (
                              "⟳ Updating…"
                            ) : (
                              <>
                                <Shield size={14} /> Update Password
                              </>
                            )}
                          </motion.button>
                        </div>
                      </form>
                    </Card>
                  </motion.div>

                  {/* Security info card — dark */}
                  <motion.div variants={fadeUp(0.1)}>
                    <div
                      style={{
                        background: `linear-gradient(135deg, ${INK} 0%, #1C1008 100%)`,
                        borderRadius: 24,
                        padding: "24px 26px",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: FM,
                          fontSize: 11,
                          color: SAF,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          margin: "0 0 16px",
                        }}
                      >
                        Security Tips
                      </p>
                      {[
                        ["🔐", "Mix uppercase, lowercase, numbers and symbols"],
                        ["🔄", "Never reuse passwords from other services"],
                        ["🚫", "Don't share your password with anyone"],
                        ["⏱️", "Change your password every few months"],
                      ].map(([icon, tip]) => (
                        <div
                          key={tip}
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "flex-start",
                            paddingBottom: 12,
                            marginBottom: 12,
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 16,
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            {icon}
                          </span>
                          <p
                            style={{
                              fontFamily: F,
                              fontSize: 13,
                              color: "rgba(255,255,255,0.5)",
                              margin: 0,
                              lineHeight: 1.6,
                            }}
                          >
                            {tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* ════════════════════════════
                  SAVED TRIPS TAB
              ════════════════════════════ */}
              {tab === "saved" && (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  style={{ display: "flex", flexDirection: "column", gap: 18 }}
                >
                  <motion.div variants={fadeUp(0)}>
                    <Card>
                      <div
                        style={{
                          padding: "22px 26px 18px",
                          borderBottom: "1px solid rgba(232,101,10,0.08)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 4,
                                height: 22,
                                borderRadius: 99,
                                background: SAF,
                              }}
                            />
                            <div>
                              <h3
                                style={{
                                  fontFamily: F,
                                  fontWeight: 800,
                                  fontSize: "0.95rem",
                                  color: INK,
                                  margin: 0,
                                }}
                              >
                                Saved Trips
                              </h3>
                              <p
                                style={{
                                  fontFamily: FM,
                                  fontSize: 11,
                                  color: "#BDB5AD",
                                  margin: "2px 0 0",
                                }}
                              >
                                {saved.length > 0
                                  ? `${saved.length} trip${saved.length !== 1 ? "s" : ""} in your collection`
                                  : "Your travel wishlist lives here"}
                              </p>
                            </div>
                          </div>
                          {saved.length > 0 && (
                            <span
                              style={{
                                fontFamily: FM,
                                fontSize: 12,
                                color: "#9CA3AF",
                              }}
                            >
                              {saved.length} total
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ padding: "16px" }}>
                        {/* Skeleton */}
                        {loading.savedPlans && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 10,
                            }}
                          >
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ opacity: [0.4, 0.9, 0.4] }}
                                transition={{
                                  duration: 1.6,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                                style={{
                                  height: 82,
                                  borderRadius: 18,
                                  background:
                                    "linear-gradient(90deg,#F5EFE8,#EDE7DC,#F5EFE8)",
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {/* Empty */}
                        {!loading.savedPlans && saved.length === 0 && (
                          <div
                            style={{
                              textAlign: "center",
                              padding: "52px 24px",
                            }}
                          >
                            <motion.div
                              animate={{
                                y: [0, -10, 0],
                                rotate: [0, 5, -5, 0],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              style={{ fontSize: 56, marginBottom: 20 }}
                            >
                              🗺️
                            </motion.div>
                            <p
                              style={{
                                fontWeight: 800,
                                fontSize: "1.1rem",
                                color: INK,
                                marginBottom: 8,
                              }}
                            >
                              No saved trips yet
                            </p>
                            <p
                              style={{
                                color: "#9CA3AF",
                                fontSize: 14,
                                marginBottom: 30,
                                lineHeight: 1.7,
                              }}
                            >
                              Plan a trip and tap <strong>Save Trip</strong> to
                              find it here.
                            </p>
                            <Link
                              to="/planner"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                background: SAF,
                                color: "#fff",
                                borderRadius: 999,
                                padding: "13px 30px",
                                fontWeight: 700,
                                fontSize: 14,
                                textDecoration: "none",
                                boxShadow: `0 8px 28px ${SAF}44`,
                              }}
                            >
                              <MapPin size={15} /> Plan a Trip
                            </Link>
                          </div>
                        )}

                        {/* Trip cards */}
                        {!loading.savedPlans && saved.length > 0 && (
                          <motion.div
                            variants={stagger}
                            initial="hidden"
                            animate="show"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 10,
                            }}
                          >
                            {saved.map((plan) => {
                              const itin = plan.itinerary || plan;
                              const planId = plan._id || itin._id;
                              const tier = (
                                itin.budgetTier || "standard"
                              ).toLowerCase();

                              return (
                                <motion.div
                                  key={planId}
                                  variants={fadeUp(0)}
                                  className="pg-plan-card pg-plan"
                                  style={{
                                    background: "#FDFAF7",
                                    border: "1.5px solid #EDE7DE",
                                    borderRadius: 18,
                                    padding: "15px 18px",
                                  }}
                                >
                                  {/* Tier badge */}
                                  <div
                                    style={{
                                      width: 52,
                                      height: 52,
                                      borderRadius: 15,
                                      flexShrink: 0,
                                      background: TIER_BG[tier] || "#FDF0E6",
                                      border: "1.5px solid rgba(0,0,0,0.05)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 26,
                                    }}
                                  >
                                    {TIER_ICON[tier] || "⭐"}
                                  </div>

                                  {/* Info */}
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <p
                                      style={{
                                        fontWeight: 800,
                                        fontSize: 14,
                                        color: INK,
                                        margin: "0 0 5px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {itin.title ||
                                        itin.destinationName ||
                                        "Trip Plan"}
                                    </p>
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 7,
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                      }}
                                    >
                                      {itin.totalDays && (
                                        <span
                                          style={{
                                            fontFamily: FM,
                                            fontSize: 11,
                                            color: "#9CA3AF",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 3,
                                          }}
                                        >
                                          <Calendar size={10} />{" "}
                                          {itin.totalDays}N
                                        </span>
                                      )}
                                      <span
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: 4,
                                          fontSize: 11,
                                          fontWeight: 700,
                                          textTransform: "capitalize",
                                          color: TIER_COLOR[tier] || SAF,
                                          background:
                                            TIER_BG[tier] || "#FDF0E6",
                                          padding: "2px 10px",
                                          borderRadius: 999,
                                        }}
                                      >
                                        {TIER_ICON[tier]} {tier}
                                      </span>
                                      {itin.destinationName && (
                                        <span
                                          style={{
                                            fontSize: 11,
                                            color: "#BDB5AD",
                                            fontFamily: F,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 3,
                                          }}
                                        >
                                          <MapPin size={10} />
                                          {itin.destinationName.split(",")[0]}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div
                                    className="pg-plan-actions"
                                    style={{
                                      display: "flex",
                                      gap: 8,
                                      flexShrink: 0,
                                      alignItems: "center",
                                    }}
                                  >
                                    {itin._id && (
                                      <Link
                                        to="/results"
                                        state={{ itinerary: itin }}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 6,
                                          background: "#fff",
                                          border: "1.5px solid #EDE7DE",
                                          borderRadius: 999,
                                          padding: "8px 16px",
                                          fontSize: 13,
                                          fontWeight: 600,
                                          color: "#374151",
                                          textDecoration: "none",
                                          whiteSpace: "nowrap",
                                          boxShadow:
                                            "0 2px 8px rgba(0,0,0,0.05)",
                                          transition:
                                            "border-color 0.15s, box-shadow 0.15s",
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.borderColor =
                                            SAF;
                                          e.currentTarget.style.boxShadow = `0 4px 16px ${SAF}22`;
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.borderColor =
                                            "#EDE7DE";
                                          e.currentTarget.style.boxShadow =
                                            "0 2px 8px rgba(0,0,0,0.05)";
                                        }}
                                      >
                                        <Eye size={13} /> View
                                      </Link>
                                    )}
                                    <motion.button
                                      onClick={() =>
                                        dispatch(removeSavedPlan(itin._id))
                                      }
                                      disabled={loading.removeSaved}
                                      whileHover={{
                                        scale: 1.12,
                                        background: "#FEE2E2",
                                      }}
                                      whileTap={{ scale: 0.88 }}
                                      style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#FFF1F1",
                                        border: "1.5px solid #FECACA",
                                        cursor: loading.removeSaved
                                          ? "wait"
                                          : "pointer",
                                        transition: "background 0.18s",
                                      }}
                                    >
                                      <Trash2
                                        size={14}
                                        style={{ color: "#EF4444" }}
                                      />
                                    </motion.button>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        )}

                        <ErrBox msg={error.removeSaved} />
                      </div>
                    </Card>
                  </motion.div>

                  {/* Call to action if has trips */}
                  {saved.length > 0 && (
                    <motion.div variants={fadeUp(0.1)}>
                      <Link
                        to="/planner"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          background: `linear-gradient(135deg, ${SAF} 0%, ${SAF_LT} 100%)`,
                          color: "#fff",
                          borderRadius: 20,
                          padding: "18px",
                          fontFamily: F,
                          fontWeight: 800,
                          fontSize: 15,
                          textDecoration: "none",
                          boxShadow: `0 8px 30px ${SAF}40`,
                        }}
                      >
                        <MapPin size={16} /> Plan Another Trip
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
