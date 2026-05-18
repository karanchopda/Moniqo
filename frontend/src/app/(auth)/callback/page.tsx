"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

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
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-accent" size={32} />
        <p className="text-gray-600 font-medium">Securing your session...</p>
      </div>
    </div>
  );
}
