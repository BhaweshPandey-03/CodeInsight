import {api} from "./api";

// GET USER HISTORY
export const getReviewHistory = async () => {
  const res = await api.get("/history");
  return res.data;
};

// SAVE REVIEW
export const saveReviewHistory = async (reviewData) => {
  const res = await api.post("/history", reviewData);
  return res.data;
};

// DELETE REVIEW
export const deleteReviewHistory = async (id) => {
  const res = await api.delete(`/history/${id}`);
  return res.data;
};
