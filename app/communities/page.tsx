'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import CommunityCard from '@/components/ui/community-card'
import { useRouter } from 'next/navigation'
import ButtonShadow from '@/components/ui/button-shadow'
import Link from 'next/link'

interface Community {
  id: string
  slug: string
  name: string
  image_url: string
  description: string
  members_count: number
  price: string
  main_image?: string
}

export default function CommunityPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser()
        const user = auth.user
        setUserId(user?.id ?? null)

        const { data: communities, error: communityError } = await supabase.from('communities').select('*')
        if (communityError) throw communityError

        const { data: memberships, error: memberError } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', user?.id)

        if (memberError) throw memberError

        setCommunities(communities ?? [])
        setJoinedCommunityIds(memberships?.map(m => m.community_id) ?? [])
      } catch (err) {
        console.error('Error fetching communities:', err)
      }
    }

    fetchCommunities()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-8 mt-6">
    
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-2 text-blue-500 w-5 h-5 " />
        <Input placeholder="Search communities..." className="pl-10 shadow-[6px_6px_0px_#454545] border-black border-2 bg-white" />
        <div className='mt-4'>
          <Link href='/community/create'>
            <ButtonShadow color='bg-blue-500' fontColor='text-sky-100' width='w-full'>Create Your Own Community</ButtonShadow>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {communities.map((community) => {
          const communityCardProps = {
            id: parseInt(community.id, 10),
            name: community.name,
            description: community.description,
            imageUrl: community.image_url,
            members: `${community.members_count ?? 0}`,
            price: community.price === '0' ? 'Free' : `$${community.price}/mo`,
            main_image: community.main_image ?? community.image_url
          };
          
          return (
            <CommunityCard
              onClick={() => router.push(`/community/${community.slug}`)}
              key={community.id}
              community={communityCardProps}
            />
          )
        })}
      </div>
    </div>
  )
}
