import './globals.css';
import AppProviders from '@/providers/AppProviders';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/layout/Preloader';

export const metadata = {
  title: {
    default: 'RIVALRY 90 | Next-Generation 3D Football Gaming Website',
    template: '%s | RIVALRY 90',
  },
  description:
    'RIVALRY 90 — Cinematic 3D football gaming universe built with Next.js, React Three Fiber, GSAP, and Motion.',
  icons: {
    icon: '/branding/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[#b8ff2c] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-[#0b0e11]"
        >
          Skip to main content
        </a>
        <AppProviders>
          <Preloader />
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
