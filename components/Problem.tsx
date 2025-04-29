'use client'

import { HelpCircle, MessageSquareX, Users } from 'lucide-react'

export default function Problem() {
  return (
    <section className="w-full py-24 border-y border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12">
          Why Most Learners Struggle
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          {/* 1: Lost */}
          <div className="flex flex-col items-center text-center">
            <HelpCircle className="w-10 h-10 text-red-500 mb-4" />
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              I want to learn… but I don’t know where to start.
            </p>
          </div>

          {/* 2: Ignored */}
          <div className="flex flex-col items-center text-center">
            <MessageSquareX className="w-10 h-10 text-yellow-500 mb-4" />
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              I ask questions online… and no one really helps.
            </p>
          </div>

          {/* 3: Alone */}
          <div className="flex flex-col items-center text-center">
            <Users className="w-10 h-10 text-blue-500 mb-4" />
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              I feel like the only one who actually wants to go deep.
            </p>
          </div>
        </div>

        <p className="mt-16 text-lg font-semibold text-black dark:text-white">
          Ephora is where curious minds finally find each other.
        </p>
      </div>
    </section>
  )
}
