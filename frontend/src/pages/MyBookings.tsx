import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { getDriverBookings } from "../services/api";
import jsPDF from "jspdf";

const MyBookings: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      history.push("/login");
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    
    getDriverBookings(userData.email)
      .then(data => setBookings(data.bookings || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [history]);

  const downloadPDF = (idx: number, reference: string) => {
    try {
      const booking = bookings[idx];
      if (!booking) return;
      
      const subtotal = (booking.spaces?.price || 0) * parseInt(booking.duration) || 0;
      const fee = Math.round(subtotal * 0.1);
      const total = subtotal + fee;
      const dateStr = new Date(booking.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const timeStr = new Date(booking.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const buyerName = user?.name || "Valued Customer";
      const buyerPhone = user?.phone || "N/A";
      const buyerAddress = user?.address || "Chennai, Tamil Nadu";

      const oldDurationNum = parseInt(booking.duration) || 1;
      const durationUnit = booking.spaces?.price_type === 'monthly' ? (oldDurationNum === 1 ? 'month' : 'months') : booking.spaces?.price_type === 'daily' ? (oldDurationNum === 1 ? 'day' : 'days') : (oldDurationNum === 1 ? 'hour' : 'hours');
      const fullDurationStr = booking.duration.includes('hour') || booking.duration.includes('day') || booking.duration.includes('month') ? booking.duration : `${booking.duration} ${durationUnit}`;
      const rateStr = `Rs. ${booking.spaces?.price || 0} / ${booking.spaces?.price_type === 'daily' ? 'day' : booking.spaces?.price_type === 'monthly' ? 'month' : 'hr'}`;

      const generatePdfDoc = (imgElem: HTMLImageElement | null) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        if (imgElem) {
          pdf.addImage(imgElem, 'PNG', 20, 15, 25, 25);
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(22);
        pdf.setTextColor(40, 40, 40);
        pdf.text("PARKING RECEIPT", 190, 25, { align: "right" });
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 100, 100);
        pdf.text("Wheelstay Booking Confirmation", 190, 32, { align: "right" });
        
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, 45, 190, 45);
        
        // Company & Buyer Info
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(40, 40, 40);
        pdf.text("Wheelstay Technologies", 20, 53);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("No 10 Indhira Gandhi St, Chitlapakam,", 20, 59);
        pdf.text("Chennai 600064", 20, 65);
        pdf.text("Phone: 9841161629", 20, 71);

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Billed To (Buyer):", 110, 53);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Name: ${buyerName}`, 110, 59);
        pdf.text(`Phone: ${buyerPhone}`, 110, 65);
        const splitBuyerAddr = pdf.splitTextToSize(`Address: ${buyerAddress}`, 80);
        pdf.text(splitBuyerAddr, 110, 71);

        let curY = 71 + (splitBuyerAddr.length * 6) + 6;
        pdf.line(20, curY, 190, curY);
        curY += 8;

        // Booking Info
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Booking Details", 20, curY);
        curY += 8;
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Booking Ref:`, 20, curY); pdf.text(booking.reference, 60, curY); curY += 6;
        pdf.text(`Date:`, 20, curY); pdf.text(dateStr, 60, curY); curY += 6;
        pdf.text(`Time:`, 20, curY); pdf.text(timeStr, 60, curY); curY += 8;

        pdf.line(20, curY, 190, curY);
        curY += 8;

        // Space Info
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Space Details", 20, curY);
        curY += 8;
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Name:`, 20, curY); pdf.text(booking.spaces?.name || "N/A", 60, curY); curY += 6;
        pdf.text(`Type:`, 20, curY); pdf.text(booking.spaces?.type || "N/A", 60, curY); curY += 6;
        pdf.text(`Address:`, 20, curY);
        const splitAddress = pdf.splitTextToSize(booking.spaces?.address || "N/A", 120);
        pdf.text(splitAddress, 60, curY);
        curY += (splitAddress.length * 6) + 8;

        pdf.line(20, curY, 190, curY);
        curY += 8;

        // Payment Summary
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Payment Summary", 20, curY);
        curY += 8;
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Rate:`, 20, curY); pdf.text(rateStr, 150, curY); curY += 6;
        pdf.text(`Duration:`, 20, curY); pdf.text(fullDurationStr, 150, curY); curY += 6;
        pdf.text(`Subtotal:`, 20, curY); pdf.text(`Rs. ${subtotal}`, 150, curY); curY += 6;
        pdf.text(`Platform Fee (10%):`, 20, curY); pdf.text(`Rs. ${fee}`, 150, curY); curY += 10;

        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Total Paid:`, 20, curY); pdf.text(`Rs. ${total}`, 150, curY); curY += 25;

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(150, 150, 150);
        pdf.text("Thank you for using Wheelstay!", 105, curY, { align: "center" });

        pdf.save(`Receipt-${booking.reference}.pdf`);
      };

      const img = new Image();
      img.src = '/logo.png';
      img.onload = () => generatePdfDoc(img);
      img.onerror = () => generatePdfDoc(null);
    } catch (err: any) {
      console.error("PDF generation failed", err);
      alert(`Failed to generate PDF. Error: ${err?.message || err}`);
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={true}>
        <div className="min-h-screen bg-dark-900">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-dark-800/90 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
              <button onClick={() => history.push("/dashboard")}
                className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <img src="/logo.png" alt="Wheelstay" className="w-9 h-9 rounded-lg object-cover" />
              <div>
                <h1 className="font-display text-xl font-black gradient-text">My Bookings</h1>
                <p className="text-[10px] text-slate-500 mt-0.5">Your parking history and receipts</p>
              </div>
            </div>
          </header>

          <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
            {loading ? (
              <div className="flex justify-center py-20">
                <span className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : bookings.length === 0 ? (
              <div className="glass rounded-[2rem] p-12 text-center">
                <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
                <p className="text-slate-400 mb-8">You haven't booked any parking spaces.</p>
                <button onClick={() => history.push("/dashboard")} className="btn-primary px-8 py-3">
                  Find Parking
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {bookings.map((booking, idx) => (
                  <div key={idx} className="glass rounded-[2rem] overflow-hidden animate-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    
                    {/* Space Info Header */}
                    <div className="p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-start border-b border-white/5">
                      <div className="w-full sm:w-32 h-32 rounded-2xl bg-dark-800 overflow-hidden shrink-0 relative">
                        {booking.spaces?.image ? (
                          <img src={booking.spaces.image} alt={booking.spaces.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-brand-500/10 text-brand-400">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 w-full">
                        <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
                          Confirmed
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-white mb-2">{booking.spaces?.name || "Unknown Space"}</h2>
                        <div className="flex items-start gap-2 text-slate-400 text-sm">
                          <svg className="w-5 h-5 shrink-0 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <p>{booking.spaces?.address || "Address not available"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Digital Receipt Section */}
                    <div id={`receipt-${idx}`} className="p-6 md:p-8 bg-dark-800/50">
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Digital Receipt</h3>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Booking Ref</p>
                          <p className="text-sm font-bold text-slate-200 font-mono">{booking.reference}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Date</p>
                          <p className="text-sm font-bold text-slate-200">
                            {new Date(booking.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Duration</p>
                          <p className="text-sm font-bold text-slate-200">
                            {booking.duration.includes('hour') || booking.duration.includes('day') || booking.duration.includes('month') ? booking.duration : `${booking.duration} ${booking.spaces?.price_type === 'monthly' ? (parseInt(booking.duration) === 1 ? 'month' : 'months') : booking.spaces?.price_type === 'daily' ? (parseInt(booking.duration) === 1 ? 'day' : 'days') : (parseInt(booking.duration) === 1 ? 'hour' : 'hours')}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Rate</p>
                          <p className="text-sm font-bold text-slate-200">₹{booking.spaces?.price || 0} / {booking.spaces?.price_type === 'daily' ? 'day' : booking.spaces?.price_type === 'monthly' ? 'month' : 'hr'}</p>
                        </div>
                      </div>

                      {(() => {
                        const subtotal = (booking.spaces?.price || 0) * parseInt(booking.duration) || 0;
                        const fee = Math.round(subtotal * 0.1);
                        const total = subtotal + fee;
                        
                        return (
                          <>
                            <div className="space-y-3 mb-6 pb-6 border-b border-white/5">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="text-slate-200 font-bold">₹{subtotal}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Platform Fee (10%)</span>
                                <span className="text-slate-200 font-bold">₹{fee}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-400">Total Amount Paid</p>
                                <p className="text-2xl font-black text-brand-400">
                                  ₹{total}
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    
                    {/* Actions */}
                    <div className="px-6 pb-6 md:px-8 md:pb-8 bg-dark-800/50">
                      <button onClick={() => downloadPDF(idx, booking.reference)} className="btn-outline w-full py-3 text-sm flex items-center justify-center gap-2">
                        📄 Download PDF Receipt
                      </button>
                    </div>
                    
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyBookings;
