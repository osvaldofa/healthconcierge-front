import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health Concierge",
  description: "Seu assistente de saúde pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
