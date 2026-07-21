import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import iconAsset from "@/assets/audax-icon.png.asset.json";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setVisible(false), 600);
      }
      setProgress(Math.min(100, Math.floor(p)));
    }, 110);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Grid bg */}
          <div className="absolute inset-0 bg-grid opacity-30" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center gap-6"
          >
            <img
              src={iconAsset.url}
              alt="AUDAX"
              className="h-40 w-auto sm:h-52 drop-shadow-[0_0_40px_rgba(227,6,19,0.55)]"
            />
            <span
              aria-label="AUDAX"
              className="select-none text-4xl sm:text-6xl text-white"
              style={{
                fontFamily: '"Exo 2", "Segoe UI", system-ui, sans-serif',
                fontWeight: 900,
                letterSpacing: "0.14em",
              }}
            >
              AUDAX
            </span>
          </motion.div>

          <div className="relative mt-12 w-64">
            <div className="mb-3 flex justify-between font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              <span>Loading</span>
              <span className="text-primary tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-px w-full bg-border overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-primary shadow-glow"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase"
          >
            Your Vision · Our Technology
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
