export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("REQ BODY:", req.body);

  try {
    const { paragraphs } = req.body;

    if (!paragraphs || paragraphs.length === 0) {
      return res.status(400).json({ error: "No paragraphs provided" });
    }

    // Combine all paragraphs into one text
    const combinedText = paragraphs.join("\n\n");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You create clear multiple-choice quiz questions. Format each question as: Question [number]: [question text]\nA) [option A]\nB) [option B]\nC) [option C]\nD) [option D]\nCorrect Answer: [letter]\n\n",
          },
          {
            role: "user",
            content: `Create multiple choice questions from the following text:\n\n${combinedText}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const raw = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Groq error",
        raw,
      });
    }

    const data = JSON.parse(raw);
    const result = data.choices[0].message.content;

    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({
      error: "Server crashed",
      message: err.message,
    });
  }
}
