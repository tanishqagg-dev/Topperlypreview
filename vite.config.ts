import { defineConfig, type Connect, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { addEmail, getCount } from "./api/waitlist";

function waitlistDevApi(): PluginOption {
  return {
    name: "topperly-waitlist-dev-api",
    apply: "serve",
    configureServer(server) {
      const handler: Connect.NextHandleFunction = async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/waitlist")) return next();
        try {
          if (req.method === "GET") {
            const { status, body } = await getCount();
            res.statusCode = status;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify(body));
            return;
          }
          if (req.method === "POST") {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk as Buffer);
            const raw = Buffer.concat(chunks).toString("utf8") || "{}";
            let parsed: { email?: unknown } = {};
            try {
              parsed = JSON.parse(raw);
            } catch {
              res.statusCode = 400;
              res.setHeader("content-type", "application/json");
              res.end(JSON.stringify({ ok: false, message: "Invalid JSON" }));
              return;
            }
            const { status, body } = await addEmail(parsed.email);
            res.statusCode = status;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify(body));
            return;
          }
          res.statusCode = 405;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ ok: false, message: "Method not allowed" }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("content-type", "application/json");
          res.end(
            JSON.stringify({
              ok: false,
              message: err instanceof Error ? err.message : "Internal error",
            }),
          );
        }
      };
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), waitlistDevApi()],
});
