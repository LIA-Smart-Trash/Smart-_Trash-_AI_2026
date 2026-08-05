import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints FIRST
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Assistant endpoint using Gemini server-side SDK lazily
  app.post("/api/ai-command", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Fallback intelligent response for L.I.A smart robot
        const p = prompt.toLowerCase();
        let actionExec = null;
        let responseText = `Assistente L.I.A: Entendi seu comando "${prompt}". `;
        if (p.includes("venha") || p.includes("traga") || p.includes("aproxima")) {
          actionExec = "summon";
          responseText += "Iniciando modo autônomo. A L.I.A está a caminho até a sua posição!";
        } else if (p.includes("abra") || p.includes("tampa")) {
          actionExec = "open_lid";
          responseText += "Abrindo a tampa da lixeira robótica.";
        } else if (p.includes("fecha") || p.includes("fechar")) {
          actionExec = "close_lid";
          responseText += "Fechando a tampa com segurança.";
        } else if (p.includes("lixo") || p.includes("nível") || p.includes("cheia")) {
          responseText += `O nível atual de lixo é de ${context?.trashLevel ?? 62}%. A capacidade restante é adequada.`;
        } else if (p.includes("bateria")) {
          responseText += `A bateria do robô está em ${context?.batteryLevel ?? 87}%.`;
        } else if (p.includes("luz") || p.includes("led")) {
          actionExec = "toggle_led";
          responseText += "Faróis de LED alternados com sucesso.";
        } else {
          responseText += "Todos os sistemas operacionais. Como posso ajudar com a L.I.A?";
        }

        return res.json({
          response: responseText,
          action: actionExec,
          simulated: true,
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `Você é a inteligência artificial da L.I.A (Lixeira Inteligente Autônoma). Responda sempre em português de forma concisa, educada e direta. Se o usuário pedir para se mover, abrir tampa ou ligar luzes, sugira a ação correspondente no seu texto. Telemetria do Robô: ${JSON.stringify(context || {})}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemInstruction}\nComando do usuário: ${prompt}`,
      });

      return res.json({
        response: response.text || "Comando processado com sucesso.",
        simulated: false,
      });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return res.status(500).json({
        error: "Falha ao processar comando da L.I.A",
        details: error.message,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Liquid Glass server running at http://localhost:${PORT}`);
  });
}

startServer();
