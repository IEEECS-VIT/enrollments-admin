import { useEffect, useState } from "react";
import api from "../api/admin";

export default function QualifiedUsers() {
  const [domain, setDomain] = useState("WEB");
  const [round, setRound] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);

    const res = await api.get("/admin/qualified-users", {
      params: {
        domain,
        interview_round: round
      }
    });

    setUsers(res.data?.users || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [domain, round]);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-center mb-10">
        Qualified Users
      </h1>

      <div className="flex gap-4 justify-center mb-10">
        <select
          className="p-3 bg-neutral-800 rounded-xl"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        >
          <option value="WEB">WEB</option>
          <option value="APP">APP</option>
          <option value="AI/ML">AI/ML</option>
          <option value="CC">CC</option>
          <option value="UI/UX">UI/UX</option>
          <option value="VIDEO EDITING">Video Editing</option>
          <option value="EVENTS">EVENTS</option>
          <option value="PNM">PNM</option>
        </select>

        <select
          className="p-3 bg-neutral-800 rounded-xl"
          value={round}
          onChange={(e) => setRound(Number(e.target.value))}
        >
          <option value={1}>Round 1</option>
          <option value={2}>Round 2</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-neutral-400">Loading…</p>
      ) : users.length === 0 ? (
        <p className="text-center text-neutral-500">
          No qualified users found
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {users.map((u) => {
            const assigned = u[`has_slot_round${round}`];

            return (
              <div
                key={u.email}
                className="bg-neutral-900 border border-neutral-700 p-5 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{u.email}</p>
                  <p className="text-neutral-400 text-sm">{u.name}</p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm ${
                      assigned ? "text-yellow-400" : "text-green-400"
                    }`}
                  >
                    {assigned ? "Slot Assigned" : "Not Assigned"}
                  </p>

                  <p className="text-neutral-400 text-sm">
                    {u.qualification_status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
