import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { getMySpaces, ParkingSpace, uploadImage, updateProfile, getOwnerBookings, deleteSpace } from "../services/api";

const TYPE_ICON: Record<string, string> = {
  Covered: "🏠", Open: "☀️", Garage: "🚗", "Multi-level": "🏢",
};

const MyProfile: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<any>(null);
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
      .catch(err => console.error(err));

    getOwnerBookings(userData.id)
      .then(data => setBookings(data.bookings || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [history]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        const { url } = await uploadImage(base64);
        await updateProfile(user.id, { avatar_url: url });
        
        // Update local user state
        const updatedUser = { ...user, avatar_url: url };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      };
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    history.push("/login");
  };

  const handleDeleteSpace = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent navigating to space details
    if (!window.confirm("Are you sure you want to delete this parking space? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteSpace(id);
      // Update UI by removing the deleted space
      setSpaces(prev => prev.filter(space => space.id !== id));
      // Optional: recalculate bookings/earnings if we want to immediately drop them from stats
      setBookings(prev => prev.filter(booking => booking.space_id !== id));
    } catch (err) {
      console.error("Failed to delete space", err);
      alert("Failed to delete the space. Please try again.");
    }
  };

  if (!user) return null;

  // Dynamic stats
  const displayRating = 4.8; // Kept as 4.8 since there's no reviews table yet
  const totalBookings = bookings.length;
  // Calculate total earnings from all bookings (sum of space.price or a simple calculation)
  // Since duration is a string like "2 hours", we can simplify by just adding space.price for each booking as a demo.
  const earningsAmount = bookings.reduce((sum, b) => sum + (b.spaces?.price || 0), 0);
  const earnings = `₹${earningsAmount}`;

  return (
    <IonPage>
      <IonContent scrollY={true}>
        <div className="min-h-screen bg-dark-900">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-dark-800/90 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Wheelstay" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h1 className="font-display text-xl font-black gradient-text">Wheelstay</h1>
                  <p className="text-[10px] text-slate-500 mt-0.5">Space Owner Dashboard</p>
                </div>
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
            <div className="glass rounded-3xl p-8 flex items-center gap-7 relative">
              <label className="relative w-24 h-24 rounded-full bg-gradient-brand flex items-center justify-center text-white text-3xl font-black shadow-glow shrink-0 uppercase cursor-pointer overflow-hidden group">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{user.name ? user.name.charAt(0) : "U"}</span>
                )}
                {/* Upload overlay */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-sm font-bold">Upload</span>
                  )}
                </div>
              </label>
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
                          <p className="text-sm text-slate-400 font-medium text-left">{space.type} · {bookings.filter(b => b.space_id === space.id).length} bookings</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-lg font-black text-brand-400">₹{space.price}/{space.price_type === 'daily' ? 'day' : space.price_type === 'monthly' ? 'mo' : 'hr'}</span>
                        {bookings.some(b => b.space_id === space.id) ? (
                          <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 font-semibold text-sm">
                            Booked
                          </span>
                        ) : (
                          <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 font-semibold text-sm">
                            Active
                          </span>
                        )}
                        <button 
                          onClick={(e) => handleDeleteSpace(e, space.id)}
                          className="ml-2 w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center transition-colors border border-red-500/20"
                          title="Delete space"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Booked Spaces by Car Owners */}
            <div className="glass rounded-3xl p-8">
              <h3 className="font-black text-white text-lg mb-7 flex items-center gap-3">
                <span className="w-8 h-8 bg-amber-600/20 rounded-lg text-amber-400 flex items-center justify-center text-xl">📋</span>
                Bookings Received
              </h3>
              
              {bookings.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-slate-400">No bookings received yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking: any, idx: number) => {
                    const subtotal = (booking.spaces?.price || 0) * (parseInt(booking.duration) || 0);
                    const fee = Math.round(subtotal * 0.1);
                    const total = subtotal + fee;
                    return (
                      <div key={idx} className="rounded-2xl bg-white/5 border border-white/8 p-5 space-y-4 hover:bg-white/8 transition-colors">
                        {/* Booking Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400 text-lg">🅿️</div>
                            <div>
                              <p className="font-bold text-white">{booking.spaces?.name || "Unknown Space"}</p>
                              <p className="text-xs text-slate-500">{booking.spaces?.address || ""}</p>
                            </div>
                          </div>
                          <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 font-semibold text-xs uppercase tracking-wider">Confirmed</span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Ref</p>
                            <p className="text-sm font-bold text-slate-200 font-mono">{booking.reference}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Driver</p>
                            <p className="text-sm font-bold text-slate-200 truncate">{booking.driver_email}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Duration</p>
                            <p className="text-sm font-bold text-slate-200">{booking.duration}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Earned</p>
                            <p className="text-sm font-black text-emerald-400">₹{total}</p>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <p className="text-xs text-slate-500">Booked on {new Date(booking.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                          <p className="text-xs text-slate-500">Subtotal ₹{subtotal} + Fee ₹{fee}</p>
                        </div>
                      </div>
                    );
                  })}
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
