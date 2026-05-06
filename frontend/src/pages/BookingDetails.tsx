import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";

interface Booking {
  spaceId: number;
  carOwnerId: number;
  carOwnerName: string;
  carOwnerPhone: string;
  carOwnerEmail: string;
  bookingId: string;
  bookingDate: string;
  duration: number;
  amount: number;
  paid: boolean;
}

interface Space {
  id: number;
  name: string;
  type: string;
  price: number;
  status: string;
  bookings: number;
}

// Mock data - in a real app, this would come from an API
const MOCK_SPACES: Record<number, Space> = {
  1: { id: 1, name: "Green Park Spot",    type: "Covered", price: 50, status: "Active", bookings: 82 },
  3: { id: 3, name: "Secure Home Garage", type: "Garage",  price: 40, status: "Active", bookings: 65 },
};

const MOCK_BOOKINGS: Booking[] = [
  { spaceId: 1, carOwnerId: 101, carOwnerName: "Arjun Singh", carOwnerPhone: "+91 98765 54321", carOwnerEmail: "arjun.singh@email.com", bookingId: "WS-001", bookingDate: "2024-03-19", duration: 3, amount: 150, paid: false },
  { spaceId: 1, carOwnerId: 102, carOwnerName: "Priya Sharma", carOwnerPhone: "+91 87654 32109", carOwnerEmail: "priya.sharma@email.com", bookingId: "WS-002", bookingDate: "2024-03-18", duration: 2, amount: 100, paid: true },
  { spaceId: 3, carOwnerId: 103, carOwnerName: "Rajesh Kumar", carOwnerPhone: "+91 76543 21098", carOwnerEmail: "rajesh.kumar@email.com", bookingId: "WS-003", bookingDate: "2024-03-17", duration: 4, amount: 160, paid: true },
];

const BookingDetails: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const history = useHistory();
  const [space, setSpace] = useState<Space | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const id = parseInt(spaceId, 10);
      setSpace(MOCK_SPACES[id] || null);
      setBookings(MOCK_BOOKINGS.filter(b => b.spaceId === id));
      setLoading(false);
    }, 500);
  }, [spaceId]);

  const handlePaymentStatusChange = (bookingId: string, paid: boolean) => {
    setBookings(bookings.map(b => b.bookingId === bookingId ? { ...b, paid } : b));
  };

  if (loading) {
    return (
      <IonPage><IonContent>
        <div className="min-h-screen bg-dark-900 flex items-center justify-center flex-col gap-3">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-dark-500 text-sm">Loading bookings…</p>
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

  return (
    <IonPage>
      <IonContent>
        <div className="min-h-screen bg-dark-900">
          <div className="max-w-6xl mx-auto px-6 py-8 animate-in">
            {/* Back */}
            <button onClick={() => history.goBack()}
              className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white mb-8 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to My Profile
            </button>

            {/* Space Info */}
            <div className="glass rounded-3xl p-8 mb-10">
              <h1 className="font-display text-4xl font-black text-white mb-2">{space.name}</h1>
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Type:</span>
                  <span className="font-bold text-white">{space.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Rate:</span>
                  <span className="font-black text-brand-400 text-lg">₹{space.price}/hr</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 font-semibold text-sm">
                    {space.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Bookings */}
            <h2 className="font-display text-2xl font-black text-white mb-6 flex items-center gap-3">
              <span>📅</span> Bookings ({bookings.length})
            </h2>

            {bookings.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <span className="text-5xl block mb-4">📭</span>
                <p className="text-slate-400 text-lg font-medium">No bookings yet for this space.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div key={booking.bookingId} className="glass rounded-3xl p-8">
                    {/* Booking Header */}
                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
                      <div>
                        <p className="text-sm text-slate-400 font-medium mb-1">Booking ID</p>
                        <p className="font-mono font-bold text-white text-lg">{booking.bookingId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 font-medium mb-1">Booking Date</p>
                        <p className="font-bold text-white text-lg">{booking.bookingDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 font-medium mb-1">Duration</p>
                        <p className="font-bold text-white text-lg">{booking.duration} hours</p>
                      </div>
                    </div>

                    {/* Car Owner Details */}
                    <div className="mb-8 pb-8 border-b border-white/10">
                      <h3 className="font-black text-white mb-6 flex items-center gap-3 text-lg">
                        <span>🚗</span> Car Owner Details
                      </h3>
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-3xl font-black shadow-glow-sm shrink-0">
                          {booking.carOwnerName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white text-xl mb-4">{booking.carOwnerName}</p>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-medium">Phone</span>
                              <span className="font-semibold text-white">{booking.carOwnerPhone}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-medium">Email</span>
                              <span className="font-semibold text-white">{booking.carOwnerEmail}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-medium">Car Owner ID</span>
                              <span className="font-semibold text-white">#{booking.carOwnerId}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="mb-8">
                      <h3 className="font-black text-white mb-6 flex items-center gap-3 text-lg">
                        <span>💳</span> Payment Status
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                          <div>
                            <p className="text-slate-400 font-medium mb-1">Amount</p>
                            <p className="font-black text-brand-400 text-2xl">₹{booking.amount}</p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handlePaymentStatusChange(booking.bookingId, false)}
                              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                                !booking.paid
                                  ? "btn-primary shadow-glow-sm"
                                  : "glass border border-white/20 text-slate-400 hover:text-white"
                              }`}
                            >
                              ❌ Not Paid
                            </button>
                            <button
                              onClick={() => handlePaymentStatusChange(booking.bookingId, true)}
                              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                                booking.paid
                                  ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                                  : "glass border border-white/20 text-slate-400 hover:text-white"
                              }`}
                            >
                              {booking.paid && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>}
                              ✅ Paid
                            </button>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`p-6 rounded-2xl border text-center ${
                          booking.paid
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-red-500/10 border-red-500/30"
                        }`}>
                          <p className={`font-black text-lg ${booking.paid ? "text-emerald-400" : "text-red-400"}`}>
                            {booking.paid ? "✅ Payment Received" : "⏳ Payment Pending"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="pt-8 border-t border-white/10">
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-slate-400 font-medium mb-2">Rate</p>
                          <p className="font-bold text-white text-lg">₹{space.price}/hr</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 font-medium mb-2">Hours</p>
                          <p className="font-bold text-white text-lg">{booking.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 font-medium mb-2">Total</p>
                          <p className="font-black text-brand-400 text-lg">₹{booking.amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingDetails;
