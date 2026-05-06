import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { getSpaceById, ParkingSpace, SpaceOwner } from "../services/api";

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [data, setData] = useState<{ space: ParkingSpace; owner: SpaceOwner } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hours, setHours] = useState(1);

  useEffect(() => {
    getSpaceById(parseInt(id, 10))
      .then(setData)
      .catch(() => setError("Failed to load space details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <IonPage><IonContent>
      <div className="min-h-screen bg-dark-900 flex items-center justify-center flex-col gap-3">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-dark-500 text-sm">Loading booking details…</p>
      </div>
    </IonContent></IonPage>
  );

  if (error || !data) return (
    <IonPage><IonContent>
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="glass rounded-3xl p-8 text-center max-w-sm">
          <span className="text-4xl block mb-3">⚠️</span>
          <p className="text-red-400 mb-4">{error || "Space not found."}</p>
          <button onClick={() => history.goBack()} className="btn-primary px-6 py-3 text-sm">← Go Back</button>
        </div>
      </div>
    </IonContent></IonPage>
  );

  const { space, owner } = data;
  const totalPrice = space.price * hours;

  return (
    <IonPage>
      <IonContent>
        <div className="min-h-screen bg-dark-900">
          <div className="max-w-4xl mx-auto px-6 py-8 animate-in">
            {/* Back */}
            <button onClick={() => history.goBack()}
              className="flex items-center gap-2 text-base font-semibold text-slate-400 hover:text-white mb-8 transition-colors group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <h1 className="font-display text-4xl font-black text-white mb-10">Complete Your Booking</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left - Space & Owner Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Space Info */}
                <div className="glass rounded-3xl p-8">
                  <h2 className="font-black text-white mb-6 flex items-center gap-3 text-lg">
                    <span>🅿️</span> Parking Space
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-white/8">
                      <span className="text-slate-400 font-medium">Space Name</span>
                      <span className="font-bold text-white">{space.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/8">
                      <span className="text-slate-400 font-medium">Type</span>
                      <span className="font-bold text-white">{space.type}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-400 font-medium">Address</span>
                      <span className="font-bold text-white text-right">{space.address}</span>
                    </div>
                  </div>
                </div>

                {/* Owner Details */}
                <div className="glass rounded-3xl p-8">
                  <h2 className="font-black text-white mb-6 flex items-center gap-3 text-lg">
                    <span>👤</span> Space Owner
                  </h2>
                  <div className="flex items-center gap-5 mb-7 pb-7 border-b border-white/8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-3xl font-black shadow-glow-sm shrink-0">
                      {owner.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-xl">{owner.name}</p>
                      <p className="text-base text-amber-400 font-semibold flex items-center gap-1">
                        <span>★</span> {owner.rating} / 5.0
                      </p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Phone</span>
                      <span className="font-semibold text-white">{owner.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Email</span>
                      <span className="font-semibold text-white text-right">{owner.email}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Duration */}
                <div className="glass rounded-3xl p-8">
                  <h2 className="font-black text-white mb-6 flex items-center gap-3 text-lg">
                    <span>⏱️</span> Booking Duration
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Hours</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => hours > 1 && setHours(hours - 1)}
                          className="w-12 h-12 rounded-xl bg-slate-700 text-white text-xl font-bold hover:bg-slate-600 transition-all hover:scale-105">
                          −
                        </button>
                        <span className="font-bold text-3xl text-white w-14 text-center">{hours}</span>
                        <button onClick={() => setHours(hours + 1)}
                          className="w-12 h-12 rounded-xl bg-brand-500 text-white text-xl font-bold hover:bg-brand-600 transition-all hover:scale-105">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Summary */}
              <div className="space-y-8">
                <div className="glass rounded-3xl p-8 sticky top-8">
                  <h2 className="font-black text-white mb-6 flex items-center gap-3 text-lg">
                    <span>💰</span> Price Summary
                  </h2>
                  <div className="space-y-5 mb-8">
                    <div className="flex items-center justify-between py-3 border-b border-white/8">
                      <span className="text-slate-400 font-medium">Rate</span>
                      <span className="font-bold text-white">₹{space.price}/hr</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/8">
                      <span className="text-slate-400 font-medium">Hours</span>
                      <span className="font-bold text-white">{hours}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/8">
                      <span className="text-slate-400 font-medium">Subtotal</span>
                      <span className="font-bold text-white">₹{totalPrice}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-400 font-medium">Platform Fee</span>
                      <span className="font-bold text-white">Free</span>
                    </div>
                    <div className="flex items-center justify-between py-4 border-t border-white/8 pt-4">
                      <span className="text-slate-200 font-bold text-lg">Total</span>
                      <span className="font-black text-brand-400 text-2xl">₹{totalPrice}</span>
                    </div>
                  </div>

                  <button onClick={() => history.push(`/payment/${space.id}/${hours}/${totalPrice}`)}
                    className="btn-primary w-full text-base py-5"
                  >
                    💳 Pay Now
                  </button>

                  <p className="text-xs text-slate-500 mt-4 text-center">
                    By booking, you agree to our Terms & Conditions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Booking;
