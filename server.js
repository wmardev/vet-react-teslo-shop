// server.js en la raíz del proyecto
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Compresión GZIP
app.use(compression());

// Servir archivos estáticos desde 'dist'
app.use(
  express.static(path.join(__dirname, "dist"), {
    maxAge: "1y", // Cache largo para estáticos
    etag: true,
  }),
);

// Health check endpoint (para Render)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "teslo-frontend",
    timestamp: new Date().toISOString(),
  });
});

// Todas las rutas van al index.html (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Frontend Vite corriendo en: http://localhost:${port}`);
  console.log(`API URL: ${process.env.VITE_API_URL || "No configurada"}`);
});
