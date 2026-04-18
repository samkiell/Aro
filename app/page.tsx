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
    <div className="bg-ife-blue/10 border-l-4 border-warning-orange p-4 my-6 font-mono text-sm sm:text-base leading-relaxed">
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 h-5 bg-warning-orange ml-1 align-middle"
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
    const text = encodeURIComponent(`🔥 BurnOAU Roasted Me! 🔥\n\n"${roast}"\n\nGet your roast at: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]">
      <div className="absolute inset-0 bg-ife-blue opacity-20 pointer-events-none" />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative z-10 w-full max-w-2xl brutal-card bg-background"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-7xl font-black text-warning-orange uppercase tracking-tighter mb-2 italic">
            BurnOAU
          </h1>
          <p className="bg-ife-blue text-white px-2 py-1 inline-block font-bold text-sm uppercase">
            Maximum Shi-Shi Generator
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-warning-orange">Department</label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="brutal-input bg-background"
              >
                <option value="">Select Dept</option>
                {DEPTS.sort().map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-warning-orange">Residential Hostel</label>
              <select
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="brutal-input bg-background"
              >
                <option value="">Select Hostel</option>
                {HOSTELS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generateBurn}
            disabled={loading}
            className="w-full brutal-btn flex items-center justify-center gap-2 text-xl"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Flame className="fill-current" />
            )}
            {loading ? "Roasting..." : "Generate Burn"}
          </button>

          <AnimatePresence mode="wait">
            {roast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black uppercase text-warning-orange">The Verdict:</h3>
                </div>
                
                <RoastDisplay text={roast} />

                <button
                  onClick={shareToWhatsApp}
                  className="w-full mt-4 flex items-center justify-center gap-2 font-bold uppercase p-3 border-2 border-white hover:bg-white hover:text-black transition-all"
                >
                  <Share2 size={18} />
                  Share to WhatsApp
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-center text-[10px] uppercase font-bold opacity-50 tracking-widest">
          Created for Great Ife Students • No TP allowed
        </div>
      </motion.div>
    </main>
  );
}
