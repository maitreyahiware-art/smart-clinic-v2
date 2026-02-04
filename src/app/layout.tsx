import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { SpecialtyProvider } from '@/context/SpecialtyContext';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Smart Clinic Dashboard',
  description: 'Operational Nervous System for High-Volume Clinics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${inter.variable}`}>
        <ThemeProvider>
          <SpecialtyProvider>
            {children}
          </SpecialtyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
