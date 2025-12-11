import { useState } from "react";
import api from "../api/admin";

export default function Card({ slot, onDelete, onUpdateSlot }) {
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [qualifiedUsers, setQualifiedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

const fetchQualified = async () => {
  const res = await api.get("/admin/fetch", {
    params: {
      domain: "WEB",
      round: 1,
      status: "qualified"
    }
  });

  const items = res.data.items || [];

  const sameDate = items.filter(
    (u) =>
      u.interview_date === slot.date ||
      u.date === slot.date ||
      u.interviewDate === slot.date
  );

  setQualifiedUsers(sameDate);
  setFilteredUsers(sameDate);
};


  const openModal = async () => {
    await fetchQualified();
    setShowModal(true);
  };

  const handleSelectUser = (email) => {
    if (selectedCategory === "TECH" || selectedCategory === "DESIGN") {
      setSelectedUsers([email]);
    } else {
      setSelectedUsers((prev) =>
        prev.includes(email)
          ? prev.filter((u) => u !== email)
          : [...prev, email]
      );
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

  const confirmBooking = () => {
    const bookedData = {
      slot,
      category: selectedCategory,
      users: selectedUsers
    };

    onUpdateSlot(slot, bookedData);

    setShowModal(false);
    setSelectedUsers([]);
  };

  return (
    <>
      {!slot.booked ? (
        <div className="bg-white/10 border border-white/20 p-5 rounded-xl shadow-lg flex flex-col justify-between text-white">
          <div>
            <p className="text-lg font-semibold mb-2">Panel {slot.panel}</p>
            <p className="text-neutral-300 mb-2">{slot.time_slot}</p>
            <p className="text-sm text-neutral-400 mb-3">{slot.domain}</p>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={openModal}
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-xl font-semibold text-white"
            >
              Book
            </button>

            <button
              onClick={() => onDelete(slot)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-900/40 border border-green-600 p-5 rounded-xl shadow-lg flex flex-col justify-between text-white">
          <div>
            <p className="text-lg font-semibold mb-2">Panel {slot.panel}</p>
            <p className="text-neutral-300 mb-2">{slot.time_slot}</p>
            <p className="text-sm text-green-400 mb-3">{slot.domain}</p>
          </div>

          <button
            onClick={() => setShowDetails(true)}
            className="bg-green-600 hover:bg-green-700 py-2 rounded-xl font-semibold text-white"
          >
            Details
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-neutral-900 p-8 rounded-2xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Book Slot</h2>

            <select
              className="p-3 w-full bg-neutral-800 rounded-xl mb-4"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedUsers([]);
              }}
            >
              <option value="">Select Category</option>
              <option value="TECH">Tech</option>
              <option value="DESIGN">Design</option>
              <option value="EVENTS">Events</option>
              <option value="PNM">PNM</option>
            </select>

            <input
              type="text"
              className="w-full p-3 bg-neutral-800 rounded-xl mb-4"
              placeholder="Search by email or name"
              value={searchQuery}
              onChange={(e) => searchUsers(e.target.value)}
            />

            <div className="max-h-60 overflow-y-auto mb-4 bg-neutral-800 p-4 rounded-xl">
              {filteredUsers.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between py-2 border-b border-neutral-700"
                >
                  <span>{user.email}</span>

                  <button
                    className={`px-3 py-1 rounded-lg ${
                      selectedUsers.includes(user.email)
                        ? "bg-green-600"
                        : "bg-neutral-700"
                    }`}
                    onClick={() => handleSelectUser(user.email)}
                  >
                    {selectedUsers.includes(user.email)
                      ? "Selected"
                      : "Select"}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-red-600 rounded-xl"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 rounded-xl"
                onClick={confirmBooking}
                disabled={!selectedCategory || selectedUsers.length === 0}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetails && slot.booked && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-neutral-900 p-8 rounded-2xl w-full max-w-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Slot Details</h2>

            <p className="mb-2">Panel: {slot.panel}</p>
            <p className="mb-2">Time: {slot.time_slot}</p>
            <p className="mb-2">Domain: {slot.domain}</p>
            <p className="mb-2">Category: {slot.booked.category}</p>

            <p className="mt-4 font-semibold">Users:</p>
            {slot.booked.users.map((u) => (
              <p key={u} className="text-green-400">
                {u}
              </p>
            ))}

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
