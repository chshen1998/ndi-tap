import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import {handleCreateInfoRequest} from './controller/info-request-controller.js'

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

const httpServer = createServer(app)

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/request', handleCreateInfoRequest)

httpServer.listen(8000);
