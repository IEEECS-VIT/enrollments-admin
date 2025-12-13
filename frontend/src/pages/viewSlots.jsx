import { useEffect, useState } from "react";
import api from "../api/admin";
import Card from "./card2";

export default function Scheduling() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [domain, setDomain] = useState("WEB");
  const [date, setDate] = useState("");
  const [startTime, setStart] = useState("");
  const [endTime, setEnd] = useState("");
  const [panel, setPanel] = useState(1);
  const [capacity, setCapacity] = useState(1);
  const [round, setRound] = useState(1);

  const [search, setSearch] = useState("");

  const fetchSlots = async () => {
    setLoading(true);
    const res = await api.get("/admin/available-slots", {
      params: { domain, interview_round: round }
    });
    setSlots(res.data.slots || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSlots();
  }, [domain, round]);

  const createSlot = async () => {
    if (!date || !startTime || !endTime) return;

    await api.post("/admin/create-slot", {
      domain,
      date,
      startTime,
      endTime,
      panel: Number(panel),
      interview_round: round,
      max_capacity: Number(capacity)
    });

    fetchSlots();
  };

  const deleteSlot = () => {};

  const filteredSlots = slots.filter((slot) => {
    const q = search.toLowerCase();

    const date = slot.date?.toLowerCase() || "";
    const time = slot.time_slot?.toLowerCase() || "";
    const panel = String(slot.panel || "");

    return date.includes(q) || time.includes(q) || panel.includes(q);
  });

  const grouped = filteredSlots.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-black text-white p-10 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-10 text-center">Interview Scheduling</h1>

        <div className="bg-white/10 border border-white/20 p-8 rounded-2xl mb-14 w-full">
          <h2 className="text-2xl font-semibold mb-6 text-center">Create New Slot</h2>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <select
              className="p-3 bg-neutral-800 rounded-xl"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              <option value="WEB" className="bg-black">WEB</option>
              <option value="APP" className="bg-black">APP</option>
              <option value="AI/ML" className="bg-black">AI/ML</option>
              <option value="CC" className="bg-black">CC</option>
              <option value="EVENTS" className="bg-black">EVENTS</option>
              <option value="PNM" className="bg-black">PNM</option>
              <option value="UI/UX" className="bg-black">UI/UX</option>
              <option value="VIDEO" className="bg-black">Video Editing</option>
            </select>

            <select
              className="p-3 bg-neutral-800 rounded-xl"
              value={round}
              onChange={(e) => setRound(Number(e.target.value))}
            >
              <option value={1} className="bg-black">Round 1</option>
              <option value={2} className="bg-black">Round 2</option>
            </select>

            <input
              type="date"
              className="p-3 bg-neutral-800 rounded-xl"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <input
                type="time"
                className="p-3 bg-neutral-800 rounded-xl w-full"
                value={startTime}
                onChange={(e) => setStart(e.target.value)}
              />
              <p className="text-neutral-400 text-sm mt-1 text-center">Start Time</p>
            </div>

            <div>
              <input
                type="time"
                className="p-3 bg-neutral-800 rounded-xl w-full"
                value={endTime}
                onChange={(e) => setEnd(e.target.value)}
              />
              <p className="text-neutral-400 text-sm mt-1 text-center">End Time</p>
            </div>

            <div>
              <input
                type="number"
                className="p-3 bg-neutral-800 rounded-xl w-full"
                value={panel}
                min="1"
                onChange={(e) => setPanel(e.target.value)}
              />
              <p className="text-neutral-400 text-sm mt-1 text-center">Panel Number</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-center w-full">
          <input
            type="number"
            className="p-3 bg-neutral-800 rounded-xl w-64"
            placeholder="Max Capacity"
            value={capacity}
            min="1"
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>

            <p className="text-neutral-400 text-sm mt-1 text-center">Maximum Capacity</p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={createSlot}
              className="bg-green-600 hover:bg-green-700 px-10 py-3 rounded-xl font-semibold"
            >
              Create Slot
            </button>
          </div>
        </div>

        <div className="mb-10">
          <input
            type="text"
            className="w-full p-3 rounded-xl bg-neutral-800 border border-white/20 text-white"
            placeholder="Search slots by date, time or panel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          Object.keys(grouped).map((dateKey) => (
            <div key={dateKey} className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">{dateKey}</h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[dateKey].map((slot, i) => (
                  <Card
                    key={i}
                    slot={slot}
                    onDelete={deleteSlot}
                    refreshSlots={fetchSlots}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}