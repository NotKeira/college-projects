import { Dir } from "fs";
import { readFile } from "fs/promises";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { extname, join } from "path";

const PORT = 3000;
const PUBLIC_DIR = "./public";

const MIME_TYPES: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "impage/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2"
};

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const url = new URL(req.url || "/", `http://${req.headers.host}`);
        let filePath = url.pathname === "/" ? "/index.html" : url.pathname;

        // Future API routes here
        if (filePath.startsWith("/api/")) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "API not implemented yet sorry lol" }));
            return;
        }

        const fullPath = join(PUBLIC_DIR, filePath);
        const ext = extname(filePath);
        const mimeType = MIME_TYPES[ext] || "application/octet-stream";

        const content = await readFile(fullPath);
        res.writeHead(200, { "content-type": mimeType });
        res.end(content);
    } catch (error) {
        res.writeHead(404, { "content-type": "text/html" });
        res.end("<h1>404 - File Not Found</h1>");
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})