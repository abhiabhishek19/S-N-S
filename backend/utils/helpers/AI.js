// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI("process.env.GOOGLE_API_KEY");
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// export const generateResult = async (prompt) => {
//   const result = await model.generateContent(prompt);
//   return result.response.text();
// };
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";


const key = process.env.GOOGLE_API_KEY;

const genAI = new GoogleGenerativeAI(key);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateResult = async (prompt) => {
  try {
    console.log("Generating AI response for prompt:", prompt);
    const result = await model.generateContent(prompt);
    if (!result || !result.response || !result.response.text) {
      throw new Error("Invalid response from Google Generative AI API.");
    }
    const responseText = result.response.text();
    console.log("AI response generated:", responseText);
    return responseText;
  } catch (error) {
    console.error("Error generating AI response:", error.message);
    throw new Error("Failed to generate AI response. Please try again later.");
  }
};

