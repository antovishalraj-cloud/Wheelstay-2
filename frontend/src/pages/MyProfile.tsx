import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { getMySpaces, ParkingSpace } from "../services/api";

const TYPE_ICON: Record<string, string> = {
  Covered: "🏠", Open: "☀️", Garage: "🚗", "Multi-level": "🏢",
};

const MyProfile: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<any>(null);
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      history.push("/login");
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    
    getMySpaces(userData.id)
      .then(data => setSpaces(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    history.push("/login");
  };

  if (!user) return null;

  // Mocked stats for display
  const displayRating = 4.8;
  const totalBookings = spaces.length * 15;
  const earnings = `₹${spaces.length * 5000}`;

  return (
    <IonPage>
      <IonContent scrollY={true}>
        <div className="min-h-screen bg-dark-900">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-dark-800/90 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-black gradient-text">Wheelstay</h1>
                <p className="text-xs text-slate-500 mt-0.5">Space Owner Dashboard</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-outline px-6 py-3 rounded-xl text-sm"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-in">
            {/* Profile Card */}
            <div className="glass rounded-3xl p-8 flex items-center gap-7">
              <div className="w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-3xl font-black shadow-glow shrink-0 uppercase">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-black text-white mb-1">{user.name}</h2>
                <p className="text-base text-slate-400 truncate">{user.email}</p>
                <p className="text-base text-slate-400">{user.phone || "No phone provided"}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <span className="text-amber-400 text-xl">★</span>
                  <span className="text-white font-black text-2xl">{displayRating}</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Rating</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Bookings",  value: totalBookings, color: "text-brand-400",  icon: "📅" },
                { label: "Earnings",  value: earnings,      color: "text-emerald-400", icon: "💰" },
                { label: "Rating",    value: `${displayRating}/5`, color: "text-amber-400",   icon: "⭐" },
              ].map(({ label, value, color, icon }) => (
                <div key={label} className="glass rounded-2xl p-8 text-center hover:shadow-glow-sm transition-all">
                  <span className="text-4xl block mb-3">{icon}</span>
                  <p className={`text-3xl font-black ${color} mb-2`}>{value}</p>
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>

            {/* List New Space CTA */}
            <button
              onClick={() => history.push("/addspace")}
              className="btn-primary w-full text-lg py-5"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              List New Parking Space
            </button>

            {/* My Spaces */}
            <div className="glass rounded-3xl p-8">
              <h3 className="font-black text-white text-lg mb-7 flex items-center gap-3">
                <span className="w-8 h-8 bg-brand-600/20 rounded-lg text-brand-400 flex items-center justify-center text-xl">🏠</span>
                My Listed Spaces
              </h3>
              
              {loading ? (
                 <div className="py-10 text-center flex flex-col items-center">
                   <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
                   <p className="text-slate-400">Loading your spaces...</p>
                 </div>
              ) : spaces.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-slate-400 mb-4">You haven't listed any spaces yet.</p>
                  <button onClick={() => history.push("/addspace")} className="text-brand-400 font-bold hover:underline">List your first space</button>
                </div>
              ) : (
                <div className="space-y-1">
                  {spaces.map((space, idx) => (
                    <button key={space.id}
                      onClick={() => history.push(`/booking-details/${space.id}`)}
                      className={`w-full flex items-center justify-between py-5 px-4 rounded-xl transition-all hover:bg-white/8 cursor-pointer ${idx > 0 ? 'border-t border-white/8' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                          {TYPE_ICON[space.type] ?? "🚗"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-base text-left">{space.name}</p>
                          <p className="text-sm text-slate-400 font-medium text-left">{space.type} · 0 bookings</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-lg font-black text-brand-400">₹{space.price}/hr</span>
                        <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 font-semibold text-sm">
                          Active
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="glass rounded-3xl p-8">
              <h3 className="font-black text-white text-lg mb-4 flex items-center gap-3">
                <span className="text-2xl">📍</span> Address
              </h3>
              <p className="text-slate-400 text-base leading-relaxed font-medium">{user.address || "No address provided"}</p>
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyProfile;
