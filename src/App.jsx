import { useState, useEffect } from "react";

const DEEDS = {
  prayers: {
    label: "🕌 Prayers",
    color: "#2d6a4f",
    bg: "#d8f3dc",
    items: [
      { id: "fajr", name: "Fajr Prayer", points: 15, icon: "🌅" },
      { id: "dhuhr", name: "Dhuhr Prayer", points: 10, icon: "☀️" },
      { id: "asr", name: "Asr Prayer", points: 10, icon: "🌤️" },
      { id: "maghrib", name: "Maghrib Prayer", points: 12, icon: "🌇" },
      { id: "isha", name: "Isha Prayer", points: 10, icon: "🌙" },
    ],
  },
  quran: {
    label: "📖 Quran & Dhikr",
    color: "#1d3557",
    bg: "#dde8f8",
    items: [
      { id: "quran_read", name: "Read Quran (1 page)", points: 10, icon: "📖" },
      { id: "dhikr", name: "Morning/Evening Dhikr", points: 8, icon: "✨" },
      { id: "dua", name: "Made Du'a", points: 5, icon: "🤲" },
    ],
  },
  home: {
    label: "🏠 Home & Tidiness",
    color: "#e07a5f",
    bg: "#fde8e4",
    items: [
      { id: "made_bed", name: "Made Bed", points: 5, icon: "🛏️" },
      { id: "tidy_room", name: "Tidied Room", points: 8, icon: "🧹" },
      { id: "helped_chores", name: "Helped with Chores", points: 10, icon: "🍽️" },
      { id: "no_screen", name: "Less Screen Time (1hr)", points: 7, icon: "📵" },
    ],
  },
  school: {
    label: "🎒 School & Learning",
    color: "#7b2d8b",
    bg: "#f3e0fa",
    items: [
      { id: "homework", name: "Finished Homework", points: 10, icon: "📝" },
      { id: "read_book", name: "Read a Book (15 min)", points: 8, icon: "📚" },
      { id: "good_grade", name: "Got a Good Grade", points: 15, icon: "⭐" },
      { id: "helped_classmate", name: "Helped a Classmate", points: 10, icon: "🤝" },
    ],
  },
  kindness: {
    label: "💛 Kindness & Character",
    color: "#b5770d",
    bg: "#fff3cd",
    items: [
      { id: "kind_word", name: "Said Kind Words", points: 5, icon: "💬" },
      { id: "shared", name: "Shared with Sibling", points: 8, icon: "🫶" },
      { id: "respected_parents", name: "Respected Parents", points: 12, icon: "👨‍👩‍👧" },
      { id: "no_lying", name: "Stayed Honest", points: 10, icon: "🏅" },
      { id: "sadaqah", name: "Gave Sadaqah", points: 15, icon: "💝" },
    ],
  },
  health: {
    label: "💪 Health & Routines",
    color: "#0077b6",
    bg: "#d0eaff",
    items: [
      { id: "morning_routine", name: "Morning Routine Done", points: 8, icon: "🌞" },
      { id: "evening_routine", name: "Evening Routine Done", points: 8, icon: "🌛" },
      { id: "exercise", name: "Exercised / Played Outside", points: 10, icon: "🏃" },
      { id: "healthy_food", name: "Ate Healthy Meal", points: 5, icon: "🥗" },
      { id: "early_sleep", name: "Slept on Time", points: 7, icon: "😴" },
    ],
  },
};

const PROFILES = [
  { id: "child1", name: "Zaid", avatar: "👦", color: "#2d6a4f" },
  { id: "child2", name: "Maryam", avatar: "👧", color: "#7b2d8b" },
  { id: "child3", name: "Omar", avatar: "🧒", color: "#e07a5f" },
];

const REWARDS = [
  { id: "r1", name: "Extra Screen Time (30 min)", cost: 50, icon: "📱" },
  { id: "r2", name: "Choose Dinner Tonight", cost: 75, icon: "🍕" },
  { id: "r3", name: "Stay Up 30 Min Later", cost: 80, icon: "🌙" },
  { id: "r4", name: "Special Outing", cost: 150, icon: "🎉" },
  { id: "r5", name: "New Book or Toy", cost: 200, icon: "🎁" },
  { id: "r6", name: "Trip to Favourite Restaurant", cost: 250, icon: "🍔" },
];

const getTodayKey = () => new Date().toISOString().split("T")[0];

