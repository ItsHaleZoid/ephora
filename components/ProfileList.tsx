import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Profile {
  id: string;
  username: string;
  image: string | null;
  description: string;
}

interface ProfileListProps {
  className?: string;
}

const ProfileList: React.FC<ProfileListProps> = ({ className }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        console.error('Error fetching profiles:', error);
      } else {
        setProfiles(data);
      }
    };
    fetchProfiles();
  }, []);

  return (
    <div className={`w-80 p-4 -mb-6 ${className}`}>
      {profiles.map((profile) => (
        <div key={profile.id} className='flex items-center bg-gray-300 rounded-3xl p-4 shadow-[4px_4px_0px_#001d2e]'>
          {profile.image && (
            <Image src={profile.image} alt={profile.username} width={60} height={100} className='rounded-full mr-4 ml-4' />
          )}
          <div className='flex flex-col -mb-4'>
            <h2 className='text-center flex-1 text-xl mr-20 -mt-6'>{profile.username}</h2>
            <p className='text-left flex-1 text-sm mr-20 opacity-65'>This text for Test!</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileList;