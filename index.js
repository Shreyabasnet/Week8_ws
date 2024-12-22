import express from 'express';
import http from 'http';

import {WebSocketServer} from 'ws';

import {state} from './model/state.js';

const app = express();

app.get('/', (req, res)=>{
    res.json({message: 'Server Working!'});
})

app.get('/c8', (req, res) =>{
    res.json({message:'this is c8!'});
})

const server = http.createServer(app);

const wss = new WebSocketServer({server: server});

wss.on('connection', (ws)=> {
    ws.on('message', (message) =>{
        console.log(`Received Message = ${message}`);

        const data = JSON.parse(message);
    
    try {
        const data = JSON.parse(message);
        if (data.message==="fetch") {
            ws.send(JSON.stringify(state[0]));
        } else if(data.message === 'update') {
            state[0]= {
                name: data.name,
                state: data.state
            }

            wss.clients.forEach(
                (client) => {
                    client.send(JSON.stringify(
                        state[0]
                    ))
                }
            );
        } else {
            ws.semd(
                JSON.stringify({
                    message: "Unknown Command"
                })
            )
        }
    } catch (error) {
        console.log(error.message);
        ws.send(
            JSON.stringify(
                {
                    message: error.message
                }
            )
        );
    }

    });
});

server.listen(443, ()=> {
    console.log('Server listening on port 443');
});