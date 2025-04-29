'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ButtonArrow } from '@/components/ui/button-arrow'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import ButtonShadow from '@/components/ui/button-shadow'

interface Community {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  main_image: string;
  testimonial: string;
  faq: string;
  video_url: string;
  show_faq: boolean;
  show_testimonial: boolean;
}

export default function CommunityBuilderPage() {
  const { id } = useParams()
  const [community, setCommunity] = useState<any>(null)
  const [editing, setEditing] = useState(true)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  useEffect(() => {
    const fetchCommunity = async () => {
      const { data } = await supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .single()

      setCommunity(data)
    }

    fetchCommunity()
  }, [id])

  const handleCreate = async () => {
    const newErrors: { [key: string]: string } = {}
    if (!community?.name) newErrors.name = 'Community name is required.'
    if (!community?.description) newErrors.description = 'Description is required.'
    if (!community?.price) newErrors.price = 'Price is required.'
    if (!community?.image_url) newErrors.image_url = 'Icon is required.'
    if (!community?.main_image) newErrors.main_image = 'Banner Image is required.'

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => setErrors({}), 2000)
      return
    }

    // Upload files to Supabase storage
    const uploadFile = async (file: File, path: string) => {
      const { error: uploadError } = await supabase.storage
        .from('communities')
        .upload(path, file, { upsert: true })

      if (uploadError) {
        console.error(`Failed to upload ${file.name}:`, uploadError.message)
        return null
      }

      const { data: urlData } = supabase.storage
        .from('communities')
        .getPublicUrl(path)

      return urlData.publicUrl
    }

    const iconFile = (document.querySelector('input[type="file"][placeholder="Image URL"]') as HTMLInputElement)?.files?.[0]
    const bannerFile = (document.querySelector('input[type="file"][placeholder="Upload Main Image"]') as HTMLInputElement)?.files?.[0]

    if (iconFile) {
      const iconUrl = await uploadFile(iconFile, `communities/${id}/icon-${iconFile.name}`)
      if (iconUrl) community.image_url = iconUrl
    }

    if (bannerFile) {
      const bannerUrl = await uploadFile(bannerFile, `communities/${id}/banner-${bannerFile.name}`)
      if (bannerUrl) community.main_image = bannerUrl
    }

    const { data, error } = await supabase.from('communities').insert({
      name: community.name,
      description: community.description,
      price: community.price,
      image_url: community.image_url,
      main_image: community.main_image,
      testimonial: community.testimonial,
      faq: community.faq,
      video_url: community.video_url,
      show_faq: community.show_faq,
    }).single()

    if (error) {
      console.error('Error creating community:', error)
      return
    }

    const communityData = data as Community

    router.push(`/community/${communityData.id}`)
  }

  return (
    <div className="max-w-3xl mx-auto py-20 space-y-6 justify-center items-center mt-23 ">
      {editing ? (
        <>
          <h1 className='text-6xl font-extrabold text-center -mt-15'>Create A Community</h1>
          <Input className='bg-white rounded-xl p-6 shadow-[6px_6px_0px_#000] border-2 border-black'
            placeholder="Community name"
            value={community?.name || ''}
            onChange={(e) =>
              setCommunity({ ...community, name: e.target.value })
            }
          />
          {errors.name && <p className="text-red-500 -mt-4">{errors.name}</p>}
          <Textarea className='bg-white rounded-xl p-6 shadow-[6px_6px_0px_#000] border-2 border-black' 
            placeholder="Description"
            value={community?.description || ''}
            onChange={(e) =>
              setCommunity({ ...community, description: e.target.value })
            }
          />
          {errors.description && <p className="text-red-500 -mt-4">{errors.description}</p>}
          <Input className='bg-white rounded-xl p-6 shadow-[6px_6px_0px_#000] border-2 border-black'
            placeholder="Price"
            value={community?.price || ''}
            onChange={(e) =>
              setCommunity({ ...community, price: e.target.value })
            }
          />
          {errors.price && <p className="text-red-500 -mt-4">{errors.price}</p>}
          <label className="text-gray-700 ml-2 mb-2">Icon</label>
          <Input 
            type='file'
            className='file:bg-gray-300 file:w-25 file:rounded-xl file:mt-2.5 bg-white rounded-xl h-15 file:items-center shadow-[6px_6px_0px_#000] border-2 border-black'
            placeholder="Image URL"
            value={community?.image_url || ''}
            onChange={(e) =>
              setCommunity({ ...community, image_url: e.target.value })
            }
          />
          {errors.image_url && <p className="text-red-500 -mt-4">{errors.image_url}</p>}
          <label className="text-gray-700 ml-2 mb-2">Banner Image</label>
          <Input 
            type='file'
            className='file:bg-gray-300 file:w-25 file:rounded-xl file:mt-2.5 bg-white rounded-xl h-15 file:items-center shadow-[6px_6px_0px_#000] border-2 border-black'
            placeholder="Upload Main Image"
            value={community?.main_image || ''}
            onChange={(e) =>
              setCommunity({ ...community, main_image: e.target.value })
            }
          />
          {errors.main_image && <p className="text-red-500 -mt-4">{errors.main_image}</p>}
          <ButtonShadow color='bg-yellow-300' width='w-full' onClick={handleCreate}>Create</ButtonShadow>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold">{community?.name}</h1>
          <p className="text-lg text-gray-500">{community?.description}</p>
          <p className="text-blue-500 font-semibold">${community?.price}/mo</p>
          <ButtonArrow onClick={() => setEditing(true)}>Edit</ButtonArrow>
        </>
      )}
    </div>
  )
}
