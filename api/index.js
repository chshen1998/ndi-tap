import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import {Server} from 'socket.io'
import {handleOpenInfoRequest, handleJoinInfoRequest, handleApproveInfoRequest} from './controller/info-request-controller.js'

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World');
});

const httpServer = createServer(app)
const io = new Server(httpServer, {})

io.on("connection", (socket) => {
    console.log("connected " + String(socket.id))

    socket.on("openIR", (requester) => handleOpenInfoRequest(socket, requester))

    socket.on("joinIR", (requestee, irCode) => handleJoinInfoRequest(socket, requestee, irCode))

    socket.on("approveIR", (requestee, irCode) => handleApproveInfoRequest(io, socket, requestee, irCode))

    socket.on("disconnect", () => {
        console.log("disconnected " + String(socket.id))
    })
})

httpServer.listen(8000);
