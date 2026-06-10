# Plan Kiwi Joven — Next.js

Proyecto del TP de Economía (UADE): landing page, presentación integrada y chatbot con IA.

## Rutas

| Ruta | Qué es |
|---|---|
| `/` | Landing page (3D + animaciones) |
| `/presentacion` | Presentación de 15 diapositivas (flechas, R, F, H, ESC) |
| `/chat` | **Kiwia**, el chatbot del proyecto |
| `/api/chat` | API del chatbot (clasificar → .md → web) |

## Cómo correrlo

```bash
npm install
cp .env.local.example .env.local   # completar las claves
npm run dev                        # http://localhost:3000
```

## Configuración del chatbot (.env.local)

| Variable | Qué es |
|---|---|
| `AI_BASE_URL` | URL base de la API (DeepSeek: `https://api.deepseek.com/v1` · Kimi: `https://api.moonshot.ai/v1`) |
| `AI_API_KEY` | Tu clave de la API del modelo |
| `AI_MODEL` | Nombre del modelo (`deepseek-chat`, `kimi-k2-turbo-preview`, etc.) |
| `TAVILY_API_KEY` | (Opcional) clave de [tavily.com](https://tavily.com) para el paso 3 (búsqueda web). Gratis hasta 1000 búsquedas/mes |
| `NEXT_PUBLIC_SITE_URL` | (Opcional) URL pública del sitio para SEO y la imagen al compartir. En Vercel se resuelve sola |

## Flujo del chatbot

```
Usuario pregunta
  → 1. Clasificar (¿relacionada con el TP?)        [llamada corta al modelo]
       NO → "No está relacionado con el proyecto."
       SÍ ↓
  → 2. Responder usando SOLO data/tp.md            [el modelo responde o devuelve NO_ALCANZA]
       alcanza → respuesta con fuente "📄 Según el TP"
       no alcanza ↓
  → 3. Búsqueda web (Tavily) + respuesta           [fuente "🌐 Búsqueda web"]
```

La base de conocimiento es `data/tp.md` — si actualizan el TP, actualicen ese archivo.

## Deploy

Recomendado **Vercel** (es de los creadores de Next.js): importar el repo, cargar las
variables de entorno y listo. El QR de la última diapositiva se genera solo con el
dominio donde esté publicado el sitio.

> La carpeta `landing/` del directorio padre es la versión estática anterior (respaldo).
