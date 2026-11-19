import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import { ease } from "@/components/motion";

/** Persistent shell: header and footer stay mounted so the nav indicator can travel between routes. */
const Layout = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        // wait a frame so the new page has mounted
        requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-[100svh] flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-footer focus:px-4 focus:py-2 focus:text-footer-foreground"
      >
        Skip to content
      </a>
      <Header />
      <motion.main
        id="main"
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease }}
        className="flex-1"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
