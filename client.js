const express = require('express')
const http = require('http');

const app = express();

const PORT = 9000;

function testConnection() {
    const options = {
        hostname: '127.0.0.1',
        port: 6512,
        path: '/',
        method: 'GET'
    }
    const req = http.request(options, res =>  {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', d => {
            process.stdout.write(d)
        })
    })
    req.on('error', error => {
        console.error(error)
    })
    req.end();
    return true;
}

app.get('/check-server', async (req, res) => {
    const conn = testConnection();
    if(conn) res.send('Connection made to the server and closed');
})





function sendMessageToServer(message) {
    const data = JSON.stringify({
        message: message
    });

    const options = {
        hostname: '127.0.0.1',
        port: 6512,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const req = http.request(options, res =>  {
        console.log(`statusCode: ${res.statusCode}`)
            res.on('data',d => {
                //console.log(d);
                process.stdout.write(d);
                console.log();
            })
    })

    req.on('error', error => {
        //console.log(error.stack);
        console.log();
        console.log("Message blocked")
        
    })
    req.write(data);
    req.end()
}

app.get('/message', (req, res) => {
    const message = req.query.content;
    sendMessageToServer(message);
    return res.send('sent message');
})

app.listen(PORT, () => console.log('client listening on port ', PORT));