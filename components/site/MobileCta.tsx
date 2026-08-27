'use client';

import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroActions = document.querySelector<HTMLElement>('.hero-actions');

    const update = () => {
      if (!heroActions) {
        setVisible(window.scrollY > Math.min(320, window.innerHeight * 0.4));
        return;
      }

      const rect = heroActions.getBoundingClientRect();
      const heroActionsVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      setVisible(window.scrollY > 72 && !heroActionsVisible);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className={`mobile-cta${visible ? ' is-visible' : ''}`} aria-label="Быстрые действия" aria-hidden={!visible}>
      <a href={site.phoneHref} tabIndex={visible ? 0 : -1}>Позвонить</a>
      <a href="#booking" tabIndex={visible ? 0 : -1}>Забронировать</a>
    </div>
  );
}
