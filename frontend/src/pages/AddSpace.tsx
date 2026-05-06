import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { addSpace } from "../services/api";


const AddSpace: React.FC = () => {
  const history = useHistory();
  const [form, setForm] = useState({ name: "", address: "", price: "", type: "", description: "" });
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSecurity, setSelectedSecurity] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type) { setError("Please select a space type."); return; }
    
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setError("You must be logged in to list a space.");
      history.push("/login");
      return;
    }
    
    const user = JSON.parse(userStr);
    
    setLoading(true);
    try {
      await addSpace({
        name: form.name,
        address: form.address,
        price: Number(form.price),
        type: form.type,
        description: form.description,
        owner_id: user.id
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to add space.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <IonPage>
        <IonContent>
          <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-6 py-12">
            <div className="glass rounded-3xl p-12 text-center max-w-sm w-full animate-in">
              <div className="w-24 h-24 bg-emerald-500/20 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Space Listed! 🎉</h2>
              <p className="text-slate-400 text-base mb-10 leading-relaxed">
                <strong className="text-white">{JSON.parse(localStorage.getItem("user") || "{}").name}</strong> is now live. Car owners can find and book it.
              </p>
              <div className="space-y-4">
                <button onClick={() => { 
                  setSuccess(false); 
                  setForm({ name:"",address:"",price:"",type:"",description:"" }); 
                  setSelectedVehicles([]);
                  setSelectedAmenities([]);
                  setSelectedSecurity([]);
                }}
                  className="btn-outline w-full text-base">
                  Add Another Space
                </button>
                <button onClick={() => history.push("/myprofile")}
                  className="btn-primary w-full py-5 text-lg">
                  View My Profile →
                </button>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent scrollY={true}>
        <div className="min-h-screen bg-dark-900">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-dark-800/90 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-5">
              <button onClick={() => history.push("/myprofile")}
                className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="font-display text-2xl font-black gradient-text">List a Space</h1>
                <p className="text-sm text-slate-500 mt-0.5">Earn money from your parking space</p>
              </div>
            </div>
          </header>

          <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
            {error && (
              <div className="glass border-2 border-red-500/30 bg-red-500/10 text-red-400 text-base px-6 py-4 rounded-2xl animate-in font-medium">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 animate-in">
              {/* Space Info */}
              <div className="glass rounded-3xl p-8 space-y-7">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Space Information</h2>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Space Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="e.g. Shaded Driveway Spot" required className="input-dark text-base" />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Full Address</label>
                  <input type="text" name="address" value={form.address} onChange={handleChange}
                    placeholder="e.g. 12, 1st Avenue, Adyar, Chennai" required className="input-dark text-base" />
                </div>

                {/* Vehicle Type */}
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">Vehicle Type</label>
                  <p className="text-xs text-slate-500 mb-4">What kind of vehicles can be parked here? You can select multiple types.</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {[
                      { name: "Compact", icon: "🚙" },
                      { name: "Sedan", icon: "🚗" },
                      { name: "SUV", icon: "🚘" },
                      { name: "Minibus", icon: "🚐" },
                      { name: "Bus", icon: "🚌" },
                      { name: "Bike", icon: "🛵" },
                    ].map(v => {
                      const isSelected = selectedVehicles.includes(v.name);
                      return (
                        <button key={v.name} type="button"
                          onClick={() => setSelectedVehicles(prev => isSelected ? prev.filter(t => t !== v.name) : [...prev, v.name])}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group ${isSelected ? "border-brand-500 bg-brand-500/10" : "border-white/10 glass hover:border-brand-500 hover:bg-brand-500/5"}`}>
                          <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{v.icon}</span>
                          <span className={`text-xs font-semibold ${isSelected ? "text-brand-400" : "text-slate-300"}`}>{v.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Parking Type */}
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">Parking Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["Any type", "Independent house", "Gated apartment", "Commercial parking"].map(tag => (
                      <button key={tag} type="button"
                        onClick={() => setForm({ ...form, type: tag })}
                        className={`flex items-center justify-center p-4 h-24 rounded-2xl border text-sm transition-all font-semibold text-center ${form.type === tag ? "border-brand-500 bg-brand-500/10 text-brand-400" : "border-white/10 glass text-slate-300 hover:border-brand-500 hover:bg-brand-500/5"}`}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Description (optional)</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    placeholder="Describe security features, access instructions, etc."
                    rows={4}
                    className="input-dark resize-none text-base"
                  />
                </div>
              </div>

              {/* Amenities & Security */}
              <div className="glass rounded-3xl p-8 space-y-8">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Amenities & Security</h2>
                
                {/* Amenities & features */}
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">Amenities & features</label>
                  <div className="flex flex-col gap-4">
                    {[
                      { 
                        title: "Gated entry", 
                        subtitle: "Controlled gate access",
                        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                      },
                      { 
                        title: "EV charging", 
                        subtitle: "Electric vehicle charging",
                        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      },
                      { 
                        title: "Well lit", 
                        subtitle: "Bright night lighting",
                        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      }
                    ].map(item => {
                      const isSelected = selectedAmenities.includes(item.title);
                      return (
                        <button key={item.title} type="button"
                          onClick={() => setSelectedAmenities(prev => isSelected ? prev.filter(t => t !== item.title) : [...prev, item.title])}
                          className={`flex items-center gap-5 p-5 rounded-[1.25rem] border transition-all text-left ${isSelected ? "border-brand-500 bg-brand-500/10" : "border-white/10 glass hover:border-brand-500 hover:bg-brand-500/5"}`}>
                          <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? "bg-brand-500 text-white shadow-glow-sm" : "bg-white/5 text-slate-400"}`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-base font-bold ${isSelected ? "text-brand-400" : "text-slate-200"}`}>{item.title}</h4>
                            <p className="text-sm text-slate-500">{item.subtitle}</p>
                          </div>
                          <div className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-brand-500 bg-brand-500 shadow-glow-sm" : "border-slate-600"}`}>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Security */}
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">Security</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["CCTV", "Security Guard"].map(tag => {
                      const isSelected = selectedSecurity.includes(tag);
                      return (
                        <button key={tag} type="button"
                          onClick={() => setSelectedSecurity(prev => isSelected ? prev.filter(t => t !== tag) : [...prev, tag])}
                          className={`flex items-center justify-center p-4 h-24 rounded-2xl border text-sm transition-all font-semibold text-center ${isSelected ? "border-brand-500 bg-brand-500/10 text-brand-400" : "border-white/10 glass text-slate-300 hover:border-brand-500 hover:bg-brand-500/5"}`}>
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="glass rounded-3xl p-8">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-7">Pricing</h2>
                <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Rate (₹ per hour)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">₹</span>
                  <input type="number" name="price" value={form.price} onChange={handleChange}
                    placeholder="50" min="10" required
                    className="input-dark text-base font-semibold"
                    style={{ paddingLeft: "2.5rem", paddingRight: "4rem" }}
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 text-base font-semibold">/hr</span>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full text-lg py-5 disabled:opacity-50"
              >
                {loading
                  ? <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  : <>List My Space 🚀</>}
              </button>
            </form>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddSpace;
