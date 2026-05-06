import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { getSpaceById, ParkingSpace, SpaceOwner } from "../services/api";

const PaymentSuccess: React.FC = () => {
  const { id, hours, amount } = useParams<{ id: string; hours: string; amount: string }>();
  const history = useHistory();
  const [data, setData] = useState<{ space: ParkingSpace; owner: SpaceOwner } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpaceById(parseInt(id, 10))
      .then(setData)
      .catch(() => console.error("Failed to load space details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <IonPage><IonContent>
        <div className="min-h-screen bg-dark-900 flex items-center justify-center flex-col gap-3">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-dark-500 text-sm">Generating receipt…</p>
        </div>
      </IonContent></IonPage>
    );
  }

  const { space, owner } = data || { space: null, owner: null };
  const bookingId = `WS-${Date.now()}`;
  const bookingDate = new Date().toLocaleDateString();
  const bookingTime = new Date().toLocaleTimeString();

  return (
    <IonPage>
      <IonContent>
        <div className="min-h-screen bg-dark-900">
          <div className="max-w-2xl mx-auto px-6 py-8 animate-in">
            {/* Success Message */}
            <div className="glass rounded-3xl p-12 text-center mb-10 border-2 border-emerald-500/30 bg-emerald-500/10">
              <div className="w-24 h-24 bg-emerald-500/20 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-display text-4xl font-black text-emerald-400 mb-3">Payment Successful! 🎉</h1>
              <p className="text-slate-400 text-lg">Your parking space has been booked.</p>
            </div>

            {/* Receipt */}
            <div className="glass rounded-3xl p-10 space-y-8">
              {/* Header */}
              <div className="text-center border-b border-white/10 pb-8">
                <h2 className="font-display text-2xl font-black text-white mb-2">YOUR RECEIPT</h2>
                <p className="text-slate-400">Booking Confirmation</p>
              </div>

              {/* Booking Details */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Booking ID</span>
                  <span className="font-bold text-white font-mono">{bookingId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Date</span>
                  <span className="font-bold text-white">{bookingDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Time</span>
                  <span className="font-bold text-white">{bookingTime}</span>
                </div>
              </div>

              {/* Parking Space Details */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="font-black text-white mb-5 flex items-center gap-2">
                  <span>🅿️</span> Parking Space Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Space Name</span>
                    <span className="font-bold text-white">{space?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Type</span>
                    <span className="font-bold text-white">{space?.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Address</span>
                    <span className="font-bold text-white text-right">{space?.address}</span>
                  </div>
                </div>
              </div>

              {/* Owner Details */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="font-black text-white mb-5 flex items-center gap-2">
                  <span>👤</span> Space Owner Details
                </h3>
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-white/10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-3xl font-black shadow-glow-sm flex-shrink-0">
                    {owner?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-xl">{owner?.name}</p>
                    <p className="text-base text-amber-400 font-semibold flex items-center gap-1">
                      <span>★</span> {owner?.rating} / 5.0
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Phone</span>
                    <span className="font-bold text-white">{owner?.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Email</span>
                    <span className="font-bold text-white text-right">{owner?.email}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="font-black text-white mb-5 flex items-center gap-2">
                  <span>💰</span> Payment Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Rate</span>
                    <span className="font-bold text-white">₹{space?.price}/hr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Duration</span>
                    <span className="font-bold text-white">{hours} hour{hours !== '1' ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Subtotal</span>
                    <span className="font-bold text-white">₹{amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Platform Fee</span>
                    <span className="font-bold text-white">₹0</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-white font-bold text-lg">Total Paid</span>
                    <span className="font-black text-brand-400 text-2xl">₹{amount}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="border-t border-white/10 pt-8 bg-blue-500/5 rounded-2xl p-5">
                <p className="text-sm text-slate-400 mb-3 font-medium">📝 Important Notes:</p>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>• Share your booking ID with the space owner for verification</li>
                  <li>• Please arrive at the parking space 10 minutes before your allocated time</li>
                  <li>• Keep this receipt for your records and dispute resolution</li>
                  <li>• For any issues, contact our support team</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-10">
              <button
                onClick={() => history.push("/dashboard")}
                className="flex-1 btn-primary py-4 text-base"
              >
                🏠 Back to Dashboard
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 btn-outline py-4 text-base"
              >
                🖨️ Print Receipt
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PaymentSuccess;
