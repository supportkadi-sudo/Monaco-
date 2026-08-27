'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { media, site } from '@/lib/site';
import styles from './GallerySection.module.css';

type GallerySlot = 'pool' | 'ship' | 'sauna' | 'hero' | 'party';

type GalleryItem = {
  src: string;
  alt: string;
  slot: GallerySlot;
  mobileFeatured?: boolean;
  party?: boolean;
};

const items: readonly GalleryItem[] = [
  { src: media.pool, alt: 'Бассейн Monaco Aquapark', slot: 'pool' },
  { src: media.ship, alt: 'Корабль с надписью MONACO в бассейне', slot: 'ship' },
  { src: media.sauna, alt: 'Сауна Monaco Aquapark', slot: 'sauna' },
  { src: media.hero, alt: 'Пространство Monaco Aquapark', slot: 'hero', mobileFeatured: true },
  { src: media.party, alt: 'Событие в Monaco Aquapark', slot: 'party', party: true }
];

export function GallerySection() {
  const [active, setActive] = useState<number | null>(null);
  const isOpen = active !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const move = useCallback((delta: number) => {
    setActive((value) => value === null ? null : (value + delta + items.length) % items.length);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'))
          .filter((element) => element.offsetParent !== null);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus();
    };
  }, [isOpen, move]);

  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="gallery-head">
          <div>
            <div className="eyebrow">A day at Monaco</div>
            <h2 className="section-title">Галерея Monaco</h2>
          </div>
          <div className="gallery-aside">
            <span className="section-lead">Настоящие фотографии комплекса</span>
            <a className="gallery-instagram" href={site.instagramUrl} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className={`gallery-grid ${styles.mobileGrid}`}>
          {items.map((item, index) => {
            const className = [
              'gallery-item',
              styles.item,
              styles[item.slot],
              `gallery-item--${item.slot}`,
              item.mobileFeatured ? 'gallery-item--mobile-featured' : '',
              item.party ? 'gallery-item--party' : ''
            ].filter(Boolean).join(' ');

            return (
              <button className={className} key={`${item.src}-${index}`} onClick={() => setActive(index)} aria-label={`Открыть фото: ${item.alt}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  loading={item.mobileFeatured ? 'eager' : 'lazy'}
                  quality={84}
                  sizes={item.mobileFeatured ? '(max-width: 820px) 100vw, 35vw' : '(max-width: 820px) 50vw, 35vw'}
                />
              </button>
            );
          })}
        </div>
      </div>

      {active !== null ? (
        <div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фотографии" onClick={() => setActive(null)}>
          <button ref={closeRef} className="lightbox-close" aria-label="Закрыть" onClick={() => setActive(null)}>×</button>
          <button className="lightbox-arrow lightbox-arrow--prev" aria-label="Предыдущее фото" onClick={(event) => { event.stopPropagation(); move(-1); }}>←</button>
          <Image src={items[active].src} alt={items[active].alt} width={1600} height={1100} quality={90} sizes="94vw" onClick={(event) => event.stopPropagation()} />
          <button className="lightbox-arrow lightbox-arrow--next" aria-label="Следующее фото" onClick={(event) => { event.stopPropagation(); move(1); }}>→</button>
          <div className="lightbox-count" aria-live="polite">{active + 1} / {items.length}</div>
        </div>
      ) : null}
    </section>
  );
}
