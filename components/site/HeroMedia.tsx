import Image from 'next/image';

type HeroMediaProps = {
  image: string;
  videoMp4?: string;
  videoWebm?: string;
};

export function HeroMedia({ image, videoMp4, videoWebm }: HeroMediaProps) {
  if (videoMp4 || videoWebm) {
    return (
      <div className="hero-media" aria-hidden="true">
        <video autoPlay muted loop playsInline poster={image} preload="metadata">
          {videoWebm ? <source src={videoWebm} type="video/webm" /> : null}
          {videoMp4 ? <source src={videoMp4} type="video/mp4" /> : null}
        </video>
      </div>
    );
  }

  return (
    <div className="hero-media" aria-hidden="true">
      <Image src={image} alt="" fill priority sizes="100vw" />
    </div>
  );
}
