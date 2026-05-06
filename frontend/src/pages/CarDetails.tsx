import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";

const DURATIONS = [
  { value: "hourly",  label: "Hourly",  icon: "⏱️", desc: "Pay per hour" },
  { value: "daily",   label: "Daily",   icon: "📅", desc: "Full day rate" },
  { value: "monthly", label: "Monthly", icon: "📆", desc: "Best value" },
];

const CarDetails: React.FC = () => {
  const history = useHistory();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLocationStatus("Requesting location…");
    if (!navigator.geolocation) { setLocationStatus("Geolocation not supported."); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus(`📍 (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
      },
      () => setLocationStatus("Permission denied. Please allow location access.")
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const params = location ? `?lat=${location.lat}&lng=${location.lng}` : "";
    history.push(`/dashboard${params}`);
  };

  return (
    <IonPage>
      <IonContent>
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-6 py-12 relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-brand-700 opacity-10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full max-w-md animate-in">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-brand rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow text-4xl">
                🚗
              </div>
              <h1 className="font-display text-4xl font-black gradient-text mb-3">Set Preferences</h1>
              <p className="text-slate-400 text-base">Tell us where and how long you need parking</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Location */}
              <div className="glass rounded-3xl p-8">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Your Location</h2>
                <button type="button" onClick={getLocation}
                  className={`w-full flex items-center justify-center gap-4 py-4 px-6 rounded-2xl text-base font-bold border-2 transition-all ${
                    location
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                      : "border-brand-600/50 text-brand-400 hover:bg-brand-600/15 hover:border-brand-500/70"
                  }`}
                >
                  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {location ? "Location Set ✓" : "Use Current Location"}
                </button>
                {locationStatus && (
                  <p className={`mt-3 text-sm text-center font-medium ${location ? "text-emerald-400" : "text-slate-500"}`}>
                    {locationStatus}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="glass rounded-3xl p-8">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Parking Duration</h2>
                <div className="space-y-3">
                  {DURATIONS.map(({ value, label, icon, desc }) => (
                    <button key={value} type="button" onClick={() => setDuration(value)}
                      className={`w-full flex items-center gap-5 p-5 rounded-2xl border-2 transition-all ${
                        duration === value
                          ? "bg-gradient-brand border-brand-600 text-white shadow-glow-sm"
                          : "border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <span className="text-2xl shrink-0">{icon}</span>
                      <div className="text-left">
                        <p className="font-bold text-base">{label}</p>
                        <p className={`text-sm mt-0.5 font-medium ${duration === value ? "text-blue-200" : "text-slate-500"}`}>{desc}</p>
                      </div>
                      {duration === value && (
                        <svg className="w-6 h-6 ml-auto shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={!duration || loading}
                className="btn-primary w-full text-lg py-5 disabled:opacity-50"
              >
                {loading
                  ? <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  : <>Find Parking Spots 🔍</>}
              </button>
            </form>

            <p className="text-center mt-8">
              <button onClick={() => history.push("/login")}
                className="text-base text-slate-500 hover:text-brand-400 transition font-semibold">
                ← Back to Login
              </button>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CarDetails;
