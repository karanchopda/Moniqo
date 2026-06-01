"use client";

import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import EmeraldHero from '@/components/Landing/EmeraldHero';

export default function HomeClient() {
  const router = useRouter();

  const handleOpenAudit = () => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    router.push('/audit');
  };

  return <EmeraldHero onOpenAudit={handleOpenAudit} />;
}
