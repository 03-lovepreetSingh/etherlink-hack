"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Sidebar from "@/assets/components/sidebar";
import Topbar from "@/assets/components/topbar";
import { useSession } from "next-auth/react";
import { Octokit } from "octokit";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";

import { useWalletClient, usePublicClient } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { deployContract } from "@wagmi/core";
import type { Session } from "next-auth";
import { useSidebarContext } from "@/assets/components/SidebarContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface CustomUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
  id?: string;
}

interface CustomSession {
  accessToken?: string;
  user?: CustomUser;
}

interface GitHubUser {
  login: string;
  id: number;
}

interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: GitHubUser;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  number: number;
  body: string;
  created_at: string;
}

interface SessionData {
  accessToken?: string;
  user?: {
    username?: string;
    email?: string;
  };
}

export default function Project() {
  const session = useSession();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [contractAddress, setContractAddress] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState();
  const [issueUrl, setIssueUrl] = useState<string | undefined>();
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<string | undefined>();
  const [selectedRepo, setSelectedRepo] = useState<string | undefined>();
  const [data, setData] = useState<Repo[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedissue, setSelectedIssue] = useState<string | null>();
  const { isShrunk } = useSidebarContext();
  const { address, isConnected } = useAccount();
  const [issueTitle, setIssueTitle] = useState<string>("");
  const [issueDescription, setIssueDescription] = useState<string>("");
  const [issueCreatedAt, setIssueCreatedAt] = useState<string>("");
  const [rewardAmount, setRewardAmount] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [issueData, setIssueData] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [difficulty, setDifficulty] = useState<string>("");
  const [wallet, setWallet] = useState<boolean>(true);
  const [priority, setPriority] = useState<string>("");
  console.log(selectedRepo, "SelectedRepo");
  const octokit = new Octokit({ auth: token });
  const currentSession = session.data as CustomSession;
  const username: string = currentSession?.user?.username as string;

  const createContract = async () => {
    if (!walletClient) {
      setError("Wallet client not found. Please connect your wallet.");
      return;
    }
    if (!publicClient) {
      setError("Public client not available.");
      return;
    }

    setIsDeploying(true);
    setError("");

    try {
      const constructorArgs = [BigInt(100)]; // Initial contract balance
      const hash = await walletClient.deployContract({
        abi: abi,
        bytecode:
          "0x6080604052348015600e575f5ffd5b50610bea8061001c5f395ff3fe60806040526004361061003e575f3560e01c806312065fe0146100425780632e1a7d4d1461006c57806392878bd014610094578063d0e30db0146100bc575b5f5ffd5b34801561004d575f5ffd5b506100566100c6565b604051610063919061064c565b60405180910390f35b348015610077575f5ffd5b50610092600480360381019061008d9190610693565b610109565b005b34801561009f575f5ffd5b506100ba60048036038101906100b59190610718565b610315565b005b6100c4610550565b005b5f5f5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905090565b5f5f5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205490505f821161018b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610182906107d6565b60405180910390fd5b818110156101ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101c590610864565b60405180910390fd5b81816101da91906108af565b5f5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055503373ffffffffffffffffffffffffffffffffffffffff167f7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b6583604051610260919061064c565b60405180910390a25f3373ffffffffffffffffffffffffffffffffffffffff168360405161028d9061090f565b5f6040518083038185875af1925050503d805f81146102c7576040519150601f19603f3d011682016040523d82523d5f602084013e6102cc565b606091505b5050905080610310576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161030790610993565b60405180910390fd5b505050565b5f5f5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610398576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161038f90610864565b60405180910390fd5b5f8373ffffffffffffffffffffffffffffffffffffffff163b116103f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103e890610a21565b60405180910390fd5b81816103fd91906108af565b5f5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fd37054e910e2653e952b17b957944aaf15ef4ed5e4fc5aedbc3f6b9327df7f388460405161049a919061064c565b60405180910390a35f8373ffffffffffffffffffffffffffffffffffffffff16836040516104c79061090f565b5f6040518083038185875af1925050503d805f8114610501576040519150601f19603f3d011682016040523d82523d5f602084013e610506565b606091505b505090508061054a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161054190610ad5565b60405180910390fd5b50505050565b5f3411610592576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161058990610b63565b60405180910390fd5b345f5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8282546105dd9190610b81565b925050819055503373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c3460405161062a919061064c565b60405180910390a2565b5f819050919050565b61064681610634565b82525050565b5f60208201905061065f5f83018461063d565b92915050565b5f5ffd5b61067281610634565b811461067c575f5ffd5b50565b5f8135905061068d81610669565b92915050565b5f602082840312156106a8576106a7610665565b5b5f6106b58482850161067f565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6106e7826106be565b9050919050565b6106f7816106dd565b8114610701575f5ffd5b50565b5f81359050610712816106ee565b92915050565b5f5f6040838503121561072e5761072d610665565b5b5f61073b85828601610704565b925050602061074c8582860161067f565b9150509250929050565b5f82825260208201905092915050565b7f436f6e7472616374466f727761726465723a20416d6f756e74206d75737420625f8201527f652067726561746572207468616e203000000000000000000000000000000000602082015250565b5f6107c0603083610756565b91506107cb82610766565b604082019050919050565b5f6020820190508181035f8301526107ed816107b4565b9050919050565b7f436f6e7472616374466f727761726465723a20496e73756666696369656e74205f8201527f62616c616e636500000000000000000000000000000000000000000000000000602082015250565b5f61084e602783610756565b9150610859826107f4565b604082019050919050565b5f6020820190508181035f83015261087b81610842565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6108b982610634565b91506108c483610634565b92508282039050818111156108dc576108db610882565b5b92915050565b5f81905092915050565b50565b5f6108fa5f836108e2565b9150610905826108ec565b5f82019050919050565b5f610919826108ef565b9150819050919050565b7f436f6e7472616374466f727761726465723a204661696c656420746f207769745f8201527f6864726177000000000000000000000000000000000000000000000000000000602082015250565b5f61097d602583610756565b915061098882610923565b604082019050919050565b5f6020820190508181035f8301526109aa81610971565b9050919050565b7f436f6e7472616374466f727761726465723a20546172676574206164647265735f8201527f73206d757374206265206120636f6e7472616374000000000000000000000000602082015250565b5f610a0b603483610756565b9150610a16826109b1565b604082019050919050565b5f6020820190508181035f830152610a38816109ff565b9050919050565b7f436f6e7472616374466f727761726465723a204661696c656420746f20666f725f8201527f776172642066756e647320746f207468652074617267657420636f6e7472616360208201527f7400000000000000000000000000000000000000000000000000000000000000604082015250565b5f610abf604183610756565b9150610aca82610a3f565b606082019050919050565b5f6020820190508181035f830152610aec81610ab3565b9050919050565b7f436f6e7472616374466f727761726465723a204465706f736974206d757374205f8201527f62652067726561746572207468616e2030000000000000000000000000000000602082015250565b5f610b4d603183610756565b9150610b5882610af3565b604082019050919050565b5f6020820190508181035f830152610b7a81610b41565b9050919050565b5f610b8b82610634565b9150610b9683610634565b9250828201905080821115610bae57610bad610882565b5b9291505056fea26469706673582212203f4c9d42abe2da556d65c9af5617bf3242e3d636e40afca1951c0369798a825e64736f6c634300081e0033", // Should be imported from confi
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        timeout: 60_000, // 60 second timeout
      });

      if (!receipt.contractAddress) {
        throw new Error("Contract deployment failed - no address in receipt");
      }

      if (receipt.contractAddress) {
        try {
          const response = await fetch("/api/publicProfile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: session?.data?.user?.username, // Replace with the actual user ID
              maintainerWallet: receipt.contractAddress,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setWallet(true);
            setContractAddress(receipt.contractAddress);
            console.log("Success:", data);
          } else {
            const errorData = await response.json();
            console.error("Error:", errorData);
          }
        } catch (error) {
          console.error("Request failed:", error);
        }
      }
    } catch (error) {
      console.error("Contract deployment error:", error);
      setError(
        `Failed to deploy contract: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsDeploying(false);
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

  const {
    data: writeData,
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmationError,
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Set token and user from session
  useEffect(() => {
    if (session.data) {
      const sessionInfo = session.data as SessionData;
      setToken(sessionInfo.accessToken || "");
      setUser(sessionInfo.user?.username);
    }
  }, [session.data]);

  // Fetch repositories
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      if (!session) return;
      const res = await fetch(
        `/api/publicProfile?username=${session.data?.user?.username}`,
        {
          method: "GET",
        }
      );
      const responseData = await res.json();
      setUserData(responseData.user);
      console.log(responseData, "Userss");
    };

    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `/api/manageProjects?projectOwner=${username}`,
          {
            method: "GET",
          }
        );
        const responseData = await response.json();
        if (response.ok) {
          setData(responseData.project as Repo[]);
          console.log(responseData.project, "repos");
        } else {
          console.error(
            "Error fetching repositories:",
            responseData.error || response.statusText
          );
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setData([]);
      }
    };
    fetchUser();
    fetchRepos();
  }, [token, session]);

  useEffect(() => {
    if (!userData) return;
    if (userData[0].maintainerWallet == null) {
      setWallet(false);
    }
  }, [userData]);

  // Fetch issues for selected repo
  useEffect(() => {
    if (!token || !user || !selectedRepo) return;

    const fetchIssues = async () => {
      try {
        const response = await octokit.request(
          `GET /repos/${user}/${selectedRepo}/issues`,
          {
            owner: user,
            repo: selectedRepo,
            state: "open",
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        console.log(response.data, "issuess");
        setIssues(response.data as Issue[]);
      } catch (error) {
        console.error("Error fetching issues:", error);
        setIssues([]);
      }
    };

    fetchIssues();
  }, [token, user, selectedRepo]);

  useEffect(() => {
    if (!selectedissue || !user || !selectedRepo) return;

    const fetchIssueData = async () => {
      try {
        const response = await octokit.request(
          `GET /repos/${user}/${selectedRepo}/issues/${selectedissue}`,
          {
            owner: user,
            repo: selectedRepo,
            issue_number: Number.parseInt(selectedissue),
          }
        );

        const issue = response.data;
        setIssueTitle(issue.title);
        setIssueUrl(issue.html_url);
        setIssueDescription(issue.body || "");
        setIssueCreatedAt(issue.created_at);
        console.log("Issue Data:", issue);
      } catch (error) {
        console.error("Error fetching issue data:", error);
      }
    };

    fetchIssueData();
  }, [selectedissue, user, selectedRepo]);

  useEffect(() => {
    if (isConfirmed) {
      setAlertMessage("Deposit successful! Submitting issue...");
      const createIssue = async () => {
        const currentSession = session.data as CustomSession;
        try {
          await fetch("/api/add-issues", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              issue_name: issueTitle,
              issue_description: issueDescription,
              issue_date: issueCreatedAt,
              issue_url: issueUrl,
              difficulty: difficulty,
              project_issues: selectedissue,
              rewardAmount: rewardAmount,
              priority: priority,
              project_repository: selectedRepo,
              email: currentSession?.user?.email,
            }),
          });
          setAlertMessage("Issue submitted successfully!");
        } catch (error) {
          console.error("Error submitting issue:", error);
          setAlertMessage("Failed to submit issue.");
        }
      };
      createIssue();
    }
    if (confirmationError) {
      setAlertMessage(
        `Deposit failed: ${(confirmationError as Error).message}`
      );
    }
    if (writeError) {
      setAlertMessage(
        `Transaction submission failed: ${(writeError as Error).message}`
      );
    }
  }, [isConfirmed]);

  const addProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !rewardAmount ||
      isNaN(Number(rewardAmount)) ||
      Number(rewardAmount) <= 0
    ) {
      setAlertMessage("Please enter a valid positive reward amount");
      return;
    }

    if (!isConnected || !userData[0].maintainerWallet) {
      setAlertMessage("Connect your wallet first!");
      return;
    }

    if (
      !userData[0].maintainerWallet ||
      !abi ||
      (abi as readonly any[]).length === 0
    ) {
      setAlertMessage("Contract address or ABI is not configured.");
      console.error("Contract address or ABI is not configured.");
      return;
    }

    if (!difficulty || !priority || !selectedRepo || !selectedissue) {
      setAlertMessage("Please fill in all required fields");
      return;
    }

    try {
      const currentSession = session.data as CustomSession;
      const username: string = currentSession?.user?.username as string;

      if (!username) {
        setAlertMessage("User session not found.");
        return;
      }

      if (!userData[0]) return;

      console.log("Attempting to deposit with Wagmi...");
      console.log("Contract Address:", userData[0].maintainerWallet);
      console.log("Reward Amount (string):", rewardAmount);
      console.log("Username:", username);

      writeContract({
        address: userData[0].maintainerWallet as `0x${string}`,
        abi,
        functionName: "deposit",
        value: parseEther(rewardAmount),
      });

      if (isWritePending) {
        setAlertMessage("Processing deposit...");
      }
    } catch (error) {
      console.error("Error in project creation or deposit:", error);
      if (error instanceof Error) {
        setAlertMessage(`Error: ${error.message}`);
      } else {
        setAlertMessage(
          "An unexpected error occurred during project creation."
        );
      }
    }
  };

  return (
    <>
      <Suspense>
        {/* Alert Messages - Responsive positioning */}
        <div className="fixed bottom-4 right-4 z-[100] max-w-sm w-full">
          {alertMessage && (
            <Alert
              className={`mb-2 ${
                isConfirmed
                  ? "bg-green-100 border-green-400 text-green-700"
                  : confirmationError || writeError
                  ? "bg-red-100 border-red-400 text-red-700"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {isConfirmed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : confirmationError || writeError ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle className="text-sm">
                  {isConfirmed
                    ? "Success"
                    : confirmationError || writeError
                    ? "Error"
                    : "Notice"}
                </AlertTitle>
              </div>
              <AlertDescription className="text-sm mt-1">
                {alertMessage}
              </AlertDescription>
            </Alert>
          )}
          {(isWritePending || isConfirming) && (
            <Alert className="bg-blue-100 border-blue-400 text-blue-700">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertTitle className="text-sm">
                  Processing Transaction
                </AlertTitle>
              </div>
              <AlertDescription className="text-sm mt-1">
                {isWritePending &&
                  !isConfirming &&
                  "Please confirm in your wallet..."}
                {isConfirming && "Waiting for transaction confirmation..."}
              </AlertDescription>
            </Alert>
          )}
        </div>

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
            {wallet ? (
              <>
                <div className="mt-16 md:mt-20 p-4 sm:p-6 lg:p-8">
                  <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 lg:mb-8">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                        Create Issue Bounty
                      </h1>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Set up a reward for contributors to solve your GitHub
                        issues
                      </p>
                    </div>

                    {/* Wallet Connection Status */}
                    {!isConnected && (
                      <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Wallet className="h-5 w-5 text-amber-600" />
                            <div>
                              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                Wallet Not Connected
                              </p>
                              <p className="text-xs text-amber-700 dark:text-amber-300">
                                Please connect your wallet to create issue
                                bounties
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Main Form */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">
                          Issue Information
                        </CardTitle>
                        <CardDescription>
                          Fill in the details for your issue bounty
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={addProject} className="space-y-6">
                          {/* Repository and Issue Selection */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                            <div className="space-y-2">
                              <Label
                                htmlFor="projectRepo"
                                className="text-sm font-medium"
                              >
                                Project Repository *
                              </Label>
                              <select
                                id="projectRepo"
                                name="projectRepo"
                                className="dark:bg-neutral-800 w-full p-2 border-2 dark:border-custom-dark-neutral rounded-md"
                                onChange={(e) =>
                                  setSelectedRepo(e.target.value)
                                } // This sets selectedRepo (singular)
                                value={selectedRepo || ""} // Ensure value is not undefined
                                required
                              >
                                <option value="">Select a repository</option>
                                {data?.map(
                                  (
                                    repo: any // data here refers to the list of projects/repos fetched from /api/add-projects
                                  ) => (
                                    <option value={repo.name} key={repo.id}>
                                      {repo.project_repository}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="projectIssue"
                                className="text-sm font-medium"
                              >
                                Select Issue *
                              </Label>
                              <Select
                                value={selectedissue || ""}
                                onValueChange={(value) =>
                                  setSelectedIssue(value)
                                }
                                disabled={!selectedRepo}
                                required
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select an issue" />
                                </SelectTrigger>
                                <SelectContent>
                                  {issues?.map((issue: any) => (
                                    <SelectItem
                                      value={issue.number.toString()}
                                      key={issue.id}
                                    >
                                      {issue.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Difficulty, Priority, and Reward */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            <div className="space-y-2">
                              <Label
                                htmlFor="difficulty"
                                className="text-sm font-medium"
                              >
                                Difficulty *
                              </Label>
                              <Select
                                value={difficulty}
                                onValueChange={setDifficulty}
                                required
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="priority"
                                className="text-sm font-medium"
                              >
                                Priority *
                              </Label>
                              <Select
                                value={priority}
                                onValueChange={setPriority}
                                required
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Low">Low</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                              <Label
                                htmlFor="rewardAmount"
                                className="text-sm font-medium"
                              >
                                Reward Amount (Tezos) *
                              </Label>
                              <Input
                                id="rewardAmount"
                                name="rewardAmount"
                                type="text"
                                className="w-full"
                                value={rewardAmount}
                                onChange={(e) =>
                                  setRewardAmount(e.target.value)
                                }
                                placeholder="e.g., 10.5"
                                required
                              />
                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                            <div className="flex-1">
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                By creating this bounty, you agree to deposit
                                the reward amount to the smart contract. The
                                funds will be released when the issue is
                                successfully resolved.
                              </p>
                            </div>
                            <Button
                              type="submit"
                              className="w-full sm:w-auto px-6 py-2"
                              disabled={
                                isWritePending || isConfirming || !isConnected
                              }
                            >
                              {isWritePending || isConfirming ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Create Bounty"
                              )}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>

                    {/* Help Section */}
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg">
                          How it works
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                            1
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Select a repository and issue from your GitHub
                            projects
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                            2
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Set the difficulty, priority, and reward amount for
                            the issue
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                            3
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Deposit the reward amount to the smart contract
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                            4
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Contributors can work on the issue and submit pull
                            requests
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            ) : (
              <div className="mx-auto text-center w-max-sm pt-40">
                <div className="text-center font-bold text-xl">
                  Create Maintainer Wallet
                </div>
                <div className="text-sm text-neutral-400 dark:text-neutral-600 text-center  ">
                  Execute the contract below to Create an Escrow account for the
                  Maintainer where they can store and transact through.
                </div>
                <div>
                  <Button onClick={() => [createContract()]}>
                    Create Wallet
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Suspense>
    </>
  );
}
