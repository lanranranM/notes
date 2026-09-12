import type { Metadata } from 'next';
import Image from 'next/image';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import styles from './artwork.module.css';

export const metadata: Metadata = {
  title: 'Artwork | Melody',
  description: 'A growing collection of paintings and other things made by Melody.',
};

const works = [
  {
    title: 'Coffee & Pretzel',
    note: 'Tall Grass Bakery · Venture Coffee',
    date: 'Sep 2026',
    src: '/artwork/coffee-pretzel.jpg',
    alt: 'A painted hand holding coffee and a pretzel against a green background.',
  },
  {
    title: 'Mt. Hood',
    note: 'McCall Point',
    date: 'May 2026',
    src: '/artwork/mount-hood.jpg',
    alt: 'Blue and white Mount Hood above dark hand-drawn fir trees.',
  },
  {
    title: 'Sunset, mountain, water',
    note: 'A little landscape',
    date: 'Jul 2026',
    src: '/artwork/sunset-mountain-water.jpg',
    alt: 'A coral sunset above blue mountains and water.',
  },
  {
    title: 'Untitled',
    note: 'Shapes after dark',
    date: 'Jul 2026',
    src: '/artwork/untitled.jpg',
    alt: 'An abstract painting with black, blue, peach, and pale shapes.',
  },
];

export default function ArtworkPage() {
  return (
    <main className={styles.page}>
      <SiteHeader active="artwork" />

      <section className={styles.hero} aria-labelledby="artwork-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>ARTWORK / 作品集</p>
          <h1 id="artwork-title">A digital gallery of the world I see<span className={styles.period}>.</span></h1>
          <p className={styles.intro}>Just a girl with her sketchbook and music.</p>
          <p className={styles.reflection}>
            Lightly I leave, as lightly I came; life is too short and the world is too amazing to miss.
            Every frame I see is a painting worth capturing.
          </p>
          <a className={styles.exploreLink} href="#works">acrylic square project <span aria-hidden="true">↘</span></a>
        </div>
        <figure className={styles.heroFigure}>
          <div className={styles.heroImageWrap}>
            <Image
              src="/artwork/flowers-in-yard.jpg"
              alt="Pink flowers and a crescent moon painted against a deep blue night sky."
              width={1600}
              height={1600}
              sizes="(max-width: 760px) 90vw, 48vw"
              priority
              className={styles.artImage}
            />
          </div>
          <figcaption className={styles.heroCaption}>
            <span>01 / Flowers in Yard</span>
            <span>Eastlake · Apr 2026</span>
          </figcaption>
        </figure>
      </section>

      <section id="works" className={styles.works} aria-labelledby="works-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>THE COLLECTION</p>
            <h2 id="works-title">Made along the way</h2>
          </div>
          <span>01 — 05 / PAINTINGS</span>
        </div>

        <div className={styles.grid}>
          {works.map((work, index) => (
            <figure className={styles.workCard} key={work.src}>
              <div className={styles.workImageWrap}>
                <Image
                  src={work.src}
                  alt={work.alt}
                  width={1600}
                  height={1600}
                  sizes="(max-width: 760px) 90vw, 42vw"
                  className={styles.artImage}
                />
              </div>
              <figcaption className={styles.workCaption}>
                <span className={styles.workNumber}>0{index + 2}</span>
                <div>
                  <h3>{work.title}</h3>
                  <p>{work.note}</p>
                </div>
                <span className={styles.workDate}>{work.date}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
