
import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
});

// ==============================
// AUTHENTICATION APIs
// ==============================

// Signup
export const signupUser = async (userData) => {
    const response = await API.post("/auth/signup", userData);
    return response.data;
};

// Login
export const loginUser = async (userData) => {
    const response = await API.post("/auth/login", userData);
    return response.data;
};

// Logout
export const logoutUser = async () => {
    const response = await API.post("/auth/logout");
    return response.data;
};

// Get current logged-in user
export const getCurrentUser = async () => {
    const response = await API.get("/auth/me");
    return response.data;
};

// ==============================
// OCR API
// ==============================

export const extractText = async (images) => {
    const formData = new FormData();

    images.forEach((image) => {
        formData.append("images", image);
    });

    const response = await API.post("/study/ocr", formData);

    return response.data;
};

// ==============================
// PDF API
// ==============================

export const generatePDF = async (images) => {
    const formData = new FormData();

    images.forEach((image) => {
        formData.append("images", image);
    });

    const response = await API.post("/study/pdf", formData, {
        responseType: "blob"
    });

    return response.data;
};
