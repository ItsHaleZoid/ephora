'use client'

const FAQ = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <details className="group border rounded-md p-4">
            <summary className="cursor-pointer text-lg font-medium text-black dark:text-white flex justify-between items-center">
              Is Ephora free to use?
              <span className="ml-2 transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Yes! The core experience is free forever. You can join communities, post, and explore without paying. Premium perks are optional.
            </p>
          </details>

          <details className="group border rounded-md p-4">
            <summary className="cursor-pointer text-lg font-medium text-black dark:text-white flex justify-between items-center">
              Who is Ephora for?
              <span className="ml-2 transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Ephora is for curious minds — teens, students, builders, creators, or anyone who wants to explore ideas and grow through deep conversation.
            </p>
          </details>

          <details className="group border rounded-md p-4">
            <summary className="cursor-pointer text-lg font-medium text-black dark:text-white flex justify-between items-center">
              Can I create my own community?
              <span className="ml-2 transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Absolutely. You can create a community around any topic you’re passionate about — and invite others to join.
            </p>
          </details>

          <details className="group border rounded-md p-4">
            <summary className="cursor-pointer text-lg font-medium text-black dark:text-white flex justify-between items-center">
              What makes Ephora different from Discord or Reddit?
              <span className="ml-2 transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Unlike noisy platforms, Ephora is designed to encourage signal over noise — a space for focused, thoughtful exchange of ideas, not endless scroll.
            </p>
          </details>
        </div>
      </div>
    </section>
  )
}

export default FAQ;
  