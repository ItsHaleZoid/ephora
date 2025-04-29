'use client'
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
export default function PathnameWarpper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHeaderHidden = pathname === '/feed' || pathname === '/community-page-test' || pathname.startsWith('/community/hub/') || pathname === '/community/create';
  return (
    <div>
      {!isHeaderHidden && <Header />}
      {children}
    </div>
  );
}
