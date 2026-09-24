import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function LoadingScreen() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) {
          return "";
        }
        return prev + ".";
      });
    }, 400); // Change dots every 400ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-slate-200/80 bg-white/95 py-16 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-[#FF5E14]/40 blur-md opacity-70" />
          <div className="relative rounded-xl border border-white/60 bg-gradient-to-br from-[#FFF0E6] via-[#FFB380] to-[#FF5E14] p-1.5 shadow-[0_10px_40px_rgba(255,94,20,0.45)]">
            <img
              src={logo}
              alt="Grow Skills Tech"
              className="h-10 w-10 object-contain sm:h-12 sm:w-12"
            />
          </div>
        </div>
        <p className="text-sm font-medium tracking-wide text-slate-700 sm:text-base">
          Loading<span className="inline-block w-8 text-left">{dots}</span>
        </p>
      </div>
    </div>
  );
}
