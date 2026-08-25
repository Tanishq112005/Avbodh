import './global.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { SidebarProvider } from '@/components/ui/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Acme Web Chat',
  description: 'A fast and beautiful web chat application.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className} suppressHydrationWarning>
        <SidebarProvider defaultOpen>{children}</SidebarProvider>
        <Toaster position="top-center" duration={2000} richColors />
      </body>
    </html>
  );
}
