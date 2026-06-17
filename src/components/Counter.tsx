import { useEffect, useRef, useState } from "react";

interface Props {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function Counter({ to, suffix = "", duration = 2000, className = "" }: Props) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.floor(eased * to));
            if (t < 1) requestAnimationFrame(tick);
            else setVal(to);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {val}
      {suffix}
    </span>
  );
}
