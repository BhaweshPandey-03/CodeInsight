import axios from "axios";


const API = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const reviewCode = async ({ code, language }) => {
    try {
        const response = await API.post("/review", {
            code,
            language,
        });
        
        // backend already sends { success, data }
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        
        return {
            success: false,
            error: error.response?.data?.error || "Something went wrong",
        };
    }
};