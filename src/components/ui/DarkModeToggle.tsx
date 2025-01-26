"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[110px] h-[40px]" />;
  }

  return (
    <div className="flex items-center justify-center border-border">
      <label className="inline-flex items-center relative cursor-pointer">
        <input
          className="peer hidden"
          type="checkbox"
          checked={theme === "dark"}
          onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
        <div
          className="relative w-[110px] h-[40px] bg-background peer-checked:bg-zinc-800 rounded-full 
          after:absolute after:content-[''] after:w-[35px] after:h-[35px] 
          after:bg-gradient-to-r after:from-orange-500 after:to-yellow-400 
          peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 
          after:rounded-full after:top-[2px] after:left-[5px] 
          after:transition-all after:duration-300
          peer-checked:after:translate-x-[60px]
          shadow-sm after:shadow-md"
        ></div>
        {/* Sun Icon */}
        <svg
          viewBox="0 0 24 24"
          className="fill-black/60 dark:fill-white/60 absolute w-5 h-5 left-[13px] transition-opacity duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z" />
        </svg>
        {/* Moon Icon */}
        <svg
          viewBox="0 0 24 24"
          className="fill-black/60 dark:fill-white/60 absolute w-5 h-5 right-[15px] transition-opacity duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2Z" />
        </svg>
      </label>
    </div>
  );
}
