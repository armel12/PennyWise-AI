import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptData } from "../types";

const parseReceiptImage = async (base64Image: string): Promise<ReceiptData> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Extract mime type and clean base64
  // Format usually: data:image/png;base64,iVBORw0KGgo...
  const matches = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  
  let mimeType = 'image/jpeg'; // Default fallback
  let cleanBase64 = base64Image;

  if (matches && matches.length === 3) {
      mimeType = matches[1];
      cleanBase64 = matches[2];
  } else {
      // Fallback cleanup if regex didn't match perfectly but it has a prefix
      cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: `Analyze this receipt image. Extract the total amount, the date, the merchant name, and a suggested category.
            
            Categories must be one of: 'Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Education', 'Savings', 'Other'.
            
            If the category is unclear, use 'Other'.
            If the date is unclear, use today's date in YYYY-MM-DD format.
            If the total is unclear, return 0.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            total: { type: Type.NUMBER, description: "The total amount paid." },
            merchant: { type: Type.STRING, description: "The name of the store or merchant." },
            date: { type: Type.STRING, description: "The date of purchase in YYYY-MM-DD format." },
            category: { 
              type: Type.STRING, 
              enum: ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Education', 'Savings', 'Other'],
              description: "The category of the expense."
            },
            items: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of item names found on the receipt."
            }
          },
          required: ["total", "category"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI returned empty response.");
    }

    const data = JSON.parse(text) as ReceiptData;
    return data;

  } catch (error: any) {
    console.error("Error parsing receipt with Gemini:", error);
    // Propagate the actual error message for better debugging
    throw new Error(error.message || "Failed to scan receipt. Please try again.");
  }
};

export { parseReceiptImage };
