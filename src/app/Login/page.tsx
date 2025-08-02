"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import ShootingStarBorder from "@/components/border";
import { Icon } from "@iconify/react";
import { useAccount } from "wagmi";
import { SignInPage } from "@/components/sign-in-flow-1";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { ThemeProvider } from "@/components/End/ThemeChangeContext";
import { useRouter } from "next/navigation";
interface User {
  username?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface SessionData {
  user?: User;
}

interface Session {
  data?: SessionData | null;
  status: "authenticated" | "unauthenticated" | "loading";
}

interface ApiError {
  message: string;
  status?: number;
}

interface SignupApiResponse {
  users?: Array<{
    id: string;
    name: string;
    email: string;
    // Add other user properties as needed
    // Add other user properties as needed
  }>;
  error?: ApiError;
}

export default function Login() {
  const session = useSession();
  const router = useRouter(); // Initialize router
  const { address, isConnected } = useAccount();
  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 10)}...${addr.substring(addr.length - 6)}`;
  };
  const [userData, changeUserData] = useState<SignupApiResponse | null>(null);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const getData = async (): Promise<void> => {
    try {
      const response = await fetch("/api/signup");
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      const data: SignupApiResponse = await response.json();
      changeUserData(data);
    } catch (error) {
      console.error("Error fetching signup data:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  // Redirect authenticated users to homepage
  useEffect(() => {
    if (session.data) {
      router.push("/homepage");
    }
  }, [session.data, router]);

  const testimonials = [
    {
      key: "1",
      repoName: "openwaveWeb",
      repoTitle: "openwave Web Platform",
      personName: "Alice Johnson",
      date: "2025-07-01",
      tags: ["security", "backend", "performance"],
    },
    {
      key: "2",
      repoName: "ApiGateway",
      repoTitle: "Central API Gateway",
      personName: "Bob Chen",
      date: "2025-07-05",
      tags: ["api", "microservices", "scalability"],
    },
    {
      key: "3",
      repoName: "AuthService",
      repoTitle: "Authentication Microservice",
      personName: "Carol Diaz",
      date: "2025-07-07",
      tags: ["security", "authentication", "jwt"],
    },
    {
      key: "4",
      repoName: "DatabaseMigrator",
      repoTitle: "Database Migration Utility",
      personName: "Dave Patel",
      date: "2025-07-09",
      tags: ["database", "migration", "cli"],
    },
  ];

  const testimonials1 = [
    {
      key: "5",
      repoName: "DataVisualizer",
      repoTitle: "Data Visualization Toolkit",
      personName: "Dana Kapoor",
      date: "2025-07-10",
      tags: ["data", "visualization", "charts"],
    },
    {
      key: "6",
      repoName: "MobileApp",
      repoTitle: "Cross-Platform Mobile App",
      personName: "Emma Li",
      date: "2025-07-12",
      tags: ["mobile", "react-native", "ui"],
    },
    {
      key: "7",
      repoName: "AiAssistant",
      repoTitle: "AI-Powered Coding Assistant",
      personName: "Frank Müller",
      date: "2025-07-15",
      tags: ["ai", "nlp", "productivity"],
    },
    {
      key: "8",
      repoName: "UiLibrary",
      repoTitle: "Reusable UI Components Library",
      personName: "Henry Brooks",
      date: "2025-07-20",
      tags: ["ui", "components", "design-system"],
    },
  ];

  const testimonials2 = [
    {
      key: "9",
      repoName: "PerfOptimizer",
      repoTitle: "Performance Optimization Suite",
      personName: "Charlie Nguyen",
      date: "2025-07-18",
      tags: ["performance", "optimization", "tools"],
    },
    {
      key: "10",
      repoName: "ApiDocs",
      repoTitle: "Interactive API Documentation",
      personName: "Ivy Thompson",
      date: "2025-07-22",
      tags: ["documentation", "api", "swagger"],
    },
    {
      key: "11",
      repoName: "TestAutomation",
      repoTitle: "Automated Testing Framework",
      personName: "Jack Kim",
      date: "2025-07-25",
      tags: ["testing", "automation", "qa"],
    },
  ];

  // Handle loading state
  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  // Render login page only for unauthenticated users
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ThemeProvider>
          <div>
            <div className="block lg:flex bg-black">
              <div className="my-auto lg:flex hidden bg-black">
                <InfiniteMovingCards
                  items={testimonials}
                  direction="up"
                  speed="slow"
                />
                <InfiniteMovingCards
                  items={testimonials1}
                  direction="down"
                  speed="slow"
                />
                <InfiniteMovingCards
                  items={testimonials2}
                  direction="up"
                  speed="slow"
                />
              </div>
              <div className="lg:w-[50%] my-auto ">
                <SignInPage />
              </div>
            </div>
          </div>
        </ThemeProvider>
      </Suspense>
    </>
  );
}
