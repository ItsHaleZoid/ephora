'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button' // if you're using your Button component
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  color?: string;
  width?: string;
  height?: string;
}

export default function BackButton({ color = 'bg-primary-foreground/15', width = 'w-16', height = 'h-16' }: BackButtonProps) {
  const router = useRouter()

  return (
    <Button className={`group relative overflow-hidden ${color} ${width} ${height}`} onClick={() => router.back()}>
      <span className="w-20 translate-x-2 transition-opacity duration-500 group-hover:opacity-0">
        Back
      </span>
      <i className={`absolute inset-0 z-10 grid w-1/4 place-items-center transition-all duration-500 group-hover:w-full`}>
        <ArrowLeft
          className="opacity-60"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      </i>
    </Button>
  );
}
