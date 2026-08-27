type Review = {
  author: string;
  text: string;
  source?: string;
};

type ReviewsSectionProps = {
  reviews: readonly Review[];
};

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="section reviews-section" aria-labelledby="reviews-title">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Отзывы гостей</div>
            <h2 className="section-title" id="reviews-title">О Monaco</h2>
          </div>
        </div>
        <div className="reviews-grid">
          {reviews.slice(0, 5).map((review) => (
            <figure className="review" key={`${review.author}-${review.text}`}>
              <blockquote>{review.text}</blockquote>
              <figcaption>
                <span>{review.author}</span>
                {review.source ? <span className="review-source">{review.source}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
