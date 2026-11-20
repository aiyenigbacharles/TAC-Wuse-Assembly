import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowLeft,
  ArrowRight,
  BookBible,
  CirclePlay,
  Clock,
  FacebookLogo,
  HandHoldingHeart,
  MapPin,
  Navigation,
  PeopleGroup,
  Phone,
  Play,
  User,
  YoutubeLogo,
  Cross,
} from "@/components/FontAwesomeIcons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ImageReveal, Reveal, ease } from "@/components/motion";
import FloatingImages from "@/components/FloatingImages";
import { FACEBOOK_URL, YOUTUBE_URL } from "@/components/Header";
import { ADDRESS_ONE_LINE, CHURCH_NAME, MAPS_DIRECTIONS_URL, MAPS_EMBED_URL } from "@/lib/siteInfo";
import ResponsiveImage from "@/components/ResponsiveImage";
import { getGalleryImage, heroGalleryImages, loadGalleryImages } from "@/data/gallery";

const MAPS_URL = MAPS_DIRECTIONS_URL;
const heroImages = heroGalleryImages;

const quickLinks = [
  { icon: Cross, title: "What we believe", to: "/about#beliefs" },
  { icon: PeopleGroup, title: "Meet our pastors", to: "/leadership" },
  { icon: HandHoldingHeart, title: "Give", to: "/donate" },
  { icon: BookBible, title: "See the gallery", to: "/gallery" },
];

const weekly = [
  {
    image: getGalleryImage("gallery-2"),
    title: "Sunday School",
    when: "Sundays, 8:00 AM",
    text: "Start your Sunday with teaching from the Word, in a group where questions are welcome.",
  },
  {
    image: getGalleryImage("cong-1"),
    title: "Main Service",
    when: "Sundays, 9:00 AM",
    text: "Worship, prayer and a message from the Word. Children's ministry and a mothers' room are available.",
  },
  {
    image: getGalleryImage("gallery-40"),
    title: "Bible Study",
    when: "Tuesdays, 5:00 PM",
    text: "Open your Bible and grow deeper in the Scriptures with the congregation.",
  },
  {
    image: getGalleryImage("cong-2"),
    title: "Hour of Grace",
    when: "Thursdays, 5:00 PM",
    text: "Gather with us for a special hour of prayer, worship and grace.",
  },
];

const pastors = [
  { name: "Pastor Jacob Nkopeti", title: "Wuse Area Superintendent", image: getGalleryImage("pastor-nkopeti") },
  { name: "Pastor Samuel Ogunrole", title: "Assembly Pastor", image: getGalleryImage("pastor-ogunrole") },
  { name: "Pastor Lawrence Adewumi", title: "Assistant Pastor", image: getGalleryImage("pastor-lawrence") },
  { name: "Pastor Josiah Ilari", title: "Assistant Pastor", image: getGalleryImage("pastor-josiah") },
];

const faqs = [
  { q: "What time does your service begin?", a: "Sunday School begins at 8:00 AM, followed by the main Sunday service at 9:00 AM. Bible Study is on Tuesdays at 5:00 PM, and Hour of Grace is on Thursdays at 5:00 PM." },
  { q: "Where are you located?", a: `We are located at ${ADDRESS_ONE_LINE}. You can use the 'Get directions' button on this page to navigate to us via Google Maps.` },
  { q: "What should I wear?", a: "Come as you are! We welcome everyone regardless of attire. Most members dress in smart casual or traditional wear." },
  { q: "What about my kids?", a: "We have a vibrant children's ministry that runs during our Sunday services. Your children are welcome and will be well taken care of." },
  { q: "What if I have an infant and need to feed?", a: "We have a comfortable mothers' room available where you can nurse and care for your infant during services." },
  { q: "What kind of church are you?", a: "We are a Pentecostal church that believes in the power of the Holy Spirit, sound biblical teaching, and warm fellowship." },
  { q: "Are you affiliated with a denomination?", a: "Yes, we are part of The Apostolic Church Nigeria, a Pentecostal denomination with roots in the early 20th-century revival movement." },
];

