import { useState, useEffect } from "react";

const dummyFetchAdmins = () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          headAdmins: [
            { email: "alice@admin.com", name: "Alice (Head)" },
            { email: "charles@admin.com", name: "Charles (Head)" }
          ],
          subAdmins: [
            {
              email: "bob@admin.com",
              name: "Bob",
              domains: ["WEB", "AI/ML"],
              permissions: { view: true, edit: false, mark: true, slots: false }
            }
          ]
        }),
      300
    )
  );

const dummyAddAdmin = (newAdmin) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ success: true }), 300)
  );

export default function AdminManagement() {
  const [headAdmins, setHeadAdmins] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const DOMAIN_OPTIONS = ["WEB", "APP", "AI/ML", "UI/UX"];

  const [newAdmin, setNewAdmin] = useState({
    email: "",
    name: "",
    role: "SUB",
    domains: []
  });

  useEffect(() => {
    dummyFetchAdmins().then((data) => {
      setHeadAdmins(data.headAdmins);
      setSubAdmins(data.subAdmins);
      setLoading(false);
    });
  }, []);

  const applyHeadAdminFields = () => {
    setNewAdmin((prev) => ({
      ...prev,
      domains: [...DOMAIN_OPTIONS]
    }));
  };

  const onRoleChange = (role) => {
    if (role === "HEAD") {
      setNewAdmin((prev) => ({
        ...prev,
        role,
        domains: [...DOMAIN_OPTIONS]
      }));
    } else {
      setNewAdmin((prev) => ({
        ...prev,
        role,
        domains: []
      }));
    }
  };

  const toggleDomain = (domain) => {
    if (newAdmin.role === "HEAD") return;
    setNewAdmin((prev) => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter((d) => d !== domain)
        : [...prev.domains, domain]
    }));
  };

  const addAdmin = () => {
    if (!newAdmin.email || !newAdmin.name) return;

    dummyAddAdmin(newAdmin).then(() => {
      if (newAdmin.role === "HEAD")
        setHeadAdmins((prev) => [...prev, newAdmin]);
      else setSubAdmins((prev) => [...prev, newAdmin]);

      setNewAdmin({ email: "", name: "", role: "SUB", domains: [] });
    });
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold tracking-tight mb-12 text-center">
        Admin Management
      </h1>

      <div className="w-full max-w-5xl space-y-16">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Head Admins
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {headAdmins.map((admin) => (
                <div
                  key={admin.email}
                  className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-md hover:shadow-xl hover:border-neutral-700 transition transform hover:-translate-y-1"
                >
                  <p className="font-semibold text-xl">{admin.name}</p>
                  <p className="text-neutral-400 text-sm mt-2">{admin.email}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Sub Admins
            </h2>

            <div className="space-y-4 max-w-xl mx-auto">
              {subAdmins.map((admin) => (
                <div
                  key={admin.email}
                  className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-md hover:border-neutral-700 hover:bg-neutral-850 transition"
                >
                  <p className="font-semibold text-xl">{admin.name}</p>
                  <p className="text-neutral-400 mt-1">{admin.email}</p>
                  <p className="text-neutral-300 text-sm mt-3">
                    Domains: {admin.domains.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl text-center font-semibold mb-6">
            Add New Admin
          </h2>

          <div className="bg-neutral-900/70 backdrop-blur-lg p-8 rounded-2xl border border-neutral-800 shadow-xl max-w-xl mx-auto space-y-6">
            <input
              type="text"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
              className="w-full p-4 rounded-xl bg-neutral-800 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-700 transition"
            />

            <input
              type="text"
              placeholder="Name"
              value={newAdmin.name}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, name: e.target.value })
              }
              className="w-full p-4 rounded-xl bg-neutral-800 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-700 transition"
            />

            <div className="flex gap-10 mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={newAdmin.role === "HEAD"}
                  onChange={() => onRoleChange("HEAD")}
                  className="accent-green-500 scale-110"
                />
                <span className="text-lg">Head Admin</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={newAdmin.role === "SUB"}
                  onChange={() => onRoleChange("SUB")}
                  className="accent-green-500 scale-110"
                />
                <span className="text-lg">Sub Admin</span>
              </label>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Domains</h3>

              <div className="grid grid-cols-2 gap-2">
                {DOMAIN_OPTIONS.map((domain) => (
                  <label
                    key={domain}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={newAdmin.domains.includes(domain)}
                      disabled={newAdmin.role === "HEAD"}
                      onChange={() => toggleDomain(domain)}
                      className="accent-green-500 scale-110"
                    />
                    {domain}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={addAdmin}
              className="w-full bg-neutral-700 hover:bg-neutral-600 transition text-white py-3 rounded-xl text-lg font-medium tracking-wide"
            >
              Add Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
