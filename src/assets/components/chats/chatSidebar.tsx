"use client";

import Image from "next/image";
import Link from "next/link";
import { useChatSidebarContext } from "./chatSiderbarContext";
import React, { Suspense, useEffect, useRef, useState } from "react"; // Added React, useEffect, useState
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useSession } from "next-auth/react";

type RotatingLogoProps = {
  size?: number;
  speed?: number;
  direction?: "clockwise" | "counter-clockwise";
};

export default function Sidebar() {
  const textRef = useRef(null);
  const { data: session } = useSession();
  const {
    isShrunk,
    setIsShrunk,
    selectedUser,
    setSelectedUser,
    databaseMessages,
    setDatabaseMessages,
    filteredUsers,
    refreshUsers,
    isLoadingUsers,
  } = useChatSidebarContext();

  const RotatingLogo = ({
    size = 1,
    speed = 0.01,
    direction = "clockwise",
  }: RotatingLogoProps) => {
    const modelRef = useRef<THREE.Group>(null);

    const { scene } = useGLTF("/NeowareLogo1.glb");

    useFrame(() => {
      if (modelRef.current) {
        const spinSpeed = direction === "clockwise" ? speed : -speed;
        modelRef.current.rotation.y += spinSpeed;
      }
    });

    return <primitive ref={modelRef} object={scene} scale={size} />;
  };

  const fetchMessages = async (user) => {
    try {
      const username = session?.user?.username;
      const response = await fetch(
        databaseMessages.length == 0
          ? `/api/chat?username=${username}&pageSize=50&selectedUser=${user?.Contributor_id}`
          : `/api/chat?username=${username}&pageSize=50&selectedUser=${
              user?.Contributor_id
            }&cursor=${
              databaseMessages[databaseMessages.length - 1]?.timestamp
            }`
      );
      const data = await response.json();
      console.log(data.messages, "dbmessages");
      if (data.messages) {
        setDatabaseMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const uniqueFilteredUsers = filteredUsers.reduce((unique, user) => {
    if (!unique.some((u) => u.Contributor_id === user.Contributor_id)) {
      unique.push(user);
    }
    return unique;
  }, []);

  // Refresh users when the component mounts
  useEffect(() => {
    refreshUsers();
  }, []);

  return (
    <div>
      <div
        className={
          (isShrunk ? "w-[4rem] mx-auto px-1" : "w-[16rem] px-4") +
          " top-0 z-50 bg-white dark:bg-black fixed h-screen border-r-[1px] dark:border-custom-dark-neutral py-4 transition-all duration-400 ease-in-out" +
          " max-md:w-full max-md:px-2 max-sm:px-1"
        }
        style={{ transitionProperty: "width, padding" }}
      >
        <div className="flex max-md:justify-between">
          <Suspense
            fallback={
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="/NeowareLogo2.png" // Replace with your actual fallback image path
                  alt="Loading logo..."
                />
              </div>
            }
          >
            <div
              style={{ width: "50px", height: "50px", position: "relative" }}
              className="max-sm:w-[40px] max-sm:h-[40px]"
            >
              <Canvas
                camera={{ position: [0, 0, 3] }}
                gl={{ preserveDrawingBuffer: true }}
              >
                <ambientLight intensity={1} />
                <directionalLight position={[2, 2, 5]} intensity={1.5} />
                <RotatingLogo size={2.2} speed={3} direction={`clockwise`} />
              </Canvas>
            </div>
          </Suspense>
          <div className="my-auto overflow-hidden max-sm:hidden">
            <h1
              ref={textRef}
              className={`dark:text-white text-black text-2xl text-center max-md:text-xl max-sm:text-lg`}
              style={{ fontFamily: "var(--font-cypher)" }}
            >
              openwave
            </h1>
          </div>
        </div>

        <div>
          {/* Display Users Section */}
          <div className="pt-7 max-md:pt-4">
            {!isShrunk && (
              <div className="text-[13px] text-neutral-400 py-2 max-md:text-xs">
                Messages
              </div>
            )}

            {!isLoadingUsers && uniqueFilteredUsers.length > 0
              ? uniqueFilteredUsers.map((user: any) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      fetchMessages(user); // Update the selected user
                    }}
                    className="rounded-lg gap-4 text-sm focus:bg-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#27272a] px-2 py-2 flex items-center cursor-pointer max-md:gap-2 max-md:px-1 max-md:py-1"
                    // onClick={() => { /* TODO: Implement chat opening logic if needed */ }}
                  >
                    <img
                      className={`rounded-full`}
                      src={user.image_url || ""} // Provide a fallback avatar
                      alt={user.fullName || "User"}
                      width={isShrunk ? 28 : 24} // Slightly larger avatar when shrunk
                      height={isShrunk ? 28 : 24}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                      }} // Fallback for broken images
                    />
                    {!isShrunk && (
                      <span
                        className="ml-2 truncate max-md:text-xs"
                        title={user.fullName}
                      >
                        {user.fullName}
                      </span>
                    )}
                  </div>
                ))
              : !isLoadingUsers &&
                !isShrunk && (
                  <div className="text-xs text-neutral-500 px-2 py-1 max-md:px-1">
                    No users to display.
                    <button
                      onClick={refreshUsers}
                      className="ml-2 text-blue-500 hover:underline max-md:ml-1 max-md:text-xs"
                    >
                      Refresh
                    </button>
                  </div>
                )}
          </div>

          <div className="pt-7 max-md:pt-4">
            <div
              onClick={refreshUsers}
              className="rounded-lg flex justify-between gap-4 text-sm focus:bg-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#27272a] px-2 py-2 flex items-center cursor-pointer max-md:gap-2 max-md:px-1 max-md:py-1"
            >
              {!isShrunk && (
                <span className="ml-2 max-md:text-xs max-md:ml-1">
                  Refresh Users
                </span>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                className="max-md:w-3 max-md:h-3"
              >
                <path
                  fill="currentColor"
                  d="M7.5 11.173a3.673 3.673 0 1 1 0-7.346a3.673 3.673 0 0 1 0 7.346zm-5.567-1.8a6.2 6.2 0 0 0 5.567 3.527a6.2 6.2 0 0 0 5.567-3.527H15L12 8.6l-3 .773h2.493A4.675 4.675 0 0 1 7.5 12.7A4.675 4.675 0 0 1 3.507 9.9H6L3 8.6L0 9.373h1.933z"
                />
              </svg>
            </div>
            <Link href="/homepage">
              <div className="rounded-lg flex justify-between gap-4 text-sm focus:bg-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#27272a]  px-2 py-2 flex items-center max-md:gap-2 max-md:px-1 max-md:py-1">
                {/* Placeholder for Discover icon, you can use a specific one */}
                {!isShrunk && (
                  <span className="ml-2 max-md:text-xs max-md:ml-1">
                    Exit Chat
                  </span>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  className="max-md:w-3 max-md:h-3"
                >
                  <path
                    fill="currentColor"
                    d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
