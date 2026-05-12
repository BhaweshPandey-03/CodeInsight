import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("codeinsight_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const loginUser = async ({ email, password }) => {
  const response = await API.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async ({ name, email, password }) => {
  const response = await API.post("/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
};

export const verifyEmailToken = async (token) => {
  const response = await API.post("/auth/verify-email", {
    token,
  });

  return response.data;
};

export const resendVerificationEmail = async () => {
  const response = await API.post("/auth/resend-verification");

  return response.data;
};

export const reviewCode = async ({ code, language }) => {
  try {
    const response = await API.post("/review", {
      code,
      language,
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong",
      code: error.response?.data?.code,
      usage: error.response?.data?.usage,
    };
  }
};
