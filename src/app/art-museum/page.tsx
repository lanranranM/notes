import type { Metadata } from 'next';
import { ExhibitionMap } from './ExhibitionMap';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import styles from './museum.module.css';
import mapStyles from './map.module.css';

export const metadata: Metadata = {
  title: 'Art Meseum 美术馆 | Melody',
  description: 'Explore artists, exhibitions, and personal exhibition notes through the gallery map.',
};

export default function MuseumPage() {
  return (
    <div className={`${styles.page} ${mapStyles.page}`} lang="en">
      <SiteHeader active="museum" />
      <main className={mapStyles.main}>
        <header className={mapStyles.heading}>
          <div><p className={styles.eyebrow}>MELODY’S MUSEUM</p><h1>Art Meseum <span lang="zh-CN">美术馆</span></h1></div>
        </header>
        <ExhibitionMap />
      </main>
      <SiteFooter />
    </div>
  );
}
