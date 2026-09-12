import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter, Patrick_Hand_SC } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});
const hand = Patrick_Hand_SC({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-hand',
  display: 'swap',
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.className} ${hand.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
