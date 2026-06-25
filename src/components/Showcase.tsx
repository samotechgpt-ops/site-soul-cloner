import { motion } from "motion/react";
import showroomWall from "@/assets/var-business-showroom.jpg";
import officeAllInOne from "@/assets/var-office-allinone.jpg";
import storeWide from "@/assets/var-hero-showcase.jpg";

const slides = [
  {
    img: showroomWall,
    code: "▸ 01",
    title: "VAR — Votre allié en solutions IT",
    desc: "Matériel, logiciel, infrastructure et maintenance. La technologie qui fait avancer votre entreprise.",
  },
  {
    img: officeAllInOne,
    code: "▸ 02",
    title: "VAR Technology, Simplified",
    desc: "PC All-In-One VAR pensés pour la productivité — design épuré, fiabilité quotidienne, intégration propre au bureau.",
  },
  {
    img: storeWide,
    code: "▸ 03",
    title: "VAR Algeria — IT Solutions",
    desc: "Showroom et catalogue VAR : laptops, accessoires, business solutions et moniteurs, disponibles dans les 69 wilayas.",
  },
];

export function Showcase() {
  return (
    <section id="showcase" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-[1400px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex items-end justify-between gap-6"
        >
          <div>
            <div className="mb-4 font-mono text-xs tracking-[0.35em] text-primary uppercase">
              ▸ 03 — VAR Showcase
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter leading-[1]">
              L'univers <span className="text-primary text-glow-crimson italic">VAR</span>
            </h2>
          </div>
        </motion.div>

        <div className="space-y-10">
          {slides.map((s, i) => (
            <motion.figure
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="group relative overflow-hidden border border-primary/30 clip-corner"
            >
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent pointer-events-none" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <div className="font-mono text-[10px] md:text-xs tracking-[0.35em] text-primary uppercase mb-2">
                  {s.code}
                </div>
                <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm md:text-base text-muted-foreground">
                  {s.desc}
                </p>
              </figcaption>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
