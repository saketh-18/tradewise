// API URL configuration with fallback
const getApiUrl = () => {
  // Check if we're in production (Vercel sets this)
  const envUrl = import.meta.env.VITE_API_URL;
  const fallbackUrl = "https://tradewise-b8jz.onrender.com";
  
  // Return env URL if set, otherwise fallback
  return envUrl || fallbackUrl;
};

export const API_URL = getApiUrl();

// Log API URL in development for debugging (remove in production if needed)
if (import.meta.env.DEV) {
  console.log("API_URL:", API_URL);
}