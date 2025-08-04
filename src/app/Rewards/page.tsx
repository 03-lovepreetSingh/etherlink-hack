"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Topbar from "@/assets/components/topbar";
import Sidebar from "@/assets/components/sidebar";
import Image from "next/image";
import { useSidebarContext } from "@/assets/components/SidebarContext";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { parseEther, formatEther, isAddress } from "viem";
import {
  useWaitForTransactionReceipt,
  useReadContract,
  useEstimateGas,
  useAccount,
  useWriteContract,
  usePublicClient,
} from "wagmi";
const abi = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

import { type UseWriteContractParameters } from "wagmi";
import {
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { Icon } from "@iconify/react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Define interfaces
interface RewardTransaction {
  id: string;
  date: string;
  Contributor_id: string;
  issue: string;
  value: string;
  projectName: string;
  rewardAmount: number;
  Contributor: string;
}

interface RewardsApiResponse {
  Rewards: RewardTransaction[];
}

interface CustomUser {
  username?: string;
}

interface CustomSessionData {
  user?: CustomUser & {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface CustomSession {
  data?: CustomSessionData | null;
}

export default function Rewards() {
  const { data: session }: CustomSession = useSession();
  const [customWithdrawlAmount, setCustomWithdrawlAmount] = useState<
    number | null
  >(null);
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [forwardToAddress, setForwardToAddress] = useState("");
  const [forwardAmount, setForwardAmount] = useState("");
  const {
    data: forwardHash,
    isPending: isForwarding,
    writeContract,
    error: forwardError,
  } = useWriteContract();
  const { isLoading: isConfirmingForward, isSuccess: isForwardConfirmed } =
    useWaitForTransactionReceipt({ hash: forwardHash });
  const [txHash, setTxHash] = useState(null);
  const [totalPaidRewards, setTotalPaidRewards] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const publicClient = usePublicClient();
  const [userData, setUserData] = useState();
  const [rewards, setRewards] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const { isShrunk } = useSidebarContext();
  const [withdraw, setWithdraw] = useState<boolean>(false);
  const form = useForm();
  const { control, setValue } = form;
  const [totalWithdrawble, setTotalWithdrawble] = useState<number>();
  const contractAddress = "0x6aD5fAe272a5692Fffaacd5D4C37C5813C7d21A0";
  const estimatedGas = useEstimateGas({
    chainId: 688688,
    to: address,
    value: parseEther("0.01"),
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!session) return;
      const res = await fetch(
        `/api/publicProfile?username=${session?.user?.username}`,
        {
          method: "GET",
        }
      );
      const responseData = await res.json();
      setUserData(responseData.user);
      console.log(responseData, "Userss");
    };
    fetchUser();
  }, [session]);
  useEffect(() => {
    console.log(form.getValues("amount"), "test amt");
  }, [control]);
  const handleWithdrawal = () => {
    try {
      const netamtavailable: number =
        parseFloat(totalRewarded.toFixed(4)) -
        parseFloat(totalPaidRewards.toFixed(4));
      const totalRewardedWei = parseEther(netamtavailable.toString());
      if (!isAddress(forwardToAddress)) {
        alert("Please enter a valid target contract address.");
        return;
      }
      if (!userData) return;

      writeContract({
        abi,
        address: userData[0].metaMask,
        functionName: "setMaxWithdrawalAmount",
        args: [address, totalRewardedWei],
      });
    } catch {
      console.error("hwllo");
    }
  };

  const doWithdrawal = async () => {
    if (!userData) return;
    try {
      const netamtavailable: number =
        parseFloat(totalRewarded.toFixed(4)) -
        parseFloat(totalPaidRewards.toFixed(4));
      const totalRewardedWei = parseEther(netamtavailable.toString());

      console.log("address", address);
      console.log("totalrewardedinwei", totalRewardedWei);
      console.log(" userData[0]?.metaMask", userData[0]?.metaMask);
      writeContract({
        abi,
        address: userData[0]?.metaMask,
        functionName: "withdraw",
        args: [totalRewardedWei, address],
      });
    } catch {
      console.error("hwllo");
    }
  };

  const doCustomWithdrawal = async (amountWithdrawn: number) => {
    if (!userData) return;
    try {
      const netamtavailable: number =
        parseFloat(totalRewarded.toFixed(4)) -
        parseFloat(totalPaidRewards.toFixed(4));
      if (amountWithdrawn < netamtavailable) {
        const totalRewardedWei = parseEther(amountWithdrawn.toString());
        setCustomWithdrawlAmount(amountWithdrawn);

        writeContract({
          abi,
          address: userData[0]?.metaMask,
          functionName: "withdraw",
          args: [totalRewardedWei, address],
        });
      }
    } catch {
      console.error("hwllo");
    }
  };

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/rewards?contributor=${session?.user?.username}`
        );
        if (!response.ok) throw new Error("Failed to fetch rewards");
        const data: RewardsApiResponse = await response.json();
        const allRewards = data.Rewards;
        setRewards(allRewards);
        console.log("Fetched rewards:", allRewards);
      } catch (err: any) {
        console.error("Error fetching rewards:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchPayments = async () => {
      try {
        const response = await fetch(
          `/api/payments?username=${session?.user?.username}`,
          { method: "GET" }
        );
        const data = await response.json();
        const paidRewards = data.payments;

        let totalPaidReward = 0;
        for (let i = 0; i < paidRewards.length; i++) {
          totalPaidReward += paidRewards[i].amount;
        }
        console.log(totalPaidReward, "paid Rewards");
        setTotalPaidRewards(totalPaidReward);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPayments();
    fetchRewards();
  }, [session]);

  const filteredRewards = rewards.filter((reward) => {
    if (
      !reward ||
      typeof reward.projectName !== "string" ||
      typeof reward.Contributor !== "string"
    ) {
      return false;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      reward.projectName.toLowerCase().includes(searchTermLower) ||
      reward.Contributor.toLowerCase().includes(searchTermLower);

    if (!matchesSearch) {
      return false;
    }

    const currentUsername: string | undefined = session?.user?.username;
    if (currentUsername) {
      return reward.Contributor.toLowerCase() === currentUsername.toLowerCase();
    }

    return true;
  });

  const totalRewarded = filteredRewards.reduce(
    (sum, reward) => sum + reward.rewardAmount,
    0
  );

  useEffect(() => {
    if (isForwardConfirmed) {
      const payment = async () => {
        await fetch("/api/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Use customWithdrawl amount if it's a custom withdrawal, otherwise use totalRewarded
            amount: customWithdrawlAmount
              ? customWithdrawlAmount.toFixed(4)
              : totalRewarded.toFixed(4),
            username: session?.user?.username,
          }),
        });
      };

      payment();
    }
  }, [isForwardConfirmed, customWithdrawlAmount, totalRewarded]);

  useEffect(() => {
    const data =
      parseFloat(totalRewarded.toFixed()) -
      parseFloat(totalPaidRewards.toFixed());
    setTotalWithdrawble(data);
  }, [totalRewarded, totalPaidRewards]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Generate chart data
  const generateChartData = () => {
    const monthMap: { [key: string]: number } = {};
    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    rewards.forEach((reward) => {
      let dateObj: Date;
      if (reward.date.includes("-")) {
        const parts = reward.date.split("-");
        if (parts[2]?.length === 4) {
          dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        } else {
          dateObj = new Date(reward.date);
        }
      } else {
        dateObj = new Date(reward.date);
      }

      if (isNaN(dateObj.getTime())) {
        console.warn(
          `Invalid date string for reward: ${reward.id}, date: ${reward.date}`
        );
        return;
      }

      if (!minDate || dateObj < minDate) minDate = dateObj;
      if (!maxDate || dateObj > maxDate) maxDate = dateObj;

      const monthYear = dateObj.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      monthMap[monthYear] =
        (monthMap[monthYear] || 0) + Number.parseFloat(reward.value);
    });

    const months: string[] = [];
    if (minDate && maxDate) {
      const current = new Date(
        (minDate as any)?.getFullYear() ?? 0,
        (minDate as any)?.getMonth() ?? 0,
        1
      );
      const end = new Date(
        (maxDate as any).getFullYear(),
        (maxDate as any).getMonth(),
        1
      );

      while (current <= end) {
        const monthYear = current.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        });
        months.push(monthYear);
        current.setMonth(current.getMonth() + 1);
      }
    }

    if (months.length === 0) {
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(
          d.toLocaleString("default", { month: "short", year: "2-digit" })
        );
      }
    }

    const maxValue = Math.max(...months.map((m) => monthMap[m] || 0), 1);

    return { months, monthMap, maxValue };
  };

  const { months, monthMap, maxValue } = generateChartData();

  if (loading) {
    return (
      <Suspense>
        <div className="flex min-h-screen">
          <Sidebar />
          <div
            className={`
              flex-1 transition-all duration-300 ease-in-out
              ${
                isMobile
                  ? "ml-0 w-full"
                  : isShrunk
                  ? "ml-16 w-[calc(100%-4rem)]"
                  : "ml-64 w-[calc(100%-16rem)]"
              }
            `}
          >
            <Topbar />
            <div className="mt-16 p-4 lg:p-8">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-neutral-600 rounded w-1/3"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-neutral-600 rounded"></div>
                  ))}
                </div>
                <div className="h-96 bg-neutral-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div
          className={`
                    flex-1 transition-all duration-300 ease-in-out
                    ${
                      isMobile
                        ? "ml-0 w-full"
                        : isShrunk
                        ? "ml-16 w-[calc(100%-4rem)]"
                        : "ml-64 w-[calc(100%-16rem)]"
                    }
                  `}
        >
          <Topbar />
          {
            <div className="flex">
              <div className={` ${withdraw ? "w-[70%]" : "w-full"}`}>
                <main className="mt-16 overflow-x-hidden overflow-y-auto">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                    {/* Header */}
                    <div className="flex justify-between mb-6 lg:mb-8">
                      <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white">
                          Rewards Dashboard
                        </h1>
                        <p className="mt-2 text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                          Track your earnings and reward history
                        </p>
                      </div>
                      <div>
                        <Button onClick={() => setWithdraw(true)}>
                          Withdraw Rewards
                        </Button>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
                      {/* Total Rewarded Card */}
                      <Card className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500"></div>
                        <CardContent className="relative p-4 lg:p-6 text-white">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-xs lg:text-sm font-medium text-purple-100">
                                Total Rewarded
                              </p>
                              <p className="text-xl lg:text-3xl font-bold">
                                {totalRewarded.toFixed(4)} Tezos
                              </p>
                            </div>
                            <div className="h-8 w-8 lg:h-10 lg:w-10 bg-white/20 rounded-full flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Paid Card */}
                      <Card>
                        <CardContent className="p-4 lg:p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-xs lg:text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                Paid
                              </p>
                              <p className="text-xl lg:text-3xl font-bold text-neutral-900 dark:text-white">
                                {parseFloat(totalPaidRewards.toFixed(4))} Tezos
                              </p>
                            </div>
                            <div className="h-8 w-8 lg:h-10 lg:w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Chart Card */}
                      <Card className="sm:col-span-2 lg:col-span-1">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm lg:text-base font-medium text-neutral-600 dark:text-neutral-400">
                            Rewards Chart
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 lg:p-6 pt-0">
                          <div className="flex justify-around items-end h-16 lg:h-20">
                            {months.map((month, i) => (
                              <div
                                key={month + i}
                                className="text-center flex-1 max-w-8"
                              >
                                <div
                                  className="w-3 lg:w-4 bg-neutral-600 dark:bg-neutral-400 rounded-t mx-auto"
                                  style={{
                                    height: `${
                                      ((monthMap[month] || 0) / maxValue) *
                                      (isMobile ? 48 : 60)
                                    }px`,
                                    minHeight: "6px",
                                  }}
                                  title={`${monthMap[month] || 0} Tezos`}
                                ></div>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block truncate">
                                  {isMobile ? month.slice(0, 3) : month}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Search and Filter Section */}
                    <Card className="mb-6">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                            <Input
                              type="text"
                              placeholder="Search projects or contributors..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 sm:flex-none bg-transparent"
                            >
                              <Filter className="h-4 w-4 mr-2" />
                              <span className="hidden sm:inline">Filter</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 sm:flex-none bg-transparent"
                            >
                              <MoreHorizontal className="h-4 w-4 mr-2" />
                              <span className="hidden sm:inline">More</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Rewards Table */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg lg:text-xl">
                          Reward History
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {error && (
                          <div className="p-6 text-center">
                            <p className="text-red-500">Error: {error}</p>
                          </div>
                        )}

                        {!error && rewards.length === 0 && (
                          <div className="p-8 text-center">
                            <DollarSign className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                              No rewards found
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                              {searchTerm
                                ? "Try adjusting your search criteria."
                                : "You haven't received any rewards yet."}
                            </p>
                          </div>
                        )}

                        {!error && rewards.length > 0 && (
                          <>
                            {/* Mobile Card View */}
                            <div className="block md:hidden">
                              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                {rewards.map((reward) => (
                                  <div
                                    key={reward.id}
                                    className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <h3 className="font-medium text-neutral-900 dark:text-white truncate">
                                        {reward.projectName}
                                      </h3>
                                      <Badge
                                        variant="secondary"
                                        className="ml-2"
                                      >
                                        Complete
                                      </Badge>
                                    </div>
                                    <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                                      <div className="flex items-center justify-between">
                                        <span>Amount:</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">
                                          {reward.rewardAmount.toFixed(4)} Tezos
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>Date:</span>
                                        <span>{formatDate(reward.date)}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>From:</span>
                                        <span className="truncate ml-2">
                                          {reward.Contributor_id}
                                        </span>
                                      </div>
                                      <div className="mt-2">
                                        <span className="text-xs text-neutral-500">
                                          Issue:{" "}
                                        </span>
                                        <span className="text-xs">
                                          {reward.issue}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                                <thead className="bg-neutral-50 dark:bg-neutral-800">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                                    >
                                      Date
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                                    >
                                      Project
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                                    >
                                      From
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                                    >
                                      Contributions
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                                    >
                                      Amount
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                                    >
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
                                  {rewards.map((reward) => (
                                    <tr
                                      key={reward.id}
                                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-300">
                                        {formatDate(reward.date)}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                                        {reward.projectName}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                                        {reward.Contributor_id}
                                      </td>
                                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                                        <div
                                          className="max-w-xs truncate"
                                          title={reward.issue}
                                        >
                                          {reward.issue}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                                        {reward.rewardAmount.toFixed(4)} Tezos
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="secondary">
                                          Complete
                                        </Badge>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </main>
              </div>
              {isConnected ? (
                <>
                  {withdraw ? (
                    <>
                      <div
                        className={`mt-12 h-screen border-l-1 border-neutral-800
                          ${
                            !withdraw
                              ? "w-0"
                              : isMobile
                              ? "w-full fixed top-0 left-0 z-50 bg-white dark:bg-black overflow-y-auto"
                              : "w-[30%]"
                          }
                        `}
                      >
                        {isMobile && (
                          <div className="p-4 flex justify-end">
                            <Button
                              variant="ghost"
                              onClick={() => setWithdraw(false)}
                              className="text-neutral-500"
                            >
                              <Icon
                                icon="heroicons:x-mark"
                                width="24"
                                height="24"
                              />
                            </Button>
                          </div>
                        )}
                        <div className="p-4 md:p-8 border-b-1 border-neutral-900">
                          <div className="flex justify-between flex-wrap gap-2 md:gap-4 text-xl font-bold">
                            <div className="flex gap-2 md:gap-4">
                              My Wallet
                              <div className="text-sm my-auto font-normal text-neutral-500">
                                {address && (
                                  <div className="flex items-center gap-1">
                                    {`${address.slice(0, 4)}...${address.slice(
                                      28,
                                      32
                                    )}`}
                                    <button
                                      onClick={() =>
                                        navigator.clipboard.writeText(address)
                                      }
                                      className="text-neutral-500 hover:text-neutral-300"
                                      title="Copy address"
                                    >
                                      <Icon
                                        icon="heroicons:clipboard"
                                        width="16"
                                        height="16"
                                      />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <Button
                                variant="ghost"
                                onClick={() => setWithdraw(false)}
                                className="text-neutral-500"
                              >
                                <Icon
                                  icon="heroicons:x-mark"
                                  width="24"
                                  height="24"
                                />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm mt-2">
                            You will receive payments in this wallet solve an
                            issue. Learn more about what you can do with your
                            rewards.
                          </div>
                        </div>
                        <div className="p-4 md:p-8">
                          <div className="flex flex-wrap items-center text-2xl md:text-3xl font-bold">
                            <img
                              src="/XTZ.png"
                              alt="Tezos"
                              width={32}
                              height={32}
                              className="mr-2"
                            />
                            <span className="break-all">
                              {parseFloat(totalRewarded.toFixed(4)) -
                                parseFloat(totalPaidRewards.toFixed(4))}
                            </span>
                            <div className="text-lg md:text-xl text-neutral-400 dark:text-neutral-600 pl-2 my-auto">
                              Tezos
                            </div>
                          </div>
                          <div className="text-lg text-neutral-600 dark:text-neutral-400"></div>
                          <div className="pt-4">
                            <div className="text-sm mb-2 break-words"></div>
                            <Button
                              className="w-full md:w-auto flex justify-center"
                              onClick={() => {
                                doWithdrawal();
                              }}
                            >
                              Withdraw All
                              <Icon
                                icon="iconamoon:arrow-top-right-1-bold"
                                width="24"
                                height="24"
                                className="ml-2"
                              />
                            </Button>
                            {isConfirmingForward && (
                              <Alert className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Transaction Pending</AlertTitle>
                                <AlertDescription>
                                  Your withdrawal transaction is being
                                  processed.
                                </AlertDescription>
                              </Alert>
                            )}

                            {isForwardConfirmed && (
                              <Alert className="mt-4">
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertTitle>Transaction Successful</AlertTitle>
                                <AlertDescription>
                                  Your withdrawal was completed successfully.
                                </AlertDescription>
                              </Alert>
                            )}

                            {forwardError && (
                              <Alert className="mt-4" variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Transaction Failed</AlertTitle>
                                <AlertDescription>
                                  {
                                    "There was an error processing your withdrawal."
                                  }
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                        <div className="border-t-1 border-neutral-900">
                          <div className="p-4 md:p-8">
                            <div className="text-xl font-bold">
                              Custom Amount
                            </div>
                            <div className="text-sm">
                              Your crypto, your control. Withdraw the exact
                              amount you need, every time.
                            </div>
                            <div className="pt-4 flex flex-col md:flex-row items-center gap-2 md:gap-0">
                              <div className="w-full justify-start">
                                <Form {...form}>
                                  <FormField
                                    control={control}
                                    name="amount"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder="Enter Amount"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </Form>
                              </div>

                              <Button
                                className="w-full md:w-auto md:ml-2 flex justify-center items-center"
                                onClick={() => {
                                  doCustomWithdrawal(form.getValues("amount"));
                                }}
                              >
                                Withdraw
                                <Icon
                                  icon="iconamoon:arrow-top-right--bold"
                                  width="16"
                                  height="16"
                                  className="ml-1"
                                />
                              </Button>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                              <Button
                                onClick={() => form.setValue("amount", 20)}
                                className="flex flex-1 min-w-[80px] justify-center dark:hover:bg-neutral-800 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 bg-neutral-100 text-neutral-900"
                              >
                                <img
                                  src="/XTZ.png"
                                  alt="Tezos"
                                  width={16}
                                  height={16}
                                  className="mr-1"
                                />
                                20
                              </Button>
                              <Button
                                onClick={() => form.setValue("amount", 50)}
                                className="flex flex-1 min-w-[80px] justify-center dark:hover:bg-neutral-800 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 bg-neutral-100 text-neutral-900"
                              >
                                <img
                                  src="/XTZ.png"
                                  alt="Tezos"
                                  width={16}
                                  height={16}
                                  className="mr-1"
                                />
                                50
                              </Button>
                              <Button
                                onClick={() => form.setValue("amount", 100)}
                                className="flex flex-1 min-w-[80px] justify-center dark:hover:bg-neutral-800 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 bg-neutral-100 text-neutral-900"
                              >
                                <img
                                  src="/XTZ.png"
                                  alt="Tezos"
                                  width={16}
                                  height={16}
                                  className="mr-1"
                                />
                                100
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {isMobile && withdraw && (
                        <div
                          className="fixed inset-0 bg-black bg-opacity-50 z-40"
                          onClick={() => setWithdraw(false)}
                        ></div>
                      )}
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  <p>Please connect your wallet</p>
                </>
              )}
            </div>
          }
        </div>
      </div>
    </Suspense>
  );
}
