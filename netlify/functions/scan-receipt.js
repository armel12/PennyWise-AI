import { GoogleGenerativeAI } from "@google/generative-ai";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const { imageBase64 } = JSON.parse(event.body || "{}");

    if (!imageBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No image provided" }),
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are a receipt parser.

Extract data from the receipt image and return ONLY valid JSON with this structure:

{
  "merchant": string | null,
  "date": string | null,
  "total": number | null,
  "currency": string | null,
  "items": [
    { "name": string, "price": number | null }
  ]
}

Rules:
- Do not add explanations
- Do not add markdown
- If a value is missing, return null
`;

    const result = await model.generateContent([
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            },
          },
          { text: prompt },
        ],
      },
    ]);

    const text = result.response.text();

    return {
      statusCode: 200,
      body: text,
    };
  } catch (error) {
    console.error("Receipt scan error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Receipt scan failed",
      }),
    };
  }
}
