import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { registerUser } from "../services/api";

const fields = [
  { label: "Full Name",        name: "name",            type: "text",     placeholder: "John Doe" },
  { label: "Email Address",    name: "email",           type: "email",    placeholder: "john@example.com" },
  { label: "Phone Number",     name: "phone",           type: "tel",      placeholder: "+91 98765 43210" },
  { label: "Address",          name: "address",         type: "text",     placeholder: "123, Street, City" },
  { label: "Password",         name: "password",        type: "password", placeholder: "••••••••" },
  { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "••••••••" },
] as const;

type FormKey = (typeof fields)[number]["name"];

const Register: React.FC = () => {
  const history = useHistory();
  const [role, setRole] = useState<"owner" | "driver">("driver");
  const [form, setForm] = useState<Record<FormKey, string>>({
    name: "", email: "", phone: "", address: "", password: "", confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, phone: form.phone, address: form.address, password: form.password, role });
      setSuccess(true);
      setTimeout(() => history.push("/login"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollY={true} className="bg-dark-900">
        <div className="relative w-full min-h-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-60 bg-purple-700 opacity-10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full flex justify-center px-5 py-10">
            {success ? (
              <div className="w-full max-w-md text-center animate-in">
                <div className="glass rounded-3xl p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h2 className="font-display text-2xl font-extrabold text-white mb-2">Account Created!</h2>
                  <p className="text-slate-400 mb-6">Welcome to Wheelstay! Redirecting to login...</p>
                  <button
                    onClick={() => history.push("/login")}
                    className="btn-primary w-full"
                  >
                    Go to Login →
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md animate-in">
                {/* Header */}
                <div className="text-center mb-7">
                  <img src="/logo.png" alt="Wheelstay" className="w-16 h-16 mx-auto mb-4 rounded-2xl shadow-glow object-cover" />
                  <h1 className="font-display text-3xl font-extrabold gradient-text">Create Account</h1>
                  <p className="text-dark-500 text-sm mt-1">Join the Wheelstay community</p>
                </div>

                {/* Role Toggle */}
                <div className="glass rounded-full p-1.5 flex mb-6 relative">
                  <div className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-gradient-brand rounded-full transition-transform duration-300 ease-out shadow-glow-sm ${role === "driver" ? "translate-x-0" : "translate-x-full"}`}></div>
                  {(["driver", "owner"] as const).map((r) => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`flex-1 py-3.5 rounded-full text-base font-semibold transition-colors duration-300 relative z-10 ${
                        role === r ? "text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {r === "driver" ? "🚗 Car Owner" : "🏠 Space Owner"}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">⚠️ {error}</div>
                )}

                <div className="glass rounded-3xl p-7">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(({ label, name, type, placeholder }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
                        <input type={type} name={name} value={form[name]} onChange={handleChange}
                          placeholder={placeholder} required className="input-dark" />
                      </div>
                    ))}

                    <button type="submit" disabled={loading}
                      className="btn-primary w-full mt-2 disabled:opacity-50"
                    >
                      {loading
                        ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : "Create Account →"}
                    </button>
                  </form>
                </div>

                <p className="text-center text-base text-slate-500 mt-5 pb-10">
                  Already have an account?{" "}
                  <button onClick={() => history.push("/login")} className="text-brand-400 font-bold hover:text-brand-300 transition underline underline-offset-2">
                    Sign In
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
