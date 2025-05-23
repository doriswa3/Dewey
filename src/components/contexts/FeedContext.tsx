import React, { createContext, useContext, useState, ReactNode } from "react";

interface FeedPost {
  username: string;
  userImage: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  content: string;
  rating?: number;
  comparisonBook?: string;
  comparisonResult?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

interface FeedContextType {
  feedPosts: FeedPost[];
  addFeedPost: (post: FeedPost) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const useFeedContext = () => {
  const context = useContext(FeedContext);
  if (!context) throw new Error("useFeedContext must be used within a FeedProvider");
  return context;
};

export const FeedProvider = ({ children }: { children: ReactNode }) => {
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);

  const addFeedPost = (post: FeedPost) => {
    setFeedPosts((prev) => [post, ...prev]);
  };

  return (
    <FeedContext.Provider value={{ feedPosts, addFeedPost }}>
      {children}
    </FeedContext.Provider>
  );
};
