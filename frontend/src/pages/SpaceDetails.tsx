import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { getSpaceById, ParkingSpace, SpaceOwner } from "../services/api";

const SpaceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [data, setData] = useState<{ space: ParkingSpace; owner: SpaceOwner } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        <p className="text-dark-500 text-sm">Loading space details…</p>
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
              Back to Dashboard
            </button>

            {/* Hero Image */}
            <div className="relative rounded-3xl overflow-hidden h-72 mb-10 shadow-card">
              <img src={space.image} alt={space.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/95 via-dark-900/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h1 className="text-3xl md:text-4xl font-black text-white font-display mb-3">{space.name}</h1>
                <p className="text-slate-200 text-base flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {space.address}
                </p>
              </div>
              <span className="absolute top-6 right-6 badge bg-white/15 text-white backdrop-blur px-4 py-2 font-bold text-base">{space.type}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left */}
              <div className="lg:col-span-2 space-y-8">
                {/* Space Details */}
                <div className="glass rounded-3xl p-8">
                  <h2 className="font-black text-white mb-6 flex items-center gap-3 text-base uppercase tracking-wider">
                    <span className="text-2xl">🏠</span> Space Details
                  </h2>
                  <div className="space-y-6">
                    {[
                      ["Type",          space.type],
                      ["Accessibility", "24/7 Access"],
                      ["Security",      space.security && space.security.length > 0 ? space.security.join(", ") : "CCTV Monitored"],
                      ["Facilities",    space.amenities && space.amenities.length > 0 ? space.amenities.filter(a => a !== "EV charging").join(", ") || "None specified" : "Well-lit, CCTV, Gated"],
                      ["EV Charging",   space.amenities && space.amenities.includes("EV charging") ? "Available" : "Not Available"],
                    ].map(([l, v]) => (
                      <div key={l} className="flex items-center justify-between py-4 border-t border-white/8 first:border-0 first:pt-0">
                        <span className="text-slate-400 font-medium text-base">{l}</span>
                        <span className="font-bold text-white text-lg">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Owner Details */}
                <div className="glass rounded-3xl p-8">
                  <h2 className="font-black text-white mb-6 flex items-center gap-3 text-base uppercase tracking-wider">
                    <span className="text-2xl">👤</span> Space Owner
                  </h2>
                  <div className="flex items-center gap-5 mb-7 pb-7 border-b border-white/8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-2xl font-black shadow-glow-sm shrink-0">
                      {owner.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{owner.name}</p>
                      <p className="text-base text-amber-400 font-semibold flex items-center gap-1">
                        <span>★</span> {owner.rating} / 5.0
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {[["Phone", owner.phone], ["Email", owner.email]].map(([l, v]) => (
                      <div key={l} className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium text-base">{l}</span>
                        <span className="font-semibold text-white text-base">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Map */}
                <div className="glass rounded-3xl p-8">
                  <h2 className="font-black text-white mb-6 flex items-center gap-3 text-base uppercase tracking-wider">
                    <span className="text-2xl">📍</span> Location
                  </h2>
                  <div className="w-full h-64 rounded-2xl overflow-hidden border border-white/10 relative bg-dark-800">
                    {/* Fallback overlay in case map takes a second to load */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    
                    <iframe
                      title="Space Location Map"
                      width="100%"
                      height="100%"
                      style={{ border: 0, position: "relative", zIndex: 10 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(space.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                  </div>
                  <p className="mt-4 text-sm text-slate-400 flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">ℹ️</span> 
                    The exact parking spot location will be confirmed once booked. This map shows the general address area.
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-8">
                {/* Rent Details */}
                <div className="glass rounded-3xl p-8 sticky top-8">
                  <h2 className="font-black text-white mb-6 flex items-center gap-3 text-base uppercase tracking-wider">
                    <span className="text-2xl">💳</span> Rent Details
                  </h2>
                  <div className="space-y-6 mb-8">
                    {[
                      ["Rate",     `₹${space.price} / hr`],
                      ["Minimum",  "1 Hour"],
                      ["Fees",     "Included"],
                      ["Payment",  "Pay on Arrival"],
                    ].map(([l, v]) => (
                      <div key={l} className="flex items-center justify-between py-4 border-t border-white/8 first:border-0 first:pt-0">
                        <span className="text-slate-400 font-medium text-base">{l}</span>
                        <span className={`font-bold text-lg ${l === "Rate" ? "text-brand-400 text-2xl" : "text-white"}`}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Book Now */}
                  <button onClick={() => history.push(`/booking/${space.id}`)}
                    className="btn-primary w-full text-base py-5"
                  >
                    📅 Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SpaceDetails;
