import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://simmagic.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SimMagic",
    template: "%s | SimMagic"
  },
  description: "Problem -> Magic -> Solution. Open-source projects by sim007.",
  openGraph: {
    type: "website",
    siteName: "SimMagic",
    title: "SimMagic",
    description: "Problem -> Magic -> Solution",
    images: [{ url: "/uploads/simmagic-cover.svg", width: 1600, height: 900 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "SimMagic",
    description: "Problem -> Magic -> Solution"
  },
  icons: {
    icon: "/favicon.svg"
  },
  alternates: {
    languages: {
      nl: `${siteUrl}/nl`,
      en: `${siteUrl}/en`
    }
  }
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="nl" className="dark">
      <body>{children}</body>
    </html>
  );
}
