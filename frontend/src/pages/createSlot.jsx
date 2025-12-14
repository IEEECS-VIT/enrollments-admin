import { useEffect, useState } from "react";
import api from "../api/admin";

export default function CreateSlot() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const [domain, setDomain] = useState("WEB");
  const [round, setRound] = useState(1);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [panel, setPanel] = useState(1);
  const [capacity, setCapacity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [clashWarning, setClashWarning] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdSlot, setCreatedSlot] = useState(null);
  const [slots, setSlots] = useState([]);

  const checkPassword = () => {
    if (password === "1234") {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const fetchSlots = async (d, r) => {
    const res = await api.get("/admin/available-slots", {
      params: { domain: d, interview_round: r }
    });
    setSlots(res.data?.slots || []);
  };

  useEffect(() => {
    if (authenticated) fetchSlots(domain, round);
  }, [authenticated, domain, round]);

  const isTimeOverlap = (startA, endA, startB, endB) => {
  return startA < endB && endA > startB;
};

const createSlot = async () => {
  if (!date || !startTime || !endTime) return;

  const clash = slots.find((s) => {
    const sameDate = s.iid.split("_")[1] === date;
    const samePanel = Number(s.panel) === panel;

    if (!sameDate || !samePanel) return false;

    const [existingStart, existingEnd] = s.time_slot.split(" - ");

    return isTimeOverlap(
      startTime,
      endTime,
      existingStart,
      existingEnd
    );
  });

  if (clash) {
    setClashWarning(
      `Clashing slot exists: ${clash.time_slot} (Panel ${clash.panel})`
    );
    return;
  }

  setClashWarning("");
  setLoading(true);

  const payload = {
    domain,
    date,
    startTime,
    endTime,
    panel,
    interview_round: round,
    max_capacity: capacity
  };

  await api.post("/admin/create-slot", payload);

  setCreatedSlot(payload);
  setShowSuccess(true);
  fetchSlots(domain, round);

  setLoading(false);
  setDate("");
  setStartTime("");
  setEndTime("");
  setPanel(1);
  setCapacity(1);
};


  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center p-10">
        <div className="w-full max-w-sm bg-neutral-900 p-8 rounded-2xl text-center">
          <h1 className="text-2xl font-bold mb-6">Enter Password</h1>

          <input
            type="password"
            className="w-full p-3 mb-4 bg-neutral-800 rounded-xl"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <button
            onClick={checkPassword}
            className="w-full bg-blue-600 py-3 rounded-xl font-semibold"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-xl mx-auto bg-neutral-900 p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Slot</h1>

        <select className="w-full p-3 mb-4 bg-neutral-800 rounded-xl" value={domain} onChange={(e) => setDomain(e.target.value)}>
          <option value="WEB">WEB</option>
          <option value="APP">APP</option>
          <option value="AI/ML">AI/ML</option>
          <option value="CC">CC</option>
          <option value="UI/UX">UI/UX</option>
          <option value="VIDEO EDITING">Video Editing</option>
          <option value="EVENTS">EVENTS</option>
          <option value="PNM">PNM</option>
        </select>

        <select className="w-full p-3 mb-4 bg-neutral-800 rounded-xl" value={round} onChange={(e) => setRound(Number(e.target.value))}>
          <option value={1}>Round 1</option>
          <option value={2}>Round 2</option>
        </select>

       <label className="text-sm text-neutral-400">Date</label>
        <input
          type="date"
          className="w-full p-3 mb-4 bg-neutral-800 rounded-xl"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label className="text-sm text-neutral-400">Start Time</label>
        <input
          type="time"
          className="w-full p-3 mb-4 bg-neutral-800 rounded-xl"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <label className="text-sm text-neutral-400">End Time</label>
        <input
          type="time"
          className="w-full p-3 mb-4 bg-neutral-800 rounded-xl"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <label className="text-sm text-neutral-400">Panel Number</label>
        <input
          type="number"
          min={1}
          className="w-full p-3 mb-4 bg-neutral-800 rounded-xl"
          value={panel}
          onChange={(e) => setPanel(Number(e.target.value))}
        />

        <label className="text-sm text-neutral-400">Max Capacity</label>
        {/*<input
          type="number"
          min={1}
          className="w-full p-3 mb-6 bg-neutral-800 rounded-xl"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
        />*/}
        <input
        type="number"
        min={1}
        value={1}
        readOnly
        className="w-full p-3 mb-6 bg-neutral-800 rounded-xl opacity-60 cursor-not-allowed"
      />


          {clashWarning && (
  <div className="mb-4 p-3 rounded-xl bg-red-900/40 text-red-400 text-sm text-center">
    {clashWarning}
  </div>
)}

        <button onClick={createSlot} disabled={loading} className="w-full bg-green-600 py-3 rounded-xl font-semibold">
          {loading ? "Have Patience" : "Create Slot"}
        </button>
      </div>

      <div className="max-w-xl mx-auto mt-10 bg-neutral-900 p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4 text-center">Existing Slots</h2>

       {slots.map((s) => (
        <div
          key={s.iid}
          className="bg-neutral-800 p-4 rounded-xl text-sm space-y-1 mb-4"
        >
          <p><b>Date:</b> {s.iid.split("_")[1]}</p>
          <p><b>Time:</b> {s.time_slot}</p>
          <p><b>Panel:</b> {s.panel}</p>
          <p><b>Round:</b> {round}</p>
        </div>
      ))}

      </div>

      {showSuccess && createdSlot && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-green-400 mb-4">
              Slot Created Successfully
            </h2>

            <div className="text-left text-sm space-y-1 text-neutral-300">
              <p><b>Domain:</b> {createdSlot.domain}</p>
              <p><b>Date:</b> {createdSlot.date}</p>
              <p><b>Time:</b> {createdSlot.startTime} - {createdSlot.endTime}</p>
              <p><b>Panel:</b> {createdSlot.panel}</p>
              <p><b>Round:</b> {createdSlot.interview_round}</p>
              <p><b>Capacity:</b> {createdSlot.max_capacity}</p>
            </div>

            <button
              onClick={() => setShowSuccess(false)}
              className="mt-6 bg-blue-600 px-6 py-2 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
