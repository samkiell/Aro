"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Share2, Flame, Loader2 } from "lucide-react";
import { HOSTELS, DEPTS } from "@/lib/constants";

const RoastDisplay = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="bg-white/5 border-l-2 border-accent-orange p-6 my-6 font-mono text-sm sm:text-base leading-relaxed text-white/80 rounded-r-2xl">
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 h-5 bg-accent-orange ml-1 align-middle"
      />
    </div>
  );
};

export default function BurnOAU() {
  const [dept, setDept] = useState("");
  const [hostel, setHostel] = useState("");
  const [loading, setLoading] = useState(false);
  const [roast, setRoast] = useState("");

  const generateBurn = async () => {
    if (!dept || !hostel) {
      toast.error("Enter your details if you dare!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Cooking something savage...");
    setRoast("");

    try {
      const res = await fetch("/api/burn", {
        method: "POST",
        body: JSON.stringify({ dept, hostel }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.roast) {
        setRoast(data.roast);
        toast.success("Burn served!", { id: toastId });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("The fire went out. Try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`🔥 Aro Roasted Me! 🔥\n\n"${roast}"\n\nGet your roast at: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-orange/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative z-10 w-full max-w-2xl sleek-card"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-6xl sm:text-8xl font-black mb-2 tracking-tighter glow-text"
          >
            Aro
          </motion.h1>
          <div className="h-1 w-20 bg-accent-orange mx-auto rounded-full mb-4" />
          <p className="text-white/40 font-medium tracking-[0.2em] uppercase text-xs">
            Premium Roast Generator
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Department</label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="sleek-input"
              >
                <option value="" className="bg-[#121214]">Select Dept</option>
                {DEPTS.sort().map((d) => (
                  <option key={d} value={d} className="bg-[#121214]">{d}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Residential Hostel</label>
              <select
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="sleek-input"
              >
                <option value="" className="bg-[#121214]">Select Hostel</option>
                {HOSTELS.map((h) => (
                  <option key={h} value={h} className="bg-[#121214]">{h}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generateBurn}
            disabled={loading}
            className="w-full sleek-btn flex items-center justify-center gap-3 text-lg cursor-pointer group"
          >
            {loading ? (
              <Loader2 className="animate-spin text-background" />
            ) : (
              <Flame className="group-hover:animate-bounce text-background" />
            )}
            <span className="text-background font-bold">{loading ? "Cooking..." : "Generate Burn"}</span>
          </button>

          <AnimatePresence mode="wait">
            {roast && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-[1px] flex-1 bg-white/10" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">The Verdict</h3>
                  <div className="h-[1px] flex-1 bg-white/10" />
                </div>
                
                <RoastDisplay text={roast} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={shareToWhatsApp}
                    className="flex items-center justify-center gap-2 rounded-2xl py-4 bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-semibold tracking-wide"
                  >
                    <Share2 size={16} />
                    Share on WhatsApp
                  </button>
                  <button
                    onClick={() => {
                        navigator.clipboard.writeText(roast);
                        toast.success("Copied to clipboard!");
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl py-4 bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-semibold tracking-wide"
                  >
                    Copy Roast
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-center">
            <p className="text-[10px] uppercase font-bold text-white/10 tracking-[0.4em]">
                Great Ife • Maximum Shi-Shi
            </p>
        </div>
      </motion.div>
    </main>
  );
}
