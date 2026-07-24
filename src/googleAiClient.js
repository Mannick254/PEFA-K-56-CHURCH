import { GoogleGenerativeAI } from "@google/generative-ai";

// For security, we use environment variables to store the Google AI API Key.
// This prevents sensitive credentials from being hardcoded in the source code.
//
// HOW TO USE:
//
// 1. Create a file named \`.env\` in the root of your project (if it doesn\'t
//    already exist).
//
// 2. Add the following lines to your \`.env\` file:
//
//    VITE_GOOGLE_AI_API_KEY="YOUR_GOOGLE_AI_API_KEY"
//
// 3. Replace "YOUR_GOOGLE_AI_API_KEY" with your actual
//    Google AI API Key.
//
// 4. IMPORTANT: Make sure your \`.env\` file is listed in your \`.gitignore\` file
//    to prevent it from being committed to version control.

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

export default genAI;
