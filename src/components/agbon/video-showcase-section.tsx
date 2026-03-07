'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, X } from 'lucide-react'

interface Video {
  id: string
  title: string
  description?: string
  thumbnail: string
  youtubeUrl?: string
  videoUrl?: string
  duration?: string
}

const defaultVideos: Video[] = [
  {
    id: '1',
    title: 'AGBON Tractors in Action',
    description: 'See our powerful tractors transforming African agriculture',
    thumbnail: '/images/section/hand_tractor.png',
    youtubeUrl: 'https://www.youtube.com/watch?v=MLpWrANjFbI',
    duration: '3:24',
  },
  {
    id: '2',
    title: 'Harvesting Made Easy',
    description: 'Modern harvesting equipment for maximum efficiency',
    thumbnail: '/images/section/home_2.png',
    youtubeUrl: 'https://www.youtube.com/watch?v=MLpWrANjFbI',
    duration: '2:15',
  },
  {
    id: '3',
    title: 'Customer Success Stories',
    description: 'Hear from our satisfied customers across Africa',
    thumbnail: '/images/section/wood.png',
    youtubeUrl: 'https://www.youtube.com/watch?v=MLpWrANjFbI',
    duration: '5:42',
  },
]

interface VideoShowcaseSectionProps {
  videos?: Video[]
  title?: string
  subtitle?: string
  featuredVideo?: Video
}

function getYouTubeEmbedUrl(url: string) {
  const id = url.split('v=')[1]?.split('&')[0]
  return `https://www.youtube.com/embed/${id}?autoplay=1`
}

export function AgbonVideoShowcaseSection({
  videos = defaultVideos,
  title = 'See Our Equipment in Action',
  subtitle = 'Watch how AGBON machinery is revolutionizing agriculture across Africa',
  featuredVideo,
}: VideoShowcaseSectionProps) {
  const [selected, setSelected] = useState<Video | null>(null)
  const featured = featuredVideo || videos[0]

  return (
    <>
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-[#1a1a1a] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">{subtitle}</p>
          </div>

          {/* Featured video */}
          {featured && (
            <div className="mb-8 md:mb-12">
              <div
                className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer shadow-2xl"
                onClick={() => setSelected(featured)}
              >
                <Image src={featured.thumbnail} alt={featured.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#FF6B35] flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                    <Play size={32} className="text-white ml-1" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{featured.title}</h3>
                  {featured.description && <p className="text-gray-200 text-sm md:text-base">{featured.description}</p>}
                </div>
                {featured.duration && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 rounded-lg text-sm font-semibold backdrop-blur-sm">
                    {featured.duration}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Grid */}
          {videos.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.slice(1).map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelected(video)}
                  className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <Image src={video.thumbnail} alt={video.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#FF6B35]/90 flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                      <Play size={20} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <h4 className="text-white font-semibold text-sm line-clamp-2">{video.title}</h4>
                  </div>
                  {video.duration && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-xs font-semibold backdrop-blur-sm">{video.duration}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A24] text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
              Watch More Videos
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
              aria-label="Close video"
            >
              <X size={24} className="text-white" />
            </button>
            {selected.youtubeUrl ? (
              <iframe
                src={getYouTubeEmbedUrl(selected.youtubeUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={selected.videoUrl} controls autoPlay className="w-full h-full" />
            )}
          </div>
        </div>
      )}
    </>
  )
}
