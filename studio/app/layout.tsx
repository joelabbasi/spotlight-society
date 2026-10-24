import type { Metadata } from "next";
export const metadata: Metadata = { title: "Spotlight Society", description: "Marketing, videography, photography, and websites for brands." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
