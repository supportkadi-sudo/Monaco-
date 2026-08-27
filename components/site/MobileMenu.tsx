'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/lib/site';

const navigation = [
  { href: '#about', label: 'О нас' },
  { href: '#zones', label: 'Зоны' },
  { href: '#prices', label: 'Цены' },
  { href: '#gallery', label: 'Галерея' },
  { href: '#before-visit', label: 'Перед посещением' },
  { href: '#contacts', label: 'Контакты' }
] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        requestAnimationFrame(() => toggleRef.current?.focus());
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function closeAndReturnFocus() {
    setOpen(false);
    requestAnimationFrame(() => toggleRef.current?.focus());
  }

  return (
    <>
      <button
        ref={toggleRef}
        className="mobile-menu-toggle"
        type="button"
        aria-label="Открыть меню"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <div className={`mobile-menu-layer${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <button className="mobile-menu-backdrop" type="button" tabIndex={-1} aria-label="Закрыть меню" onClick={closeAndReturnFocus} />
        <div className="mobile-menu-panel" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Навигация Monaco Aquapark">
          <div className="mobile-menu-head">
            <span className="mobile-menu-caption">Навигация</span>
            <button className="mobile-menu-close" type="button" aria-label="Закрыть меню" onClick={closeAndReturnFocus}>×</button>
          </div>

          <nav className="mobile-menu-nav" aria-label="Мобильная навигация">
            {navigation.map((item, index) => (
              <a
                key={item.href}
                ref={index === 0 ? firstLinkRef : undefined}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a className="mobile-menu-instagram" href={site.instagramUrl} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            Instagram <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </>
  );
}
