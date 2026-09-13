import express from "express";
import path from "path";
import https from "https";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Cached BCV Exchange Rate
interface CachedBCVData {
  rate: number;
  rateRaw: number;
  euroRate: number;
  euroRaw: number;
  currency: string;
  source: string;
  valueDate: string;
  lastUpdated: string;
  cachedAt: number;
}

let cachedBCV: CachedBCVData = {
  rate: 842.21,
  rateRaw: 842.2067,
  euroRate: 977.88,
  euroRaw: 977.8778,
  currency: "USD",
  source: "Banco Central de Venezuela (bcv.org.ve)",
  valueDate: "Martes, 15 Septiembre 2026",
  lastUpdated: new Date().toISOString(),
  cachedAt: Date.now(),
};

async function fetchFromOfficialBCV(): Promise<CachedBCVData | null> {
  return new Promise((resolve) => {
    const req = https.get(
      "https://www.bcv.org.ve",
      { rejectUnauthorized: false, timeout: 6000 },
      (res) => {
        let html = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          html += chunk;
        });
        res.on("end", () => {
          try {
            const dolarMatch = html.match(
              /id="dolar"[\s\S]*?strong-tb">([\s\d,.]+)<\/strong>/i
            );
            const euroMatch = html.match(
              /id="euro"[\s\S]*?strong-tb">([\s\d,.]+)<\/strong>/i
            );
            const fechaMatch = html.match(
              /Fecha Valor:[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i
            );

            if (dolarMatch && dolarMatch[1]) {
              const rawDolarStr = dolarMatch[1].trim().replace(/\./g, "").replace(",", ".");
              const rawEuroStr = euroMatch && euroMatch[1]
                ? euroMatch[1].trim().replace(/\./g, "").replace(",", ".")
                : "977.88";

              const rateNum = parseFloat(rawDolarStr);
              const euroNum = parseFloat(rawEuroStr);
              const cleanFecha = fechaMatch && fechaMatch[1]
                ? fechaMatch[1].trim().replace(/\s+/g, " ")
                : "Martes, 15 Septiembre 2026";

              if (!isNaN(rateNum) && rateNum > 0) {
                return resolve({
                  rate: Number(rateNum.toFixed(2)),
                  rateRaw: rateNum,
                  euroRate: !isNaN(euroNum) ? Number(euroNum.toFixed(2)) : 977.88,
                  euroRaw: !isNaN(euroNum) ? euroNum : 977.8778,
                  currency: "USD",
                  source: "Banco Central de Venezuela (bcv.org.ve)",
                  valueDate: cleanFecha,
                  lastUpdated: new Date().toISOString(),
                  cachedAt: Date.now(),
                });
              }
            }
            resolve(null);
          } catch {
            resolve(null);
          }
        });
      }
    );
    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function fetchFromDolarAPI(): Promise<CachedBCVData | null> {
  try {
    const resp = await fetch("https://ve.dolarapi.com/v1/dolares/oficial", {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });
    if (!resp.ok) return null;
    const data: any = await resp.json();
    if (data && typeof data.promedio === "number" && data.promedio > 0) {
      return {
        rate: Number(data.promedio.toFixed(2)),
        rateRaw: data.promedio,
        euroRate: 977.88,
        euroRaw: 977.8778,
        currency: "USD",
        source: "DolarAPI Oficial (BCV Mirror)",
        valueDate: data.fechaActualizacion
          ? new Date(data.fechaActualizacion).toLocaleDateString("es-VE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "Septiembre 2026",
        lastUpdated: new Date().toISOString(),
        cachedAt: Date.now(),
      };
    }
  } catch {
    // fallback
  }
  return null;
}

// Real-Time BCV Endpoint
app.get("/api/bcv", async (req, res) => {
  const forceRefresh = req.query.refresh === "true";
  const now = Date.now();
  // 5-minute cache unless user clicks refresh
  if (!forceRefresh && now - cachedBCV.cachedAt < 5 * 60 * 1000) {
    return res.json({ ...cachedBCV, fromCache: true, success: true });
  }

  const liveBCV = await fetchFromOfficialBCV();
  if (liveBCV) {
    cachedBCV = liveBCV;
    return res.json({ ...cachedBCV, fromCache: false, success: true });
  }

  const liveDolarAPI = await fetchFromDolarAPI();
  if (liveDolarAPI) {
    cachedBCV = liveDolarAPI;
    return res.json({ ...cachedBCV, fromCache: false, success: true });
  }

  return res.json({
    ...cachedBCV,
    fromCache: true,
    success: true,
    warning: "Tasa verificada de contingencia",
  });
});

// Lazy-initialized Gemini instance
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// AI Financial Advisor Endpoint
app.post("/api/mentor", async (req, res) => {
  try {
    const { playerState, query, context } = req.body;
    
    const ai = getAI();
    if (!ai) {
      // Return smart simulated mentor feedback if API key is not configured yet
      return res.json({
        advice: `💡 **Informe Táctico del Mentor**: Basado en tu balance general actual (${playerState?.selectedArchetype?.title || 'Jugador'} con $${playerState?.financials?.cash?.toLocaleString() || 0} en efectivo y $${playerState?.financials?.passiveIncome || 0}/mes de ingreso pasivo), tu objetivo principal es mantener tus gastos mensuales controlados y adquirir activos que generen flujo de caja positivo. Siempre calcula el Retorno sobre Efectivo (ROI): (Flujo Anual / Efectivo Invertido). ¡Si supera el 20%, normalmente vale la pena aprovecharlo!`,
        source: "simulated",
      });
    }

    const systemInstruction = `Eres "CyberKiyosaki", un mentor financiero perspicaz, ingenioso y de alta energía en un juego de educación financiera 3D cyberpunk inspirado en CIFRAFLOW de Robert Kiyosaki.
Hablas a jóvenes en ESPAÑOL utilizando términos modernos, claros y directos (ROI, flujo de caja, activos vs pasivos, deuda buena vs deuda mala, escapar de la carrera de ratas).
Reglas:
1. Responde SIEMPRE en ESPAÑOL.
2. Enfatiza que los Activos PONEN dinero en tu bolsillo (flujo de caja positivo) y los Pasivos SACAN dinero de tu bolsillo.
3. Sé conciso y contundente (2 a 4 oraciones con 1 cálculo o punto clave si es relevante).
4. Analiza los números específicos del jugador (Efectivo, Salario, Ingreso Pasivo, Gastos, Deudas).
5. Da un veredicto accionable: COMPRAR, PASAR, PAGAR DEUDA o APALANCARSE.`;

    const prompt = `Estado Actual del Jugador:
- Arquetipo: ${playerState?.selectedArchetype?.title || playerState?.archetype?.title}
- Salario: $${playerState?.financials?.salary}/mes
- Ingreso Pasivo: $${playerState?.financials?.passiveIncome}/mes
- Gastos Totales: $${playerState?.financials?.totalExpenses || playerState?.financials?.expenses}/mes
- Flujo Neto Mensual: $${playerState?.financials?.monthlyCashflow}/mes
- Efectivo Disponible: $${playerState?.financials?.cash}
- Cantidad de Activos: ${playerState?.assets?.length || 0}
- Cantidad de Pasivos/Deudas: ${playerState?.liabilities?.length || 0}
- Circuito: ${playerState?.isOnFastTrack ? 'VÍA RÁPIDA' : 'CARRERA DE RATAS'}

Contexto / Tarjeta / Acción:
${context || 'Revisión General del Portafolio'}

Pregunta o Duda del Jugador:
${query || '¿Cuál debería ser mi estrategia financiera inmediata?'}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      advice: response.text || "¡Continúa acumulando activos que produzcan flujo de caja mensual positivo!",
      source: "gemini",
    });
  } catch (error: any) {
    console.error("AI Mentor error:", error);
    return res.status(200).json({
      advice: `💡 **Regla de Oro del Mentor**: Recuerda: Los ricos adquieren activos. La clase media y los pobres adquieren pasivos creyendo que son activos. ¡Sigue multiplicando tu flujo de caja para escapar de la carrera de ratas!`,
      source: "fallback",
    });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function start() {
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
    console.log(`CIFRAFLOW 2050 server running on http://0.0.0.0:${PORT}`);
  });
}

start();
