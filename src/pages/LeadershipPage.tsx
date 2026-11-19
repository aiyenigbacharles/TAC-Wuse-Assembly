import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/motion";
import ResponsiveImage from "@/components/ResponsiveImage";
import { getGalleryImage } from "@/data/gallery";

const pastors = [
  { name: "Pastor Jacob Nkopeti", title: "Wuse Area Superintendent", image: getGalleryImage("pastor-nkopeti") },
  { name: "Pastor Samuel Ogunrole", title: "Student Pastor", image: getGalleryImage("pastor-ogunrole") },
  { name: "Pastor Lawrence Adewumi", title: "Assistant Pastor", image: getGalleryImage("pastor-lawrence") },
  { name: "Pastor Josiah Ilari", title: "Assistant Pastor", image: getGalleryImage("pastor-josiah") },
];

const LeadershipPage = () => (
  <>
    <PageHeader label="Leadership" title="The pastors who shepherd us.">
      <p>Meet the dedicated leaders who care for our congregation with love and wisdom.</p>
    </PageHeader>

    <section className="container pb-24">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pastors.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <figure className="group rounded-lg bg-card p-3 transition-shadow duration-300 hover:shadow-[0_20px_44px_-26px_hsl(var(--footer)/0.55)]">
              <div className="overflow-hidden rounded-md">
                <ResponsiveImage
                  image={p.image}
                  alt={p.name}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <figcaption className="px-2 pb-3 pt-5">
                <p className="text-balance text-xl font-semibold leading-tight tracking-tight">{p.name}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.title}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  </>
);

export default LeadershipPage;
