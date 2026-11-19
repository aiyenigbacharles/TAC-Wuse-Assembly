import { Link } from "react-router-dom";
import { ArrowRight, Facebook, Mail, MapPin, Phone, Youtube } from "@/components/FontAwesomeIcons";
import ResponsiveImage from "@/components/ResponsiveImage";
import { getGalleryImage } from "@/data/gallery";
import { FACEBOOK_URL, YOUTUBE_URL } from "@/components/Header";

const FooterHeading = ({ children }: { children: string }) => (
  <h4 className="mb-5 flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-footer-foreground">
    {children}
    <span className="h-0.5 w-10 bg-primary" aria-hidden />
  </h4>
);

const linkClass = "inline-flex min-h-11 w-fit items-center text-[0.95rem] text-footer-foreground/75 underline-offset-4 transition-colors hover:text-primary hover:underline";

const Footer = () => (
  <footer className="bg-footer pb-8 pt-16 text-footer-foreground">
    <div className="container">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr_1fr_1.2fr]">
        <div>
          <ResponsiveImage image={getGalleryImage("tac-logo")} alt="The Apostolic Church Nigeria emblem" sizes="64px" className="h-16 w-16 rounded-full object-cover" />
          <p className="mt-5 max-w-xs text-[0.95rem] text-footer-foreground/70">
            The Apostolic Church Nigeria, Wuse Assembly. A place of worship, fellowship and spiritual growth.
          </p>
          <div className="mt-6 inline-flex gap-1 rounded-md bg-footer-foreground/10 p-1.5">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-11 w-11 place-items-center rounded transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Facebook className="h-[1.1rem] w-[1.1rem]" />
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="grid h-11 w-11 place-items-center rounded transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Youtube className="h-[1.1rem] w-[1.1rem]" />
            </a>
          </div>
        </div>

        <div>
          <FooterHeading>Connect</FooterHeading>
          <nav className="flex flex-col gap-3" aria-label="Connect">
            <Link to="/contact" className={linkClass}>Plan your visit</Link>
            <Link to="/testimonies" className={linkClass}>Share a testimony</Link>
            <Link to="/donate" className={linkClass}>Give</Link>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>Watch online</a>
          </nav>
        </div>

        <div>
          <FooterHeading>About us</FooterHeading>
          <nav className="flex flex-col gap-3" aria-label="About us">
            <Link to="/about" className={linkClass}>Who we are</Link>
            <Link to="/about#beliefs" className={linkClass}>What we believe</Link>
            <Link to="/leadership" className={linkClass}>Our pastors</Link>
            <Link to="/gallery" className={linkClass}>Gallery</Link>
          </nav>
        </div>

        <div className="rounded-lg bg-footer-foreground/[0.07] p-7">
          <h4 className="display-3 mb-5">Contact info</h4>
          <ul className="space-y-3 text-[0.95rem] text-footer-foreground/85">
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" /> Wuse, Abuja, Nigeria
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <a href="tel:+2348000000000" className="hover:text-primary">+234 800 000 0000</a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <a href="mailto:info@tacwuse.org" className="hover:text-primary">info@tacwuse.org</a>
            </li>
          </ul>
          <a
            href="https://maps.google.com/maps/dir/?api=1&destination=The+Apostolic+Church+Wuse+Abuja"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-primary"
          >
            Get directions <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-3 border-t border-footer-foreground/15 pt-6 text-sm text-footer-foreground/60 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} The Apostolic Church Nigeria, Wuse Assembly. All rights reserved.</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex min-h-11 w-fit items-center underline underline-offset-4 hover:text-primary"
        >
          Back to top
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
