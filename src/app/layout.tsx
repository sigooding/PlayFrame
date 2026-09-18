import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frame — A little structure. A lot of possibility.",
  description: "Your film, from the first word to the final frame. Write screenplays, plan storyboards, and bring every shot into focus in one thoughtful filmmaking workspace.",
  applicationName: "Frame",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  /**
   * No inline scripts and no browser-only values above the fold: server HTML and the first client
   * render must be identical. Missing images are healed after hydration instead (see lib/image.ts).
   */
  return <html lang="en"><body>{children}</body></html>;
}
