'use client'

interface CommunityVideoProps {
  videoUrl: string;
  onLoadedData?: () => void;
}

export default function CommunityVideo({ videoUrl, onLoadedData }: CommunityVideoProps) {
  const getVideoType = () => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) return 'youtube'
    if (videoUrl.includes('loom.com')) return 'loom'
    return 'custom'
  }

  const renderPlayer = () => {
    const type = getVideoType()

    if (type === 'youtube') {
      const id = extractYouTubeId(videoUrl)
      return (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          allowFullScreen
          className="w-full h-full rounded-xl"
          onLoad={onLoadedData}
        ></iframe>
      )
    }

    if (type === 'loom') {
      const loomId = videoUrl.split('/').pop()
      return (
        <iframe
          src={`https://www.loom.com/embed/${loomId}`}
          allowFullScreen
          className="w-full h-full rounded-xl"
          onLoad={onLoadedData}
        ></iframe>
      )
    }

    return (
      <video
        src={videoUrl}
        controls
        autoPlay
        className="w-full h-full object-cover rounded-xl"
        onLoadedData={onLoadedData}
      />
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto aspect-video rounded-xl overflow-hidden shadow-lg">
      {renderPlayer()}
    </div>
  )
}

// Helper for extracting YouTube video ID
function extractYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com.*v=|youtu\.be\/)([^&]+)/)
  return match ? match[1] : ''
}
