import { ResetPasswordForm } from '@/modules/auth';
import { GalleryVerticalEnd } from 'lucide-react';
import React from 'react';

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-[#111111] text-white selection:bg-indigo-500/30">
      <div className="flex flex-col p-6 md:p-10 lg:p-16 z-10 relative h-screen overflow-y-auto">
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
            <ResetPasswordForm />
          </div>
        </div>
      </div>
      
      {/* Right side: Floating Image/Video Canvas */}
      <div className="relative hidden lg:flex items-center justify-center p-6 lg:p-8 xl:p-10 h-screen">
        <div className="relative w-full h-full overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-black pointer-events-none" />
          
          {/* Placeholder for actual image/video - User can replace src later */}
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-6 opacity-50">
             <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 blur-3xl animate-pulse" />
             <p className="text-zinc-500 text-sm tracking-widest uppercase font-semibold">Image / Video Space</p>
          </div>
        </div>
      </div>
    </div>
  )
}
