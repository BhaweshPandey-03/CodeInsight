// JSON Parser

export function jsonParser(data) {
  try {
    // handle already parsed object
    if (typeof data === "object") return data;

    // clean possible extra text around JSON
    const jsonMatch = data.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No valid JSON found");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed;
  } catch (error) {
    console.error("JSON parse error:", error.message);

    // safe fallback (VERY IMPORTANT)
    return {
      summary: "Failed to parse AI response",
      score: 0,
      issues: [],
      refactoredCode: "",
    };
  }
}