const Hero = () => {
  const heroText = useRef<HTMLDivElement>(null);
  const [heroImages, setHeroImages] = useState(heroGalleryImages);
  useEffect(() => {
    let mounted = true;
    loadGalleryImages().then((images) => { if (mounted) setHeroImages([...images].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))); }).catch((error: unknown) => console.warn("Gallery image catalog could not be loaded.", error));
    return () => { mounted = false; };
  }, []);
  return (
    <section className="home-hero relative flex min-h-[100svh] w-full items-center justify-center overflow-x-clip overflow-y-hidden bg-primary px-5 pb-14 pt-28 text-foreground">
      <FloatingImages images={heroImages} exclusionRef={heroText} />
      <div ref={heroText} className="hero-copy relative z-20 mx-auto w-full max-w-[40vw] text-center max-[639px]:max-w-none">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease }} className="eyebrow mb-7">The Apostolic Church Nigeria · Wuse Assembly</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .1, ease }} className="display-1">Worship with us in<br className="hidden xl:block" /> the heart of Wuse.</motion.h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .28, ease }} className="lead mx-auto mt-7 text-foreground/80">
          The Apostolic Church Nigeria, Wuse Assembly is a family of believers growing together in faith. Come as you are this Sunday.
        </motion.p>
        <div className="mx-auto mt-8 flex w-full max-w-[20rem] flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-dark">Plan your visit</a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn border border-foreground/50 text-foreground hover:bg-foreground hover:text-background"> <Navigation className="h-4 w-4" /> Get directions</a>
        </div>
        <p className="mt-6 text-sm text-foreground/75">2026 motto: “Thou art My King O! God, Command Deliverances For Us” (Psalm 44:4)</p>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */

const QuickLinks = () => (
  <section className="py-10 sm:py-16">
    <div className="container grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {quickLinks.map((item, i) => (
        <Reveal key={item.to} delay={i * 0.07}>
          <Link
            to={item.to}
            className="group flex h-full min-h-[11.5rem] flex-col justify-between rounded-lg bg-card p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_hsl(var(--footer)/0.5)]"
          >
            <item.icon className="h-9 w-9 text-foreground transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
            <div>
              <h3 className="display-3 mb-4">{item.title}</h3>
              <span className="inline-flex items-center gap-2 text-[0.95rem] font-semibold">
                Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  </section>
);

const NewHere = () => (
  <section className="statement-section py-20 sm:py-28">
    <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <ImageReveal className="overflow-hidden rounded-xl">
        <ResponsiveImage
          image={getGalleryImage("gallery-10")}
          alt="Church members gathered and smiling around the tables"
          className="aspect-[4/3] w-full object-cover lg:aspect-[3/2.4]"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </ImageReveal>
      <div>
        <p className="editorial-label mb-6">New here?</p>
        <h2 className="display-2 mb-6 text-[hsl(var(--accent-text))]">
          You won't feel new for long.
        </h2>
        <p className="mb-8 max-w-xl text-[1.02rem] text-foreground/85">
          At The Apostolic Church Nigeria, Wuse Assembly, we are devoted to worshipping God and making disciples of Jesus
          Christ, as in the Great Commission (
          <a
            href="https://www.biblegateway.com/passage/?search=Matthew+28%3A19"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground/70"
          >
            Matthew 28:19
          </a>
          ). Wondering what Sunday looks like? Sunday School begins at 8:00 AM, the main service follows at 9:00 AM, and
          there is a children's ministry and a mothers' room. We'd love to share more about our church with you.
        </p>
        <a href="#faq" className="btn btn-primary">
          What to expect
        </a>
      </div>
    </div>
  </section>
);

