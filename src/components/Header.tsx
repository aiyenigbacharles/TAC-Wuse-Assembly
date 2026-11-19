import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "@/components/FontAwesomeIcons";
import ThemeToggle from "./ThemeToggle";
import ResponsiveImage from "@/components/ResponsiveImage";
import { getGalleryImage } from "@/data/gallery";
import { ease } from "@/components/motion";

export const YOUTUBE_URL = "https://www.youtube.com/channel/UCRWTYbNgj55qJgpNp-i9OWg";
export const FACEBOOK_URL = "https://www.facebook.com/tacwuse2";
const navLinks = [
  { to: "/", label: "Home" }, { to: "/about", label: "About" }, { to: "/leadership", label: "Leadership" },
  { to: "/gallery", label: "Gallery" }, { to: "/testimonies", label: "Testimonies" }, { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false); const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLElement>(null); const toggleRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => { const y = window.scrollY; setScrolled(y > 40); setHidden(y > 140 && y > previous + 4); if (y < previous - 5) setHidden(false); previous = y; };
    window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const focusable = () => menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    focusable()?.[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
      if (event.key === "Tab") {
        const items = focusable(); if (!items?.length) return;
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1].focus(); }
        else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0].focus(); }
      }
    };
    document.body.style.overflow = "hidden"; window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);
  return <motion.header animate={{ y: hidden && !open ? "-110%" : "0%" }} transition={{ duration: .45, ease }} className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
    <div className="header-inner">
      <Link to="/" className="header-brand" aria-label="The Apostolic Church Nigeria, Wuse Assembly, home"><ResponsiveImage image={getGalleryImage("tac-logo")} alt="" sizes="44px" className="h-11 w-11 rounded-full object-cover" priority /><span>TACN <small>WUSE ASSEMBLY</small></span></Link>
      <nav className="header-nav" aria-label="Main navigation">{navLinks.map((link) => <Link key={link.to} to={link.to} aria-current={pathname === link.to ? "page" : undefined} className={`nav-link ${pathname === link.to ? "is-active" : ""}`}>{link.label}</Link>)}</nav>
      <div className="header-actions"><Link to="/donate" className="btn btn-primary header-cta">Give <ArrowRight className="arrow h-3.5 w-3.5" /></Link><ThemeToggle /><button ref={toggleRef} className="mobile-menu-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button></div>
    </div>
    <AnimatePresence>{open && <motion.nav ref={menuRef} id="mobile-nav" className="mobile-menu" aria-label="Mobile navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .35, ease }}>{navLinks.map((link, i) => <motion.div key={link.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .055, duration: .5, ease }}><Link to={link.to} aria-current={pathname === link.to ? "page" : undefined}>{link.label}<ArrowRight /></Link></motion.div>)}<Link to="/donate" className="mobile-give">Give to the work <ArrowRight /></Link></motion.nav>}</AnimatePresence>
  </motion.header>;
};
export default Header;
