
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Join from "./pages/Join";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";

const queryClient = new QueryClient();
import { useRatingContext } from "@/components/contexts/RatingContext";

const TieBreakerPopup = () => {
  const { pendingInsert, resolveComparison, clearPendingInsert, ratings } = useRatingContext();
  
  if (!pendingInsert || pendingInsert.category === "dnf") return null;

  const { book, sortedIds, low, high } = pendingInsert;
  const midId = sortedIds[Math.floor((low + high) / 2)];
  const midBook = ratings[midId]?.book;


  if (!midBook) return null;
  console.log(ratings)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
        <h3 className="font-serif text-lg font-semibold mb-4">Help us rank your books</h3>
        <p className="mb-4">
          Do you prefer <strong>{book.title}</strong> or <strong>{midBook.title}</strong>?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => resolveComparison("more")}
            className="border border-dewey-green text-dewey-green rounded-lg px-4 py-2 font-medium hover:bg-dewey-green hover:text-white transition-colors"
          >
            {book.title}
          </button>
          <button
            onClick={() => resolveComparison("less")}
            className="border border-dewey-green text-dewey-green rounded-lg px-4 py-2 font-medium hover:bg-dewey-green hover:text-white transition-colors"
          >
            {midBook.title}
          </button>
        </div>
      </div>
    </div>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/searchpage" element={<SearchPage />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/join" element={<Join />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <TieBreakerPopup />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
