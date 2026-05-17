import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { addSpace, uploadImage } from "../services/api";


const AddSpace: React.FC = () => {
  const history = useHistory();
  const [form, setForm] = useState({ name: "", address: "", price: "", type: "", description: "", lat: 0, lng: 0, price_type: "hourly" });
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSecurity, setSelectedSecurity] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const [gettingLocation, setGettingLocation] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          const address = data.display_name || `${lat}, ${lng}`;
          setForm(prev => ({ ...prev, lat, lng, address }));
        } catch (err) {
          console.error("Geocoding failed", err);
          setForm(prev => ({ ...prev, lat, lng }));
          setError("Got coordinates but failed to fetch street address.");
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        setError("Failed to get your location. Please check browser permissions.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type) { setError("Please select a space type."); return; }
    
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setError("You must be logged in to list a space.");
      history.push("/login");
      return;
    }
    
    const user = JSON.parse(userStr);
    
    setLoading(true);
    try {
      let imageUrl = "";
      if (selectedImage) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedImage);
        });
        const uploadRes = await uploadImage(base64);
        imageUrl = uploadRes.url;
      }

      await addSpace({
        name: form.name,
        address: form.address,
        price: Number(form.price),
        type: form.type,
        description: form.description,
        owner_id: user.id,
        image: imageUrl || undefined,
        amenities: selectedAmenities,
        security: selectedSecurity,
        lat: form.lat || undefined,
        lng: form.lng || undefined,
        price_type: form.price_type
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to add space.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <IonPage>
        <IonContent>
          <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-6 py-12">
            <div className="glass rounded-3xl p-12 text-center max-w-sm w-full animate-in">
              <div className="w-24 h-24 bg-emerald-500/20 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Space Listed! 🎉</h2>
              <p className="text-slate-400 text-base mb-10 leading-relaxed">
                <strong className="text-white">{JSON.parse(localStorage.getItem("user") || "{}").name}</strong> is now live. Car owners can find and book it.
              </p>
              <div className="space-y-4">
                <button onClick={() => { 
                  setSuccess(false); 
                  setForm({ name:"",address:"",price:"",type:"",description:"",lat:0,lng:0,price_type:"hourly" }); 
                  setSelectedVehicles([]);
                  setSelectedAmenities([]);
                  setSelectedSecurity([]);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
                  className="btn-outline w-full text-base">
                  Add Another Space
                </button>
                <button onClick={() => history.push("/myprofile")}
                  className="btn-primary w-full py-5 text-lg">
                  View My Profile →
                </button>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent scrollY={true}>
        <div className="min-h-screen bg-dark-900">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-dark-800/90 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-5">
              <button onClick={() => history.push("/myprofile")}
                className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="font-display text-2xl font-black gradient-text">List a Space</h1>
                <p className="text-sm text-slate-500 mt-0.5">Earn money from your parking space</p>
              </div>
            </div>
          </header>

          <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
            {error && (
              <div className="glass border-2 border-red-500/30 bg-red-500/10 text-red-400 text-base px-6 py-4 rounded-2xl animate-in font-medium">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 animate-in">
              {/* Space Info */}
              <div className="glass rounded-3xl p-8 space-y-7">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Space Information</h2>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Space Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="e.g. Shaded Driveway Spot" required className="input-dark text-base" />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Full Address</label>
                  <div className="flex flex-col gap-4">
                    <input type="text" name="address" value={form.address} onChange={handleChange}
                      placeholder="e.g. 12, 1st Avenue, Adyar, Chennai" required className="input-dark text-base" />
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-white/10"></div>
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">OR</span>
                      <div className="flex-1 h-px bg-white/10"></div>
                    </div>
                    
                    <button type="button" onClick={handleGetLocation} disabled={gettingLocation}
                      className="glass border border-brand-500/30 text-brand-400 hover:bg-brand-500/10 py-5 px-8 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-colors shadow-glow-sm hover:shadow-glow"
                      style={{ minHeight: '3.75rem' }}>
                      {gettingLocation ? (
                        <span className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                      {gettingLocation ? "Locating..." : "Use Live Location"}
                    </button>
                  </div>
                </div>

                {/* Vehicle Type */}
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">Vehicle Type</label>
                  <p className="text-xs text-slate-500 mb-4">What kind of vehicles can be parked here? You can select multiple types.</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {[
                      { name: "Compact", icon: "🚙" },
                      { name: "Sedan", icon: "🚗" },
                      { name: "SUV", icon: "🚘" },
                      { name: "Minibus", icon: "🚐" },
                      { name: "Bus", icon: "🚌" },
                      { name: "Bike", icon: "🛵" },
                    ].map(v => {
                      const isSelected = selectedVehicles.includes(v.name);
                      return (
                        <button key={v.name} type="button"
                          onClick={() => setSelectedVehicles(prev => isSelected ? prev.filter(t => t !== v.name) : [...prev, v.name])}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group ${isSelected ? "border-brand-500 bg-brand-500/10" : "border-white/10 glass hover:border-brand-500 hover:bg-brand-500/5"}`}>
                          <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{v.icon}</span>
                          <span className={`text-xs font-semibold ${isSelected ? "text-brand-400" : "text-slate-300"}`}>{v.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Parking Type */}
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">Parking Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["Any type", "Independent house", "Gated apartment", "Commercial parking"].map(tag => (
                      <button key={tag} type="button"
                        onClick={() => setForm({ ...form, type: tag })}
                        className={`flex items-center justify-center p-4 h-24 rounded-2xl border text-sm transition-all font-semibold text-center ${form.type === tag ? "border-brand-500 bg-brand-500/10 text-brand-400" : "border-white/10 glass text-slate-300 hover:border-brand-500 hover:bg-brand-500/5"}`}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Description (optional)</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    placeholder="Describe security features, access instructions, etc."
                    rows={4}
                    className="input-dark resize-none text-base"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Space Photo</label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-600 rounded-2xl bg-dark-800 hover:border-brand-500 hover:bg-brand-500/5 transition-all cursor-pointer overflow-hidden relative">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedImage(file);
                        const reader = new FileReader();
                        reader.onload = () => setImagePreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                        <svg className="w-10 h-10 mb-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <p className="mb-2 text-sm font-semibold">Click to upload a photo</p>
                        <p className="text-xs">PNG, JPG, or WEBP (MAX. 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Amenities & Security */}
              <div className="glass rounded-3xl p-8 space-y-8">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Amenities & Security</h2>
                
                {/* Amenities & features */}
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">Amenities & features</label>
                  <div className="flex flex-col gap-4">
                    {[
                      { 
                        title: "Gated entry", 
                        subtitle: "Controlled gate access",
                        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                      },
                      { 
                        title: "EV charging", 
                        subtitle: "Electric vehicle charging",
                        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      },
                      { 
                        title: "Well lit", 
                        subtitle: "Bright night lighting",
                        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      }
                    ].map(item => {
                      const isSelected = selectedAmenities.includes(item.title);
                      return (
                        <button key={item.title} type="button"
                          onClick={() => setSelectedAmenities(prev => isSelected ? prev.filter(t => t !== item.title) : [...prev, item.title])}
                          className={`flex items-center gap-5 p-5 rounded-[1.25rem] border transition-all text-left ${isSelected ? "border-brand-500 bg-brand-500/10" : "border-white/10 glass hover:border-brand-500 hover:bg-brand-500/5"}`}>
                          <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? "bg-brand-500 text-white shadow-glow-sm" : "bg-white/5 text-slate-400"}`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-base font-bold ${isSelected ? "text-brand-400" : "text-slate-200"}`}>{item.title}</h4>
                            <p className="text-sm text-slate-500">{item.subtitle}</p>
                          </div>
                          <div className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-brand-500 bg-brand-500 shadow-glow-sm" : "border-slate-600"}`}>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Security */}
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">Security</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["CCTV", "Security Guard"].map(tag => {
                      const isSelected = selectedSecurity.includes(tag);
                      return (
                        <button key={tag} type="button"
                          onClick={() => setSelectedSecurity(prev => isSelected ? prev.filter(t => t !== tag) : [...prev, tag])}
                          className={`flex items-center justify-center p-4 h-24 rounded-2xl border text-sm transition-all font-semibold text-center ${isSelected ? "border-brand-500 bg-brand-500/10 text-brand-400" : "border-white/10 glass text-slate-300 hover:border-brand-500 hover:bg-brand-500/5"}`}>
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="glass rounded-3xl p-8">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-7">Pricing</h2>
                
                {/* Duration Basis */}
                <div className="mb-6">
                  <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">Parking Duration Basis</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["hourly", "daily", "monthly"].map(basis => (
                      <button key={basis} type="button"
                        onClick={() => setForm({ ...form, price_type: basis })}
                        className={`py-5 rounded-2xl border text-lg font-bold transition-all capitalize ${form.price_type === basis ? "border-brand-500 bg-brand-500/10 text-brand-400 shadow-glow-sm" : "border-white/10 glass text-slate-400 hover:border-brand-500 hover:bg-brand-500/5 hover:text-slate-200"}`}
                        style={{ minHeight: '3.75rem' }}>
                        {basis}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">
                  Rate (₹ per {form.price_type === 'hourly' ? 'hour' : form.price_type === 'daily' ? 'day' : 'month'})
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">₹</span>
                  <input type="number" name="price" value={form.price} onChange={handleChange}
                    placeholder="50" min="10" required
                    className="input-dark text-base font-semibold"
                    style={{ paddingLeft: "2.5rem", paddingRight: "4rem" }}
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 text-base font-semibold">
                    /{form.price_type === 'hourly' ? 'hr' : form.price_type === 'daily' ? 'day' : 'mo'}
                  </span>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full text-lg py-5 disabled:opacity-50"
              >
                {loading
                  ? <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  : <>List My Space 🚀</>}
              </button>
            </form>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddSpace;
