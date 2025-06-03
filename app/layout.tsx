import type React from "react";
import { Providers } from "@/provider/Provider";
import "./globals.css";

import { Inter, Merriweather } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-merriweather",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${merriweather.variable}`}
      suppressHydrationWarning // Add this as a temporary measure
    >
      <body className="font-sans">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
            enableSystem={false}
          >
            <div className="">
              {children}
              <Toaster position="top-right" expand={false} />
            </div>{" "}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
