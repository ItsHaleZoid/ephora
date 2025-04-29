'use client'

import { useState } from 'react';

const FAQ = () => {
  const faqItems = [
    {
      question: "Is Ephora free to use?",
      answer: "Yes! Our experience is free forever. You can join communities, post, and explore without paying."
    },
    {
      question: "Who is Ephora for?",
      answer: "Ephora is for curious minds — teens, students, builders, creators, or anyone who wants to explore ideas and grow through deep conversation."
    },
    {
      question: "Can I create my own community?",
      answer: "Absolutely. You can create a community around any topic you’re passionate about — and invite others to join."
    },
    {
      question: "What makes Ephora different from others?",
      answer: "Unlike noisy platforms, Ephora is designed to encourage signal over noise — a space for focused, thoughtful exchange of ideas, not endless scroll."
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 ">Frequently Asked Questions</h2>

        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <details key={index} className="group rounded-md p-4 shadow-[6px_6px_0px_#000000] border-black border-3">
              <summary className="cursor-pointer text-lg font-medium text-black dark:text-white flex justify-between items-center">
                {item.question}
                <span className="ml-2 transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-2 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out transform -translate-x-full group-open:translate-x-0 overflow-hidden max-h-0 group-open:max-h-96">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ;