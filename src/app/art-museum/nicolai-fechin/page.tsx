import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import { ArtworkFigure } from '../ArtworkFigure';
import data from '../fechin.json';
import { captions } from '../artwork-captions';
import styles from '../museum.module.css';

export const metadata: Metadata = {
  title: 'Nicolai Fechin · Art Museum | Melody',
  description: '中国美术馆观展手记：人物的骨、肉与气，未完成的笔触，以及 Fechin 色彩的张力与微妙。',
};

function Art({ id, priority = false }: { id: number; priority?: boolean }) {
  return <ArtworkFigure image={data.images[id]} caption={captions[id]} priority={priority} />;
}

function Paragraphs({ ids }: { ids: number[] }) {
  return <div className={styles.prose}>{ids.map((id) => <p key={id}>{data.paragraphs[id]}</p>)}</div>;
}

export default function FechinPage() {
  return (
    <div className={styles.page} lang="zh-CN">
      <SiteHeader active="museum" />
      <main id="top">
        <article>
          <header className={styles.articleHeader}>
            <Link href="/art-museum" className={styles.breadcrumb}>Art Museum / 观展手记</Link>
            <div className={styles.hero}>
              <div>
                <p className={styles.eyebrow}>中国美术馆 · NICOLAI FECHIN 特展</p>
                <h1 className={styles.heroTitle}>Nicolai <em>Fechin</em><span>.</span></h1>
                <p className={styles.subtitle}>色彩、笔触与生命的欢愉</p>
                <div className={styles.metadata}><span>文 / Melody</span><time dateTime="2026-11-25">2026年11月25日</time><span>北京</span></div>
                <p className={styles.heroNote}>俄罗斯现实主义素描，色彩表现主义，和东方美学在 Fechin 的笔下重新交织、律动，赋予人物极具鲜艳的生命和纯真的美好。</p>
              </div>
              <div className={styles.heroArt}><Art id={0} priority /></div>
            </div>
          </header>

          <div className={styles.articleBody}>
            <div className={styles.readingLayout}>
              <nav className={styles.contents} aria-label="文章目录">
                <p>IN THIS NOTE / 目录</p>
                <a href="#portraits">人物的骨、肉与气</a>
                <a href="#unfinished">以未完成感构建完成感</a>
                <a href="#colour">色彩的张力与微妙</a>
                <Link href="/art-museum" className={styles.backLink}>回到 Art Museum</Link>
              </nav>
              <div className={styles.articleContent}>
                <div className={styles.intro}><Paragraphs ids={[0, 1, 2]} /></div>

                <section id="portraits" className={styles.chapter} aria-labelledby="portraits-title">
                  <div className={styles.prose}><h2 id="portraits-title">人物的骨、肉与气</h2></div>
                  <Paragraphs ids={[3, 4, 5]} />
                  <div className={styles.portraitMosaic}>
                    <Art id={1} />
                    <Art id={0} />
                    <Art id={2} />
                  </div>
                  <div className={styles.kazanStudy}>
                    <Paragraphs ids={[6]} />
                    <div className={`${styles.gallery} ${styles.kazanGallery}`}>
                      <Art id={3} />
                      <Art id={4} />
                    </div>
                  </div>
                  <Paragraphs ids={[7]} />
                  <div className={`${styles.gallery} ${styles.trio}`}><Art id={5} /><Art id={6} /><Art id={7} /></div>
                </section>

                <section id="unfinished" className={styles.chapter} aria-labelledby="unfinished-title">
                  <div className={styles.prose}><h2 id="unfinished-title">以未完成感构建完成感</h2></div>
                  <Paragraphs ids={[8]} />
                  <div className={`${styles.gallery} ${styles.editorialGallery}`}><Art id={8} /><Art id={9} /><Art id={10} /></div>
                </section>

                <section id="colour" className={styles.chapter} aria-labelledby="colour-title">
                  <div className={styles.prose}><h2 id="colour-title">色彩的张力与微妙</h2></div>
                  <Paragraphs ids={[9]} />
                  <div className={`${styles.gallery} ${styles.colourFirst}`}><Art id={11} /><Art id={12} /></div>
                  <div className={`${styles.gallery} ${styles.colourSecond}`}><Art id={13} /><Art id={14} /></div>
                  <Paragraphs ids={[10]} />
                  <div className={styles.darkStudy}>
                    <h3>黑中黑</h3>
                    <p>靠近一点，看颜色的细微变化。点击作品可放大。</p>
                    <div className={styles.gallery}><Art id={15} /><Art id={16} /><Art id={17} /><Art id={18} /></div>
                  </div>
                  <Paragraphs ids={[11]} />
                </section>

                <div className={styles.ending}>
                  <div className={styles.prose}><p>{data.paragraphs[12]}</p><p className={styles.signature}>{data.paragraphs[13]}</p></div>
                  <Art id={19} />
                </div>

                <div className={styles.articleEnd}><Link href="/art-museum">回到 Art Museum</Link></div>
              </div>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
