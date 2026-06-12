"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import api from "@/lib/api";
import { storeAuthResponse } from "@/lib/auth";
import { PageLoader } from '@/components/ui/GlobalLoader';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user?.email) {
          // Sync with our backend to get our custom JWT
          const res = await api.post("/auth/google", {
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email.split("@")[0],
          });
          
          if (isMounted) {
            storeAuthResponse(res.data);
            router.push("/dashboard");
          }
        } else {
          if (isMounted) router.push("/login?error=auth_failed");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        if (isMounted) router.push("/login?error=auth_failed");
      }
    };
    
    // Supabase handles the hash parsing automatically in the background
    // wait for auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        handleCallback();
      }
    });

    handleCallback();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  return <PageLoader label="Securing your session…" />;
}
