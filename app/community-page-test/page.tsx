'use client'
import CommunitySidebar from '@/components/CommunitySidebar'
import ProfileList from '@/components/ProfileList'
import CommunityHub from '@/components/CommunityHubChat'

export default function CommunityPage() {
  return (
    <main className='flex flex-col md:flex-row'>
      <div className="flex flex-col md:flex-row">
        <CommunitySidebar />
        <div className="flex flex-col mt-0 ml-0">
          {[...Array(8)].map((_, index) => (
            <ProfileList key={index} className={`animate-pop-in`} />
          ))}
        </div>
      </div>
      <CommunityHub communityId={community.id} />
    </main>
  )
}