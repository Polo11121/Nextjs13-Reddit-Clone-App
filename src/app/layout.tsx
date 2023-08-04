import { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/Toaster";
import { Navbar } from "@/components/Navbar";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

export const metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({
  children,
  authModal,
}: {
  children: ReactNode;
  authModal: ReactNode;
}) => (
  <html
    lang="en"
    className={cn(inter.className, "bg-white text-slate-900 antialiased light")}
  >
    <body className="min-h-screen pt-12 bg-slate-50 antialiased">
      <Providers>
        {/* @ts-expect-error server component */}
        <Navbar />
        {authModal}
        <div className="container max-w-7xl mx-auto h-fill pt-12">
          {children}
        </div>
        <Toaster />
      </Providers>
    </body>
  </html>
);

export default RootLayout;
