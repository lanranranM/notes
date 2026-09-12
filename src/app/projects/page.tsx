import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import styles from './projects.module.css';

export const metadata: Metadata = {
  title: 'Projects | Melody',
  description: 'Projects by Melody.',
};

export default function ProjectsPage() {
  return (
    <main className={styles.page}>
      <SiteHeader active="projects" />
      <section className={styles.content} aria-labelledby="projects-title">
        <p className={styles.eyebrow}>THINGS I AM MAKING</p>
        <h1 id="projects-title">Projects<span>.</span></h1>
        <div className={styles.grid}>
          <Link href="/artwork" className={styles.card}>
            <div className={styles.square}>
              <Image
                src="/artwork/coffee-pretzel.jpg"
                alt="A painted hand holding coffee and a pretzel against a green background."
                width={1600}
                height={1600}
                sizes="(max-width: 700px) 90vw, 44vw"
              />
            </div>
            <div className={styles.caption}><h2>Acrylic square</h2><span>↗</span></div>
          </Link>
          <div className={styles.card}>
            <div className={`${styles.square} ${styles.emptySquare}`}><span>coming soon...</span></div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
