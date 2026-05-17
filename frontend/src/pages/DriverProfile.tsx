import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { uploadImage, updateProfile } from "../services/api";

const DriverProfile: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      history.push("/login");
      return;
    }
    setUser(JSON.parse(userStr));
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

  if (!user) return null;

  return (
    <IonPage>
      <IonContent scrollY={true}>
        <div className="min-h-screen bg-dark-900">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-dark-800/90 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => history.push("/dashboard")}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <img src="/logo.png" alt="Wheelstay" className="w-9 h-9 rounded-lg object-cover" />
                <h1 className="font-display text-xl font-black gradient-text">My Profile</h1>
              </div>
              <button onClick={handleLogout} className="text-red-400 font-bold text-sm px-4 py-2 glass rounded-lg hover:bg-red-500/10 transition-colors">
                Logout
              </button>
            </div>
          </header>

          <main className="max-w-3xl mx-auto px-6 py-10 space-y-10">
            {/* Profile Info */}
            <div className="glass rounded-[2rem] p-8 animate-in relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2rem] bg-dark-800 border-4 border-dark-900 shadow-glow-sm overflow-hidden relative">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-black text-brand-400 uppercase">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    
                    {/* Upload overlay */}
                    <label className={`absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer transition-opacity ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                      {uploading ? (
                        <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-widest mb-2">
                    Car Owner
                  </div>
                  <h2 className="text-3xl font-black text-white">{user.name}</h2>
                  <p className="text-slate-400 font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-black text-white">Account Details</h3>
              </div>
              
              <div className="glass rounded-[2rem] divide-y divide-white/5 overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest w-32">Name</span>
                  <span className="text-base font-semibold text-slate-200">{user.name}</span>
                </div>
                <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest w-32">Email</span>
                  <span className="text-base font-semibold text-slate-200">{user.email}</span>
                </div>
                <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest w-32">Phone</span>
                  <span className="text-base font-semibold text-slate-200">{user.phone || "Not provided"}</span>
                </div>
                <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest w-32">Address</span>
                  <span className="text-base font-semibold text-slate-200">{user.address || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6">
              <button onClick={() => history.push("/my-bookings")} className="btn-primary w-full py-4 text-lg">
                View My Bookings →
              </button>
            </div>
            
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DriverProfile;
