import type { Metadata } from 'next';
import Link from 'next/link';
import { StaffCanvas } from '@/components/staff-animation';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import styles from './home.module.css';

export const metadata: Metadata = {
  title: 'Melody',
  description: 'Notes, artwork, and projects by Melody.',
};

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.firstScreen}>
        <div className={styles.overlayHeader}><SiteHeader active="home" /></div>
        <section className={styles.stage} aria-label="Interactive music artwork: Perform Your Life">
          <StaffCanvas />
        </section>
      </div>

      <section className={styles.intro} aria-labelledby="home-title">
        <div className={styles.introInner}>
          <p className={styles.eyebrow}>WELCOME TO MY LITTLE CORNER OF THE INTERNET</p>
          <h1 id="home-title">Hello, I&apos;m Melody<span>.</span></h1>
          <div className={styles.links}>
            <Link href="/artwork">View artwork ↗</Link>
            <Link href="/docs">Read notes ↗</Link>
            <Link href="/projects">See projects ↗</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
