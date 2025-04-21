'use client'

import { Globe, MessageCircle, Brain } from 'lucide-react'

const features = [
  {
    icon: Globe,
    title: 'Global Learning Communities',
    description: 'Join focused groups where people explore topics like science, philosophy, business, tech, and more — from all over the world.'
  },
  {
    icon: MessageCircle,
    title: 'Meaningful Discussions',
    description: 'Skip the noise. Posts and replies are built for thoughtful conversation — not short attention spans.'
  },
  {
    icon: Brain,
    title: 'Grow by Sharing',
    description: 'Teaching others is the fastest way to learn. Ephora helps you contribute, reflect, and grow with community support.'
  }
]

export default function FeaturesSection () {
  return (
    <section className="py-20 bg-gray-100 dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-10">
          What Makes <span className="text-blue-600">Ephora</span> Special?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow hover:shadow-lg transition-all duration-300"
            >
              <feature.icon className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
