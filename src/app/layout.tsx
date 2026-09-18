import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { IMAGE_FALLBACK_SCRIPT } from "@/lib/image";

export const metadata: Metadata = {
  title: "Frame — A little structure. A lot of possibility.",
  description: "Your film, from the first word to the final frame. Write screenplays, plan storyboards, and bring every shot into focus in one thoughtful filmmaking workspace.",
  applicationName: "Frame",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><head><script dangerouslySetInnerHTML={{ __html: IMAGE_FALLBACK_SCRIPT }} /></head><body>{children}</body></html>;
}
