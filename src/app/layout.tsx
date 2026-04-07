import type { Metadata } from "next";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { AppProvider } from "@/providers/app-provider";
import "@/lib/icons/fa";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SnapHanoi Admin",
    template: "%s | SnapHanoi Admin",
  },
  description:
    "Foundation for the SnapHanoi admin experience, built for a premium visual service workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