const getWeekLabel = () => {
  const now = new Date();
  return `Week of ${now.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
};

export default function App() {
  const [activeProfile, setActiveProfile] = useState(PROFILES[0].id);
  const [view, setView] = useState("home"); // home | log | rewards | history
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("goodDeedsData");
    return saved ? JSON.parse(saved) : {};
  });
  const [toast, setToast] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState("prayers");

  useEffect(() => {
    localStorage.setItem("goodDeedsData", JSON.stringify(data));
  }, [data]);

  const getProfileData = (profileId) => data[profileId] || { totalPoints: 0, redeemedPoints: 0, logs: [] };
  const profileData = getProfileData(activeProfile);
  const availablePoints = profileData.totalPoints - profileData.redeemedPoints;

  const todayLogs = profileData.logs.filter((l) => l.date === getTodayKey());
  const todayDeedIds = new Set(todayLogs.map((l) => l.deedId));

  const logDeed = (deed, category) => {
    if (todayDeedIds.has(deed.id)) return;
    const entry = {
      deedId: deed.id,
      deedName: deed.name,
      icon: deed.icon,
      points: deed.points,
      category,
      date: getTodayKey(),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    setData((prev) => {
      const pd = getProfileData(activeProfile);
      return {
        ...prev,
        [activeProfile]: {
          ...pd,
          totalPoints: pd.totalPoints + deed.points,
          logs: [...pd.logs, entry],
        },
      };
    });
    showToast(`+${deed.points} pts — ${deed.name}! 🌟`);
  };

  const redeemReward = (reward) => {
    if (availablePoints < reward.cost) return;
    setData((prev) => {
      const pd = getProfileData(activeProfile);
      return {
        ...prev,
        [activeProfile]: {
          ...pd,
          redeemedPoints: pd.redeemedPoints + reward.cost,
        },
      };
    });
    showToast(`Redeemed: ${reward.name} ${reward.icon}`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const activeProfileObj = PROFILES.find((p) => p.id === activeProfile);

  const todayPoints = todayLogs.reduce((s, l) => s + l.points, 0);

  // History grouped by date
  const logsByDate = profileData.logs.reduce((acc, l) => {
    acc[l.date] = acc[l.date] || [];
    acc[l.date].push(l);
    return acc;
  }, {});
  const sortedDates = Object.keys(logsByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div style={styles.root}>
      {/* Stars bg */}
      <div style={styles.starsBg} />

      {/* Toast */}
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <div style={styles.appTitle}>✨ Good Deeds</div>
            <div style={styles.weekLabel}>{getWeekLabel()}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...styles.pointsBadge, background: activeProfileObj.color }}>
              ⭐ {availablePoints} pts
            </div>
            <div style={styles.todayPoints}>+{todayPoints} today</div>
          </div>
        </div>

        {/* Profile Switcher */}
        <div style={styles.profileRow}>
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProfile(p.id)}
              style={{
                ...styles.profileBtn,
                background: activeProfile === p.id ? p.color : "rgba(255,255,255,0.15)",
                border: activeProfile === p.id ? `2px solid ${p.color}` : "2px solid transparent",
                transform: activeProfile === p.id ? "scale(1.08)" : "scale(1)",
              }}
            >
              <span style={{ fontSize: 22 }}>{p.avatar}</span>
              <span style={styles.profileName}>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={styles.nav}>
        {[
          { id: "home", label: "🏠 Home" },
          { id: "log", label: "➕ Log Deed" },
          { id: "rewards", label: "🎁 Rewards" },
          { id: "history", label: "📋 History" },
        ].map((n) => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            style={{
              ...styles.navBtn,
              background: view === n.id ? activeProfileObj.color : "transparent",
              color: view === n.id ? "#fff" : "#555",
              fontWeight: view === n.id ? 700 : 500,
            }}
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>

        {/* HOME */}
        {view === "home" && (
          <div>
            <div style={styles.welcomeCard}>
              <div style={styles.welcomeEmoji}>{activeProfileObj.avatar}</div>
              <div style={styles.welcomeName}>Assalamu Alaikum, {activeProfileObj.name}! 🌙</div>
              <div style={styles.welcomeSub}>Keep up the great deeds today!</div>
              <div style={styles.statsRow}>
                <div style={styles.statBox}>
                  <div style={{ ...styles.statNum, color: activeProfileObj.color }}>{profileData.totalPoints}</div>
                  <div style={styles.statLabel}>Total Points</div>
                </div>
                <div style={styles.statBox}>
                  <div style={{ ...styles.statNum, color: "#e07a5f" }}>{availablePoints}</div>
                  <div style={styles.statLabel}>Available</div>
                </div>
                <div style={styles.statBox}>
                  <div style={{ ...styles.statNum, color: "#b5770d" }}>{todayLogs.length}</div>
                  <div style={styles.statLabel}>Today's Deeds</div>
                </div>
              </div>
            </div>

            {/* Today's log preview */}
            <div style={styles.sectionTitle}>Today's Good Deeds</div>
            {todayLogs.length === 0 ? (
              <div style={styles.emptyState}>No deeds logged yet today. Let's start! 💪</div>
            ) : (
              todayLogs.map((l, i) => (
                <div key={i} style={styles.logItem}>
                  <span style={{ fontSize: 22 }}>{l.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={styles.logName}>{l.deedName}</div>
                    <div style={styles.logTime}>{l.time}</div>
                  </div>
                  <div style={{ ...styles.logPoints, color: activeProfileObj.color }}>+{l.points}</div>
                </div>
              ))
            )}

            {/* Motivational */}
            <div style={{ ...styles.hadithCard, borderLeft: `4px solid ${activeProfileObj.color}` }}>
              <div style={styles.hadithText}>
                "The best of deeds are those done consistently, even if they are small."
              </div>
              <div style={styles.hadithSource}>— Prophet Muhammad ﷺ (Bukhari & Muslim)</div>
            </div>
          </div>
        )}

        {/* LOG DEED */}
        {view === "log" && (
          <div>
            <div style={styles.sectionTitle}>Log a Good Deed ✨</div>
            <div style={styles.logHint}>Tap any deed to earn points. Each can be logged once per day.</div>
            {Object.entries(DEEDS).map(([catKey, cat]) => (
              <div key={catKey} style={styles.categoryBlock}>
                <button
                  onClick={() => setExpandedCategory(expandedCategory === catKey ? null : catKey)}
                  style={{ ...styles.categoryHeader, background: cat.bg, color: cat.color }}
                >
                  <span>{cat.label}</span>
                  <span>{expandedCategory === catKey ? "▲" : "▼"}</span>
                </button>
                {expandedCategory === catKey && (
                  <div style={styles.deedGrid}>
                    {cat.items.map((deed) => {
                      const done = todayDeedIds.has(deed.id);
                      return (
                        <button
                          key={deed.id}
                          onClick={() => logDeed(deed, cat.label)}
                          disabled={done}
                          style={{
                            ...styles.deedCard,
                            background: done ? "#f0f0f0" : "#fff",
                            border: done ? "2px solid #ccc" : `2px solid ${cat.color}20`,
                            opacity: done ? 0.7 : 1,
                            cursor: done ? "not-allowed" : "pointer",
                          }}
                        >
                          <div style={styles.deedIcon}>{deed.icon}</div>
                          <div style={styles.deedName}>{deed.name}</div>
                          <div style={{ ...styles.deedPts, color: done ? "#aaa" : cat.color }}>
                            {done ? "✅ Done" : `+${deed.points} pts`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* REWARDS */}
        {view === "rewards" && (
          <div>
            <div style={styles.sectionTitle}>Rewards Store 🎁</div>
            <div style={{ ...styles.pointsBanner, background: activeProfileObj.color }}>
              You have <strong>{availablePoints} points</strong> to spend!
            </div>
            <div style={styles.rewardsGrid}>
              {REWARDS.map((r) => {
                const canAfford = availablePoints >= r.cost;
                return (
                  <div
                    key={r.id}
                    style={{
                      ...styles.rewardCard,
                      border: canAfford ? `2px solid ${activeProfileObj.color}` : "2px solid #ddd",
                    }}
                  >
                    <div style={styles.rewardIcon}>{r.icon}</div>
                    <div style={styles.rewardName}>{r.name}</div>
                    <div style={{ ...styles.rewardCost, color: canAfford ? activeProfileObj.color : "#aaa" }}>
                      ⭐ {r.cost} pts
                    </div>
                    <button
                      onClick={() => redeemReward(r)}
                      disabled={!canAfford}
                      style={{
                        ...styles.redeemBtn,
                        background: canAfford ? activeProfileObj.color : "#ddd",
                        color: canAfford ? "#fff" : "#aaa",
                        cursor: canAfford ? "pointer" : "not-allowed",
                      }}
                    >
                      {canAfford ? "Redeem 🎉" : "Keep earning!"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* HISTORY */}
        {view === "history" && (
          <div>
            <div style={styles.sectionTitle}>History 📋</div>
            {sortedDates.length === 0 ? (
              <div style={styles.emptyState}>No history yet. Start logging deeds!</div>
            ) : (
              sortedDates.map((date) => {
                const dayLogs = logsByDate[date];
                const dayPts = dayLogs.reduce((s, l) => s + l.points, 0);
                const label = date === getTodayKey() ? "Today" :
                  new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
                return (
                  <div key={date} style={styles.historyDay}>
                    <div style={styles.historyDayHeader}>
                      <span style={styles.historyDate}>{label}</span>
                      <span style={{ ...styles.historyDayPts, color: activeProfileObj.color }}>+{dayPts} pts</span>
                    </div>
                    {dayLogs.map((l, i) => (
                      <div key={i} style={styles.logItem}>
                        <span style={{ fontSize: 20 }}>{l.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={styles.logName}>{l.deedName}</div>
                          <div style={styles.logTime}>{l.category} · {l.time}</div>
                        </div>
                        <div style={{ ...styles.logPoints, color: activeProfileObj.color }}>+{l.points}</div>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    background: "#f7f3ed",
    position: "relative",
    maxWidth: 480,
    margin: "0 auto",
    paddingBottom: 40,
  },
  starsBg: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "radial-gradient(ellipse at top, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
    zIndex: -1,
  },
  toast: {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#2d6a4f",
    color: "#fff",
    padding: "10px 22px",
    borderRadius: 30,
    fontWeight: 700,
    fontSize: 15,
    zIndex: 999,
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    whiteSpace: "nowrap",
  },
  header: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
    padding: "24px 20px 16px",
    color: "#fff",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 900,
    color: "#fff",
    letterSpacing: -0.5,
  },
  weekLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  pointsBadge: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 15,
    fontWeight: 800,
    color: "#fff",
  },
  todayPoints: {
    textAlign: "right",
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },
  profileRow: {
    display: "flex",
    gap: 10,
    marginTop: 4,
  },
  profileBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "8px 16px",
    borderRadius: 16,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "#fff",
  },
  profileName: {
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
  },
  nav: {
    display: "flex",
    background: "#fff",
    padding: "8px 12px",
    gap: 6,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  navBtn: {
    flex: 1,
    padding: "8px 4px",
    borderRadius: 12,
    border: "none",
    fontSize: 11,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  content: {
    padding: "16px 16px 40px",
  },
  welcomeCard: {
    background: "#fff",
    borderRadius: 20,
    padding: 24,
    textAlign: "center",
    marginBottom: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  welcomeEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  welcomeName: {
    fontSize: 20,
    fontWeight: 800,
    color: "#1a1a2e",
    marginBottom: 4,
  },
  welcomeSub: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  statsRow: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
  },
  statBox: {
    flex: 1,
    background: "#f7f3ed",
    borderRadius: 14,
    padding: "12px 8px",
    textAlign: "center",
  },
  statNum: {
    fontSize: 24,
    fontWeight: 900,
  },
  statLabel: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  emptyState: {
    textAlign: "center",
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    padding: "30px 0",
  },
  logItem: {
    background: "#fff",
    borderRadius: 14,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  logName: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1a1a2e",
  },
  logTime: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
  logPoints: {
    fontSize: 16,
    fontWeight: 900,
  },
  hadithCard: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },
  hadithText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.6,
    marginBottom: 6,
  },
  hadithSource: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  logHint: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 16,
  },
  categoryBlock: {
    marginBottom: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  categoryHeader: {
    width: "100%",
    padding: "14px 18px",
    border: "none",
    borderRadius: 16,
    fontSize: 15,
    fontWeight: 800,
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
  },
  deedGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    padding: "10px 0 0",
  },
  deedCard: {
    borderRadius: 14,
    padding: "14px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    transition: "transform 0.15s",
    fontFamily: "inherit",
  },
  deedIcon: {
    fontSize: 28,
  },
  deedName: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1a1a2e",
    textAlign: "center",
    lineHeight: 1.3,
  },
  deedPts: {
    fontSize: 13,
    fontWeight: 800,
  },
  pointsBanner: {
    borderRadius: 14,
    padding: "14px 18px",
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  rewardsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  rewardCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  rewardIcon: {
    fontSize: 36,
  },
  rewardName: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1a1a2e",
    textAlign: "center",
    lineHeight: 1.3,
  },
  rewardCost: {
    fontSize: 14,
    fontWeight: 800,
  },
  redeemBtn: {
    width: "100%",
    padding: "8px 0",
    borderRadius: 10,
    border: "none",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 4,
  },
  historyDay: {
    marginBottom: 20,
  },
  historyDayHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: 800,
    color: "rgba(255,255,255,0.7)",
  },
  historyDayPts: {
    fontSize: 15,
    fontWeight: 900,
  },
};
