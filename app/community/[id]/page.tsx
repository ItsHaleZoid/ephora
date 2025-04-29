'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ButtonArrow } from '@/components/ui/button-arrow'
import Image from 'next/image'
import { Switch } from '@/components/ui/switch'
import CommunityVideo from '@/components/CommunityPageVideo'
import ButtonShadow from '@/components/ui/button-shadow'
import Footer from '@/components/Footer'
import CommunityFeatures from '@/components/CommunityFeatures'
import TestimonialBadge from '@/components/TestimonialBadge'


interface Community {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image_url: string;
  price: number | string;
  main_image?: string;
  testimonial: string;
  faq: string;
  video_url: string;
  show_faq: boolean;
  show_testimonial: boolean;
  show_video: boolean;
  gallery_images: string[];
  user_id: string;
  members_count?: number;
}

function Accordion({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 py-2">
      <button
        className="w-full text-left font-medium text-gray-700 hover:text-gray-900 focus:outline-none flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={`${isOpen ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>Q. {question}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div 
        className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
        style={{ maxHeight: isOpen ? '1000px' : '0px' }}
      >
        <div className="pl-4 pt-2 pb-2 text-gray-600">A. {answer}</div>
      </div>
    </div>
  );
}

function renderGalleryImages(community: any) {
    return community.gallery_images.map((image: string, index: number) => (
      <Image
        key={index}
        src={image}
        alt={`Gallery Image ${index + 1}`}
        width={500}
        height={500}
        className="rounded-xl"
      />
    ));
}

