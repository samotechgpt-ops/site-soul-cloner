import { motion } from "motion/react";
import monitorLoop from "@/assets/var-monitor-loop.mp4.asset.json";
import showroomLoop from "@/assets/var-showroom-loop.mp4.asset.json";

export function VideoBanner() {
  return (
    <section className="relative overflow-hidden border-y border-primary/20 bg-black">
      <div className="grid gap-px bg-primary/20 md:grid-cols-2">
        {[
          { src: showroomLoop.url, label: "◢ Showroom VAR · Alger", title: "Matériel informatique VAR" },
          { src: monitorLoop.url, label: "◢ Moniteurs VAR · Live", title: "Écrans VAR haute fidélité" },
        ].map((v) => (
          <motion.div
            key={v.src}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video overflow-hidden bg-black"
          >
            <video
              src={v.src}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">{v.label}</p>
              <h3 className="mt-1 font-display text-xl md:text-3xl font-bold tracking-tight text-white">{v.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
