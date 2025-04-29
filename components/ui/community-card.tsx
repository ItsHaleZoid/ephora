'use client'

import Image from 'next/image'
import { Code } from 'lucide-react'

interface CommunityCardProps {
  community: {
    id: number
    name: string
    description: string
    imageUrl: string
    members: string
    price: string
    main_image: string
  }
  onClick?: () => void;
}

function CommunityCard({ community, onClick }: CommunityCardProps) {
  return (
    <div 
      onClick={onClick} 
      className="bg-gray-100 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-[6px_6px_0px_#000] border-black border-2 transition-transform duration-200 ease-in-out active:scale-95"
    >
      <div className="relative h-48 w-full">
        <Image
          src={community.main_image || '/default-community.jpg'} // fallback
          alt={community.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
            <Code className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-semibold">{community.name}</h3>
        </div>
        <p className="text-sm text-gray-700 dark:text-zinc-300 min-h-[48px]">
          {community.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-zinc-400 pt-1">
          {community.members} Members • 
          <span className="font-medium text-black ">{community.price}</span>
        </div>
      </div>
    </div>
  )
}

export default CommunityCard
