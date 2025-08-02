import type { Metadata } from "next";
import MultiStepSignup from "@/assets/components/MultiStepSignup";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/assets/components/SidebarContext";
import { ChatSidebarProvider } from "@/assets/components/chats/chatSiderbarContext";
import { ThemeProvider } from "next-themes";
import Kbar from "../assets/components/kbar";
import ContextProvider from "../context";
import { headers } from "next/headers"; // Import headers for server-side cookie access
import SignupVisibility from "@/assets/components/SignupVisibility";
import { ShowSignupProvider } from "@/context/showSignupContext"; // Import ShowSignupProvider
import { SearchProvider } from "@/assets/components/SearchContext"; // Import SearchProvider
import { SignupProvider } from "@/context/SignupContext";
import "./globals.css";
// import ChatPage from "../assets/components/chatPage"; // Assuming ChatPage is not globally needed here
import KbarBlurWrapper from "@/assets/components/KbarBlurWrapper"; // Import the new wrapper
import MultiStepSignupWrapper from "@/assets/components/MultiStepSignupWrapper"; // Import wrapped version
import MultiStepBlurWrapper from "@/assets/components/MultiStepBlurWrapper";
// Removed direct font constant declarations as GeistSans and GeistMono handle this
import SmoothScroll from "./SmoothScroll";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Make sure this path is correct for your global CSS file
import {
  barlow,
  dancingScript,
  facultyGlyphic,
  inter,
  kanit,
  lato,
  montserrat,
  parkinsans,
  poppins,
  raleway,
  robotoCondensed,
  roboto,
  spaceGrotesk,
  marcellus,
} from "./../lib/fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "openwave",
  description: "Get money through open source",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get cookies for Reown AppKit - properly await headers()
  const headersList = await headers();
  const cookies = headersList?.get("cookie") || "";
  const pathname = headersList?.get("x-pathname") || "";
  return (
    <html lang="en" className={`dark`}>
      <body
        className={`bg-background text-foreground ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <SessionProvider>
              <SearchProvider>
                <SignupProvider>
                  <ChatSidebarProvider>
                    <Kbar />
                    <ContextProvider cookies={cookies}>
                      <SignupVisibility />

                      <KbarBlurWrapper>{children}</KbarBlurWrapper>
                    </ContextProvider>
                  </ChatSidebarProvider>
                </SignupProvider>
              </SearchProvider>
            </SessionProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
