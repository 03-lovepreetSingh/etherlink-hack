"use client";

import React from "react";
import Sidebar from "@/assets/components/sidebar";
import Topbar from "@/assets/components/topbar";
import { useSidebarContext } from "@/assets/components/SidebarContext";
import { useSearchParams } from "next/navigation";
import { Octokit } from "octokit";
import { useCompletion } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { simulateContract, writeContract } from "@wagmi/core";
import { config } from "@/config/index";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { type Hash } from "viem";
import { useAccount } from "wagmi";
import { parseEther, formatEther, isAddress } from "viem";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Wallet, AlertCircle, CheckCircle } from "lucide-react";

const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "fromUser",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FundsForwarded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdrawal",
    type: "event",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_toContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "forwardFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
type MergeStatus = {
  mergeable: boolean | null;
  state: string;
  has_conflicts: boolean;
  is_clean: boolean;
};
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth"; // Import Session type
import { Suspense } from "react";
import { ContextOptionsModelFromJSON } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/assistant_data";

export default function PullRequestDetails() {
  const {
    completion,
    complete,
    isLoading: isCompletionLoading,
  } = useCompletion({
    api: "/api/completion",
  });
  const params = useParams();
  const {
    data: hash, // The transaction hash
    isPending, // Is the user confirming in their wallet?
    writeContract,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading: isConfirming, // Is the transaction waiting to be mined?
    isSuccess: isConfirmed, // Was the transaction successfully mined?
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });
  const [contributer, setContributer] = useState();
  const [contributerId, setContributerId] = useState();
  const { address, isConnected } = useAccount();
  const [userData, setUserData] = useState();
  console.log("Params:", params);
  const [ai, setAi] = useState<boolean>(false);
  const { data: session } = useSession();
  const [repoData, setRepoData] = useState<any>(null);
  const [contributorData, setContributorData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [isMerged, setIsMerged] = useState(false); // State to track if merge is complete
  const [hasRunCompletion, setHasRunCompletion] = useState(false);
  const [mergeStatus, setMergeStatus] = useState<MergeStatus | null>(null);
  const [user, setUser] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const octokit = React.useMemo(
    () =>
      new Octokit({
        auth: (session as any)?.accessToken,
      }),
    [session]
  );
  const { isShrunk } = useSidebarContext();
  const searchParams = useSearchParams();
  const [RewardAmount, setRewardAmount] = useState<string>();
  const issueNumber = params.id as string | undefined;
  const pullRequestId = searchParams.get("pullRequestID");
  const project = searchParams?.get("project");
  const owner = searchParams?.get("owner");
  console.log(RewardAmount, "sdfhashjdash");

  useEffect(() => {
    const userData = async () => {
      if (!session) return;
      const res = await fetch(
        `/api/publicProfile?username=${session?.user?.username}`,
        {
          method: "GET",
        }
      );

      const responseData = await res.json();
      setUserData(responseData.user);
    };
    userData();
  }, [session]);

  useEffect(() => {
    const contributorData = async () => {
      if (!repoData) return;
      const res = await fetch(
        `/api/publicProfile?username=${repoData?.user?.login}`,
        {
          method: "GET",
        }
      );

      const responseData = await res.json();
      setContributorData(responseData.user);
      setContributerId(responseData.user[0].id.toString());
      setContributer(responseData.user[0].fullName.toString());

      console.log("repo Data:", responseData.user[0].id);
    };
    contributorData();
  }, [repoData]);
  console.log("contributer Data :", contributerId);
  console.log("contributer  :", contributer);
  const transact = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first.");
      return;
    }
    console.log("userDatahbdcusacnncdh", userData);
    // Add type-safe null checks
    if (!userData || userData.length === 0 || !userData[0].maintainerWallet) {
      alert("User wallet information is missing");
      return;
    }

    if (
      !contributorData ||
      contributorData.length === 0 ||
      !contributorData[0].metaMask
    ) {
      alert("Contributor wallet information is missing");
      return;
    }

    const amountInWei = parseEther(RewardAmount as string);
    console.log(RewardAmount, "rewardAmt");
    console.log(amountInWei, "weiwei");
    console.log(contributorData[0].metaMask, "dasdsa");
    console.log(userData[0].maintainerWallet, "sdadjasdhjash");
    console.log(isConfirmed, "sdhshdhs");
    try {
      // Add await since writeContract is async
      await writeContract({
        address: userData[0].maintainerWallet,
        abi,
        functionName: "forwardFunds",
        args: [contributorData[0].metaMask, amountInWei],
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      // Handle unknown error type safely
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Transaction failed: ${message}`);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      handlePRMerge();
    }
  }, [isConfirmed]);

  useEffect(() => {
    const getIssueData = async () => {
      if (!project || !issueNumber) return;
      try {
        const response = await fetch(
          `/api/getissueForPR?project_repository=${project}&issueNumber=${issueNumber}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch issue data");
        }
        const data = await response.json();
        console.log("Fetched Issue Data:", data);
        setRewardAmount(data.projects[0].rewardAmount);
      } catch (err) {
        console.error("Error fetching issue data:", err);
        setError("Could not load reward details for the issue.");
      }
    };
    getIssueData();
  }, [project, issueNumber]);
  useEffect(() => {
    const checkMergeStatus = async () => {
      if (!owner || !project || !pullRequestId) return;
      try {
        const { data: pr } = await octokit.request(
          "GET /repos/{owner}/{repo}/pulls/{pull_number}",
          {
            owner: owner as string,
            repo: project as string,
            pull_number: parseInt(pullRequestId as string),
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        console.log("contributer id :", session?.user?.username);
        const status = {
          mergeable: pr.mergeable,
          state: pr.mergeable_state,
          has_conflicts: pr.mergeable === false,
          is_clean: pr.mergeable_state === "clean",
        };
        setMergeStatus(status);
        if (pr.merged) {
          setIsMerged(true); // Check if PR is already merged on load
        }
        console.log("Merge Status:", status);
      } catch (err) {
        console.error("Error checking PR merge status:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error occurred while checking merge status"
        );
      }
    };

    checkMergeStatus();
  }, [octokit, owner, project, pullRequestId]);

  const makeTransaction = async () => {
    if (!contributerId && !RewardAmount) {
      setError("contributor and enter a reward amount. is not there");
    }
    console.log("Checking 3", contributerId);
    try {
      const res = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: contributerId,
          amount: RewardAmount,
          transactionType: "receive",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Transaction failed:", data.error);
      } else {
        console.log("✅ Transaction successful:", data);
      }

      return data;
    } catch (error) {
      console.error("🔥 makeTransaction error:", error);
      return {
        success: false,
        error: "Unexpected error occurred during transaction",
      };
    }
  };

  const handlePRMerge = React.useCallback(async () => {
    // Prevent function from running if already merged or in the process of merging
    if (
      isMerged ||
      isMerging ||
      !owner ||
      !project ||
      !pullRequestId ||
      !issueNumber
    )
      return;

    setIsMerging(true);
    setError(null);

    try {
      // 1. Merge the Pull Request
      await octokit.request(
        "PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge",
        {
          owner: owner as string,
          repo: project as string,
          pull_number: parseInt(pullRequestId as string),
        }
      );
      await fetch(
        `/api/getIssueForPR?project_repository=${project}&issueNumber=${issueNumber}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issueNumber: issueNumber,
            project_repository: project,
            active: false,
          }),
        }
      );
      // 2. Post reward data to the backend API
      await fetch("/api/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: project,
          issue_id: issueNumber,
          Contributor_id: contributer,
          issue: repoData?.html_url,
          rewardAmount: RewardAmount,
          date: new Date().toISOString(),
          Contributor: contributerId,
          projectDescription: repoData?.body,
          projectOwner: owner,
          project_repository: repoData?.head?.repo?.name,
        }),
      });


      await fetch(`/api/getContributions?contributor=${contributer}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contributor: contributer,
          issue:issueNumber,
          projectName: project,
          status:'completed'
        }),
      })
      // make transaction call

      makeTransaction();
      // 3. Close the associated Issue
      await octokit.request(
        "PATCH /repos/{owner}/{repo}/issues/{issue_number}",
        {
          owner: owner as string,
          repo: project as string,
          issue_number: parseInt(issueNumber as string),
          state: "closed",
        }
      );

      setIsMerged(true); // Set state to indicate completion
      console.log("PR merged and issue closed successfully.");
    } catch (err) {
      console.error("Error in merge process:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred during the merge process."
      );
    } finally {
      setIsMerging(false);
    }
  }, [
    octokit,
    owner,
    project,
    pullRequestId,
    issueNumber,
    session,
    repoData,
    RewardAmount,
    isMerged,
    isMerging,
  ]);

  useEffect(() => {
    const fetchPRDetails = async () => {
      if (!session?.user || !owner || !project || !pullRequestId) return;

      try {
        setLoading(true);
        const { data } = await octokit.request(
          "GET /repos/{owner}/{repo}/pulls/{pull_number}",
          {
            owner: owner as string,
            repo: project as string,
            pull_number: parseInt(pullRequestId as string),
          }
        );
        setRepoData(data);
        if (data.merged) {
          setIsMerged(true); // Also check here to be safe
        }
      } catch (err) {
        console.error("Error fetching PR details:", err);
        setError("Failed to load pull request details");
      } finally {
        setLoading(false);
      }
    };

    fetchPRDetails();
  }, [session, owner, project, pullRequestId, octokit]);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[100] max-w-sm w-full">
        {alertMessage && (
          <Alert
            className={`mb-2 ${
              isConfirmed
                ? "bg-green-100 border-green-400 text-green-700"
                : writeError
                ? "bg-red-100 border-red-400 text-red-700"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              {isConfirmed ? (
                <CheckCircle className="h-4 w-4" />
              ) : writeError ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle className="text-sm">
                {isConfirmed ? "Success" : writeError ? "Error" : "Notice"}
              </AlertTitle>
            </div>
            <AlertDescription className="text-sm mt-1">
              {alertMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div
          className={`w-full transition-all duration-300 ${
            isShrunk ? "md:ml-[4rem]" : "md:ml-[16rem]"
          }`}
        >
          <Topbar />
          {!repoData ? (
            <>
              <div className=" p-4 mt-24 w-full md:w-[90%] lg:w-[80%] mx-auto min-h-screen animate-pulse">
                {/* Header Skeleton */}
                <div className="max-w-7xl mx-auto mt-8">
                  <div className="mb-4">
                    <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="h-8 w-64 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                      <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    </div>
                    <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
                  </div>

                  {/* Main Content Skeleton */}
                  <div className="flex flex-col lg:flex-row gap-6 mt-6">
                    {/* Left: PR Details Skeleton */}
                    <div className="flex-1">
                      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 mb-6">
                        <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
                        <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded mb-3"></div>
                        <div className="flex items-center gap-6 mb-2">
                          <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                          <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                          <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                        </div>
                        <hr className="my-4 border-neutral-200 dark:border-neutral-700" />
                        <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                        <div className="bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg p-4">
                          <div className="h-6 w-64 bg-neutral-200 dark:bg-neutral-600 rounded mb-2"></div>
                          <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-600 rounded mb-3"></div>
                          <div className="flex flex-wrap gap-2">
                            <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-600 rounded-full"></div>
                            <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-600 rounded-full"></div>
                            <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-600 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Review Actions Skeleton */}
                    <div className="w-full lg:w-80 flex-shrink-0 order-first lg:order-none">
                      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 mb-4">
                        <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-3"></div>
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
                          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
                          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
                        </div>
                        <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-3">
                          <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-600 rounded mb-2"></div>
                          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-600 rounded mb-1"></div>
                          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-600 rounded mb-1"></div>
                          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-600 rounded mb-1"></div>
                          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-600 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Files Changed Skeleton */}
                  <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-0 mb-6">
                    <div className="flex border-b border-neutral-200 dark:border-neutral-700">
                      <div className="flex-1 py-3 text-center font-medium bg-neutral-100 dark:bg-neutral-800 rounded-tl-xl">
                        <div className="h-6 w-32 mx-auto bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                      </div>
                      <div className="flex-1 py-3 text-center font-medium">
                        <div className="h-6 w-32 mx-auto bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 md:p-6">
                      <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                      <div className="h-4 w-64 bg-neutral-200 dark:bg-neutral-700 rounded mb-6"></div>
                      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800">
                        <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                        <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-3"></div>
                        <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="px-2 sm:px-4 py-4 mt-16 sm:mt-24 w-full mx-auto min-h-screen">
              <div className="w-full max-w-7xl mx-auto mt-2 sm:mt-4 md:mt-8">
                <div className="mb-2 sm:mb-4 px-0">
                  <Link
                    href="/PullRequests"
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:underline"
                  >
                    &larr; Back to Pull Requests
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-2 px-0">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">
                      {repoData?.title}
                    </h1>
                    <div className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      #{repoData?.number} opened by {repoData?.user?.login} on{" "}
                      {new Date(repoData?.created_at).toLocaleDateString()}{" "}
                    </div>
                  </div>
                  <a
                    href={repoData?.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-950 dark:hover:bg-custom-dark-neutral w-full md:w-auto text-center"
                  >
                    View on GitHub
                  </a>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-4 sm:mt-6">
                  {/* Left: PR Details */}
                  <div className="w-full lg:flex-1">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 md:p-5 mb-6">
                      <h2 className="font-semibold text-lg mb-2 flex items-center gap-2 dark:text-white">
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          className="text-neutral-400 dark:text-neutral-300"
                        >
                          <path d="M16 17v1a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v1" />
                          <path d="M9 12h12l-3-3m0 6l3-3" />
                        </svg>
                        Pull Request Details
                      </h2>
                      <div className="text-neutral-700 dark:text-neutral-300 mb-3">
                        {repoData?.body || "No description provided"}
                      </div>
                      <div className="md:flex grid grid-cols-2 items-center gap-6 mb-2">
                        <div className="flex items-center gap-1">
                          <span className="font-medium dark:text-white">
                            Status:
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              repoData?.state === "open"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            }`}
                          >
                            {repoData?.state === "open" ? "Open" : "Closed"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium dark:text-white">
                            Merged:
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              repoData?.merged || isMerged
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                            }`}
                          >
                            {repoData?.merged || isMerged
                              ? "Merged"
                              : "Not Merged"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium dark:text-white">
                            Project:
                          </span>
                          <span className="text-neutral-800 dark:text-neutral-200">
                            {repoData?.head?.repo?.name}
                          </span>
                        </div>
                      </div>
                      <hr className="my-4 border-neutral-200 dark:border-neutral-700" />
                      <div>
                        <div className="font-medium mb-2 dark:text-white">
                          Associated Issue
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                          <div className="font-semibold text-neutral-900 dark:text-white mb-1">
                            {repoData?.title}
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                            {repoData?.body || "No description provided"}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs">
                              Changes: {repoData?.changed_files} files
                            </span>
                            <span className="bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded-full text-xs">
                              +{repoData?.additions} additions
                            </span>
                            <span className="bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-0.5 rounded-full text-xs">
                              -{repoData?.deletions} deletions
                            </span>
                            <span className="bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded-full text-xs">
                              Commits: {repoData?.commits}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right: Review Actions */}
                  <div className="w-full lg:w-80 flex-shrink-0 mt-4 lg:mt-0">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 md:p-5 mb-4">
                      <div className="font-semibold mb-3 dark:text-white">
                        Review Actions
                      </div>
                      <div className="flex flex-col gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => {
                            transact();
                            if (isConfirmed) {
                              handlePRMerge();
                            }
                          }}
                          disabled={
                            isPending ||
                            isConfirming ||
                            isMerging ||
                            isMerged ||
                            mergeStatus?.mergeable === false ||
                            mergeStatus?.mergeable === null
                          }
                          className="z-0 w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 font-medium dark:bg-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          {isMerging
                            ? "Merging..."
                            : isMerged
                            ? "Merged Successfully"
                            : "Approve & Merge"}
                        </button>
                        <a
                          href={`${repoData?.html_url}#submit-review`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full border border-neutral-300 text-neutral-700 py-2 rounded-lg flex items-center justify-center gap-2 font-medium dark:border-neutral-600 dark:text-neutral-300"
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17 10.5V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-4.5" />
                            <path d="M15 12l2-2-2-2" />
                          </svg>
                          Request Changes
                        </a>
                        <Link
                          href="/PullRequests"
                          className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-red-600"
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Back to List
                        </Link>
                      </div>
                      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 text-sm">
                        <div className="font-medium dark:text-white">
                          PR Stats
                        </div>
                        <div className="text-neutral-500 dark:text-neutral-400">
                          Commits: {repoData?.commits}
                        </div>
                        <div className="text-neutral-500 dark:text-neutral-400">
                          Comments: {repoData?.comments}
                        </div>
                        <div className="text-neutral-500 dark:text-neutral-400">
                          Created:{" "}
                          {new Date(repoData?.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-neutral-500 dark:text-neutral-400">
                          Last Updated:{" "}
                          {new Date(repoData?.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Tabs for Files Changed and Comments */}
              <div className="bg-white max-w-7xl mx-auto dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row border-b border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => {
                      setAi(false);
                    }}
                    className="flex-1 py-2 sm:py-3 text-center font-medium text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-900 rounded-tl-xl sm:rounded-tl-xl focus:outline-none"
                  >
                    Files Changed
                  </button>
                  <button
                    onClick={() => {
                      setAi(true);
                      if (
                        !isCompletionLoading &&
                        owner &&
                        project &&
                        pullRequestId &&
                        !hasRunCompletion
                      ) {
                        setHasRunCompletion(true);
                        const prompt = `Analyze the changes made in a pull request https://github.com/${owner}/${project}/pull/${pullRequestId}. Focus on a technical review: explain the purpose of the changes, evaluate the code quality, identify any potential issues or improvements, and assess if the modifications align with best coding practices. Assume the reader is familiar with programming concepts.`;

                        // Use setTimeout to prevent React state update cycles
                        setTimeout(() => {
                          complete(prompt);
                        }, 0);
                      }
                    }}
                    disabled={
                      isCompletionLoading ||
                      !owner ||
                      !project ||
                      !pullRequestId ||
                      hasRunCompletion
                    }
                    className="flex-1 py-2 sm:py-3 text-center font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white focus:outline-none"
                  >
                    {isCompletionLoading
                      ? "Analyzing..."
                      : hasRunCompletion
                      ? "Analysis Complete"
                      : "Analyze PR"}
                  </button>
                </div>

                {isCompletionLoading ? (
                  <>
                    <div className="mx-auto text-center">
                      <TextShimmer
                        className="mx-auto text-center pt-20 font-mono text-lg md:text-xl"
                        duration={1}
                      >
                        Generating code...
                      </TextShimmer>
                    </div>
                  </>
                ) : null}
                {ai ? (
                  <>
                    <div className="min-h-80 p-4 sm:p-6 md:p-8 lg:p-10">
                      {completion && (
                        <div className="mt-4 prose dark:prose-invert max-w-none overflow-auto">
                          <ReactMarkdown>{completion}</ReactMarkdown>{" "}
                          {/* Use ReactMarkdown here */}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-6">
                      <div className="text-xl font-bold mb-1 dark:text-white">
                        Files Changed
                      </div>
                      <div className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
                        {`${repoData?.changed_files} ${
                          repoData?.changed_files === 1 ? "file" : "files"
                        } changed with ${repoData?.additions} addition${
                          repoData?.additions === 1 ? "" : "s"
                        } and ${repoData?.deletions} deletion${
                          repoData?.deletions === 1 ? "" : "s"
                        }`}
                      </div>
                      {/* File Cards */}
                      <div className="space-y-6">
                        {/* Show real file changes if available */}
                        {repoData?.changed_files > 0 ? (
                          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-800 flex flex-col gap-2 relative">
                            <div className="flex items-center gap-2 font-medium text-neutral-900 dark:text-white">
                              <svg
                                className="w-5 h-5 text-neutral-400 dark:text-neutral-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                              >
                                <path d="M4 4h16v16H4z" />
                              </svg>
                              README.md
                              <span className="absolute right-4 top-4 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                                Modified
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm mt-1">
                              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                <span className="text-lg">+</span>
                                {repoData?.additions} additions
                              </span>
                              <span className="text-red-500 dark:text-red-400 flex items-center gap-1">
                                <span className="text-lg">-</span>
                                {repoData?.deletions} deletions
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <a
                                href={`${repoData?.html_url}/files`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-1"
                              >
                                View changes on GitHub
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-neutral-600 dark:text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg">
                            No file changes available
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
