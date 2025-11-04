require('dotenv').config();
const fetch = require('node-fetch');

module.exports = async (topic, type = 'general') => {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  const payload = {
    contents: [
      {
        parts: [
          {
            text: `Only return a VALID JSON object, nothing else.
Summarize the topic "${topic}" as a ${type}, using EXACTLY this structure:
{
  "title": "",
  "verdict": "",
  "summary": "",
  "liked": [""],
  "disliked": [""],
  "bestFor": [""]
}
Strictly fill each field based on actual reviews. Do NOT write any explanations, markdown, or other text before or after.`
          }
        ]
      }
    ]
  };

  // 1. Make the API call
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

  // 2. Error if API fails
  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  // 3. Get and clean the model output text
  const data = await response.json();
  let text = data.candidates[0].content.parts[0].text;

  // Remove Markdown/code blocks if present
  if (typeof text === 'string' && text.trim().startsWith('```')) {
    // Remove all types of triple backtick code fences, with or without language label
    text = text.replace(/```[\s\S]*?({[\s\S]*})[\s\S]*?```/g, '$1');
    // Fallback: remove only ```, if above doesn't match
    text = text.replace(/```/g, '');
  }

  // 4. Parse the JSON safely
  let jsonResult = {};
  try {
    jsonResult = JSON.parse(text);
  } catch (e) {
    // Print raw text for easier debugging if parse fails
    console.error("Invalid Gemini response text:", text);
    throw new Error(`Invalid JSON returned by Gemini: ${text}`);
  }

  // 5. Return structured results, always arrays for list fields
  return {
    title: jsonResult.title || topic,
    verdict: jsonResult.verdict || '',
    summary: jsonResult.summary || '',
    liked: Array.isArray(jsonResult.liked) ? jsonResult.liked : [],
    disliked: Array.isArray(jsonResult.disliked) ? jsonResult.disliked : [],
    bestFor: Array.isArray(jsonResult.bestFor) ? jsonResult.bestFor : []
  };
};

