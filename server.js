const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000;
const HOST = '0.0.0.0';
const ROOT = path.join(__dirname, 'dist');
const LOCALES = path.join(__dirname, 'locales');
const CONFIG_DIR = path.join(__dirname, 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, 'registrations.json');

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

// make sure config dir exists with default file (the Dockerfile will copy defaults)
if (!fs.existsSync(CONFIG_DIR)) {
  try { fs.mkdirSync(CONFIG_DIR, { recursive: true }); } catch (e) {}
}
if (!fs.existsSync(CONFIG_FILE)) {
  try { fs.writeFileSync(CONFIG_FILE, JSON.stringify({}, null, 2)); } catch (e) {}
}

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const decoded = decodeURI(parsedUrl.pathname.split('?')[0]);
    let safe = decoded.replace(/^\/+/, ''); // remove leading slashes
    // Prevent path traversal
    if (safe.includes('..')) {
      res.writeHead(400);
      return res.end('Bad Request');
    }

    // Gallery listing endpoint: GET /_gallery?dir=/assets/previous
    if (safe === '_gallery' && req.method === 'GET') {
      const dirParam = parsedUrl.query && parsedUrl.query.dir;
      if (!dirParam) { res.writeHead(400); return res.end('Missing dir'); }
      const rel = String(dirParam).replace(/^\/+/, '');
      const abs = path.join(ROOT, rel);
      // ensure the requested directory is inside the ROOT
      if (!abs.startsWith(ROOT)) { res.writeHead(400); return res.end('Bad Request'); }
      fs.stat(abs, (err, stats) => {
        if (err || !stats.isDirectory()) { res.writeHead(404); return res.end('Not found'); }
        fs.readdir(abs, (err2, files) => {
          if (err2) { res.writeHead(500); return res.end('Failed to read dir'); }
          const exts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.bmp']);
          const urls = files
            .filter(f => exts.has(path.extname(f).toLowerCase()))
            .sort()
            .map(f => '/' + path.posix.join(rel, f).replace(/\\/g, '/'));
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify(urls));
        });
      });
      return;
    }

    // Serve locale JSON files from LOCALES dir if requested (live-editable)
    if (safe.startsWith('locales/')) {
      const rel = safe.replace(/^locales\//, '');
      const filePath = path.join(LOCALES, rel);
      if (!filePath.startsWith(LOCALES)) { res.writeHead(400); return res.end('Bad Request'); }
      fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) return sendFile(res, filePath);
        res.writeHead(404); return res.end('Not found');
      });
      return;
    }

    // Serve config file (readable by the client)
    if (safe === '_config/registrations.json') {
      fs.stat(CONFIG_FILE, (err, stats) => {
        if (!err && stats.isFile()) return sendFile(res, CONFIG_FILE);
        res.writeHead(404); return res.end('Not found');
      });
      return;
    }

    // Admin endpoint to update registrations (POST JSON)
    if (safe === '_admin/registrations' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          // payload should be an object mapping ids to "open"|"before"|"after"
          if (typeof payload !== 'object' || Array.isArray(payload) || payload === null) {
            res.writeHead(400); return res.end('Bad payload');
          }
          fs.writeFile(CONFIG_FILE, JSON.stringify(payload, null, 2), (err) => {
            if (err) { res.writeHead(500); return res.end('Failed to write config'); }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ ok: true }));
          });
        } catch (e) {
          res.writeHead(400); return res.end('Invalid JSON');
        }
      });
      return;
    }

    let filePath = path.join(ROOT, safe);
    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isDirectory()) {
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
  console.log(`Static server running at http://${HOST}:${PORT} serving ${ROOT}, locales ${LOCALES}, config ${CONFIG_FILE}`);
});
