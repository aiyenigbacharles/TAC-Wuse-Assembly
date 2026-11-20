import PageHeader from "@/components/PageHeader";
import { ImageReveal, Reveal } from "@/components/motion";
import ResponsiveImage from "@/components/ResponsiveImage";
import { getGalleryImage } from "@/data/gallery";

const beliefs = [
  "The Bible as the inspired and infallible Word of God.",
  "One God eternally existing in three persons: Father, Son, and Holy Spirit.",
  "Salvation through faith in Jesus Christ alone.",
  "The baptism of the Holy Spirit with the evidence of speaking in tongues.",
  "The second coming of our Lord Jesus Christ.",
];

const AboutPage = () => (
  <>
    <PageHeader label="About us" title="A family of believers in the heart of Wuse." />

    <section className="container pb-16">
      <ImageReveal className="overflow-hidden rounded-xl">
        <ResponsiveImage
          image={getGalleryImage("gallery-40")}
          alt="The Wuse Assembly family gathered for a group photo"
          sizes="100vw"
          className="aspect-[16/8] w-full object-cover"
        />
      </ImageReveal>
    </section>

    <section className="container grid gap-8 pb-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <h2 className="display-3 lg:pt-1">Our history</h2>
      <Reveal>
        <p className="max-w-2xl text-[1.12rem] leading-relaxed text-foreground/85">
          The Apostolic Church Nigeria, Wuse Assembly is a vibrant community of believers rooted in the teachings of
          Jesus Christ. Established in the heart of Wuse, Abuja, our assembly has grown from a small fellowship into a
          thriving congregation committed to spreading the gospel, nurturing spiritual growth, and serving our
          community with love and compassion.
        </p>
      </Reveal>
    </section>

    <section className="section-alt py-16 sm:py-20">
      <div className="container grid gap-6 md:grid-cols-2">
        {[
          {
            title: "Our mission",
            text: "To preach the gospel of Jesus Christ, make disciples of all nations, and build a community of believers who live out their faith through worship, service, and love.",
          },
          {
            title: "Our vision",
            text: "To be a beacon of hope and transformation in Wuse and beyond, raising godly leaders who impact their families, communities, and the world for Christ.",
          },
        ].map((item, i) => (
          <Reveal key={item.title} delay={i * 0.1} className="rounded-lg bg-card p-8 sm:p-10">
            <h2 className="display-2 mb-5 !text-[2rem]">{item.title}</h2>
            <p className="text-[1.02rem] text-muted-foreground">{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>

    <section id="beliefs" className="container scroll-mt-24 grid gap-8 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div>
        <p className="editorial-label mb-6">What we believe</p>
        <h2 className="display-2">
          The truths we stand on.
        </h2>
      </div>
      <ul className="divide-y divide-border border-y border-border">
        {beliefs.map((item, i) => (
          <Reveal key={item} delay={i * 0.06} className="py-5 text-[1.1rem]">
            <li className="list-none">{item}</li>
          </Reveal>
        ))}
      </ul>
    </section>
  </>
);

export default AboutPage;
