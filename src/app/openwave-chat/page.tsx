"use client";

import type React from "react";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import { signIn, useSession } from "next-auth/react";
import { io, type Socket } from "socket.io-client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Sidebar from "@/assets/components/chats/chatSidebar";
import Topbar from "@/assets/components/chats/chatTopbar";
import { useChatSidebarContext } from "@/assets/components/chats/chatSiderbarContext";
import { redirect } from "next/navigation";

// Define message types
interface ChatMessage {
  text: string;
  timestamp: string;
  to: string;
  from: string;
  pending?: boolean;
  failed?: boolean;
}

interface SessionData {
  accessToken?: string;
  user?: {
    username?: string;
    email?: string;
  };
}

interface DatabaseMessage {
  id: number;
  text: string;
  timestamp: string;
  sender_id: string;
  reciever_id: string;
  image_url?: string;
}

interface User {
  username?: string;
  email?: string;
  name?: string;
  image?: string;
}

interface session {
  accessToken?: string;
  expires?: string;
  user?: {
    username?: string;
    email?: string;
    name?: string;
    image?: string;
  };
}

type ConnectionStatus = "disconnected" | "connecting" | "connected";

export default function OptimizedChatPage() {
  const { data: session } = useSession();
  const [shouldRestoreScroll, setShouldRestoreScroll] = useState(null);

  const memoizedSession = useMemo(() => session, [session]);
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Context from sidebar

  const {
    isShrunk,
    selectedUser,
    isLoadingUsers,
    refreshUsers,
    databaseMessages,
    setDatabaseMessages,
  } = useChatSidebarContext();

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      setIsLoadingMessages(true);
      setIsLoadingMoreMessages(true);

      // Store current scroll position and height before loading
      const container = messagesContainerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;

      const username = memoizedSession?.user?.username;
      const response = await fetch(
        databaseMessages.length === 0
          ? `/api/chat?username=${username}&pageSize=50&selectedUser=${selectedUser?.Contributor_id}`
          : `/api/chat?username=${username}&pageSize=50&selectedUser=${
              selectedUser?.Contributor_id
            }&cursor=${
              databaseMessages[databaseMessages.length - 1]?.timestamp
            }`
      );
      const data = await response.json();
      console.log(data.messages, "dbmessages");

      if (data.messages && data.messages.length > 0) {
        setDatabaseMessages((prevMessages) => [
          ...prevMessages,
          ...data.messages,
        ]);

        // Use requestAnimationFrame to ensure DOM has been updated
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              const heightDifference = newScrollHeight - scrollHeight;
              container.scrollTop = scrollTop + heightDifference;
            }
          });
        });
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoadingMessages(false);
      setIsLoadingMoreMessages(false);
    }
  };
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const saveMessageToBackend = useCallback(async (msg: ChatMessage) => {
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
    } catch (error) {
      console.error("Failed to save message to backend:", error);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Only auto-scroll if not loading more messages AND it's a new message (not loading older ones)
    if (!isLoadingMoreMessages && !isLoadingMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, databaseMessages, isLoadingMoreMessages, isLoadingMessages]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Socket connection management
  const connectSocket = useCallback(() => {
    if (!memoizedSession?.user?.username || socketRef.current?.connected) {
      return;
    }

    console.log(`Connecting as ${memoizedSession?.user?.username}...`);
    setConnectionStatus("connecting");
    setErrorMessage(null);

    const socket = io("https://gitfund-chat-8uaxx.ondigitalocean.app", {
      auth: { username: memoizedSession?.user?.username },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
    });

    // Connection events
    socket.on("connect", () => {
      console.log("✅ Connected to chat server");
      setConnectionStatus("connected");
      setErrorMessage(null);
      setIsReconnecting(false);
      // Clear any pending reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Disconnected: ${reason}`);
      setConnectionStatus("disconnected");
      if (reason === "io server disconnect") {
        setErrorMessage("Server disconnected. Attempting to reconnect...");
        setIsReconnecting(true);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
      setConnectionStatus("disconnected");
      setErrorMessage(`Connection failed: ${error.message}`);
    });

    // Authentication events
    socket.on("authenticated", (data: { username: string }) => {
      console.log(`🔐 Authenticated as ${data.username}`);
    });

    // User list events
    socket.on("usersList", (data: { users: string[] }) => {
      console.log("👥 Users list updated:", data.users);
      setActiveUsers(data.users);
      refreshUsers();
    });

    // Message events
    socket.on("privateMessage", (msg: ChatMessage) => {
      console.log("💬 Received message:", msg);
      setMessages((prev) => [...prev, { ...msg, pending: false }]);
    });

    // Error handling
    socket.on("error", (error: string) => {
      console.error("Socket error:", error);
      setErrorMessage(error);
    });

    socketRef.current = socket;
  }, [refreshUsers, memoizedSession]);

  // Initialize socket connection
  useEffect(() => {
    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectSocket]);

  // Handle reconnection
  useEffect(() => {
    if (
      connectionStatus === "disconnected" &&
      !isReconnecting &&
      memoizedSession?.user?.username
    ) {
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("🔄 Attempting to reconnect...");
        setIsReconnecting(true);
        connectSocket();
      }, 3000);
    }
  }, [
    connectionStatus,
    isReconnecting,
    (memoizedSession?.user as User)?.username,
    connectSocket,
  ]);

  const sendMessage = useCallback(() => {
    const socket = socketRef.current;
    if (
      !socket?.connected ||
      !selectedUser ||
      !messageInput.trim() ||
      !(memoizedSession?.user as User)?.username
    ) {
      return;
    }

    const messageId = `${Date.now()}-${Math.random()}`;
    const newMessage: ChatMessage = {
      text: messageInput.trim(),
      timestamp: new Date().toISOString(),
      to: selectedUser.id,
      from: memoizedSession?.user?.username as string,
      pending: true,
    };

    // Add message optimistically
    setMessages((prev) => [...prev, { ...newMessage }]);
    setMessageInput("");

    // Send to server with callback
    socket.emit(
      "privateMessage",
      {
        to: selectedUser.id,
        text: newMessage.text,
        timestamp: newMessage.timestamp,
      },
      (response: { success?: boolean; error?: string; timestamp?: string }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.timestamp === newMessage.timestamp &&
            msg.from === newMessage.from
              ? {
                  ...msg,
                  pending: false,
                  failed: !!response.error,
                  timestamp: response.timestamp || msg.timestamp,
                }
              : msg
          )
        );

        if (response.error) {
          saveMessageToBackend({
            ...newMessage,
            pending: false,
            failed: false,
            timestamp: response.timestamp || newMessage.timestamp,
          });
          console.error("Message send failed:", response.error);
          setErrorMessage(response.error);
        } else {
          console.log("✅ Message sent successfully");
          saveMessageToBackend({
            ...newMessage,
            pending: false,
            failed: false,
            timestamp: response.timestamp || newMessage.timestamp,
          });
        }
      }
    );
  }, [
    selectedUser,
    messageInput,
    (memoizedSession?.user as User)?.username,
    saveMessageToBackend,
  ]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const retryFailedMessage = useCallback((failedMessage: ChatMessage) => {
    if (!socketRef.current?.connected || !failedMessage.failed) return;

    // Remove failed flag and mark as pending
    setMessages((prev) =>
      prev.map((msg) =>
        msg === failedMessage ? { ...msg, pending: true, failed: false } : msg
      )
    );

    // Retry sending
    socketRef.current.emit(
      "privateMessage",
      {
        to: failedMessage.to,
        text: failedMessage.text,
        timestamp: failedMessage.timestamp,
      },
      (response: { success?: boolean; error?: string }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.timestamp === failedMessage.timestamp
              ? { ...msg, pending: false, failed: !!response.error }
              : msg
          )
        );
      }
    );
  }, []);

  // Show sign-in if not authenticated
  if (!session) {
  }

  // Filter messages for current conversation
  const conversationMessages = messages.filter(
    (msg) =>
      (msg.from === (memoizedSession?.user as User)?.username &&
        msg.to === selectedUser?.id) ||
      (msg.from === selectedUser?.id &&
        msg.to === (memoizedSession?.user as User)?.username)
  );

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-w-0",
          isMobile
            ? "ml-0 w-full"
            : isShrunk
            ? "ml-16 w-[calc(100%-4rem)]"
            : "ml-64 w-[calc(100%-16rem)]"
        )}
      >
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Connection Status Bar */}
          {connectionStatus !== "connected" && (
            <div className="bg-yellow-100 dark:bg-yellow-900 border-b border-yellow-200 dark:border-yellow-800 px-2 sm:px-4 py-2">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                  {connectionStatus === "connecting" && (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-yellow-600"></div>
                      <span className="hidden xs:inline">
                        Connecting to chat server...
                      </span>
                      <span className="xs:hidden">Connecting...</span>
                    </>
                  )}
                  {connectionStatus === "disconnected" && (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
                      <span className="hidden xs:inline">
                        Disconnected from chat server
                      </span>
                      <span className="xs:hidden">Disconnected</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-100 dark:bg-red-900 border-b border-red-200 dark:border-red-800 px-2 sm:px-4 py-2">
              <div className="flex items-center justify-center">
                <span className="text-xs sm:text-sm text-red-800 dark:text-red-200 text-center">
                  {errorMessage}
                </span>
              </div>
            </div>
          )}

          {/* Main Chat Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!selectedUser ? (
              <div className="flex flex-col items-center justify-center flex-1 px-4">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/NeowareLogo2.png" // Replace with your actual fallback image path
                    alt="openwave"
                    width={isMobile ? 100 : 100}
                    height={isMobile ? 100 : 100}
                  />
                </div>
                <h1
                  className={`dark:text-white text-black text-2xl text-center max-md:text-xl max-sm:text-lg`}
                  style={{ fontFamily: "var(--font-cypher)" }}
                >
                  openwave chat
                </h1>

                <p className="text-sm xs:text-base lg:text-sm text-neutral-600 dark:text-neutral-400 text-center px-2">
                  Collaborate on open-source projects seamlessly.
                  <br />
                  Stay in sync across devices and contributors.
                </p>
                {isLoadingUsers && (
                  <p className="mt-2 text-xs sm:text-sm text-neutral-500">
                    Loading users...
                  </p>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Chat header */}
                <div className="flex-shrink-0 p-2 xs:p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950">
                  <div className="flex items-center gap-2 xs:gap-3">
                    <img
                      src={selectedUser.image_url || "/placeholder.svg"}
                      width={isMobile ? 28 : 40}
                      height={isMobile ? 28 : 40}
                      alt="User avatar"
                      className="rounded-full flex-shrink-0 w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm xs:text-base sm:text-lg lg:text-xl font-semibold truncate">
                        {selectedUser.fullName}
                      </h2>
                      <p className="text-xs sm:text-sm">
                        {activeUsers.includes(selectedUser.id) ? (
                          <span className="text-green-500 flex items-center">
                            <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-500 rounded-full mr-1 flex-shrink-0" />
                            <span className="hidden xs:inline">Online</span>
                            <span className="xs:hidden">•</span>
                          </span>
                        ) : (
                          <span className="text-neutral-500 flex items-center">
                            <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-neutral-400 rounded-full mr-1 flex-shrink-0" />
                            <span className="hidden xs:inline">Offline</span>
                            <span className="xs:hidden">•</span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Container - Scrollable */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900"
                >
                  <div className="p-2 xs:p-3 sm:p-4 space-y-2 xs:space-y-3 sm:space-y-4 min-h-full">
                    {/* Load More Messages Button/Loader */}
                    {databaseMessages.length > 0 && (
                      <div className="flex justify-center mb-4">
                        {isLoadingMessages ? (
                          <div className="flex items-center gap-2 text-neutral-500">
                            <div className="w-4 h-4 border-2 border-neutral-300 border-t-blue-500 rounded-full animate-spin"></div>
                            <span className="text-sm">Loading messages...</span>
                          </div>
                        ) : (
                          <Button
                            onClick={fetchMessages}
                            variant="outline"
                            size="sm"
                            className="text-xs xs:text-sm"
                          >
                            Load More Messages
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Database Messages */}
                    {databaseMessages?.map((msg, id) => (
                      <div
                        key={`db-${msg.timestamp}-${id}`}
                        className={cn(
                          "flex gap-1.5 xs:gap-2 sm:gap-3",
                          msg.sender_id === memoizedSession?.user?.username
                            ? "flex-row-reverse"
                            : "flex-row"
                        )}
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={
                              msg.sender_id === memoizedSession?.user?.username
                                ? memoizedSession.user?.image ||
                                  "/placeholder.svg"
                                : selectedUser.image_url || "/placeholder.svg"
                            }
                            width={isMobile ? 24 : 32}
                            height={isMobile ? 24 : 32}
                            alt="User avatar"
                            className="rounded-full w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8"
                          />
                        </div>
                        <div
                          className={cn(
                            "flex flex-col max-w-[80%] xs:max-w-[75%] sm:max-w-[70%] md:max-w-[65%]",
                            msg.sender_id === memoizedSession?.user?.username
                              ? "items-end"
                              : "items-start"
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center gap-1 xs:gap-2 mb-1",
                              msg.sender_id ===
                                (memoizedSession?.user as User)?.username
                                ? "flex-row-reverse"
                                : "flex-row"
                            )}
                          >
                            <h3 className="text-xs sm:text-sm font-medium truncate max-w-[120px] xs:max-w-[150px] sm:max-w-none">
                              {msg.sender_id ===
                              (session?.user as User)?.username
                                ? (session?.user as User)?.username
                                : selectedUser.fullName}
                            </h3>
                            <span className="text-xs text-neutral-400 flex-shrink-0">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div
                            className={cn(
                              "p-2 xs:p-2.5 sm:p-3 rounded-lg text-xs xs:text-sm sm:text-base break-words",
                              msg.sender_id ===
                                (memoizedSession?.user as User)?.username
                                ? "bg-blue-500 text-white rounded-br-sm"
                                : "bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-bl-sm border border-neutral-200 dark:border-neutral-600"
                            )}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Real-time Messages */}
                    {conversationMessages?.map((msg, id) => (
                      <div
                        key={`rt-${msg.timestamp}-${id}`}
                        className={cn(
                          "flex gap-1.5 xs:gap-2 sm:gap-3",
                          msg.from === memoizedSession?.user?.username
                            ? "flex-row-reverse"
                            : "flex-row"
                        )}
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={
                              msg.from === memoizedSession?.user?.username
                                ? memoizedSession.user?.image ||
                                  "/placeholder.svg"
                                : selectedUser.image_url || "/placeholder.svg"
                            }
                            width={isMobile ? 24 : 32}
                            height={isMobile ? 24 : 32}
                            alt="User avatar"
                            className="rounded-full w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8"
                          />
                        </div>
                        <div
                          className={cn(
                            "flex flex-col max-w-[80%] xs:max-w-[75%] sm:max-w-[70%] md:max-w-[65%]",
                            msg.from === memoizedSession?.user?.username
                              ? "items-end"
                              : "items-start"
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center gap-1 xs:gap-2 mb-1",
                              msg.from ===
                                (memoizedSession?.user as User)?.username
                                ? "flex-row-reverse"
                                : "flex-row"
                            )}
                          >
                            <h3 className="text-xs sm:text-sm font-medium truncate max-w-[120px] xs:max-w-[150px] sm:max-w-none">
                              {msg.from ===
                              (memoizedSession?.user as User)?.username
                                ? memoizedSession.user?.name
                                : selectedUser.fullName}
                            </h3>
                            <span className="text-xs text-neutral-400 flex-shrink-0">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div
                            className={cn(
                              "p-2 xs:p-2.5 sm:p-3 rounded-lg text-xs xs:text-sm sm:text-base break-words",
                              msg.from ===
                                (memoizedSession?.user as User)?.username
                                ? "bg-blue-500 text-white rounded-br-sm"
                                : "bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-bl-sm border border-neutral-200 dark:border-neutral-600"
                            )}
                          >
                            {msg.text}
                          </div>
                          {(msg.pending || msg.failed) && (
                            <div className="mt-1 text-xs opacity-75 flex items-center">
                              {msg.pending && <span className="ml-1">⏳</span>}
                              {msg.failed && (
                                <button
                                  onClick={() => retryFailedMessage(msg)}
                                  className="ml-1 text-red-300 hover:text-red-100"
                                  title="Click to retry"
                                >
                                  ⚠️
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Empty State */}
                    {conversationMessages.length === 0 &&
                      databaseMessages?.length === 0 && (
                        <div className="flex items-center justify-center h-full min-h-[200px]">
                          <div className="text-center text-neutral-500 px-4">
                            <p className="text-xs xs:text-sm sm:text-base">
                              No messages yet. Start the conversation!
                            </p>
                          </div>
                        </div>
                      )}

                    {/* Auto-scroll anchor */}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input - Fixed at bottom */}
                <div className="flex-shrink-0 p-2 xs:p-3 sm:p-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex gap-1.5 xs:gap-2 sm:gap-3">
                    <Input
                      type="text"
                      placeholder={`Message ${
                        selectedUser.username || selectedUser.id
                      }...`}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={connectionStatus !== "connected"}
                      className="flex-1 text-xs xs:text-sm sm:text-base h-8 xs:h-9 sm:h-10"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={
                        !messageInput.trim() || connectionStatus !== "connected"
                      }
                      className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm sm:text-base flex-shrink-0 h-8 xs:h-9 sm:h-10"
                    >
                      <span className="hidden xs:inline">Send</span>
                      <span className="xs:hidden">→</span>
                    </Button>
                  </div>
                  {selectedUser && !activeUsers.includes(selectedUser.id) && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 xs:mt-2 px-1">
                      <span className="hidden xs:inline">
                        ⚠️ User appears offline. Messages may not be delivered
                        immediately.
                      </span>
                      <span className="xs:hidden">⚠️ User offline</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
