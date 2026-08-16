const fs = require('fs');
const path = require('path');

const dir = 'a:/Projects/Avbodh/app/web-chat/src/app/auth';
const files = [
  'forgot-password/page.tsx',
  'login/page.tsx',
  'reset-password/page.tsx',
  'signup/page.tsx',
  'verify/page.tsx'
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace the grid container
  content = content.replace(
    'className="grid h-screen overflow-hidden lg:grid-cols-2 bg-[#111111] text-white selection:bg-indigo-500/30"',
    'className="grid min-h-screen lg:grid-cols-2 bg-[#111111] text-white selection:bg-indigo-500/30"'
  );

  // Replace the left container padding
  content = content.replace(
    'className="flex flex-col gap-4 p-4 md:p-6 lg:p-8 z-10 relative"',
    'className="flex flex-col p-6 md:p-10 lg:p-16 z-10 relative h-screen overflow-y-auto"'
  );

  // Replace the right side entirely using regex
  const rightSideRegex = /\{\/\* Right side: Vibrant Image Placeholder space \*\/\}[\s\S]*?<\/div>\s*<\/div>/;
  
  const newRightSide = \{/* Right side: Floating Image/Video Canvas */}
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
    </div>\;

  content = content.replace(rightSideRegex, newRightSide);
  fs.writeFileSync(filePath, content);
}
console.log('Updated layout of all 5 files!');
