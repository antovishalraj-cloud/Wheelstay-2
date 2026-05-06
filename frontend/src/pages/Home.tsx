import React from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";

const features = [
  { icon: "🔍", title: "Find Spots", desc: "Near you, instantly" },
  { icon: "⚡", title: "Book Fast",  desc: "Confirm in seconds" },
  { icon: "🔒", title: "Secure",     desc: "Verified listings" },
];

const stats = [
  { value: "2,400+", label: "Parking Spots" },
  { value: "18K+",   label: "Happy Users" },
  { value: "50+",    label: "Cities" },
];

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent scrollY={false}>
        <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
          {/* Glow blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-700 opacity-10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-12 right-1/5 w-72 h-72 bg-purple-700 opacity-10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo Section */}
          <div className="text-center mb-12 animate-in">
            <div className="w-20 h-20 bg-gradient-brand rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow text-5xl">
              🅿️
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black gradient-text mb-4 leading-tight">
              Wheelstay
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
              Find &amp; rent parking spaces near you — in seconds.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl mb-14">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="glass card-lift rounded-2xl p-6 text-center hover:shadow-glow-sm transition-all">
                <span className="text-4xl block mb-3">{icon}</span>
                <p className="text-white text-sm font-bold mb-1">{title}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-14 w-full max-w-2xl">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-brand-400 mb-2">{value}</p>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="w-full max-w-sm space-y-4">
            <button onClick={() => history.push("/login")} className="btn-primary w-full text-lg py-5">
              Get Started →
            </button>
            <button onClick={() => history.push("/register")} className="btn-outline w-full text-base">
              Create Account
            </button>
          </div>

          <p className="mt-12 text-slate-500 text-sm text-center">
            Trusted by car owners &amp; space hosts across India 🇮🇳
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