const OnlineBanner = () => (
  <section data-header-theme="dark" className="py-10 sm:py-16">
    <div className="container">
      <Reveal>
        <div className="relative isolate flex min-h-[26rem] items-end overflow-hidden rounded-xl bg-footer text-footer-foreground sm:min-h-[30rem]">
          <ResponsiveImage
            image={getGalleryImage("join-online")}
            alt=""
            aria-hidden
            className="absolute inset-0 -z-10 h-full w-full object-cover object-[80%_30%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-footer/95 from-20% via-footer/70 via-55% to-footer/25" />
          <div className="max-w-xl p-7 sm:p-12">
            <h2 className="display-2 mb-6 text-footer-foreground">
              Join the service online, or catch up on past messages.
            </h2>
            <ul className="mb-8 space-y-3 text-[0.98rem]">
              <li className="flex items-center gap-3">
                <CirclePlay className="h-[1.1rem] w-[1.1rem] text-primary" /> Live every Sunday at 9:00 AM
              </li>
              <li className="flex items-center gap-3">
                <User className="h-[1.1rem] w-[1.1rem] text-primary" /> On YouTube and Facebook
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <YoutubeLogo className="h-5 w-5" /> Watch <Play className="h-3 w-3" />
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="btn bg-[#1877F2] text-white hover:-translate-y-0.5">
                <FacebookLogo className="h-5 w-5" /> Facebook
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const WeeklyCarousel = () => {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    update();
    embla.on("select", update).on("reInit", update);
    return () => {
      embla.off("select", update).off("reInit", update);
    };
  }, [embla, update]);

  return (
    <section className="py-14 sm:py-20">
      <div className="container">
        <p className="editorial-label mb-6">This week</p>
        <h2 className="display-2 mb-4 max-w-3xl">
          We want to see you during the week.
        </h2>
        <p className="mb-12 text-[1.02rem]">Don't miss our regular gatherings.</p>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="-ml-6 flex">
            {weekly.map((item) => (
              <div key={item.title} className="min-w-0 flex-[0_0_88%] pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
                  <div className="overflow-hidden">
                    <ResponsiveImage
                      image={item.image}
                      alt=""
                      sizes="(max-width: 640px) 88vw, (max-width: 1024px) 50vw, 33vw"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="display-3 mb-3">{item.title}</h3>
                    <p className="mb-3 flex items-center gap-2 text-[0.92rem] font-semibold">
                      <Clock className="h-3.5 w-3.5" /> {item.when}
                    </p>
                    <p className="mb-6 text-[0.95rem] text-muted-foreground">{item.text}</p>
                    <a
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary mt-auto h-11 w-fit px-5 text-sm"
                    >
                      Get directions
                    </a>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => embla?.scrollPrev()}
              disabled={!canPrev}
              aria-label="Previous"
              className="grid h-11 w-11 place-items-center rounded-md bg-footer text-footer-foreground transition-[transform,opacity] hover:-translate-x-0.5 disabled:opacity-35 disabled:hover:translate-x-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => embla?.scrollNext()}
              disabled={!canNext}
              aria-label="Next"
              className="grid h-11 w-11 place-items-center rounded-md bg-footer text-footer-foreground transition-[transform,opacity] hover:translate-x-0.5 disabled:opacity-35 disabled:hover:translate-x-0"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary h-11 px-5 text-sm">
            Plan your visit
          </a>
        </div>
      </div>
    </section>
  );
};

const Pastors = () => (
  <section className="section-alt py-16 sm:py-24">
    <div className="container">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="editorial-label mb-6">Our pastors</p>
          <h2 className="display-2 max-w-2xl">
            Meet the people who shepherd us.
          </h2>
        </div>
        <Link to="/leadership" className="btn btn-light h-11 px-5 text-sm">
          Full leadership <ArrowRight className="arrow h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {pastors.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <figure className="group">
              <div className="overflow-hidden rounded-lg">
                <ResponsiveImage
                  image={p.image}
                  alt={p.name}
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-4">
                <p className="text-balance text-lg font-semibold leading-tight tracking-tight">{p.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.title}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Faqs = () => (
  <section id="faq" className="faq-section scroll-mt-24 py-16 sm:py-24">
    <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <p className="editorial-label mb-6">Visiting</p>
        <h2 className="display-2 mb-5">
          Questions before your first visit?
        </h2>
        <p className="max-w-sm text-muted-foreground">Here is what most first-time guests ask us.</p>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem key={faq.q} value={`faq-${i}`} className="rounded-lg border border-border bg-card px-6 data-[state=open]:border-foreground/30">
            <AccordionTrigger className="py-5 text-left text-[1.05rem] hover:no-underline">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-[0.98rem] text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

const Visit = () => (
  <section className="pb-16 sm:pb-24">
    <div className="container grid items-stretch gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col justify-between rounded-lg bg-card p-8 sm:p-10">
        <div>
          <p className="editorial-label mb-6">Visit us</p>
          <h2 className="display-2 mb-6">
            Find us in Wuse, Abuja.
          </h2>
          <ul className="space-y-3 text-[0.98rem]">
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0" /> <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{CHURCH_NAME}, {ADDRESS_ONE_LINE}</a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-1 h-4 w-4 shrink-0" /> Sundays: 8:00 AM Sunday School, 9:00 AM Main Service
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-1 h-4 w-4 shrink-0" /> +234 800 000 0000
            </li>
          </ul>
        </div>
        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8 w-fit">
          <Navigation className="h-4 w-4" /> Open in Google Maps
        </a>
      </div>
      <div className="min-h-[22rem] overflow-hidden rounded-lg">
        <iframe
          src={MAPS_EMBED_URL}
          className="h-full min-h-[22rem] w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Map showing The Apostolic Church Nigeria, Wuse Assembly"
        />
      </div>
    </div>
  </section>
);

const TestimonyBar = () => (
  <section className="pb-16 sm:pb-24">
    <div className="container">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg bg-tint p-8 sm:flex-row sm:items-center sm:p-10">
          <p className="display-3 max-w-xl">God is still at work. Tell us what He has done for you.</p>
          <Link to="/testimonies" className="btn btn-primary shrink-0 bg-footer text-footer-foreground hover:bg-footer/90">
            Share a testimony
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

const HomePage = () => (
  <>
    <Hero />
    <QuickLinks />
    <NewHere />
    <OnlineBanner />
    <WeeklyCarousel />
    <Pastors />
    <Faqs />
    <Visit />
    <TestimonyBar />
  </>
);

export default HomePage;
