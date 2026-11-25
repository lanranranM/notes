'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './map.module.css';
import { exhibitionNotes, noteCountLabel, type GalleryId } from './exhibitions';

const rooms = [
  { id: 'russia', title: 'Russian Art', className: styles.russia },
  { id: 'europe', title: 'European Art', className: styles.europe },
  { id: 'asia', title: 'Asian Art', className: styles.asia },
  { id: 'americas', title: 'Art of the Americas', className: styles.americas },
] satisfies { id: GalleryId; title: string; className: string }[];

const galleries = rooms.map((room) => ({
  ...room,
  notes: exhibitionNotes.filter((note) => note.gallery === room.id),
}));

export function ExhibitionMap() {
  const [active, setActive] = useState<string | null>(null);
  const room = galleries.find((item) => item.id === active);
  function enterRoom(id: string) {
    setActive(id);
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('#exhibition-list a, #exhibition-list button')?.focus();
    });
  }
  return (
    <section className={styles.mapSection} aria-label="Gallery map">
      <div className={styles.mapTop}><h2>Gallery Guide</h2><span>{galleries.length} galleries · {noteCountLabel(exhibitionNotes.length)}</span></div>
      <div className={styles.plan} onMouseLeave={() => setActive(null)} onKeyDown={(event) => { if (event.key === 'Escape') setActive(null); }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null); }}>
        <svg className={styles.architecture} viewBox="0 0 1000 580" preserveAspectRatio="none" aria-hidden="true">
          <defs><pattern id="floor-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#dedbd4" strokeWidth=".5" /></pattern></defs>
          <rect x="30" y="28" width="940" height="520" fill="url(#floor-grid)" />
          <path d="M440 548H30V28H970V548H560" fill="none" stroke="#45433d" strokeWidth="3" />
          <path d="M345 28V205M345 265V350M345 410V548M655 28V205M655 265V350M655 410V548M30 285H180M240 285H345M655 285H775M835 285H970" fill="none" stroke="#45433d" strokeWidth="3" />
          <path d="M345 205h-50a50 50 0 0 0 50 50M655 205h50a50 50 0 0 1-50 50M345 350h-50a50 50 0 0 0 50 50M655 350h50a50 50 0 0 1-50 50M440 548v-60a60 60 0 0 1 60 60M560 548v-60a60 60 0 0 0-60 60" fill="none" stroke="#aaa398" strokeWidth="1" />
          <rect x="409" y="196" width="182" height="173" rx="70" fill="#e7e8dd" stroke="#b5b7a4" strokeWidth="1" />
          <path d="M435 228Q500 205 565 228M435 337Q500 360 565 337" fill="none" stroke="#c6c8b7" />
          <path d="M500 470V405" fill="none" stroke="#ab7766" strokeWidth="1.5" strokeDasharray="4 5" />
          <circle cx="500" cy="466" r="5" fill="#e95043" />
        </svg>
        <div className={styles.courtyard}><span>Courtyard</span></div>
        <div className={styles.entrance}>Entrance</div>
        {galleries.map((item) => (
          <button type="button" key={item.id} className={`${styles.room} ${item.className}`} aria-expanded={active === item.id} aria-controls={active === item.id ? 'exhibition-list' : undefined} onMouseEnter={() => setActive(item.id)} onFocus={() => setActive(item.id)} onClick={(event) => { if (event.detail === 0) enterRoom(item.id); else setActive(item.id); }} onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); enterRoom(item.id); } }}>
            <strong>{item.title}</strong><span className={styles.roomCount}>{noteCountLabel(item.notes.length)}</span>
          </button>
        ))}
        {room && <div id="exhibition-list" className={`${styles.exhibitionList} ${active === 'russia' || active === 'asia' ? styles.listLeft : styles.listRight}`} role="region" aria-label={`${room.title} exhibitions`}>
          <div className={styles.listHeading}><span>{room.title} / Exhibitions</span><button type="button" onClick={() => setActive(null)} aria-label="Close exhibition list">×</button></div>
          {room.notes.length > 0 ? <ul className={styles.entries}>{room.notes.map((note) => <li key={note.slug}><Link href={`/art-museum/${note.slug}`} className={styles.exhibitionLink}><strong>{note.title}</strong><span>{note.subtitle}</span><small>{note.venue}</small><time dateTime={note.date}>{note.date.replaceAll('-', '.')}</time><span className={styles.read}>Read exhibition note</span></Link></li>)}</ul> : <p className={styles.empty}>No exhibition notes yet.</p>}
        </div>}
      </div>
      <div className={styles.mapBottom}><span>A MUSEUM OF ENCOUNTERS</span></div>
    </section>
  );
}
