'use client'

import { Input } from '@/components/ui/input'

export default function Hero() {
  return (
    <section className="w-full px-6 py-28 md:py-36 bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-zinc-900 text-center">
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
            className="w-3xl h-full text-base px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-400 dark:border-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-6">
          <p className="cursor-pointer hover:underline text-xl text-blue-600 font-bold">or see what's going on...</p>
        </div>
      </div>
    </section>
  )
}
