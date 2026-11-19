import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ease } from "@/components/motion";

interface PageHeaderProps {
  label: string;
  title: ReactNode;
  children?: ReactNode;
}

const PageHeader = ({ label, title, children }: PageHeaderProps) => (
  <header className="page-heading container pb-16 pt-28 text-center sm:pb-20 sm:pt-36">
    <motion.p
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease }}
      className="editorial-label mb-6 justify-center"
    >
      {label}
    </motion.p>
    <motion.h1
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.08, ease }}
      className="display-1 mx-auto max-w-4xl"
    >
      {title}
    </motion.h1>
    {children && (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease }}
        className="lead mx-auto mt-7 text-muted-foreground"
      >
        {children}
      </motion.div>
    )}
  </header>
);

export default PageHeader;
