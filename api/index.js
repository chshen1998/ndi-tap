import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import {APP_CONFIG} from './config/config.js'
import {Server} from 'socket.io'
import {handleDisconnect, handleGetPersonData, handleOpenInfoRequest, handleJoinInfoRequest, handleApproveInfoRequest} from './controller/info-request-controller.js'


const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3001",
    },
})

// Server socket listening
io.on("connection", (socket) => {
    console.log("connected " + String(socket.id))

    // After authentication with MyInfo, the server queries SingPass for user's data and caches the user's data 
    // Returns a dataReceived event if successful or a myinfoError event is failed
    socket.on("getPersonData", (authCode, state) => handleGetPersonData(socket, authCode, state))

    // Requester opens a information request which is valid for 120 seconds
    // Returns the IR code and an openedIR event to inform the requester that the info request has been opened 
    // If information request is not approved by a requestee within the 120 seconds, the requester will be sent a timeoutIR event
    socket.on("openIR", () => handleOpenInfoRequest(socket))

    // Requestee joins an open information request with an IR code
    // Returns a joinedIR event if IR exists and sends the requestee his/her information to approve before sending to the IR requester 
    // If there is no existing IR that corresponds to the IR code sent, then returns the requestee an invalidIR event
    socket.on("joinIR", (irCode) => handleJoinInfoRequest(socket, irCode))

    // Requestee approves the information to be sent to the requester
    // Returns an approvedIR event to both requester and requestee along with the requestee's SingPass information
    socket.on("approveIR", (irCode) => handleApproveInfoRequest(io, socket, irCode))

    socket.on("disconnect", () => {
        handleDisconnect(socket)
        console.log("disconnected " + String(socket.id))
    })
})

// Get the environment variables (app info) from the config
app.get('/getEnv', function (req, res) {
    try {  
      if (APP_CONFIG.DEMO_APP_CLIENT_ID == undefined || APP_CONFIG.DEMO_APP_CLIENT_ID == null) {
        res.status(500).send({
          "error": "Missing Client ID"
        });
      } else {
        res.status(200).send({
          "clientId": APP_CONFIG.DEMO_APP_CLIENT_ID,
          "redirectUrl": APP_CONFIG.DEMO_APP_CALLBACK_URL,
          "attributes": APP_CONFIG.DEMO_APP_SCOPES,
          "purpose": APP_CONFIG.DEMO_APP_PURPOSE,
          "environment": APP_CONFIG.ENVIRONMENT,
          "authApiUrl": APP_CONFIG.MYINFO_API_AUTHORISE,
        });
      }
    } catch (error) {
      console.log("Error".red, error);
      res.status(500).send({
        "error": error
      });
    }
  });

httpServer.listen(8000);
