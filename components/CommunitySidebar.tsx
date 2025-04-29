import { supabase } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import CompassNeedleIcon from './ui/compass-icon'
import ChatIcon from './ui/chat-icon'
import InformationIcon from './ui/information-icon'
import { ArrowLeft } from 'lucide-react'
import SettingIcon from './ui/settings-icon'
import BackButton from './BackButton';
import { ButtonArrow } from './ui/button-arrow'
import MegaphoneIcon from './ui/megaphone-icon'
import { useParams } from 'next/navigation'

interface Community {
    id: string;
    name: string;
    description: string;
    image_url: string;
    slug: string;
}

async function fetchCommunityBySlug(slug: string) {
    const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching community:', error);
        return null;
    }
    return data;
}

const CommunitySidebar = ({ onTabChange }: { onTabChange: (tab: string) => void }) => {
    const { slug } = useParams();
    const [community, setCommunity] = useState<Community | null>(null);
    const [activeTab, setActiveTab] = useState<string>('explore');

    useEffect(() => {
        if (slug) {
            fetchCommunityBySlug(slug as string).then(setCommunity);
        }
    }, [slug]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        onTabChange(tab);
    };

    const getButtonClass = (tab: string) => {
        return `transition-all duration-200 ease-in-out hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-[0px_0px_0px_#000] active:scale-80
                h-16 w-16 rounded-full mt-6 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_#001d2e]
                ${activeTab === tab ? 'bg-blue-500' : 'bg-white'}`;
      };
      
      const getIconClass = (tab: string) => {
        return `${activeTab === tab ? 'text-white' : 'text-black'}`;
      };
      

    return (
        <main>
            <div className="flex flex-col h-screen w-32 px-6 py-2 bg-gray-300 text-white border-r-3 border-l-0 border-t-0 border-b-0 border-white border-2 shadow-[8px_0px_0px_black]">
                {community ? (
                    <Image src={community.image_url} alt={community.name} width={70} height={70} className='rounded-full mt-12 border-2 border-white shadow-[4px_4px_0px_#001d2e]' />
                ) : (
                    <p>No community available</p>
                )}
                
                <button className={getButtonClass('explore')} onClick={() => handleTabChange('explore')}>
                  <CompassNeedleIcon className={`${getIconClass('explore')} size-15 mt-3`} />
                  </button>

                  <button className={getButtonClass('chat')} onClick={() => handleTabChange('chat')}>
                 <ChatIcon className={`${getIconClass('chat')} size-15 mt-3`} />
                 </button>

                 <button className={getButtonClass('learn')} onClick={() => handleTabChange('learn')}>
                 <InformationIcon className={`${getIconClass('learn')} size-5 mt-3`} />
                  </button>

                 <button className={getButtonClass('announce')} onClick={() => handleTabChange('announce')}>
                 <MegaphoneIcon className={`${getIconClass('announce')} size-15 mt-1`} />
                </button>


                <div className='mt-38'>
                <button className='bg-blue-500 transition-all duration-200 ease-in-out hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-[0px_0px_0px_#000] active:scale-80 h-16 w-16 rounded-full mt-6 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_#001d2e]'
                onClick={() => onTabChange('settings')}
                >
                    <SettingIcon className='text-black size-10 mt-3' />
                </button>
              

                    <div className='mt-10 -ml-1'>
                        <ButtonArrow className='bg-black w-18 h-12' onClick={() => window.history.back()}>
                            <ArrowLeft className='text-white size-8'/>
                        </ButtonArrow>
                    </div>
                    </div>
            </div>
        </main>
    );
};

export default CommunitySidebar;