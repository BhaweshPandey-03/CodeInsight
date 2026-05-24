import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { deleteReviewHistory, getReviewHistory } from "../services/historyApi";
import HistoryCard from "../components/history/HistoryCard.jsx";

export default function History() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReviews = async () => {
        try {
            setLoading(true);

            const data = await getReviewHistory();

            setReviews(data);
        } catch (error) {
            console.error(error);

            toast.error("Failed to load review history");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (id) => {
      try {
        await deleteReviewHistory(id);

        setReviews((prev) => prev.filter((review) => review._id !== id));

        toast.success("Review deleted");
      } catch (error) {
        console.error(error);

        toast.error("Failed to delete review");
      }
    };


    useEffect(() => {
        fetchReviews();
    }, []);


    return (
      <div className="app-gradient min-h-screen p-6">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Review History</h1>

            <p className="mt-2 text-sm text-muted">
              Browse and restore your previous AI review sessions
            </p>
          </div>

          {/* CONTENT */}
          <div className="surface rounded-2xl border border-subtle p-6">
            {loading ? (
              <div className="flex h-[500px] items-center justify-center">
                <p className="text-sm text-muted">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex h-[500px] items-center justify-center rounded-xl border border-dashed border-subtle">
                <p className="text-sm text-muted">No review history yet</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {reviews.map((review) => (
                  <HistoryCard
                    key={review._id}
                    review={review}
                    onDelete={handleDeleteReview} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
}
