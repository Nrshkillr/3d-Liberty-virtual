import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://libertyenterprises.online",
  ),
  title: {
    default: "Liberty Enterprises | Baby & Kids Wholesale Showroom, Chennai",
    template: "%s | Liberty Enterprises",
  },
  description:
    "Explore Liberty Enterprises' virtual 3D showroom in Sowcarpet, Chennai. Wholesale baby walkers, kids ride-ons, battery cars, swings, cradles, soft toys and gift sets.",
  applicationName: "Liberty Enterprises Virtual Showroom",
  keywords: [
    "Liberty Enterprises",
    "baby products wholesale Chennai",
    "kids toys wholesale Sowcarpet",
    "baby walkers wholesale",
    "baby swings Chennai",
    "virtual showroom",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Liberty Enterprises",
    title: "Liberty Enterprises | Virtual Baby & Kids Showroom",
    description:
      "Step inside our 3D showroom and explore wholesale baby and kids products from Sowcarpet, Chennai.",
    url: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#102A43",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-ink">{children}</body>
    </html>
  );
}
