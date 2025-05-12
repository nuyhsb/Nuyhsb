const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

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
            content:
              "너는 다정하고 섬세한 상담가야. 진심 어린 위로와 조언을 해줘. 중요한 단어나 강조하고 싶은 표현은 <span class='highlight'>태그</span>로 감싸서 표현해줘. 항상 마지막에 어울리는 이모티콘 하나도 붙여줘.",
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
    if (!res.headersSent) {
      res.status(500).json({ error: "OpenAI 요청 중 문제가 발생했어요." });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중`);
});