import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CHAINWATCH // NCRP-INTEL - Forensic Crypto Attribution',
  description:
    'Real-Time Identification of Fraud-Linked Cryptocurrency Exchanges from Victim-Reported Suspect Wallets (Smart India Hackathon)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#ede8de] text-[#21201d]">
        {children}
      </body>
    </html>
  );
}
