import { useState } from 'react';
import { X, Volume2, VolumeX, Play, Maximize2 } from 'lucide-react';

interface AdBannerProps {
  type?: 'video' | 'image';
  videoUrl?: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function AdBanner({
  type = 'video',
  videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  imageUrl,
  title = 'Patrocinador Oficial',
  description = 'Conheça nossos parceiros e apoiadores',
  ctaText = 'Saiba Mais',
  ctaUrl = '#',
}: AdBannerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) return null;

  const handlePlayPause = (e: React.MouseEvent) => {
    const video = document.getElementById('ad-video') as HTMLVideoElement;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = document.getElementById('ad-video') as HTMLVideoElement;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = document.getElementById('ad-video') as HTMLVideoElement;
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] overflow-hidden group">
      {/* Close Button */}
      <button
        onClick={() => setIsClosed(true)}
        className="absolute top-4 right-4 z-20 w-8 h-8 bg-[var(--background)]/80 hover:bg-[var(--background)] backdrop-blur-sm border border-[var(--border)] rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4 text-[var(--foreground)]" />
      </button>

      {/* Ad Label */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border)] rounded-lg text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
          Anúncio
        </span>
      </div>

      {type === 'video' ? (
        <div className="relative aspect-[21/6]">
          {/* Video Element */}
          <video
            id="ad-video"
            className="w-full h-full object-cover"
            muted={isMuted}
            loop
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            Seu navegador não suporta vídeos.
          </video>

          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            {/* Play/Pause Button Center */}
            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg"
              >
                <Play className="w-8 h-8 text-black ml-1" />
              </button>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
                <p className="text-white/80 text-sm mb-3">{description}</p>
                <a
                  href={ctaUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-black rounded-lg text-sm font-semibold transition-all"
                >
                  {ctaText}
                </a>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {/* Mute/Unmute */}
                <button
                  onClick={handleMuteToggle}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all"
                >
                  <Maximize2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative aspect-[21/6]">
          {/* Image Banner */}
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">{title}</h3>
                <p className="text-[var(--muted-foreground)] mb-4">{description}</p>
              </div>
            </div>
          )}

          {/* CTA Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end justify-between p-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
              <p className="text-white/80 text-sm mb-3">{description}</p>
            </div>
            <a
              href={ctaUrl}
              className="px-5 py-2.5 bg-white hover:bg-gray-100 text-black rounded-lg text-sm font-semibold transition-all"
            >
              {ctaText}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
