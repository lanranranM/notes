import Link from 'next/link';
import styles from './SiteChrome.module.css';

type Section = 'home' | 'notes' | 'artwork' | 'projects' | 'about';

const sections: { key: Section; label: string; href: string }[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'notes', label: 'Notes', href: '/docs' },
  { key: 'artwork', label: 'Artwork', href: '/artwork' },
  { key: 'projects', label: 'Projects', href: '/projects' },
  { key: 'about', label: 'About Me', href: '/about' },
];

export function SiteHeader({ active }: { active: Section }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.wordmark} aria-label="Melody, home">
        MELODY<span>.</span>
      </Link>
      <nav className={styles.nav} aria-label="Main navigation">
        {sections.map((section) => (
          <Link
            key={section.key}
            href={section.href}
            aria-current={active === section.key ? 'page' : undefined}
          >
            {section.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div>
          <h2>Contact</h2>
          <ul>
            <li><a href="https://www.instagram.com/ibuprofenlan/" target="_blank" rel="noreferrer">Instagram ↗</a></li>
            <li><a href="https://github.com/lanranranM" target="_blank" rel="noreferrer">GitHub ↗</a></li>
            <li><a href="https://www.linkedin.com/in/heymelodyyy/" target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
          </ul>
          <p className={styles.contactNote}>new ideas? tell me! <span>(warning: you are reaching out to an introvert creature)</span></p>
        </div>
        <div>
          <h2>Opening hours</h2>
          <p>permanently closed,<br />I&apos;m fixing my spaceship<br />to proximaB.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <ul>
            {sections.map((section) => (
              <li key={section.key}><Link href={section.href}>{section.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© Melody</span>
        <Link href="/">back to the beginning ↑</Link>
      </div>
    </footer>
  );
}
