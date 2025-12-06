import { useState, useEffect } from "react";
import api from "../api/admin";
import { auth } from "../../firebase"; 
import { onAuthStateChanged } from "firebase/auth";

export default function AdminManagement() {
  const [isHeadAdmin, setIsHeadAdmin] = useState(false);
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(false); //set true for buffer

  const DOMAIN_OPTIONS = ["WEB", "APP", "AI/ML", "UI/UX"];

  const [newAdmin, setNewAdmin] = useState({
    email: "",
    domains: []
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

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
    } catch (err) {
      console.error("Not head admin or error loading sub admins:", err);
      setIsHeadAdmin(false);
    }
  };

  const toggleDomain = (domain) => {
    setNewAdmin((prev) => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter((d) => d !== domain)
        : [...prev.domains, domain]
    }));
  };

  const addSubAdmin = async () => {
    if (!newAdmin.email) return;

    try {
      await api.post("/admin/add-sub-admin", {
        email: newAdmin.email,
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
      await api.delete("/admin/remove-sub-admin", {
        params: { email }
      });

      validateHeadAdmin();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  if (loading) return null; //add buffer if needed

  if (!isHeadAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center text-2xl">
        Access Denied Nigga, suck it
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">

      <h1 className="text-4xl font-bold tracking-tight mb-12 text-center">
        Admin Management
      </h1>

      <div className="w-full max-w-5xl space-y-16">

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Sub Admins
          </h2>

          {subAdmins.length === 0 ? (
            <p className="text-center text-neutral-400">No sub admins to display</p>
          ) : (
            <div className="space-y-4 max-w-xl mx-auto">
              {subAdmins.map((admin) => (
                <div
                  key={admin.email}
                  className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-md"
                >
                  <p className="text-xl font-semibold">{admin.email}</p>

                  <p className="text-neutral-300 mt-1">
                    Domains: {admin.allowed_domains.join(", ")}
                  </p>

                  <button
                    onClick={() => removeSubAdmin(admin.email)}
                    className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-center mb-6">Add Sub Admin</h2>

          <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 max-w-xl mx-auto space-y-6">
            <input
              type="text"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
              className="w-full p-4 rounded-xl bg-neutral-800 text-white outline-none"
            />

            <div>
              <h3 className="text-lg font-semibold mb-3">Domains</h3>

              <div className="grid grid-cols-2 gap-2">
                {DOMAIN_OPTIONS.map((domain) => (
                  <label key={domain} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdmin.domains.includes(domain)}
                      onChange={() => toggleDomain(domain)}
                      className="accent-green-500 scale-110"
                    />
                    {domain}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={addSubAdmin}
              className="w-full bg-neutral-700 hover:bg-neutral-600 py-3 rounded-xl text-lg font-medium"
            >
              Add Sub Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
