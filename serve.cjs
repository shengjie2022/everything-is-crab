const http = require('http');
const fs = require('fs');
const path = require('path');
const mimes = {'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const server = http.createServer((req, res) => {
  let fp = path.join('.', decodeURIComponent(req.url === '/' ? '/sprite_test.html' : req.url));
  if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
    const ext = path.extname(fp);
    res.writeHead(200, {'Content-Type': mimes[ext]||'application/octet-stream'});
    fs.createReadStream(fp).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found: ' + fp);
  }
});
server.listen(8765, () => console.log('Open http://localhost:8765 in browser'));
