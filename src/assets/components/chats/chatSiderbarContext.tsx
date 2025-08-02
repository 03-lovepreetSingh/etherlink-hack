'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
// Define a more specific type for a user if available, otherwise 'any' is a placeholder
type UserType = any; 

type SidebarContextType = {
  isShrunk: boolean;
  setIsShrunk: (val: boolean) => void;
  selectedUser: UserType | null; // Updated type
  setSelectedUser: (user: UserType | null) => void; // Updated type
  allUsers: UserType[];
  assignedUsers: UserType[];
  filteredUsers: UserType[];
  refreshUsers: () => Promise<void>;
  isLoadingUsers: boolean;
  databaseMessages: ChatMessage[];
  setDatabaseMessages: (messages: ChatMessage[]) => void;
};

interface ChatMessage {
  id: number;
  text: string;
  timestamp: string;
  sender_id: string;
  reciever_id: string;
  image_url?: string;
}

const chatSidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const ChatSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {data:session}=useSession();
  const [isShrunk, setIsShrunk] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [databaseMessages, setDatabaseMessages] = useState<ChatMessage[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

   

  const fetchAssignedUsers = useCallback(async () => {
    if (!session?.user?.username) {
      console.log("No session or username available");
      return [];
    }
    
    try {
      const response = await fetch(`/api/chatContributors?projectOwner=${session?.user?.username}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Assigned users fetched:", data);
      setAssignedUsers(data.project || []);
      return data || [];
    } catch (error) {
      console.error("Error fetching assigned users:", error);
      return [];
    }
  }, [session?.user?.username]);

  const refreshUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      await Promise.all([fetchAssignedUsers()]);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [fetchAssignedUsers]);

  // Update filtered users whenever allUsers or assignedUsers changes
  useEffect(() => {
    const filterUsers = () => {
      if (assignedUsers.length > 0) {
        console.log("Filtered users updated:", assignedUsers);
        setFilteredUsers(assignedUsers);
      } else {
        setFilteredUsers([]);
      }
    };
    
    filterUsers();
  }, [assignedUsers]);

  // Initial fetch - only when session is loaded
  useEffect(() => {
    if (session?.user?.username) {
      refreshUsers();
    }
  }, [session?.user?.username, refreshUsers]);

  const contextValue = useMemo(() => ({
    isShrunk, 
    setIsShrunk, 
    selectedUser, 
    setSelectedUser,
    databaseMessages,
    setDatabaseMessages,
    allUsers,
    assignedUsers,
    filteredUsers,
    refreshUsers,
    isLoadingUsers
  }), [
    isShrunk, 
    setIsShrunk, 
    selectedUser,
    databaseMessages,
    setDatabaseMessages, 
    setSelectedUser,
    allUsers,
    assignedUsers,
    filteredUsers,
    refreshUsers,
    isLoadingUsers
  ]);
  
  return (
    <chatSidebarContext.Provider value={contextValue}>
      {children}
    </chatSidebarContext.Provider>
  );
};

export const useChatSidebarContext = () => {
  const ctx = useContext(chatSidebarContext);
  if (!ctx) throw new Error("useChatSidebarContext must be used within ChatSidebarProvider");
  return ctx;
};


