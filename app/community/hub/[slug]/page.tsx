'use client'; // If you are in Next.js app directory

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import CommunitySidebar from '@/components/CommunitySidebar';
import CommunityHubAnnounce from '@/components/CommunityHubAnnounce';
import CommunityHubChat from '@/components/CommunityHubChat';
import CommunityHubLearn from '@/components/CommunityHubLearn';
import CommunityHubExplore from '@/components/CommunityHubExplore';

const CommunityChatPage = () => {
    const { slug } = useParams();
    const router = useRouter();
    const [community, setCommunity] = useState<any>(null);
    const [isMember, setIsMember] = useState<boolean | null>(null);

    // ✅ Move this here BEFORE any return!
    const [selectedTab, setSelectedTab] = useState<string>('explore');

    useEffect(() => {
      const fetchCommunity = async () => {
        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Failed to fetch community:', error.message);
        } else {
          setCommunity(data);
        }
      };

      if (slug) {
        fetchCommunity();
      }
    }, [slug]);

    const checkMembership = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && community) {
        const { data, error } = await supabase
          .from('community_members')
          .select('*')
          .eq('community_id', community.id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Failed to verify membership:', error.message);
        } else {
          setIsMember(data.length > 0);
        }
      }
    };

    useEffect(() => {
      if (community !== null) {
        checkMembership();
      }
    }, [community]);

    useEffect(() => {
      if (community && isMember === false) {
        router.push(`/community/${community.slug}`);
      }
    }, [community, isMember, router]);

    // ❌ Moved AFTER the hook
    if (!community || isMember === null) return <div>Loading...</div>;

    return (
      <main className='flex flex-col md:flex-row'>
        <div className="flex flex-col md:flex-row">
          <CommunitySidebar onTabChange={setSelectedTab} />
        </div>

        {selectedTab === 'explore' && (
          <CommunityHubExplore communityId={community.id} />
        )}
        {selectedTab === 'learn' && (
          <CommunityHubLearn communityId={community.id} />
        )}
        {selectedTab === 'chat' && (
          <CommunityHubChat communityId={community.id} />
        )}
        {selectedTab === 'announce' && (
          <CommunityHubAnnounce communityId={community.id} />
        )}
      </main>
    );
  };

export default CommunityChatPage;
