'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import styles from './museum.module.css';
import type { ArtworkCaption } from './artwork-captions';

type ArtworkProps = {
  image: { src: string; width: number; height: number };
  caption: ArtworkCaption;
  priority?: boolean;
};

export function ArtworkFigure({ image, caption, priority = false }: ArtworkProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const label = `${caption.zh} · ${caption.ru} · ${caption.year}`;
  const captionText = <><span className={styles.captionTitle}>{caption.zh}<span className={styles.captionYear}>{caption.year}</span></span><span className={styles.captionRussian} lang="ru">{caption.ru}</span></>;
  useEffect(() => {
    const element = dialog.current;
    return () => { if (element?.open) document.body.style.overflow = ''; };
  }, []);

  function close() {
    dialog.current?.close();
    document.body.style.overflow = '';
  }

  return (
    <figure className={styles.figure}>
      <button type="button" className={styles.imageButton} aria-label={`放大查看：${label}`} onClick={() => {
        dialog.current?.showModal();
        document.body.style.overflow = 'hidden';
      }}>
        <Image {...image} alt={label} priority={priority} sizes="(max-width: 760px) 90vw, (max-width: 1000px) 85vw, 1000px" />
        <span className={styles.zoomHint}>放大</span>
      </button>
      <figcaption>{captionText}</figcaption>
      <dialog ref={dialog} className={styles.lightbox} onClick={(event) => { if (event.target === event.currentTarget) close(); }} onCancel={close} onClose={() => { document.body.style.overflow = ''; }} aria-label={label}>
        <button type="button" className={styles.closeButton} onClick={close} autoFocus>关闭 ×</button>
        <Image {...image} alt={label} sizes="95vw" className={styles.lightboxImage} />
        <div className={styles.lightboxCaption}>{captionText}{caption.note && <small>{caption.note}</small>}{caption.source && <a href={caption.source} target="_blank" rel="noreferrer">画作资料</a>}</div>
      </dialog>
    </figure>
  );
}
