import { useState, useEffect } from "react";
import api from "../api/admin";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import BackButton from "../components/backButton";

export default function AdminManagement() {
  const [isHeadAdmin, setIsHeadAdmin] = useState(false);
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

const DOMAIN_OPTIONS = [
  { label: "WEB", value: ["WEB"] },
  { label: "APP", value: ["APP"] },
  { label: "AI/ML", value: ["AI/ML"] },
  { label: "CC", value: ["CC"] },
  { label: "EVENTS", value: ["EVENTS"] },
  { label: "PNM", value: ["PNM"] },
  { label: "UI/UX", value: ["UI/UX"] },
  { label: "VIDEO", value: ["VIDEO", "VIDEO EDITING"] }
];


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
    } catch {
      setIsHeadAdmin(false);
    }
  };

const toggleDomain = (option) => {
  setNewAdmin((p) => {
    const exists = option.value.every(d => p.domains.includes(d));

    return {
      ...p,
      domains: exists
        ? p.domains.filter(d => !option.value.includes(d))
        : [...new Set([...p.domains, ...option.value])]
    };
  });
};

const selectAllDomains = () => {
  const allDomains = DOMAIN_OPTIONS.flatMap(o => o.value);

  setNewAdmin((p) => ({
    ...p,
    domains:
      p.domains.length === allDomains.length ? [] : allDomains
  }));
};


  const addSubAdmin = async () => {
    if (!newAdmin.email.trim()) return;
    await api.post("/admin/add-sub-admin", {
      email: newAdmin.email.trim(),
      allowed_domains: newAdmin.domains
    });
    setNewAdmin({ email: "", domains: [] });
    validateHeadAdmin();
  };

  const removeSubAdmin = async (email) => {
    await api.delete("/admin/remove-sub-admin", { params: { email } });
    validateHeadAdmin();
  };

  if (loading)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white text-lg sm:text-xl">
        hold up buddy
      </div>
    );

  if (!isHeadAdmin)
    return (
      <div className="min-h-screen bg-black text-red-500 flex justify-center items-center text-xl sm:text-3xl font-semibold">
        Not for you buddy XD
        <BackButton label="Go Back" /> 
      </div>
      
    );
    const ALL_DOMAINS = DOMAIN_OPTIONS.flatMap(o => o.value);


  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-10 sm:py-14">
      <BackButton label="Go Back" />


      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
        <div>
          
          <h2 className="text-xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">
            Sub Admins
            
          </h2>
          

          {subAdmins.length === 0 ? (
            <p className="text-center text-neutral-400 text-sm sm:text-lg">
              No Sub Admins Added Yet
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {subAdmins.map((admin) => (
                <div
                  key={admin.email}
                  className="bg-neutral-900/80 p-5 sm:p-6 rounded-3xl border border-neutral-800 shadow-xl"
                >
                  <p className="text-base sm:text-lg font-semibold break-all">
                    {admin.email}
                  </p>

                  <p className="text-sm text-neutral-300 mt-2">
                    Domains:{" "}
                    <span className="text-yellow-400">
                      {admin.allowed_domains.join(", ")}
                    </span>
                  </p>

                  <button
                    onClick={() => removeSubAdmin(admin.email)}
                    className="mt-4 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl text-white w-full sm:w-auto"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">
            Add New Sub Admin
          </h2>

          <div className="bg-neutral-900/70 p-6 sm:p-10 rounded-3xl border border-neutral-800 shadow-xl max-w-xl mx-auto space-y-6">
            <input
              type="email"
              placeholder="Sub Admin Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
              className="w-full p-3 sm:p-4 rounded-2xl bg-neutral-800 text-white placeholder-neutral-500 focus:ring-2 focus:ring-yellow-500 outline-none"
            />

            <div>
              <h3 className="text-base sm:text-xl font-semibold mb-4">
                Assign Domains
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ALL_DOMAINS.every(d => newAdmin.domains.includes(d))}

                    onChange={selectAllDomains}
                    className="accent-yellow-500 scale-110"
                  />
                  Select All Domains
                </label>
              {DOMAIN_OPTIONS.map((option) => (
                <label key={option.label} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={option.value.every(d => newAdmin.domains.includes(d))}
                    onChange={() => toggleDomain(option)}
                    className="accent-yellow-500 scale-110"
                  />
                  {option.label}
                </label>
              ))}

              </div>
            </div>

            <button
              onClick={addSubAdmin}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3 rounded-2xl text-base sm:text-xl font-semibold shadow-lg"
            >
              Add Sub Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
