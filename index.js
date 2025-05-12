app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "너는 다정하고 섬세한 상담가야. 사람들에게 따듯하고 진심 어린 위로와 조언을 해줘.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenAI 응답:", data);

    const reply = data.choices?.[0]?.message?.content || "OpenAI 응답을 이해하지 못했어요.";
    res.json({ reply });

  } catch (err) {
    console.error("OpenAI 요청 오류:", err);
    // 여기서만 응답 보냄
    if (!res.headersSent) {
      res.status(500).json({ error: "OpenAI 요청 중 문제가 발생했어요." });
    }
  }
});