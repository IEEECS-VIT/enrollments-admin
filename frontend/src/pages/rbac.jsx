import { useState, useEffect } from "react";
import api from "../api/admin";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminManagement() {
  const [isHeadAdmin, setIsHeadAdmin] = useState(false);
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const DOMAIN_OPTIONS = ["Web", "App", "AI/ML", "UI/UX", "Events", "PnM"];

  const [newAdmin, setNewAdmin] = useState({
    email: "",
    domains: []
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      await validateHeadAdmin();
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const validateHeadAdmin = async () => {
    try {
      const res = await api.get("/admin/list-sub-admins");
      setIsHeadAdmin(true);
      setSubAdmins(res.data.sub_admins || []);
    } catch (_) {
      setIsHeadAdmin(false);
    }
  };

  const toggleDomain = (domain) => {
    setNewAdmin((p) => ({
      ...p,
      domains: p.domains.includes(domain)
        ? p.domains.filter((d) => d !== domain)
        : [...p.domains, domain]
    }));
  };

  const addSubAdmin = async () => {
    if (!newAdmin.email.trim()) return;
    try {
      await api.post("/admin/add-sub-admin", {
        email: newAdmin.email.trim(),
        allowed_domains: newAdmin.domains
      });
      setNewAdmin({ email: "", domains: [] });
      validateHeadAdmin();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const removeSubAdmin = async (email) => {
    try {
      await api.delete("/admin/remove-sub-admin", { params: { email } });
      validateHeadAdmin();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-yellow-400 text-xl tracking-wide">
        Loading...
      </div>
    );

  if (!isHeadAdmin)
    return (
      <div className="min-h-screen bg-black text-red-500 flex justify-center items-center text-3xl font-semibold tracking-wide">
        Access Denied
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-neutral-900 to-black text-white px-6 py-16 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold tracking-tight mb-16 text-center bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
        Sub Admin Control Panel
      </h1>

      <div className="w-full max-w-6xl space-y-24">

        <div>
          <h2 className="text-3xl font-bold text-center mb-10">Sub Admins</h2>

          {subAdmins.length === 0 ? (
            <p className="text-center text-neutral-400 text-lg">
              No Sub Admins Added Yet
            </p>
          ) : (
            <div className="space-y-6 max-w-2xl mx-auto">
              {subAdmins.map((admin) => (
                <div
                  key={admin.email}
                  className="bg-neutral-900/80 p-7 rounded-3xl border border-neutral-800 shadow-xl hover:border-yellow-500/40 transition-all"
                >
                  <p className="text-xl font-semibold">{admin.email}</p>
                  <p className="text-neutral-300 text-sm mt-2 tracking-wide">
                    Domains:{" "}
                    <span className="text-yellow-400">
                      {admin.allowed_domains.join(", ")}
                    </span>
                  </p>

                  <button
                    onClick={() => removeSubAdmin(admin.email)}
                    className="mt-5 bg-red-600 hover:bg-red-500 px-5 py-2 rounded-xl transition text-white font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center mb-10">
            Add New Sub Admin
          </h2>

          <div className="bg-neutral-900/70 backdrop-blur-xl p-10 rounded-3xl border border-neutral-800 shadow-xl max-w-xl mx-auto space-y-8">
            <input
              type="email"
              placeholder="Sub Admin Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
              className="w-full p-4 rounded-2xl bg-neutral-800 text-white placeholder-neutral-500 focus:ring-2 focus:ring-yellow-500 outline-none"
            />

            <div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">
                Assign Domains
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {DOMAIN_OPTIONS.map((domain) => (
                  <label
                    key={domain}
                    className="flex items-center gap-3 text-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={newAdmin.domains.includes(domain)}
                      onChange={() => toggleDomain(domain)}
                      className="accent-yellow-500 scale-125"
                    />
                    {domain}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={addSubAdmin}
              className="mt-2 w-full bg-yellow-500 hover:bg-yellow-400 transition text-black py-4 rounded-2xl text-xl font-semibold tracking-wide shadow-lg"
            >
              Add Sub Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
