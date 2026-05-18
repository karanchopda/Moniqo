"use client";
import LandingNav from '@/components/Landing/LandingNav';
import LandingFooter from '@/components/Landing/LandingFooter';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen font-body text-primary overflow-x-hidden">
      <LandingNav />
      
      <main className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 tracking-tight leading-tight">
              Get in <span className="text-accent italic">Touch</span>
            </h1>
            <p className="text-muted text-lg mb-10 leading-relaxed font-medium">
              Have questions about Moniqo's wealth analysis tools? Reach out to our customer support team.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                  <span className="material-symbols-outlined text-2xl">call</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary/40 mb-1">Phone</p>
                  <p className="text-xl font-headline font-bold text-primary">+91 81283 79660</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary/40 mb-1">Email</p>
                  <p className="text-xl font-headline font-bold text-primary">support@moniqo.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary/40 mb-1">Headquarters</p>
                  <p className="text-xl font-headline font-bold text-primary">Bangalore, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/[0.02] border border-primary/5 rounded-2xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <h3 className="text-2xl font-headline font-bold text-primary mb-8 tracking-tight">Send a Message</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-primary/40 ml-4">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-white border border-primary/5 rounded-full px-6 py-4 outline-none focus:border-accent transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-primary/40 ml-4">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-white border border-primary/5 rounded-full px-6 py-4 outline-none focus:border-accent transition-colors" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-primary/40 ml-4">Message</label>
                <textarea rows={4} placeholder="Describe your inquiry..." className="w-full bg-white border border-primary/5 rounded-xl px-6 py-4 outline-none focus:border-accent transition-colors resize-none"></textarea>
              </div>

              <button className="btn btn-primary w-full py-4 text-sm shadow-xl rounded-full font-semibold">
                Submit Message
                <span className="material-symbols-outlined ml-2 text-lg">send</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
