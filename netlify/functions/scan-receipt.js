export async function handler() {
  if (!process.env.GEMINI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "GEMINI_API_KEY is missing",
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "API key is loaded correctly ✅",
    }),
  };
}
