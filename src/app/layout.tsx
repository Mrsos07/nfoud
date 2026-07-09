import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { siteGraph } from "@/lib/schema";
import { getCategories } from "@/lib/categories";
import CategoryLabelsInit from "@/components/CategoryLabelsInit";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1a2332",
};

const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - نفود أول شبكة أخبار سعودية بالذكاء الاصطناعي`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["نفود", "أخبار السعودية", "أخبار سعودية", "ذكاء اصطناعي", "أخبار عربية", "سياسة", "اقتصاد", "رياضة", "أخبار عاجلة", "تغطية حية", "nfoud"],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    languages: {
      'ar-SA': SITE_URL,
    },
    types: {
      'application/rss+xml': `${SITE_URL}/rss.xml`,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      // Google & browsers: ico يظل الأفضل للـ SERP fallback
      { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' },
      // PNG fallback بحجم مناسب
      { url: '/favicon.png', type: 'image/png', sizes: '192x192' },
      // احتياطي: بعض المتصفحات/الأدوات تتوقع 32x32/16x16
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: { url: '/favicon.png', sizes: '512x512' },
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - نفود أول شبكة أخبار سعودية بالذكاء الاصطناعي`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Nfoud_ai",
    creator: "@Nfoud_ai",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://wqcikbeglxfptnaamnpj.supabase.co" />
        <link rel="dns-prefetch" href="https://wqcikbeglxfptnaamnpj.supabase.co" />

        {/* فافيكون صريح (حل جذري لتأكد Google من اكتشاف الأيقونة) */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />

        <meta name="msapplication-TileImage" content="/favicon.png" />
        <meta name="theme-color" content="#1a2332" />
      </head>
      <body className={`${cairo.variable} font-sans antialiased`} suppressHydrationWarning>
        <CategoryLabelsInit categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
        {children}
        <Toaster position="top-center" richColors />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph()) }}
        />
      </body>
    </html>
  );
}
