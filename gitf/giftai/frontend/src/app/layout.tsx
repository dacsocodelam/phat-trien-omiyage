import type { Metadata } from "next";
import { Inter, VT323, Press_Start_2P } from "next/font/google";
import "./globals.css";
import I18nProvider from "../components/I18nProvider";

const inter = Inter({ subsets: ["latin"] });
const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});
const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "PresentoAI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${inter.className} ${vt323.variable} ${pressStart2P.variable} bg-[#020617] min-h-screen`}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
