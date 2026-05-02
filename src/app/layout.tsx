import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://simmagic.example.com"),
  title: {
    default: "SimMagic",
    template: "%s | SimMagic"
  },
  description: "Problem -> Magic -> Solution"
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
