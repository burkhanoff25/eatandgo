import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eat & Go Сысерть — Лучшая шаурма и сочный гриль 24/7",
  description: "Фастфуд кафе в Сысерти. Лучшая шаурма, сочный шашлык, хот-доги и комбо-наборы. Быстрый онлайн-заказ и самовывоз за 5 минут. Работаем круглосуточно!",
  keywords: [
    "шаурма Сысерть",
    "фастфуд Сысерть",
    "Eat and Go Сысерть",
    "доставка еды Сысерть",
    "гриль Сысерть",
    "шашлык Сысерть",
    "быстрое питание Сысерть",
    "кафе Сысерть",
    "заказать еду Сысерть"
  ],
  alternates: {
    canonical: "https://eatandgo.vercel.app",
  },
  openGraph: {
    title: "Eat & Go Сысерть — Лучшая шаурма и сочный гриль 24/7",
    description: "Фастфуд кафе в Сысерти. Лучшая шаурма, сочный шашлык, хот-доги и комбо-наборы. Быстрый онлайн-заказ и самовывоз за 5 минут.",
    url: "https://eatandgo.vercel.app",
    siteName: "Eat & Go Сысерть",
    images: [
      {
        url: "https://eatandgo.vercel.app/photo_2026.jpg",
        width: 800,
        height: 600,
        alt: "Eat & Go Сысерть",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eat & Go Сысерть — Лучшая шаурма и сочный гриль 24/7",
    description: "Фастфуд кафе в Сысерти. Лучшая шаурма, сочный шашлык, хот-доги и комбо-наборы.",
    images: ["https://eatandgo.vercel.app/photo_2026.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FastFoodRestaurant",
    "name": "Eat & Go Сысерть",
    "image": "https://eatandgo.vercel.app/photo_2026.jpg",
    "@id": "https://eatandgo.vercel.app",
    "url": "https://eatandgo.vercel.app",
    "telephone": "+79920156060",
    "priceRange": "$$",
    "menu": "https://eatandgo.vercel.app/#menu",
    "servesCuisine": "Fast Food, Shawarma, Kebab",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ул. Коммуны, 38",
      "addressLocality": "Сысерть",
      "addressRegion": "Свердловская область",
      "postalCode": "624020",
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 56.5035,
      "longitude": 60.8217
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "500"
    }
  };

  return (
    <html lang="ru" className="h-full antialiased animate-in fade-in duration-300">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body bg-[#121212] text-white min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

