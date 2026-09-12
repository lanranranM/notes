import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import styles from './about.module.css';

export const metadata: Metadata = { title: 'About Me | Melody' };

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <SiteHeader active="about" />
      <section className={styles.content} aria-labelledby="about-title">
        <h1 id="about-title">About me<span>.</span></h1>
        <div className={styles.pathways}>
          <p className={styles.eyebrow}>TAKE A LOOK AROUND</p>
          <h2>A few places to start</h2>
          <div className={styles.pathGrid}>
            <Link href="/docs" className={styles.pathCard}>
              <div className={styles.pathVisual}><span className={styles.notesPhrase}>some human-made language gems before tokenized by LLM.</span></div>
              <div className={styles.pathCaption}><small>01</small><h3>Notes</h3><span>↗</span></div>
            </Link>
            <Link href="/artwork" className={styles.pathCard}>
              <div className={styles.pathVisual}><span className={styles.artPhrase}>some art and music</span></div>
              <div className={styles.pathCaption}><small>02</small><h3>Artwork</h3><span>↗</span></div>
            </Link>
            <Link href="/projects" className={styles.pathCard}>
              <div className={styles.pathVisual}><span className={styles.projectPhrase}>I try I fail I try again</span></div>
              <div className={styles.pathCaption}><small>03</small><h3>Projects</h3><span>↗</span></div>
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
