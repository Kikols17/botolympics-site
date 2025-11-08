const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000;
const HOST = '0.0.0.0';
const ROOT = path.join(__dirname, 'dist');
const LOCALES = path.join(__dirname, 'locales'); // <-- new: runtime locales dir

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.wasm': 'application/wasm'
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Internal Server Error');
    }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'public, max-age=0' });
    res.end(data);
  });
}

function serveIndex(res) {
  const indexPath = path.join(ROOT, 'index.html');
  fs.access(indexPath, fs.constants.R_OK, (err) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    sendFile(res, indexPath);
  });
}

const server = http.createServer((req, res) => {
  try {
    const decoded = decodeURI(req.url.split('?')[0]);
    let safe = decoded.replace(/^\/+/, ''); // remove leading slashes
    // Prevent path traversal
    if (safe.includes('..')) {
      res.writeHead(400);
      return res.end('Bad Request');
    }

    // Serve locale JSON files from LOCALES dir if requested (live-editable)
    if (safe.startsWith('locales/')) {
      const rel = safe.replace(/^locales\//, '');
      const filePath = path.join(LOCALES, rel);
      // ensure path remains under LOCALES
      if (!filePath.startsWith(LOCALES)) {
        res.writeHead(400);
        return res.end('Bad Request');
      }
      fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) return sendFile(res, filePath);
        res.writeHead(404);
        return res.end('Not found');
      });
      return;
    }

    let filePath = path.join(ROOT, safe);
    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isDirectory()) {
        // directory -> serve index.html inside it (if any) or fallback to root index
        const idx = path.join(filePath, 'index.html');
        fs.access(idx, fs.constants.R_OK, (ie) => {
          if (!ie) return sendFile(res, idx);
          return serveIndex(res);
        });
        return;
      }
      if (!err && stats.isFile()) {
        return sendFile(res, filePath);
      }
      // not found -> for SPA routes, serve index.html; otherwise 404
      // simple heuristic: treat requests that look like assets (have an extension) as 404
      if (path.extname(filePath)) {
        res.writeHead(404);
        return res.end('Not found');
      }
      return serveIndex(res);
    });
  } catch (e) {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, HOST, () => {
  // no console noise required, but helpful for local debugging
  console.log(`Static server running at http://${HOST}:${PORT} serving ${ROOT} and locales ${LOCALES}`);
});
