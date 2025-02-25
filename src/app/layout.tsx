import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import NextTopLoader from "nextjs-toploader";

import Providers from "./session-provider";
import { TRPCReactProvider } from "@/trpc/react";
import { auth } from "@/server/auth";
import { Toaster } from "sonner";
const spaceGrotesk = Space_Grotesk({
  display: "auto",
  subsets: ["vietnamese"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "Master Code",
  description: "Improve your coding skills with Master Code",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="vi">
      <head></head>
      <body className={`${spaceGrotesk.className} text-text bg-background`}>
        <Providers session={session}>
          <NextTopLoader />
          <NuqsAdapter>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </NuqsAdapter>
          <Toaster />
          {modal}
        </Providers>
      </body>
    </html>
  );
}
