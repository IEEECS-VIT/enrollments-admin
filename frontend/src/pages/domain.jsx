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
import { dummyDomainUsers } from "./selection";
import BackButton from "../components/backButton";

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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsers(dummyDomainUsers);
    setLoading(false);
  }, []);

  const userDomainMap = useMemo(
    () =>
      users.map((u) => ({
        email: u.email,
        username: u.username,
        domains: Object.values(u.domain || {}).flat()
      })),
    [users]
  );

  const sortedDomains = useMemo(() => {
    const counts = Object.entries(DOMAIN_META).map(([domain]) => ({
      domain,
      count: users.reduce((c, u) => {
        const d = Object.values(u.domain || {}).flat();
        return d.includes(domain) ? c + 1 : c;
      }, 0)
    }));
    return counts.sort((a, b) => b.count - a.count);
  }, [users]);

  return (
    <div className="min-h-screen bg-black px-4 py-8 sm:py-10 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mt-10 sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-14 tracking-wide">
          Which Domain is Winning?
        </h1>
        <BackButton label="Go Back" />

        {loading ? (
          <p className="text-center text-neutral-400">Have Patience dude</p>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 mb-14 sm:mb-16">
              {sortedDomains.map(({ domain, count }, idx) => (
                <div
                  key={domain}
                  className={`relative bg-white/5 backdrop-blur-xl border rounded-3xl p-6 sm:p-7 flex flex-col justify-center items-center text-center shadow-xl transition ${
                    idx === 0
                      ? "border-yellow-400 scale-[1.05]"
                      : "border-yellow-500/20 hover:scale-[1.03]"
                  }`}
                >
                  {idx === 0 && (
                    <span className="absolute -top-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                      Winner?
                    </span>
                  )}

                  <div
                    className={`mb-4 text-4xl sm:text-5xl ${DOMAIN_META[domain].color}`}
                  >
                    {DOMAIN_META[domain].icon}
                  </div>

                  <h2 className="text-lg sm:text-xl font-semibold mb-1">
                    {domain}
                  </h2>

                  <p className="text-3xl sm:text-4xl font-bold">
                    {count}
                  </p>

                  <p className="text-sm text-neutral-400 mt-1">
                    Users
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 flex items-center gap-3">
                <FiUsers className="text-yellow-300" />
                User Selections
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-400 text-sm">
                      <th className="py-3 px-2 text-left">Email</th>
                      <th className="py-3 px-2 text-left">Username</th>
                      <th className="py-3 px-2 text-left">Domains</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDomainMap.map((u, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-white/5 hover:bg-white/5 transition"
                      >
                        <td className="py-3 px-2 break-all">
                          {u.email}
                        </td>
                        <td className="py-3 px-2">
                          {u.username || "—"}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex flex-wrap gap-2">
                            {u.domains.map((d) => (
                              <span
                                key={d}
                                className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs sm:text-sm ${DOMAIN_META[d].color}`}
                              >
                                {DOMAIN_META[d].icon}
                                {d}
                              </span>
                            ))}
                          </div>
                        </td>

                      </tr>
                    ))}


                  </tbody>
                </table>

              </div>
            </div>
          </>
        )}


      </div>
    </div>
  );
}
