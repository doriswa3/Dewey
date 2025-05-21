import { createContext, useContext, useState, ReactNode } from 'react';

interface Book {
  id: string;
  title: string;
  cover: string;
  author: string;
}

interface Rating {
  category: 'love' | 'like' | 'hate' | 'dnf';
  position: number;
  book: Book;
  review?: string;
  stars?: number; // 1 to 5
}

interface PendingInsert {
  book: Book;
  category: Rating['category'];
  low: number;
  high: number;
  sortedIds: string[];
  review?: string;
  stars?: number;
}

interface RatingContextType {
  ratings: Record<string, Rating>;
  pendingInsert: PendingInsert | null;
  handleRatingCategory: (book: Book, category: Rating['category']) => void;
  resolveComparison: (preferred: 'more' | 'less', review?: string, stars?: number) => void;
  setRating: (bookId: string, book: Book, category: Rating['category'], position: number) => void;
  setReview: (bookId: string, review: string) => void;
  setStars: (bookId: string, stars: number) => void;
  clearPendingInsert: () => void;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export const useRatingContext = () => {
  const context = useContext(RatingContext);
  if (!context) throw new Error("useRatingContext must be used within a RatingProvider");
  return context;
};

export const RatingProvider = ({ children }: { children: ReactNode }) => {
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [pendingInsert, setPendingInsert] = useState<PendingInsert | null>(null);

  const setRating = (bookId: string, book: Book, category: Rating['category'], position: number, review?: string, stars?: number) => {
    setRatings(prev => ({
      ...prev,
      [bookId]: { book, category, position, review, stars },
    }));
  };

  const setReview = (bookId: string, review: string) => {
    setRatings(prev => ({
      ...prev,
      [bookId]: { ...prev[bookId], review },
    }));
  };

  const setStars = (bookId: string, stars: number) => {
    if (stars < 1 || stars > 5) throw new Error("Stars must be between 1 and 5");
    setRatings(prev => ({
      ...prev,
      [bookId]: { ...prev[bookId], stars },
    }));
  };

  const handleRatingCategory = (book: Book, category: Rating['category']) => {
    if (category === 'dnf') {
      setRating(book.id, book, category, 1);
      return;
    }

    const sorted = Object.entries(ratings)
      .filter(([_, r]) => r.category === category)
      .sort(([, a], [, b]) => a.position - b.position)
      .map(([id]) => id);

    if (sorted.length === 0) {
      setRating(book.id, book, category, 0);
      return;
    }

    setPendingInsert({ book, category, low: 0, high: sorted.length, sortedIds: sorted });
  };

  const resolveComparison = (preferred: 'more' | 'less', review?: string, stars?: number) => {
    if (!pendingInsert) return;
    const { book, category, low, high, sortedIds } = pendingInsert;

    if (low === high) {
      const newRatings = { ...ratings };
      for (const [id, value] of Object.entries(newRatings)) {
        if (value.category === category && value.position >= low) {
          newRatings[id] = { ...value, position: value.position + 1 };
        }
      }
      newRatings[book.id] = { book, category, position: low, review, stars };
      setRatings(newRatings);
      setPendingInsert(null);
      return;
    }

    const mid = Math.floor((low + high) / 2);
    const next = preferred === 'more' ? { low, high: mid } : { low: mid + 1, high };
    setPendingInsert({ ...pendingInsert, ...next });
  };

  const clearPendingInsert = () => setPendingInsert(null);

  return (
    <RatingContext.Provider
      value={{
        ratings,
        pendingInsert,
        handleRatingCategory,
        resolveComparison,
        setRating,
        setReview,
        setStars,
        clearPendingInsert,
      }}
    >
      {children}
    </RatingContext.Provider>
  );
};
