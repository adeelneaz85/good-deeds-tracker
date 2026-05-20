import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const DEEDS = {
  prayers: {
    label: "🕌 Prayers", color: "#fff", bg: "#2d6a4f", cardColor: "#2d6a4f",
    items: [
      { id: "fajr", name: "Fajr Prayer", points: 15, icon: "🌅" },
      { id: "dhuhr", name: "Dhuhr Prayer", points: 10, icon: "☀️" },
      { id: "asr", name: "Asr Prayer", points: 10, icon: "🌤️" },
      { id: "maghrib", name: "Maghrib Prayer", points: 12, icon: "🌇" },
      { id: "isha", name: "Isha Prayer", points: 10, icon: "🌙" },
    ],
  },
  quran: {
    label: "📖 Quran & Dhikr", color: "#fff", bg: "#1d3557", cardColor: "#1d3557",
    items: [
      { id: "quran_read", name: "Read Quran (1 page)", points: 10, icon: "📖" },
      { id: "dhikr", name: "Morning/Evening Dhikr", points: 8, icon: "✨" },
      { id: "dua", name: "Made Du'a", points: 5, icon: "🤲" },
    ],
  },
  home: {
    label: "🏠 Home & Tidiness", color: "#fff", bg: "#c0392b", cardColor: "#c0392b",
    items: [
      { id: "made_bed", name: "Made Bed", points: 5, icon: "🛏️" },
      { id: "tidy_room", name: "Tidied Room", points: 8, icon: "🧹" },
      { id: "helped_chores", name: "Helped with Chores", points: 10, icon: "🍽️" },
      { id: "no_screen", name: "Less Screen Time (1hr)", points: 7, icon: "📵" },
    ],
  },
  school: {
    label: "🎒 School & Learning", color: "#fff", bg: "#7b2d8b", cardColor: "#7b2d8b",
    items: [
      { id: "homework", name: "Finished Homework", points: 10, icon: "📝" },
      { id: "read_book", name: "Read a Book (15 min)", points: 8, icon: "📚" },
      { id: "good_grade", name: "Got a Good Grade", points: 15, icon: "⭐" },
      { id: "helped_classmate", name: "Helped a Classmate", points: 10, icon: "🤝" },
    ],
  },
  kindness: {
    label: "💛 Kindness & Character", color: "#fff", bg: "#b5770d", cardColor: "#b5770d",
    items: [
      { id: "kind_word", name: "Said Kind Words", points: 5, icon: "💬" },
      { id: "shared", name: "Shared with Sibling", points: 8, icon: "🫶" },
      { id: "respected_parents", name: "Respected Parents", points: 12, icon: "👨‍👩‍👧" },
      { id: "no_lying", name: "Stayed Honest", points: 10, icon: "🏅" },
      { id: "sadaqah", name: "Gave Sadaqah", points: 15, icon: "💝" },
    ],
  },
  health: {
    label: "💪 Health & Routines", color: "#fff", bg: "#0077b6", cardColor: "#0077b6",
    items: [
      { id: "morning_routine", name: "Morning Routine Done", points: 8, icon: "🌞" },
      { id: "evening_routine", name: "Evening Routine Done", points: 8, icon: "🌛" },
      { id: "exercise", name: "Exercised / Played Outside", points: 10, icon: "🏃" },
      { id: "healthy_food", name: "Ate Healthy Meal", points: 5, icon: "🥗" },
      { id: "early_sleep", name: "Slept on Time", points: 7, icon: "😴" },
    ],
  },
};

const REWARDS = [
  { id: "r1", name: "Extra Screen Time (30 min)", cost: 50, icon: "📱" },
  { id: "r2", name: "Choose Dinner Tonight", cost: 75, icon: "🍕" },
  { id: "r3", name: "Stay Up 30 Min Later", cost: 80, icon: "🌙" },
  { id: "r4", name: "Special Outing", cost: 150, icon: "🎉" },
  { id: "r5", name: "New Book or Toy", cost: 200, icon: "🎁" },
  { id: "r6", name: "Trip to Favourite Restaurant", cost: 250, icon: "🍔" },
];

