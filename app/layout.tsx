import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgriGuard AI • Plant Disease Detector",
  description:
    "Mobile-first AI plant disease detection and crop care. Instant leaf scan, disease diagnosis, organic remedies, and prevention.",
  applicationName: "AgriGuard AI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AgriGuard AI",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#203A19",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#1B2F17] text-[#1C2E17] antialiased selection:bg-[#5A8F46] selection:text-white">
        {children}
      </body>
    </html>
  );
}
