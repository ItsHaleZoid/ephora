'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import MyPosts from '@/components/MyPosts'

interface Community {
  id: string
  name: string
  image_url: string
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        const { data: communitiesData } = await supabase
          .from('community_members')
          .select('community:communities (id, name, image_url)')
          .eq('user_id', user?.id)

        setCommunities(communitiesData?.map((m: any) => m.community) || [])
      } catch (error) {
        console.error('Error loading account data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccountData()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

      {/* Profile Info */}
      <div className="flex items-center gap-6">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/personas/svg?seed=${user?.email}`}
            alt="User avatar"
          />
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{user?.email}</h2>
          <p className="text-sm text-gray-500">
            Joined communities: {communities.length}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Communities</p>
            <p className="text-xl font-bold">{communities.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Community List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Communities</h3>
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : communities.length === 0 ? (
          <p className="text-sm text-gray-500">You're not in any communities yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {communities.map((community) => (
              <div
                key={community.id}
                className="rounded-lg overflow-hidden border bg-white dark:bg-zinc-900"
              >
                <img
                  src={community.image_url}
                  alt={community.name}
                  className="w-full h-24 object-cover"
                />
                <div className="p-2 text-sm font-medium text-center">
                  {community.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Posts */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Your Posts</h3>
        {user?.id ? (
          <MyPosts />
        ) : (
          <Skeleton className="h-20 w-full" />
        )}
      </div>
    </div>
  )
}
