import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { getSpaceById, ParkingSpace, SpaceOwner } from "../services/api";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const BookingDetails: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const history = useHistory();
  const [space, setSpace] = useState<ParkingSpace | null>(null);
  const [owner, setOwner] = useState<SpaceOwner | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = parseInt(spaceId, 10);
        // Fetch space and owner
        const spaceData = await getSpaceById(id);
        setSpace(spaceData.space);
        setOwner(spaceData.owner);

        // Fetch bookings for this space from owner bookings endpoint
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const res = await fetch(`${API}/bookings/owner/${user.id}`);
          const data = await res.json();
          const spaceBookings = (data.bookings || []).filter((b: any) => b.space_id === id);
          setBookings(spaceBookings);
        }
      } catch (err) {
        console.error("Failed to load space details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [spaceId]);

  if (loading) {
    return (
      <IonPage><IonContent>
        <div className="min-h-screen bg-dark-900 flex items-center justify-center flex-col gap-3">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-dark-500 text-sm">Loading space details…</p>
        </div>
      </IonContent></IonPage>
    );
  }

  if (!space) {
    return (
      <IonPage><IonContent>
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
          <div className="glass rounded-3xl p-8 text-center max-w-sm">
            <span className="text-4xl block mb-3">⚠️</span>
            <p className="text-red-400 mb-4">Space not found.</p>
            <button onClick={() => history.goBack()} className="text-brand-400 hover:underline text-sm">← Go Back</button>
          </div>
        </div>
      </IonContent></IonPage>
    );
  }

  const priceLabel = space.price_type === 'daily' ? 'day' : space.price_type === 'monthly' ? 'mo' : 'hr';
  const isBooked = bookings.length > 0;

  return (
    <IonPage>
      <IonContent scrollY={true}>
        <div className="min-h-screen bg-dark-900">
          <div className="max-w-4xl mx-auto px-6 py-8 animate-in">
            {/* Back */}
            <button onClick={() => history.goBack()}
              className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white mb-8 transition-colors group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>

            {/* Space Image */}
            {space.image && (
              <div className="rounded-3xl overflow-hidden mb-8 h-64 relative">
                <img src={space.image} alt={space.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  {isBooked ? (
                    <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2 font-semibold text-sm backdrop-blur-sm">🔒 Booked</span>
                  ) : (
                    <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 font-semibold text-sm backdrop-blur-sm">✅ Available</span>
                  )}
                </div>
              </div>
            )}

            {/* Space Info */}
            <div className="glass rounded-3xl p-8 mb-8">
              <h1 className="font-display text-3xl font-black text-white mb-6">{space.name}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Type</p>
                  <p className="text-base font-bold text-white">{space.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Rate</p>
                  <p className="text-base font-black text-brand-400">₹{space.price}/{priceLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Status</p>
                  {isBooked ? (
                    <p className="text-base font-bold text-amber-400">Booked</p>
                  ) : (
                    <p className="text-base font-bold text-emerald-400">Active</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Bookings</p>
                  <p className="text-base font-bold text-white">{bookings.length}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="glass rounded-3xl p-8 mb-8">
              <h3 className="font-black text-white text-lg mb-4 flex items-center gap-3">
                <span className="text-xl">📍</span> Location
              </h3>
              <p className="text-slate-300 text-base font-medium">{space.address}</p>
              {space.lat && space.lng && (
                <p className="text-sm text-slate-500 mt-2 font-mono">Lat: {space.lat}, Lng: {space.lng}</p>
              )}
            </div>

            {/* Amenities & Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Amenities */}
              <div className="glass rounded-3xl p-8">
                <h3 className="font-black text-white text-lg mb-5 flex items-center gap-3">
                  <span className="text-xl">🛠️</span> Amenities
                </h3>
                {space.amenities && space.amenities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {space.amenities.map((a: string, i: number) => (
                      <span key={i} className="badge bg-brand-500/10 text-brand-400 border border-brand-500/20 px-3 py-1.5 font-semibold text-sm">{a}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No amenities listed</p>
                )}
              </div>

              {/* Security */}
              <div className="glass rounded-3xl p-8">
                <h3 className="font-black text-white text-lg mb-5 flex items-center gap-3">
                  <span className="text-xl">🔒</span> Security
                </h3>
                {space.security && space.security.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {space.security.map((s: string, i: number) => (
                      <span key={i} className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 font-semibold text-sm">{s}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No security features listed</p>
                )}
              </div>
            </div>

            {/* Bookings for this space */}
            <div className="glass rounded-3xl p-8">
              <h3 className="font-black text-white text-lg mb-7 flex items-center gap-3">
                <span className="w-8 h-8 bg-amber-600/20 rounded-lg text-amber-400 flex items-center justify-center text-xl">📅</span>
                Bookings ({bookings.length})
              </h3>

              {bookings.length === 0 ? (
                <div className="py-10 text-center">
                  <span className="text-5xl block mb-4">📭</span>
                  <p className="text-slate-400 text-lg font-medium">No bookings yet for this space.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking: any, idx: number) => {
                    const subtotal = (space.price || 0) * (parseInt(booking.duration) || 0);
                    const fee = Math.round(subtotal * 0.1);
                    const total = subtotal + fee;
                    return (
                      <div key={idx} className="rounded-2xl bg-white/5 border border-white/8 p-6 space-y-5 hover:bg-white/8 transition-colors">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Booking Ref</p>
                            <p className="font-mono font-bold text-white text-lg">{booking.reference}</p>
                          </div>
                          <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 font-semibold text-xs uppercase tracking-wider">
                            ✅ Confirmed
                          </span>
                        </div>

                        {/* Driver Details */}
                        <div className="flex items-start gap-5 p-5 bg-white/3 rounded-xl border border-white/5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-2xl font-black shadow-glow-sm shrink-0">
                            {booking.driver_email?.charAt(0)?.toUpperCase() || "D"}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                              <span>🚗</span> Car Owner
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm font-medium">Email</span>
                                <span className="font-semibold text-white text-sm">{booking.driver_email}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Duration</p>
                            <p className="text-sm font-bold text-slate-200">{booking.duration}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Subtotal</p>
                            <p className="text-sm font-bold text-slate-200">₹{subtotal}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Fee (10%)</p>
                            <p className="text-sm font-bold text-slate-200">₹{fee}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Total Earned</p>
                            <p className="text-sm font-black text-emerald-400">₹{total}</p>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <p className="text-xs text-slate-500">
                            Booked on {new Date(booking.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(booking.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingDetails;
