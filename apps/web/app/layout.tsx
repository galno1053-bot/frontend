import "./globals.css";
import { Space_Grotesk, Bebas_Neue } from "next/font/google";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });

export const metadata = {
  title: "Galno Crash",
  description: "Galno Crash Game"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${space.variable} ${bebas.variable} bg-ink text-bone`}>{children}</body>
    </html>
  );
}
