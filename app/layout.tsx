import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eat & Go Сысерть — Лучшая шаурма 24/7",
  description: "Фастфуд кафе в Сысерти. Шаурма, шашлык, хот-доги. Самовывоз. Рейтинг 4.8★. Работаем круглосуточно.",
  keywords: ["шаурма Сысерть", "фастфуд Сысерть", "Eat and Go", "доставка еды Сысерть"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-[#121212] text-white min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

