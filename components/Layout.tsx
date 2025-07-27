// components/Layout.tsx
import Header from "./Header";
import { ReactNode } from "react";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-white z-2">{children}</main>
      <Footer />
    </div>
  );
}
