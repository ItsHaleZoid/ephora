'use client'

import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import Problem from "@/components/Problem";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUserId(data?.user?.id || null);
      }
    };
    checkUser();
  }, []);

  return (
    <main>
      <div>
        <Hero />
        {userId === null && (
          <>
            <FeaturesSection />
            <Problem />
            <FAQ />
          </>
        )}
        <Footer />
      </div>
    </main>
  );
}