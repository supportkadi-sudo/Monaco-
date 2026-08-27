import { beforeVisitFaq, site } from '@/lib/site';

export function BeforeVisitSection() {
  return (
    <section className="section before-visit-section" id="before-visit">
      <div className="container before-visit-layout">
        <div className="before-visit-intro">
          <div className="eyebrow">Полезно знать</div>
          <h2 className="section-title">Перед посещением</h2>
          <p className="section-lead">
            Короткие ответы только на то, что подтверждено Monaco. По остальным деталям лучше уточнить перед поездкой.
          </p>
          <a className="before-visit-contact" href={site.phoneHref}>Уточнить по телефону</a>
        </div>

        <div className="faq-list">
          {beforeVisitFaq.map((item, index) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
                <span>{item.question}</span>
                <span className="faq-plus" aria-hidden="true">+</span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
