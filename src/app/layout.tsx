import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CapiLog Demo | Inteligência Logística",
  description: "Demonstração interativa de inteligência logística com dados fictícios.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
