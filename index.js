app.post("/chat", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "너는 다정하고 섬세한 상담가야. 사람들에게 따듯하고 진심 어린 위로와 조언을 해줘."
          },
          {
            role: "user",
            content: req.body.message
          }
        ]
      })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "OpenAI 응답을 이해하지 못했어요.";
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "OpenAI 요청 실패", details: error.message });
  }
});