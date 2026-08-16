import { ForgotPasswordForm } from '@/modules/auth';
import { GalleryVerticalEnd } from 'lucide-react';
import React from 'react';

export default function ForgotPasswordPage() {
  return (
    <div className="grid h-screen overflow-hidden lg:grid-cols-2 bg-black text-white selection:bg-indigo-500/30">
      <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8 z-10 relative">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <GalleryVerticalEnd className="size-5" />
            </div>
             Avbodh AI
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
      
      {/* Right side: Vibrant Image Placeholder space */}
      <div className="relative hidden lg:block overflow-hidden bg-zinc-950 border-l border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-black pointer-events-none" />
        
        {/* Placeholder for actual image - User can replace src later */}
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-6 opacity-40">
           <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 blur-3xl animate-pulse" />
           <p className="text-zinc-500 text-sm tracking-widest uppercase font-semibold">Image Space Here</p>
        </div>
      </div>
    </div>
  )
}
