

import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="w-full px-6 py-28 md:py-36 text-center bg-gradient-to-b from-white/50 to-transparent dark:from-zinc-800/50 dark:to-transparent">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          Learn <span className="text-blue-600">Anything</span>,<br />
          With <span className="text-blue-600">Anyone</span>, From Anywhere.
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mb-8">
          Ephora is your global learning network. Join communities, spark deep conversations, and grow together.
        </p>

        <div className="w-4xl h-14 flex justify-center items-center">
          <Input
            type="text"
            placeholder="Search topics, communities, or questions..."
            className="w-3xl h-full text-base px-4 py-3 bg-white dark:bg-zinc-800 shadow-[6px_6px_0px_#000000] border-black border-3 dark:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-6">
          <Link href="/feed" className="cursor-pointer hover:underline text-xl text-blue-600 font-bold">or see what&apos;s going on...</Link>
        </div>
      </div>
    </section>
  )
}
