import { useEffect, useRef, useState } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>/?";

interface Props {
  text: string;
  className?: string;
  duration?: number;
  trigger?: boolean;
}

export function ScrambleText({ text, className = "", duration = 900, trigger = true }: Props) {
  const [output, setOutput] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!trigger) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          runScramble();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, text]);

  function runScramble() {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const revealCount = Math.floor(t * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealCount) out += text[i];
        else if (text[i] === " ") out += " ";
        else out += chars[Math.floor(Math.random() * chars.length)];
      }
      setOutput(out);
      if (t < 1) requestAnimationFrame(tick);
      else setOutput(text);
    };
    requestAnimationFrame(tick);
  }

  return (
    <span ref={ref} className={className}>
      {output}
    </span>
  );
}
