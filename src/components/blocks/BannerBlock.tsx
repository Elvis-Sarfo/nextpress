interface BannerContent {
  heading?: string;
  subheading?: string;
  image?: string;
  mobile_image?: string;
  height?: string;
  background_type?: 'image' | 'video';
  video?: string;
  mobile_video?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  show_overlay?: boolean;
  overlay_opacity?: number;
  show_scroll_button?: boolean;
}

export function BannerBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as BannerContent;
  const height = c.height ?? '500px';
  const opacity = (c.overlay_opacity ?? 40) / 100;
  const isVideo = c.background_type === 'video';

  return (
    <div className="banner-block relative w-full overflow-hidden" style={{ height }}>
      {/* Background */}
      {isVideo && c.video ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={c.video}
          autoPlay={c.autoplay}
          loop={c.loop}
          muted={c.muted ?? true}
          playsInline
        />
      ) : c.image ? (
        <img
          src={c.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}

      {/* Overlay */}
      {c.show_overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 text-white">
        {c.heading && <h2 className="text-4xl font-bold mb-3">{c.heading}</h2>}
        {c.subheading && <p className="text-xl opacity-90">{c.subheading}</p>}
      </div>

      {/* Scroll button */}
      {c.show_scroll_button && (
        <button
          type="button"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white animate-bounce"
          aria-label="Scroll down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
