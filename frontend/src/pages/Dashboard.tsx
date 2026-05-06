import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import { getSpaces, ParkingSpace } from "../services/api";

const TYPE_COLORS: Record<string, string> = {
  Covered:      "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  Open:         "bg-sky-500/20    text-sky-400    border border-sky-500/30",
  Garage:       "bg-violet-500/20 text-violet-400 border border-violet-500/30",
  "Multi-level":"bg-amber-500/20  text-amber-400  border border-amber-500/30",
};

const Dashboard: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [showFilters, setShowFilters] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Filter States
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedParkingType, setSelectedParkingType] = useState("Any type");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSecurity, setSelectedSecurity] = useState<string[]>([]);

  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSpaces = async (q: string) => {
    setLoading(true); setError("");
    try { setSpaces(await getSpaces(q)); }
    catch { setError("Could not load parking spaces. Is the backend running?"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSpaces(params.get("search") ?? ""); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchSpaces(search); };

  return (
    <IonPage>
      <IonContent scrollY={true}>
        <div className="min-h-screen bg-dark-900">
          {/* Top Bar */}
          <header className="sticky top-0 z-20 bg-dark-800/90 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-black gradient-text">Wheelstay</h1>
                <p className="text-xs text-slate-500 mt-0.5">Find your perfect parking spot</p>
              </div>
              <button
                onClick={() => setShowMenu(true)}
                className="w-12 h-12 glass rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:border-brand-500/50 transition-colors shadow-glow-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-6 py-10">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-4 mb-10 animate-in items-center">
              <div className="relative flex-1">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" strokeWidth={2} />
                  <path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by area or spot name…"
                  className="input-dark w-full"
                  style={{ paddingLeft: "3rem" }}
                />
              </div>
              <button type="button" onClick={() => setShowFilters(true)} className="glass border border-white/10 hover:border-white/30 text-white px-5 py-3 rounded-xl transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                <span className="hidden sm:inline font-semibold">Filters</span>
              </button>
              <button type="submit" className="btn-primary px-8 py-3 flex-shrink-0">
                🔍 Search
              </button>
            </form>

            {/* Divider spacing before results */}
            <div className="mb-6" />

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-12 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 text-base font-medium">Finding parking spaces…</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="glass border border-red-500/30 bg-red-500/10 text-red-400 text-base px-6 py-4 rounded-2xl mb-8 animate-in">
                ⚠️ {error}
              </div>
            )}

            {/* Cards */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in">
                {spaces.length === 0 ? (
                  <div className="col-span-full text-center py-24 glass rounded-3xl">
                    <span className="text-5xl block mb-4">🔍</span>
                    <p className="text-slate-300 font-bold text-lg">No parking spaces found.</p>
                    <p className="text-slate-500 text-base mt-2">Try a different search term.</p>
                  </div>
                ) : (
                  spaces.map((space) => (
                    <div key={space.id}
                      className="glass rounded-3xl overflow-hidden card-lift group cursor-pointer hover:shadow-glow-sm transition-all"
                      onClick={() => history.push(`/spacedetails/${space.id}`)}
                    >
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <img src={space.image} alt={space.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent" />
                        <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-lg badge ${TYPE_COLORS[space.type] ?? "bg-slate-500/20 text-slate-400"}`}>
                          {space.type}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-white text-lg leading-tight">{space.name}</h3>
                          {space.owner && (
                            <span className="bg-brand-500/10 text-brand-400 text-xs font-bold px-2.5 py-1 rounded-md border border-brand-500/20 flex items-center gap-1.5 whitespace-nowrap ml-2">
                              👤 {space.owner.name.split(' ')[0]}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 flex items-center gap-2 mb-5">
                          <svg className="w-4 h-4 text-brand-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {space.address}
                        </p>
                        <div className="flex items-center justify-between pt-5 border-t border-white/8">
                          <div>
                            <span className="text-2xl font-black text-white">₹{space.price}</span>
                            <span className="text-sm text-slate-500 ml-1 font-medium">/hr</span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); history.push(`/spacedetails/${space.id}`); }}
                            className="btn-primary px-6 py-3 rounded-xl text-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </main>

          {/* Filter Modal */}
          {showFilters && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-in">
              <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
              <div className="relative w-full max-w-3xl max-h-[90vh] bg-dark-800 sm:rounded-3xl rounded-t-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-dark-900/50 backdrop-blur-xl shrink-0">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Filters</h2>
                    <p className="text-xs text-slate-400 mt-1">Find parking that fits your vehicle, budget, and preferences</p>
                  </div>
                  <button onClick={() => setShowFilters(false)} className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    ✕
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
                  
                  {/* Price Range */}
                  <div className="pb-8 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white mb-4">Price range</h3>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-slate-500 mb-2 block">Minimum</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                          <input type="number" placeholder="1,000" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="input-dark w-full text-base font-semibold py-4 focus:border-brand-400 transition-colors" style={{ paddingLeft: "2.5rem" }} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-slate-500 mb-2 block">Maximum</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                          <input type="text" placeholder="10,000+" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="input-dark w-full text-base font-semibold py-4 focus:border-brand-400 transition-colors" style={{ paddingLeft: "2.5rem" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommended for you */}
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Recommended for you</h3>
                    <p className="text-xs text-slate-500 mb-5">Most popular features</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { name: "Ready now", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
                        { name: "24/7 entry", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                        { name: "Covered bay", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
                        { name: "CCTV", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
                        { name: "EV charging", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
                      ].map(feature => {
                        const isSelected = selectedFeatures.includes(feature.name);
                        return (
                          <button key={feature.name} 
                            onClick={() => setSelectedFeatures(prev => isSelected ? prev.filter(t => t !== feature.name) : [...prev, feature.name])}
                            className={`flex flex-col items-center justify-center p-6 rounded-[1.25rem] border transition-all group ${isSelected ? "border-brand-500 bg-brand-500/10" : "border-white/10 glass hover:border-brand-500 hover:bg-brand-500/5"}`}>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${isSelected ? "bg-brand-500/20 text-brand-400" : "bg-white/5 text-slate-400 group-hover:text-brand-400 group-hover:bg-brand-500/10"}`}>
                              {feature.icon}
                            </div>
                            <span className={`text-sm font-semibold ${isSelected ? "text-brand-400" : "text-slate-300 group-hover:text-white"}`}>{feature.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vehicle Type */}
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Vehicle type</h3>
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
                          <button key={v.name} 
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
                    <h3 className="text-sm font-bold text-white mb-4">Parking type</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {["Any type", "Independent house", "Gated apartment", "Commercial parking"].map(tag => (
                        <button key={tag} 
                          onClick={() => setSelectedParkingType(tag)}
                          className={`flex items-center justify-center p-4 h-24 rounded-2xl border text-sm transition-all font-semibold text-center ${selectedParkingType === tag ? "border-brand-500 bg-brand-500/10 text-brand-400" : "border-white/10 glass text-slate-300 hover:border-brand-500 hover:bg-brand-500/5"}`}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amenities & features */}
                  <div className="pt-8 border-t border-white/5">
                    <h3 className="text-sm font-bold text-white mb-4">Amenities & features</h3>
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
                          <button key={item.title} 
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
                  <div className="pt-8 border-t border-white/5">
                    <h3 className="text-sm font-bold text-white mb-4">Security</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {["CCTV", "Security Guard"].map(tag => {
                        const isSelected = selectedSecurity.includes(tag);
                        return (
                          <button key={tag} 
                            onClick={() => setSelectedSecurity(prev => isSelected ? prev.filter(t => t !== tag) : [...prev, tag])}
                            className={`flex items-center justify-center p-4 h-24 rounded-2xl border text-sm transition-all font-semibold text-center ${isSelected ? "border-brand-500 bg-brand-500/10 text-brand-400" : "border-white/10 glass text-slate-300 hover:border-brand-500 hover:bg-brand-500/5"}`}>
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-white/5 bg-dark-900/50 backdrop-blur-xl shrink-0">
                  <button 
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                      setSelectedFeatures([]);
                      setSelectedVehicles([]);
                      setSelectedParkingType("Any type");
                      setSelectedAmenities([]);
                      setSelectedSecurity([]);
                    }}
                    className="text-slate-400 hover:text-white text-sm font-bold underline underline-offset-4 w-full sm:w-auto text-left sm:text-center transition-colors">
                    Clear all
                  </button>
                  <button onClick={() => setShowFilters(false)} className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base">
                    Show results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hamburger Menu Overlay */}
          <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${showMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm" onClick={() => setShowMenu(false)}></div>
            <div className={`absolute right-0 top-0 bottom-0 w-80 bg-dark-800 border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${showMenu ? "translate-x-0" : "translate-x-full"}`}>
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-white">Menu</h2>
                <button onClick={() => setShowMenu(false)} className="w-8 h-8 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <button onClick={() => history.push("/booking")} className="w-full flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/5 transition-colors text-left border border-white/5 group">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <div className="text-base font-bold text-white mb-0.5">Current booking</div>
                    <div className="text-xs text-slate-400">View your active parking</div>
                  </div>
                </button>
                <button onClick={() => history.push("/myprofile")} className="w-full flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/5 transition-colors text-left border border-white/5 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <span className="text-xl">🕒</span>
                  </div>
                  <div>
                    <div className="text-base font-bold text-white mb-0.5">History of bookings</div>
                    <div className="text-xs text-slate-400">Past parking records</div>
                  </div>
                </button>
                <button onClick={() => history.push("/myprofile")} className="w-full flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/5 transition-colors text-left border border-white/5 group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <div className="text-base font-bold text-white mb-0.5">My profile</div>
                    <div className="text-xs text-slate-400">Account settings</div>
                  </div>
                </button>
              </div>
              <div className="p-6 border-t border-white/5">
                <button onClick={() => history.push("/login")} className="w-full btn-outline py-4 text-base text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
