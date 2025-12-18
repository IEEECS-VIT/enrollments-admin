import { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiGlobe,
  FiSmartphone,
  FiCpu,
  FiShield,
  FiPenTool,
  FiVideo,
  FiCalendar,
  FiTrendingUp
} from "react-icons/fi";
import BackButton from "../components/backButton";

const analyticsData = {
  total_users_with_selection: 830,
  domain_counts: {
    CC: 235,
    WEB: 414,
    EVENTS: 318,
    APP: 136,
    "AI/ML": 284,
    "VIDEO EDITING": 72,
    "UI/UX": 110,
    PNM: 232,
    RND: 1,
    "GRAPHIC DESIGN": 1
  }
};


const DOMAIN_META = {
  WEB: { icon: <FiGlobe />, color: "text-blue-400" },
  APP: { icon: <FiSmartphone />, color: "text-green-400" },
  "AI/ML": { icon: <FiCpu />, color: "text-purple-400" },
  CC: { icon: <FiShield />, color: "text-red-400" },
  "UI/UX": { icon: <FiPenTool />, color: "text-pink-400" },
  "VIDEO EDITING": { icon: <FiVideo />, color: "text-yellow-400" },
  EVENTS: { icon: <FiCalendar />, color: "text-orange-400" },
  PNM: { icon: <FiTrendingUp />, color: "text-teal-400" }
};
export default function DomainSelectionAnalytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(analyticsData);
    setLoading(false);
  }, []);

  const sortedDomains = useMemo(() => {
    if (!data) return [];

    return Object.keys(DOMAIN_META)
      .map((domain) => ({
        domain,
        count: data.domain_counts?.[domain] ?? 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="max-w-7xl mx-auto">
        <BackButton label="Go Back" />

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">
          Domain Selection Analytics
        </h1>

        {loading ? (
          <p className="text-center text-neutral-400">Loading...</p>
        ) : (
          <>
            <p className="text-center  text-neutral-400 mb-8">
              Total users with selections: {" "}
              <span className="text-white font-semibold">
                {data.total_users_with_selection}
              </span>
            </p>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {sortedDomains.map(({ domain, count }, idx) => (
    <div
      key={domain}
      className={`relative rounded-3xl p-[2px] transition-transform duration-300 bg-gradient-to-br from-white/20 to-white/5 hover:scale-[1.05]`
      }
    >
      <div
        className={`h-full rounded-3xl bg-black/70 backdrop-blur-xl px-8 py-10 text-center shadow-2xl`}
      >
        {idx === 0 && (
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-sm font-extrabold px-4 py-1 rounded-full shadow-lg">
            Chicken Dinner?
          </span>
        )}

        <div
          className={`text-6xl mb-6 mx-auto flex justify-center ${
            DOMAIN_META[domain].color
          } drop-shadow-[0_0_18px_currentColor]`}
        >
          {DOMAIN_META[domain].icon}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-wide mb-2">
          {domain}
        </h2>

        <p className="text-4xl sm:text-5xl font-extrabold mb-1">
          {count}
        </p>

        <p className="text-sm uppercase tracking-widest text-neutral-400">
          People
        </p>
      </div>
    </div>
  ))}
</div>

          </>
        )}
      </div>
    </div>
  );
}
