import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";

const Payment: React.FC = () => {
  const { id, hours, amount } = useParams<{ id: string; hours: string; amount: string }>();
  const history = useHistory();
  const [method, setMethod] = useState<"card" | "debit" | "upi" | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");

  const handlePayment = async () => {
    if (!method) return;
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      history.push(`/payment-success/${id}/${hours}/${amount}`);
    }, 2000);
  };

  return (
    <IonPage>
      <IonContent>
        <div className="min-h-screen bg-dark-900">
          <div className="max-w-2xl mx-auto px-6 py-8 animate-in">
            {/* Back */}
            <button onClick={() => history.goBack()}
              className="flex items-center gap-2 text-base font-semibold text-slate-400 hover:text-white mb-8 transition-colors group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <h1 className="font-display text-4xl font-black text-white mb-2">Payment</h1>
            <p className="text-slate-400 mb-10">Choose your preferred payment method</p>

            {/* Amount Summary */}
            <div className="glass rounded-3xl p-8 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium text-lg">Total Amount</span>
                <span className="font-black text-brand-400 text-4xl">₹{amount}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4 mb-10">
              {/* Credit Card */}
              <div
                onClick={() => setMethod("card")}
                className={`glass rounded-3xl p-8 cursor-pointer transition-all ${method === "card" ? "border-2 border-brand-400 shadow-glow-sm" : "border border-white/10 hover:border-white/20"}`}
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                    💳
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1">Credit Card</h3>
                    <p className="text-sm text-slate-400">Visa, Mastercard, American Express</p>
                  </div>
                  {method === "card" && (
                    <div className="w-6 h-6 rounded-full bg-brand-400 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-dark-900 font-bold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {method === "card" && (
                  <div className="mt-6 space-y-4 pt-6 border-t border-white/10">
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="input-dark text-sm"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="input-dark text-sm"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="input-dark text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Debit Card */}
              <div
                onClick={() => setMethod("debit")}
                className={`glass rounded-3xl p-8 cursor-pointer transition-all ${method === "debit" ? "border-2 border-brand-400 shadow-glow-sm" : "border border-white/10 hover:border-white/20"}`}
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                    🏧
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1">Debit Card</h3>
                    <p className="text-sm text-slate-400">All major debit cards accepted</p>
                  </div>
                  {method === "debit" && (
                    <div className="w-6 h-6 rounded-full bg-brand-400 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-dark-900 font-bold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {method === "debit" && (
                  <div className="mt-6 space-y-4 pt-6 border-t border-white/10">
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="input-dark text-sm"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="input-dark text-sm"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="input-dark text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* UPI */}
              <div
                onClick={() => setMethod("upi")}
                className={`glass rounded-3xl p-8 cursor-pointer transition-all ${method === "upi" ? "border-2 border-brand-400 shadow-glow-sm" : "border border-white/10 hover:border-white/20"}`}
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                    📱
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1">UPI</h3>
                    <p className="text-sm text-slate-400">Google Pay, PhonePe, Paytm</p>
                  </div>
                  {method === "upi" && (
                    <div className="w-6 h-6 rounded-full bg-brand-400 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-dark-900 font-bold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {method === "upi" && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <input
                      type="text"
                      placeholder="Enter UPI ID (example@bank)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="input-dark text-sm w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={!method || processing}
              className="btn-primary w-full text-lg py-5 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Payment…
                </>
              ) : (
                `💳 Pay ₹${amount}`
              )}
            </button>

            <p className="text-xs text-slate-500 mt-6 text-center">
              Your payment is secure and encrypted. We accept all major payment methods.
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Payment;
