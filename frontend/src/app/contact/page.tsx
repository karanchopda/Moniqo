"use client";

import LandingNav from '@/components/Landing/LandingNav';
import LandingFooter from '@/components/Landing/LandingFooter';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen font-body text-primary overflow-x-hidden">
      <LandingNav />
      
      <main className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h1 className="text-6xl md:text-8xl font-headline font-black text-primary mb-8 tracking-tighter leading-tight">
              Direct <span className="text-accent italic">Support</span>
            </h1>
            <p className="text-muted text-xl mb-12 leading-relaxed font-medium">
              Have questions about our neural wealth protocols? Reach out to the Moniqo command center.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                  <span className="material-symbols-outlined text-3xl">call</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-1">Direct Line</p>
                  <p className="text-2xl font-headline font-black text-primary">+91 81283 79660</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                  <span className="material-symbols-outlined text-3xl">mail</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-1">Electronic Mail</p>
                  <p className="text-2xl font-headline font-black text-primary">support@moniqo.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                  <span className="material-symbols-outlined text-3xl">location_on</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-1">Headquarters</p>
                  <p className="text-2xl font-headline font-black text-primary">Bangalore, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/[0.02] border border-primary/5 rounded-2xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <h3 className="text-3xl font-headline font-black text-primary mb-10 tracking-tight">Initiate Inquiry</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 ml-4">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-white border border-primary/5 rounded-full px-8 py-5 outline-none focus:border-accent transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 ml-4">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-white border border-primary/5 rounded-full px-8 py-5 outline-none focus:border-accent transition-colors" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 ml-4">Message Protocol</label>
                <textarea rows={5} placeholder="Describe your inquiry..." className="w-full bg-white border border-primary/5 rounded-xl px-8 py-6 outline-none focus:border-accent transition-colors resize-none"></textarea>
              </div>

              <button className="btn btn-primary w-full py-6 text-base shadow-xl rounded-full">
                Transmit Message
                <span className="material-symbols-outlined ml-2">send</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
