"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "./SearchContext"; // Your SearchContext import

// --- SVG Icon Components (for cleanliness) ---
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Sub-component for a single search result ---
const ProjectResultItem = ({ repo, onClose }: { repo: any; onClose: () => void }) => {
  // Defensive parsing for stats
  const stars = parseInt(repo.stars, 10) || 0;
  const forks = parseInt(repo.forks, 10) || 0;
  const contributors = Array.isArray(repo.contributors?.collabs) ? repo.contributors.collabs.length : 0;

  if (!repo.projectName) return null;

  return (
    <Link href={`/projects/${repo.project_repository}`} passHref>
      <div
        onClick={onClose}
        className="group block p-3 rounded-lg transition-colors duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-900"
      >
        <div className="flex justify-between items-center gap-4">
          {/* Main Content */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400">
              {repo.projectName}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
              {repo.shortdes}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1">⭐ {stars}</span>
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"></path></svg>
                {forks}
              </span>
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M10.5 5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z M8 8.25a5.485 5.485 0 00-4.083 1.823.75.75 0 00.916 1.204A4 4 0 018 9.75a4 4 0 013.167 1.527.75.75 0 00.916-1.204A5.485 5.485 0 008 8.25z"></path></svg>
                {contributors}
              </span>
            </div>
          </div>

          {/* Image and Arrow */}
          <div className="flex-shrink-0 flex items-center gap-4">
            {repo.image_url && (
              <img
                src={repo.image_url}
                alt={repo.projectName}
                width={56}
                height={56}
                className="rounded-md object-cover"
              />
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5 text-neutral-400 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};


// --- Main Modal Component ---
export default function SearchModal() {
  const { isSearchOpen, closeSearchModal } = useSearch();
  const [searchTerm, setSearchTerm] = useState("");
  const [repoData, setRepoData] = useState<any[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Effect to fetch data when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setIsLoading(true);
      const findRecords = async () => {
        try {
          const response = await fetch("/api/add-projects");
          const data = await response.json();
          setRepoData(data.project || []);
        } catch (error) {
          console.error("Failed to fetch projects:", error);
          setRepoData([]);
        } finally {
          setIsLoading(false);
        }
      };
      findRecords();
    }
  }, [isSearchOpen]);

  // Effect to filter results based on search term
  useEffect(() => {
    if (!isSearchOpen) {
      setSearchTerm("");
      setFilteredRepos([]);
      return;
    }

    if (searchTerm.trim() === "") {
      setFilteredRepos([]); // Show nothing initially, prompt user to type
    } else {
      setFilteredRepos(
        repoData.filter((repo: any) =>
          (repo.projectName && repo.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (repo.shortdes && repo.shortdes.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
  }, [searchTerm, repoData, isSearchOpen]);

  // Effect for keyboard shortcuts (e.g., closing with Escape key)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSearchModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSearchModal]);

  if (!isSearchOpen) return null;

  return (
    <div
      className="z-50 fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
      onClick={closeSearchModal}
    >
      <div
        className="bg-white dark:bg-[#101010] rounded-xl border border-neutral-200 dark:border-neutral-800 w-[90vw] max-w-2xl max-h-[70vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        {/* Header with Search Input */}
        <div className="relative flex items-center p-2 ">
          <span className="absolute left-5 text-neutral-400 dark:text-neutral-500 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search projects by name or description..."
            className="pl-12 pr-4 py-3 w-full bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <div className="flex-shrink-0 p-3  text-xs text-neutral-400 dark:text-neutral-600 flex justify-end items-center gap-2">
           Close <kbd className="px-2 py-1 text-xs font-semibold text-neutral-500 bg-neutral-100 border border-neutral-200 rounded-md dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-700">Esc</kbd>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-grow overflow-y-auto  scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
          
          
          {!isLoading && filteredRepos.length === 0 && searchTerm.trim() !== "" && (
            <p className="text-center my-auto text-neutral-400 dark:text-neutral-500 py-10">
              No projects found for "{searchTerm}".
            </p>
          )}
          {!isLoading && filteredRepos.length > 0 && (
             <div className="space-y-1">
              {filteredRepos.map((repo: any) => (
                <ProjectResultItem key={repo.projectName} repo={repo} onClose={closeSearchModal} />
              ))}
             </div>
          )}
        </div>

        {/* Footer */}
        
      </div>
    </div>
  );
}