'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const excludedPaths = ['/community-builder', '/community-page-test', '/feed', '/community/hub/[slug]/page', '/community/create']

  const shouldShowHeader = !excludedPaths.some(path => pathname.startsWith(path))
  const shouldShowFooter = !excludedPaths.some(path => pathname.startsWith(path))

  return (
    <>
      {shouldShowHeader && <Header />}
      {children}
      {shouldShowFooter && <Footer />}
    </>
  )
}

export default LayoutWrapper;
