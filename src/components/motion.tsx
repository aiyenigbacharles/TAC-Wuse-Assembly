import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, type HTMLMotionProps } from "framer-motion";

/** One easing curve for the whole site: quick start, long soft landing. */
export const ease = [0.22, 1, 0.36, 1] as const;

/** Small, quiet entrance for grids of cards. Used sparingly. */
export const Reveal = ({
  children,
  delay = 0,
  y = 14,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & Omit<HTMLMotionProps<"div">, "children">) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -80px 0px" }}
    transition={{ duration: 0.8, delay, ease }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const RevealText = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <span className={`block overflow-hidden pb-[0.08em] -mb-[0.08em] ${className}`}>
    <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease }}>{children}</motion.span>
  </span>
);

export const Parallax = ({ children, className = "", distance = 32 }: { children: ReactNode; className?: string; distance?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
};

/** Image wipe: the frame opens from the bottom as it scrolls into view. */
export const ImageReveal = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    className={className}
    initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
    whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
    viewport={{ once: true, margin: "0px 0px -80px 0px" }}
    transition={{ duration: 1, ease }}
  >
    {children}
  </motion.div>
);

/** A line of a headline that rises out of a mask. */
export const RiseLine = ({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) => (
  <span className={`block overflow-hidden pb-[0.08em] -mb-[0.08em] ${className ?? ""}`}>
    <motion.span
      className="block"
      initial={{ y: "105%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.span>
  </span>
);
