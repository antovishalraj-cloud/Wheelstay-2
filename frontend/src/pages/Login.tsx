import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { loginUser } from "../services/api";

const Login: React.FC = () => {
  const history = useHistory();
  const [role, setRole] = useState<"owner" | "driver">("driver");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser({ ...form, role });
      if (res.user) {
        // Save user with the selected role
        localStorage.setItem("user", JSON.stringify({ ...res.user, role }));
      }
      // Redirect based on the TAB the user selected
      const redirect = role === "owner" ? "/myprofile" : "/cardetails";
      history.replace(redirect);
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={true}>
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-6 py-12 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-56 bg-blue-700 opacity-8 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full max-w-md animate-in">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-brand rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow text-4xl">
                🅿️
              </div>
              <h1 className="font-display text-4xl font-black gradient-text mb-3">Welcome Back</h1>
              <p className="text-slate-400 text-base">Sign in to your Wheelstay account</p>
            </div>

            {/* Role Toggle */}
            <div className="glass rounded-2xl p-1.5 flex mb-8 relative">
              {/* sliding background pill */}
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-brand rounded-xl shadow-glow-sm transition-all duration-300 ease-out ${
                  role === "driver" ? "left-1.5" : "left-[calc(50%+3px)]"
                }`}
              />
              {(["driver", "owner"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setError(""); }}
                  className={`flex-1 py-4 rounded-xl text-sm font-bold transition-colors duration-300 relative z-10 flex items-center justify-center gap-2 ${
                    role === r ? "text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="text-lg">{r === "driver" ? "🚗" : "🏠"}</span>
                  {r === "driver" ? "Car Owner" : "Space Owner"}
                </button>
              ))}
            </div>

            {/* Role description */}
            <p className="text-center text-xs text-slate-500 mb-6 -mt-4">
              {role === "driver"
                ? "Find and book nearby parking spaces"
                : "Manage your listed parking spaces"}
            </p>

            {/* Error */}
            {error && (
              <div className="glass border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-5 py-4 rounded-2xl mb-6 animate-in">
                ⚠️ {error}
              </div>
            )}

            <div className="glass rounded-3xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2.5 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="input-dark"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs text-brand-400 font-semibold hover:text-brand-300 transition"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="input-dark"
                      style={{ paddingRight: "4rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-brand-400 font-semibold hover:text-brand-300 transition"
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 rounded-2xl font-bold text-base mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In as {role === "owner" ? "Space Owner" : "Car Owner"} →
                    </>
                  )}
                </button>
              </form>
            </div>

            <p className="text-center text-base text-slate-500 mt-7">
              No account?{" "}
              <button
                onClick={() => history.push("/register")}
                className="text-brand-400 font-bold hover:text-brand-300 transition underline underline-offset-2"
              >
                Register for free
              </button>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
