import { useState } from "react";
import api from "../api/admin";

export default function Card({ slot, onDelete, refreshSlots }) {
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [qualifiedUsers, setQualifiedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const resolvedDomain =
    slot.domain ||
    slot.Domain ||
    slot.DomainName ||
    slot.track ||
    slot.category ||
    "WEB";

  const resolvedRound =
    slot.interview_round ||
    slot.interviewRound ||
    slot.round ||
    slot.round_number ||
    slot.roundNum ||
    1;

  const remainingCapacity =
    slot.max_capacity - (slot.assigned_users?.length || 0);

  const fetchQualifiedUsers = async () => {
    const res = await api.get("/admin/qualified-users", {
      params: {
        domain: resolvedDomain,
        interview_round: Number(resolvedRound),
      },
    });

    const users = res.data.users || [];

    const filtered = users.filter(
      (u) => !u[`has_slot_round${resolvedRound}`]
    );

    setQualifiedUsers(filtered);
    setFilteredUsers(filtered);
  };

  const openModal = async () => {
    await fetchQualifiedUsers();
    setShowModal(true);
  };

  const toggleUser = (email) => {
    if (selectedUsers.includes(email)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== email));
    } else if (selectedUsers.length < remainingCapacity) {
      setSelectedUsers([...selectedUsers, email]);
    }
  };

  const searchUsers = (text) => {
    setSearch(text);
    const q = text.toLowerCase();
    setFilteredUsers(
      qualifiedUsers.filter(
        (u) =>
          u.email?.toLowerCase().includes(q) ||
          u.name?.toLowerCase().includes(q)
      )
    );
  };

  const confirmBooking = async () => {
    await api.post("/admin/assign-slot", {
      slot_id: slot.iid,
      user_emails: selectedUsers,
      domain: resolvedDomain,
      interview_round: resolvedRound,
    });

    setShowModal(false);
    setSelectedUsers([]);
    refreshSlots();
  };

  return (
    <>
      <div className="bg-white/10 border border-white/20 p-5 rounded-xl shadow-lg flex flex-col text-white">
        <p className="text-lg font-semibold mb-2">Panel {slot.panel}</p>
        <p className="text-neutral-300 mb-1">{slot.time_slot}</p>
        <p className="text-neutral-400 mb-2">{resolvedDomain}</p>

        <p className="text-yellow-400 text-sm mb-4">
          Capacity: {slot.assigned_users?.length || 0}/{slot.max_capacity}
        </p>

        {remainingCapacity > 0 ? (
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 py-2 rounded-xl font-semibold text-white"
          >
            Assign Candidates
          </button>
        ) : (
          <button
            onClick={() => setShowDetails(true)}
            className="bg-green-600 hover:bg-green-700 py-2 rounded-xl font-semibold text-white"
          >
            View Slot
          </button>
        )}

        <button
          onClick={() => onDelete(slot)}
          className="mt-3 bg-red-600 hover:bg-red-700 py-2 rounded-xl font-semibold text-white"
        >
          Delete
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-neutral-900 p-8 rounded-2xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-2">Assign Candidates</h2>

            <p className="text-yellow-400 mb-4">
              Remaining Capacity: {remainingCapacity}
            </p>

            <input
              type="text"
              className="w-full p-3 bg-neutral-800 rounded-xl mb-4"
              placeholder="Search by email or name"
              value={search}
              onChange={(e) => searchUsers(e.target.value)}
            />

            <div className="max-h-60 overflow-y-auto mb-4 bg-neutral-800 p-4 rounded-xl">
              {filteredUsers.map((u) => (
                <div
                  key={u.email}
                  className="flex justify-between items-center py-2 border-b border-neutral-700"
                >
                  <span>{u.email}</span>

                  <button
                    className={`px-3 py-1 rounded-lg ${
                      selectedUsers.includes(u.email)
                        ? "bg-green-600"
                        : "bg-neutral-700"
                    }`}
                    onClick={() => toggleUser(u.email)}
                    disabled={
                      !selectedUsers.includes(u.email) &&
                      selectedUsers.length >= remainingCapacity
                    }
                  >
                    {selectedUsers.includes(u.email) ? "Selected" : "Select"}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-600 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={confirmBooking}
                disabled={selectedUsers.length === 0}
                className="px-4 py-2 bg-blue-600 rounded-xl"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetails && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-neutral-900 p-8 rounded-2xl w-full max-w-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Slot Details</h2>

            <p>Panel: {slot.panel}</p>
            <p>Time: {slot.time_slot}</p>
            <p>Domain: {resolvedDomain}</p>

            <p className="mt-4 font-semibold">Assigned Users:</p>

            {slot.assigned_users?.length ? (
              slot.assigned_users.map((u) => (
                <p key={u} className="text-green-400">
                  {u}
                </p>
              ))
            ) : (
              <p className="text-neutral-500">No users assigned.</p>
            )}

            <button
              onClick={() => setShowDetails(false)}
              className="mt-6 px-4 py-2 bg-green-600 rounded-xl w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}