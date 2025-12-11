import { useEffect, useState } from "react";
import { createSlot } from "../api/adminSlots";
import { getSlots } from "../api/slots";
import Card from "./card";

export default function Scheduling() {
  const [allSlots, setAllSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [domain, setDomain] = useState("WEB");
  const [date, setDate] = useState("");
  const [startTime, setStart] = useState("");
  const [endTime, setEnd] = useState("");
  const [panel, setPanel] = useState(1);

  const fetchSlots = async () => {
    setLoading(true);
    const res = await getSlots();
    setAllSlots(res.data.slots || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const grouped = allSlots.reduce((acc, s) => {
    const d = s.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(s);
    return acc;
  }, {});

  const handleCreateSlot = async () => {
    if (!date || !startTime || !endTime) return;

    await createSlot({
      domain,
      date,
      startTime,
      endTime,
      panel: Number(panel)
    });

    fetchSlots();
  };

  const deleteSlot = (slot) => {
    console.log("Deleted slot:", slot);
    setAllSlots((prev) => prev.filter((s) => s !== slot));
  };

  const updateSlotWithBooking = (slot, bookedData) => {
    setAllSlots((prev) =>
      prev.map((s) =>
        s === slot
          ? { ...s, booked: bookedData }
          : s
      )
    );
  };

  return (
    <div className="min-h-screen w-full bg-neutral-800 text-white p-10 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-10">Interview Scheduling</h1>

        <div className="bg-black/5 border border-black/10 p-8 rounded-3xl mb-14">
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
          <p>Loading...</p>
        ) : (
          Object.keys(grouped).map((d) => (
            <div key={d} className="mb-10">
              <h2 className="text-xl mb-3">{d}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[d].map((slot, i) => (
                  <Card
                    key={i}
                    slot={slot}
                    onDelete={deleteSlot}
                    onUpdateSlot={updateSlotWithBooking}
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
