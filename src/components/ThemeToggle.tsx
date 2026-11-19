import { Moon, Sun } from "@/components/FontAwesomeIcons";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="grid h-11 w-11 place-items-center rounded-full border border-current/15 text-current transition-colors hover:bg-primary/20"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <AnimatePresence mode="wait" initial={false}><motion.span key={dark ? "sun" : "moon"} initial={{ opacity: 0, rotate: -45, scale: .7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 45, scale: .7 }} transition={{ duration: .25 }}><>{dark ? <Sun className="h-[1.05rem] w-[1.05rem]" /> : <Moon className="h-[1.05rem] w-[1.05rem]" />}</></motion.span></AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
