"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWriteContract } from "wagmi";
import { deployContract } from "@wagmi/core";
import { useWalletClient, usePublicClient } from "wagmi";
import { parseEther } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  MapPin,
  MessageCircle,
  Twitter,
  Linkedin,
  Wallet,
  Shield,
  User,
  Code,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Link from "next/link";
interface UserSession {
  user?: {
    username?: string;
    email?: string;
    name?: string;
    image?: string;
  };
}
import { useSignup } from "../../context/SignupContext";
import { useShowSignup } from "../../context/showSignupContext";
import { config } from "@/config/index";
interface FormData {
  metaMask: string;
  Location: string;
  Bio: string;
  Telegram: string;
  Twitter: string;
  Linkedin: string;
  skills: string[];
  termsAccepted: boolean;
  formFilled: boolean;
}

const PROGRAMMING_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "Solidity",
  "Web3",
  "Blockchain",
  "Smart Contracts",
  "DeFi",
  "NFT",
  "Docker",
  "Kubernetes",
  "AWS",
  "MongoDB",
];

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

export default function MultiStepSignup() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [contractAddress, setContractAddress] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession() as { data: UserSession | null };
  const [showSignup, setSShowSignup] = useState(false);
  const { setShowSignup: setContextShowSignup } = useSignup();
  const [publicProfile, setPublicProfile] = useState();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    metaMask: contractAddress,
    Location: "",
    Bio: "",
    Telegram: "",
    Twitter: "",
    Linkedin: "",
    skills: [],
    formFilled: true,
    termsAccepted: false,
  });
  const [customSkill, setCustomSkill] = useState("");
  console.log(showSignup, "showSignup");
  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.user?.username) return;

      try {
        const res = await fetch(
          `/api/publicProfile?username=${session.user.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const userData = data.user?.[0];
          setPublicProfile(userData);

          if (userData) {
            setSShowSignup(!userData.formFilled);
            setContextShowSignup(!userData.formFilled);
          } else {
            // If no user data, show signup form
            setSShowSignup(true);
            setContextShowSignup(true);
          }
        } else {
          // If API error, show signup form
          setSShowSignup(true);
          setContextShowSignup(true);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        // If network error, show signup form
        setSShowSignup(true);
        setContextShowSignup(true);
      }
    };

    fetchUsers();
  }, [session?.user?.username]);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      updateFormData("skills", [...formData.skills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    updateFormData(
      "skills",
      formData.skills.filter((s) => s !== skill)
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      addSkill(customSkill.trim());
      setCustomSkill("");
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.termsAccepted;
      case 2:
        return formData.metaMask.trim() !== "";
      case 3:
        return formData.Location.trim() !== "" && formData.Bio.trim() !== "";
      case 4:
        return formData.skills.length > 0;
      default:
        return false;
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  async function createWallet() {
    try {
      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: session?.user?.username, // Replace with actual user ID or username
          walletBalance: "0", // Must be string if using Decimal in DB
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Wallet error:", data.error);
        return;
      }

      console.log("✅ Wallet updated:", data);
    } catch (error) {
      console.error("❌ Network or server error:", error);
    }
  }

  const handleSubmit = async () => {
    if (!session?.user) {
      setSubmitError("User session not available");
      return;
    }
    createWallet();

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const postData = {
        ...formData,
        skills: JSON.stringify(formData.skills),
        image_url: session.user.image || "",
        id: session.user.username,
        fullName: session.user.name || "",
        email: session.user.email,
      };

      console.log("Submitting data:", postData);

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        // Close signup after successful submission
        setTimeout(() => {
          setSShowSignup(false);
          setContextShowSignup(false);
        }, 2000);
      } else {
        const errorData = await res.json();
        setSubmitError(errorData.message || "Failed to submit form");
      }
    } catch (error) {
      setSubmitError("Network error: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    setContractAddress("");

    try {
      const constructorArgs = [BigInt(100)]; // Initial contract balance
      const hash = await walletClient.deployContract({
        abi: abi,
        bytecode:
          "0x6080604052348015600e575f5ffd5b50335f5f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506107fc8061005b5f395ff3fe608060405260043610610041575f3560e01c8062f714ce1461009a57806312065fe0146100c25780638da5cb5b146100ec578063d0e30db01461011657610096565b36610096573373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c3460405161008c919061042f565b60405180910390a2005b5f5ffd5b3480156100a5575f5ffd5b506100c060048036038101906100bb91906104d0565b610120565b005b3480156100cd575f5ffd5b506100d661035a565b6040516100e3919061042f565b60405180910390f35b3480156100f7575f5ffd5b50610100610361565b60405161010d919061052e565b60405180910390f35b61011e610385565b005b5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101ae576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101a5906105a1565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361021c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161021390610609565b60405180910390fd5b8147101561025f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161025690610671565b60405180910390fd5b5f8173ffffffffffffffffffffffffffffffffffffffff1683604051610284906106bc565b5f6040518083038185875af1925050503d805f81146102be576040519150601f19603f3d011682016040523d82523d5f602084013e6102c3565b606091505b5050905080610307576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102fe9061071a565b60405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff167f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a94243648460405161034d919061042f565b60405180910390a2505050565b5f47905090565b5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f34116103c7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103be906107a8565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c3460405161040d919061042f565b60405180910390a2565b5f819050919050565b61042981610417565b82525050565b5f6020820190506104425f830184610420565b92915050565b5f5ffd5b61045581610417565b811461045f575f5ffd5b50565b5f813590506104708161044c565b92915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61049f82610476565b9050919050565b6104af81610495565b81146104b9575f5ffd5b50565b5f813590506104ca816104a6565b92915050565b5f5f604083850312156104e6576104e5610448565b5b5f6104f385828601610462565b9250506020610504858286016104bc565b9150509250929050565b5f61051882610476565b9050919050565b6105288161050e565b82525050565b5f6020820190506105415f83018461051f565b92915050565b5f82825260208201905092915050565b7f43616c6c6572206973206e6f7420746865206f776e65720000000000000000005f82015250565b5f61058b601783610547565b915061059682610557565b602082019050919050565b5f6020820190508181035f8301526105b88161057f565b9050919050565b7f496e76616c696420726563697069656e742061646472657373000000000000005f82015250565b5f6105f3601983610547565b91506105fe826105bf565b602082019050919050565b5f6020820190508181035f830152610620816105e7565b9050919050565b7f496e73756666696369656e7420636f6e74726163742062616c616e63650000005f82015250565b5f61065b601d83610547565b915061066682610627565b602082019050919050565b5f6020820190508181035f8301526106888161064f565b9050919050565b5f81905092915050565b50565b5f6106a75f8361068f565b91506106b282610699565b5f82019050919050565b5f6106c68261069c565b9150819050919050565b7f4574686572207472616e73666572206661696c656400000000000000000000005f82015250565b5f610704601583610547565b915061070f826106d0565b602082019050919050565b5f6020820190508181035f830152610731816106f8565b9050919050565b7f4465706f73697420616d6f756e74206d757374206265206772656174657220745f8201527f68616e207a65726f000000000000000000000000000000000000000000000000602082015250565b5f610792602883610547565b915061079d82610738565b604082019050919050565b5f6020820190508181035f8301526107bf81610786565b905091905056fea2646970667358221220c0996c6a2f52f74e26786a99d9de719b482d6204e0d5b0f9b2fd093212289d0064736f6c634300081e0033", // Should be imported from confi
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        timeout: 60_000, // 60 second timeout
      });

      if (!receipt.contractAddress) {
        throw new Error("Contract deployment failed - no address in receipt");
      }

      setContractAddress(receipt.contractAddress);
      updateFormData("metaMask", receipt.contractAddress);
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

  const stepIcons = [
    { icon: Shield, label: "Terms" },
    { icon: Wallet, label: "Wallet" },
    { icon: User, label: "Profile" },
    { icon: Code, label: "Skills" },
  ];

  return (
    <>
      {showSignup && (
        <div className="fixed inset-0 z-[999] bg-neutral-50 dark:bg-neutral-900 backdrop-blur-xl">
          <div className="flex px-4 py-4 lg:py-1  items-center justify-between mb-6">
            <div className="space-y-2">
              <div className="flex gap-1">
                <img
                  src="/NeowareLogo2.png"
                  alt="openwave Logo"
                  width="24"
                  height="24"
                />
                <h2
                  className={`my-auto text-xl`}
                  style={{ fontFamily: "var(--font-cypher)" }}
                >
                  openwave
                </h2>
              </div>
            </div>
            <div className="font-bold hidden md:block">
              {currentStep === 1 && (
                <>
                  <div className="gap-3 flex p-4 my-auto bg-gradient-to-br from-neutral-200/20 to-neutral-300/20 rounded-full flex items-center justify-center border border-neutral-300/30 dark:from-neutral-800/20 dark:to-neutral-700/20 dark:border-neutral-700/30">
                    <Shield className="w-8 h-8 text-neutral-700 dark:text-neutral-300" />
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                        Terms and Conditions
                      </h3>
                    </div>
                  </div>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <div className="flex gap-3 p-4 my-auto bg-gradient-to-br from-neutral-200/20 to-neutral-300/20 rounded-full flex items-center justify-center border border-neutral-300/30 dark:from-neutral-800/20 dark:to-neutral-700/20 dark:border-neutral-700/30">
                    <Wallet className="w-8 h-8 text-neutral-700 dark:text-neutral-300" />
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                        Wallet Creation
                      </h3>
                    </div>
                  </div>
                </>
              )}
              {currentStep === 3 && (
                <>
                  <div className="flex gap-3 p-4 my-auto bg-gradient-to-br from-neutral-200/20 to-neutral-300/20 rounded-full flex items-center justify-center border border-neutral-300/30 dark:from-neutral-800/20 dark:to-neutral-700/20 dark:border-neutral-700/30">
                    <User className="w-8 h-8 text-neutral-700 dark:text-neutral-300" />
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                        Profile Details
                      </h3>
                    </div>
                  </div>
                </>
              )}
              {currentStep === 4 && (
                <>
                  <div className="flex gap-3 p-4 my-auto bg-gradient-to-br from-neutral-200/20 to-neutral-300/20 rounded-full flex items-center justify-center border border-neutral-300/30 dark:from-neutral-800/20 dark:to-neutral-700/20 dark:border-neutral-700/30">
                    <Code className="w-8 h-8 text-neutral-700 dark:text-neutral-300" />
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                        Skills
                      </h3>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="text-right gap-4 flex">
              <div className="lg:text-lg text-sm text-neutral-500 mb-1 dark:text-neutral-400">
                Progress
              </div>
              <div className="lg:text-lg text-sm font-bold text-neutral-900 dark:text-white">
                {currentStep}/{totalSteps}
              </div>
            </div>
          </div>
          <Progress
            value={progress}
            className="h-2 -mt-4 bg-neutral-200/50 dark:bg-neutral-700/50"
          />
          <div className="flex min-h-screen items-center justify-center ">
            <div className="overflow-y-auto max-w-5xl custom-scrollbar w-full bg-neutral-50 dark:bg-neutral-900  backdrop-blur-sm ">
              <div className="relative overflow-hidden">
                <div className="relative z-10">{/* Step Indicators */}</div>
              </div>
              <div className="p-8">
                <div className="min-h-[400px]">
                  {/* Step 1: Terms and Conditions */}
                  {currentStep === 1 && (
                    <div className="space-y-8 animate-in fade-in-50 duration-500">
                      <div className="block lg:hidden flex gap-4 mx-auto justify-center items-center">
                        <div className="w-16 h-16 my-auto bg-gradient-to-br from-neutral-200/20 to-neutral-300/20 rounded-full flex items-center justify-center border border-neutral-300/30 dark:from-neutral-800/20 dark:to-neutral-700/20 dark:border-neutral-700/30">
                          <Shield className="w-8 h-8 text-neutral-700 dark:text-neutral-300" />
                        </div>
                        <div className="w-[100%_-_64px]">
                          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Terms and Conditions
                          </h3>
                          <p className="text-neutral-500 text-sm max-w-60 mx-auto dark:text-neutral-400">
                            Please review and accept our terms to continue with
                            your openwave journey
                          </p>
                        </div>
                      </div>
                      <div className="bg-neutral-100/50 rounded-xl p-6 border border-neutral-300/30 max-h-80 overflow-y-auto custom-scrollbar dark:bg-gradient-to-br dark:from-neutral-800/50 dark:to-neutral-800/50 dark:border-neutral-700/30">
                        <div className="text-sm text-neutral-700 space-y-6 dark:text-neutral-300">
                          <div>
                            <h4 className="font-bold text-neutral-900 text-lg mb-3 flex items-center gap-2 dark:text-white">
                              <div className="w-2 h-2 bg-neutral-700 rounded-full dark:bg-neutral-300" />
                              openwave Platform Agreement
                            </h4>
                            <p className="leading-relaxed">
                              By joining openwave, you agree to contribute to
                              open-source projects and earn rewards based on
                              your contributions. This platform connects
                              developers with meaningful projects and provides
                              fair compensation for quality work.
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-neutral-900 mb-3 dark:text-white">
                              Key Terms:
                            </h5>
                            <ul className="space-y-3">
                              {[
                                "You must provide accurate information in your profile",
                                "All contributions must be original work or properly attributed",
                                "Rewards are distributed based on contribution quality and impact",
                                "You retain ownership of your contributions while granting usage rights",
                                "Platform fees may apply to certain transactions",
                                "You agree to maintain professional conduct in all interactions",
                              ].map((term, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-3"
                                >
                                  <div className="w-1.5 h-1.5 bg-neutral-700 rounded-full mt-2 flex-shrink-0 dark:bg-neutral-300" />
                                  <span>{term}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold text-neutral-900 mb-3 dark:text-white">
                              Privacy:
                            </h5>
                            <p className="leading-relaxed">
                              Your personal information will be protected
                              according to our privacy policy. We only collect
                              necessary information to facilitate project
                              matching and payments.
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-neutral-900 mb-3 dark:text-white">
                              Wallet Integration:
                            </h5>
                            <p className="leading-relaxed">
                              By connecting your MetaMask wallet, you authorize
                              secure transactions for receiving rewards and
                              participating in the openwave ecosystem.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-neutral-100/10 rounded-lg border border-neutral-300/20 dark:bg-gradient-to-r dark:from-neutral-800/10 dark:to-neutral-700/10 dark:border-neutral-700/20">
                        <Checkbox
                          id="terms"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) =>
                            updateFormData("termsAccepted", checked)
                          }
                          className="border-neutral-700 data-[state=checked]:bg-neutral-800 dark:border-neutral-300 dark:data-[state=checked]:bg-neutral-200"
                        />
                        <Label
                          htmlFor="terms"
                          className="text-neutral-700 cursor-pointer dark:text-neutral-300"
                        >
                          I have read and agree to the Terms and Conditions
                        </Label>
                      </div>
                    </div>
                  )}
                  {/* Step 2: Wallet Information */}
                  {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in-50 duration-500">
                      <div className="block lg:hidden text-center space-y-4">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-neutral-200/20 to-neutral-300/20 rounded-full flex items-center justify-center border border-neutral-300/30 dark:from-neutral-800/20 dark:to-neutral-700/20 dark:border-neutral-700/30">
                          <Wallet className="w-10 h-10 text-neutral-700 dark:text-neutral-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                          Connect Your Wallet
                        </h3>
                        <p className="text-neutral-500 max-w-md mx-auto dark:text-neutral-400">
                          We need your MetaMask wallet address to process
                          rewards securely
                        </p>
                      </div>
                      <div className="max-w-md mx-auto space-y-6">
                        <div className="bg-neutral-100/50 rounded-xl p-8 border border-neutral-300/30 text-center dark:bg-neutral-800 dark:from-neutral-800/50 dark:to-neutral-800/50 dark:border-neutral-700/30">
                          <div className="text-xl font-bold mb-6 text-neutral-900 dark:text-white">
                            Connect to your wallet
                          </div>
                          <div className="flex justify-center mb-6">
                            {/* Placeholder for appkit-button */}
                            <appkit-button />
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <div className="flex items-center gap-4 p-4 bg-neutral-100/10 rounded-lg border border-neutral-300/20 dark:bg-neutral-80 dark:from-neutral-800/10 dark:to-neutral-700/10 dark:border-neutral-700/20">
                            <Wallet className="w-8 h-8 text-neutral-700 dark:text-neutral-300" />
                            <Button
                              onClick={createContract}
                              className="bg-neutral-800 hover:bg-neutral-900 text-white font-semibold px-6 dark:bg-neutral-200 dark:hover:bg-neutral-300 dark:text-neutral-900"
                            >
                              Sign Contract
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Step 3: Personal Information */}
                  {currentStep === 3 && (
                    <div className="space-y-8 animate-in fade-in-50 duration-500">
                      <div className="block lg:hidden text-center space-y-4">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-neutral-200/20 to-neutral-300/20 rounded-full flex items-center justify-center border border-neutral-300/30 dark:from-neutral-800/20 dark:to-neutral-700/20 dark:border-neutral-700/30">
                          <User className="w-10 h-10 text-neutral-700 dark:text-neutral-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                          Personal Information
                        </h3>
                        <p className="text-neutral-500 max-w-md mx-auto dark:text-neutral-400">
                          Tell us about yourself and where you're based
                        </p>
                      </div>
                      <div className="max-w-2xl mx-auto space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="location"
                              className="text-neutral-900 font-medium flex items-center gap-2 dark:text-white"
                            >
                              <MapPin className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                              Location *
                            </Label>
                            <Input
                              id="location"
                              placeholder="e.g., San Francisco, CA"
                              value={formData.Location}
                              onChange={(e) =>
                                updateFormData("Location", e.target.value)
                              }
                              className="bg-neutral-100/50 border-neutral-300/50 text-neutral-900 placeholder-neutral-500 focus:border-neutral-800 focus:ring-neutral-800/20 dark:bg-neutral-700/50 dark:border-neutral-600/50 dark:text-white dark:placeholder-neutral-400 dark:focus:border-neutral-200 dark:focus:ring-neutral-200/20"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="bio"
                            className="text-neutral-900 font-medium dark:text-white"
                          >
                            Bio *
                          </Label>
                          <Textarea
                            id="bio"
                            placeholder="Tell us about your experience, interests, and what motivates you to contribute to open source..."
                            value={formData.Bio}
                            onChange={(e) =>
                              updateFormData("Bio", e.target.value)
                            }
                            className="bg-neutral-100/50 border-neutral-300/50 text-neutral-900 placeholder-neutral-500 focus:border-neutral-800 focus:ring-neutral-800/20 min-h-[120px] resize-none dark:bg-neutral-700/50 dark:border-neutral-600/50 dark:text-white dark:placeholder-neutral-400 dark:focus:border-neutral-200 dark:focus:ring-neutral-200/20"
                          />
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            This helps project maintainers understand your
                            background
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Step 4: Skills and Social Links */}
                  {currentStep === 4 && (
                    <div className="space-y-8 animate-in fade-in-50 duration-500">
                      <div className="block lg:hidden text-center space-y-4">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-neutral-200/20 to-neutral-300/20 rounded-full flex items-center justify-center border border-neutral-300/30 dark:from-neutral-800/20 dark:to-neutral-700/20 dark:border-neutral-700/30">
                          <Code className="w-10 h-10 text-neutral-700 dark:text-neutral-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                          Skills & Social Links
                        </h3>
                        <p className="text-neutral-500 max-w-md mx-auto dark:text-neutral-400">
                          Showcase your expertise and connect your profiles
                        </p>
                      </div>
                      <div className="max-w-4xl mx-auto space-y-8">
                        {/* Skills Section */}
                        <div className="space-y-4">
                          <Label className="text-neutral-900 font-medium text-lg dark:text-white">
                            Skills *
                          </Label>
                          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-300/30 dark:bg-neutral-900 dark:border-neutral-700/30">
                            <div className="flex flex-wrap gap-3 mb-4">
                              {PROGRAMMING_SKILLS.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant={
                                    formData.skills.includes(skill)
                                      ? "default"
                                      : "outline"
                                  }
                                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                                    formData.skills.includes(skill)
                                      ? "bg-neutral-800 hover:bg-neutral-900 text-white border-0 shadow-lg dark:bg-neutral-200 dark:hover:bg-neutral-300 dark:text-neutral-900"
                                      : "bg-neutral-100/50 hover:bg-neutral-200/50 text-neutral-700 border-neutral-300/50 hover:border-neutral-400 dark:bg-neutral-700/50 dark:hover:bg-neutral-600/50 dark:text-neutral-300 dark:border-neutral-600/50 dark:hover:border-neutral-500"
                                  }`}
                                  onClick={() =>
                                    formData.skills.includes(skill)
                                      ? removeSkill(skill)
                                      : addSkill(skill)
                                  }
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-3">
                              <Input
                                placeholder="Add custom skill..."
                                value={customSkill}
                                onChange={(e) => setCustomSkill(e.target.value)}
                                onKeyPress={(e) =>
                                  e.key === "Enter" && addCustomSkill()
                                }
                                className="bg-neutral-50 border-neutral-300/50 text-neutral-900 placeholder-neutral-500 focus:border-neutral-800 focus:ring-neutral-800/20 dark:bg-neutral-900 dark:border-neutral-600/50 dark:text-white dark:placeholder-neutral-400 dark:focus:border-neutral-200 dark:focus:ring-neutral-200/20"
                              />
                              <Button
                                type="button"
                                onClick={addCustomSkill}
                                size="sm"
                                className="bg-neutral-800 hover:bg-neutral-900 text-white px-4 dark:bg-neutral-200 dark:hover:bg-neutral-300 dark:text-neutral-900"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            {formData.skills.length > 0 && (
                              <div className="mt-4 space-y-3">
                                <p className="text-sm text-neutral-500 font-medium dark:text-neutral-400">
                                  Selected skills:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {formData.skills.map((skill) => (
                                    <Badge
                                      key={skill}
                                      className="bg-neutral-800 text-white border-0 dark:bg-neutral-200 dark:text-neutral-900"
                                    >
                                      {skill}
                                      <X
                                        className="h-3 w-3 ml-2 cursor-pointer hover:text-neutral-500 transition-colors dark:hover:text-neutral-500"
                                        onClick={() => removeSkill(skill)}
                                      />
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Social Links */}
                        <div className="space-y-4">
                          <Label className="text-neutral-900 font-medium text-lg flex items-center gap-2 dark:text-white">
                            Social Links (Optional)
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label
                                htmlFor="telegram"
                                className="text-neutral-900 flex items-center gap-2 dark:text-white"
                              >
                                <MessageCircle className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                                Telegram
                              </Label>
                              <Input
                                id="telegram"
                                placeholder="@username"
                                value={formData.Telegram}
                                onChange={(e) =>
                                  updateFormData("Telegram", e.target.value)
                                }
                                className="bg-neutral-100/50 border-neutral-300/50 text-neutral-900 placeholder-neutral-500 focus:border-neutral-800 focus:ring-neutral-800/20 dark:bg-neutral-700/50 dark:border-neutral-600/50 dark:text-white dark:placeholder-neutral-400 dark:focus:border-neutral-200 dark:focus:ring-neutral-200/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="twitter"
                                className="text-neutral-900 flex items-center gap-2 dark:text-white"
                              >
                                <Twitter className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                                Twitter
                              </Label>
                              <Input
                                id="twitter"
                                placeholder="@username"
                                value={formData.Twitter}
                                onChange={(e) =>
                                  updateFormData("Twitter", e.target.value)
                                }
                                className="bg-neutral-100/50 border-neutral-300/50 text-neutral-900 placeholder-neutral-500 focus:border-neutral-800 focus:ring-neutral-800/20 dark:bg-neutral-700/50 dark:border-neutral-600/50 dark:text-white dark:placeholder-neutral-400 dark:focus:border-neutral-200 dark:focus:ring-neutral-200/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="linkedin"
                                className="text-neutral-900 flex items-center gap-2 dark:text-white"
                              >
                                <Linkedin className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                                LinkedIn
                              </Label>
                              <Input
                                id="linkedin"
                                placeholder="profile-url"
                                value={formData.Linkedin}
                                onChange={(e) =>
                                  updateFormData("Linkedin", e.target.value)
                                }
                                className="bg-neutral-100/50 border-neutral-300/50 text-neutral-900 placeholder-neutral-500 focus:border-neutral-800 focus:ring-neutral-800/20 dark:bg-neutral-700/50 dark:border-neutral-600/50 dark:text-white dark:placeholder-neutral-400 dark:focus:border-neutral-200 dark:focus:ring-neutral-200/20"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-8  border-t border-neutral-300/30  dark:border-neutral-700/30">
                <div className="w-full space-y-4">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="border-neutral-300/50 text-neutral-700 hover:bg-neutral-100/50 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-600/50 dark:text-neutral-300 dark:hover:bg-neutral-700/50"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    {currentStep < totalSteps ? (
                      <Button
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className="bg-neutral-800 hover:bg-neutral-900 text-white disabled:opacity-50 disabled:cursor-not-allowed px-8 dark:bg-neutral-200 dark:hover:bg-neutral-300 dark:text-neutral-900"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={!canProceed() || isSubmitting}
                        className="bg-neutral-800 hover:bg-neutral-900 text-white disabled:opacity-50 disabled:cursor-not-allowed px-8 dark:bg-neutral-200 dark:hover:bg-neutral-300 dark:text-neutral-900"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-neutral-800/30 border-t-neutral-800 rounded-full animate-spin mr-2 dark:border-white/30 dark:border-t-white" />
                            Submitting...
                          </>
                        ) : (
                          "Complete Signup"
                        )}
                      </Button>
                    )}
                  </div>
                  {submitError && (
                    <Alert
                      variant="destructive"
                      className="bg-neutral-200/20 border-neutral-400/30 animate-in fade-in-50 dark:bg-neutral-800/20 dark:border-neutral-600/30"
                    >
                      <CheckCircle className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                      <AlertTitle className="text-neutral-700 dark:text-neutral-300">
                        Error
                      </AlertTitle>
                      <AlertDescription className="text-neutral-600 dark:text-neutral-400">
                        {submitError}
                      </AlertDescription>
                    </Alert>
                  )}
                  {submitSuccess && (
                    <Alert
                      variant="default"
                      className="bg-neutral-200/20 border-neutral-400/30 animate-in fade-in-50 dark:bg-neutral-800/20 dark:border-neutral-600/30"
                    >
                      <CheckCircle className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                      <AlertTitle className="text-neutral-700 dark:text-neutral-300">
                        Success
                      </AlertTitle>
                      <AlertDescription className="text-neutral-600 dark:text-neutral-400">
                        Profile submitted successfully! Closing in 2 seconds...
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
