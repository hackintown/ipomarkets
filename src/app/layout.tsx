import { Inter, Jost, Poppins } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import MainLayoutWrapper from "@/components/admin/MainLayoutWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IPO Markets",
  description: "IPO Markets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <MainLayoutWrapper
        interClass={inter.variable}
        jostClass={jost.variable}
        poppinsClass={poppins.variable}
      >
        {children}
      </MainLayoutWrapper>
    </html>
  );
}