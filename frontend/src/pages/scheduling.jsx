import { useEffect, useState } from "react";
import api from "../api/admin";

const parseSlotId = (iid) => {
  const [domain, date, time, panel, round] = iid.split("_");
  return {
    domain,
    date,
    time,
    panel: panel.replace("P", ""),
    round: Number(round.replace("R", ""))
  };
};

export default function Scheduling() {
  const [slots, setSlots] = useState([]);
  const [domain, setDomain] = useState("WEB");
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const [searchPanel, setSearchPanel] = useState("");
  const [activeSlot, setActiveSlot] = useState(null);
  const [qualifiedUsers, setQualifiedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [searchUser, setSearchUser] = useState("");

  const fetchSlots = async () => {
    setLoading(true);
    const res = await api.get("/admin/available-slots", {
      params: { domain, interview_round: round }
    });
    setSlots(res.data?.slots || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSlots();
  }, [domain, round]);

  const openAssign = async (slot) => {
    setActiveSlot(slot);
    setShowAssign(true);
    setFetchingUsers(true);
    setSelectedUsers([]);
    setSearchUser("");

    const res = await api.get("/admin/qualified-users", {
      params: { domain, interview_round: round }
    });

    const users = res.data?.users || [];
    const filtered = users.filter(
      (u) => u[`has_slot_round${round}`] === false
    );

    setQualifiedUsers(filtered);
    setFetchingUsers(false);
  };

  const toggleUser = (email) => {
    const remaining =
      activeSlot.max_capacity - activeSlot.assigned_users.length;

    if (selectedUsers.includes(email)) {
      setSelectedUsers(selectedUsers.filter((e) => e !== email));
    } else if (selectedUsers.length < remaining) {
      setSelectedUsers([...selectedUsers, email]);
    }
  };

  const confirmAssign = async () => {
    await api.post("/admin/assign-slot", {
      slot_id: activeSlot.iid,
      user_emails: selectedUsers,
      domain,
      interview_round: round
    });

    setShowAssign(false);
    setSelectedUsers([]);
    setActiveSlot(null);
    fetchSlots();
  };

  const unassignUser = async (email) => {
    await api.post("/admin/unassign-slot", {
      slot_id: activeSlot.iid,
      user_email: email
    });

    const updated = {
      ...activeSlot,
      assigned_users: activeSlot.assigned_users.filter((u) => u !== email)
    };

    setActiveSlot(updated);
    fetchSlots();
  };

  const deleteSlot = async (slot) => {
    if (slot.assigned_users.length > 0) return;

    await api.delete("/admin/delete-slot", {
      params: { slot_id: slot.iid }
    });
    fetchSlots();
  };

  const filteredSlots = slots.filter((slot) => {
    const parsed = parseSlotId(slot.iid);
    const dateMatch = searchDate ? parsed.date.includes(searchDate) : true;
    const panelMatch = searchPanel ? parsed.panel === searchPanel : true;
    return dateMatch && panelMatch;
  });

  const groupedSlots = filteredSlots.reduce((acc, slot) => {
    const { date } = parseSlotId(slot.iid);
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSlots).sort();

  const filteredQualifiedUsers = qualifiedUsers.filter((u) =>
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Interview Scheduling
      </h1>

      <div className="flex gap-4 mb-6 justify-center">
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

      <div className="bg-neutral-900 p-4 rounded-xl mb-10 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-3 text-center">
          Search Slots
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-400">Search by Date</label>
            <input
              className="w-full p-3 bg-neutral-800 rounded-xl"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Search by Panel</label>
            <input
              className="w-full p-3 bg-neutral-800 rounded-xl"
              value={searchPanel}
              onChange={(e) => setSearchPanel(e.target.value)}
              placeholder="Panel Number"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading…</p>
      ) : (
        sortedDates.map((date) => (
          <div key={date} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
              {date}
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedSlots[date].map((slot) => {
                const parsed = parseSlotId(slot.iid);
                return (
                  <div
                    key={slot.iid}
                    className="bg-white/10 p-5 rounded-xl border border-white/10"
                  >
                    <p className="text-lg font-semibold">
                      Panel {parsed.panel}
                    </p>
                    <p className="text-neutral-300">{slot.time_slot}</p>
                    <p className="text-neutral-400">
                      {parsed.domain} • Round {parsed.round}
                    </p>

                    <p className="text-yellow-400 text-sm mt-2">
                      Capacity: {slot.assigned_users.length}/{slot.max_capacity}
                    </p>

                    {slot.assigned_users.length < slot.max_capacity ? (
                      <button
                        onClick={() => openAssign(slot)}
                        className="mt-4 bg-blue-600 py-2 w-full rounded-xl"
                      >
                        Assign Candidates
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveSlot(slot);
                          setShowDetails(true);
                        }}
                        className="mt-4 bg-green-600 py-2 w-full rounded-xl"
                      >
                        View Slot
                      </button>
                    )}

                    <button
                      onClick={() => deleteSlot(slot)}
                      disabled={slot.assigned_users.length > 0}
                      className="mt-3 bg-red-600 py-2 w-full rounded-xl disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {showAssign && activeSlot && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-3">Assign Candidates</h2>

            <input
              className="w-full p-3 mb-3 bg-neutral-800 rounded-xl"
              placeholder="Search by email"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />

            <div className="max-h-64 overflow-y-auto bg-neutral-800 p-4 rounded-xl space-y-2">
              {fetchingUsers ? (
                <p className="text-center">Loading…</p>
              ) : filteredQualifiedUsers.length === 0 ? (
                <p className="text-center text-neutral-500">
                  No users found
                </p>
              ) : (
                filteredQualifiedUsers.map((u) => {
                  const disabled =
                    !selectedUsers.includes(u.email) &&
                    selectedUsers.length >=
                      activeSlot.max_capacity -
                        activeSlot.assigned_users.length;

                  return (
                    <label
                      key={u.email}
                      className={`flex justify-between items-center p-2 rounded-lg ${
                        disabled ? "opacity-50" : ""
                      }`}
                    >
                      <span className="text-sm break-all">{u.email}</span>
                      <input
                        type="checkbox"
                        disabled={disabled}
                        checked={selectedUsers.includes(u.email)}
                        onChange={() => toggleUser(u.email)}
                      />
                    </label>
                  );
                })
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowAssign(false)}
                className="bg-red-600 px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssign}
                disabled={selectedUsers.length === 0}
                className="bg-blue-600 px-4 py-2 rounded-xl disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetails && activeSlot && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Slot Details</h2>

            {activeSlot.assigned_users.length === 0 ? (
              <p className="text-neutral-400 text-center">
                No users assigned
              </p>
            ) : (
              activeSlot.assigned_users.map((u) => (
                <div
                  key={u}
                  className="flex justify-between items-center mb-2 bg-neutral-800 p-2 rounded-lg"
                >
                  <span className="text-green-400 break-all">{u}</span>
                  <button
                    onClick={() => unassignUser(u)}
                    className="bg-red-600 px-3 py-1 rounded-lg text-sm"
                  >
                    Unassign
                  </button>
                </div>
              ))
            )}

            <button
              onClick={() => setShowDetails(false)}
              className="mt-6 bg-green-600 py-2 w-full rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
