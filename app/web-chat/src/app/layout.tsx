import './global.css';
import { Toaster } from 'sonner';
import { SidebarProvider } from '@/components/ui/sidebar';

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
      <body className="font-sans" suppressHydrationWarning>
        <SidebarProvider defaultOpen>{children}</SidebarProvider>
        <Toaster position="top-center" duration={2000} richColors />
      </body>
    </html>
  );
}