export default function CommunityBuilderPage() {
  const { id } = useParams()
  const [community, setCommunity] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [faqPairs, setFaqPairs] = useState<{ question: string; answer: string }[]>([])
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ icon?: string, banner?: string }>({});
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const savedFileName = localStorage.getItem('fileName');
    if (savedFileName) {
      setFileName(savedFileName);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      localStorage.setItem('fileName', file.name);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'main_image') => {
    const files = e.target.files;
    if (!files || !files.length) return;
  
    const file = files[0];
    const path = `communities/${id}/${field}-${file.name}`;
  
    const { error: uploadError } = await supabase.storage
      .from('communities')
      .upload(path, file, { upsert: true });
  
    if (uploadError) {
      console.error(`Failed to upload ${file.name}:`, uploadError.message);
      return;
    }
  
    const { data: urlData } = supabase.storage
      .from('communities')
      .getPublicUrl(path);
  
    if (urlData?.publicUrl) {
      setCommunity((prev: any) => ({
        ...prev,
        [field]: urlData.publicUrl,
      }));
    }
  };
  

  useEffect(() => {
    const fetchCommunity = async () => {
      const { data } = await supabase
        .from('communities')
        .select('*')
        .eq('slug', id)
        .single()

      setCommunity(data)
      setIsLoading(false)
    }

    fetchCommunity()
  }, [id])

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
      console.log('Current User ID:', user?.id)
    }

    fetchUserId()
  }, [])

  useEffect(() => {
    if (community?.faq) {
      const parsedFaq = community.faq.split('\n').map((item: string) => {
        const [question, answer] = item.split('A.');
        // Add checks for question and answer before trimming
        if (question && answer) {
          return { question: question.replace('Q.', '').trim(), answer: answer.trim() };
        }
        return null; // Return null for invalid entries
      }).filter((item: { question: string; answer: string } | null): item is { question: string; answer: string } => item !== null); // Filter out null entries
      setFaqPairs(parsedFaq);
    }
  }, [community]);

  const addFaqPair = () => {
    setFaqPairs([...faqPairs, { question: '', answer: '' }]);
  };

  const updateFaqPair = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqPairs = [...faqPairs];
    updatedFaqPairs[index][field] = value;
    setFaqPairs(updatedFaqPairs);
  };

  const handleSave = async () => {
    if (!community || !userId) return;
    const faqString = faqPairs.map(pair => `Q.${pair.question}A.${pair.answer}`).join('\n');
    const { error } = await supabase.from('communities').update({
      ...community,
      faq: faqString,
      user_id: userId
    }).eq('id', id);

    if (error) {
      console.error('Error updating community:', error);
    } else {
      setEditing(false);
    }
  };

 

  return (
    <>
     
      <main className="mt-32 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-screen w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            {community?.image_url ? (
              <Image
                src={community.image_url}
                alt="Community Icon"
                width={100}
                height={100}
                className="rounded-2xl mb-4 w-25 h-25 shadow-[10px_10px_40px_rgba(0,0,0,0.6)]"
              />
            ) : (
              <div className="w-25 h-25 flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {editing ? (
              <div className="w-full space-y-6 bg-white p-10 rounded-xl border-black border-1">
                <Input className='bg-white shadow-[6px_6px_0px_#454545] border-black'
                  placeholder="Community name"
                  value={community?.name || ''}
                  onChange={(e) => setCommunity({ ...community, name: e.target.value })}
                />
                <Textarea className='bg-white resize-none shadow-[6px_6px_0px_#454545] border-black'
                  placeholder="Tagline"
                  value={community?.tagline || ''}
                  onChange={(e) => setCommunity({ ...community, tagline: e.target.value })}
                />
                <Textarea className='bg-white resize-none shadow-[6px_6px_0px_#454545] border-black'
                  placeholder="Description"
                  value={community?.description || ''}
                  onChange={(e) => setCommunity({ ...community, description: e.target.value })}
                />
                <Input className='bg-white shadow-[6px_6px_0px_#454545] h-15 border-black file:bg-gray-300 file:w-25 file:rounded-xl file:mt-2.5 file:items-center'
                  type="file"
                  onChange={(e) => handleImageUpload(e, 'image_url')}
                  placeholder={fileName || "Icon Image"}
                  
                />
                <Input className='bg-white shadow-[6px_6px_0px_#454545] border-black'
                  placeholder="Price"
                  value={community?.price || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setCommunity({ ...community, price: value });
                    }
                  }}
                />
                <Input className='bg-white shadow-[6px_6px_0px_#454545] h-15 border-black file:bg-gray-300 file:w-25 file:rounded-xl file:mt-2.5 file:items-center border-1'
                  placeholder={fileName || "Banner Image"}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'main_image')}
                  
                />
                <Textarea className='bg-white resize-none shadow-[6px_6px_0px_#454545] border-black'
                  placeholder="Testimonial"
                  value={community?.testimonial || ''}
                  onChange={(e) => setCommunity({ ...community, testimonial: e.target.value })}
                />
                {faqPairs.map((pair, index) => (
                  <div key={index} className="flex space-x-5">
                    <Input
                      className='bg-white shadow-[6px_6px_0px_#454545] border-black'
                      placeholder="Question"
                      value={pair.question}
                      onChange={(e) => updateFaqPair(index, 'question', e.target.value)}
                    />
                    <Textarea
                      className='bg-green-500 h-7 resize-none shadow-[6px_6px_0px_#454545] border-black text-white font'
                      placeholder="Answer"
                      value={pair.answer}
                      onChange={(e) => updateFaqPair(index, 'answer', e.target.value)}
                    />
                  </div>
                ))}
                <ButtonShadow color="bg-blue-500 text-white rounded-xl" onClick={addFaqPair}>Add Q&A</ButtonShadow>
                <Input className='bg-white shadow-[6px_6px_0px_#454545] border-black'
                  placeholder="Intro Video URL"
                  value={community?.video_url || ''}
                  onChange={(e) => setCommunity({ ...community, video_url: e.target.value })}
                />
                
                <div className="flex flex-col gap-2 bg-white p-10 rounded-xl w-max shadow-[6px_6px_0px_#454545] border-black border-1">
                  <label className="flex items-center gap-2 text-sm text-black font-bold">
                    <Switch className={`border-black ${community?.show_faq ? '' : 'shadow-[3px_3px_0px_#454545]'}`}
                      checked={community?.show_faq ?? false}
                      onCheckedChange={(value) => setCommunity((prev: any) => ({ ...prev, show_faq: value }))}
                    />
                    Show FAQ
                  </label>
                  <label className="flex items-center gap-2 text-sm text-black font-bold ">
                    <Switch
                      className={`border-black ${community?.show_testimonial ? '' : 'shadow-[3px_3px_0px_#454545]'}`}
                      checked={community?.show_testimonial ?? false}
                      onCheckedChange={(value) => setCommunity((prev: any) => ({ ...prev, show_testimonial: value }))}
                    />
                    Show Testimonial
                  </label>
                  <label className="flex items-center gap-2 text-sm text-black font-bold">
                    <Switch
                      className={`border-black ${community?.show_video ? '' : 'shadow-[3px_3px_0px_#454545]'}`}
                      checked={community?.show_video ?? false}
                      onCheckedChange={(value) => setCommunity((prev: any) => ({ ...prev, show_video: value }))}
                    />
                    Show Video
                  </label>
                </div>
                <ButtonShadow color="bg-orange-500 text-white rounded-xl" onClick={handleSave}>Save Changes</ButtonShadow>
              </div>
            ) : (
              <div className="mt-40 flex flex-col items-center justify-center text-center w-full">
                <div className="space-y-4 -mt-38">
                  <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">{community?.name}</h1>
                  <p className="text-2xl font-regular tracking-tight opacity-70 mt-4">{community?.description}</p>
                  
                  {community?.show_video && community.video_url && (
                    <div className="relative">
                      {!videoLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="loader"></div>
                        </div>
                      )}
                      <CommunityVideo videoUrl={community.video_url} onLoadedData={() => setVideoLoaded(true)} />
                    </div>
                  )}
                
                  
                  {community?.gallery_images && community?.gallery_images.length > 0 && (
                    <div className="grid grid-cols-4 gap-8 mt-10 ml-2">
                      {community.gallery_images.map((image: string, index: number) => (
                        <div key={index} className="relative w-42 h-40 rounded-xl p-6 shadow-[8px_8px_09px_rgba(0,0,0,0.2)] overflow-hidden">
                          <Image
                            src={image}
                            alt={`Gallery Image ${index + 1}`}
                            fill
                            className="rounded-xl object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className='mt-10 mb-4 w-full'>
                  <ButtonShadow size="lg" fontSize="text-2xl" fontWeight="font-bold" height="h-15 rounded-xl">Join The {community?.name}</ButtonShadow>
                </div>
                <div>
                  <p className="text-lg tracking-tight font-regular opacity-50 mb-20">
                    Only for {community?.price === '0' ? 'Free' : `$${community?.price}/month`}
                    {community?.price !== '0' && ' • Cancel anytime'}
                  </p>
                  <div className='flex justify-center items-center -mt-10 mb-10'>
                    <TestimonialBadge />
                  </div>
                  <div>
                    <CommunityFeatures />
                  </div>
                </div>
                {community?.show_testimonial && community?.testimonial && (
                  <div>
                    <div className="flex justify-center items-center gap-2 px-40 mr-5">
                      <Image src={community.image_url} alt="Testimonial" width={100} height={100} className="rounded-full mx-auto" />
                      <p className="text-2xl font-bold tracking-tight opacity-50">{community.name}</p> 
                    </div>
                    <blockquote className="text-lg italic text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mt-5">
                      “{community.testimonial}”
                    </blockquote>
                    <div className="flex  mt-3 mb-20 bg-gray-800 w-32 h-10 rounded-md justify-center items-center ml-60 p-4">
                      {[...Array(5)].map((_, index) => (
                        <svg key={index} className="w-6 h-6 flex justify-center items-center text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118l-3.39-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                )}
               
                <div>
                  <CommunityFeatures />
                </div>

                <div className='-mt-10 mb-4 w-full'>
                  <ButtonShadow size="lg" fontSize="text-2xl" fontWeight="font-bold" height="h-15 rounded-xl">Join The {community?.name}</ButtonShadow>
                </div>
                
                 

                {community?.show_faq && faqPairs.length > 0 && (
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-xl w-full px-10 flex flex-col text-left shadow-[10px_10px_0px_#000] border-black border-3 mt-10">
                    <h3 className="text-xl font-semibold mb-4 underline underline-offset-4">FAQ</h3>
                    {faqPairs.map((pair, index) => (
                      <Accordion 
                        key={index}
                        question={pair.question}
                        answer={pair.answer}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
      <div className='w-full mt-10 flex flex-col justify-center items-center gap-8'>
        <ButtonArrow className='w-80 h-15' onClick={() => setEditing(true)}>Edit</ButtonArrow>
        <Footer />
      </div>
    </>
  )
}