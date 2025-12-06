import { useEffect, useState } from "react";
import { getSlots, bookSlot } from "../api/slots";
import { createSlot } from "../api/adminSlots";

export default function InterviewScheduling() {
  const [allSlots, setAllSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState("WEB");
  const [date, setDate] = useState("");
  const [startTime, setStart] = useState("");
  const [endTime, setEnd] = useState("");
  const [panel, setPanel] = useState(1);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await getSlots();
      const data = res.data.slots || [];
      setAllSlots(data);
    } catch {
      setAllSlots([]);
    }
    setLoading(false);
  };

  const handleCreateSlot = async () => {
    if (!date || !startTime || !endTime) return;

    await createSlot({
      domain,
      date,
      startTime,
      endTime,
      panel: Number(panel)
    });

    setStart("");
    setEnd("");
    fetchSlots();
  };

  const handleBook = async (slot) => {
    const iid =
      slot.iid ??
      `${slot.domain}_${slot.date}_${slot.startTime}_P${slot.panel}`;
    const range = slot.time_slot ?? `${slot.startTime} - ${slot.endTime}`;
    await bookSlot(iid, range);
    fetchSlots();
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const grouped = Array.isArray(allSlots)
    ? allSlots.reduce((acc, s) => {
        const d = s.date || "No Date";
        if (!acc[d]) acc[d] = [];
        acc[d].push(s);
        return acc;
      }, {})
    : {};

  return (
    <div className="min-h-screen w-full bg-neutral-800 text-white p-10 flex justify-center">
      <div className="w-full max-w-6xl">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Interview Scheduling</h1>

          <button
            onClick={fetchSlots}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg text-white"
          >
            Fetch Slots
          </button>
        </div>

        <div className="bg-black/5 border border-black/10 p-8 rounded-3xl shadow-2xl mb-14">
          <h2 className="text-2xl font-semibold mb-6 text-center">Create New Slot</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <select
              className="p-3 rounded-xl bg-black/5 border border-black/20 text-white"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              <option value="WEB">WEB</option>
              <option value="APP">APP</option>
              <option value="AI/ML">AI/ML</option>
              <option value="UI/UX">UI/UX</option>
            </select>

            <input
              type="date"
              className="p-3 rounded-xl bg-black/5 border border-black/20 text-white"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              type="time"
              className="p-3 rounded-xl bg-black/5 border border-black/20 text-white"
              value={startTime}
              onChange={(e) => setStart(e.target.value)}
            />

            <input
              type="time"
              className="p-3 rounded-xl bg-black/5 border border-black/20 text-white"
              value={endTime}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>

          <div className="flex justify-center mt-5">
            <input
              type="number"
              placeholder="Panel Number"
              className="p-3 w-40 rounded-xl bg-black/5 border border-black/20 text-center text-white"
              value={panel}
              onChange={(e) => setPanel(e.target.value)}
            />
          </div>

          <button
            onClick={handleCreateSlot}
            className="mt-6 mx-auto block bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold shadow-lg text-white"
          >
            Create Slot
          </button>
        </div>

        {loading ? (
          <p className="text-center text-neutral-400">Loading slots...</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-center text-neutral-500">No slots available.</p>
        ) : (
          <div className="space-y-10">
            {Object.keys(grouped).map((d) => (
              <div key={d} className="bg-black/5 border border-black/10 rounded-2xl p-6 shadow-xl text-black">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{d}</h3>
                  <div className="text-sm text-neutral-300">{grouped[d].length} slots</div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grouped[d].map((slot, i) => (
                    <div
                      key={i}
                      className="bg-white/10 border border-white/20 p-5 rounded-xl shadow-lg flex flex-col justify-between text-white"
                    >
                      <div>
                        <p className="text-lg font-semibold mb-2">Panel {slot.panel}</p>
                        <p className="text-neutral-300 mb-2">{slot.time_slot}</p>
                        <p className="text-sm text-neutral-400 mb-3">{slot.domain}</p>
                      </div>

                      <button
                        onClick={() => handleBook(slot)}
                        className="bg-blue-600 hover:bg-blue-700 py-2 rounded-xl font-semibold text-white"
                      >
                        Book Slot
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
