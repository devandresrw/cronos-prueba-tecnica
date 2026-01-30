import Header from '@/components/utils/Header'
import WrapperSite from '@/components/utils/Wrapper'
import { Plus_Jakarta_Sans } from 'next/font/google'
import "./globals.css";
import SessionProvider from '@/components/providers/SessionProvider';

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SessionProvider>
          <WrapperSite>
            <Header/>
            {children}
          </WrapperSite>
        </SessionProvider>
      </body>
    </html>
  );
}