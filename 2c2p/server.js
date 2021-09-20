import http from 'http';

const hostname = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
    console.log(req.headers['X-Forwarded-For']);
    if (req.method == 'POST') {
        console.log('POST')
        var body = ''
        req.on('data', function (data) {
            body += data
            console.log('Partial body: ' + body)
        })
        req.on('end', function () {
            console.log('Body: ' + body)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end('post received')
        })
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});