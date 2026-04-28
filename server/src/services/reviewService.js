import axios from "axios";
import { jsonParser } from "../utils/util.js";
const demoCode = `function fetchData(url){
    fetch(url)
    .then(res => res.json())
    .then(data => console.log(data))
}`;

export const reviewService = async (code = demoCode, language = "JavaScript") => {
  const url = "https://api.groq.com/openai/v1/chat/completions";
    // code = demoCode;
  try {
    const response = await axios.post(
      url,
      {
        model: "llama-3.1-8b-instant",
          temperature: 0.1,
       
        max_tokens: 1000,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a senior code reviewer.

                You MUST return ONLY valid JSON.
                Do NOT include any explanation, markdown, or text outside JSON.

                Strictly follow this schema:
                {
                "summary": "High-level overview",
                "score": number (1-10),
                "issues": [
                    { "type": "security|performance|style", "line": number, "description": "string", "suggestion": "string" }
                ],
                "refactoredCode": "string"
                }

                If no issues, return empty array for "issues".`,
          },
          {
            role: "user",
            content: `Review this ${language} code:\n\n${code}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    // extract actual AI message
    const aiOutput = response.data.choices[0].message.content;
    // const aiOutput = {
    //   summary:
    //     "Code fetches data from a URL but does not handle potential errors or return values.",
    //   score: 4,
    //   issues: [
    //     {
    //       type: "performance",
    //       line: 3,
    //       description:
    //         "The function does not handle potential errors that may occur during the fetch or json parsing process.",
    //       suggestion: "Use try-catch blocks to handle potential errors.",
    //     },
    //     {
    //       type: "style",
    //       line: 1,
    //       description:
    //         "The function name fetchData is not descriptive and does not follow camelCase convention.",
    //       suggestion: "Rename the function to something like fetchUrlData.",
    //     },
    //     {
    //       type: "style",
    //       line: 4,
    //       description:
    //         "The function does not return any value, it only logs the data to the console.",
    //       suggestion:
    //         "Consider returning the data or using a callback function to handle the result.",
    //     },
    //   ],
    //   refactoredCode:
    //     "function fetchUrlData(url) {\n  try {\n    return fetch(url)\n      .then(res => res.json())\n      .then(data => data);\n  } catch (error) {\n    console.error('Error fetching data:', error);\n    return null;\n  }\n}",
    // };
      const parsed = jsonParser(aiOutput);
      
    
    // console.log("response :", response);
    console.log("aiOutput :", aiOutput);
    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    console.error(
      "reviewService error:",
      // error.response?.data || error.message,
    );

    return {
      error: "AI request failed",
    };
  }
};