const AVATAR_OPTIONS = ["👦","👧","🧒","🧑","👱","🧔","👩","🧕","🧑‍🎓","🧑‍🏫","🦸","🧙","🦊","🐯","🦁","🐼","🐸","🦋","⭐","🌟"];
const PROFILE_COLORS = ["#2d6a4f","#7b2d8b","#c0392b","#0077b6","#b5770d","#1d3557","#6c3483","#e07a5f"];

// Tab backgrounds
const TAB_BG = {
  home:    { bg: "#eaf4ee", accent: "#2d6a4f" },
  log:     { bg: "#f0f4ff", accent: "#1d3557" },
  rewards: { bg: "#fff8e1", accent: "#b5770d" },
  history: { bg: "#fce8f3", accent: "#7b2d8b" },
};

const getTodayKey = () => new Date().toISOString().split("T")[0];
const load = (key, def) => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// ─── WELCOME SCREEN ──────────────────────────────────────────────────────────
function WelcomeScreen({ profiles, onSelect, onAddKid }) {
  return (
    <div style={S.page}>
      <div style={{ textAlign: "center", padding: "50px 20px 30px" }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>✨</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>Good Deeds</div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>Who's logging today?</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, width: "100%", padding: "0 20px" }}>
        {profiles.map(p => (
          <button key={p.id} onClick={() => onSelect(p)}
            style={{ background: "#fff", borderRadius: 20, padding: "22px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, border: `3px solid ${p.color}`, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>{p.avatar}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e" }}>{p.name}</div>
            <div style={{ background: p.color, color: "#fff", padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Tap to enter 🔒</div>
          </button>
        ))}
        {profiles.length < 6 && (
          <button onClick={onAddKid}
            style={{ background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "22px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, border: "3px dashed rgba(255,255,255,0.3)", cursor: "pointer" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>➕</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Add Kid</div>
          </button>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "36px 30px 0", fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
        "The best of deeds are those done consistently,<br />even if they are small."
        <br /><span style={{ fontSize: 12, opacity: 0.7 }}>— Prophet Muhammad ﷺ</span>
      </div>
    </div>
  );
}

// ─── PIN SCREEN ───────────────────────────────────────────────────────────────
function PinScreen({ profile, onSuccess, onBack }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError("");
    if (next.length === 4) setTimeout(() => verify(next), 150);
  };

  const verify = (entered) => {
    const pins = load("gdPins", {});
    if (!pins[profile.id] || pins[profile.id] === entered) { onSuccess(); return; }
    setShake(true);
    setError("Wrong PIN, try again!");
    setPin("");
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div style={S.page}>
      <button onClick={onBack} style={S.backBtn}>← Back</button>
      <div style={{ textAlign: "center", padding: "40px 20px 16px", width: "100%" }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: profile.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, margin: "0 auto 14px" }}>{profile.avatar}</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>{profile.name}</div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>Enter your PIN</div>
        {error && <div style={{ color: "#ff6b6b", fontWeight: 700, fontSize: 14, marginTop: 10 }}>{error}</div>}
      </div>

      <div style={{ display: "flex", gap: 16, margin: "16px 0 8px", animation: shake ? "shake 0.4s" : "none" }}>
        {[0,1,2,3].map(i => <div key={i} style={{ width: 20, height: 20, borderRadius: "50%", background: pin.length > i ? profile.color : "rgba(255,255,255,0.25)", transition: "background 0.2s" }} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "20px 40px", width: "100%" }}>
        {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => (
          <button key={i}
            onClick={() => k === "⌫" ? setPin(p => p.slice(0,-1)) : k ? handleDigit(k) : null}
            disabled={!k}
            style={{ padding: "18px 0", borderRadius: 16, border: "none", fontSize: 22, fontWeight: 700, cursor: k ? "pointer" : "default", fontFamily: "inherit", opacity: k ? 1 : 0, background: k === "⌫" ? "#ffe0e0" : "#fff", color: k === "⌫" ? "#c0392b" : "#1a1a2e", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
            {k}
          </button>
        ))}
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}`}</style>
    </div>
  );
}

// ─── SETUP SCREEN ─────────────────────────────────────────────────────────────
function SetupScreen({ onDone, onBack, existingColors }) {
  const [step, setStep] = useState("info"); // info | pin | confirm
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🧒");
  const [color, setColor] = useState(PROFILE_COLORS.find(c => !existingColors.includes(c)) || PROFILE_COLORS[0]);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");

  const handlePinDigit = (d) => {
    if (step === "pin") {
      if (pin.length >= 4) return;
      const next = pin + d;
      setPin(next);
      if (next.length === 4) setTimeout(() => setStep("confirm"), 300);
    } else {
      if (confirmPin.length >= 4) return;
      const next = confirmPin + d;
      setConfirmPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          if (next === pin) {
            const id = "child_" + Date.now();
            const np = { id, name: name.trim(), avatar, color };
            const pins = load("gdPins", {});
            pins[id] = pin;
            save("gdPins", pins);
            onDone(np);
          } else {
            setPinError("PINs don't match, try again");
            setPin(""); setConfirmPin(""); setStep("pin");
          }
        }, 150);
      }
    }
  };

  if (step === "info") return (
    <div style={{ ...S.page, overflowY: "auto" }}>
      <button onClick={onBack} style={S.backBtn}>← Back</button>
      <div style={{ textAlign: "center", padding: "20px 20px 10px" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, margin: "0 auto 10px" }}>{avatar}</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>New Profile</div>
      </div>

      <div style={{ width: "100%", padding: "0 20px" }}>
        <div style={S.lbl}>Name</div>
        <input style={S.inp} value={name} onChange={e => setName(e.target.value)} placeholder="Enter name..." maxLength={14} autoFocus />

        <div style={S.lbl}>Avatar</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          {AVATAR_OPTIONS.map(av => (
            <button key={av} onClick={() => setAvatar(av)}
              style={{ fontSize: 22, padding: 8, borderRadius: 12, border: "none", cursor: "pointer", background: avatar === av ? color : "#f0f0f0", transform: avatar === av ? "scale(1.2)" : "scale(1)", transition: "all 0.15s" }}>
              {av}
            </button>
          ))}
        </div>

        <div style={S.lbl}>Colour</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {PROFILE_COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              style={{ width: 34, height: 34, borderRadius: "50%", background: c, border: color === c ? "3px solid #fff" : "3px solid transparent", boxShadow: color === c ? `0 0 0 2px ${c}` : "none", cursor: "pointer" }} />
          ))}
        </div>

        <button onClick={() => name.trim() && setStep("pin")}
          style={{ width: "100%", padding: 14, borderRadius: 16, border: "none", color: "#fff", fontSize: 16, fontWeight: 800, cursor: name.trim() ? "pointer" : "not-allowed", background: name.trim() ? color : "#999", marginTop: 24, fontFamily: "inherit" }}>
          Next — Set PIN →
        </button>
      </div>
    </div>
  );

  const currentPin = step === "pin" ? pin : confirmPin;
  return (
    <div style={S.page}>
      <button onClick={() => { setStep("info"); setPin(""); setConfirmPin(""); setPinError(""); }} style={S.backBtn}>← Back</button>
      <div style={{ textAlign: "center", padding: "40px 20px 16px", width: "100%" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, margin: "0 auto 12px" }}>{avatar}</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{name}</div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>{step === "pin" ? "Choose a 4-digit PIN" : "Confirm your PIN"}</div>
        {pinError && <div style={{ color: "#ff6b6b", fontWeight: 700, fontSize: 14, marginTop: 8 }}>{pinError}</div>}
      </div>
      <div style={{ display: "flex", gap: 16, margin: "16px 0 8px" }}>
        {[0,1,2,3].map(i => <div key={i} style={{ width: 20, height: 20, borderRadius: "50%", background: currentPin.length > i ? color : "rgba(255,255,255,0.25)", transition: "background 0.2s" }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "20px 40px", width: "100%" }}>
        {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => (
          <button key={i}
            onClick={() => k === "⌫" ? (step === "pin" ? setPin(p => p.slice(0,-1)) : setConfirmPin(p => p.slice(0,-1))) : k ? handlePinDigit(k) : null}
            disabled={!k}
            style={{ padding: "18px 0", borderRadius: 16, border: "none", fontSize: 22, fontWeight: 700, cursor: k ? "pointer" : "default", fontFamily: "inherit", opacity: k ? 1 : 0, background: k === "⌫" ? "#ffe0e0" : "#fff", color: k === "⌫" ? "#c0392b" : "#1a1a2e", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function MainApp({ profile: initProfile, onLogout, profiles, setProfiles }) {
  const [profile, setProfile] = useState(initProfile);
  const [view, setView] = useState("home");
  const [data, setData] = useState(() => load("gdData", {}));
  const [toast, setToast] = useState(null);
  const [expandedCat, setExpandedCat] = useState("prayers");
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(initProfile.name);
  const [editAvatar, setEditAvatar] = useState(initProfile.avatar);
  const [editColor, setEditColor] = useState(initProfile.color);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [newPinConfirm, setNewPinConfirm] = useState("");
  const [pinStep, setPinStep] = useState("enter");
  const [pinError, setPinError] = useState("");

  useEffect(() => { save("gdData", data); }, [data]);

  const col = profile.color;
  const tabStyle = TAB_BG[view] || TAB_BG.home;

  const getPD = () => data[profile.id] || { totalPoints: 0, redeemedPoints: 0, logs: [] };
  const pd = getPD();
  const available = pd.totalPoints - pd.redeemedPoints;
  const todayLogs = pd.logs.filter(l => l.date === getTodayKey());
  const todayDeedIds = new Set(todayLogs.map(l => l.deedId));
  const todayPts = todayLogs.reduce((s, l) => s + l.points, 0);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const logDeed = (deed, cat) => {
    if (todayDeedIds.has(deed.id)) return;
    setData(prev => {
      const p = prev[profile.id] || { totalPoints: 0, redeemedPoints: 0, logs: [] };
      return { ...prev, [profile.id]: { ...p, totalPoints: p.totalPoints + deed.points, logs: [...p.logs, { deedId: deed.id, deedName: deed.name, icon: deed.icon, points: deed.points, category: cat, date: getTodayKey(), time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }] } };
    });
    showToast(`+${deed.points} pts — ${deed.name}! 🌟`);
  };

  const redeemReward = (r) => {
    if (available < r.cost) return;
    setData(prev => { const p = prev[profile.id] || { totalPoints: 0, redeemedPoints: 0, logs: [] }; return { ...prev, [profile.id]: { ...p, redeemedPoints: p.redeemedPoints + r.cost } }; });
    showToast(`Redeemed: ${r.name} ${r.icon}`);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    const updated = { ...profile, name: editName.trim(), avatar: editAvatar, color: editColor };
    setProfile(updated);
    setProfiles(prev => prev.map(p => p.id === profile.id ? updated : p));
    setShowEdit(false);
    showToast("Profile updated ✅");
  };

  const clearHistory = () => {
    setData(prev => ({ ...prev, [profile.id]: { totalPoints: 0, redeemedPoints: 0, logs: [] } }));
    setShowClearConfirm(false);
    showToast("History cleared 🗑️");
  };

  const savePinChange = (entered) => {
    if (pinStep === "enter") {
      setNewPin(entered);
      setPinStep("confirm");
    } else {
      if (entered === newPin) {
        const pins = load("gdPins", {});
        pins[profile.id] = entered;
        save("gdPins", pins);
        setShowPinChange(false);
        setNewPin(""); setNewPinConfirm(""); setPinStep("enter"); setPinError("");
        showToast("PIN updated 🔐");
      } else {
        setPinError("PINs don't match!");
        setNewPin(""); setNewPinConfirm(""); setPinStep("enter");
      }
    }
  };

  const handlePinDigit = (d) => {
    if (pinStep === "enter") {
      if (newPin.length >= 4) return;
      const next = newPin + d;
      setNewPin(next);
      if (next.length === 4) setTimeout(() => savePinChange(next), 200);
    } else {
      if (newPinConfirm.length >= 4) return;
      const next = newPinConfirm + d;
      setNewPinConfirm(next);
      if (next.length === 4) setTimeout(() => savePinChange(next), 200);
    }
  };

  const logsByDate = pd.logs.reduce((acc, l) => { acc[l.date] = acc[l.date] || []; acc[l.date].push(l); return acc; }, {});
  const sortedDates = Object.keys(logsByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div style={{ fontFamily: "'Nunito','Segoe UI',sans-serif", minHeight: "100vh", background: tabStyle.bg, maxWidth: 480, margin: "0 auto", paddingBottom: 40, transition: "background 0.3s" }}>
      {toast && <div style={S.toast}>{toast}</div>}

      {/* Edit Profile Modal */}
      {showEdit && (
        <div style={S.overlay} onClick={() => setShowEdit(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", marginBottom: 20, textAlign: "center" }}>Edit Profile ✏️</div>
            <div style={S.lbl}>Name</div>
            <input style={S.inp} value={editName} onChange={e => setEditName(e.target.value)} maxLength={14} />
            <div style={S.lbl}>Avatar</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
              {AVATAR_OPTIONS.map(av => (
                <button key={av} onClick={() => setEditAvatar(av)}
                  style={{ fontSize: 22, padding: 8, borderRadius: 12, border: "none", cursor: "pointer", background: editAvatar === av ? editColor : "#f0f0f0", transform: editAvatar === av ? "scale(1.2)" : "scale(1)", transition: "all 0.15s" }}>
                  {av}
                </button>
              ))}
            </div>
            <div style={S.lbl}>Colour</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {PROFILE_COLORS.map(c => (
                <button key={c} onClick={() => setEditColor(c)}
                  style={{ width: 34, height: 34, borderRadius: "50%", background: c, border: editColor === c ? "3px solid #fff" : "3px solid transparent", boxShadow: editColor === c ? `0 0 0 2px ${c}` : "none", cursor: "pointer" }} />
              ))}
            </div>
            <button onClick={() => { setShowPinChange(true); setShowEdit(false); }}
              style={{ width: "100%", padding: 12, borderRadius: 14, border: "2px solid #1d3557", background: "transparent", color: "#1d3557", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 16, fontFamily: "inherit" }}>
              🔐 Change PIN
            </button>
            <button onClick={saveEdit} style={{ width: "100%", padding: 14, borderRadius: 16, border: "none", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", background: editColor, marginTop: 10, fontFamily: "inherit" }}>Save ✅</button>
            <button onClick={() => setShowEdit(false)} style={{ width: "100%", padding: 12, borderRadius: 16, border: "none", background: "#eee", color: "#888", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8, fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {showPinChange && (
        <div style={S.overlay} onClick={() => { setShowPinChange(false); setNewPin(""); setNewPinConfirm(""); setPinStep("enter"); setPinError(""); }}>
          <div style={{ ...S.modal, alignItems: "center", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", marginBottom: 8, textAlign: "center" }}>🔐 Change PIN</div>
            <div style={{ fontSize: 14, color: "#666", marginBottom: 16, textAlign: "center" }}>{pinStep === "enter" ? "Enter new PIN" : "Confirm new PIN"}</div>
            {pinError && <div style={{ color: "#c0392b", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{pinError}</div>}
            <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
              {[0,1,2,3].map(i => <div key={i} style={{ width: 18, height: 18, borderRadius: "50%", background: (pinStep === "enter" ? newPin : newPinConfirm).length > i ? col : "#ddd", transition: "background 0.2s" }} />)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, width: "100%" }}>
              {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => (
                <button key={i}
                  onClick={() => k === "⌫" ? (pinStep === "enter" ? setNewPin(p => p.slice(0,-1)) : setNewPinConfirm(p => p.slice(0,-1))) : k ? handlePinDigit(k) : null}
                  disabled={!k}
                  style={{ padding: "15px 0", borderRadius: 14, border: "none", fontSize: 20, fontWeight: 700, cursor: k ? "pointer" : "default", fontFamily: "inherit", opacity: k ? 1 : 0, background: k === "⌫" ? "#ffe0e0" : "#f5f5f5", color: k === "⌫" ? "#c0392b" : "#1a1a2e" }}>
                  {k}
                </button>
              ))}
            </div>
            <button onClick={() => { setShowPinChange(false); setNewPin(""); setNewPinConfirm(""); setPinStep("enter"); setPinError(""); }}
              style={{ width: "100%", padding: 12, borderRadius: 14, border: "none", background: "#eee", color: "#888", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 14, fontFamily: "inherit" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* HEADER — only kid name + avatar */}
      <div style={{ background: `linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)`, padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Left: avatar + name only */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setShowEdit(true)}
              style={{ width: 50, height: 50, borderRadius: "50%", background: col, border: "none", fontSize: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 3px rgba(255,255,255,0.2)` }}>
              {profile.avatar}
            </button>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{profile.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>Tap avatar to edit ✏️</div>
            </div>
          </div>

          {/* Right: points badge + switch */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <div style={{ background: col, padding: "6px 14px", borderRadius: 20, fontSize: 15, fontWeight: 800, color: "#fff" }}>⭐ {available} pts</div>
            <button onClick={onLogout}
              style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "rgba(255,255,255,0.8)", padding: "5px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
              🔒 Switch
            </button>
          </div>
        </div>
      </div>

      {/* NAV — each tab has its own colour */}
      <div style={{ display: "flex", background: "#fff", padding: "8px 10px", gap: 6, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 10 }}>
        {[
          { id: "home",    label: "🏠 Home",     active: "#2d6a4f" },
          { id: "log",     label: "➕ Log",      active: "#1d3557" },
          { id: "rewards", label: "🎁 Rewards",  active: "#b5770d" },
          { id: "history", label: "📋 History",  active: "#7b2d8b" },
        ].map(n => (
          <button key={n.id} onClick={() => setView(n.id)}
            style={{ flex: 1, padding: "9px 4px", borderRadius: 12, border: "none", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: view === n.id ? 700 : 500, background: view === n.id ? n.active : "transparent", color: view === n.id ? "#fff" : "#555", transition: "all 0.2s" }}>
            {n.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "16px 16px 40px" }}>

        {/* ── HOME ── */}
        {view === "home" && (
          <div>
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, textAlign: "center", marginBottom: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize: 52 }}>{profile.avatar}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginTop: 8 }}>Assalamu Alaikum, {profile.name}! 🌙</div>
              <div style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>Keep up the great deeds today!</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ val: pd.totalPoints, label: "Total Points", c: col }, { val: available, label: "Available", c: "#c0392b" }, { val: todayLogs.length, label: "Today's Deeds", c: "#b5770d" }].map(s => (
                  <div key={s.label} style={{ flex: 1, background: "#f5f5f5", borderRadius: 14, padding: "12px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: s.c }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: "#777", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", marginBottom: 10 }}>Today's Good Deeds</div>
            {todayLogs.length === 0
              ? <div style={{ textAlign: "center", color: "#999", fontSize: 14, padding: "24px 0", background: "#fff", borderRadius: 14 }}>No deeds logged yet. Let's start! 💪</div>
              : todayLogs.map((l, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <span style={{ fontSize: 22 }}>{l.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{l.deedName}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>{l.time}</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: col }}>+{l.points}</div>
                </div>
              ))}

            <div style={{ background: "#1a1a2e", borderLeft: `4px solid ${col}`, borderRadius: 14, padding: 16, marginTop: 20 }}>
              <div style={{ fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 6 }}>
                "The best of deeds are those done consistently, even if they are small."
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>— Prophet Muhammad ﷺ (Bukhari & Muslim)</div>
            </div>
          </div>
        )}

        {/* ── LOG DEED ── */}
        {view === "log" && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>Log a Good Deed ✨</div>
            <div style={{ fontSize: 13, color: "#666", marginBottom: 14 }}>Each deed can be logged once per day.</div>
            {Object.entries(DEEDS).map(([key, cat]) => (
              <div key={key} style={{ marginBottom: 10, borderRadius: 16, overflow: "hidden" }}>
                <button onClick={() => setExpandedCat(expandedCat === key ? null : key)}
                  style={{ width: "100%", padding: "14px 18px", border: "none", borderRadius: expandedCat === key ? "16px 16px 0 0" : 16, fontSize: 15, fontWeight: 800, display: "flex", justifyContent: "space-between", cursor: "pointer", fontFamily: "inherit", background: cat.bg, color: cat.color, textAlign: "left" }}>
                  <span>{cat.label}</span><span>{expandedCat === key ? "▲" : "▼"}</span>
                </button>
                {expandedCat === key && (
                  <div style={{ background: "#fff", padding: "10px 10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, borderRadius: "0 0 16px 16px" }}>
                    {cat.items.map(deed => {
                      const done = todayDeedIds.has(deed.id);
                      return (
                        <button key={deed.id} onClick={() => logDeed(deed, cat.label)} disabled={done}
                          style={{ borderRadius: 14, padding: "14px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: done ? "#f5f5f5" : "#fff", border: done ? "2px solid #ddd" : `2px solid ${cat.bg}`, cursor: done ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: done ? "none" : "0 2px 8px rgba(0,0,0,0.07)" }}>
                          <span style={{ fontSize: 28 }}>{deed.icon}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: done ? "#aaa" : "#1a1a2e", textAlign: "center", lineHeight: 1.3 }}>{deed.name}</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: done ? "#ccc" : cat.bg }}>{done ? "✅ Done" : `+${deed.points} pts`}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── REWARDS ── */}
        {view === "rewards" && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", marginBottom: 10 }}>Rewards Store 🎁</div>
            <div style={{ borderRadius: 14, padding: "14px 18px", color: "#fff", fontSize: 15, marginBottom: 16, textAlign: "center", background: "#b5770d" }}>
              You have <strong>{available} points</strong> to spend!
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {REWARDS.map(r => {
                const can = available >= r.cost;
                return (
                  <div key={r.id} style={{ background: "#fff", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, border: can ? "2px solid #b5770d" : "2px solid #eee", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                    <span style={{ fontSize: 36 }}>{r.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", textAlign: "center", lineHeight: 1.3 }}>{r.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: can ? "#b5770d" : "#bbb" }}>⭐ {r.cost} pts</span>
                    <button onClick={() => redeemReward(r)} disabled={!can}
                      style={{ width: "100%", padding: "9px 0", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 700, cursor: can ? "pointer" : "not-allowed", background: can ? "#b5770d" : "#eee", color: can ? "#fff" : "#aaa", fontFamily: "inherit" }}>
                      {can ? "Redeem 🎉" : "Keep earning!"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {view === "history" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>History 📋</div>
              {pd.logs.length > 0 && (
                <button onClick={() => setShowClearConfirm(true)}
                  style={{ background: "#fce8f3", border: "2px solid #7b2d8b", color: "#7b2d8b", padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  🗑️ Clear History
                </button>
              )}
            </div>

            {/* Clear confirm */}
            {showClearConfirm && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, border: "2px solid #c0392b", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>⚠️ Clear all history & points?</div>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 14 }}>This will reset {profile.name}'s points and logs. This cannot be undone.</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={clearHistory} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none", background: "#c0392b", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Yes, Clear</button>
                  <button onClick={() => setShowClearConfirm(false)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none", background: "#eee", color: "#555", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                </div>
              </div>
            )}

            {sortedDates.length === 0
              ? <div style={{ textAlign: "center", color: "#999", fontSize: 14, padding: "40px 0", background: "#fff", borderRadius: 14 }}>No history yet. Start logging deeds!</div>
              : sortedDates.map(date => {
                const dayLogs = logsByDate[date];
                const dayPts = dayLogs.reduce((s, l) => s + l.points, 0);
                const label = date === getTodayKey() ? "Today" : new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
                return (
                  <div key={date} style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "0 4px" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#555" }}>{label}</span>
                      <span style={{ fontSize: 14, fontWeight: 900, color: "#7b2d8b" }}>+{dayPts} pts</span>
                    </div>
                    {dayLogs.map((l, i) => (
                      <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                        <span style={{ fontSize: 20 }}>{l.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{l.deedName}</div>
                          <div style={{ fontSize: 12, color: "#999" }}>{l.category} · {l.time}</div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: "#7b2d8b" }}>+{l.points}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [profiles, setProfiles] = useState(() => load("gdProfiles", []));
  const [screen, setScreen] = useState("welcome");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [activeProfile, setActiveProfile] = useState(null);

  useEffect(() => { save("gdProfiles", profiles); }, [profiles]);

  const handleSelect = (p) => {
    setSelectedProfile(p);
    const pins = load("gdPins", {});
    if (!pins[p.id]) { setActiveProfile(p); setScreen("app"); }
    else setScreen("pin");
  };

  const handlePinSuccess = () => { setActiveProfile(selectedProfile); setScreen("app"); };
  const handleAddKid = () => setScreen("setup");
  const handleSetupDone = (np) => { setProfiles(prev => [...prev, np]); setActiveProfile(np); setScreen("app"); };
  const handleLogout = () => { setActiveProfile(null); setSelectedProfile(null); setScreen("welcome"); };

  if (screen === "pin") return <PinScreen profile={selectedProfile} onSuccess={handlePinSuccess} onBack={() => setScreen("welcome")} />;
  if (screen === "setup") return <SetupScreen onDone={handleSetupDone} onBack={() => setScreen("welcome")} existingColors={profiles.map(p => p.color)} />;
  if (screen === "app" && activeProfile) return <MainApp profile={activeProfile} onLogout={handleLogout} profiles={profiles} setProfiles={setProfiles} />;
  return <WelcomeScreen profiles={profiles} onSelect={handleSelect} onAddKid={handleAddKid} />;
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const S = {
  page: { fontFamily: "'Nunito','Segoe UI',sans-serif", minHeight: "100vh", background: "linear-gradient(160deg,#1a1a2e 0%,#0f3460 100%)", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 0 40px", maxWidth: 480, margin: "0 auto" },
  backBtn: { alignSelf: "flex-start", margin: "16px 20px 0", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 20, fontSize: 14, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" },
  toast: { position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#2d6a4f", color: "#fff", padding: "10px 22px", borderRadius: 30, fontWeight: 700, fontSize: 15, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.3)", whiteSpace: "nowrap" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  modal: { background: "#fff", borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto" },
  lbl: { fontSize: 12, fontWeight: 700, color: "#999", marginBottom: 8, marginTop: 16, textTransform: "uppercase", letterSpacing: 0.5 },
  inp: { width: "100%", padding: "12px 16px", borderRadius: 14, border: "2px solid #e0e0e0", fontSize: 18, fontWeight: 700, fontFamily: "inherit", outline: "none", color: "#1a1a2e", boxSizing: "border-box" },
};
