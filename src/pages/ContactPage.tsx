import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/motion";
import { ArrowRight, Clock, Mail, MapPin, Navigation, Phone, Whatsapp } from "@/components/FontAwesomeIcons";

const contactItems = [
  {
    icon: MapPin,
    label: "Address",
    value: "The Apostolic Church Nigeria, Wuse Assembly\nWuse, Abuja, Nigeria",
    href: "https://maps.google.com/?q=Wuse+Abuja+Nigeria",
    linkText: "Get directions",
  },
  { icon: Phone, label: "Phone", value: "+234 800 000 0000", href: "tel:+2348000000000", linkText: "Call now" },
  { icon: Whatsapp, label: "WhatsApp", value: "+234 800 000 0000", href: "https://wa.me/2348000000000", linkText: "Chat on WhatsApp" },
  { icon: Mail, label: "Email", value: "info@tacwuse.org", href: "mailto:info@tacwuse.org", linkText: "Send an email" },
];

const times = [
  ["Sunday School", "8:00 AM"],
  ["Main Service", "9:00 AM"],
  ["Bible Study (Tuesday)", "5:00 PM"],
  ["Hour of Grace (Thursday)", "5:00 PM"],
];

const ContactPage = () => (
  <>
    <PageHeader label="Contact" title="We'd love to hear from you.">
      <p>Reach out any time, or plan a visit and join us this week.</p>
    </PageHeader>

    <section className="container grid gap-6 pb-24 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="grid gap-4">
        {contactItems.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.07}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-5 rounded-lg bg-card p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-26px_hsl(var(--footer)/0.5)]"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block text-lg font-semibold tracking-tight">{item.label}</span>
                <span className="mt-1 block whitespace-pre-line text-[0.95rem] text-muted-foreground">{item.value}</span>
              </span>
              <span className="hidden items-center gap-2 self-center text-sm font-semibold sm:inline-flex">
                {item.linkText}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15} className="self-start rounded-lg bg-footer p-8 text-footer-foreground sm:p-10">
        <h2 className="display-3 mb-6 flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary" /> Service times
        </h2>
        <dl className="divide-y divide-footer-foreground/15">
          {times.map(([name, time]) => (
            <div key={name} className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-footer-foreground/75">{name}</dt>
              <dd className="text-lg font-semibold">{time}</dd>
            </div>
          ))}
        </dl>
        <a
          href="https://maps.google.com/?q=Wuse+Abuja+Nigeria"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-8 w-full"
        >
          <Navigation className="h-4 w-4" /> Get directions
        </a>
      </Reveal>
    </section>
  </>
);

export default ContactPage;
